---
name: scrapling-leadgen
description: Natively fetch and bypass CDNs/Cloudflare for any URL using Scrapling DynamicFetcher without MCP.
---
# Scrapling Web Fetcher

This skill enables your Lead Gen and Market Research agents to automatically crawl websites that block standard bots (like DataDome or Cloudflare Turnstile).

## `scrape_url`

Extracts the raw, unblocked HTML/text of a target URL using Scrapling's stealth browser automation (`DynamicFetcher`).

**Usage:**
Execute the python wrapper script in the terminal:
```bash
python3 "/Users/basin/Desktop/Basin & Associates 🌍/.agents/skills/scrapling-leadgen/scripts/scrape.py" "https://example.com"
```

The script will return a JSON object containing:
- `url`: The target URL
- `success`: Boolean indicating if the fetch worked
- `content`: The raw HTML content (capped at 50,000 chars to save token space)
- `error`: Populated if `success` is false.

**When to use:**
- Building prospect lists from B2B directories
- Crawling pricing pages on competitor sites
- Anytime a standard `curl` or `requests` fetch returns a 403 Forbidden or a Cloudflare Challenge page.
