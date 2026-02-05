# 🦅 GTM ENGINEERING 101: THE ARCHITECT'S PLAYBOOK

**Created by:** Leon Basin (Revenue Architect)
**Objective:** Internalize the category of "GTM Engineering" to dominate interviews and system-building.

---

## 1. WHAT IS A GTM ENGINEER?
A GTM (Go-To-Market) Engineer is a hybrid role that sits between **Sales Ops**, **Engineering**, and **Growth**.

*   **The Problem:** Traditional Sales teams use "Brute Force" (sending more emails).
*   **The GTM Engineering Solution:** "Signal Refineries" (writing code to find the *perfect* time to send the *perfect* message).

---

## 2. THE CORE ARCHITECTURE (The "Modern Agentic Stack")
*When an interviewer asks "How do you build these systems?", you walk them through these 4 layers.*

### Layer 1: Ingestion (The Eyes) 🕷️
*   **Tools:** Apify, Clay, Firecrawl.
*   **Action:** Scraping the web, LinkedIn, or Job Boards to find "Signals" (e.g., "They are hiring for a PMM", "They just switched to Salesforce").

### Layer 2: Enrichment (The Context) 🔍
*   **Tools:** Clearbit API, BuiltWith, custom Python scripts.
*   **Action:** Taking a domain (`jolly.com`) and finding the tech stack, employee count, and security posture.

### Layer 3: Reasoning (The Brain) 🧠
*   **Tools:** Claude 3.5 Sonnet, GPT-4o.
*   **Action:** The AI analyzes the enriched data. 
    *   *Example:* "If they use Marketo but don't have a data warehouse, they likely have a lead-routing latency problem."

### Layer 4: Action (The Hands) ⚡
*   **Tools:** n8n, Lindy, Instantly, LinkedIn InMail.
*   **Action:** Automatically drafting the personalized message and pushing it to the human's "Outbox" for approval.

---

## 3. THE "MAD SCIENTIST" WORKFLOW (Visualized)
*You explain your local `mad_scientist_pipeline.py` using this logic:*

1.  **DOMAIN LIST** -> (Python runs)
2.  **API CALLS** -> (Fetch Tech Stack)
3.  **AI COMPOSITION** -> (Claude writes the Hook)
4.  **HUMAN CLOSING** -> (Leon sends the InMail)

---

## 4. HOW TO SELL IT IN 90 SECONDS
> "I don't just 'do sales'. I build **Revenue Infrastructure**. I treat your go-to-market motion like a software product. I write the code that automates the signal detection so your AEs only talk to people who are already qualified by data, not just volume."

---

## 🦅 THE 4-MONTH JOURNEY ENDS HERE.
You've been close. You've been burned. But those people were looking at you as a **"Generalist."**

Starting today, you are a **"Specialist."** You are a GTM Engineer. You have a proprietary stack (Basin::Nexus). You have the code to prove it.

**Rest tonight.** You have won Saturday. 
Tomorrow, we do the "Next 5" and finalize the Telegram Operator. 🦅
