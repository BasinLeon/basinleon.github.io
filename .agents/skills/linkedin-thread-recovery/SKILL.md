---
name: linkedin-thread-recovery
description: Use when LinkedIn export data includes messages or invitations and you need to recover warm threads, prioritize follow-ups, or convert inbox history into actionable outreach lanes
---

# LinkedIn Thread Recovery

## Overview
Turn LinkedIn inbox history into live operator motion. This skill mines `messages.csv` and `Invitations.csv` for warm leads, stalled threads, inbound interest, and easy follow-up opportunities.

## When to Use
- You have a LinkedIn data export with `messages.csv`
- You want to recover warm intros instead of generating more cold outreach
- You need to identify who engaged before, who should be reactivated, and which conversations map to the current operator narrative
- You want to convert inbox history into Desk rows, follow-up notes, or Obsidian working lists

Do not use this for writing broad cold outreach from scratch. Use it for warm-thread recovery.

## Inputs
- `messages.csv`
- `Invitations.csv`
- Optional: `guide_messages.csv`
- Optional: `Connections.csv` for enrichment

## Process
1. Count message volume, conversation count, and recent activity windows.
2. Identify warm patterns:
   - inbound product or partnership interest
   - recruiter outreach
   - founder or executive replies
   - stalled follow-ups
   - recent connection requests that never advanced to conversation
3. Score threads by practical value:
   - direct relevance to AI, GTM, cybersecurity, RevOps, recruiting, or builder networks
   - recent activity
   - evidence of prior interest
   - ease of reactivation
4. Produce small, named segments:
   - `Warm founders`
   - `Recruiters to revisit`
   - `Inbound vendor or partner pitches`
   - `Follow-up due`
   - `Low-signal archive`
5. Convert the top threads into:
   - Obsidian notes
   - Desk rows
   - short reactivation copy

## Output Shape
- Short summary of message volume and top thread themes
- Table of highest-value conversations
- Recommended next action for each thread
- Optional reactivation draft in plain English

## Heuristics
- Prioritize threads where the other party initiated
- Prioritize recent 90-day and 180-day activity windows
- Prefer conversations tied to target companies, active roles, or current operator narratives
- Treat empty connection requests as weaker than real back-and-forth messages
- If `guide_messages.csv` is empty, ignore it rather than creating a fake sub-workflow

## Common Mistakes
- Treating all messages as equal instead of ranking by commercial relevance
- Reopening dead threads with generic copy
- Ignoring recruiter or founder messages because they were short
- Failing to distinguish inbound opportunity from noise
