# Site Ops Release Workflow

Purpose: one repeatable workflow for QA, link integrity, migration queueing, deployment, and Obsidian logging.

## Skills to Use
- .agents/skills/site-ops-qa/SKILL.md
- .agents/skills/site-ops-link-audit/SKILL.md
- .agents/skills/site-ops-migration-queue/SKILL.md
- .agents/skills/site-ops-publish-checklist/SKILL.md

## Execution Order
1. Run Site Ops QA on requested URLs/pages.
2. Run Link Audit for any broken links or redirects.
3. If content migration is active, run Migration Queue and produce JSON batches.
4. Run Publish Checklist and deploy.
5. Log outcome to Obsidian runbook.

## Obsidian Log Target
- /Users/basin/Library/Mobile Documents/iCloud~md~obsidian/Documents/Basin::Nexus/Site QA/

## Required Log Fields
- Date
- URLs reviewed
- Findings
- Fixes applied
- Validation result
- Commit hashes
- Next actions
