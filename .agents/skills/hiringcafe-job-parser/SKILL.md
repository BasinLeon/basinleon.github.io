---
name: hiringcafe-job-parser
description: "Parse raw job postings (HiringCafe/Wellfound/company pages) into strict structured JSON using a schema-first extraction prompt."
---

# HiringCafe / Wellfound Job Parser

## Use when
Use this skill when the user provides a URL or copy-paste of a job description from HiringCafe, Wellfound, LinkedIn, or a company career page. Use this to prepare for "Revenue Architect" or "GTM Engineer" interviews.

## The Extraction Schema

When parsing, look for these specific "Architecture" indicators:

1.  **Technical Stack**: Look for CRM (HubSpot/SFDC), Enrichments (Clay, Apollo), and Automations (n8n, Python).
2.  **The "Yield" Problem**: Is the company struggling with "Volume" or "Conversion"?
3.  **The Architecture Hierarchy**:
    - **Standard Implementation**: Just running existing tools.
    - **Strategic Construction**: Building new systems from scratch (The 0-to-1 build).
4.  **Implicit Bottlenecks**: If they mention "scaling the team from 5 to 50," the bottleneck is **Administrative Overhead** (The "Manual Grind").

## Output Structure

The skill should output a **"Meeting Battle Card"** with:
- **The Core Diagnosis**: "They think they are hiring a salesperson, but they actually need an Architect to fix their fragmented CRM logic."
- **The 3-Phase Roadmap**: Suggested 30/60/90 day plan for this specific role.
- **The "Founder Neutralizer" Narrative**: How to handle Leon's "founder" background for this specific company.

## High-Status Principles
- **Identify the Signal Leak**: Point out exactly where the JD suggests they are losing money (e.g., "They have no mention of data science for sales; they are likely relying on manual research").
- **Don't Match the JD; Match the Need**: Don't just list Leon's skills that match; list the **problems he solves** that they didn't even know they had.
- **Quantify the ROI**: "Adding a Signal Refinery layer here would likely reduce their projected headcount needs by 20%."
