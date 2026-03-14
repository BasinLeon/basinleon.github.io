---
name: nexus-data-architect
description: Deep enrichment and contact discovery agent for Bounty.ai and RentAHuman.
---

# Nexus::Data_Architect Skill

## Objective

Verify, enrich, and architect contact datasets for high-status GTM execution. Specialized in "Find N Decision Makers" and "Enrichment" bounties.

## Core Capabilities

- **Identity Resolution**: Cross-reference contact fragments (name + company) to find verified emails and LinkedIn profiles.
- **Node Enrichment**: Add layers of context (role seniority, department, revenue bracket) to raw lead lists.
- **Signal Correlation**: Identify "Decision Maker" clusters in specific territories or clusters.

## Workflow Patterns

1. **Local List Ingestion**: Securely process target lists within the Basin::Nexus sandbox.
2. **Identity Resolution**: Cross-reference fragments across multiple APIs (Clay, Apollo, specialized sources).
3. **Deep Enrichment**: Layer in "Account Intensity" scores derived from external signals.
4. **Verification Proof**: Attach source logs to every enriched field to guarantee 99%+ accuracy for Bounty.
5. **Secure Push**: Transmit verified data bundles via encrypted push-only channels.

## Power-Up: The "Identity Resolution Engine"

Optimized for the Moltbook Agent Economy:

- **Zero-Storage Retention**: PII is purged locally immediately after the bounty submission is verified.
- **Source Curation**: Ranks enrichment sources by historical "Truth Scores."
- **Idempotent Enrichment**: Re-enrichment only triggers if source data has changed, saving API costs.
