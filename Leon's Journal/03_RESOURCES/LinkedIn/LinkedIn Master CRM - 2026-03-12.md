# LinkedIn Master CRM - 2026-03-12

Source: [[LinkedIn Export - 2026-03-12]]

## Master Count
- Deduped people estimate across the whole LinkedIn export folder: `13,162`

## Count Breakdown
- Unique connection identities from `Connections.csv`: `12,152`
- Unique message counterparties from `messages.csv`: `4,068`
- Message counterparties not already present in connections: `1,010`

## What “Second Contact Layer” Means
- The new second layer comes from `messages.csv`, not first-degree connections.
- These are people who appear in LinkedIn conversations but are not already present in the exported connection list.
- This is the closest thing in the folder to the “extra leads/contacts” surface.

## Files Used For The CRM Count
- `/Users/basin/Desktop/Basic_LinkedInDataExport_03-12-2026.zip/Connections.csv`
- `/Users/basin/Desktop/Basic_LinkedInDataExport_03-12-2026.zip/messages.csv`
- `/Users/basin/Desktop/Basic_LinkedInDataExport_03-12-2026.zip/Recommendations_Received.csv`
- `/Users/basin/Desktop/Basic_LinkedInDataExport_03-12-2026.zip/Recommendations_Given.csv`
- `/Users/basin/Desktop/Basic_LinkedInDataExport_03-12-2026.zip/Endorsement_Received_Info.csv`
- `/Users/basin/Desktop/Basic_LinkedInDataExport_03-12-2026.zip/Endorsement_Given_Info.csv`

## Profile And Proof Enrichment Files Merged Into The CRM Picture
- `/Users/basin/Desktop/Basic_LinkedInDataExport_03-12-2026.zip/Profile.csv`
- `/Users/basin/Desktop/Basic_LinkedInDataExport_03-12-2026.zip/Positions.csv`
- `/Users/basin/Desktop/Basic_LinkedInDataExport_03-12-2026.zip/Projects.csv`
- `/Users/basin/Desktop/Basic_LinkedInDataExport_03-12-2026.zip/Volunteering.csv`
- `/Users/basin/Desktop/Basic_LinkedInDataExport_03-12-2026.zip/Recommendations_Given.csv`

## Generated Assets
- Message-layer contact export:
  - `/Users/basin/Desktop/Basin & Associates 🌍/output/spreadsheet/linkedin_message_counterparties_2026-03-12.csv`
- UI data layer for Scout / Neural Map:
  - `/Users/basin/Desktop/Basin & Associates 🌍/docs/data/linkedin-message-layer.js`

## Interpretation
- The LinkedIn export does not currently support a `40,000+` unique-person CRM.
- It does support a meaningful CRM expansion beyond first-degree connections.
- The strongest untapped surface is the `1,010` message-only contacts who already exist in your inbox history.

## Suggested Next Moves
- Import the top `200` message-only contacts into the Nexus UI as a warm-message layer.
- Segment the full `1,010` message-only contacts into recruiter, founder, vendor, and peer buckets.
- Build a follow-up queue from the most recent `90` or `180` day message counterparties.

## Strategic Opportunity Mapping (2026-03-12)
- **NBCUniversal (Digital Revenue Transition)**
  - **Champion**: Jeff Wynne (VP Sales, KNBC/KVEA)
  - **Economic Buyer**: Todd Mokhtari (President & GM, NBC4/Telemundo52)
  - **Status**: Mapped in Nexus Data Layer (linkedin-signals.js) and Opportunities (opportunities.json)
  - **Strategic Value**: $50k anchor; high-status 'Revenue Architecture' diagnostic engagement.
