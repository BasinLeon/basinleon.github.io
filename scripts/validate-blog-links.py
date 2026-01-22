#!/usr/bin/env python3
"""
Blog Link Validator
Validates all blog post links in posts.json against actual files.
Checks for broken links, missing files, and inconsistencies.
"""

import json
import os
import sys
from pathlib import Path
from urllib.parse import urlparse
import re

# Colors for terminal output
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    RESET = '\033[0m'
    BOLD = '\033[1m'

def print_success(msg):
    print(f"{Colors.GREEN}✓{Colors.RESET} {msg}")

def print_error(msg):
    print(f"{Colors.RED}✗{Colors.RESET} {msg}")

def print_warning(msg):
    print(f"{Colors.YELLOW}⚠{Colors.RESET} {msg}")

def print_info(msg):
    print(f"{Colors.BLUE}ℹ{Colors.RESET} {msg}")

def validate_posts_json():
    """Validate posts.json file exists and is valid JSON."""
    script_dir = Path(__file__).parent
    repo_root = script_dir.parent
    posts_json = repo_root / 'data' / 'posts.json'
    
    if not posts_json.exists():
        print_error(f"posts.json not found at {posts_json}")
        return None
    
    try:
        with open(posts_json, 'r', encoding='utf-8') as f:
            posts = json.load(f)
        print_success(f"Loaded {len(posts)} posts from posts.json")
        return posts, repo_root
    except json.JSONDecodeError as e:
        print_error(f"Invalid JSON in posts.json: {e}")
        return None
    except Exception as e:
        print_error(f"Error reading posts.json: {e}")
        return None

def get_actual_post_files(repo_root):
    """Get list of actual HTML files in blog/posts directory."""
    posts_dir = repo_root / 'blog' / 'posts'
    
    if not posts_dir.exists():
        print_warning(f"blog/posts directory not found at {posts_dir}")
        return set()
    
    actual_files = set()
    for html_file in posts_dir.glob('*.html'):
        actual_files.add(html_file.name)
    
    print_success(f"Found {len(actual_files)} actual post files")
    return actual_files

def validate_post_urls(posts, actual_files, repo_root):
    """Validate all post URLs point to existing files."""
    broken_links = []
    missing_files = []
    invalid_urls = []
    
    for post in posts:
        url = post.get('url', '')
        title = post.get('title', 'Unknown')
        
        if not url or url == '#':
            invalid_urls.append({
                'title': title,
                'url': url,
                'reason': 'Missing or placeholder URL'
            })
            continue
        
        # Normalize URL - remove leading/trailing slashes and 'posts/' prefix
        url_clean = url.strip('/')
        if url_clean.startswith('posts/'):
            url_clean = url_clean[6:]  # Remove 'posts/' prefix
        elif url_clean.startswith('blog/posts/'):
            url_clean = url_clean[11:]  # Remove 'blog/posts/' prefix
        
        # Check if it's an external URL
        if url.startswith('http://') or url.startswith('https://'):
            # Skip external URLs for now (could add HTTP check later)
            continue
        
        # Check if file exists
        if url_clean not in actual_files:
            broken_links.append({
                'title': title,
                'url': url,
                'expected_file': url_clean,
                'reason': 'File not found in blog/posts/'
            })
    
    return broken_links, missing_files, invalid_urls

