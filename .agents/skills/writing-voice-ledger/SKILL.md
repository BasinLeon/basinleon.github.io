---
name: writing-voice-ledger
description: Use when the user wants accepted phrasing, rejected phrasing, voice preferences, and cross-format writing patterns preserved in a reusable ledger that improves future emails, messages, posts, articles, and essays.
---

# Writing Voice Ledger

## Overview

This skill stores writing taste as reusable operating memory.

It is the companion memory layer for `writing-command-center`.

The goal is simple:

- keep what sounds like Leon
- drop what sounds generic
- preserve wording that repeatedly works
- build one writing identity across formats

## When to Use

Use this skill when:

- the user says a draft is good, bad, too AI, too formal, too soft, or off-voice
- a phrase, sentence pattern, or close clearly lands
- the user wants the system to get better at writing over time
- a writing task reveals a stable preference worth preserving

Do not use this skill when:

- the change is purely factual and says nothing about voice
- the wording preference is obviously one-off and not reusable

## Storage Target

Primary ledger:

`/Users/basin/Desktop/Basin & Associates 🌍/Leon's Journal/02_Reference/Writing_Voice_Ledger.md`

Optional session note:

`/Users/basin/Desktop/Basin & Associates 🌍/Leon's Journal/01_Codex Hub/01_Session Notes/`

## What To Capture

Only capture patterns worth reusing.

### 1. Keep Phrases

Store wording the user explicitly liked or approved.

Examples:

- crisp openings
- useful closers
- signature framing lines
- sentence rhythms that sound natural

### 2. Avoid Phrases

Store wording the user rejected.

Examples:

- too polished
- too robotic
- too formal
- too salesy
- too much jargon

### 3. Voice Preferences

Capture stable preferences such as:

- sentence length
- warmth level
- directness
- tolerance for jargon
- formality
- punctuation preferences

### 4. Format-Specific Rules

Capture distinctions by format:

- emails
- short messages
- posts
- articles
- essays

### 5. Approved Structures

Store patterns that repeatedly work.

Examples:

- answer first, context second
- one-line opener, one-line ask
- short paragraph blocks

## Required Ledger Sections

```markdown
## Keep Phrases

## Avoid Phrases

## Voice Settings

## Format Rules

## Approved Patterns

## Recent Adds
```

## Capture Format

When adding memory, use short entries like:

```markdown
- 2026-03-26: "Wanted to follow up on our March 11 conversation." -> good email opener; calm, direct, not needy.
```

For rejected phrasing:

```markdown
- 2026-03-26: "I continue to think I could add value here, especially where..." -> too self-descriptive for a recruiter follow-up.
```

## Update Rule

Only add something if one of these is true:

- user explicitly approves it
- user explicitly rejects it
- the contrast between good and bad is unusually clear

Do not dump whole drafts into the ledger.

Capture the reusable lesson, not the transcript.

## Reload Rule

Before writing for the user again:

1. check the ledger if the task is voice-sensitive
2. read `Keep Phrases`
3. read `Avoid Phrases`
4. apply the relevant format rule

## Principle

The system improves when taste is stored as decisions, not vague memory.
