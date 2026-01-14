import os
import json
import xml.etree.ElementTree as ET
import urllib.request

def check_missing_posts():
    # 1. Fetch Sitemap
    url = "https://basinleon.github.io/sitemap.xml"
    try:
        response = urllib.request.urlopen(url)
        data = response.read()
    except Exception as e:
        print(f"Failed to fetch sitemap: {e}")
        return

    # 2. Parse Sitemap URLs
    root = ET.fromstring(data)
    namespace = {'ns': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
    sitemap_urls = []
    
    for url in root.findall('ns:url', namespace):
        loc = url.find('ns:loc', namespace).text
        if '/blog/posts/' in loc:
            filename = loc.split('/')[-1]
            sitemap_urls.append(filename)

    print(f"Found {len(sitemap_urls)} posts in LIVE sitemap.")

    # 3. Load Local Posts
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    POSTS_DIR = os.path.join(BASE_DIR, 'blog', 'posts')
    
    local_files = os.listdir(POSTS_DIR)
    local_files = [f for f in local_files if f.endswith('.html')]
    
    print(f"Found {len(local_files)} local HTML files.")

    # 4. Compare
    missing = [u for u in sitemap_urls if u not in local_files]
    
    if missing:
        print("\nMISSING POSTS (In Sitemap but NOT Local):")
        for m in missing:
            print(f"- {m}")
    else:
        print("\nNo missing posts found in Sitemap vs Local.")

if __name__ == "__main__":
    check_missing_posts()
