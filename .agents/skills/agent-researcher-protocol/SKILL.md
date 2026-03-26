---
name: agent-researcher-protocol
description: Use when performing deep research, competitive intelligence, or market analysis to ensure high-fidelity data and strategic synthesis.
---

# Agent Researcher Protocol: The Intelligence Layer

## Overview
This skill transforms "web searching" into **"Strategic Intelligence."** It forces agents to move beyond surface-level summaries and find the "Operational Truth" hidden behind PR marketing and AI-generated SEO slop.

## When to Use
- Analyzing a competitor’s actual tech stack (not their marketing claims).
- Vetting a prospective client’s "Logic Gaps" before an intro call (e.g., NBC, Replit).
- Identifying market trends that actually impact revenue/yield.
- Fact-checking high-stakes claims.

## 🏛️ The Source Hierarchy (Priority Order)
1.  **Direct Proof:** SEC Filings (10-K), official press releases, job postings (indicates actual hiring tech needs).
2.  **Professional Signals:** LinkedIn profiles of key technical leaders (look for specific tool mentions in their experience).
3.  **Community Truth:** Reddit (r/sales, r/revops), specialized forums, or GitHub repos.
4.  **Secondary Junk (Lowest Priority):** "Top 10" blog posts, AI-generated summary sites, and general news articles.

## 🐉 The "Shadow Intelligence" Workflow

### Phase 1: The "Lead-with-Value" Audit
Don't just look for "what they do." Look for **"where they are leaking."**
- **Trigger:** "Find out about Company X."
- **Action:** 
   - Check their LinkedIn "People" tab. Are they lacking RevOps?
   - Check their job board. Are they hiring for "Clay" or "n8n" specialists? (Indicates a pivot to automation).
   - Check their site's tech stack (using `browser_subagent` to view headers/scripts).

### Phase 2: Detecting the "Logic Gap"
Compare what the brand **says** on their homepage vs what their **product/team** actually delivers.
- **Example (Naano):** They say "Scalable Revenue," but the math shows "€1/click." The gap is the status of the worker.

### Phase 3: Strategic Synthesis
Never return a list of links. Always return a **Battle Card**:
- **Objective:** What is the goal of this research?
- **Intel:** The 3 non-obvious facts discovered.
- **The Strike:** How should Leon use this intel to win the call?

## 🛠️ Tool Selection Matrix
| Goal | Tool | Logic |
| :--- | :--- | :--- |
| **Broad Context** | `search_web` | Best for high-level "Who is this?" |
| **Deep Audit** | `browser_subagent` | Navigating dashboards, reading fine print, viewing UI flows. |
| **Lead Generation** | `scrapling-leadgen` | Bypassing CDNs to find hidden contact signals. |
| **Internal Context** | `list_dir` / `grep` | Finding what Leon *already knows* in the VAULT. |
| **Swarm Scout** | `scripts/swarm_engine/swarm_orchestrator.py` | Detects GitHub/Job pressure and infrastructure vacuums. |

## 🚩 Researcher Red Flags (Kills)
- **Repeating Marketing Copy:** If your report sounds like their homepage, you have failed.
- **Vague Dates:** "Recently" is not a date. "On March 17, 2026" is a date.
- **No Perspective:** Research without a recommendation is just a Wikipedia copy-paste.

## Implementation
Every research task must end with: **"Leon's Advantage: [1-sentence strategic leverage point]."**
