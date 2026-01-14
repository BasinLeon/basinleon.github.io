import os
import time
import urllib.request
import urllib.parse
from bs4 import BeautifulSoup

# Config
START_URL = "https://basinleon.github.io"
DOMAIN = "basinleon.github.io"
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

visited = set()
queue = [START_URL]
found_posts = []

def crawl():
    print(f"Starting crawl of {START_URL}...")
    
    while queue:
        url = queue.pop(0)
        if url in visited:
            continue
            
        visited.add(url)
        print(f"Scanning: {url}")
        
        try:
            # Fetch
            response = urllib.request.urlopen(url)
            html = response.read()
            soup = BeautifulSoup(html, 'html.parser')
            
            # Check if it's a blog post
            if '/blog/posts/' in url and url.endswith('.html'):
                filename = url.split('/')[-1]
                found_posts.append({
                    'url': url,
                    'filename': filename
                })
            
            # Find Links
            for link in soup.find_all('a'):
                href = link.get('href')
                if not href: continue
                
                # Normalize
                full_url = urllib.parse.urljoin(url, href)
                parsed = urllib.parse.urlparse(full_url)
                
                # Internal links only
                if parsed.netloc == DOMAIN or parsed.netloc == "":
                    # Filter assets/anchors
                    if '#' in full_url: full_url = full_url.split('#')[0]
                    if full_url not in visited and full_url not in queue:
                        # Only follow html or directory links
                        if full_url.endswith('.html') or full_url.endswith('/'):
                            queue.append(full_url)
                            
            time.sleep(0.1) # Be nice
            
        except Exception as e:
            print(f"Error crawling {url}: {e}")

    print(f"\nCrawl complete. Visited {len(visited)} pages.")
    print(f"Found {len(found_posts)} blog post URLs.")
    
    # Check against local
    recover_missing(found_posts)

def recover_missing(online_posts):
    POSTS_DIR = os.path.join(BASE_DIR, 'blog', 'posts')
    local_files = os.listdir(POSTS_DIR)
    
    missing = []
    for post in online_posts:
        if post['filename'] not in local_files:
            missing.append(post)
            
    if not missing:
        print("No missing files found! Local repo is in sync.")
        return
        
    print(f"\nFOUND {len(missing)} MISSING FILES. Downloading...")
    
    for m in missing:
        print(f"Recovering: {m['filename']}")
        try:
            target_path = os.path.join(POSTS_DIR, m['filename'])
            urllib.request.urlretrieve(m['url'], target_path)
            print("  -> Saved.")
        except Exception as e:
            print(f"  -> Failed: {e}")

if __name__ == "__main__":
    crawl()
