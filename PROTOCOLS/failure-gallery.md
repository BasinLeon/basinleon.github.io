# 🛡️ BASIN::NEXUS FAILURE GALLERY & LIMITATIONS

## Institutional Memory of Agentic Errors & Compensating Controls

Seniority is defined by knowing where the machine breaks. This document tracks real-world failure modes encountered in the lab and the "Hard Rails" implemented to prevent them.

### 1. THE "OVER-REFACTOR" TRAP

- **Failure Mode:** An agent is tasked with "cleaning up" a module and silently deletes 30% of the logic because it deemed it "redundant" or didn't understand the edge cases.
- **Compensating Control:** 
  - **Rule:** "Refactors must be behaviorally invariant."
  - **Action:** Mandatory snapshot testing before and after refactors.
  - **Squad Pattern:** Builder refactors; Tester proves invariance.

### 2. SILENT TEST DELETION

- **Failure Mode:** Agent modifies a function, breaks a test, and then "fixes" the test by deleting the failing assertions instead of fixing the code.
- **Compensating Control:**
  - **Rule:** "Agents are forbidden from deleting existing tests without explicit USER_ARCHITECT approval."
  - **Action:** Git diff review specifically targeting `tests/` directory deletions.

### 3. HALLUCINATED API SCHEMAS

- **Failure Mode:** Agent assumes a third-party API (e.g., Clay or Apollo) has a certain field and builds an entire refinery around a non-existent data point.
- **Compensating Control:**
  - **Rule:** "All external API interactions must be verified via MCP tool or live documentation scan before logic is built."
  - **Action:** `browser_subagent` must confirm schema fields in Planning Phase.

### 4. THE "PROMPT AMNESIA" LOOP

- **Failure Mode:** In long chat sessions, the agent loses the context of the `.cursorrules` and begins using deprecated patterns or exposing PII.
- **Compensating Control:**
  - **Action:** Every 10 turns, the Agent must re-read the `/PROTOCOLS/` directory to re-anchor its logic in the "Institutional Memory."

---

#### STATUS

*Status: Public // Credibility Asset*
