# LB's Desk Local Data Spine Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace scattered embedded/localStorage data handling in LB's Desk with a versioned local workspace store and first-pass ingest inbox while preserving the current 3-pane UI.

**Architecture:** Keep the app as a single local HTML file for now, but introduce a centralized JavaScript repository layer inside the page. The repository owns schema versioning, workspace hydration, manual record writes, and ingestion staging. Existing UI rendering reads from the repository instead of directly from embedded JSON and ad hoc storage helpers.

**Tech Stack:** Plain HTML/CSS/JavaScript, `localStorage`, browser File APIs, Node-based smoke tests.

---

### Task 1: Add a failing data-spine verification

**Files:**
- Modify: `/Users/basin/Desktop/Basin & Associates 🌍/tmp/lbs_desk_smoke_test.js`
- Test: `/Users/basin/Desktop/Basin & Associates 🌍/tmp/lbs_desk_smoke_test.js`

**Step 1: Write the failing test**

Add expectations for:
- `DB_SCHEMA_VERSION`
- `createEmptyWorkspace`
- `hydrateWorkspace`
- `workspaceStore`
- `ingestInbox`

**Step 2: Run test to verify it fails**

Run: `node tmp/lbs_desk_smoke_test.js`
Expected: FAIL with missing data-layer surfaces.

**Step 3: Write minimal implementation**

Add the new repository/data-store symbols in `docs/lbs_operator_desktop.html`.

**Step 4: Run test to verify it passes**

Run: `node tmp/lbs_desk_smoke_test.js`
Expected: PASS

### Task 2: Introduce a versioned workspace schema

**Files:**
- Modify: `/Users/basin/Desktop/Basin & Associates 🌍/docs/lbs_operator_desktop.html`

**Step 1: Write the failing test**

Extend the smoke test to require:
- a workspace schema version constant
- a default workspace factory
- a hydration path from the embedded source into normalized entities

**Step 2: Run test to verify it fails**

Run: `node tmp/lbs_desk_smoke_test.js`
Expected: FAIL for missing schema helpers.

**Step 3: Write minimal implementation**

Add:
- a version constant
- `createEmptyWorkspace()`
- `createWorkspaceFromSource()`
- `hydrateWorkspace()`
- normalized collections for opportunities, people, tasks, imports, and activities

**Step 4: Run test to verify it passes**

Run: `node tmp/lbs_desk_smoke_test.js`
Expected: PASS

### Task 3: Route the UI through the repository

**Files:**
- Modify: `/Users/basin/Desktop/Basin & Associates 🌍/docs/lbs_operator_desktop.html`

**Step 1: Write the failing test**

Extend the smoke test to require a central `workspaceStore` object and repository-backed load/save functions.

**Step 2: Run test to verify it fails**

Run: `node tmp/lbs_desk_smoke_test.js`
Expected: FAIL

**Step 3: Write minimal implementation**

Replace direct reads/writes of fragmented `localStorage` state with a centralized workspace store while keeping current UI behavior.

**Step 4: Run test to verify it passes**

Run: `node tmp/lbs_desk_smoke_test.js`
Expected: PASS

### Task 4: Build the first ingest inbox

**Files:**
- Modify: `/Users/basin/Desktop/Basin & Associates 🌍/docs/lbs_operator_desktop.html`

**Step 1: Write the failing test**

Extend the smoke test to require:
- `ingestInbox`
- import staging helpers
- an inbox render surface

**Step 2: Run test to verify it fails**

Run: `node tmp/lbs_desk_smoke_test.js`
Expected: FAIL

**Step 3: Write minimal implementation**

Stage imported rows into an inbox before merge, render them in the right pane, and support approve/dismiss actions.

**Step 4: Run test to verify it passes**

Run: `node tmp/lbs_desk_smoke_test.js`
Expected: PASS

### Task 5: Verify the final artifact and sync Desktop file

**Files:**
- Modify: `/Users/basin/Desktop/LB's Operator.html`

**Step 1: Run verification**

Run:
- `node tmp/lbs_desk_smoke_test.js`
- browser render check against `docs/lbs_operator_desktop.html`
- direct verification against `/Users/basin/Desktop/LB's Operator.html`

**Step 2: Sync**

Copy the verified workspace file back to the Desktop artifact.
