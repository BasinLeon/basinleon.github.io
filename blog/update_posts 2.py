#!/usr/bin/env python3
"""
Batch update all blog posts with:
- Blog Analytics tracking
- Related Posts injection
- NEXUS Intelligence chatbot
"""

import os
import json
import re
from pathlib import Path

POSTS_DIR = Path(__file__).parent / "posts"
POSTS_JSON = Path(__file__).parent.parent / "data" / "posts.json"

# Load posts data to get tags
def load_posts_metadata():
    if POSTS_JSON.exists():
        with open(POSTS_JSON, 'r') as f:
            posts = json.load(f)
            # Create a mapping of URL to tags
            return {p['url']: p.get('tags', []) for p in posts if p.get('url') and p['url'] != '#'}
    return {}

# Script template to inject
SCRIPT_TEMPLATE = '''
    <!-- Blog Analytics & Related Posts -->
    <script src="../js/blog-analytics.js"></script>
    <script>
        const currentTags = {tags_json};
        const currentUrl = '{current_url}';
        
        document.addEventListener('DOMContentLoaded', function() {{
            if (window.BlogAnalytics) {{
                window.BlogAnalytics.injectRelatedPosts('.post-content', currentTags, currentUrl);
            }}
        }});
    </script>

    <!-- NEXUS Intelligence Bot -->
    <script src="../../widgets/leon-logic-bot.js"></script>
</body>
'''

def update_post(html_file: Path, posts_metadata: dict):
    """Update a single post file with analytics and related posts"""
    
    content = html_file.read_text()
    
    # Check if already updated
    if 'blog-analytics.js' in content:
        return False
    
    # Get the URL for this post
    relative_url = f"posts/{html_file.name}"
    tags = posts_metadata.get(relative_url, ['Archive'])
    
    # Ensure we have at least one tag
    if not tags:
        tags = ['Archive']
    
    tags_json = json.dumps(tags[:3])  # Limit to 3 tags
    
    # Find </body> and inject before it
    if '</body>' in content:
        new_script = SCRIPT_TEMPLATE.format(
            tags_json=tags_json,
            current_url=relative_url
        )
        
        # Remove the existing </body> and add our script with </body>
        content = content.replace('</body>', new_script)
        
        html_file.write_text(content)
        return True
    
    return False

def main():
    print("🔄 Loading posts metadata...")
    posts_metadata = load_posts_metadata()
    print(f"   Found {len(posts_metadata)} posts with metadata")
    
    print("\n📝 Updating post files...")
    updated = 0
    skipped = 0
    
    for html_file in sorted(POSTS_DIR.glob("*.html")):
        if update_post(html_file, posts_metadata):
            print(f"   ✅ {html_file.name}")
            updated += 1
        else:
            print(f"   ⏭️  {html_file.name} (already updated)")
            skipped += 1
    
    print(f"\n✨ Done! Updated {updated} posts, skipped {skipped}")

if __name__ == "__main__":
    main()
