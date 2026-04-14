---
name: site-ops-publish-checklist
description: Use as a final ship gate for basinleon.github.io. Enforces preflight checks, deploy steps, and post-deploy verification with rollback-ready awareness.
---

# Site Ops Publish Checklist

## Use When
- User says "ship", "push", "deploy", or "anything left?"
- Major edits touched navigation, links, or content integrity.

## Preflight
1. Confirm changed files are intentional.
2. Run internal link checks on edited pages.
3. Validate all target URLs planned for announcement.
4. Ensure hardcoded stats and labels are consistent with data sources.
5. Confirm no ignored files block required commits.

## Deploy
1. Stage only intended files.
2. Commit with clear scope-focused message.
3. Push to main.

## Post-Deploy
1. Verify critical routes return 200.
2. Verify any new redirect URLs resolve to canonical targets.
3. Re-check hash anchors and nav links on touched pages.
4. Confirm repo clean state.

## Minimal Command Set
```bash
git status --short
git add <files>
git commit -m "<message>"
git push
```

## Done Criteria
- Deploy succeeds.
- All listed production URLs pass status checks.
- No unresolved high/medium findings.
- Working tree is clean.
