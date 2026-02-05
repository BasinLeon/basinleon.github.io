# 🏗 ARCHITECTURE SPEC: THE SIGNAL VAULT
**Project Codename:** `basin_signal_vault`
**Goal:** Automate the discovery of "High-Intent" opportunities for Permissionless Deployment.

## 1. THE STACK
*   **Database:** **Supabase** (PostgreSQL)
    *   *Why:* Free tier is generous, relational data is strictly necessary for "Lead Scoring", and it has a built-in API.
*   **Orchestration:** **n8n** (Self-hosted or Cloud)
    *   *Why:* Visual workflow builder that connects APIs without writing boilerplate code. Perfect for "IF this THEN that" logic.
*   **Logic Layer:** **Python** (Scripts)
    *   *Why:* Complex data enrichment, scraping specific sites, and LLM drafting.

## 2. DATABASE SCHEMA (Supabase)
We need three core tables to start.

### Table A: `targets` (The Companies)
*   `id`: UUID
*   `company_name`: Text
*   `domain`: Text
*   `status`: Text (e.g., "Identified", "Audited", "Contacted")
*   `signal_strength`: Integer (1-100)

### Table B: `signals` (The Triggers)
*   `id`: UUID
*   `target_id`: FK -> targets.id
*   `type`: Text (e.g., "Job Post", "Funding News", "HackerNews Mention")
*   `content`: Text (Raw text of the signal)
*   `url`: Text (Source link)
*   `created_at`: Timestamp

### Table C: `outreach_drafts` (The Ammo)
*   `id`: UUID
*   `target_id`: FK -> targets.id
*   `recipient_name`: Text
*   `generated_message`: Text (The draft created by the Agent)
*   `status`: Text ("Draft", "Sent")

## 3. WORKFLOW (n8n + Python)

### Workflow 1: The "Hiring Hunter"
*   **Node 1 (Trigger):** Monitor specific RSS Feeds (e.g., "We Work Remotely - Product", "YC Jobs").
*   **Node 2 (Filter):** IF description contains ["LLM", "Python", "Revenue Operations"].
*   **Node 3 (Supabase):** INSERT into `targets` and `signals`.

### Workflow 2: The "Enricher" (Python)
*   **Script:** `enrich_targets.py`
*   **Action:** Query Supabase for new `targets` -> Visit their website -> Scrape their "About" page -> Update Supabase with "Tech Stack" context.

### Workflow 3: The "Architect" (LLM)
*   **Node 1 (Trigger):** New row in `signals` with strength > 80.
*   **Node 2 (LLM Chain):**
    *   Prompt: "Write a 3-sentence email to the CTO of {company} referencing {signal_content}. Offer a specific solution based on my resume."
*   **Node 3 (Supabase):** INSERT into `outreach_drafts`.

## 4. MONDAY LAUNCH PLAN
1.  **09:00 AM:** Create Supabase Account & Project.
2.  **10:00 AM:** Install n8n (Docker or Cloud).
3.  **11:00 AM:** Build Table A (`targets`).
4.  **12:00 PM:** Create "Manual Entry" script to test connection.

*Status: Ready for Construction.*
