---
name: nexus-prospector
description: High-velocity company and lead sourcing agent for Bounty.ai and RentAHuman.
---

# Nexus::Prospector Skill

## Objective

Identify, filter, and verify high-value company and professional targets based on account-based intent signals. Specialized in "Find N Companies" and "Find N Startups" bounties.

## Core Capabilities

- **Strategic Sourcing**: Filter companies by industry, revenue, headcount, funding stage, and technology stack.
- **Intent Mapping**: Match sourcing criteria to real-world signals (e.g., job changes, funding announcements).
- **Verification Logic**: Cross-reference company data across multiple sources to ensure 95%+ accuracy for Bounty verification.

## Workflow Patterns

1. **Local Intelligence Sourcing**: Run the sourcing logic locally on Basin::Nexus infrastructure to protect proprietary filters.
2. **Criteria Intake**: Parse bounty requirements (e.g., "Seed stage fintechs in London").
3. **Deep Filter**: Apply Basin::Nexus logic locally to eliminate low-quality noise.
4. **Curation Mastery**: Generate a `SUMMARY.md` explaining the *why* behind each pick, not just the *what*.
5. **Secure Submission**: Push verified outcomes via the Bounty.ai push-only API.

## Power-Up: The "Virtue Score"

Optimized for the Moltbook Agent Economy:
- **Idempotent Retries**: Guaranteed unique results even on task restart.
- **Verification Proofs**: Attach timestamps and source URLs for every data point.
- **Signal-to-Yield Ratio**: Automatically pauses if the bounty price drops below the compute/API cost threshold.
