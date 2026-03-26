---
name: patent-ip-monitor
description: Use when you need to track patent filings or intellectual property registrations in a specific technical domain to protect your own IP or anticipate competitor capabilities.
---

# Patent and IP Monitor

## Overview
Systematic tracking of patent filings and intellectual property registrations to identify emerging threats, protect proprietary workflows (like AI sales routing), and map the innovation landscape of a specific sector.

## When to Use
- You are developing a novel architecture (e.g., "real-time lead qualification") and need to ensure freedom to operate.
- You want to know what foundational technology a competitor is trying to lock down.
- You need to monitor specific keywords or categories in patent databases.

## Core Pattern
This skill uses structured search queries against public patent databases to surface relevant filings.

### 1. Define the Search Vector
Identify the precise technical categories and keywords:
- **Action keywords:** "routing", "qualification", "bridging", "scoring"
- **Context keywords:** "real-time", "AI", "sales", "lead", "video"
- **Competitor names:** Specific entities to track.

### 2. Execute the Search
Use web search tools to query patent databases (like Google Patents or USPTO searches).
- Example query: `site:patents.google.com ("AI sales routing" OR "real-time lead qualification")`

### 3. Analyze the Filings
When a relevant patent is found, extract:
- **The Assignee:** Who owns it?
- **The Core Claim:** What EXACTLY are they claiming to have invented? Is it a broad concept or a specific technical implementation?
- **The Status:** Is it an application (pending) or a granted patent?

## Execution Workflow
When tasked with an IP monitor scan:

1. Construct a highly specific boolean search query based on the user's technical domain.
2. Search patent databases for recent filings (focusing on the last 12-24 months for emerging tech).
3. Review the abstracts and first independent claims of the top results.
4. Synthesize the findings, explicitly separating broad conceptual patents from narrow technical ones.

## Common Mistakes
- **Misinterpreting applications as granted patents:** An application (often ending in A1) is just a request. It does not mean they own the IP yet. Always check the status.
- **Reading the description instead of the claims:** The description of a patent can cover anything. The *claims* at the end define the actual legal boundary. Focus analysis on the claims.
- **Searching too broadly:** A search for "AI sales" will return noise. Search for specific architectural components (e.g., "automated video bridging based on lead score").

## Example Output Structure
1. **Entity/Filing:** [Who filed what]
2. **The Core Claim:** [The specific mechanism they are trying to protect]
3. **Impact Assessment:** [Does this overlap with our architecture? Does it block us?]
