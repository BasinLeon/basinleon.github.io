#!/usr/bin/env python3
"""
Add Social Sharing Buttons to All Blog Posts
This script manually adds social sharing HTML to all blog post files.
"""

import os
import re
from pathlib import Path

# Social sharing HTML snippet
SOCIAL_SHARING_HTML = '''
    <!-- Social Sharing Buttons -->
    <div class="social-share-container">
        <span class="social-share-label">Share:</span>
        <a href="#" class="social-share-btn twitter" onclick="shareToTwitter(event)">🐦 Twitter</a>
        <a href="#" class="social-share-btn linkedin" onclick="shareToLinkedIn(event)">💼 LinkedIn</a>
        <a href="#" class="social-share-btn facebook" onclick="shareToFacebook(event)">📘 Facebook</a>
        <a href="#" class="social-share-btn copy" onclick="copyArticleLink(event)">📋 Copy Link</a>
    </div>
'''

# Social sharing CSS
SOCIAL_SHARING_CSS = '''
        <style>
            .social-share-container {
                margin: 32px 0;
                padding: 24px;
                border-top: 1px solid rgba(212, 175, 55, 0.2);
                border-bottom: 1px solid rgba(212, 175, 55, 0.2);
                display: flex;
                align-items: center;
                gap: 16px;
                flex-wrap: wrap;
            }
            .social-share-label {
                color: var(--text-secondary, #8b8573);
                font-family: 'Orbitron', sans-serif;
                font-size: 0.75rem;
                letter-spacing: 1px;
                text-transform: uppercase;
            }
            .social-share-btn {
                padding: 8px 16px;
                background: rgba(212, 175, 55, 0.1);
                border: 1px solid rgba(212, 175, 55, 0.3);
                border-radius: 6px;
                color: var(--gold-primary, #D4AF37);
                text-decoration: none;
                font-size: 0.85rem;
                font-family: 'JetBrains Mono', monospace;
                transition: all 0.3s ease;
                cursor: pointer;
            }
            .social-share-btn:hover {
                background: rgba(212, 175, 55, 0.2);
                border-color: var(--gold-primary, #D4AF37);
                transform: translateY(-2px);
            }
        </style>
'''

# Social sharing JavaScript
SOCIAL_SHARING_JS = '''
    <script>
        function shareToTwitter(event) {
            event.preventDefault();
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);
            window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank', 'width=550,height=420');
            if (typeof gtag === 'function') {
                gtag('event', 'share', { method: 'twitter', content_type: 'article' });
            }
        }
        
        function shareToLinkedIn(event) {
            event.preventDefault();
            const url = encodeURIComponent(window.location.href);
            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'width=550,height=420');
            if (typeof gtag === 'function') {
                gtag('event', 'share', { method: 'linkedin', content_type: 'article' });
            }
        }
        
        function shareToFacebook(event) {
            event.preventDefault();
            const url = encodeURIComponent(window.location.href);
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=550,height=420');
            if (typeof gtag === 'function') {
                gtag('event', 'share', { method: 'facebook', content_type: 'article' });
            }
        }
        
        function copyArticleLink(event) {
            event.preventDefault();
            const url = window.location.href;
            navigator.clipboard.writeText(url).then(() => {
                const btn = event.target;
                const originalText = btn.textContent;
                btn.textContent = '✓ Copied!';
                setTimeout(() => {
                    btn.textContent = originalText;
                }, 2000);
            });
            if (typeof gtag === 'function') {
                gtag('event', 'share', { method: 'copy', content_type: 'article' });
            }
        }
    </script>
'''

def find_insertion_point(content):
    """Find where to insert social sharing (before back-link or before </article>)"""
    # Look for back-link first
    back_link_pattern = r'(<a[^>]*class="[^"]*back-link[^"]*"[^>]*>.*?</a>)'
    match = re.search(back_link_pattern, content, re.IGNORECASE | re.DOTALL)
    if match:
        return match.start()
    
    # Look for </article> tag
    article_end = content.find('</article>')
    if article_end != -1:
        return article_end
    
    # Look for </body> as last resort
    body_end = content.find('</body>')
    if body_end != -1:
        return body_end
    
    return -1

def has_social_sharing(content):
    """Check if social sharing already exists"""
    return 'social-share-container' in content or 'social-share-btn' in content

def add_social_sharing_to_file(file_path):
    """Add social sharing to a single HTML file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Skip if already has social sharing
        if has_social_sharing(content):
            return False, 'Already has social sharing'
        
        # Find insertion point
        insert_pos = find_insertion_point(content)
        if insert_pos == -1:
            return False, 'Could not find insertion point'
        
        # Insert social sharing HTML
        content = content[:insert_pos] + SOCIAL_SHARING_HTML + content[insert_pos:]
        
        # Add CSS if not in head
        if 'social-share-container' not in content and '</style>' in content:
            # Find last </style> tag
            style_end = content.rfind('</style>')
            if style_end != -1:
                content = content[:style_end] + SOCIAL_SHARING_CSS + content[style_end:]
        
        # Add JS if not before </body>
        if 'shareToTwitter' not in content and '</body>' in content:
            body_end = content.rfind('</body>')
            if body_end != -1:
                content = content[:body_end] + SOCIAL_SHARING_JS + content[body_end:]
        
        # Write back
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        return True, 'Added social sharing'
    
    except Exception as e:
        return False, f'Error: {str(e)}'

def main():
    """Main function"""
    base_path = Path(__file__).parent.parent
    posts_dir = base_path / 'blog' / 'posts'
    
    if not posts_dir.exists():
        print(f"Error: {posts_dir} not found")
        return
    
    html_files = list(posts_dir.glob('*.html'))
    print(f"Found {len(html_files)} HTML files in {posts_dir}\n")
    
    success_count = 0
    skip_count = 0
    error_count = 0
    
    for html_file in html_files:
        success, message = add_social_sharing_to_file(html_file)
        if success:
            print(f"✅ {html_file.name}: {message}")
            success_count += 1
        elif 'Already' in message:
            print(f"⏭️  {html_file.name}: {message}")
            skip_count += 1
        else:
            print(f"❌ {html_file.name}: {message}")
            error_count += 1
    
    print(f"\n{'='*60}")
    print(f"Summary:")
    print(f"  ✅ Added: {success_count}")
    print(f"  ⏭️  Skipped: {skip_count}")
    print(f"  ❌ Errors: {error_count}")
    print(f"{'='*60}")

if __name__ == '__main__':
    main()
