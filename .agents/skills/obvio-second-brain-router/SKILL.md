---
name: obvio-second-brain-router
description: "Middle-man skill for Obvio/GTM second-brain work. Use when the user asks to route raw Obvio activity, accomplishments, territory notes, reports, public-safe snippets, or private operating-ledger work through Obsidian or the local hard drive. Always enforce private-vs-public security boundaries before reading, writing, or publishing."
---

# Obvio Second Brain Router

## Purpose
Act as the middle layer between raw work and the user's private Obsidian-based operating system. Your job is to decide which specialist lane applies, load only the needed private context, and keep sensitive GTM material off public surfaces.

## First Move
Before producing any output, classify the request:

- **Capture / proof log**: use `obvio-proof-ledger`.
- **Daily, EOD, weekly, manager, or founder update**: use `obvio-executive-rollup`.
- **Public website, X, LinkedIn, Substack, portfolio, or article**: use `obvio-public-safe-publisher`.
- **Territory, CRM, HubSpot, city research, stakeholder mapping, or outreach infrastructure**: use `obvio-territory-intel`.
- **Skill creation or routing changes**: use `skill-creator` plus this router.

If the request spans multiple lanes, sequence them in this order: private capture, synthesis, public redaction, then output.

## Private Context Loading
Use Obsidian as the source of truth when relevant. Prefer this folder:

`Leon's Journal/01_PROJECTS/Obvio_GTM_Operating_Ledger/`

Load boundary files first when they exist:

1. `Security Boundary - Public vs Private.md`
2. `Public-Safe GTM Publishing Boundary.md`
3. `GTM Mission Control - Index.md`

Only load additional notes that directly support the current request. Do not bulk-read the whole vault.

## Security Rules
- Default every Obvio/GTM note to **private** unless the user explicitly asks for a public-safe version.
- Never move raw account names, customer names, city targets, stakeholder names, deal values, contact details, internal playbooks, DNC lists, CRM architecture, or outreach scripts into public files.
- Public outputs must be abstracted into capabilities, patterns, and operating principles.
- If an output may touch `basinleon.github.io`, run a redaction pass before editing.
- If uncertain, keep the detail in Obsidian and publish only the sanitized frame.

## Output Discipline
Choose the smallest useful artifact:

- A new or updated Obsidian note for private memory.
- A concise executive update for internal reporting.
- A sanitized public paragraph or portfolio bullet.
- A routing decision with the next specialist skill to use.

When writing private notes, use Obsidian-friendly Markdown, clear dates, and stable headings. When writing public-safe content, remove operational specifics and keep the proof at the level of role, scope, and system design.

## Session Close
For meaningful work, add or update a short private session note in:

`Leon's Journal/05_CODEX_CORE/01_Session_Notes/`

Capture:
- What changed
- Where it lives
- What remains private
- Any public-safe derivative created
