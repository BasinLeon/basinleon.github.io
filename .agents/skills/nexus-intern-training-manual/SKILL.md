---
name: nexus-intern-training-manual
description: "Protocol for training and refining the Nexus Intern Fleet (AI execution agents). Guides the development of Power-Ups and expertise in Signal Velocity, Curation, and Siloing."
---

# Nexus Intern Training Manual (v1.0)

This manual is for the **Nexus::Skill_Architect** to use when "training" the intern fleet (Prospector, Social_Sentinel, Data_Architect). Training is not just writing code; it's refining the **Logic Layer** which governs their autonomous execution.

## The Three Pillars of Training

### 1. Signal Velocity (The Speed to Lead)

- **Goal:** Reduce the time between a market event and a refined lead.
- **Protocol:** Interns must prioritize high-frequency APIs over stale databases.
- **Drill:** Train the `Nexus::Prospector` to check for new hiring signals on LinkedIn *before* cross-referencing Apollo.

### 2. Truth-Score Accuracy (Curation over Volume)

- **Goal:** Zero noise in the pipeline.
- **Protocol:** Every data point must be verified by two independent nodes before being passed to the `Data_Architect`.
- **Drill:** Train the `Nexus::Data_Architect` to score leads based on "Technographic Fit"—if the stack doesn't match the client (e.g., no Salesforce for a RevOps tool), the lead is disqualified.

### 3. Total Information Siloing (Sovereign Data)

- **Goal:** Privacy of the $1M Architect's database.
- **Protocol:** Interns only operate in their assigned "Node" (e.g., `interns.html`). They have zero visibility into the `nexus_alliance_dashboard.html`.
- **Drill:** Train all agents to check for the `.noindex` and `no-follow` meta tags before scraping a target URL to ensure they are not exposing private mirrors.

---

## Specific Intern Power-Up Paths

### Nexus::Prospector (Sourcing)

- **Current Power-Up:** Virtue Scoring.
- **Training Path:** Deploy "Stack-Aware" parsing. Teach the agent to identify not just the company, but the *pain* associated with their specific technical debt.

### Nexus::Social_Sentinel (Pulse)

- **Current Power-Up:** Tone Detection.
- **Training Path:** Deploy "Strategic Intent Detection." Move beyond keywords and start identifying "Desperation Signals" (e.g., sudden executive turnover + budget expansion).

### Nexus::Data_Architect (Data Ops)

- **Current Power-Up:** Identity Mapping.
- **Training Path:** Deploy "Ghost Mirror Preparation." Teach the agent to structure data specifically for injection into a private dashboard.

---

## The Feedback Loop

- **Step 1:** Run a live strike.
- **Step 2:** Ingest telemetry data.
- **Step 3:** Critique the intern's success rate in `interns.html`.
- **Step 4:** Deploy a Skill Refinement to the intern's protocol.

### Principle

> "The Architect builds the system. The interns execute the architecture. The training bridge is where the yield happens."
