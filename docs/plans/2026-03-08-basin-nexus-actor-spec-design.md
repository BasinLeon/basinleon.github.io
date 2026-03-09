# Basin::Nexus Actor Spec Design

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Define the shared contract, folder structure, and lifecycle for Basin::Nexus Scraper Foundry actors.

**Architecture:** Foundry actors follow a four-step path: capture raw source data, normalize it into a canonical Basin schema, refine it with scoring and routing metadata, and hand it to internal operating systems or a product wrapper. Shared contracts live in `core/`, actor-specific logic lives in `targets/`, and tests lock each target to a stable output contract.

**Tech Stack:** Python 3, `unittest`, CSV/JSON inputs, optional Playwright for browser-backed capture.

---

## Purpose

Basin::Nexus should not become a generic scraper warehouse. It should become a signal refinery. Each actor must produce clean, decision-ready records that fit Basin operating workflows. Public monetization is optional. Internal leverage is required.

## Actor contract

Every actor must declare:

- `actor_id`: stable internal identifier such as `linkedin_recon` or `google_maps_prospecting`
- `actor_version`: semantic version for compatibility tracking
- `source_type`: source format such as `text`, `json`, `html`, or `browser`
- `source_label`: human-readable source reference
- `output_schema`: canonical Basin schema such as `lead_record`, `company_record`, `location_record`, `signal_event`, or `account_dossier`
- `dedupe_keys`: fields that define idempotent writes
- `run_started_at`: run timestamp for traceability

Current implementation:

- [actor_contract.py](/Users/basin/Desktop/Basin%20&%20Associates%20🌍/WAR_ROOM_2026/03_ENGINEERING/scraper_foundry/core/actor_contract.py)
- [universal_scraper.py](/Users/basin/Desktop/Basin%20&%20Associates%20🌍/WAR_ROOM_2026/03_ENGINEERING/scraper_foundry/core/universal_scraper.py)

## Canonical schemas

Start with a small set:

### `lead_record`

Use for direct outreach destinations and operator queues.

Fields:
- `name`
- `email`
- `title`
- `company`
- `phone`
- `linkedin`
- `slack`
- `whatsapp`
- `source_file`
- `source_root`
- `seniority`
- `persona`
- `intent_score`
- `intent_tier`
- `last_touch_date`
- `next_action_date`
- `next_action`
- `channel_permission`
- `engagement_status`
- `owner`
- `sequence_stage`
- `notes`

### `company_record`

Use for account-level monitoring and enrichment. Suggested fields:
- `company_name`
- `website`
- `hq_location`
- `industry`
- `company_size`
- `source`
- `confidence_score`
- `notes`

### `location_record`

Use for local business and territory actors. Suggested fields:
- `company_name`
- `location_name`
- `address`
- `city`
- `state`
- `postal_code`
- `website`
- `phone`
- `rating`
- `reviews_count`
- `source`
- `notes`

### `signal_event`

Use for change detection and watchlists. Suggested fields:
- `entity_name`
- `event_type`
- `event_source`
- `event_timestamp`
- `impact_score`
- `evidence`
- `recommended_action`

### `account_dossier`

Use for merged account intelligence packages. Suggested fields:
- `account_name`
- `summary`
- `priority`
- `signals`
- `contacts`
- `risks`
- `recommended_sequence`

## Required actor methods

Each actor should expose this minimum surface:

- `parse_*`: convert raw source payloads into canonical records
- `append_*_to_master`: write normalized records into Basin operating stores
- `append_*_to_default_master`: internal default sink for hands-off runs

Browser-backed actors may also expose:

- `capture_*`: collect raw content from the live source
- `resume_session`: reuse saved state from a headed login

## Folder structure

Recommended structure:

```text
WAR_ROOM_2026/03_ENGINEERING/scraper_foundry/
  README.md
  core/
    actor_contract.py
    universal_scraper.py
    schemas.py
    scoring.py
    exporters.py
  targets/
    linkedin_recon.py
    google_maps_prospecting.py
    jobs_signal_monitor.py
    company_change_detector.py
  adapters/
    playwright_session.py
    apify_dataset.py
    csv_import.py
  samples/
    linkedin/
    google_maps/
  tests/
    test_linkedin_recon.py
    test_actor_contract_and_google_maps.py
    test_jobs_signal_monitor.py
  docs/
    actor-catalog.md
    source-notes.md
```

## Runtime lifecycle

Each actor run should follow the same path:

1. `Capture`
Raw source arrives as text, JSON, HTML, or browser state.

2. `Normalize`
Actor maps the raw payload into one canonical Basin schema.

3. `Refine`
Shared scoring and routing logic adds priority, permission, and notes.

4. `Write`
Shared exporter appends deduped records to the correct operating store.

5. `Graduate`
If the actor becomes monetizable, add a public wrapper. Do not mix public pricing logic into the internal core.

## Design rules

- Internal operating value beats catalog size.
- Actors should be idempotent.
- Dedupe rules must be explicit.
- Output schemas must stay small and stable.
- Product wrappers should depend on actors, not the other way around.
- Browser automation is an adapter, not the architecture.

## Current actors

- [linkedin_recon.py](/Users/basin/Desktop/Basin%20&%20Associates%20🌍/WAR_ROOM_2026/03_ENGINEERING/scraper_foundry/targets/linkedin_recon.py)
- [google_maps_prospecting.py](/Users/basin/Desktop/Basin%20&%20Associates%20🌍/WAR_ROOM_2026/03_ENGINEERING/scraper_foundry/targets/google_maps_prospecting.py)

## Next implementation moves

1. Add shared schema constants in `core/schemas.py`.
2. Move intent scoring into `core/scoring.py`.
3. Add sample payloads for regression tests.
4. Add one `signal_event` actor and one `company_record` actor.
5. Add an adapter that can import Apify datasets without changing target logic.
