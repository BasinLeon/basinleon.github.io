#!/usr/bin/env python3
"""
URGENT: Comprehensive Privacy Scan
Finds ALL private information across the entire website
"""

import re
from pathlib import Path
from collections import defaultdict

# Private information patterns to find
PRIVATE_PATTERNS = {
    'company_names': [
        r'\bBRM\s+Labs?\b',
        r'\bUVM\s+Health\b',
        r'\bManTech\b',
        r'\bAvantic\b',
        r'\bRSM\b',
        r'\bsinglefile\.io\b',
        r'\bCyberArk\b',
        r'\bAmbient\.ai\b',
        r'\bMastech\s+Digital\b',
        r'\bFudo\s+Security\b',
        r'\bHorizon\b',
        r'\bTredence\b',
        r'\bSolveJet\b',
    ],
    'personal_names': [
        r'\bLane\b(?!\s+[A-Z])',  # Lane but not Lane Street, etc.
        r'\bRich\s+Taber\b',
        r'\bObriel\s+Spencer\b',
        r'\bViktor\s+Farcic\b',
        r'\bChristopher\s+Tuma\b',
        r'\bNoah\s+Barr\b',
        r'\bNick\s+Billy\b',
        r'\bKaran\s+Shah\b',
    ],
    'specific_metrics': [
        r'\$621[,\s]?636',
        r'\$621K',
        r'\$621\s+K',
        r'\$134K',
        r'\$134[,\s]?000',
        r'\$80K',
        r'\$80[,\s]?000',
        r'\$155[,\s]?303',
        r'\$22\.7k',
        r'\$26\.6k',
        r'\$137[,\s]?490',
        r'\$85[,\s]?039',
        r'\$40[,\s]?000',
        r'\$51[,\s]?704',
        r'\$307[,\s]?403',
        r'\$1M\s+pipeline',
        r'\$1\s+million',
        r'\$10\s+million',
        r'\$10M',
    ],
    'specific_dates': [
        r'October\s+2025',
        r'October\s+20-24,\s+2025',
        r'July-August\s+2025',
        r'August\s+2025',
        r'July\s+through\s+August\s+2025',
        r'February\s+2024',
        r'2024-2025',
        r'September\s+2025',
        r'July\s+2025',
    ],
    'specific_numbers': [
        r'\b5,000\s+leads',
        r'\b5,000\s+new\s+leads',
        r'\b5,000\s+contacts',
        r'\b5,000\s+sponsorship\s+leads',
    ],
    'specific_quotes': [
        r'\$22\.7k\s*/\s*\$26\.6k',
        r'\$22\.7k',
        r'\$26\.6k',
    ],
}

def scan_file(file_path):
    """Scan a single file for private information"""
    try:
        content = file_path.read_text(encoding='utf-8')
        issues = defaultdict(list)
        
        for category, patterns in PRIVATE_PATTERNS.items():
            for pattern in patterns:
                matches = re.finditer(pattern, content, re.IGNORECASE)
                for match in matches:
                    # Get context (50 chars before and after)
                    start = max(0, match.start() - 50)
                    end = min(len(content), match.end() + 50)
                    context = content[start:end].replace('\n', ' ')
                    issues[category].append({
                        'pattern': pattern,
                        'match': match.group(),
                        'line': content[:match.start()].count('\n') + 1,
                        'context': context
                    })
        
        return issues
    except Exception as e:
        return {'error': str(e)}

def scan_all_files():
    """Scan all HTML files in the website"""
    base_path = Path(__file__).parent.parent
    html_files = list(base_path.rglob('*.html'))
    
    # Filter out backups
    html_files = [f for f in html_files if 'backup' not in str(f).lower() and ' 2.html' not in str(f)]
    
    all_issues = {}
    
    print(f"🔍 Scanning {len(html_files)} HTML files for private information...\n")
    
    for html_file in html_files:
        issues = scan_file(html_file)
        if issues and 'error' not in issues and any(issues.values()):
            rel_path = html_file.relative_to(base_path)
            all_issues[str(rel_path)] = issues
    
    # Print results
    if all_issues:
        print(f"⚠️  Found private information in {len(all_issues)} files:\n")
        for file, issues in sorted(all_issues.items()):
            print(f"📄 {file}")
            for category, items in issues.items():
                print(f"   {category}: {len(items)} instances")
                for item in items[:3]:  # Show first 3
                    print(f"      - Line {item['line']}: {item['match']}")
                    print(f"        Context: ...{item['context']}...")
                if len(items) > 3:
                    print(f"      ... and {len(items) - 3} more")
            print()
    else:
        print("✅ No private information found!")
    
    return all_issues

if __name__ == '__main__':
    scan_all_files()
