# Basin Site Insights

Private, first-party measurement for `basinleon.github.io`.

## What it owns

- Pageviews, visits, engaged visits, reading time, scroll completion and click activity
- Anonymous returning-visitor measurement using a random browser identifier
- Referral and UTM attribution
- Human referral visits from ChatGPT, Claude, Perplexity, Gemini, Copilot, Poe and You.com
- Three conversion categories: commercial intent, operating interest and reader interest
- A revenue path from site visit through engagement, offer-page visit, commercial action and private inbound note
- Private contact requests from the homepage and Work With Me page
- A token-protected owner dashboard at the Worker root

The analytics collector does not store raw IP addresses, user-agent strings or personal profiles. Session and visitor identifiers are HMAC-hashed before D1 storage. Contact details are stored only when a person explicitly submits a private contact form and are removed after 180 days. A daily cron removes analytics events after 400 days. Global Privacy Control and Do Not Track are respected by the browser client.

Production collection is restricted to `https://basinleon.github.io`. Localhost, `127.0.0.1`, `file://`, automated browsers, crawlers, prefetches and prerenders are rejected before an event reaches D1.

The AI discovery panel measures attributable human referrals, not crawler requests. Some assistants suppress referrers, so this is a conservative lower bound. Search and retrieval bots remain excluded from human visitor totals.

The dashboard's **Exclude this browser** control opens the public site once with `?lb_owner=1`. The tracker stores the opt-out in both local storage and a 400-day first-party cookie, then removes the parameter from the address. The choice survives browser restarts but remains browser- and device-specific. Repeat it once in every browser or device used for owner testing. To re-enable measurement on a browser, open `https://basinleon.github.io/?lb_owner=0` once.

## Private contact intake

`POST /v1/contact` accepts first-party submissions from the public site. The endpoint uses an origin allowlist, size limits, a honeypot, minimum completion time, validation and short-window deduplication. Contact requests appear only in the token-protected owner dashboard.

The dashboard offers a manual **Copy for Nexus** action. This is an intentional privacy boundary: a raw contact request is never automatically published or promoted into a public proof asset.

## Durable backup

The D1 database is independent of the dashboard build, so rebuilding the UI does not erase events. Create a private local SQL snapshot after meaningful changes and at least monthly:

```bash
mkdir -p .private
npm run db:export
```

The snapshot is excluded from Git. Copy it to an encrypted private backup location if long-term recovery is required. Never publish it with the website repository.

## Conversion definitions

| Category | Current signals |
| --- | --- |
| Commercial intent | Email, phone, availability, résumé and case-study clicks |
| Operating interest | Basin::Nexus, system and tool clicks |
| Reader interest | Writing, fiction, archive, essay and subscription clicks |

## UTM convention

Use lowercase kebab-case values.

| Distribution path | `utm_source` | `utm_medium` |
| --- | --- | --- |
| LinkedIn post | `linkedin` | `social` |
| X post | `x` | `social` |
| Email signature | `email-signature` | `signature` |
| Direct introduction | connector or person slug | `introduction` |
| Application | company slug | `application` |
| Speaking appearance | event slug | `speaking` |

Use `utm_campaign=YYYY-MM-topic`, for example:

`?utm_source=linkedin&utm_medium=social&utm_campaign=2026-08-nexus`

## Local verification

```bash
npm install
npm test
npm run build
npm run db:local
npm run dev:worker
```

Production requires the D1 database binding plus two Wrangler secrets:

- `ADMIN_TOKEN` protects dashboard data.
- `HASH_SECRET` HMAC-hashes anonymous identifiers before storage.
