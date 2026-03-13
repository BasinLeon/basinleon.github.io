# Standards Snapshot (Cross-Platform)

This snapshot captures implementation rules synthesized from:

- AgentSkills ecosystem: [agentskills.io](https://www.agentskills.io/home), [agentskills.so](https://agentskills.so/), and [AgentSkills specification](https://www.agentskills.io/specification)
- Anthropic Claude skills docs: [Agent Skills Overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
- OpenAI Codex skills docs: [Codex Skills](https://developers.openai.com/codex/skills/)
- OpenAI quality/eval guidance: [Eval Skills](https://developers.openai.com/blog/eval-skills/)
- OpenAI shell reliability guidance: [Skills + Shell Tips](https://developers.openai.com/blog/skills-shell-tips/)
- Vercel reference implementations: [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills)
- OpenCode implementation notes: [OpenCode Skills Docs](https://opencode.ai/docs/skills/)
- OpenAI Codex repository docs: [codex/docs/skills.md](https://github.com/openai/codex/blob/main/docs/skills.md)

## 1) Discovery First
- Skills are selected by description match quality.
- Description should describe **trigger conditions** ("Use when..."), not summarize workflow internals.

## 2) One Skill, One Core Capability
- Avoid multi-purpose "mega-skills".
- Keep focused scope and clear entry/exit conditions.

## 3) Composability
- Skills should call other skills when appropriate.
- Keep heavy references/scripts modular and linked from SKILL.md.

## 4) Deterministic Execution
- Include executable commands, APIs, or explicit steps.
- Avoid abstract prose-only guidance.

## 5) Security Hygiene
- Use environment variables for secrets.
- Restrict secrets to approved domains.
- Never instruct key sharing to third-party domains.

## 6) Portability Metadata
- For Codex/OpenAI compatibility, optional `agents/openai.yaml` can improve discovery and invocation.
- Keep filenames and folder structure stable and predictable.

## 7) Eval-Driven Skill Quality
- Add repeatable eval tests for style and behavior, not just presence checks.
- Prefer structured output scoring with JSON schema for deterministic grading.
- Keep test inputs representative and adversarial (edge cases, ambiguous prompts).

## 8) Shell and Tooling Safety
- Skills that use shell should constrain network and filesystem boundaries by default.
- Treat all shell/tool output as untrusted input until validated.
- Enforce explicit handoff/output paths in hosted environments.

## 9) Context Efficiency
- Make frequently-used skills concise.
- Move long references into dedicated files and link them.

## 10) Practical Validation
- Run a quick structural lint before shipping a skill.
- Verify example commands are syntactically valid.
