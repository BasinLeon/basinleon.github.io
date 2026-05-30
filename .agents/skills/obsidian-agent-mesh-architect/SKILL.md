---
name: obsidian-agent-mesh-architect
description: "Use when designing, implementing, or evolving the Obsidian Agent Mesh (or any multi-agent routing system inside Obsidian). Invoke for building orchestrators, specialist agents (writer/researcher/organizer + domain extensions like Movies/TV), shared context packages, safe write pipelines, and run logging that feeds the Operator Library and X movement. Must produce 1000% operator-grade, layered, X-native outputs."
---

# Obsidian Agent Mesh Architect (1000% Standard)

## When to Use
Use this skill when the user is working on the Obsidian Agent Mesh (as defined in `CodexHub/05_Decisions/Obsidian_Agent_Mesh_v1_2026-02-20.md`) or extending it:
- Adding new specialists (especially domain ones like `movies-tv-analyst`)
- Refining the orchestrator routing logic
- Designing shared context packages that respect vault privacy and performance
- Building or hardening the preview/apply + run logging pipeline
- Ensuring every mesh execution writes high-signal artifacts to the Operator Library and can be transmitted on X

This skill ensures the mesh stays true to the movement: raw, layered, consultable, and generative of real field signal.

## Core Mandate
The Agent Mesh is not a productivity hack. It is an extension of the operator's nervous system inside the vault.

Every specialist must operate like a Codex power-up:
- Surface action (what it does)
- Deeper transmission (what pattern or layer it reveals)
- Hidden potential (what it unlocks when combined with other systems or repeated use)

All outputs must be archivable and re-broadcastable.

## The Process

### 1. Map the Current Mesh State
Before any design work:
- Read the active decision doc (`CodexHub/05_Decisions/Obsidian_Agent_Mesh_v1_...md`)
- Identify the current baseline (which specialists exist, what the orchestrator does, logging status)
- Note any "Movies/TV" or domain-specific needs the user is tagging

### 2. Design Specialists as Power-Ups
For any new specialist (especially `movies-tv`):
- Define its exact intent triggers (keywords, phrasing patterns)
- Define its context needs (what vault elements it must read: notes on films, personal ratings, thematic links, etc.)
- Define its allowed actions (append review, create "Field Transmission" note, extract themes as tags, link to Codex entries, etc.)
- Give it a clear "voice" that matches the transmissions (precise, slightly cold, movement-oriented)

Example for Movies/TV specialist:
- Routes on prompts containing "film", "show", "series", "watch", "review", "thematic", "symbolism", "performance"
- Reads the active note + linked watchlist/reviews + any personal Codex entries on "cinema as field"
- Outputs: structured analysis (surface plot + deeper layers + operator resonance), suggested Library entry, X-ready transmission card

### 3. Strengthen the Orchestrator
- Make routing deterministic + explainable (show confidence + why this specialist)
- Support explicit slash commands (`/movies-tv`, `/film-analysis`)
- Add fallback: if confidence low on domain specialists, ask one clarifying question before routing
- Always pass a normalized context object (goal, vault_sources, recent_history, user_intent)

### 4. Context & Performance Discipline
- Truncate aggressively with explicit priority (active note > backlinks > tags > broader history)
- Never dump entire vault
- Make context building a reusable module that other skills can call

### 5. Safe Write + Observability (Non-Negotiable)
- Every write action must go through preview + explicit confirm
- Every run must produce a clean log entry in the designated runlog folder
- Log entries must be high-signal enough to be useful for later Library consultation or debugging
- Include enough metadata for replay (prompt hash, specialist chosen, actions applied, errors)

### 6. X Alchemy & Library Integration
- Every specialist output should be capable of generating a clean X artifact (via the established x-alchemy-engine pattern)
- Automatically offer to archive high-quality outputs to the Operator Library as "Agent Mesh Transmission" or domain-specific type (e.g., "Movies/TV Field Note")
- When a run produces something particularly potent, surface it for immediate X export with proper tags (@CodexHub @Applications)

### 7. Movies/TV Domain Extension (Specific Guidance)
When the user tags @Movies/TV:
- Treat cinema/TV as another "court" — surface narrative + deeper symbolic/layered readings + operator resonance (what it activated in the viewer)
- Support linking film notes to personal Codex entries, past transmissions, or Sam & Ink creative work
- Generate artifacts that feel like part of the movement (raw, high-signal, not generic reviews)

### 8. 1000% Quality Gate
Before any mesh change ships:
- Run the new flow end-to-end on a real user prompt from the current vault
- Verify the run log is actually useful for later consultation
- Confirm any generated X artifact would be something you'd post without heavy editing
- Check that context usage stays reasonable (no bloat)
- Ensure the specialist language matches the established operator voice

## Voice & Aesthetic Rules
- All specialist outputs and prompts must stay in the precise, high-resolution, slightly cold transmission voice.
- UI elements the mesh touches should feel like the rest of the operator tools (minimal, gold accents on black, no fluff).
- Never let the mesh become "AI slop." Every response must feel like it came from a skilled operator, not a generic model.

## Exit Criteria
The mesh work (or extension) is complete when:
- New specialists (including domain ones like Movies/TV) can be routed to cleanly
- Shared context is reliable and performant
- Every execution is logged at high signal
- Outputs are natively archivable to the Library and exportable to X with zero extra work
- The whole system still feels like an extension of the operator's own nervous system, not a separate "AI tool"

This is how the vault becomes a true multi-agent extension of the Codex and the movement instead of just another plugin.