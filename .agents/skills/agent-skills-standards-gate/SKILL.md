---
name: agent-skills-standards-gate
description: Use when creating or editing skills and you need a fast cross-platform quality gate aligned with AgentSkills, OpenAI Codex skills, Claude skills, and Vercel agent-skills patterns.
---

# Agent Skills Standards Gate

## Overview
Run a strict quality gate before adding or publishing any skill.

Core principle: **portable skills win**. A skill should be discoverable, composable, and usable across major agent ecosystems.

## When to Use
Use this skill when:
- creating a new skill,
- refactoring existing skills,
- preparing a skill pack for sharing/publication.

## Inputs
- target skill directory path (for example `.agents/skills/my-skill`)
- intended runtime(s): Codex, Claude, AgentSkills-compatible

## Gate Sequence

### 1) Structure Gate
Required:
- `SKILL.md` present.
- YAML frontmatter has `name` and `description`.
- Optional fields validated if present: `license`, `compatibility`, `metadata`, `allowed-tools`.
- Description starts with "Use when..." and describes trigger conditions, not process steps.

### 2) Trigger Clarity Gate
Check that the skill can be selected quickly:
- Explicit "when to use".
- Explicit "when not to use" (if ambiguity risk exists).
- Single primary competency.

### 3) Actionability Gate
Check that the skill is runnable:
- concrete commands/APIs/inputs,
- no vague "best practices only" guidance,
- deterministic next action.

### 4) Safety Gate
- secrets handled only via env vars,
- no credential echoing into logs,
- domain scoping for API keys where relevant.

### 5) Portability Gate
Optional but recommended:
- `agents/openai.yaml` for OpenAI/Codex metadata.
- scripts/resources kept relative to skill folder.
- references documented with canonical links.

### 6) Eval Readiness Gate
Define at least one machine-scoreable eval path:
- create a rubric schema JSON,
- run skill output checks using structured JSON output (`--output-schema` where supported),
- make pass/fail criteria explicit.

### 7) Long-Run Safety Gate (Shell + Network)
If a skill uses shell/network:
- default to minimal network allowlist,
- treat tool output as untrusted,
- separate artifact handoff path (for hosted shell, `/mnt/data` boundary),
- avoid combining broad internet access with privileged procedures.

## Quick Check Command
Use helper script:
```bash
./scripts/skill_quick_check.sh /absolute/path/to/skill
```

For eval seed schema:
```bash
cat resources/style_rubric.schema.json
```

## Standards Snapshot
See `references/standards_snapshot.md` for source-aligned rules and links.

## Exit Criteria
Skill passes when:
- all required gates pass,
- no security red flags,
- description and triggers are concise and specific,
- skill can be executed by a context-poor agent without guesswork.
