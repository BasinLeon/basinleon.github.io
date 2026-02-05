# 🛰️ Apify Signal System (Nexus v6)

This system integrates the **Official Apify Agent Skills** with the **Basin::Nexus** "Untapped" lead generation strategy.

## 🚀 The Core Philosophy: Bypassing the Spam Trap
Apollo is a static list. Real-time intent signals are the "Sovereign" way to book high-value meetings.

## 📡 The 6 Public Database Exploits (Integrated)

### 1. The Federal Bounty (USASpending.gov)
*   **Trigger**: New government contract award > $500k.
*   **Tool**: `apify/google-search-scraper` (searching USASpending) or custom API integration.
*   **Nexus Pitch**: "Saw you just locked a $1.2M DOD contract. I built the GTM engine for Fudo after their scale-up—here is how we keep your growth on track."

### 2. The Capital Injection (Crunchbase)
*   **Trigger**: Recent Series A or B funding rounds.
*   **Tool**: `apify/ultimate-scraper` (targeting Crunchbase).
*   **Nexus Pitch**: "Congrats on the Series A. A $5M raise means you're hiring vendors—my Basin::Nexus engine can automate your first 100 outbound calls in 12 days."

### 3. The Tech Confession (BuiltWith)
*   **Trigger**: Use of specific high-value tools (HubSpot, Salesforce, Shopify Plus).
*   **Tool**: `apify/web-scraper` (searching BuiltWith).
*   **Nexus Pitch**: "Noticed you're using HubSpot CRM. I specialize in architecting autonomous sales engines for HubSpot teams."

### 4. The Growth Struggle (LinkedIn Jobs)
*   **Trigger**: Hiring for "Head of Growth", "SDR", or "Marketing Manager".
*   **Tool**: `apify/lead-generation` (LinkedIn scraper).
*   **Nexus Pitch**: "Saw you're hiring 3 SDRs—pipeline must be top priority. I can deploy an AI-led signal refinery to hit your targets while those roles are being filled."

### 5. The Strategic Disclosure (SEC EDGAR)
*   **Trigger**: Mentions of strategic priority changes in public filings.
*   **Tool**: `apify/google-search-scraper` (filtering for SEC documents).
*   **Nexus Pitch**: "Read your latest disclosure on strategic GTM shifts. Here is a blueprint for the architecture I built at Google/NetApp."

### 6. The Competitor Flank (G2/Capterra)
*   **Trigger**: Recent reviews of competitor products.
*   **Tool**: `apify/ultimate-scraper` (G2/Capterra).
*   **Nexus Pitch**: "Saw your review on [Competitor]. If you're looking for [Specific Benefit], I have a custom build that addresses [Pain Point]."

## 🛠️ Implementation Workflow

### Step 1: Authentication
Create a `.env` file in `WAR_ROOM_2026/03_ENGINEERING/basin-nexus-v5/` with:
```bash
APIFY_TOKEN=your_apify_token_here
```

### Step 2: Scout Activation
Use the `mcpc` CLI tool (installed via `npm install -g @apify/mcpc`) to trigger scouts:

```bash
# Example: Finding government contractors
mcpc run actor:compass/crawler-google-places --input '{"queries": ["government contractors in Mountain View"]}'
```

### Step 3: Nexus Refinery
Pipe findings into the `AccountOracle.py` for final audit and pitch generation.

## 📈 The Math: Apollo vs. Nexus Signal
| Source | Inbox Rank | Reply Rate | Call Volume |
|--------|------------|------------|-------------|
| **Apollo** | #98 (Noise) | 0.5% | Low |
| **Nexus Signal** | #1 (Unique) | 5-12% | **103 Calls / 12 Days** |
