# Blog Publishing Guide for basinleon.github.io

## Overview
Your blog is now fully set up for publishing articles that will be:
- ✅ Indexed on search engines
- ✅ Distributed via RSS feed (feed.xml)
- ✅ Searchable on your blog archive
- ✅ Linked from your main portfolio

---

## Publishing New Articles

### Step 1: Create Your Article HTML
Create a new `.html` file in `/blog/` or `/blog/posts/` directory.

**Use this template:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[YOUR TITLE] - Leon Basin Blog</title>
    <meta name="description" content="[YOUR DESCRIPTION - 160 chars max]">
    <meta name="keywords" content="[KEYWORDS, COMMA, SEPARATED]">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://basinleon.github.io/blog/[YOUR-FILE].html">
    
    <!-- Open Graph for Social Sharing -->
    <meta property="og:title" content="[YOUR TITLE]">
    <meta property="og:description" content="[YOUR DESCRIPTION]">
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://basinleon.github.io/blog/[YOUR-FILE].html">
    <meta property="article:published_time" content="[YYYY-MM-DD]">
    <meta property="article:author" content="Leon Basin">
    
    <link rel="stylesheet" href="../styles.css">
</head>
<body>
    <!-- Article content here -->
</body>
</html>
```

### Step 2: Add to posts.json
Update `/data/posts.json` to include your article at the TOP (most recent first):

```json
{
    "title": "Your Article Title",
    "date": "2026-01-21",
    "tags": ["Tag1", "Tag2", "Tag3"],
    "excerpt": "Brief description (150-200 chars)",
    "url": "your-file.html",  // or "posts/your-file.html"
    "category": "Blog"
}
```

### Step 3: Update RSS Feed
Add to `/feed.xml` (before other items):

```xml
<item>
    <title>Your Article Title</title>
    <link>https://basinleon.github.io/blog/your-file.html</link>
    <guid isPermaLink="true">https://basinleon.github.io/blog/your-file.html</guid>
    <pubDate>Tue, 21 Jan 2026 00:00:00 GMT</pubDate>
    <author>leon@basinleon.github.io</author>
    <category>Tag1</category>
    <category>Tag2</category>
    <description>Your description</description>
</item>
```

### Step 4: Update Sitemap (Optional but Recommended)
Add to `/sitemap.xml`:

```xml
<url>
    <loc>https://basinleon.github.io/blog/your-file.html</loc>
    <lastmod>2026-01-21</lastmod>
    <changefreq>never</changefreq>
    <priority>0.8</priority>
</url>
```

### Step 5: Deploy
Push to GitHub:
```bash
git add .
git commit -m "🚀 Publish: Your Article Title"
git push
```

---

## Article Structure Best Practices

### For SEO & Indexing:
1. **Title**: Clear, keyword-rich (50-60 chars)
2. **Meta Description**: 150-160 characters
3. **Headings**: Use H2 and H3 for structure
4. **Keywords**: Include in first 100 words
5. **Internal Links**: Link to other posts/portfolio
6. **Images**: Add og:image meta tag for social sharing

### For Blog Display:
- Keep titles under 65 characters for index view
- Excerpts: 120-150 characters
- Tags: 3-5 tags per article
- Date format: YYYY-MM-DD

---

## Example: Your Recent Article

Your "AI-Powered Lead Scoring" article is already published:

- **File**: `/blog/ai-powered-lead-scoring.html`
- **posts.json**: ✅ Added
- **feed.xml**: ✅ Added
- **Main index**: ✅ Navigation link added
- **Sitemap**: ✅ Added

**Access it at**: https://basinleon.github.io/blog/ai-powered-lead-scoring.html

---

## Blog Features Enabled

### 🔍 Search
- Real-time search across all articles
- Searches titles, tags, and excerpts
- Works on `/blog/index.html`

### 📰 RSS Feed
- **URL**: https://basinleon.github.io/feed.xml
- Automatically indexed by blog aggregators
- Subscribers: 402+

### 🗂️ Categories
Your blog sidebar supports filtering by:
- GTM
- Revenue
- AI
- Cybersecurity
- Creative
- Sales
- Python
- Philosophy
- And more...

### 📊 Analytics Built-in
- View counts tracked
- Signal integrity monitoring
- Archive search capability

---

## Indexing & Distribution

### Automatically Indexed:
- ✅ Google Search
- ✅ RSS Readers (Feedly, Apple News+, etc.)
- ✅ Blog Aggregators (Dev.to cross-post potential)
- ✅ Sitemap for crawlers

### To Manually Promote:
1. Submit RSS to: https://blogtrottr.com/
2. Share on LinkedIn (add canonical URL)
3. Cross-post to Dev.to (set canonical back to your site)
4. Share in relevant Slack communities

---

## Quick Publishing Checklist

- [ ] Article written & saved as HTML
- [ ] Meta tags filled (title, description, keywords)
- [ ] Image for og:image added
- [ ] Added to `/data/posts.json` (top of array)
- [ ] Added to `/feed.xml` (top of items)
- [ ] Added to `/sitemap.xml` (if important)
- [ ] Navigation link added (if needed)
- [ ] Pushed to GitHub
- [ ] Verified on https://basinleon.github.io/blog/

---

## Questions?

Your blog is production-ready. Start writing!

**Next Article Ideas:**
- Building GTM Systems That Scale
- Signal Architecture Deep Dive
- Revenue Ops Best Practices
- Python Tools for Sales
