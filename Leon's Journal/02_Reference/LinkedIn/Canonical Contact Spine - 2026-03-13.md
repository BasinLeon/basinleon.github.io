# Canonical Contact Spine - 2026-03-13

## Purpose
- Establish one merged CRM baseline across the existing Basin deduped universes and the March 12, 2026 LinkedIn export layer.
- Give Scout and the vault one shared headline number instead of mixing legacy in-browser counts with newer LinkedIn imports.

## Canonical Count
- Canonical merged contact spine: `44,487`

## Merge Inputs
- `/Users/basin/Desktop/Basin & Associates 🌍/MASTER_CONTACTS_MERGED_DEDUPE_2026-02-19.csv`
- `/Users/basin/Desktop/Basin & Associates 🌍/ALL_BASIN_NEXUS_CRM_MERGED_DEDUPE_2026-02-20.csv`
- `/Users/basin/Desktop/Basin & Associates 🌍/docs/data/linkedin-full-index.js`

## Supporting Metrics
- Master rows kept: `33,555`
- Master rows dropped for being empty: `115`
- LinkedIn people processed into the merge: `13,324`
- Additional Basin rows processed from the broader merge layer: `292`

## Artifacts
- Summary:
  - `/Users/basin/Desktop/Basin & Associates 🌍/docs/data/canonical-contact-spine-summary.json`
- UI summary payload:
  - `/Users/basin/Desktop/Basin & Associates 🌍/docs/data/canonical-contact-spine-summary.js`
- Canonical merged CSV:
  - `/Users/basin/Desktop/Basin & Associates 🌍/output/spreadsheet/canonical_contact_spine_2026-03-13.csv`

## Interpretation
- The CRM baseline that best matches the full workspace is not the LinkedIn-only layer.
- The best current single headline number is `44,487` contacts in the canonical merged spine.
- This is the right number to surface in Scout when the goal is one combined CRM view.
