#!/usr/bin/env python3
"""
Remove console.log statements from JavaScript files
Keep console.error and console.warn for critical error handling
"""

import os
import re
from pathlib import Path

def remove_console_logs(filepath):
    """Remove console.log statements, keep console.error and console.warn"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Remove console.log statements (but keep console.error and console.warn)
        # Pattern: console.log(...); or console.log(...)
        # Match across multiple lines if needed
        patterns = [
            # Single line console.log
            r'console\.log\([^)]*\);\s*\n',
            # Multi-line console.log (with nested parentheses)
            r'console\.log\([^)]*(?:\([^)]*\)[^)]*)*\);\s*\n',
            # console.log without semicolon (end of block)
            r'console\.log\([^)]*\)\s*\n',
        ]
        
        for pattern in patterns:
            content = re.sub(pattern, '', content, flags=re.MULTILINE)
        
        # Also remove standalone console.log in try-catch blocks
        content = re.sub(r'\s*console\.log\([^)]*\);\s*\n', '', content)
        
        # Remove empty lines that might result
        content = re.sub(r'\n\s*\n\s*\n', '\n\n', content)
        
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
        
    except Exception as e:
        print(f"✗ Error processing {filepath}: {e}")
        return False

def main():
    base_dir = Path(__file__).parent.parent
    widgets_dir = base_dir / 'widgets'
    
    js_files = list(widgets_dir.glob('*.js'))
    fixed_count = 0
    
    for js_file in js_files:
        if remove_console_logs(js_file):
            print(f"✓ Removed console.log from {js_file.name}")
            fixed_count += 1
        else:
            print(f"  {js_file.name} - no changes needed")
    
    print(f"\n✅ Processed {len(js_files)} files, removed console.log from {fixed_count} files")
    print("ℹ️  Note: console.error and console.warn were kept for error handling")

if __name__ == '__main__':
    main()
