#!/usr/bin/env python3
import sys
import json

try:
    from scrapling.fetchers import DynamicFetcher
except ImportError:
    print(json.dumps({"error": "Scrapling not installed. Run pip install 'scrapling[ai]'", "success": False}))
    sys.exit(1)

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No URL provided", "success": False}))
        sys.exit(1)
        
    url = sys.argv[1]
    
    try:
        # Initialize DynamicFetcher (auto-handles stealth & Cloudflare)
        fetcher = DynamicFetcher()
        
        # Fetch URL
        page = fetcher.fetch(url)
        
        # Depending on Scrapling's exact return object, try to extract text/html
        # Usually it returns a Scrapling Response or Page object
        html_content = ""
        if hasattr(page, 'html'):
            html_content = page.html
        elif hasattr(page, 'text'):
            html_content = page.text
        elif hasattr(page, 'content'):
            html_content = page.content
        else:
            html_content = str(page)

        # Output payload
        print(json.dumps({
            "url": url, 
            "success": True, 
            "html_length": len(html_content),
            "content": html_content[:50000] # Cap output to prevent terminal overload
        }))
        
    except Exception as e:
        print(json.dumps({"url": url, "success": False, "error": str(e)}))

if __name__ == "__main__":
    main()
