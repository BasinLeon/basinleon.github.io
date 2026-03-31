---
name: basin-nexus-demo-stack
description: Use when a visual Basin::Nexus concept needs to become a buildable and demoable stack across Signal Refinery, Logic Gates, and Actuator layers.
---

# Basin Nexus Demo Stack

## Overview

Use this skill when someone asks the most important follow-up question:

"Can you actually build and run this?"

This skill turns the Basin::Nexus visual into a scoped proof stack that can be shown on a call, built incrementally, and defended technically.

## When to Use

- A prospect likes the architecture visual and wants proof it is runnable.
- You need to convert the system diagram into implementation scope.
- A live walkthrough needs believable components behind each layer.
- You want a narrow proof stack instead of a vague full-platform promise.

## When Not to Use

- Pure design work without implementation intent.
- Deep enterprise architecture where hosting, auth, and compliance are the main problem.
- Generic skill authoring unrelated to Basin::Nexus.

## The Default Proof Stack

Build the stack in this order:

1. `nexus-signal-refinery-runtime`
2. `nexus-logic-gates-runtime`
3. `nexus-actuator-console-runtime`

The visual should map directly to these three runtime layers.

## Scope Rule

Always start with one narrow lane:

- one ICP,
- one signal family,
- one scoring model,
- one execution queue.

If the scope expands before the lane is proven, reset it.

## Deliverables

The default proof stack should produce:

- one fixture or real signal input set,
- one normalized candidate dataset,
- one scored decision dataset,
- one execution queue or console,
- one visual system page that mirrors the running layers.

## Build Pattern

1. Pick the lane.
   Example: VP-level buyer movement in one vertical.
2. Build Layer 1 with visible emitted records.
3. Build Layer 2 with explicit thresholds and decisions.
4. Build Layer 3 with ownership and action logging.
5. Keep the visual synchronized.
   The architecture page should always match the real runtime layers.

## Demo Script

Use this sequence on calls:

1. show the architecture visual,
2. open the refinery output,
3. open one scored decision,
4. open the queue item,
5. explain the learning loop.

This keeps the conversation grounded in real system behavior.

## Output Rule

Never claim "full platform" on first proof.

Frame it as:

- "This is the narrow operating slice."
- "The lane is real and runnable."
- "The rest of the architecture expands from here."

## Exit Criteria

The proof stack is ready when:

- all three layers exist in runnable form,
- one record can travel through the full chain,
- the visual and the runtime tell the same story.
