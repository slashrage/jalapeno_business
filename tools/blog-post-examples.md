# Blog Post Format Examples

This document shows the different ways you can format blog posts for the Obsidian sync tool.

---

## Example 1: Absolute Minimum (No Frontmatter)

The simplest valid blog post - just a title and content:

```markdown
# My Blog Post Title

This is the content of my blog post.

You can write multiple paragraphs, use **bold** and *italic* text, add links, etc.

The sync tool will:
- Extract "My Blog Post Title" as the title
- Generate an excerpt from this content
- Set status to "draft"
- Leave category and tags empty
```

**Result:**
- ✅ Title: "My Blog Post Title"
- ✅ Status: draft
- ✅ Excerpt: Auto-generated
- ✅ Category: (none)
- ✅ Tags: (none)

---

## Example 2: Minimum with Frontmatter

Add frontmatter for a cleaner structure:

```markdown
---
title: "My Blog Post Title"
---

This is the content of my blog post.

You can write multiple paragraphs, use **bold** and *italic* text, add links, etc.
```

**Result:**
- ✅ Title: "My Blog Post Title"
- ✅ Status: draft
- ✅ Excerpt: Auto-generated
- ✅ Category: (none)
- ✅ Tags: (none)

---

## Example 3: Recommended Format (All Fields)

This is the recommended format with all available fields:

```markdown
---
title: "When Pakistani Spice Meets Chicago Heat"
excerpt: "A first-generation American's journey navigating Pakistani cuisine in Chicago's food scene"
status: draft
category: "Episode Promo"
tags:
  - spicy food
  - culture
  - heritage
  - first-generation
---

# When Pakistani Spice Meets Chicago Heat

Your blog post content starts here.

## Subheadings Help Structure

You can use H2 and H3 headers to organize your content.

### Even Smaller Headers

Content is all standard Markdown.
```

**Result:**
- ✅ Title: "When Pakistani Spice Meets Chicago Heat"
- ✅ Status: draft
- ✅ Excerpt: Custom excerpt provided
- ✅ Category: "Episode Promo"
- ✅ Tags: [spicy food, culture, heritage, first-generation]

---

## Example 4: Published Post

To publish a post immediately, set `status: published`:

```markdown
---
title: "My Published Post"
status: published
category: "News"
tags:
  - announcement
---

# My Published Post

This post will be published immediately when synced!
```

**Result:**
- ✅ Title: "My Published Post"
- ✅ Status: **published** (visible on blog)
- ✅ Excerpt: Auto-generated
- ✅ Category: "News"
- ✅ Tags: [announcement]

---

## Example 5: Draft to Published

You can change a draft to published by editing the frontmatter:

**Original:**
```markdown
---
title: "My Post"
status: draft
---

Content here...
```

**Updated (to publish):**
```markdown
---
title: "My Post"
status: published  # Changed from draft
---

Content here...
```

When you save, the sync tool will update the post status to published!

---

## Field Reference

### Required
- **title** (string) - Either in frontmatter OR as first H1 in content

### Optional
- **excerpt** (string) - Short summary; auto-generated if not provided
- **status** (string) - Either `draft` or `published`; defaults to `draft`
- **category** (string) - Any category name; defaults to empty
- **tags** (array) - List of tags; defaults to empty array

---

## Tips

1. **Start with minimum** - Just title and content is fine!
2. **Add fields gradually** - Add status, category, tags as needed
3. **Use drafts first** - Keep posts as draft until ready to publish
4. **Custom excerpts** - Write your own if auto-generated isn't good enough
5. **Tags as array** - Use YAML array format (lines starting with `-`)

---

## File Naming

Name your files like this:
```
YYYY-MM-DD-descriptive-slug.md
```

Examples:
- `2025-10-30-my-first-post.md`
- `2025-11-01-spicy-ramen-review.md`
- `2025-11-15-interview-chef-marco.md`

The date helps organize files but doesn't affect the post's published date.

---

## Quick Start

**To create your first post:**

1. Copy this into a new file in your Blog Posts folder:

```markdown
---
title: "My First Blog Post"
status: draft
---

# My First Blog Post

This is my first blog post created with the Obsidian sync tool!

I can write in Markdown, and it will automatically sync to my blog.
```

2. Save the file
3. Check the sync tool console for confirmation
4. View it in your admin dashboard!

That's it! 🎉
