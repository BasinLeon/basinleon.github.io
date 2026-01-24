#!/usr/bin/env python3
"""
Comprehensive Site Audit Script
Checks OG tags, internal linking, and site connectivity
"""

import re
from pathlib import Path
from collections import defaultdict

def check_og_tags(html_content, file_path):
    """Check if page has proper OG tags for sharing"""
    issues = []
    
    required_tags = {
        'og:title': r'<meta\s+property=["\']og:title["\']\s+content=["\']([^"\']+)["\']',
        'og:description': r'<meta\s+property=["\']og:description["\']\s+content=["\']([^"\']+)["\']',
        'og:image': r'<meta\s+property=["\']og:image["\']\s+content=["\']([^"\']+)["\']',
        'og:url': r'<meta\s+property=["\']og:url["\']\s+content=["\']([^"\']+)["\']',
    }
    
    for tag_name, pattern in required_tags.items():
        match = re.search(pattern, html_content, re.IGNORECASE)
        if not match:
            issues.append(f"Missing {tag_name}")
        elif not match.group(1).strip():
            issues.append(f"Empty {tag_name}")
    
    return issues

def check_internal_links(html_content, file_path, base_path):
    """Check internal links point to valid files"""
    issues = []
    links = re.findall(r'href=["\']([^"\']+)["\']', html_content)
    
    for link in links:
        # Skip external links
        if link.startswith('http://') or link.startswith('https://'):
            if 'basinleon.github.io' not in link:
                continue
        
        # Skip anchors and javascript
        if link.startswith('#') or link.startswith('javascript:'):
            continue
        
        # Skip mailto and tel
        if link.startswith('mailto:') or link.startswith('tel:'):
            continue
        
        # Convert URL to file path
        if link.startswith('/'):
            link = link[1:]
        
        # Remove query strings and anchors
        link = link.split('?')[0].split('#')[0]
        
        # Check if file exists
        if link.endswith('/'):
            link += 'index.html'
        elif not link.endswith('.html'):
            link += '.html'
        
        target_path = base_path / link
        
        if not target_path.exists():
            issues.append(f"Broken link: {link}")
    
    return issues

def audit_site():
    base_path = Path(__file__).parent.parent
    html_files = list(base_path.rglob('*.html'))
    
    # Filter out backups
    html_files = [f for f in html_files if 'backup' not in str(f).lower() and ' 2.html' not in str(f)]
    
    results = {
        'total_files': len(html_files),
        'og_tags_ok': 0,
        'og_tags_issues': defaultdict(list),
        'broken_links': defaultdict(list),
        'files_with_issues': set()
    }
    
    print(f"🔍 Auditing {len(html_files)} HTML files...\n")
    
    for html_file in html_files:
        try:
            content = html_file.read_text(encoding='utf-8')
            
            # Check OG tags
            og_issues = check_og_tags(content, html_file)
            if og_issues:
                results['og_tags_issues'][str(html_file.relative_to(base_path))] = og_issues
                results['files_with_issues'].add(str(html_file.relative_to(base_path)))
            else:
                results['og_tags_ok'] += 1
            
            # Check internal links
            link_issues = check_internal_links(content, html_file, base_path)
            if link_issues:
                results['broken_links'][str(html_file.relative_to(base_path))] = link_issues
                results['files_with_issues'].add(str(html_file.relative_to(base_path)))
        
        except Exception as e:
            print(f"❌ Error reading {html_file}: {e}")
    
    # Print results
    print(f"✅ Files with proper OG tags: {results['og_tags_ok']}/{results['total_files']}")
    print(f"⚠️  Files with OG tag issues: {len(results['og_tags_issues'])}")
    print(f"⚠️  Files with broken links: {len(results['broken_links'])}")
    
    if results['og_tags_issues']:
        print("\n📋 OG Tag Issues:")
        for file, issues in list(results['og_tags_issues'].items())[:10]:
            print(f"  {file}: {', '.join(issues)}")
        if len(results['og_tags_issues']) > 10:
            print(f"  ... and {len(results['og_tags_issues']) - 10} more")
    
    if results['broken_links']:
        print("\n🔗 Broken Links:")
        for file, links in list(results['broken_links'].items())[:10]:
            print(f"  {file}: {', '.join(links[:3])}")
        if len(results['broken_links']) > 10:
            print(f"  ... and {len(results['broken_links']) - 10} more")
    
    return results

if __name__ == '__main__':
    audit_site()
