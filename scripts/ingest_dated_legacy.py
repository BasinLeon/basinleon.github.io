import os
import json
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DUMP_FILE = os.path.join(BASE_DIR, 'data', 'missing_dump.txt')
LEGACY_FILE = os.path.join(BASE_DIR, 'data', 'legacy_posts.json')
LIVE_FILE = os.path.join(BASE_DIR, 'data', 'posts.json')

def load_existing_titles():
    titles = set()
    # Load Live
    if os.path.exists(LIVE_FILE):
        with open(LIVE_FILE, 'r') as f:
            live = json.load(f)
            for p in live:
                titles.add(p['title'].lower().strip())
    
    # Load Legacy
    if os.path.exists(LEGACY_FILE):
        with open(LEGACY_FILE, 'r') as f:
            legacy = json.load(f)
            for p in legacy:
                titles.add(p['title'].lower().strip())
    return titles

def parse_dump():
    if not os.path.exists(DUMP_FILE):
        print("No missing dump file found.")
        return

    with open(DUMP_FILE, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    existing_titles = load_existing_titles()
    new_posts = []
    
    # Buffer parsing
    # Date
    # Title
    # Tag1
    # Tag2
    
    buffer = []
    
    for line in lines:
        line = line.strip()
        if not line: continue
        
        # Heuristic: If line looks like a date, it starts a new block
        is_date = False
        try:
            # Check for "Dec 29, 2025" or "Sep 1, 2024"
            if ',' in line and line[0:3].isalpha():
                dt = datetime.strptime(line, "%b %d, %Y")
                is_date = True
        except:
            pass
            
        if is_date and len(buffer) > 0:
            # Process previous
            process_buffer(buffer, new_posts, existing_titles)
            buffer = []
            
        buffer.append(line)
        
    # Process last
    if len(buffer) > 0:
        process_buffer(buffer, new_posts, existing_titles)

    print(f"Found {len(new_posts)} new posts to add.")
    
    # Append to Legacy File
    current_legacy = []
    if os.path.exists(LEGACY_FILE):
        with open(LEGACY_FILE, 'r') as f:
            current_legacy = json.load(f)
            
    current_legacy.extend(new_posts)
    
    with open(LEGACY_FILE, 'w', encoding='utf-8') as f:
        json.dump(current_legacy, f, indent=4)

def process_buffer(buffer, new_posts, existing_titles):
    if len(buffer) < 2: return
    
    date_str = buffer[0]
    title = buffer[1]
    tags = buffer[2:] if len(buffer) > 2 else ["Archive"]
    
    # Deduplicate
    if title.lower().strip() in existing_titles:
        # print(f"Skipping duplicate: {title}")
        return

    # Parse date to YYYY-MM-DD
    try:
        dt = datetime.strptime(date_str, "%b %d, %Y")
        iso_date = dt.strftime("%Y-%m-%d")
    except:
        iso_date = None

    new_posts.append({
        "title": title,
        "date": iso_date,
        "tags": tags,
        "excerpt": f"Archived from {date_str}.",
        "url": "#",
        "category": "Archive"
    })

if __name__ == "__main__":
    parse_dump()
