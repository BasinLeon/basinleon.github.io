---
name: nexus-logic-gates-runtime
description: Use when converting refined Basin::Nexus candidates into a runnable scoring and confidence-gating layer that decides what to ignore, what to review, and what to route.
---

# Nexus Logic Gates Runtime

## Overview

This is Layer 2 of Basin::Nexus: the Logic Gates.

Its job is to decide whether a refined signal deserves action. The key principle is simple: every signal must pass through explicit context and confidence gates before the system escalates it.

## When to Use

- A buyer asks how the system knows signal from noise.
- You need to implement the score and validation layer behind the diagram.
- Signals are already ingested but the next-best action is still ambiguous.
- You need a deterministic rule path for demos, pilots, or early infrastructure.

## When Not to Use

- Raw ingestion and normalization work.
- Final execution console or outbound sequencing.
- Cases where the user only wants a conceptual explanation.

Use `nexus-signal-refinery-runtime` before this skill. Use `nexus-actuator-console-runtime` after it.

## Core Decision

The system must answer three questions:

1. Is this real?
2. Is this relevant?
3. What action tier does it deserve?

## Recommended Gate Order

1. `fit_gate`
   Is this inside the defined ICP or target lane?
2. `intent_gate`
   Is there actual motion or only weak ambient noise?
3. `trust_gate`
   Is the source and interpretation strong enough for automation?
4. `action_gate`
   Route, hold for human review, or ignore.

## Baseline Scoring Model

Start simple. Use transparent scoring before adding LLM judgment.

- `fit_score`: 0-30
- `intent_score`: 0-30
- `urgency_score`: 0-20
- `trust_score`: 0-20

Then define tiers:

- `80-100`: route now
- `60-79`: operator review
- `0-59`: ignore or monitor

If a pilot needs different thresholds, state them explicitly in the artifact.

## Workflow

1. Define the target lane.
   The logic is invalid without a clear ICP or trigger definition.
2. Score with visible math first.
   Buyers trust explicit logic more than hidden model behavior.
3. Add context logic second.
   Examples: competitor mention, executive seniority, region priority, buying window.
4. Make human review a first-class output.
   Low-confidence automation should not masquerade as certainty.
5. Emit a structured decision object.

## Required Output Object

Every candidate should end this layer with:

- `overall_score`
- `decision_tier`
- `decision_reason`
- `recommended_action`
- `review_required`
- `routing_priority`

## Demo Pattern

For live demos, show three examples:

1. a clear route-now candidate,
2. a human-review candidate,
3. an ignore candidate.

This proves the system is selective, not just optimistic.

## Exit Criteria

This layer is complete when:

- scoring is transparent,
- thresholds are explicit,
- human review is supported,
- every candidate exits with a deterministic decision object.
