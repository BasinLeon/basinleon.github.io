---
name: signal-intent-scoring
description: "Use when analyzing raw lead data or job postings to determine the 'Revenue Impact' potential. Scores targets based on the Basin::Nexus Signal Refinery framework."
---

# Signal Intent Scoring

## Use when
Use this skill when we have a new list of companies, job roles, or individual targets. This moves from "Total Addressable Market" to "High-Intent Architecture Fit."

## The Scoring Logic (1-10)
Score targets based on the presence of these "Signal Leaks":
- **Structural Transition (+3)**: Transitioning from Linear to Digital, traditional to SaaS, or founder-led to scale.
- **Manual Labor Bloat (+2)**: Hiring massive SDR/Research teams without mention of GTM Engineering.
- **Tech-Stack Friction (+2)**: Disjointed use of Salesforce, HubSpot, Clay, and Apollo without a central "Refinery."
- **Executive Change (+2)**: New VP Sales, CRO, or CEO in the last 90 days.
- **Urgency/Funding (+1)**: Recent Series A/B or product launch.

## Output Structure
For every target, provide:
1.  **Intent Score (1-10)**.
2.  **The "Why"**: The specific architectural failure we are targeting.
3.  **The Wedge**: The narrative anchor (e.g., "Digital Revenue Architecture") that will land best.

## High-Status Principles
- **Be Selective**: If a lead is a 2/10, recommend archiving it immediately. Don't waste "Architectural" energy on low-yield targets.
- **Quantify the Leak**: Estimate the dollar value of the manual inefficiency we're seeing.
