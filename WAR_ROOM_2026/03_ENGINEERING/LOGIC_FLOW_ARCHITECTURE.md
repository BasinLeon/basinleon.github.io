# 🦅 BASIN::NEXUS | THE "FREE TIER" LOGIC FLOW

> **Problem:** Data vendors (ZoomInfo, Apollo, LinkedIn Sales Nav) cost $20k/year.
> **Solution:** The "Unified Signal Ingestion" Engine (Open Source).
> **Cost:** $0.00.
> **Yield:** Higher Latency, Higher Relevance.

---

## 1. THE ARCHITECTURE
*How we get the data without paying the gatekeepers.*

### 🟢 SOURCE A: REDDIT (The Pulse)
*   **Logic:** Reddit allows `.json` requests on any subreddit URL.
*   **Target Subreddits:** `r/sales`, `r/techsales`, `r/startups`, `r/SaaS`.
*   **Signal Identification:** We scan for keywords like "Hiring", "GTM Engineer", "Our stack".
*   **The Advantage:** This is where founders post *before* they pay for LinkedIn Ads.

### 🟢 SOURCE B: HACKER NEWS (The Brain)
*   **Logic:** The YCombinator API is free and public (`firebaseio`).
*   **Target:** The monthly "Who is Hiring" thread.
*   **Signal:** We parse the thread for "Sales" or "Revenue" roles in "Engineering" contexts.
*   **The Advantage:** These are technical founders ($$$) who respect Python/Logic.

### 🟢 SOURCE C: AGGREGATORS (The Wide Net)
*   **Logic:** HiringCafe and TrueUp do the scraping for us. We just generate the *deep links*.
*   **Target:** "GTM Engineer" and "Revenue Operations".
*   **The Advantage:** They filter out the "Generic Sales Manager" roles automatically.

---

## 2. THE WORKFLOW (Daily Routine)
*Don't scroll. Process.*

1.  **08:00 AM:** Run `python3 unified_ingestor.py`.
2.  **08:01 AM:** Open the generated `SIGNAL_REPORT_[Date].md`.
3.  **08:05 AM:** Review the "High Signal" rows.
4.  **08:10 AM:** Apply using the **Revenue Engineer Offer Pack**.

---

## 3. WHY THIS SELLS
*This architecture IS the product.*

When you interview with Portex or Weave, you show them this script.
> "I built a customized lead ingestion engine for $0 using Python.
> Imagine what I can do if you give me a budget."

**This is the definition of concrete.**
