
import os
import re
from datetime import datetime

# Blog post template
TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} | Basin & Associates</title>
    <meta name="description" content="{excerpt}">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../../styles.css">
    <link rel="stylesheet" href="../blog.css">
    <!-- Highlight.js for code syntax highlighting -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/atom-one-dark.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js"></script>
    <script>hljs.highlightAll();</script>
</head>
<body class="blog-post-page">
    <nav class="nav-container">
        <div class="nav-content">
            <a href="../../index.html" class="nav-logo">Basin & Associates<span class="logo-globe">🌍</span></a>
            <div class="nav-links">
                <a href="../../index.html">Home</a>
                <a href="../index.html" class="active">Blog</a>
                <a href="../../tools/index.html">Tools</a>
                <a href="https://linkedin.com/in/leonbasin" target="_blank">LinkedIn</a>
            </div>
        </div>
    </nav>

    <main class="post-container">
        <article class="post-content">
            <header class="post-header">
                <div class="post-meta">
                    <span class="post-date">{date}</span>
                    <span class="post-category">{category}</span>
                </div>
                <h1>{title}</h1>
                <div class="post-tags">
                    {tags_html}
                </div>
            </header>

            <div class="post-body">
                {content}
            </div>

            <div class="post-footer">
                <p>Leon Basin is a Revenue Architect building GTM systems for technical founders.</p>
                <div class="share-links">
                    <a href="https://twitter.com/intent/tweet?text={title}&url=https://basinleon.github.io/blog/posts/{slug}.html" target="_blank">Share on X</a>
                    <a href="https://www.linkedin.com/sharing/share-offsite/?url=https://basinleon.github.io/blog/posts/{slug}.html" target="_blank">Share on LinkedIn</a>
                </div>
            </div>
        </article>
    </main>

    <footer class="site-footer">
        <div class="footer-content">
            <p>&copy; 2026 Basin & Associates. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>"""

def md_to_html(md_text):
    # Simple MD to HTML converter (can be improved or use markdown library if available)
    # For now, quick regex replacements for common elements
    html = md_text
    
    # Headers
    html = re.sub(r'^# (.*?)$', r'<h2>\1</h2>', html, flags=re.MULTILINE)
    html = re.sub(r'^## (.*?)$', r'<h3>\1</h3>', html, flags=re.MULTILINE)
    html = re.sub(r'^### (.*?)$', r'<h4>\1</h4>', html, flags=re.MULTILINE)
    html = re.sub(r'^#### (.*?)$', r'<h5>\1</h5>', html, flags=re.MULTILINE)
    
    # Bold
    html = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', html)
    
    # Italic
    html = re.sub(r'\*(.*?)\*', r'<em>\1</em>', html)
    
    # Links
    html = re.sub(r'\[(.*?)\]\((.*?)\)', r'<a href="\2">\1</a>', html)
    
    # Code blocks
    html = re.sub(r'```(.*?)\n(.*?)```', r'<pre><code class="\1">\2</code></pre>', html, flags=re.DOTALL)
    
    # Inline code
    html = re.sub(r'`(.*?)`', r'<code>\1</code>', html)
    
    # Lists
    html = re.sub(r'^\- (.*?)$', r'<li>\1</li>', html, flags=re.MULTILINE)
    # Wrap lists (simple approximation)
    html = re.sub(r'(<li>.*?</li>)', r'<ul>\1</ul>', html, flags=re.DOTALL) # This is too greedy/broken for simple regex, let's just leave li's for now or clean up manually. 
    # Better list handling:
    lines = html.split('\n')
    in_list = False
    new_lines = []
    for line in lines:
        if line.startswith('<li>'):
            if not in_list:
                new_lines.append('<ul>')
                in_list = True
            new_lines.append(line)
        else:
            if in_list:
                new_lines.append('</ul>')
                in_list = False
            new_lines.append(line)
            if line.strip() != '' and not line.startswith('<h') and not line.startswith('<pre'):
                 # Paragraphs for non-empty lines that aren't headers or code
                 new_lines[-1] = f"<p>{line}</p>"

    html = '\n'.join(new_lines)
    
    # Blockquotes
    html = re.sub(r'^> (.*?)$', r'<blockquote>\1</blockquote>', html, flags=re.MULTILINE)

    # Tables (Markdown to HTML table) - Simple logic
    # Find table blocks
    # This is complex for regex, skipping for MVP script, will render as pre-formatted text if needed or just cleaned up.
    
    return html

DRAFTS = [
    {
        "file": "GTM_SAAS_STRATEGY.md",
        "title": "The GTM SaaS Blueprint: From Signal to Revenue",
        "slug": "gtm-saas-blueprint",
        "category": "Strategy",
        "tags": ["GTM", "SaaS", "Revenue Architecture"],
        "date": "2026-01-14"
    },
    {
        "file": "PIPELINE_CLOSING_STRATEGY.md",
        "title": "The Pipeline Closing System: An Engineering Approach",
        "slug": "pipeline-closing-system",
        "category": "Sales Engineering",
        "tags": ["Closing", "Sales", "Process"],
        "date": "2026-01-14"
    },
    {
        "file": "Ambient_GTM_2Pager.md",
        "title": "Case Study: Ambient.ai Signal Architecture",
        "slug": "ambient-signal-architecture",
        "category": "Case Study",
        "tags": ["Ambient.ai", "Signal Architecture", "Case Study"],
        "date": "2026-01-14"
    },
    {
        "file": "Technical Credibility Showcase - GTM Signal Architect.md",
        "title": "Technical Deep Dive: Building the Signal Architect",
        "slug": "signal-architecture-deep-dive",
        "category": "Engineering",
        "tags": ["Python", "Streamlit", "Technical"],
        "date": "2026-01-14"
    },
    {
        "file": "EXPANSION_STRATEGY.md",
        "title": "Expansion Strategy: The Net Dollar Retention Engine",
        "slug": "expansion-revenue-engine",
        "category": "Strategy",
        "tags": ["NDR", "Expansion", "Growth"],
        "date": "2026-01-14"
    }
]

BASE_DIR = "/Users/basin/Desktop/Basin & Associates 🌍"
OUTPUT_DIR = os.path.join(BASE_DIR, "basinleon.github.io/blog/posts")

for draft in DRAFTS:
    md_path = os.path.join(BASE_DIR, draft["file"])
    if not os.path.exists(md_path):
        print(f"Skipping {draft['file']} - not found")
        continue

    with open(md_path, 'r') as f:
        md_content = f.read()
    
    # Extract excerpt (first 150 chars)
    excerpt = md_content[:150].replace('\n', ' ').strip() + "..."
    
    # Convert content
    html_content = md_to_html(md_content)
    
    # Generate Tags HTML
    tags_html = "".join([f'<span class="post-tag">{tag}</span>' for tag in draft["tags"]])

    # Fill template
    full_html = TEMPLATE.format(
        title=draft["title"],
        excerpt=excerpt,
        date=draft["date"],
        category=draft["category"],
        tags_html=tags_html,
        content=html_content,
        slug=draft["slug"]
    )
    
    output_path = os.path.join(OUTPUT_DIR, f"{draft['slug']}.html")
    with open(output_path, 'w') as f:
        f.write(full_html)
    
    print(f"Generated {draft['slug']}.html")
