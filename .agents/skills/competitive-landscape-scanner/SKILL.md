---
name: competitive-landscape-scanner
description: Use when you need to monitor competitors for feature releases, messaging shifts, or pricing changes that encroach on your market positioning.
---

# Competitive Landscape Scanner

## Overview
Automated tracking of direct and indirect competitors to identify strategic shifts, feature parity threats, and messaging overlaps before they impact your pipeline.

## When to Use
- You need to track specific competitors (e.g., Clay, Apollo, Gong) for new feature launches.
- You suspect a competitor is shifting their messaging to target your ICP.
- You want to identify gaps in a competitor's public presence (like hidden pricing) to exploit in your GTM motion.
- You need to prepare a competitive teardown or battlecard.

## Core Pattern
This skill operates by establishing a baseline of a competitor's public surface area and monitoring for deltas.

### 1. Define the Surface Area
Identify the exact URLs and channels to monitor for the target competitors:
- Main homepage (for top-level positioning shifts)
- Product/Features page (for new capabilities)
- Pricing page (for tier or cost changes)
- Company blog or newsroom (for content velocity and strategic narratives)

### 2. Establish the Baseline
Capture the current state of these surfaces. What are they saying *right now*? What are they *not* saying?

### 3. Monitor for Deltas
Look for specific trigger events:
- **Velocity spikes:** Sudden increase in blog posts or PR around a specific theme (indicates a coordinated GTM push).
- **Positioning pivots:** Changes in the H1 tag on the homepage or the primary target audience mentioned.
- **Feature matching:** New capabilities that close the "logic gap" between their tool and your solution.

## Execution Workflow
When tasked with a competitive scan:

1. Use `read_url_content` or `browser_subagent` to analyze the target surfaces.
2. Extract the core narrative (who are they targeting, what is the primary value prop).
3. Identify what is missing (e.g., "No pricing transparency", "No mention of real-time routing").
4. Synthesize the findings into an actionable intelligence brief for the user.

## Common Mistakes
- **Tracking too broadly:** Don't monitor their entire internet presence. Focus tightly on the surfaces that signal GTM shifts (homepage, pricing, product updates).
- **Reporting raw changes:** Don't just report "they changed their headline." Report the *intent* behind the change. (e.g., "They changed their headline to target Enterprise, signaling an upmarket move.")
- **Ignoring the gaps:** Often what a competitor is *not* saying (like hiding their pricing) is the most valuable intelligence.

## Example Output Structure
1. **The Shift:** [What changed or what narrative is being pushed]
2. **The Threat:** [How this impacts our positioning]
3. **The Gap:** [What they are missing that we can exploit]
