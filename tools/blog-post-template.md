---
title: "Your Blog Post Title Goes Here"
excerpt: "A brief excerpt or summary of your post (optional - will be auto-generated if not provided)"
status: draft
category: "Episode Promo"
tags:
  - spicy food
  - culture
  - heritage
---

# Your Blog Post Title Goes Here

Your blog post content starts here. Write using standard Markdown formatting.

## Formatting Examples

You can use:
- **Bold text**
- *Italic text*
- [Links](https://example.com)
- Lists (like this one!)

### Headers

Use headers to organize your content:

```
# H1 - Main title (usually matches frontmatter title)
## H2 - Major sections
### H3 - Subsections
```

## Frontmatter Fields Explained

At the top of each file, include YAML frontmatter between `---` markers:

- **title** (required): The post title
- **excerpt** (optional): A short summary. If not provided, one will be auto-generated from your content
- **status** (optional): Either `draft` or `published` (defaults to `draft`)
- **category** (optional): A category for your post
- **tags** (optional): Array of tags for categorization

## File Naming Convention

Name your files with this pattern:
```
YYYY-MM-DD-descriptive-slug.md
```

Examples:
- `2025-10-28-spicy-ramen-adventure.md`
- `2025-11-01-interview-with-chef-marco.md`

## Tips for Writing

1. **Keep it conversational** - Write like you're talking to a friend
2. **Use headers** - Break up long content with H2 and H3 headers
3. **Add personality** - Emojis are fine! 🌶️
4. **Tell stories** - Personal anecdotes make posts engaging
5. **Save frequently** - The sync tool will detect changes automatically

## What Happens When You Save

When you save this file in the Obsidian "Blog Posts" directory:
1. The sync tool detects the change
2. It parses the frontmatter and content
3. It creates or updates the blog post via the API
4. You'll see confirmation in the sync tool console

Happy blogging! 🎉
