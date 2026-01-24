#!/usr/bin/env python3
"""
Batch fix missing meta tags for HTML files
Adds descriptions, canonical URLs, and OG images where missing
"""

import os
import re
from pathlib import Path

# Files that need meta tags (from audit)
FILES_TO_FIX = [
    "sendbird-gtm-deck.html",
    "learning.html",
    "tools/nexus-crm.html",
    "tools/signal-radar.html",
    "tools/nexus-crm 2.html",
    "tools/signal-radar 2.html",
]

# Standard meta tags template
META_TAGS_TEMPLATE = """    <meta name="description" content="{description}">
    <link rel="canonical" href="{canonical}">
    
    <!-- Open Graph -->
    <meta property="og:title" content="{og_title}">
    <meta property="og:description" content="{og_description}">
    <meta property="og:image" content="https://basinleon.github.io/assets/og-image.png">
    <meta property="og:url" content="{canonical}">
    <meta property="og:type" content="website">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{og_title}">
    <meta name="twitter:description" content="{og_description}">
    <meta name="twitter:image" content="https://basinleon.github.io/assets/og-image.png">
"""

def get_meta_content(filepath):
    """Generate meta content based on file path and title"""
    filename = os.path.basename(filepath)
    dirname = os.path.dirname(filepath) if os.path.dirname(filepath) else ""
    
    # Extract title from filename
    title_base = filename.replace('.html', '').replace('-', ' ').replace('_', ' ').title()
    
    # Generate descriptions based on file type
    if 'gtm-deck' in filename.lower() or 'sendbird' in filename.lower():
        description = "GTM strategy deck and architecture presentation. Revenue systems, signal detection, and pipeline automation."
        og_title = f"GTM Strategy Deck | Basin::NEXUS"
    elif 'learning' in filename.lower():
        description = "GTM learning resources, frameworks, and strategic insights. Revenue architecture and signal-based systems."
        og_title = f"GTM Learning Resources | Basin::NEXUS"
    elif 'nexus-crm' in filename.lower():
        description = "NEXUS CRM: Unified Revenue Command Center with War Room tabs, LinkedIn ingest, analytics, and AI assistant."
        og_title = f"NEXUS CRM | Basin::NEXUS Tools"
    elif 'signal-radar' in filename.lower():
        description = "Signal Radar: Real-time market signal detection and prioritization system for GTM teams."
        og_title = f"Signal Radar | Basin::NEXUS Tools"
    else:
        description = f"{title_base} - GTM resources, frameworks, and tools from Basin::NEXUS."
        og_title = f"{title_base} | Basin::NEXUS"
    
    # Generate canonical URL
    if dirname:
        canonical = f"https://basinleon.github.io/{dirname}/{filename}"
    else:
        canonical = f"https://basinleon.github.io/{filename}"
    
    return {
        'description': description,
        'canonical': canonical,
        'og_title': og_title,
        'og_description': description
    }

def add_meta_tags(filepath):
    """Add meta tags to HTML file if missing"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if meta tags already exist
        if 'og:image' in content and 'canonical' in content:
            print(f"✓ {filepath} already has meta tags")
            return False
        
        # Find title tag
        title_match = re.search(r'<title>(.*?)</title>', content)
        if not title_match:
            print(f"⚠ {filepath} - No title tag found")
            return False
        
        # Get meta content
        meta_content = get_meta_content(filepath)
        meta_tags = META_TAGS_TEMPLATE.format(**meta_content)
        
        # Insert after title tag
        title_end = title_match.end()
        new_content = content[:title_end] + '\n' + meta_tags + content[title_end:]
        
        # Write back
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"✓ Added meta tags to {filepath}")
        return True
        
    except Exception as e:
        print(f"✗ Error processing {filepath}: {e}")
        return False

def main():
    base_dir = Path(__file__).parent.parent
    fixed_count = 0
    
    for filename in FILES_TO_FIX:
        filepath = base_dir / filename
        if filepath.exists():
            if add_meta_tags(filepath):
                fixed_count += 1
        else:
            print(f"⚠ File not found: {filepath}")
    
    print(f"\n✅ Fixed {fixed_count} files")

if __name__ == '__main__':
    main()
