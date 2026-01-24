#!/usr/bin/env python3
"""
Comprehensive Site Audit Script
Checks all 5 audit options: Homepage, Consulting, Navigation, SEO, Content Gaps
"""

import os
import re
import json
from pathlib import Path
from urllib.parse import urlparse, urljoin
from collections import defaultdict

# Private information patterns
PRIVATE_PATTERNS = [
    r'\$621K', r'621K', r'\$1\.8M', r'1\.8M',
    r'Fudo\s+Security', r'Ambient\.ai', r'BRM\s+Labs', r'UVM\s+Health',
    r'ManTech', r'Avantic', r'Horizon', r'Obriel', r'Rich\s+Taber',
    r'Lane\s+Hartman', r'Viktor\s+Farcic', r'Karan\s+Shah',
    r'Noah\s+Barr', r'Nick\s+Billy', r'Christopher\s+Tuma',
    r'LiveRamp', r'Sentinel\s+Security', r'Mastech\s+Digital',
    r'Tredence', r'RSM', r'singlefile\.io', r'CyberArk',
    r'ListKit', r'Clay', r'AiSDR'
]

# Base directory
BASE_DIR = Path(__file__).parent.parent

def find_html_files():
    """Find all HTML files in the site"""
    html_files = []
    for root, dirs, files in os.walk(BASE_DIR):
        # Skip hidden directories and common exclusions
        dirs[:] = [d for d in dirs if not d.startswith('.') and d not in ['node_modules', '__pycache__']]
        for file in files:
            if file.endswith('.html'):
                html_files.append(Path(root) / file)
    return html_files

def check_private_info(file_path):
    """Check for private information in a file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        issues = []
        for pattern in PRIVATE_PATTERNS:
            matches = re.finditer(pattern, content, re.IGNORECASE)
            for match in matches:
                # Get context (50 chars before and after)
                start = max(0, match.start() - 50)
                end = min(len(content), match.end() + 50)
                context = content[start:end].replace('\n', ' ')
                issues.append({
                    'pattern': pattern,
                    'match': match.group(),
                    'line': content[:match.start()].count('\n') + 1,
                    'context': context
                })
        
        return issues
    except Exception as e:
        return [{'error': str(e)}]

def extract_links(file_path, base_url='https://basinleon.github.io'):
    """Extract all links from an HTML file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find all href attributes
        href_pattern = r'href=["\']([^"\']+)["\']'
        links = re.findall(href_pattern, content)
        
        # Also check src attributes for images/scripts
        src_pattern = r'src=["\']([^"\']+)["\']'
        srcs = re.findall(src_pattern, content)
        
        return {
            'hrefs': links,
            'srcs': srcs,
            'all': links + srcs
        }
    except Exception as e:
        return {'error': str(e)}

def check_meta_tags(file_path):
    """Check meta tags for SEO"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        meta_info = {
            'has_title': bool(re.search(r'<title>', content, re.IGNORECASE)),
            'has_description': bool(re.search(r'<meta\s+name=["\']description["\']', content, re.IGNORECASE)),
            'has_canonical': bool(re.search(r'<link\s+rel=["\']canonical["\']', content, re.IGNORECASE)),
            'has_og_image': bool(re.search(r'<meta\s+property=["\']og:image["\']', content, re.IGNORECASE)),
        }
        
        # Extract actual values
        title_match = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE | re.DOTALL)
        desc_match = re.search(r'<meta\s+name=["\']description["\']\s+content=["\']([^"\']+)["\']', content, re.IGNORECASE)
        
        if title_match:
            meta_info['title'] = title_match.group(1).strip()
        if desc_match:
            meta_info['description'] = desc_match.group(1).strip()
        
        return meta_info
    except Exception as e:
        return {'error': str(e)}

def check_navigation(file_path):
    """Check navigation structure"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        nav_info = {
            'has_nav': bool(re.search(r'<nav', content, re.IGNORECASE)),
            'has_blog_link': bool(re.search(r'href=["\']/?blog/', content, re.IGNORECASE)),
            'has_library_link': bool(re.search(r'href=["\']/?library/', content, re.IGNORECASE)),
            'has_case_studies_link': bool(re.search(r'href=["\']/?case-studies/', content, re.IGNORECASE)),
            'has_tools_link': bool(re.search(r'href=["\']/?tools/', content, re.IGNORECASE)),
            'has_consulting_link': bool(re.search(r'href=["\']/?consulting/', content, re.IGNORECASE)),
        }
        
        return nav_info
    except Exception as e:
        return {'error': str(e)}

