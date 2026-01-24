#!/usr/bin/env python3
"""
NEXUS::PATH_NORMALIZER
Converts relative links to absolute paths in nav/footer elements only.

Usage:
    python fix-relative-paths.py              # Dry run (preview changes)
    python fix-relative-paths.py --apply      # Apply changes
    python fix-relative-paths.py --backup     # Create backups before applying
"""

from pathlib import Path
from bs4 import BeautifulSoup
import argparse
import shutil
from datetime import datetime
from typing import Set, Tuple

# Configuration
REPO_ROOT = Path(__file__).parent.parent
TARGET_ELEMENTS = ['nav', 'footer', 'header']  # Elements to scan
SKIP_PREFIXES = ('/', 'http://', 'https://', '#', 'mailto:', 'tel:', 'javascript:')


def is_relative_path(href: str) -> bool:
    """Check if a path is relative and needs conversion."""
    if not href or href.isspace():
        return False
    return not href.startswith(SKIP_PREFIXES)


def normalize_path(href: str, file_path: Path) -> str:
    """Convert relative path to absolute path."""
    # Handle common relative patterns
    if href.startswith('../'):
        # Count levels up and reconstruct
        parts = href.split('/')
        up_count = sum(1 for p in parts if p == '..')
        remaining = '/'.join(p for p in parts if p != '..')
        
        # Get current file's directory depth from repo root
        rel_path = file_path.relative_to(REPO_ROOT)
        current_depth = len(rel_path.parts) - 1  # -1 for the file itself
        
        # Calculate target depth
        target_depth = current_depth - up_count
        if target_depth < 0:
            target_depth = 0
        
        # Return absolute path
        return '/' + remaining if remaining else '/'
    
    elif href.startswith('./'):
        # Same directory reference
        return '/' + href[2:]
    
    else:
        # Relative without prefix (e.g., "blog/post.html")
        return '/' + href


def process_file(file_path: Path, dry_run: bool = True) -> Tuple[int, Set[str]]:
    """
    Process a single HTML file.
    Returns (count of fixes, set of changed links).
    """
    changes = set()
    
    try:
        content = file_path.read_text(encoding='utf-8')
    except Exception as e:
        print(f"  ⚠️  Error reading {file_path}: {e}")
        return 0, changes
    
    # Parse HTML - use html.parser to preserve formatting
    soup = BeautifulSoup(content, 'html.parser')
    
    # Find target elements
    for element_name in TARGET_ELEMENTS:
        for element in soup.find_all(element_name):
            # Find all links within this element
            for link in element.find_all('a', href=True):
                href = link['href']
                
                if is_relative_path(href):
                    new_href = normalize_path(href, file_path)
                    
                    if new_href != href:
                        changes.add(f"{href} → {new_href}")
                        link['href'] = new_href
    
    # Write changes if not dry run
    if changes and not dry_run:
        # Preserve original formatting as much as possible
        file_path.write_text(str(soup), encoding='utf-8')
    
    return len(changes), changes


def main():
    parser = argparse.ArgumentParser(
        description='Convert relative links to absolute paths in nav/footer elements.'
    )
    parser.add_argument(
        '--apply', 
        action='store_true', 
        help='Apply changes (default is dry run)'
    )
    parser.add_argument(
        '--backup', 
        action='store_true', 
        help='Create backups before applying changes'
    )
    args = parser.parse_args()
    
    dry_run = not args.apply
    
    print("=" * 60)
    print("NEXUS::PATH_NORMALIZER")
    print("=" * 60)
    print(f"Mode: {'DRY RUN (preview only)' if dry_run else 'APPLYING CHANGES'}")
    print(f"Target elements: {', '.join(TARGET_ELEMENTS)}")
    print(f"Repository: {REPO_ROOT}")
    print("=" * 60)
    print()
    
    # Find all HTML files
    html_files = list(REPO_ROOT.rglob('*.html'))
    
    # Filter out backup directories
    html_files = [f for f in html_files if 'backup' not in str(f).lower()]
    
    total_files = len(html_files)
    files_with_changes = 0
    total_fixes = 0
    all_changes = []
    
    for file_path in sorted(html_files):
        rel_path = file_path.relative_to(REPO_ROOT)
        fix_count, changes = process_file(file_path, dry_run)
        
        if fix_count > 0:
            files_with_changes += 1
            total_fixes += fix_count
            
            print(f"📄 {rel_path}")
            for change in sorted(changes):
                print(f"   └─ {change}")
            all_changes.append((rel_path, changes))
    
    # Summary
    print()
    print("=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"Files scanned:      {total_files}")
    print(f"Files with changes: {files_with_changes}")
    print(f"Total links fixed:  {total_fixes}")
    print()
    
    if dry_run and total_fixes > 0:
        print("💡 This was a DRY RUN. To apply changes, run:")
        print("   python fix-relative-paths.py --apply")
        print()
        print("   To create backups first:")
        print("   python fix-relative-paths.py --apply --backup")
    elif total_fixes > 0:
        print("✅ Changes applied successfully!")
    else:
        print("✨ No relative paths found in nav/footer elements.")
    
    # Create backup if requested
    if args.backup and args.apply and files_with_changes > 0:
        backup_dir = REPO_ROOT / f"backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        backup_dir.mkdir(exist_ok=True)
        
        for rel_path, _ in all_changes:
            src = REPO_ROOT / rel_path
            dst = backup_dir / rel_path
            dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, dst)
        
        print(f"\n📦 Backups created in: {backup_dir}")


if __name__ == '__main__':
    main()
