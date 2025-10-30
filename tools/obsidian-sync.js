#!/usr/bin/env node

/**
 * Obsidian to Blog Sync Tool
 *
 * Watches the Obsidian "Blog Posts" directory for new or modified markdown files
 * and automatically syncs them to the Jalapeno Blog via the API.
 *
 * File Format:
 * - Files should have YAML frontmatter with metadata
 * - Content below frontmatter will be used as post body
 * - Files should follow naming: YYYY-MM-DD-slug.md
 */

const path = require('path');
const fs = require('fs').promises;

// Resolve modules from backend directory
const backendDir = path.join(__dirname, '../backend');
const chokidar = require(path.join(backendDir, 'node_modules/chokidar'));
const matter = require(path.join(backendDir, 'node_modules/gray-matter'));
const axiosModule = require(path.join(backendDir, 'node_modules/axios'));
const axios = axiosModule.default || axiosModule;
require(path.join(backendDir, 'node_modules/dotenv')).config({ path: path.join(backendDir, '.env') });

// Configuration
const OBSIDIAN_DIR = '/mnt/c/Users/tspae/Documents/Obsidian/Tech Notes/Jalapeno Blog/Blog Posts';
const API_URL = process.env.API_URL || 'http://localhost:5000/api';
const SYNC_MAP_FILE = path.join(__dirname, '.obsidian-sync-map.json');

// Store mapping of file paths to post IDs
let syncMap = {};

// Load sync map from file
async function loadSyncMap() {
  try {
    const data = await fs.readFile(SYNC_MAP_FILE, 'utf8');
    syncMap = JSON.parse(data);
    console.log(`📋 Loaded sync map with ${Object.keys(syncMap).length} entries`);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error('Error loading sync map:', error.message);
    }
    syncMap = {};
  }
}

// Save sync map to file
async function saveSyncMap() {
  try {
    await fs.writeFile(SYNC_MAP_FILE, JSON.stringify(syncMap, null, 2));
  } catch (error) {
    console.error('Error saving sync map:', error.message);
  }
}

// Get auth token from environment or prompt
function getAuthToken() {
  const token = process.env.SYNC_AUTH_TOKEN;
  if (!token) {
    console.error('❌ Error: SYNC_AUTH_TOKEN not set in environment');
    console.error('Please login to your blog and add your token to .env:');
    console.error('SYNC_AUTH_TOKEN=your-jwt-token-here');
    process.exit(1);
  }
  return token;
}

// Parse markdown file
async function parseMarkdownFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const { data: frontmatter, content: markdown } = matter(content);

    // Extract filename for slug generation
    const filename = path.basename(filePath, '.md');

    return {
      frontmatter,
      content: markdown.trim(),
      filename
    };
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error.message);
    return null;
  }
}

// Create or update blog post
async function syncPost(filePath) {
  try {
    console.log(`\n🔄 Processing: ${path.basename(filePath)}`);

    const parsed = await parseMarkdownFile(filePath);
    if (!parsed) return;

    const { frontmatter, content, filename } = parsed;

    // Build post data
    const postData = {
      title: frontmatter.title || extractTitleFromContent(content),
      content: content,
      excerpt: frontmatter.excerpt || generateExcerpt(content),
      status: frontmatter.status || 'draft',
      category: frontmatter.category || '',
      tags: frontmatter.tags || []
    };

    // Validate required fields
    if (!postData.title) {
      console.error('❌ Error: No title found in frontmatter or content');
      return;
    }

    const token = getAuthToken();
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    // Check if this file has been synced before
    const existingPostId = syncMap[filePath];

    if (existingPostId) {
      // Update existing post
      console.log(`📝 Updating existing post (ID: ${existingPostId})...`);
      const response = await axios.put(
        `${API_URL}/posts/${existingPostId}`,
        postData,
        config
      );
      console.log(`✅ Post updated successfully: "${postData.title}"`);
      console.log(`   Slug: ${response.data.data.slug}`);
      console.log(`   Status: ${response.data.data.status}`);
    } else {
      // Create new post
      console.log(`📝 Creating new post...`);
      const response = await axios.post(
        `${API_URL}/posts`,
        postData,
        config
      );
      const postId = response.data.data._id;

      // Store mapping
      syncMap[filePath] = postId;
      await saveSyncMap();

      console.log(`✅ Post created successfully: "${postData.title}"`);
      console.log(`   ID: ${postId}`);
      console.log(`   Slug: ${response.data.data.slug}`);
      console.log(`   Status: ${response.data.data.status}`);
    }
  } catch (error) {
    console.error('❌ Error syncing post:', error.response?.data?.message || error.message);
    if (error.response?.status === 401) {
      console.error('   Authentication failed. Please check your SYNC_AUTH_TOKEN');
    }
  }
}

// Extract title from first H1 in content
function extractTitleFromContent(content) {
  const h1Match = content.match(/^#\s+(.+)$/m);
  return h1Match ? h1Match[1].trim() : null;
}

// Generate excerpt from content
function generateExcerpt(content, maxLength = 200) {
  // Remove markdown formatting
  let text = content
    .replace(/^#+\s+/gm, '') // Remove headers
    .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.+?)\*/g, '$1') // Remove italic
    .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Remove links
    .replace(/^[-*]\s+/gm, '') // Remove list markers
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim();

  if (text.length > maxLength) {
    text = text.substring(0, maxLength).trim() + '...';
  }

  return text;
}

// Initialize file watcher
async function startWatcher() {
  await loadSyncMap();

  console.log('🔍 Obsidian Blog Sync Tool');
  console.log('📁 Watching:', OBSIDIAN_DIR);
  console.log('🌐 API URL:', API_URL);
  console.log('');

  // Verify directory exists
  try {
    await fs.access(OBSIDIAN_DIR);
  } catch (error) {
    console.error(`❌ Error: Directory not found: ${OBSIDIAN_DIR}`);
    process.exit(1);
  }

  const watcher = chokidar.watch(OBSIDIAN_DIR, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
    ignoreInitial: false,
    awaitWriteFinish: {
      stabilityThreshold: 2000,
      pollInterval: 100
    }
  });

  watcher
    .on('add', filePath => {
      if (path.extname(filePath) === '.md') {
        syncPost(filePath);
      }
    })
    .on('change', filePath => {
      if (path.extname(filePath) === '.md') {
        syncPost(filePath);
      }
    })
    .on('error', error => console.error('Watcher error:', error));

  console.log('👀 Watching for changes... (Press Ctrl+C to stop)\n');
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n\n👋 Shutting down sync tool...');
  await saveSyncMap();
  process.exit(0);
});

// Start the tool
startWatcher().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
