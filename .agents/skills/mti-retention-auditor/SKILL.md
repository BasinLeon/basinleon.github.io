---
name: mti-retention-auditor
description: Use when analyzing MTI onboarding, activation, repeat usage, and churn risk. Converts fuzzy product concerns into concrete retention hypotheses and tests.
---

# MTI Retention Auditor

Use this skill when Mock That Interview needs activation, onboarding, or repeat-usage analysis.

## Objective
Identify why users stall after signup and convert that into a small set of concrete retention tests.

## Inputs
Prefer these inputs when available:

- product walkthrough
- onboarding screens
- analytics snapshots
- first-session completion data
- user feedback or support messages

If data is missing, state that clearly and work from observable flow design.

## Workflow

### 1. Map the core loop
Define the user journey:

- arrive
- sign up
- start first interview
- complete first session
- receive value
- return for next session

### 2. Find the likely break
Look for friction such as:

- unclear first step
- too much setup before value
- weak explanation of what happens next
- no strong reason to return
- unclear distinction between free and paid value

### 3. Write retention hypotheses
Each hypothesis should be testable.

Examples:

- users sign up but do not start because the first-run experience is unclear
- users complete one session but do not return because there is no visible progression loop
- users do not convert because the premium value is not attached to a concrete outcome

### 4. Propose one test per problem
Examples:

- rewrite the intro screen
- shorten the path to first interview
- add a progress marker or next-step CTA
- improve the post-session recap and re-engagement copy

### 5. Summarize sharply
Return:

- likely drop-off point
- evidence
- recommended test
- expected signal

## What To Avoid

- generic UX advice
- adding features before proving the problem
- talking about retention without defining the user loop

## Principle

Retention improves when the user understands the next valuable action before they leave.
