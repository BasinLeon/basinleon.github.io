---
name: signal-intent-scoring
description: "Use when analyzing raw lead data or job postings to determine the 'Revenue Impact' potential. Scores targets based on the Basin::Nexus Signal Refinery framework."
---

# Signal Intent Scoring

## Overview

Automate the qualification of "Strategic Targets" by grading deep signal triggers. This replaces manual "vibe checks" with an engineered scoring system.

## The Process

### 1. Data Ingestion

- Extract headcount trends from LinkedIn/Crunchbase.
- Note funding rounds (Series A/B is the sweet spot).
- Identify "Deviance Triggers" from job descriptions:
  - High volume of "Founding SDR" roles = **High Latency signal**.
  - Mentions of "Manual CRM entry" = **Broken Pipe signal**.
  - "Starting the GTM from scratch" = **Vacuum signal**.

### 2. Scoring Algorithm (0-100)

- **Base Score (40)**: Series A/B Funding.
- **Complexity Multiplier (+20)**: Shifting from PLG to Enterprise sales.
- **Friction Bonus (+30)**: High hiring volume for manual roles (SDR/BDR).
- **Architecture Penalty (-20)**: 500+ headcount (Too much bureaucratic friction).

### 3. Verdict Generation

Output a "Lead Status Brief":

- **Grade**: e.g., "92/100 (HIGH SIGNAL)".
- **Diagnosis**: e.g., "Target is launching missions with erring O-rings (manual prospecting for an AI product)."
- **Strike Angle**: Identify the specific Basin::Nexus module to pitch (e.g., "Signal Refinery").

## Key Principles

- **Score the Problem, Not the Product**: Focus on their operational failure.
- **Temporal Discounting**: Leads decay. Prioritize "Fresh" signals over "Stale" ones.
- **Bias for Engineering**: Favor targets where a Python script can replace 3 humans.
