# Unified Data Hub - 2026-03-13

## Purpose
- Create one place to see the data universe across LinkedIn export files, prior Basin CRM merges, outreach queues, and app-side data feeds.
- Stop treating the CRM as only the March 12 LinkedIn export.

## Primary Hub Files
- Machine-readable manifest:
  - `/Users/basin/Desktop/Basin & Associates 🌍/docs/data/unified-data-hub.json`
- Spreadsheet inventory:
  - `/Users/basin/Desktop/Basin & Associates 🌍/output/spreadsheet/unified_data_hub_inventory_2026-03-13.csv`

## Highest-Value CRM Sources

### 1. LinkedIn Export Layer
- Folder:
  - `/Users/basin/Desktop/Basin & Associates 🌍/Basic_LinkedInDataExport_03-12-2026.zip`
- Key files:
  - `Connections.csv`
  - `messages.csv`
  - `Invitations.csv`
  - `Company Follows.csv`
  - `Recommendations_Received.csv`
  - `Recommendations_Given.csv`
  - `Endorsement_Received_Info.csv`
  - `Endorsement_Given_Info.csv`
  - `Positions.csv`
  - `Profile.csv`
  - `Projects.csv`
  - `Volunteering.csv`

### 2. Existing Basin CRM / Dedupe Layer
- High-value merged sources already present in the workspace:
  - `/Users/basin/Desktop/Basin & Associates 🌍/ALL_BASIN_NEXUS_CRM_MERGED_DEDUPE_2026-02-20.csv`
  - `/Users/basin/Desktop/Basin & Associates 🌍/MASTER_CONTACTS_MERGED_DEDUPE_2026-02-19.csv`
  - `/Users/basin/Desktop/Basin & Associates 🌍/ANTIGRAVITY_NEXUS_CONTACT_UNIVERSE_DEDUPE_V2_2026-02-20.csv`
  - `/Users/basin/Desktop/Basin & Associates 🌍/HARDDRIVE_UNIQUE_CONTACTS_DEDUPE_V4_2026-02-20.csv`
  - `/Users/basin/Desktop/Basin & Associates 🌍/WHOLE_DRIVE_UNIQUE_CONTACTS_DEDUPE_V2_2026-02-20.csv`

### 3. Active Outreach / Execution Layer
- Files that appear to drive current sequencing and send operations:
  - `/Users/basin/Desktop/Basin & Associates 🌍/OUTREACH_OPERATING_MASTER_CLEAN_V3_2026-02-20.csv`
  - `/Users/basin/Desktop/Basin & Associates 🌍/TOP_1000_PRIORITY_OUTREACH_V3.csv`
  - `/Users/basin/Desktop/Basin & Associates 🌍/DAILY_SEND_QUEUE_BY_CHANNEL_V3.csv`
  - `/Users/basin/Desktop/Basin & Associates 🌍/DAILY_SEND_QUEUE_EMAIL_V3.csv`
  - `/Users/basin/Desktop/Basin & Associates 🌍/DAILY_SEND_QUEUE_PHONE_V3.csv`
  - `/Users/basin/Desktop/Basin & Associates 🌍/DAILY_SEND_QUEUE_LINKEDIN_V3.csv`

