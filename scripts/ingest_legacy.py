import os
import json

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DUMP_FILE = os.path.join(BASE_DIR, 'data', 'legacy_dump.txt')
OUTPUT_FILE = os.path.join(BASE_DIR, 'data', 'legacy_posts.json')

def parse_dump():
    if not os.path.exists(DUMP_FILE):
        print("No dump file found.")
        return

    with open(DUMP_FILE, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    posts = []
    current_post = {}
    
    # Simple state machine
    # Format:
    # Unknown Date
    # Title
    # Summary
    # (Empty Line)
    
    buffer = []
    
    for line in lines:
        line = line.strip()
        if not line:
            if len(buffer) >= 3:
                # Process buffer
                date = buffer[0]
                title = buffer[1]
                summary = " ".join(buffer[2:])
                
                posts.append({
                    "title": title,
                    "date": None, # Force null for handling
                    "tags": ["Archive"],
                    "excerpt": summary,
                    "url": "#", # No link
                    "category": "Archive"
                })
            elif len(buffer) == 2:
                 # Backup case
                posts.append({
                    "title": buffer[1],
                    "date": None, 
                    "tags": ["Archive"],
                    "excerpt": "Archived content.",
                    "url": "#",
                    "category": "Archive"
                })
            
            buffer = [] # Reset
        else:
            buffer.append(line)
            
    # Flush last buffer
    if len(buffer) >= 2:
        posts.append({
             "title": buffer[1],
             "date": None,
             "tags": ["Archive"],
             "excerpt": " ".join(buffer[2:]) if len(buffer)>2 else "Archived content.",
             "url": "#",
             "category": "Archive"
        })

    print(f"Parsed {len(posts)} legacy posts.")
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(posts, f, indent=4)

if __name__ == "__main__":
    parse_dump()
