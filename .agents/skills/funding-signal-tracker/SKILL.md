---
name: funding-signal-tracker
description: Use when you need to track venture capital funding rounds, acquisitions, and investment signals in a specific sector to identify market momentum and new threats.
---

# Funding Signal Tracker

## Overview
Monitoring capital flow into specific sectors to identify emerging competitors, validate market timing, and understand what capabilities venture capitalists are currently valuing.

## When to Use
- You want to see who is getting funded in your space (e.g., AI sales infrastructure, routing engines).
- You need to understand the "use of funds" for a competitor to predict their next move.
- You are looking for early-stage startups that might disrupt your positioning before they launch.

## Core Pattern
This skill tracks the flow of capital by monitoring tech press, funding databases, and press releases.

### 1. Identify the Targets
- **Sector Focus:** e.g., "Revenue Operations", "AI Sales Tech", "Lead Orchestration"
- **Key Investors:** Tracking specific VC firms known for investing in this space.

### 2. Capture the Signal
Use web search to find recent funding announcements:
- Search queries like: `("Series A" OR "Seed" OR "funding") AND ("AI sales" OR "lead routing")`
- Monitor tech news sites (TechCrunch, PR Newswire, specialized sector blogs).

### 3. Decode the Intent
A funding announcement is a strategic document. Extract the critical metadata:
- **The Amount and Stage:** (e.g., $5M Seed vs $40M Series B) indicates their maturity and runway.
- **The Narrative:** How are they describing the problem they solve to investors? This reveals their GTM positioning.
- **The Use of Funds:** Are they hiring engineering (building) or sales (scaling)?

## Execution Workflow
When tasked with a funding scan:

1. Execute targeted searches for recent capital events in the specified domain.
2. Analyze the press releases and coverage of the funding rounds.
3. Extract the amount, the lead investors, and the stated purpose of the capital.
4. Synthesize this into a map of where capital is flowing in the ecosystem.

## Common Mistakes
- **Focusing only on the dollar amount:** The narrative and the investors often matter more than the raw number.
- **Ignoring stealth startups:** Look for founders who recently left major players (like Gong or Outreach) and have raised unannounced seed rounds.
- **Reporting stale data:** Funding news ages quickly. Ensure searches are restricted to recent timeframes (e.g., past 30-90 days).

## Example Output Structure
1. **The Event:** [Company raised $X from Y]
2. **The Stated Problem:** [The narrative they sold to investors]
3. **Strategic Vector:** [Are they building, scaling, or acquiring? How does this impact our space?]
