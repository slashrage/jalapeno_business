# Obsidian to Blog Sync Tool

Automatically sync blog posts from your Obsidian vault to the Jalapeno Blog.

## Overview

This tool watches your Obsidian "Blog Posts" directory for new or modified markdown files and automatically creates or updates blog posts via the API. Write in Obsidian, save, and your blog is updated automatically!

## Features

- 🔄 **Automatic syncing** - Detects file changes in real-time
- 📝 **Markdown support** - Write in standard Markdown format
- 🎯 **YAML frontmatter** - Specify metadata like title, tags, category, status
- ✨ **Auto-generation** - Automatically generates excerpts and slugs if not provided
- 🔗 **Smart mapping** - Tracks which files correspond to which blog posts
- 🚀 **Simple setup** - Just add your auth token and start writing

## Setup

### 1. Get Your Auth Token

First, login to your blog admin panel and get your JWT token:

1. Open your browser's Developer Tools (F12)
2. Go to the Console tab
3. Type: `localStorage.getItem('token')`
4. Copy the token (without quotes)

### 2. Configure Environment

Add your token to the backend `.env` file:

```bash
# Add this line to backend/.env
SYNC_AUTH_TOKEN=your-jwt-token-here
```

### 3. Install Dependencies

Dependencies are already installed if you ran `npm install` in the backend directory. If not:

```bash
cd backend
npm install
```

### 4. Start the Sync Tool

From the backend directory:

```bash
npm run sync
```

You should see:
```
🔍 Obsidian Blog Sync Tool
📁 Watching: /mnt/c/Users/tspae/Documents/Obsidian/Tech Notes/Jalapeno Blog/Blog Posts
🌐 API URL: http://localhost:5000/api

👀 Watching for changes... (Press Ctrl+C to stop)
```

## Writing Blog Posts

### File Format

Create markdown files with YAML frontmatter:

```markdown
---
title: "My Amazing Blog Post"
excerpt: "A short summary of the post"
status: draft
category: "Episode Promo"
tags:
  - spicy food
  - culture
---

# My Amazing Blog Post

Your content goes here...
```

### Frontmatter Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes* | Post title (can also use H1 in content) |
| `excerpt` | string | No | Short summary (auto-generated if omitted) |
| `status` | string | No | Either `draft` or `published` (default: `draft`) |
| `category` | string | No | Post category |
| `tags` | array | No | List of tags |

*If `title` is not in frontmatter, the first H1 (`#`) in the content will be used.

### File Naming

Use this format for file names:
```
YYYY-MM-DD-descriptive-slug.md
```

Examples:
- `2025-10-28-spicy-ramen-review.md`
- `2025-11-01-interview-chef-marco.md`

The date helps keep files organized, but doesn't affect the blog post date (which is set when first published).

### Example Post

See `blog-post-template.md` for a complete example with all features.

## How It Works

1. **File Detection**: The tool watches the Blog Posts directory for `.md` files
2. **Parsing**: When a file is added or changed, it parses the YAML frontmatter and markdown content
3. **API Call**:
   - If it's a new file → creates a new blog post
   - If it's a known file → updates the existing post
4. **Mapping**: Stores the file-to-post ID mapping in `.obsidian-sync-map.json`

## Workflow

### Creating a New Post

1. Make sure the sync tool is running (`npm run sync` in backend directory)
2. In Obsidian, create a new markdown file in the "Blog Posts" folder
3. Add frontmatter and content
4. Save the file
5. Check the sync tool console for confirmation
6. The post is now created as a draft on your blog!

### Updating an Existing Post

1. Open the markdown file in Obsidian
2. Make your changes
3. Save the file
4. The sync tool automatically updates the blog post
5. Check the console for confirmation

### Publishing a Post

To publish a post, update the frontmatter:

```yaml
---
title: "My Post"
status: published  # Change from 'draft' to 'published'
---
```

Save the file, and it will be published automatically!

## Sync Map File

The tool creates a `.obsidian-sync-map.json` file that tracks which files correspond to which blog posts:

```json
{
  "/path/to/2025-10-28-my-post.md": "507f1f77bcf86cd799439011"
}
```

**Important**: Don't delete this file unless you want to re-create all posts (which would create duplicates).

## Troubleshooting

### Authentication Failed

**Error**: `Authentication failed. Please check your SYNC_AUTH_TOKEN`

**Solution**:
1. Make sure you've added `SYNC_AUTH_TOKEN` to `backend/.env`
2. Get a fresh token (tokens expire after 7 days by default)
3. Restart the sync tool

### No Title Found

**Error**: `Error: No title found in frontmatter or content`

**Solution**: Add either:
- A `title` field in frontmatter, OR
- An H1 header (`# Title`) at the start of your content

### Directory Not Found

**Error**: `Error: Directory not found`

**Solution**: Verify the path in `obsidian-sync.js` matches your actual Obsidian vault location

### Port Already in Use

If the backend isn't running on port 5000, update the `API_URL` in `obsidian-sync.js` or add it to `.env`:

```bash
API_URL=http://localhost:YOUR_PORT/api
```

## Tips

1. **Keep the sync tool running** - Leave it running in a terminal while you write
2. **Save frequently** - Each save triggers an update (but that's okay!)
3. **Use drafts** - Keep posts as drafts until you're ready to publish
4. **Check the console** - The sync tool logs all actions for visibility
5. **Back up your vault** - Always have backups of your Obsidian files

## Advanced Usage

### Custom Obsidian Directory

To change the watched directory, edit `OBSIDIAN_DIR` in `obsidian-sync.js`:

```javascript
const OBSIDIAN_DIR = '/path/to/your/obsidian/vault/Blog Posts';
```

### API Configuration

The tool reads these environment variables from `backend/.env`:

```bash
SYNC_AUTH_TOKEN=your-token-here
API_URL=http://localhost:5000/api  # Optional, defaults to localhost:5000
```

## File Structure

```
tools/
├── obsidian-sync.js           # Main sync tool
├── blog-post-template.md      # Example template
├── README.md                  # This file
└── .obsidian-sync-map.json   # Auto-generated mapping file (do not commit)
```

## Running Multiple Instances

You can run the sync tool on multiple machines, but:
- Each machine needs its own auth token
- The sync map is local, so updates might create duplicates
- Best to use one primary machine for syncing

## Security Notes

- **Never commit** your `.env` file or auth tokens to git
- Auth tokens expire based on `JWT_EXPIRE` setting (default: 7 days)
- The sync tool only has access to blog post operations
- Files are read-only from the Obsidian directory

## Support

For issues or questions:
1. Check the sync tool console for error messages
2. Verify the backend is running (`npm run dev`)
3. Ensure your auth token is valid and not expired
4. Check the backend logs for API errors

---

Happy blogging! 🌶️
