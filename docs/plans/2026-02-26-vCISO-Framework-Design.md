---
title: vCISO Compact Async Framework
date: 2026-02-26
owner: Leon Basin
status: planning
---

# vCISO + NIST/SOC2/ISO Mapping Framework

## 1. Canonical Control Object Model
A single source of truth for every security control, decoupled from specific frameworks.

- **UID**: `BASIN-CTRL-001`
- **Namespace**: `Identity & Access`
- **Core Requirement**: "Multi-factor authentication must be enforced for all administrative access."
- **Framework Mappings**:
  - NIST CSF v2.0: PR.AA-01
  - SOC 2: CC6.1
  - ISO 27001:2022: A.5.15
- **Evidence Schema**: {Source: Okta/AzureAD, Method: API Query, Validation: Boolean}
- **Priority Weights**: {Risk: 0.8, Exploitability: 0.9, Business: 1.0}

## 2. Cross-Framework Mapping Logic
The "Translation Layer" that allows one remediation effort to satisfy multiple audits.

| Control Category | NIST CSF | SOC 2 (TSC) | ISO 27001 | Evidence Source |
|------------------|----------|-------------|-----------|-----------------|
| Asset Management | ID.AM    | CC6.1       | A.5.9     | MDM API / Inventory |
| Access Control   | PR.AC    | CC6.1, CC6.2| A.5.15    | Identity Provider |
| Data Protection  | PR.DS    | CC6.1, CC6.7| A.5.10    | DLP / Cloud Logs |
| Incident Response| RS.AN    | CC7.3       | A.5.24    | SIEM / SOAR |

## 3. Evidence Continuity Pattern (The Loop)
Continuity vs. Checklists.

1. **Capture**: Automated ingestion from technical source (API/Webhook).
2. **Validate**: AI-assisted verification of evidence completeness/authenticity.
3. **Attach**: Dynamic linking to the Canonical Control Object.
4. **Attest**: Immutable log entry with owner sign-off (Decision-grade proof).

## 4. Remediation Prioritization Rubric
Formula: `Score = (Risk Score × 0.4) + (Exploitability × 0.4) + (Business Impact × 0.2)`

- **Tier 1 (9.0+)**: Immediate remediation (Outbound Wedge).
- **Tier 2 (7.0-8.9)**: Schedule for next sprint.
- **Tier 3 (<7.0)**: Backlog / Accept Risk.

## 5. Sample "Decision-Grade" Gap Output
The "Outbound Wedge" artifact designed to drive buyer urgency.

### [Draft Mockup]
**Executive Summary: Critical Control Drift detected in Identity Governance.**
- **Gap**: 40% of administrative accounts lack enforced MFA (NIST PR.AA-01).
- **Secondary Impact**: This invalidates SOC 2 CC6.1 compliance for Q1.
- **Exploitability**: High (Credential stuffing exposure).
- **Action**: Immediate enforcement via Okta Policy [Link to Remediation Path].
