# 🦅 THE COMMAND CENTER: AGENT OVERSIGHT MANUAL

> **The Problem:** "Agent Sprawl" (Too many bots, not enough control).
> **The Solution:** The "Squad of 4" Model.
> **Your Role:** You are not the Player. You are the **Commander**.

---

## 1. THE SQUAD OF 4 (That's all you need)
*Do not build 50 agents. Build 4 Specialists that cover the entire funnel.*

### 🕵️ AGENT 1: THE SCOUT (Ingestion)
*   **Code:** `unified_ingestor.py`
*   **Job:** Scours the open web (Reddit, HN, HiringCafe) for signals.
*   **Your Oversight:** You check the `SIGNAL_REPORT_TODAY.md` once at 8 AM.
*   **Status:** ✅ **LIVE.**

### 🧠 AGENT 2: THE ANALYST (Enrichment)
*   **Code:** `deep_sight_engine.py` + Clay.com
*   **Job:** Reads Academic Papers (ArXiv) and Market News to find the "Angle."
*   **Your Oversight:** You read the `DEEP_SIGHT_REPORT.md` to get "smart" before a meeting.
*   **Status:** ✅ **LIVE.**

### 🤝 AGENT 3: THE DIPLOMAT (Network)
*   **Code:** `community_connector.py` (Moltbook)
*   **Job:** Finds allies, drafts comments, and builds your reputation while you sleep.
*   **Your Oversight:** You approve the drafts in the morning.
*   **Status:** ✅ **LIVE.**

### 🛠️ AGENT 4: THE BUILDER (Execution)
*   **Code:** *Antigravity (Me)*
*   **Job:** Writes the code, builds the dashboard, executes the complex logic.
*   **Your Oversight:** You tell me "Build X," and I architect it.
*   **Status:** ✅ **ACTIVE.**

---

## 2. HOW TO OVERSEE IT ALL (The Dashboard)
*You don't run scripts manually forever. You view the Dashboard.*

**The "Basin::Nexus" Dashboard (`NEXUS_LIVE_DASHBOARD.html`):**
*   **The Single Pane of Glass:** This HTML file is not just a demo. It is your **flight deck**.
*   **How it works:**
    1.  The Agents (Scout, Analyst, Diplomat) dump data into JSON files.
    2.  The Dashboard reads the JSON and displays it visually.
    3.  **You verify:** "Green Light" signals = Go. "Red Light" = Stop.

---

## 3. YOUR DAILY COMMMANDER ROUTINE
*Total Time: 30 Minutes.*

1.  **08:00 AM - Intelligence Brief:** Open `DEEP_SIGHT_REPORT.md`. (What did the Analyst find?)
2.  **08:10 AM - Target List:** Open `SIGNAL_REPORT.md`. (What did the Scout find?)
3.  **08:20 AM - Network Pulse:** Run `community_connector.py` to draft Moltbook comments.
4.  **08:30 AM - Execution:** Send 3 Applications (using the data from the Squad).

> **Conclusion:** You don't need a swarm of 100. You need a **Special Forces unit of 4**.
> You monitor the **Outputs**, not the **Inputs**.
