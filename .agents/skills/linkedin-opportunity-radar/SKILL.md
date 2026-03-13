---
name: linkedin-opportunity-radar
description: Use when LinkedIn export data includes saved job alerts, organizations, registrations, or rich media and you need to infer search intent, target-company direction, or public-signal strategy
---

# LinkedIn Opportunity Radar

## Overview
Use LinkedIn export metadata to infer where attention is actually going. This skill turns job alerts, organizational memberships, and public media traces into an opportunity radar for career search, community positioning, and target-account focus.

## When to Use
- You have `SavedJobAlerts.csv`, `Organizations.csv`, `Rich_Media.csv`, or `Registration.csv`
- You want to understand target role drift, geography preferences, or community alignment
- You need a tighter target-company or target-role map
- You want to audit how public profile media supports or weakens your current direction

Do not use this for pure CRM lead scoring. Use it for career and market-direction inference.

## Inputs
- `SavedJobAlerts.csv`
- `Organizations.csv`
- `Rich_Media.csv`
- `Registration.csv`
- Optional: `Company Follows.csv`, `Events.csv`

## Process
1. Parse saved job alerts for:
   - recurring keywords
   - geographies
   - workplace preferences
   - frequency and urgency
2. Review organizations for long-term affinity signals:
   - communities
   - professions
   - identity and leadership associations
   - historic domain anchors
3. Review rich media for public proof and recency:
   - documents
   - photos
   - profile-supporting media
4. Synthesize an opportunity radar:
   - current search intent
   - underexploited communities
   - target-role clusters
   - public-asset cleanup or refresh needs
5. Produce a short action list:
   - roles to prioritize
   - communities to reactivate
   - media assets to upgrade

## Output Shape
- Search-intent summary
- Target-role and geo matrix
- Community map
- Public-profile media audit
- Priority actions for the next 30 days

## Heuristics
- Repeated job-alert keywords matter more than one-off alerts
- Recent media uploads matter more than old profile artifacts
- Organizations indicate durable affiliation, not always current priority
- Combine alert signals with company follows before making target-company calls

## Common Mistakes
- Treating old community memberships as present-moment priorities
- Ignoring job-alert geography and workplace filters
- Assuming profile media is current just because it exists
- Looking at alerts without checking whether the surrounding network supports the target lane
