# Shared Routing Dashboard - v1 Schema

**Objective:** To move lead routing out of scattered email inboxes and into a centralized, actionable view that answers at a glance who replied, what action happened, and who owns the next move.

Below is the proposed v1 column structure for the shared dashboard.

---

## 1. Identity
- **Lead Name:**
- **Company:**
- **Title:**
- **Geography:**

## 2. Source
- **Recruiter / Sender:** Who initiated the contact?
- **Channel:** LinkedIn vs. Email
- **Campaign Name:**
- **Cadence Type:** Assessment / Training
- **Offer / CTA Sent:** Target ask sent (Diagnostic Link, Follow-up Note, etc.)
- **Trigger / Signal:** What prompted the outreach?

## 3. Response
- **Response Date:**
- **Response Type:**
- **Message Summary:** Brief context of their reply.
- **LinkedIn Profile URL:**
- **Email Address:**

## 4. Conversion Flow
- **Reply Sent:** (Yes/No/Date)
- **Assessment Link Sent:** (Yes/No/Date)
- **Assessment Completed:** (Yes/No/Date)
- **Report Delivered:** (Yes/No/Date)
- **Training Recommended:**
- **Call Needed?:** (Yes/No)
- **Lead Score / Priority:**

## 5. Ownership & Next Steps
- **Current Owner:** Who is holding the ball?
- **Last Touch Date:**
- **Next Action:** What needs to happen right now?
- **Next Action Date:**
- **Status:** (See suggested values below)
- **Notes:** (Keep short. Status/Dates should carry the meaning.)

---

### Suggested Status Values
*Keep these tight to avoid ambiguity:*
- `New Reply`
- `Needs Review`
- `Reply Sent`
- `Assessment Sent`
- `Assessment Completed`
- `Report Delivered`
- `Nurture`
- `Training Recommended`
- `Call Qualified`
- `Closed / Inactive`
