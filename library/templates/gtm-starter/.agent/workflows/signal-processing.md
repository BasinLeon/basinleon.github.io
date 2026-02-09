# 🛰️ WORKFLOW: SIGNAL-TO-SQUAD
## From Trigger to Outreach in 4 Steps

### SECTION 1: SIGNAL DETECTION
- Agent A (Scout) monitors the `signals/` folder for new intent data.
- Agent A categorizes signal by **ICP Fit** (Tier 1/2/3).

### SECTION 2: AUDIT
- Agent B (Auditor) verifies the signal via Google/LinkedIn.
- Output: An "Audit Report" in `audits/`.

### SECTION 3: REFINERY
- Logic gate checks the Audit Report against `refinery/ICP_RULES`.
- If [TRUE] -> Proceed to Copy Gen.

### SECTION 4: DISPATCH
- Agent C (Copywriter) drafts personalized email based on verified signal.
- **HUMAN-IN-THE-LOOP**: Human Lead approves the final draft.

---
#### STATUS
*Status: Template Component*
