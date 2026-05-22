# LinkedIn Skill Layer - 2026-03-12

Source: [[LinkedIn Export - 2026-03-12]]

## Purpose
- Turn the expanded LinkedIn export into reusable local agent skills instead of one-off analysis.
- Give Codex a clean way to reach for message recovery, learning-to-positioning, and opportunity-radar workflows in future sessions.

## Skills Added

### `linkedin-thread-recovery`
- Path: `/Users/basin/Desktop/Basin & Associates 🌍/.agents/skills/linkedin-thread-recovery/SKILL.md`
- Powered by:
  - `/Users/basin/Desktop/Basic_LinkedInDataExport_03-12-2026.zip/messages.csv`
  - `/Users/basin/Desktop/Basic_LinkedInDataExport_03-12-2026.zip/Invitations.csv`
- Purpose:
  - Mine warm conversations, stalled threads, recruiter outreach, founder replies, and easy follow-up opportunities.

### `linkedin-learning-to-positioning`
- Path: `/Users/basin/Desktop/Basin & Associates 🌍/.agents/skills/linkedin-learning-to-positioning/SKILL.md`
- Powered by:
  - `/Users/basin/Desktop/Basic_LinkedInDataExport_03-12-2026.zip/Learning.csv`
  - `/Users/basin/Desktop/Basic_LinkedInDataExport_03-12-2026.zip/Skills.csv`
  - `/Users/basin/Desktop/Basic_LinkedInDataExport_03-12-2026.zip/Publications.csv`
- Purpose:
  - Convert learning history, declared skills, and writing output into stronger positioning and proof.

### `linkedin-opportunity-radar`
- Path: `/Users/basin/Desktop/Basin & Associates 🌍/.agents/skills/linkedin-opportunity-radar/SKILL.md`
- Powered by:
  - `/Users/basin/Desktop/Basic_LinkedInDataExport_03-12-2026.zip/SavedJobAlerts.csv`
  - `/Users/basin/Desktop/Basic_LinkedInDataExport_03-12-2026.zip/Organizations.csv`
  - `/Users/basin/Desktop/Basic_LinkedInDataExport_03-12-2026.zip/Rich_Media.csv`
  - `/Users/basin/Desktop/Basic_LinkedInDataExport_03-12-2026.zip/Registration.csv`
- Purpose:
  - Infer target-role intent, community alignment, geo preferences, and public-signal opportunities.

### `linkedin-application-memory-bank`
- Path: `/Users/basin/Desktop/Basin & Associates 🌍/.agents/skills/linkedin-application-memory-bank/SKILL.md`
- Powered by:
  - `/Users/basin/Desktop/Basic_LinkedInDataExport_03-12-2026.zip/Job Applicant Saved Screening Question Responses.csv`
  - `/Users/basin/Desktop/Basic_LinkedInDataExport_03-12-2026.zip/Job Applicant Saved Screening Question Responses_1.csv`
  - `/Users/basin/Desktop/Basic_LinkedInDataExport_03-12-2026.zip/Job Applicant Saved Screening Question Responses_2.csv`
  - `/Users/basin/Desktop/Basic_LinkedInDataExport_03-12-2026.zip/Job Applicant Saved Screening Question Responses_3.csv`
- Purpose:
  - Recover past screening answers, detect contradictions, and build a reusable application answer bank.

## Additional File Signals
- `learning_role_play_messages.csv`
  - Current export is empty, so it does not justify a standalone skill yet.
- `guide_messages.csv`
  - Current export is empty, so it only extends `linkedin-thread-recovery` as optional input.
- `Registration.csv`
  - Only one row exists, so it is better used as weak metadata inside `linkedin-opportunity-radar` instead of its own skill.
- `Endorsement_Given_Info.csv`
  - Large enough to matter, but best used as enrichment for positioning and reciprocity analysis inside `linkedin-learning-to-positioning` instead of its own standalone skill.

## Why These Four
- `messages.csv` is large enough to support a real warm-thread recovery workflow.
- `Learning.csv` + `Skills.csv` + `Publications.csv` form a strong positioning and capability-evidence bundle.
- `SavedJobAlerts.csv` + `Organizations.csv` + `Rich_Media.csv` create a useful intent-and-surface radar for search direction and public narrative cleanup.
- The screening-response files create a real application memory bank because they preserve repeated claims across many job forms.

## New File Notes
- `Endorsement_Given_Info.csv`
  - `2,779` rows
  - Strong reciprocity signal: useful for understanding who you publicly support and which skill clusters you notice in others.
- `guide_messages.csv`
  - `0` rows
  - No standalone workflow justified yet.
- `Job Applicant Saved Screening Question Responses*.csv`
  - `299` rows across four files
  - Strong source for claim consistency, recurring role filters, and canonical application-answer reuse.

## Suggested Next Moves
- Run `linkedin-thread-recovery` against the recent 180-day slice of messages and produce a warm follow-up queue.
- Run `linkedin-learning-to-positioning` and rewrite the LinkedIn About section from current evidence.
- Run `linkedin-opportunity-radar` and turn the alert patterns into a target-role map.
- Run `linkedin-application-memory-bank` and build a canonical application answer sheet before the next wave of applications.
- Use [[LinkedIn Master CRM - 2026-03-12]] as the current deduped CRM baseline before claiming larger contact totals.
