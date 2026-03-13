---
name: crm-taxonomy-baseline
description: Use when the user wants to understand a contact universe by company, title, industry, and segment before building outreach, dashboards, scoring, or operator workflows
---

# CRM Taxonomy Baseline

## Overview

This skill turns a large contact universe into a usable shape report.

The point is not just "how many leads do we have?" The point is "what kind of network is this, which companies dominate it, which titles dominate it, and where is industry coverage still weak?"

## When to Use

Use this skill when:
- a CRM or contact export has been merged and needs a baseline
- the user asks for industries, job titles, companies, segments, or coverage
- Scout, Desk, or another surface needs credible index stats
- ranking logic needs a taxonomy layer before scoring

Do not use this skill when:
- the task is only to import files without analysis
- the user needs outreach copy rather than contact-shape analysis

## Process

1. Identify the best current canonical contact source.
2. Inspect the schema first. Do not assume `industry` exists in the main spine.
3. Count the baseline fields:
   - total contacts
   - top companies
   - top job titles
   - top segments
   - top industries
4. If a key field is missing from the canonical spine, enrich from the strongest nearby source using stable identity keys:
   - LinkedIn URL
   - email
   - normalized name + company
5. Record coverage honestly:
   - industry coverage count
   - industry coverage percent
   - unknown company count
6. Save the result in both machine-readable and human-readable forms:
   - JSON or CSV for product surfaces
   - Markdown note for Obsidian
7. Surface the caveat clearly if the taxonomy is incomplete.

## Output Standard

Every baseline should answer:
- How many contacts are in the current canonical spine?
- Which companies appear most often?
- Which titles appear most often?
- Which segments dominate the graph?
- How much industry coverage is real versus inferred?

## Good Output

- "Canonical CRM baseline: 44,487 contacts. Top titles are Founder, CEO, Co-Founder, President, and Account Executive. Industry coverage is 3.16%, so company/title baselines are stronger than industry baselines right now."

## Bad Output

- "There are a lot of leads in many industries and roles."

## Exit Criteria

This skill is complete when:
- the taxonomy is saved to disk
- Obsidian has a readable baseline note
- coverage limits are explicit
- the next scoring or UI step can reference the baseline without guessing
