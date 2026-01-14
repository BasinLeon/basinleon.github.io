import os
import json
import re
from datetime import datetime
from bs4 import BeautifulSoup

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
POSTS_DIR = os.path.join(BASE_DIR, 'blog', 'posts')
OUTPUT_FILE = os.path.join(BASE_DIR, 'data', 'posts.json')

def extract_metadata(file_path):
    """Parses an HTML file to extract metadata."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    soup = BeautifulSoup(content, 'html.parser')
    
    # Title
    title = "Untitled Post"
    h1 = soup.find('h1')
    if h1:
        title = h1.get_text(strip=True)
    elif soup.title:
        title = soup.title.get_text(strip=True).split('|')[0].strip()
        
    # Date
    date_str = ""
    # Try .post-meta first
    meta_div = soup.find('div', class_='post-meta')
    if meta_div:
        date_text = meta_div.get_text(strip=True)
        # Try to parse "January 9, 2026"
        try:
            date_obj = datetime.strptime(date_text, "%B %d, %Y")
            date_str = date_obj.strftime("%Y-%m-%d")
        except ValueError:
            pass
            
    # Try filename if date missing (YYYY-MM-DD-slug.html)
    if not date_str:
        filename = os.path.basename(file_path)
        match = re.match(r'(\d{4}-\d{2}-\d{2})', filename)
        if match:
            date_str = match.group(1)
            
    # Tags
    tags = []
    tag_spans = soup.find_all('span', class_='tag')
    for span in tag_spans:
        tags.append(span.get_text(strip=True))
        
    # Excerpt (Meta description or first paragraph)
    excerpt = ""
    meta_desc = soup.find('meta', attrs={'name': 'description'})
    if meta_desc:
        excerpt = meta_desc.get('content', '').strip()
    
    if not excerpt:
        lead = soup.find('p', class_='lead')
        if lead:
            excerpt = lead.get_text(strip=True)
            
    # URL (Relative)
    filename = os.path.basename(file_path)
    url = f"posts/{filename}"

    return {
        "title": title,
        "date": date_str,
        "tags": tags,
        "excerpt": excerpt,
        "url": url,
        "category": "Blog" # Default category
    }

def main():
    print(f"Scanning {POSTS_DIR}...")
    posts = []
    
    if not os.path.exists(POSTS_DIR):
        print(f"Error: {POSTS_DIR} does not exist.")
        return

    files = [f for f in os.listdir(POSTS_DIR) if f.endswith('.html')]
    
    for filename in files:
        file_path = os.path.join(POSTS_DIR, filename)
        try:
            metadata = extract_metadata(file_path)
            posts.append(metadata)
            # print(f"Processing: {metadata['title']}")
        except Exception as e:
            print(f"Error processing {filename}: {e}")

    # Merge Legacy Data
    LEGACY_FILE = os.path.join(BASE_DIR, 'data', 'legacy_posts.json')
    if os.path.exists(LEGACY_FILE):
        try:
            with open(LEGACY_FILE, 'r', encoding='utf-8') as f:
                legacy_posts = json.load(f)
                posts.extend(legacy_posts)
                print(f"Merged {len(legacy_posts)} legacy posts.")
        except Exception as e:
            print(f"Error merging legacy data: {e}")
            
    # Sort by Date (Newest First)
    posts.sort(key=lambda x: x['date'] if x['date'] else '0000-00-00', reverse=True)
    
    # Save
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(posts, f, indent=4)
        
    print(f"Successfully indexed {len(posts)} posts to {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
