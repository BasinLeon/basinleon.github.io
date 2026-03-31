# Jassi Proposal Skill Pack Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add two reusable skills that turn rough proposal material into a proposal-safe half-page insert and a matching external lead-pilot page brief.

**Architecture:** Keep the pack small and composable. One skill handles the forwardable insert inside a partner-led proposal. One skill handles the simple page structure that can be shown to buyers now and built into a lead-capture asset later. Both skills include one lightweight reference file so the trigger logic stays lean.

**Tech Stack:** Markdown skills under `.agents/skills`, reference templates in sibling `references/`, validation with `python3 /Users/basin/.codex/skills/.system/skill-creator/scripts/quick_validate.py`.

---

### Task 1: Capture the reusable workflow

**Files:**
- Create: `.agents/skills/proposal-insert-bridge/SKILL.md`
- Create: `.agents/skills/proposal-insert-bridge/references/half-page-template.md`
- Create: `.agents/skills/external-lead-pilot-page/SKILL.md`
- Create: `.agents/skills/external-lead-pilot-page/references/page-wireframe.md`

**Step 1: Define the bridge skill**

Write a skill that triggers when the input is a messy proposal, transcript, PDF, or email thread and the output needs to be a short, forwardable insert.

**Step 2: Define the page skill**

Write a skill that triggers when the offer is already defined and the next need is a showable landing-page section or microsite page for lead capture.

**Step 3: Add one reference template per skill**

Keep the templates concrete:
- half-page insert skeleton,
- single-page pilot wireframe with CTA and field guidance.

### Task 2: Validate the skills

**Files:**
- Test: `.agents/skills/proposal-insert-bridge/SKILL.md`
- Test: `.agents/skills/external-lead-pilot-page/SKILL.md`

**Step 1: Run frontmatter validation**

Run:

```bash
python3 /Users/basin/.codex/skills/.system/skill-creator/scripts/quick_validate.py '/Users/basin/Desktop/Basin & Associates 🌍/.agents/skills/proposal-insert-bridge'
python3 /Users/basin/.codex/skills/.system/skill-creator/scripts/quick_validate.py '/Users/basin/Desktop/Basin & Associates 🌍/.agents/skills/external-lead-pilot-page'
```

Expected:
- both commands print `Skill is valid!`

**Step 2: Manual trigger check**

Confirm the descriptions start with `Use when...` and describe only trigger conditions, not workflow steps.

**Step 3: Manual overlap check**

Confirm these new skills fill the gap between existing skills such as `revenue-architect-proposal-audit`, `diagnostic-led-outreach`, and `copywriting` rather than replacing them.

