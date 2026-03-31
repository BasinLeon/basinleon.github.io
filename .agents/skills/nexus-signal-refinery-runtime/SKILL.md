---
name: nexus-signal-refinery-runtime
description: Use when turning raw market or account signals into a runnable Basin::Nexus intake layer with ingest sources, normalization, entropy filtering, and operator-ready output.
---

# Nexus Signal Refinery Runtime

## Overview

Use this skill when the diagram needs to become a working intake layer.

This is Layer 1 of Basin::Nexus: the Signal Refinery. Its job is to ingest noisy external inputs, normalize them into one schema, and reduce entropy before anything reaches scoring or routing.

## When to Use

- A prospect asks whether the signal layer can actually run.
- You need to build or demo source ingestion instead of just describing it.
- Multiple sources need to land in one clean intermediate record.
- The current flow jumps straight from sourcing to outreach without a refinement layer.

## When Not to Use

- Final routing logic or operator action surfaces.
- Pure copywriting or visuals without implementation intent.
- CRM-only automation where signal interpretation is out of scope.

Use `nexus-logic-gates-runtime` for decision logic. Use `nexus-actuator-console-runtime` for execution and handoff.

## Core Output

Produce a refinery that does four things:

1. defines signal sources,
2. maps them into one canonical record,
3. filters out entropy,
4. emits a clean candidate list for scoring.

## Canonical Record

Every source should collapse into one normalized object with fields such as:

- `account_name`
- `person_name`
- `title`
- `signal_type`
- `signal_source`
- `signal_timestamp`
- `signal_summary`
- `fit_hint`
- `urgency_hint`
- `confidence_hint`
- `raw_url`
- `raw_payload_ref`

If the source cannot support a field, leave it null rather than inventing values.

## Workflow

1. Lock the sources.
   Default sources are high-gravity changes: job changes, funding, hiring, tech-stack shifts, buyer intent, competitor displacement, and executive movement.
2. Define one intermediate schema.
   Do not let each source produce its own downstream shape.
3. Normalize first.
   Clean names, titles, timestamps, and company identities before scoring.
4. Run entropy filters.
   Drop duplicates, stale events, weak-fit accounts, and signals with no actionable context.
5. Emit an operator-readable artifact.
   Default artifact is JSON, CSV, or a simple HTML/HUD list with one row per validated candidate.

## Runtime Defaults

- Implementation stack: Python for ingestion and normalization.
- Persistence: flat files or SQLite first; do not force a database unless volume requires it.
- Verification: log counts for `raw`, `normalized`, `filtered_out`, and `emitted`.
- Demo mode: keep one small deterministic fixture set ready for live walkthroughs.

## Demo Pattern

If you need to prove this live on a call, show:

1. one raw source record,
2. the normalized Basin::Nexus candidate record,
3. the entropy filters applied,
4. the final emitted candidate list.

## Exit Criteria

This layer is complete when:

- at least one real or fixture source ingests successfully,
- all records map into one schema,
- entropy filters are explicit,
- the output is clean enough for Layer 2 scoring without manual cleanup.
