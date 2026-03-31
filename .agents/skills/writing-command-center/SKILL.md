---
name: writing-command-center
description: Use when the user wants one writing agent to improve emails, messages, posts, articles, essays, and other writing while routing to the right existing skill and compounding voice patterns over time.
---

# Writing Command Center

## Overview

This is the umbrella writing layer for Leon's system.

It does not replace the format-specific skills. It chooses the right one, adds the right support skill, and keeps the writing stack coherent across:

- emails
- messages
- posts
- comments
- articles
- essays
- follow-ups

Core principle: **one voice, many formats**.

## When to Use

Use this skill when:

- the user wants stronger writing across multiple formats
- the request could be email, post, article, essay, or message and format is only part of the problem
- the user wants a writing agent that gets better over time
- the task needs both structure and voice

Do not use this skill when:

- a single obvious format skill is enough and no cross-format judgment is needed
- the user only wants proofreading with no voice or positioning work

## Routing Table

Choose one lead skill and one support skill.

### Email

- Lead: `gtm-email-leader`
- Support: `human-writing-studio`

Use for:
- recruiter follow-ups
- client replies
- founder messages
- partnership emails
- operator updates

### Post

- Lead: `operator-post-composer`
- Support: `human-writing-studio`

Use for:
- LinkedIn posts
- X posts
- short authority-building pieces

### Humanization / rewrite

- Lead: `human-writing-studio`
- Support: `voice-calibration-lab`

Use for:
- "this sounds AI"
- "make this sound like me"
- rewriting rough drafts into spoken, human language

### Clarity / structure

- Lead: `writing-clearly-and-concisely`
- Support: `human-writing-studio`

Use for:
- articles
- essays
- memos
- documents that need cleaner argument flow

### Short-form replies

- Lead: `human-comment-engine`
- Support: `human-writing-studio`

Use for:
- quick messages
- comments
- short replies

## Default Process

### 1. Identify the writing job

Lock these four things first:

- format
- audience
- outcome
- tone

If the user gives messy context, reduce it to one sentence:

`This is a [format] for [audience] that needs to achieve [outcome].`

### 2. Choose the writing stance

Pick one stance before writing:

- calm operator
- warm professional
- sharp and selective
- reflective and human
- concise and practical

Do not mix multiple stances unless the user asks.

### 3. Route to the right sub-skill

Pick the lead skill from the routing table.

Then add one support skill only if it materially improves:

- voice
- clarity
- status
- readability

### 4. Write with a controlled output contract

Default output:

- `Final draft`
- `Sharper option`
- `Why this works`

For longform, use:

- `Clean draft`
- `Rawer draft`
- `Structural note`

### 5. Capture reusable learning

When the user clearly likes or rejects wording, preserve the pattern mentally for future turns using this structure:

- phrases to keep
- phrases to avoid
- sentence length preference
- preferred level of warmth
- tolerated jargon
- signature rhythm

Do not announce this every time.

## 24/7 Improvement Loop

When used as part of a repeated workflow:

1. review recent drafts, sent emails, posts, or essays
2. identify what landed and what felt weak
3. extract one reusable writing rule
4. improve one example across 2 formats
5. return a tighter default pattern for next time

The goal is not endless theory.

The goal is a compounding writing system that becomes:

- clearer
- more human
- more selective
- more useful

## Non-Negotiables

- No inflated language.
- No fake confidence theater.
- No consultant filler.
- No unnecessary apology.
- No em dash unless the user wants it.
- Do not sound like a content machine.

## Success Test

The skill is working if the writing:

- sounds like one person across formats
- reads cleanly on first pass
- preserves status
- gets to the point faster
- still feels human
