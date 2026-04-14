---
name: site-ops-qa
description: Use for production QA on basinleon.github.io pages. Runs status checks, anchor checks, internal link integrity scans, and returns a prioritized findings report with exact fixes.
---

# Site Ops QA

## Use When
- User asks for a review of one or more live pages.
- User asks "does this make sense" for site flow or navigation.
- You need a final pre-ship or post-ship QA verification.

## Inputs
- List of URLs to validate.
- Optional list of local files to prioritize.

## Procedure
1. Check live status codes for each URL.
2. Validate hash anchors: every href with #target must map to an id="target" in the same page.
3. Validate internal links against local files (absolute links and directory index targets).
4. Validate cross-page flow between main hubs:
- /
- /library/
- /tools/
- /case-studies/
- /docs/
5. Return findings ordered by severity.

## Recommended Commands
```bash
# Live status checks
printf '%s\n' \
'https://basinleon.github.io/' \
'https://basinleon.github.io/library/' \
'https://basinleon.github.io/tools/' \
'https://basinleon.github.io/case-studies/' \
'https://basinleon.github.io/docs/' \
| while IFS= read -r u; do code=$(curl -L -s -o /dev/null -w '%{http_code}' "$u"); echo "$code $u"; done

# Hash anchor checks in a file
rg -n 'href="#' path/to/file.html
rg -n 'id="' path/to/file.html

# Internal absolute link scan
node -e "/* run local href existence check script */"
```

## Output Format
- Findings first, highest severity first.
- For each finding: page, issue, impact, fix.
- End with: "Verified routes" and "Residual risk".

## Done Criteria
- Requested URLs return 200.
- No broken internal links in checked files.
- No unresolved hash anchors in checked files.
- Findings reported with concrete edits when needed.
