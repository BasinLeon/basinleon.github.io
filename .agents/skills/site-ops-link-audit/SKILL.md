---
name: site-ops-link-audit
description: Use to detect and fix dead links, wrong-path links, and missing redirects across basinleon.github.io. Includes root compatibility redirect pattern for moved docs pages.
---

# Site Ops Link Audit

## Use When
- User reports a dead link.
- New pages were recently created or moved.
- Library/tools/docs routes were updated.

## Procedure
1. Reproduce the issue with direct HTTP check.
2. Locate all references to the broken URL in repo HTML files.
3. Determine canonical target path.
4. Fix all source links.
5. If old URL is publicly shared, add compatibility redirect page.
6. Re-run link scan and status checks.

## Redirect Pattern
Use a root compatibility redirect file when old links are in circulation.

```html
<meta http-equiv="refresh" content="0; url=/docs/target-page.html" />
<script>window.location.replace('/docs/target-page.html');</script>
```

## Recommended Commands
```bash
# Find references
rg -n '/old_path.html|new_path.html' -S **/*.html

# Validate destination exists
ls docs | rg 'target-page.html'

# Live check
curl -L -s -o /dev/null -w '%{http_code}\n' 'https://basinleon.github.io/old_path.html'
```

## Done Criteria
- Broken URL resolves successfully.
- All internal references updated to canonical path.
- Redirect added when needed for compatibility.
- Repo scan returns no stale references to broken path.
