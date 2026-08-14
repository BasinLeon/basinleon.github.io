# Basin Site Insights

Private, first-party measurement for `basinleon.github.io`.

## What it owns

- Pageviews, visits, engaged visits, reading time, scroll completion and click activity
- Anonymous returning-visitor measurement using a random browser identifier
- Referral and UTM attribution
- Three conversion categories: commercial intent, operating interest and reader interest
- A token-protected owner dashboard at the Worker root

The collector does not store raw IP addresses, user-agent strings, email addresses or personal profiles. Session and visitor identifiers are HMAC-hashed before D1 storage. A daily cron removes events after 400 days. Global Privacy Control and Do Not Track are respected by the browser client.

Production collection is restricted to `https://basinleon.github.io`. Localhost, `127.0.0.1`, `file://`, automated browsers, crawlers, prefetches and prerenders are rejected before an event reaches D1.

The dashboard's **Exclude this browser** control opens the public site once with `?lb_owner=1`. The tracker stores the opt-out in both local storage and a 400-day first-party cookie, then removes the parameter from the address. The choice survives browser restarts but remains browser- and device-specific. Repeat it once in every browser or device used for owner testing. To re-enable measurement on a browser, open `https://basinleon.github.io/?lb_owner=0` once.

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