def check_html_links(repo_root):
    """Check for broken links in HTML files."""
    broken_html_links = []
    
    # Check blog index
    blog_index = repo_root / 'blog' / 'index.html'
    if blog_index.exists():
        with open(blog_index, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find all href links to posts
        post_links = re.findall(r'href=["\']([^"\']*posts/[^"\']*\.html)["\']', content)
        for link in post_links:
            # Normalize link
            link_clean = link.replace('../', '').replace('./', '')
            if link_clean.startswith('posts/'):
                link_clean = link_clean[6:]
            
            post_file = repo_root / 'blog' / 'posts' / link_clean
            if not post_file.exists():
                broken_html_links.append({
                    'file': 'blog/index.html',
                    'link': link,
                    'expected_file': link_clean
                })
    
    return broken_html_links

def suggest_fixes(broken_links, actual_files):
    """Suggest fixes for broken links based on similar filenames."""
    suggestions = []
    
    for broken in broken_links:
        expected = broken['expected_file']
        title = broken['title']
        
        # Try to find similar files
        similar = []
        expected_lower = expected.lower()
        
        for actual_file in actual_files:
            actual_lower = actual_file.lower()
            # Check for partial matches
            if expected_lower in actual_lower or actual_lower in expected_lower:
                similar.append(actual_file)
            # Check for word matches
            expected_words = set(expected_lower.replace('-', ' ').replace('_', ' ').split())
            actual_words = set(actual_lower.replace('-', ' ').replace('_', ' ').split())
            if expected_words & actual_words:
                similar.append(actual_file)
        
        if similar:
            suggestions.append({
                'title': title,
                'broken_url': broken['url'],
                'suggestions': similar[:3]  # Top 3 suggestions
            })
    
    return suggestions

def main():
    print(f"\n{Colors.BOLD}{Colors.BLUE}╔════════════════════════════════════════╗{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.BLUE}║   Blog Link Validator v1.0            ║{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.BLUE}╚════════════════════════════════════════╝{Colors.RESET}\n")
    
    # Validate posts.json
    result = validate_posts_json()
    if not result:
        sys.exit(1)
    
    posts, repo_root = result
    
    # Get actual files
    actual_files = get_actual_post_files(repo_root)
    
    # Validate URLs
    print_info("Validating post URLs...")
    broken_links, missing_files, invalid_urls = validate_post_urls(posts, actual_files, repo_root)
    
    # Check HTML links
    print_info("Checking HTML files for broken links...")
    broken_html_links = check_html_links(repo_root)
    
    # Report results
    print(f"\n{Colors.BOLD}Validation Results:{Colors.RESET}\n")
    
    total_issues = len(broken_links) + len(invalid_urls) + len(broken_html_links)
    
    if total_issues == 0:
        print_success("All links are valid! No issues found.")
        return 0
    
    # Report broken links
    if broken_links:
        print_error(f"Found {len(broken_links)} broken post links:")
        for broken in broken_links:
            print(f"  • {broken['title']}")
            print(f"    URL: {broken['url']}")
            print(f"    Expected: posts/{broken['expected_file']}")
            print()
    
    # Report invalid URLs
    if invalid_urls:
        print_warning(f"Found {len(invalid_urls)} posts with invalid URLs:")
        for invalid in invalid_urls:
            print(f"  • {invalid['title']}")
            print(f"    URL: {invalid['url']}")
            print()
    
    # Report broken HTML links
    if broken_html_links:
        print_error(f"Found {len(broken_html_links)} broken links in HTML files:")
        for broken in broken_html_links:
            print(f"  • {broken['file']}")
            print(f"    Link: {broken['link']}")
            print(f"    Expected: posts/{broken['expected_file']}")
            print()
    
    # Suggest fixes
    if broken_links:
        print_info("Suggesting fixes...")
        suggestions = suggest_fixes(broken_links, actual_files)
        if suggestions:
            print(f"\n{Colors.BOLD}Suggested Fixes:{Colors.RESET}\n")
            for suggestion in suggestions:
                print(f"  {suggestion['title']}:")
                print(f"    Current: {suggestion['broken_url']}")
                if suggestion['suggestions']:
                    print(f"    Suggested: posts/{suggestion['suggestions'][0]}")
                print()
    
    # Summary
    print(f"\n{Colors.BOLD}Summary:{Colors.RESET}")
    print(f"  Total posts: {len(posts)}")
    print(f"  Actual files: {len(actual_files)}")
    print(f"  Broken links: {len(broken_links)}")
    print(f"  Invalid URLs: {len(invalid_urls)}")
    print(f"  Broken HTML links: {len(broken_html_links)}")
    print(f"  Total issues: {total_issues}\n")
    
    return 1 if total_issues > 0 else 0

if __name__ == '__main__':
    sys.exit(main())