### 4. LinkedIn-Derived Working Queues
- Existing LinkedIn execution files already in the workspace:
  - `/Users/basin/Desktop/Basin & Associates 🌍/LINKEDIN_READY_CONTACTS_V3.csv`
  - `/Users/basin/Desktop/Basin & Associates 🌍/LINKEDIN_READY_CONTACTS_V3_2026-02-20.csv`
  - `/Users/basin/Desktop/Basin & Associates 🌍/DAILY_SEND_QUEUE_LINKEDIN_TOP600_V3_2026-02-20.csv`
  - `/Users/basin/Desktop/Basin & Associates 🌍/BASIN_NEXUS_PRIORITY_CONTACTS_QUEUE_V12_LINKEDIN_LONGTAIL_2026-02-20.csv`
  - `/Users/basin/Desktop/Basin & Associates 🌍/BASIN_NEXUS_PRIORITY_CONTACTS_QUEUE_V13_LINKEDIN_MAYJUL_2026-02-20.csv`
  - `/Users/basin/Desktop/Basin & Associates 🌍/BASIN_NEXUS_PRIORITY_CONTACTS_QUEUE_V14_LINKEDIN_MAYJUN_2026-02-20.csv`
  - `/Users/basin/Desktop/Basin & Associates 🌍/BASIN_NEXUS_PRIORITY_CONTACTS_QUEUE_V15_LINKEDIN_APRMAY_2026-02-20.csv`
  - `/Users/basin/Desktop/Basin & Associates 🌍/BASIN_NEXUS_PRIORITY_CONTACTS_QUEUE_V16_LINKEDIN_APRIL_2026-02-20.csv`
  - `/Users/basin/Desktop/Basin & Associates 🌍/BASIN_NEXUS_PRIORITY_CONTACTS_QUEUE_V17_LINKEDIN_CYBER_ELITE_2026-02-20.csv`
  - `/Users/basin/Desktop/Basin & Associates 🌍/BASIN_NEXUS_PRIORITY_CONTACTS_QUEUE_V18_LINKEDIN_MAR27_ELITE_2026-02-20.csv`
  - `/Users/basin/Desktop/Basin & Associates 🌍/BASIN_NEXUS_PRIORITY_CONTACTS_QUEUE_V19_LINKEDIN_MAR20_IDAM_GTM_2026-02-20.csv`
  - `/Users/basin/Desktop/Basin & Associates 🌍/BASIN_NEXUS_PRIORITY_CONTACTS_QUEUE_V20_LINKEDIN_MAR10_IDENTITY_CLUSTER_2026-02-20.csv`
  - `/Users/basin/Desktop/Basin & Associates 🌍/BASIN_NEXUS_PRIORITY_CONTACTS_QUEUE_V21_LINKEDIN_MAR06_IDENTITY_FUTURIST_2026-02-20.csv`

### 5. App-Side CRM / UI Data
- Files currently relevant to the app surfaces:
  - `/Users/basin/Desktop/Basin & Associates 🌍/docs/data/linkedin-full-index.js`
  - `/Users/basin/Desktop/Basin & Associates 🌍/docs/data/linkedin-message-layer.js`
  - `/Users/basin/Desktop/Basin & Associates 🌍/docs/data/linkedin-signals.js`
  - `/Users/basin/Desktop/Basin & Associates 🌍/docs/data/unified-data-hub.json`
  - `/Users/basin/Desktop/Basin & Associates 🌍/docs/opportunities.json`
  - `/Users/basin/Desktop/Basin & Associates 🌍/data/lbs_desk_workspace.json`

## Working Interpretation
- The CRM is larger than the clean LinkedIn export alone.
- There are at least three overlapping systems now:
  - the March 12 LinkedIn raw export
  - prior Basin merged/deduped contact universes
  - active execution queues and app-layer indexes
- The right next step is not another isolated import.
- The right next step is a canonical merge strategy with one master identity spine.

## Recommended Canonical Spine Candidates
- Best current merged candidate:
  - `/Users/basin/Desktop/Basin & Associates 🌍/ALL_BASIN_NEXUS_CRM_MERGED_DEDUPE_2026-02-20.csv`
- Strong comparison candidates:
  - `/Users/basin/Desktop/Basin & Associates 🌍/MASTER_CONTACTS_MERGED_DEDUPE_2026-02-19.csv`
  - `/Users/basin/Desktop/Basin & Associates 🌍/ANTIGRAVITY_NEXUS_CONTACT_UNIVERSE_DEDUPE_V2_2026-02-20.csv`
  - `/Users/basin/Desktop/Basin & Associates 🌍/HARDDRIVE_UNIQUE_CONTACTS_DEDUPE_V4_2026-02-20.csv`
- New LinkedIn layer to merge in:
  - `/Users/basin/Desktop/Basin & Associates 🌍/output/spreadsheet/linkedin_message_counterparties_2026-03-12.csv`
  - `/Users/basin/Desktop/Basin & Associates 🌍/Basic_LinkedInDataExport_03-12-2026.zip/Connections.csv`

## Suggested Next Moves
- Compare the March 12 LinkedIn export against `ALL_BASIN_NEXUS_CRM_MERGED_DEDUPE_2026-02-20.csv`.
- Build one canonical merged contact universe with source attribution.
- Push that merged universe into Scout and LB’s Desk as the single CRM source.

## Current Canonical Spine
- Canonical merged contact spine:
  - `/Users/basin/Desktop/Basin & Associates 🌍/output/spreadsheet/canonical_contact_spine_2026-03-13.csv`
- Current merged baseline:
  - `44,487` contacts
- Summary payload for app surfaces:
  - `/Users/basin/Desktop/Basin & Associates 🌍/docs/data/canonical-contact-spine-summary.js`
