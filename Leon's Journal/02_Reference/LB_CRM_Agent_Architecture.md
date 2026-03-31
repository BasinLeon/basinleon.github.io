---
type: Strategy
status: Active
project: LB CRM
tags:
  - CRM
  - Skills
  - Operator
  - Automation
---

# LB CRM Agent Architecture

## Goal
Build a personal CRM that supports:

- networking
- connecting
- job search
- revenue opportunities
- partner lanes

## First Agent Skills

### 1. Opportunity ingest
Skill: `lb-crm-opportunity-ingest`

Purpose:
- ingest HTML dashboards
- convert notes and emails into structured opportunities
- patch spreadsheets or generate import-ready payloads

### 2. People orbit sync
Skill: `lb-crm-people-orbit-sync`

Purpose:
- keep named contacts tied to live opportunities
- preserve relationship status and next steps

## Recommended Next Agents

### 3. Follow-up queue manager
Build a skill that identifies stale threads and proposes the next best follow-up.

### 4. Job lane updater
Build a skill specifically for recruiter threads, interview stages, and compensation tracking.

### 5. Boardy relationship intake
Build a skill that turns Boardy intros into CRM records automatically.

## Principle

The CRM should behave like an operating system, not a static spreadsheet.
