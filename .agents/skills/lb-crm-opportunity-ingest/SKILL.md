---
name: lb-crm-opportunity-ingest
description: Use when ingesting opportunities from HTML dashboards, email summaries, notes, or screenshots into Leon's pipeline trackers. Maps messy source material into structured rows for job, revenue, and partner pipelines.
---

# LB CRM Opportunity Ingest

Use this skill when Leon wants to move opportunities from a messy source into a structured CRM or tracker.

## Sources This Skill Handles

- operator HTML dashboards
- copied email lists
- notes from calls
- screenshots of trackers
- pipeline summaries from chat

## Objective
Convert raw opportunity signals into clean rows with:

- company / account
- contact
- lane or type
- stage
- next step
- status
- last touch or date applied

## Core Rule
Do not preserve the source format.

Translate it into a clean operating schema.

## Workflow

### 1. Identify the source of truth
Prefer structured data when available:

- embedded JSON in HTML
- spreadsheet rows
- clear pasted tables

### 2. Deduplicate
If an opportunity already exists:

- update it instead of duplicating it
- preserve the strongest existing contact and context

### 3. Map into the target schema
For job pipelines, map into fields like:

- Date Applied
- Company
- In conversation
- Interviewing
- Position
- Contact
- Status

For broader CRM systems, preserve:

- opportunity type
- stage
- next step
- pipeline value
- notes

### 4. Normalize statuses
Turn messy stages into stable language where possible.

Examples:

- `Follow-Up Due`
- `Active`
- `Interviewing`
- `Closed`
- `Awaiting Reply`
- `Proof Delivered`

### 5. Save the artifact
Produce:

- a patched spreadsheet, or
- an import-ready CSV, or
- a JSON payload for the operator console

## What Good Looks Like

- no duplicate accounts
- clear stage naming
- dates preserved
- next steps not lost
- import-ready structure

## Principle

Ingest is not copying.
Ingest is translation into operating structure.