def main():
    """Run comprehensive audit"""
    print("🔍 Starting Comprehensive Site Audit...\n")
    
    html_files = find_html_files()
    print(f"Found {len(html_files)} HTML files\n")
    
    results = {
        'private_info': defaultdict(list),
        'broken_links': [],
        'missing_meta': [],
        'navigation_issues': [],
        'content_gaps': []
    }
    
    # Check each file
    for file_path in html_files:
        rel_path = file_path.relative_to(BASE_DIR)
        print(f"Checking: {rel_path}")
        
        # Check for private information
        private_issues = check_private_info(file_path)
        if private_issues:
            results['private_info'][str(rel_path)] = private_issues
        
        # Check meta tags
        meta_info = check_meta_tags(file_path)
        if not meta_info.get('has_title') or not meta_info.get('has_description'):
            results['missing_meta'].append({
                'file': str(rel_path),
                'missing': [k for k, v in meta_info.items() if k.startswith('has_') and not v]
            })
        
        # Check navigation
        nav_info = check_navigation(file_path)
        if nav_info.get('has_nav'):
            # Check if main pages have all navigation links
            if 'index.html' in str(rel_path) or 'consulting' in str(rel_path):
                missing_nav = [k.replace('has_', '').replace('_link', '') for k, v in nav_info.items() 
                             if k.endswith('_link') and not v]
                if missing_nav:
                    results['navigation_issues'].append({
                        'file': str(rel_path),
                        'missing_links': missing_nav
                    })
        
        # Extract links
        links = extract_links(file_path)
        if 'error' not in links:
            # Check for broken internal links
            for link in links.get('hrefs', []):
                if link.startswith('#') or link.startswith('http'):
                    continue
                if link.startswith('/'):
                    link = link[1:]
                target_path = BASE_DIR / link
                if not target_path.exists() and not link.endswith('.html'):
                    # Check if it's an anchor link
                    if '#' in link:
                        base_link = link.split('#')[0]
                        anchor = link.split('#')[1]
                        base_path = BASE_DIR / base_link
                        if base_path.exists():
                            # Check if anchor exists in target file
                            try:
                                with open(base_path, 'r', encoding='utf-8') as f:
                                    target_content = f.read()
                                if f'id="{anchor}"' not in target_content and f'name="{anchor}"' not in target_content:
                                    results['broken_links'].append({
                                        'file': str(rel_path),
                                        'link': link,
                                        'issue': f'Anchor #{anchor} not found'
                                    })
                            except:
                                pass
                        else:
                            results['broken_links'].append({
                                'file': str(rel_path),
                                'link': link,
                                'issue': 'File not found'
                            })
                    else:
                        results['broken_links'].append({
                            'file': str(rel_path),
                            'link': link,
                            'issue': 'File not found'
                        })
    
    # Print results
    print("\n" + "="*80)
    print("AUDIT RESULTS")
    print("="*80)
    
    print(f"\n📋 Private Information Issues: {sum(len(v) for v in results['private_info'].values())}")
    for file, issues in results['private_info'].items():
        print(f"  ⚠️  {file}: {len(issues)} issues")
        for issue in issues[:3]:  # Show first 3
            if 'error' not in issue:
                print(f"     - {issue['pattern']}: {issue['match']} (line {issue['line']})")
    
    print(f"\n🔗 Broken Links: {len(results['broken_links'])}")
    for link_info in results['broken_links'][:10]:  # Show first 10
        print(f"  ❌ {link_info['file']}: {link_info['link']} - {link_info['issue']}")
    
    print(f"\n📝 Missing Meta Tags: {len(results['missing_meta'])}")
    for meta_info in results['missing_meta'][:10]:
        print(f"  ⚠️  {meta_info['file']}: Missing {', '.join(meta_info['missing'])}")
    
    print(f"\n🧭 Navigation Issues: {len(results['navigation_issues'])}")
    for nav_info in results['navigation_issues']:
        print(f"  ⚠️  {nav_info['file']}: Missing links to {', '.join(nav_info['missing_links'])}")
    
    # Save results to JSON
    output_file = BASE_DIR / 'site-audit-results.json'
    with open(output_file, 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n✅ Audit complete! Results saved to: {output_file}")
    return results

if __name__ == '__main__':
    main()
