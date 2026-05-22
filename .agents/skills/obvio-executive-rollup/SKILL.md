---
name: obvio-executive-rollup
description: "Generate private Obvio/GTM daily standups, EOD updates, weekly executive roll-ups, manager updates, founder-ready summaries, and next-48-hour plans from proof-ledger notes and raw activity."
---

# Obvio Executive Roll-Up

## Purpose
Compress private GTM activity into signal for leaders. The output should be brief, confident, and useful for a manager or founder who wants to know what moved, what matters, and what needs attention.

## Default Structure

```markdown
BLUF:

Metrics Snapshot:

What Moved:

Systems / Plays Operationalized:

Risks / Asks:

Next 48 Hours:
```

For weekly updates, add:

```markdown
Headline:

Execution by Pillar:

Pipeline / Motion Snapshot:

Next Week's Priorities:
```

## Synthesis Rules
- Group activity into motions, not chronology.
- Use numbers only when they are known or provided.
- Distinguish booked, pending, proposed, and researched.
- Never overclaim attribution.
- Name risk plainly and pair it with an action.
- Keep the tone senior, practical, and low-drama.

## Privacy Rules
This skill is for internal/private outputs by default. If the user asks to reuse any of it publicly, route through `obvio-public-safe-publisher` first.

Do not include private CRM data, account names, deal values, stakeholder names, or tactical scripts in public-facing drafts.

## Useful Compression Patterns
- "Converted raw research into execution infrastructure."
- "Moved from ad hoc activity to a repeatable operating motion."
- "Created decision logic, not just a list."
- "Turned a one-off experiment into a reusable play."
- "Closed the loop with the stakeholder and created the next action."

## Storage
When saving to Obsidian, place the output in:

`Leon's Journal/01_PROJECTS/Obvio_GTM_Operating_Ledger/`

Use date-first filenames for recurring reports.
