---
description: How to log an AI session into Obsidian at end of every conversation
---

# AI Session Logging Workflow

Every AI agent (Antigravity, Codex, Cursor, Claude) MUST log its session to Obsidian at the end of the conversation.

## Location
All session notes go to:
```
/Users/basin/Desktop/Basin & Associates 🌍/Leon's Journal/01_Codex Hub/01_Session Notes/
```

## File Naming Convention
```
Session - YYYY-MM-DD - [Short Title].md
```
Example: `Session - 2026-02-22 - Antigravity.md`

If multiple sessions on the same day, add a descriptor:
```
Session - 2026-02-22 - YouTube Leads.md
Session - 2026-02-22 - Antigravity.md
```

## Template (MUST use this exact format)
```markdown
# Session - YYYY-MM-DD - [Title] ([Agent Name])

## Objectives
- [What the user asked for in this session]

## What We Shipped
- [List every deliverable: files created, features built, decisions made]
- [Be specific: include file paths]

## Files Created/Updated
- [Full paths to all files that were created or modified]

## Decisions
- [Key decisions made during the session]
- [Why certain approaches were chosen]

## Next Actions
- [ ] [Outstanding items to pick up in the next session]
```

## After Writing the Session Note
1. Update the Codex Hub Index at:
   ```
   /Users/basin/Desktop/Basin & Associates 🌍/Leon's Journal/01_Codex Hub/01_Codex Hub.md
   ```
   Add a new row to the Session Log table.

2. If you created AI Learning content, also update:
   ```
   /Users/basin/Desktop/Basin & Associates 🌍/Leon's Journal/Leon's Notes/AI_LEARNING/AI Learning Navigator.md
   ```

## Rules
- ALWAYS log, even for short sessions
- Include the agent name (Antigravity, Codex, Cursor, Claude, etc.)
- Use absolute file paths for any files referenced
- Mark completed items with `[x]`, pending with `[ ]`
- If the session was a continuation of a previous one, reference it with `[[wikilink]]`
