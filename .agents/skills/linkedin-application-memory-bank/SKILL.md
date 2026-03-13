---
name: linkedin-application-memory-bank
description: Use when LinkedIn export data includes saved screening question responses and you need to recover past application answers, detect claim drift, or build a reusable job-application memory bank
---

# LinkedIn Application Memory Bank

## Overview
Turn saved LinkedIn application responses into a reusable answer system. This skill mines screening-question exports to recover prior claims, identify repeated job filters, and build a consistent application memory bank.

## When to Use
- You have one or more `Job Applicant Saved Screening Question Responses*.csv` files
- You want to reuse past answers instead of rewriting application responses from scratch
- You need to check whether your job applications are making inconsistent claims
- You want to identify which experience categories recur across target roles

Do not use this for resume rewriting alone. Use it when the raw application-answer history itself is the source material.

## Inputs
- `Job Applicant Saved Screening Question Responses.csv`
- `Job Applicant Saved Screening Question Responses_1.csv`
- `Job Applicant Saved Screening Question Responses_2.csv`
- `Job Applicant Saved Screening Question Responses_3.csv`
- Optional: `Skills.csv`, `Learning.csv`, `Organizations.csv`

## Process
1. Merge all screening-response files into one working set.
2. Normalize repeated question types:
   - years of experience
   - education
   - certifications
   - industry claims
   - tool or function familiarity
3. Group answers into memory-bank buckets:
   - domain experience
   - tool experience
   - leadership / management
   - education and credentials
   - industry exposure
4. Detect claim drift:
   - same topic with conflicting year counts
   - inconsistent yes/no answers
   - weak answers that no longer match the current target narrative
5. Produce reusable outputs:
   - canonical answer bank
   - contradiction list
   - target-role fit themes
   - missing proof areas that should be reinforced elsewhere

## Output Shape
- Consolidated table of recurring questions and answers
- Conflict list for inconsistent claims
- Suggested canonical responses for future applications
- A short brief on what these applications imply about the target-role direction

## Heuristics
- Treat repeated question themes as stronger signal than one-off questions
- Flag any conflicting year-count answers, even if they are only off by one
- Separate true proof from convenience answers used to get through a form
- Use related skill and learning exports only for reconciliation, not as automatic truth

## Common Mistakes
- Copying old answers forward without checking for contradictions
- Treating all screening questions as equally important
- Ignoring industry-specific claim patterns that reveal target-role drift
- Building new application copy without learning from prior response history
