---
name: nexus-actuator-console-runtime
description: Use when turning Basin::Nexus decisions into a runnable execution layer with queueing, operator action, routing ownership, and feedback capture.
---

# Nexus Actuator Console Runtime

## Overview

This is Layer 3 of Basin::Nexus: the Actuator.

Its job is to take validated decisions and convert them into operator motion. That means queueing, routing, ownership, and feedback capture, not just showing a score on a screen.

## When to Use

- The system already knows what deserves action and now needs delivery.
- You need a demoable queue, console, or operator handoff layer.
- A buyer asks who gets the lead, when, and in what format.
- You need proof that the system closes the loop after decisioning.

## When Not to Use

- Source ingestion or candidate normalization.
- Score design and threshold debates.
- Static slide content that will never become a real console.

Use `nexus-logic-gates-runtime` before this skill.

## Core Jobs

The Actuator must do five things:

1. present priority,
2. assign ownership,
3. trigger action,
4. track outcome,
5. return feedback into the logic layer.

## Default Console Objects

- `priority_queue`
- `assigned_owner`
- `recommended_play`
- `action_deadline`
- `status`
- `feedback_outcome`

## Recommended Plays

Keep the first version simple and operator-readable:

- `email_sequence`
- `manual_outreach`
- `partner_intro`
- `monitor_only`
- `reject`

## Workflow

1. Build a queue first.
   Show highest-priority items at the top with explicit reason codes.
2. Make ownership visible.
   Every routed item should have a named owner or destination.
3. Attach one recommended play.
   Do not make the operator infer the next move.
4. Log outcomes.
   At minimum: acted, delayed, rejected, converted, stale.
5. Feed those outcomes back.
   Win-loss learning must return to logic or the system becomes decorative.

## Acceptable First Implementations

- Local HTML dashboard backed by JSON fixtures.
- Python app with simple filters and action buttons.
- Spreadsheet-backed queue with operator status columns.

Do not overbuild on v1. The point is proof of motion, not enterprise polish.

## Demo Pattern

For a live demo, walk one record through:

1. routed into the queue,
2. assigned to an owner,
3. given a recommended play,
4. marked with an outcome,
5. shown feeding back into future prioritization.

## Exit Criteria

This layer is complete when:

- the queue is visible,
- ownership is explicit,
- one next action is attached,
- outcomes can be captured,
- the feedback path back to logic is clear.
