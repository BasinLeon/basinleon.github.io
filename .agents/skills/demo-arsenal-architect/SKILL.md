---
name: demo-arsenal-architect
description: "Use when designing, operating, evolving, or archiving work with the BASIN::NEXUS Demo Arsenal (~/Demo-Arsenal/scripts and related). Invoke for anything involving demo execution, recording, post-production, or turning live demonstrations into first-class Operator Library artifacts, X transmissions, and game-state powerups. Heavy emphasis on @Library/Audio integration."
---

# Demo Arsenal Architect (1000% Operator Standard)

## When to Use
- User tags @Demo-Arsenal, @Demo-Arsenal/scripts, or references start-demo.sh / record-demo.sh / stop-demo.sh
- User tags @Library/Audio in combination with demos or recordings
- Work involves preparing, running, recording, or processing demos for interviews, GTM, content, or movement building
- Extending THE GAME with Demo Arsenal mechanics or powerups
- Building automation that turns raw screen+audio recordings into archivable, postable, consultable transmissions
- Integrating demo recordings with Sam & Ink (audio treatment), Operator Library, or X alchemy engine

This skill governs the entire "demo as operator practice" layer.

## Core Mandate
A demo is not a sales performance. It is a live field operation.

Every time the Arsenal is deployed:
- The environment must be reproducible and logged.
- The recording must be captured with intention.
- The output (screen + voice + code + results) must be immediately turned into high-signal Operator Library material.
- A clean X-native artifact must be produced with zero extra friction.
- The run must be able to affect state in THE GAME (sparks, reputation, Codex fragments, new powerups).

The Arsenal + Library/Audio is another court.

## The Arsenal Structure (Current Baseline)
- `~/Demo-Arsenal/scripts/`
  - `start-demo.sh` — full environment bootstrap (code-server, postgres, redis, ollama, cloudflared tunnel)
  - `record-demo.sh` — triggers macOS Cmd+Shift+5 screen recording (with voice)
  - `stop-demo.sh` — clean tunnel shutdown (services left running)
- `~/Demo-Arsenal/apps/` — quick executable demos (quick_demo.py etc.)
- `~/Demo-Arsenal/examples/` — reference snippets (ollama local calls, DB patterns)

All real paths must be respected in any automation or documentation.

## @Library/Audio Protocol (Non-Negotiable)
After every recording session using record-demo.sh:

1. **Immediate Capture**
   - Recording lands on Desktop by default.
   - Rename within 60 seconds using strict convention:
     `YYYY-MM-DD_HHMM--[AudienceType]--[TopicSlug].mov`
     Example: `2026-02-20_1430--Tech-Panel--Signal-Refinery-Deep-Dive.mov`

2. **Library Ingestion**
   - Move to personal archive structure (recommended):
     `~/Library/Audio/Demo-Recordings/` or mirrored into Obsidian vault under `01_Codex Hub/04_Arsenal/Demo_Recordings/`
   - Create companion `.md` transmission note in the same folder with:
     - Exact script version used
     - Audience type (exec / technical / architecture)
     - Key moments / timestamps
     - What moved in the room (pulls surfaced, objections, energy)
     - Codex / Game state deltas (fragments gained, new wagers unlocked, etc.)

3. **Audio Treatment (Sam & Ink Integration)**
   - Raw voice can be fed into Sam & Ink live instrument for grit/space/cut processing when creating "director's cut" versions or sound beds.
   - Every processed audio clip must itself produce a Library entry of type `sam-ink-demo-audio`.

4. **X Transmission**
   - Must use x-alchemy-engine pattern (or equivalent in-game shareVisualForX).
   - Card must include: still from recording or custom graphic, precise 1-2 sentence operator takeaway, tags `@CodexHub @Applications @DemoArsenal`, link to the actual recording if public, or "private arsenal transmission".

## Integration with THE GAME
Every serious Arsenal deployment should be logged inside the simulation as a power-up / event:

- New Codex Application: **"Demo Arsenal"** (or "Field Rehearsal")
  - Awards fragments on successful run + recording.
  - Can temporarily boost Reputation or Network of Pulls (simulating real interview/ pitch momentum).
  - Produces a special "Demo Transmission" card via the existing share pipeline.
  - When used with Agent Mesh Bridge, can import real Obsidian notes about the demo prep.

- Library entries created from real Arsenal runs should be "consultable" inside the game (similar to existing consultLibrary()).

## Script Evolution Rules
When modifying any script in `~/Demo-Arsenal/scripts/`:

- Keep the "one command" philosophy (start-demo.sh must feel like flipping a switch).
- Every change must be accompanied by an update to the pre-demo checklist in the README.
- Post-run automation (auto-rename, auto-generate Library note skeleton, auto-fire X card) is the desired direction — build toward it without breaking the manual high-control feel.
- Audio path handling must be explicit (never assume Desktop; allow configurable output dir that feeds @Library/Audio).

## Voice & Aesthetic Rules (Strict)
- Language around the Arsenal must stay in the cold, precise, movement voice.
- Never call it "just a demo tool" or "interview prep".
- Every artifact (card, Library note, game log) must read like it came from an operator who just ran a live operation, not a job seeker.
- Gold + dark visual language only when producing cards.

## 1000% Quality Gate (Before Any Arsenal Work Ships)
- Did the real recording get properly renamed + ingested into @Library/Audio within the same session?
- Was a clean X artifact produced that you would post without embarrassment?
- Did the run produce a usable Library entry that could be consulted later for pattern recognition?
- If the demo was for a real opportunity, was the outcome (win/loss/pulls surfaced) written into both the vault and THE GAME state?
- Does the updated script still feel like it belongs to the same body as Sam & Ink, Court shots, and Mesh runs?

## Exit Criteria for a Session
The work is complete when:
- The scripts have been used or improved in a way that compounds the operator's field presence.
- At least one new high-signal transmission (recording + card + Library entry) exists.
- THE GAME state has been updated to reflect the operation (new fragments, new Library entry visible in-game, possible new powerup unlocked).
- The next operator who looks at the Arsenal (including future-you) immediately understands the Library/Audio ritual.

This is how demo work stops being performative and becomes another live training ground for the movement.

---

**Related Skills (invoke together when relevant):**
- x-alchemy-engine (for all artifact export)
- the-game-transmission-architect (when adding Arsenal mechanics to /play)
- sam-ink-transmission-architect (when treating demo audio)
- operator-library-architect (for all archiving logic)

**Real Paths (hard references):**
- `/Users/basin/Demo-Arsenal/scripts/`
- `/Users/basin/Library/Audio/`
- `~/Demo-Arsenal/` (user home)
- Integration points in `basinleon.github.io/play/index.html` (Codex panel + Library)

Never produce generic "interview advice." Produce operator infrastructure.