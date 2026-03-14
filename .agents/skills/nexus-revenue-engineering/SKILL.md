---
name: nexus-revenue-engineering
description: Build deterministic GTM infrastructure and automated revenue systems. Focuses on idempotency, data pipelines, and regional hub clustering.
---

# Nexus Revenue Engineering Protocol

Use this skill when building automated GTM workflows, CRM connectors, or intelligence layers. Focus on **Reliability** and **Yield**.

## Engineering Principles

1. **Idempotency Shields**: Every outcome must have a unique ID to prevent double-spending or redundant API calls (e.g., Bounty.ai $0.25 signals).
2. **Zero-Storage PII**: Purge PII immediately after ingestion into the intelligence layer to maintain the highest security standard.
3. **Cluster Logic**: Design systems to locate regional hubs (e.g., "Tel Aviv Cybersecurity Hub") rather than just single-target leads.
4. **Logic Layers**: Separate the **Commodity Layer** (raw data) from the **Intelligence Layer** (your proprietary logic) and the **Economic Layer** (the client's outcome).

## Technical Standards

* **Language**: Prefers TypeScript/JavaScript for web-based HUDs and Python for data refinery scripts.
* **Speed**: Target sub-minute ingestion for signal batches (as seen in the 68s cybersecurity sprint).
* **Verification**: Every system must output a `Verification Proof` to ensure trust.

## The Builder Mindset

* You are not a vendor; you are building internal infrastructure that removes manual bottlenecks.
* If a process can be automated into a "Nexus Governor," do it.
