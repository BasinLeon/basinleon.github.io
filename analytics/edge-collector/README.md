# Leon site insights

Private, first-party event collection for `basinleon.github.io`.

## What it records

- pageviews and active reading time
- scroll depth
- every internal, outbound, email, phone, and download click
- referrer host and UTM campaign fields
- device class and Cloudflare-provided country, region, and city
- a session ID generated in the browser
- a keyed visitor token generated at the edge

The Worker receives the request IP because every web server does. It immediately
combines that IP with the user agent, signs the combination with HMAC-SHA256,
and stores only the resulting token. The literal IP is never written to the
dataset, logs, browser storage, or page.

Analytics Engine retains data for 90 days. Queries require the private
Cloudflare account API.

## Deploy

```bash
npm install
npx wrangler login
npx wrangler secret put VISITOR_HASH_KEY
npx wrangler deploy
```

Use a long random value for `VISITOR_HASH_KEY`. After deployment, add the
returned endpoint to public pages:

```html
<meta
  name="lb-insights-endpoint"
  content="https://leon-site-insights.<account>.workers.dev/v1/event"
>
```

The shared client is `/assets/js/insights.js`. It respects Global Privacy
Control and Do Not Track. Without the meta tag, aggregate Plausible tracking
continues and the edge collector remains dormant.

## Query

Use the statements in `queries.sql` with Cloudflare's Analytics Engine SQL API:

```bash
curl -X POST \
  "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/analytics_engine/sql" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  --data-binary @queries.sql
```

Run individual statements rather than the whole file at once.
