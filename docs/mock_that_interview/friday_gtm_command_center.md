# Friday GTM Command Center - Mock That Interview

Last updated: 2026-04-15
Owner: Leon

## Why this exists

You have enough source material. The blocker is not data. The blocker is execution focus.

This file consolidates:

- Institutional targeting logic
- 90-day execution protocol
- Technical access parity checklist
- Revenue architecture framing for founder sync
- Friday run-of-day plan

## Source inventory (already in repo)

- `docs/mock_that_interview/meeting_summary.txt`
- `docs/mock_that_interview/meeting_transcript.txt`
- `docs/mock_that_interview/pre_friday_email.md`
- `docs/mock_that_interview/friday_slides.html`
- `docs/mock_that_interview/pricing_card.html`
- `docs/MTI_Strategic_Yield_Brief.md`
- `mti-gtm-projection-mirror.html`
- `mti-sovereign-mirror-hud.html`
- `mock-interview-refinery-hud.html`
- `mti-competitive-market-projection.html`
- `docs/mock_that_interview/founder_ask_slide_scale_protocol_2026-04-17.md`
- `docs/mock_that_interview/milestone_compensation_addendum_2026-04-17.md`
- `docs/mock_that_interview/kpi_definition_table_2026-04-17.md`

## Friday handoff sequence (what to show in order)

1. Operator Console (control center)
2. Signal -> Intercept -> Validate -> Yield model
3. Build proof (HUDs and projection pages)
4. Founder Ask slide (Scale Protocol)
5. KPI Definition table (live agreement)
6. Milestone Compensation Addendum (DocuSign only after verbal milestone agreement)

## Hard facts from the email thread

1. Primary acquisition lane is institutions (bootcamps + universities), with direct candidate as secondary.
2. Admin access had a production blocker tied to Cloudflare Turnstile host/domain mismatch.
3. Trust and execution confidence are part of the sale, not just feature delivery.
4. Short sync windows worked better than long calls.

## Friday objective (single sentence)

Ship a repeatable institutional pipeline system that proves MTI is selling placement infrastructure, not just interview prep sessions.

## Friday deliverables (must leave with these)

1. Institutional ICP scoring model (who to prioritize first)
2. 90-day protocol (three-phase execution)
3. Technical parity status (admin/login/domain parity)
4. Outreach kit (emails + call opener + follow-up)
5. Dashboard view of pipeline and next actions

## Institutional ICP scoring model

Score each account 1-5 for each criterion:

- Placement pressure (published outcomes scrutiny, job placement messaging)
- Program size (cohort volume, frequency)
- Decision access (director/head of career outcomes reachable)
- Speed to pilot (30-45 day trial likelihood)
- Proof leverage (brand/reference value)

Prioritize accounts where total score >= 18.

## 90-day execution protocol

## Phase 1 (Days 1-21): Baseline + cleanup

- Clean lead sheet and dedupe records
- Tag each account by type: `bootcamp`, `university`, `career-center`, `other`
- Mark decision-maker role and confidence level
- Define baseline metrics:
  - meetings booked/week
  - qualified conversations/week
  - response rate by segment

## Phase 2 (Days 22-50): Signal to pipeline

- Add outreach sequence by segment
- Implement trigger notes for each account (new cohort, outcomes report, hiring partner changes)
- Track movement by stage in one shared view

## Phase 3 (Days 51-90): Scale institutional motion

- Increase high-score account volume
- Reuse highest-performing message variants
- Package first pilot outcomes into a proof brief for next-wave accounts

## Technical parity checklist (non-negotiable)

Before any live demo or founder sync:

- [ ] Admin URL is custom-domain aligned (or Turnstile hosts updated)
- [ ] Login works for non-founder admin user
- [ ] Candidate and admin apps do not cross-redirect incorrectly
- [ ] Read-only analytics/dashboard access confirmed
- [ ] Search Console access confirmed

Owner notes:

- If Turnstile fails on raw Cloud Run host, fix host allowlist or use proper custom admin domain immediately.

## Revenue architecture framing (for Ayo + Ridwan)

Do not pitch "interview prep product."
Pitch this:

- Core category: `Placement Success Infrastructure`
- Economic value: `higher placement yield + faster candidate readiness + better partner reporting`
- Buyer language:
  - "outcomes consistency"
  - "career services throughput"
  - "placement confidence"

## Friday schedule (execution blocks)

09:00-11:00

- Finalize 90-day roadmap doc
- Confirm ICP scoring and account tiers

11:00-13:00

- Technical parity checks (admin/login/domain/search console)
- Record blockers and owner names

13:00-15:00

- Build institutional lead list from template
- Finalize outreach templates and first-touch scripts

15:00-17:00

- Package Friday sync deck + one-page summary
- Lock next-week action queue and owner assignments

## Friday sync agenda (15 minutes)

1. Current state in 60 seconds
2. Institutional motion and why this lane first
3. 90-day protocol and weekly cadence
4. Technical parity status (green/yellow/red)
5. Ask: explicit approvals and owners

## Ask list for founders (must be explicit)

1. Whitelist `.run.app` in Cloudflare Turnstile
2. Elevate `lbasin23@gmail.com` to Admin status
3. Approve Milestone Alignment framework (500 and 1,000 gates)
4. Confirm owner for tech parity, outreach execution, and KPI reporting

## End-of-day success criteria

- [ ] One source of truth for lead pipeline exists
- [ ] 20-40 scored institutional accounts queued
- [ ] Outreach templates finalized and ready
- [ ] Technical blockers either fixed or owner + ETA assigned
- [ ] Friday sync packet sent

## Risks and fallback

Risk: Institutional motion feels heavy for current team bandwidth.

Fallback path:

- Keep institutional lane as primary strategy
- Run lighter direct-candidate lane for immediate signal while system matures
- Protect founder time by standardizing weekly ops template
