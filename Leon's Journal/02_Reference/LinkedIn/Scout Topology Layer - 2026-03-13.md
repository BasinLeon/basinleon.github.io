# Scout Topology Layer - 2026-03-13

## What Shipped
- Built a dedicated Scout topology payload:
  - `/Users/basin/Desktop/Basin & Associates 🌍/docs/data/scout-topology.js`
  - `/Users/basin/Desktop/Basin & Associates 🌍/docs/data/scout-topology.json`
- Added a builder script:
  - `/Users/basin/Desktop/Basin & Associates 🌍/scripts/build_scout_topology.py`
- Updated Scout:
  - `/Users/basin/Desktop/Basin & Associates 🌍/docs/nexus_scout.html`
- Added a regression test:
  - `/Users/basin/Desktop/Basin & Associates 🌍/tests/test_scout_topology.py`

## Core Product Correction
- The bug was not visual polish.
- The real issue was a truth gap:
  - the page was showing stale loaded-row counts
  - stronger topology data lived elsewhere
  - disconnected layers were being implied as live
- The fix was to separate:
  - page UI state
  - canonical CRM summary
  - Scout-specific topology payload

## Current Truth Model
- Strong:
  - canonical CRM count
  - company intelligence
  - title intelligence
- Medium:
  - segment logic
  - network-shape patterns
  - company overlap patterns
- Partial:
  - industry intelligence

## Current Baselines
- Canonical CRM:
  - `44,487`
- Industry coverage:
  - `1,406 / 44,487`
  - `3.16%`
- Unknown company count:
  - `3,121`
- Unknown company share:
  - `7.02%`
- Placeholder-heavy company share:
  - `9.57%`
- Title normalization coverage:
  - `53.62%`

## Network Shape Layer
- Added a dedicated `Network Shape` section near the top of Scout.
- The panel now centers:
  - top companies
  - top raw titles
  - top title clusters
  - industry coverage
- It also includes explicit confidence labels:
  - `Company intelligence: strong`
  - `Title intelligence: strong`
  - `Industry intelligence: partial`

## Title and Contact Intelligence
- Preserved raw and normalized fields in the Scout contact model:
  - `company_raw`
  - `company_normalized`
  - `title_raw`
  - `title_cluster`
  - `industry_raw`
  - `industry_cluster`
- Added:
  - `seniority_level`
  - `relationship_strength`
  - `relationship_label`
  - `why_hot`

## Controlled Title Buckets
- Founder / Executive
- Recruiter / Talent
- GTM / Revenue
- Sales
- Security
- Engineering
- Product
- Investor / Partner
- Operations
- Other / Unknown

## Important Data Hygiene Rule
- Do not delete messy data.
- Classify messy data.
- LinkedIn-specific placeholders should stay in the graph, but not pollute company intelligence.

### Correct split
- `entity_type = company`
  - Google
  - Salesforce
  - Dexian
  - Sense
- `entity_type = network_source`
  - LinkedIn Connection
  - LinkedIn Network
  - LinkedIn Contact
  - LinkedIn Import
- `entity_type = unknown`
  - Unknown

## Why This Matters
- Company intelligence should answer:
  - where real company concentration exists
  - where recruiter density exists
  - where founder / exec access exists
- Network-source nodes should answer:
  - how much of the graph comes from LinkedIn
  - where warm adjacency exists
  - where message-only or imported layers sit

## Current Verification
- Regression test:
  - `python3 -m unittest tests/test_scout_topology.py`
- Verified:
  - Scout topology payload exists
  - Scout references the topology payload
  - Network Shape hooks exist in the exact page
  - Scout script parses successfully

## Next Best Moves
- Split company entities from network-source nodes in the topology payload itself instead of only filtering placeholders.
- Add company-level Desk overlap and watchlist flags with stronger linkage.
- Add a fuller relationship-strength model once the topology pass is stable.
- Capture a before/after screenshot pair of the Scout header area for proof of truth repair.
