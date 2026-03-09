# Scraper Foundry Product Strategy

## Thesis

Scraper Foundry should start as an internal signal refinery. That is where Basin gets the most leverage, the fastest. Public monetization should come later and only for modules that are broad, stable, and low-risk.

The goal is not to publish the most actors. The goal is to own the highest-value signal paths and decide which ones deserve distribution.

## Three product buckets

### 1. Core proprietary

These should stay private because they encode your edge.

Keep private:
- routing logic into Basin operating systems
- intent scoring
- lead qualification rules
- account prioritization logic
- cross-source signal fusion
- recommended next-action generation
- proprietary enrichment joins

These are not just data extraction. They are the judgment layer.

### 2. Selective public actors

These can be monetized because they solve common extraction problems without exposing your strategic logic.

Good public candidates:
- Google Maps prospecting
- generic jobs scraping
- review collection
- public local-business enrichment
- broad company page extraction

These work because buyers understand the input, the output, and the value.

### 3. Services and private deployments

Some modules should never become self-serve products. They are better sold as custom work, premium workflows, or partner-only access.

Good service candidates:
- authenticated source capture
- LinkedIn session-assisted recon
- investor/founder workflow pipelines
- custom change-detection systems
- multi-source account dossiers

## Decision test for public release

Public release is a fit when all of these are true:

- the source is legally and operationally workable
- the value proposition is understandable in one sentence
- the output schema is stable
- the actor does not expose Basin scoring or routing logic
- support burden is manageable
- the buyer exists outside your own workflow

If any of those are false, keep it private.

## Initial product map

### Private now

- `linkedin_recon`
- future `founder_network_monitor`
- future `account_change_detector`
- future `hf0_founder_signal`
- future `boardy_network_signal`

### Public later

- `google_maps_prospecting`
- `jobs_signal_monitor`
- `review_intel_collector`
- `company_page_extractor`

### Service-led

- authenticated social scraping
- private CRM-bound enrichment pipelines
- founder or investor sourcing systems

## Monetization ladder

Start with internal use. Then graduate in stages.

### Stage 1: Internal only

Measure:
- records captured
- percent deduped cleanly
- percent routed into live workflows
- downstream conversion value

### Stage 2: Private beta

Wrap one actor for a few trusted users or clients.

Measure:
- run success
- support burden
- schema stability
- willingness to pay

### Stage 3: Public actor

Expose only the extraction and basic normalization layer.

Charge on:
- records scraped
- enrichment events
- scheduled runs
- premium export formats or webhooks

### Stage 4: Platform layer

Only after several actors prove repeatable demand:
- shared billing
- shared dashboards
- orchestration
- actor templates
- public catalog

## Recommended first monetized actor

`google_maps_prospecting`

Why:
- broad demand
- simple buyer story
- easy output contract
- useful across local services, agencies, and sales teams
- easier to support than authenticated social sources

## Recommended private moat

Keep this inside Basin:
- signal scoring
- operator routing
- cross-source enrichment
- account dossier generation
- founder/investor sourcing logic

That is the part worth defending.

## Near-term roadmap

1. Stabilize `lead_record` across actors.
2. Add Apify dataset import as an adapter, not a dependency.
3. Build `jobs_signal_monitor` as the third actor.
4. Track actor quality, run metadata, and downstream conversion.
5. Choose one public beta candidate after two internal actors prove value.
