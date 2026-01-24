#!/usr/bin/env python3
"""
Comprehensive Sitemap Update Script
Adds all missing pages and ensures proper indexing
"""

import os
from pathlib import Path
from datetime import datetime
from xml.etree import ElementTree as ET

def get_all_html_files(base_path):
    """Find all HTML files, excluding backups and duplicates"""
    html_files = []
    for html_file in base_path.rglob('*.html'):
        # Skip backups and duplicates
        if 'backup' in str(html_file).lower():
            continue
        if ' 2.html' in str(html_file):
            continue
        if 'temp' in str(html_file).lower():
            continue
        html_files.append(html_file)
    return sorted(html_files)

def html_to_url(html_path, base_path):
    """Convert file path to URL"""
    rel_path = html_path.relative_to(base_path)
    # Convert to URL path
    url_path = str(rel_path).replace('\\', '/')
    # Remove index.html from URLs
    if url_path.endswith('index.html'):
        url_path = url_path[:-10] or '/'
    return f"https://basinleon.github.io/{url_path}"

def get_priority(path_str):
    """Determine priority based on path"""
    if path_str == 'index.html' or path_str.endswith('/index.html'):
        return '1.0'
    elif 'blog/posts' in path_str:
        return '0.7'
    elif 'library' in path_str:
        return '0.8'
    elif 'tools' in path_str:
        return '0.8'
    elif 'case-studies' in path_str:
        return '0.9'
    else:
        return '0.8'

def get_changefreq(path_str):
    """Determine change frequency"""
    if 'blog/posts' in path_str:
        return 'monthly'
    elif 'library' in path_str:
        return 'monthly'
    else:
        return 'weekly'

def update_sitemap():
    base_path = Path(__file__).parent.parent
    sitemap_path = base_path / 'sitemap.xml'
    
    # Get all HTML files
    html_files = get_all_html_files(base_path)
    
    # Create sitemap structure
    urlset = ET.Element('urlset')
    urlset.set('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
    
    # Add all URLs
    today = datetime.now().strftime('%Y-%m-%d')
    added_urls = set()
    
    for html_file in html_files:
        url = html_to_url(html_file, base_path)
        
        # Skip duplicates
        if url in added_urls:
            continue
        added_urls.add(url)
        
        # Create URL element
        url_elem = ET.SubElement(urlset, 'url')
        
        loc = ET.SubElement(url_elem, 'loc')
        loc.text = url
        
        lastmod = ET.SubElement(url_elem, 'lastmod')
        lastmod.text = today
        
        changefreq = ET.SubElement(url_elem, 'changefreq')
        changefreq.text = get_changefreq(str(html_file))
        
        priority = ET.SubElement(url_elem, 'priority')
        priority.text = get_priority(str(html_file))
    
    # Write sitemap
    tree = ET.ElementTree(urlset)
    ET.indent(tree, space='  ')
    tree.write(sitemap_path, encoding='utf-8', xml_declaration=True)
    
    print(f"✅ Updated sitemap.xml with {len(added_urls)} URLs")
    return len(added_urls)

if __name__ == '__main__':
    count = update_sitemap()
    print(f"\n📊 Sitemap contains {count} URLs")
