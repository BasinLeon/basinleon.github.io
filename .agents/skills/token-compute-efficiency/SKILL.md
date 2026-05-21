---
name: token-compute-efficiency
description: Use when starting complex codebase edits, analyzing large files, running multi-agent workflows, reviewing noisy logs, or managing context tokens and compute budgets across agent runtimes including Codex.
---

# Token & Compute Efficiency (Quiet Machine Doctrine)

## Overview

The **Quiet Machine** doctrine establishes that high-performance engineering requires extreme token and context hygiene. A crowded context window degrades LLM attention, increases latency, and invites logic loops. This skill mandates rules for running lean, precise, and compute-efficient agent sessions.

This skill is runtime-aware: keep the doctrine stable, then map it to the tools available in the current environment. In Codex, use the Codex sidecar rules below. In Antigravity/Gemini-style environments, use the original tool names and patterns.

## When To Use

Use when:

- Modifying large codebases or working in long-running chats.
- Searching for specific code blocks across many directories.
- Refactoring files or generating extensive changes.
- Launching subagents or executing parallel background processes.
- Reviewing noisy logs, test failures, or broad git diffs.

Do not use when:

- Running simple, isolated one-line shell commands.
- Answering basic conceptual questions unrelated to files in the workspace.

## Core Patterns

### 1. Progressive Disclosure

Never view or load a large file in its entirety if you only need a specific section. Search first, then load narrow line ranges.

Original runtime pattern:

- Use `grep_search` to locate the target.
- Use `view_file` with `StartLine` and `EndLine`.
- Avoid broad `cat` or whole-file views.

Codex pattern:

```bash
rg -n "functionName|className|error text" path/
rg --files | rg "target-name|package.json|SKILL.md"
sed -n '120,190p' path/to/file
nl -ba path/to/file | sed -n '120,190p'
```

Codex rule: if a file is more than about 150 lines, use `rg` first and read only the nearby range unless the full structure is truly necessary.

### 2. Subagent Sandboxing

Do not clutter the parent conversation with exhaustive codebase searches, dependency lookups, or build logs. When the runtime and user allow it, sandbox exploratory work in a subagent.

Original runtime pattern:

- The subagent executes many tool calls, reads raw code, and processes bulky logs.
- The parent receives a clean, synthesized summary.
- The parent avoids carrying exploratory noise into future turns.

Codex pattern:

- Spawn subagents only when the user explicitly asks for subagents, delegation, or parallel agent work.
- Give each subagent a concrete, bounded task.
- Ask for a concise report with file paths, changed files, commands run, and remaining risks.
- Do not duplicate the delegated work locally while the subagent is running.

If Codex subagents are not allowed, simulate the same discipline locally: search narrowly, read bounded ranges, and carry forward a short working summary.

### 3. Diff-Only File Operations

Minimize input and output token usage by changing only relevant blocks of code rather than rewriting entire files.

Original runtime pattern:

- Use `replace_file_content` for a single contiguous change.
- Use `multi_replace_file_content` for multiple non-contiguous edits in the same file.
- Do not use `write_to_file` to overwrite a large existing file just to modify a few lines.

Codex pattern:

- Use `apply_patch` for manual edits.
- Keep hunks small, reviewable, and scoped to the task.
- Preserve unrelated dirty worktree changes.
- Avoid broad formatter churn unless the project requires it.

### 4. Clean Output Responses

Never print massive file content, full stack traces, or entire markdown documents directly in chat.

Original runtime pattern:

- Save long outputs or summaries directly to artifacts or scratch files.
- Point the user to the file path.
- Summarize only the critical takeaways.

Codex pattern:

- Set `max_output_tokens` on noisy commands.
- Use targeted commands over broad dumps.
- Summarize the key error line, affected file, command run, and result.
- Link local files in Codex markdown style:

```markdown
[SKILL.md](/absolute/path/to/SKILL.md:12)
```

## Quick Reference: Runtime Tool Mapping

| Goal | Original Runtime | Codex Runtime |
| :--- | :--- | :--- |
| Find code | `grep_search` | `rg -n`, `rg --files` |
| Read file section | `view_file` with `StartLine` / `EndLine` | `sed -n`, `nl -ba ... | sed -n` |
| Single edit | `replace_file_content` | `apply_patch` |
| Multi-edit | `multi_replace_file_content` | `apply_patch` with multiple hunks |
| Avoid huge overwrite | Avoid `write_to_file` on existing large files | Avoid whole-file rewrites; patch only changed lines |
| Run commands | `run_command` with limited stdout | `exec_command` with `max_output_tokens` |
| Background work | `manage_task` without polling loops | Track session ids; avoid pointless polling |
| Delegation | Background subagent sandbox | `spawn_agent` only with explicit user permission |

## Command Output Hygiene

Good Codex command patterns:

```bash
git status --short
git diff -- path/to/file
rg -n "FAILED|ERROR|panic|Traceback" test-output.log
tail -n 80 test-output.log
```

Prefer scoped verification before full suites when investigating a narrow issue, such as a single test file, targeted package script, or focused lint command.

## Bulletproofing: Common Rationalizations

| Excuse | Operational Truth |
| :--- | :--- |
| "I need to read the whole file to make sure I do not miss anything." | Search and cross-reference first. Selectively read more only when the first pass shows it is needed. |
| "It is easier to rewrite the whole file than figure out the exact lines." | Patch the relevant block. Whole-file rewrites burn tokens and increase regression risk. |
| "I will print the whole log so the user sees all details." | Summarize the useful failure and keep the raw log out of chat unless explicitly requested. |
| "Let me poll the build status a few times quickly." | Polling burns turns and context. Wait only when the result is needed for the next decision. |
| "A subagent would be cleaner, so I can spawn one." | In Codex, subagents require explicit user permission. Use local discipline otherwise. |

## Red Flags

Pause and restructure when:

- You are about to read more than 200 lines without first searching.
- A command may print thousands of lines and has no output cap.
- You are about to overwrite a large existing file.
- You are planning to spawn a subagent without explicit user permission in Codex.
- Your final answer is mostly process narration instead of outcome.

## Final Checklist

Before finishing:

- Did I inspect only the needed context?
- Did I preserve unrelated user changes?
- Did I verify the change at the right scope?
- Did I give the user the useful result without flooding the conversation?
