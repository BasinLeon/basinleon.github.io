#!/usr/bin/env python3
"""
Batch update all blog posts to include new CSS and JS features.
Run from: basinleon.github.io directory
Usage: python3 scripts/update-blog-posts.py
"""

import os
import re
from pathlib import Path

POSTS_DIR = Path("blog/posts")

# New CSS and JS to inject
NEW_CSS = '<link rel="stylesheet" href="../css/blog.css">'
NEW_JS = '''
    <script src="../js/blog-features.js"></script>
    <script src="../js/blog-search.js"></script>
'''

# Reading progress bar HTML
PROGRESS_BAR = '<div class="reading-progress" id="reading-progress"></div>'

def update_post(filepath):
    """Update a single blog post with new CSS/JS."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modified = False
    
    # Add blog.css if not present
    if 'blog.css' not in content and '</head>' in content:
        content = content.replace('</head>', f'    {NEW_CSS}\n</head>')
        modified = True
    
    # Add blog-features.js if not present
    if 'blog-features.js' not in content and '</body>' in content:
        content = content.replace('</body>', f'{NEW_JS}\n</body>')
        modified = True
    
    # Add reading progress bar if not present
    if 'reading-progress' not in content and '<body' in content:
        # Insert after opening body tag
        content = re.sub(
            r'(<body[^>]*>)',
            f'\\1\n    {PROGRESS_BAR}',
            content
        )
        modified = True
    
    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    if not POSTS_DIR.exists():
        print(f"Error: {POSTS_DIR} not found. Run from basinleon.github.io directory.")
        return
    
    posts = list(POSTS_DIR.glob("*.html"))
    print(f"Found {len(posts)} blog posts")
    
    updated = 0
    for post in posts:
        if update_post(post):
            updated += 1
            print(f"  ✓ Updated: {post.name}")
        else:
            print(f"  - Skipped: {post.name} (already updated)")
    
    print(f"\nDone! Updated {updated}/{len(posts)} posts.")

if __name__ == "__main__":
    main()
