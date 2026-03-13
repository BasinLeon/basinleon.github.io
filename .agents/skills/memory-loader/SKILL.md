---
name: memory-loader
description: Use at the start of a session, reconnection, or context handoff to quickly reload vault memory from canonical files in Basin & Associates and produce a concise working brief before execution.
---

# Memory Loader

## Overview
This skill provides a focused, repeatable workflow for this domain.

## When to Use
Use this skill when the task clearly matches this skill's domain and you need consistent execution.


Load persistent context from canonical vault files before doing substantive work.

## Workflow

1. Confirm workspace root is `/Users/basin/Desktop/Basin & Associates 🌍`.
2. Run `scripts/load_context.sh` to gather the latest memory snapshot.
3. Read the output sections in this order: lane, active pipeline, sprint plan, today's checklist.
4. Use the snapshot to align recommendations and execution priorities.
5. If any anchor file is missing, continue with available files and report what is missing.

## Canonical Anchors

See `references/anchors.md` for the source-of-truth paths.

## Output Contract

Produce a brief with:
- `Current lane` (one line)
- `Top 3 priorities` (flat list)
- `Immediate deadlines` (flat list with exact dates)
- `Assumptions` (if any files were missing/stale)

## Guardrails

- Prefer explicit dates over relative phrases.
- Do not invent status updates not present in anchor files.
- Keep bootstrap output concise so execution context remains lightweight.
