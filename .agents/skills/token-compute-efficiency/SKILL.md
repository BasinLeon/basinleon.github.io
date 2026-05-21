---
name: token-compute-efficiency
description: Use when starting complex codebase edits, analyzing large files, running multi-agent workflows, or managing context tokens and compute budgets.
---

# Token & Compute Efficiency (Quiet Machine Doctrine)

## Overview
The **Quiet Machine** doctrine establishes that high-performance engineering requires extreme token and context hygiene. A crowded context window degrades LLM attention, increases latency, and invites logic loops. This skill mandates rules for running lean, precise, and compute-efficient agent sessions.

---

## When to Use

### Use When:
- Modifying large codebases or working in long-running chats.
- Searching for specific code blocks across many directories.
- Refactoring files or generating extensive changes.
- Launching subagents or executing parallel background processes.

### Do NOT Use When:
- Running simple, isolated one-line shell commands.
- Asking basic conceptual questions unrelated to files in the workspace.

---

## Core Patterns

### 1. Progressive Disclosure (No Catting Large Files)
Never view or load a large file in its entirety if you only need a specific section. Use targeted searches first, then load narrow line ranges.

| ❌ INSUFFICIENT HYGIENE | ✅ LEAN HYGIENE |
| :--- | :--- |
| Using `view_file` on a `1,000-line` file to inspect one function. | Using `grep_search` to find the line numbers, then `view_file` specifying exact `StartLine` and `EndLine`. |
| Running `cat` or broad shell outputs of whole files. | Specifying line limits or filters via grep, awk, or tail. |

```python
# ✅ Good: Progressive view after locating target
default_api.view_file(
    AbsolutePath="/path/to/large_file.py",
    StartLine=45,
    EndLine=80,
    toolAction="Viewing exact line range for function",
    toolSummary="Inspect function target"
)
```

### 2. Subagent Sandboxing (Context Isolation)
Never clutter the parent conversation with exhaustive codebase searches, dependency lookups, or build logs. Sandbox exploratory work in a subagent.

- **The Subagent** executes 20+ tool calls, reads raw code, and processes bulky logs.
- **The Parent** receives only a clean, synthesized 10-line summary of findings.
- **Result:** You save 50,000+ context tokens from being carried over into future turns.

### 3. Diff-Only Modifications
Minimize output generation token usage by replacing only the relevant blocks of code rather than re-writing entire files.

- Use `replace_file_content` for a single contiguous change.
- Use `multi_replace_file_content` for multiple non-contiguous edits in the same file.
- **Never** use `write_to_file` to overwrite a large existing file just to modify a few lines.

### 4. No Echo Responses
Never print massive file content, full stack traces, or entire markdown documents directly in the chat response. 
- Save long outputs or summaries directly to **Artifacts** or **Scratch Files**.
- Point the user to the file path using markdown links: `[basename](file:///absolute/path/to/file)`.
- Summarize only the critical high-level takeaways in the chat.

---

## Quick Reference: Tool Efficiency

| Tool / Command | Efficiency Strategy |
| :--- | :--- |
| `grep_search` | Primary search target. Use precise queries to avoid scanning directories manually. |
| `view_file` | Always set `StartLine` and `EndLine` on files larger than 100 lines. |
| `run_command` | Limit stdout. Pipe long outputs to files (e.g., `command > scratch.log`) or use head/tail. |
| `manage_task` | Do **not** poll `status` in a loop. Launch the command, stop calling tools, and wait for the system wakeup. |

---

## Bulletproofing: Common Rationalizations

When under pressure, agents often justify context-wasting behavior. Stop and counter these rationalizations immediately:

| Excuse | Operational Truth |
| :--- | :--- |
| *"I need to read the whole file to make sure I don't miss any dependencies."* | False. Use `grep_search` or cross-reference imports first. You can selectively read other files if needed. |
| *"It is easier to rewrite the whole file than figure out the exact lines to replace."* | False. Overwriting a large file burns massive input/output tokens. Take 15 seconds to locate the target lines. |
| *"I will just print the entire log so the user sees all the details."* | False. Cluttering the chat history with logs causes immediate attention decay. Write to a scratch file and link it. |
| *"Let me poll the build status a few times quickly."* | False. Polling tools burns compute and turns. Stop calling tools and let the system wake you up. |

---

## Red Flags

If you notice these behaviors, **STOP** and restructure your turn:
- `[ ]` You viewed more than 200 lines of code without specifying `StartLine` and `EndLine`.
- `[ ]` You printed more than 20 lines of a raw log or code block in your chat response.
- `[ ]` You are about to use `write_to_file` with `Overwrite=true` on an existing file that is not a newly created artifact.
- `[ ]` You ran a command in the background and immediately called `manage_task` to check its status in the same turn.
