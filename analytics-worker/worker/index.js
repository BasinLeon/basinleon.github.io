const EVENT_TYPES = new Set([
  "Pageview",
  "Engaged Visit",
  "Reading Time",
  "Scroll Depth",
  "Internal Click",
  "Outbound Click",
  "Email Click",
  "Phone Click",
  "Download",
  "Conversion",
  "Hiring Funnel View",
  "Hiring Funnel Step"
]);

const MAX_BODY_BYTES = 16_384;
const CLEAN_MEASUREMENT_START = "2026-08-14 21:22:00";
const encoder = new TextEncoder();

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...headers
    }
  });
}

function cleanText(value, max = 160) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, max);
}

function cleanPath(value) {
  const path = cleanText(value, 300);
  if (!path.startsWith("/") || path.startsWith("//")) return "/";
  return path.replace(/\/index\.html$/, "/") || "/";
}

function cleanInteger(value, min, max) {
  const number = Number.parseInt(value, 10);
  if (!Number.isFinite(number)) return null;
  return Math.min(max, Math.max(min, number));
}

export function normalizeEvent(input) {
  if (!input || input.v !== 1 || !EVENT_TYPES.has(input.type)) return null;
  const detail = input.detail && typeof input.detail === "object" ? input.detail : {};
  const campaign = input.campaign && typeof input.campaign === "object" ? input.campaign : {};
  const session = cleanText(input.session, 120);
  const visitor = cleanText(input.visitor, 120);
  if (!session || !visitor) return null;

  return {
    type: input.type,
    page: cleanPath(input.page),
    title: cleanText(input.title, 160),
    siteSection: cleanText(input.source, 80) || "site",
    referrer: cleanText(input.referrer, 160),
    session,
    visitor,
    campaignSource: cleanText(campaign.source, 100),
    campaignMedium: cleanText(campaign.medium, 100),
    campaignName: cleanText(campaign.campaign, 120),
    viewport: cleanText(input.viewport, 32),
    language: cleanText(input.language, 24),
    destination: cleanText(detail.destination, 300),
    label: cleanText(detail.label, 120),
    region: cleanText(detail.region, 40),
    conversionCategory: cleanText(detail.category, 40),
    conversionAction: cleanText(detail.action || detail.step, 80),
    depth: input.type === "Scroll Depth" ? cleanInteger(detail.depth, 0, 100) : null,
    seconds: ["Reading Time", "Engaged Visit"].includes(input.type)
      ? cleanInteger(detail.seconds, 0, 86_400)
      : null
  };
}

async function digest(secret, value) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const bytes = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function allowedOrigin(request, env) {
  const origin = request.headers.get("origin") || "";
  const allowed = String(env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  return allowed.includes(origin) ? origin : "";
}

export function isAutomatedRequest(request) {
  const userAgent = request.headers.get("user-agent") || "";
  const purpose = `${request.headers.get("purpose") || ""} ${request.headers.get("sec-purpose") || ""}`;
  return /bot|crawler|spider|headless|playwright|puppeteer|lighthouse|pagespeed|googlebot|bingbot|slurp|facebookexternalhit|twitterbot|linkedinbot/i.test(userAgent)
    || /prefetch|prerender/i.test(purpose);
}

function corsHeaders(origin) {
  return origin
    ? {
        "access-control-allow-origin": origin,
        "access-control-allow-methods": "POST, OPTIONS",
        "access-control-allow-headers": "content-type",
        "access-control-max-age": "86400",
        vary: "Origin"
      }
    : {};
}

async function ingest(request, env) {
  const origin = allowedOrigin(request, env);
  if (!origin) return json({ error: "origin_not_allowed" }, 403);
  if (isAutomatedRequest(request)) {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }
  const length = Number(request.headers.get("content-length") || 0);
  if (length > MAX_BODY_BYTES) return json({ error: "payload_too_large" }, 413, corsHeaders(origin));

  let input;
  try {
    input = await request.json();
  } catch (_) {
    return json({ error: "invalid_json" }, 400, corsHeaders(origin));
  }
  const event = normalizeEvent(input);
  if (!event) return json({ error: "invalid_event" }, 422, corsHeaders(origin));

  const [sessionHash, visitorHash] = await Promise.all([
    digest(env.HASH_SECRET, `session:${event.session}`),
    digest(env.HASH_SECRET, `visitor:${event.visitor}`)
  ]);

  await env.DB.prepare(`
    INSERT INTO events (
      event_type, page, title, site_section, referrer, session_hash, visitor_hash,
      campaign_source, campaign_medium, campaign_name, viewport, language,
      destination, label, region, conversion_category, conversion_action, depth, seconds
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    event.type,
    event.page,
    event.title,
    event.siteSection,
    event.referrer,
    sessionHash,
    visitorHash,
    event.campaignSource,
    event.campaignMedium,
    event.campaignName,
    event.viewport,
    event.language,
    event.destination,
    event.label,
    event.region,
    event.conversionCategory,
    event.conversionAction,
    event.depth,
    event.seconds
  ).run();

  return json({ accepted: true }, 202, corsHeaders(origin));
}

function timingSafeEqual(left, right) {
  const a = encoder.encode(String(left || ""));
  const b = encoder.encode(String(right || ""));
  const length = Math.max(a.length, b.length);
  let difference = a.length ^ b.length;
  for (let index = 0; index < length; index += 1) {
    difference |= (a[index % (a.length || 1)] || 0) ^ (b[index % (b.length || 1)] || 0);
  }
  return difference === 0;
}

function authorized(request, env) {
  const header = request.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  return Boolean(env.ADMIN_TOKEN) && timingSafeEqual(token, env.ADMIN_TOKEN);
}

function sqlTimestamp(date) {
  return `${date.toISOString().slice(0, 10)} 00:00:00`;
}

export function rangeSelection(url) {
  const requestedValue = url.searchParams.get("days") || "clean";
  if (requestedValue === "clean") {
    const cleanStart = new Date("2026-08-14T21:22:00Z");
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    return {
      mode: "clean",
      days: Math.max(1, Math.floor((today - cleanStart) / 86_400_000) + 1),
      since: CLEAN_MEASUREMENT_START
    };
  }

  const requestedDays = Number.parseInt(requestedValue, 10);
  const days = [7, 30, 90, 365].includes(requestedDays) ? requestedDays : 30;
  const since = new Date();
  since.setUTCHours(0, 0, 0, 0);
  since.setUTCDate(since.getUTCDate() - (days - 1));
  return { mode: "range", days, since: sqlTimestamp(since) };
}

async function dashboardData(request, env) {
  if (!authorized(request, env)) return json({ error: "unauthorized" }, 401);
  const range = rangeSelection(new URL(request.url));
  const days = range.days;
  const since = range.since;
  const statements = [
    env.DB.prepare(`
      SELECT
        COUNT(DISTINCT visitor_hash) AS unique_visitors,
        COUNT(DISTINCT session_hash) AS visits,
        COUNT(DISTINCT CASE WHEN event_type = 'Engaged Visit' THEN session_hash END) AS engaged_visits,
        COALESCE(SUM(CASE WHEN event_type = 'Conversion' THEN 1 ELSE 0 END), 0) AS conversion_actions
      FROM events WHERE received_at >= ?
    `).bind(since),
    env.DB.prepare(`
      WITH RECURSIVE dates(day) AS (
        SELECT date(?)
        UNION ALL SELECT date(day, '+1 day') FROM dates WHERE day < date('now')
      ), daily AS (
        SELECT date(received_at) AS day,
          COUNT(DISTINCT session_hash) AS visits,
          COUNT(DISTINCT visitor_hash) AS visitors
        FROM events WHERE received_at >= ? GROUP BY date(received_at)
      )
      SELECT dates.day, COALESCE(daily.visits, 0) AS visits,
        COALESCE(daily.visitors, 0) AS visitors
      FROM dates LEFT JOIN daily USING(day) ORDER BY dates.day
    `).bind(since, since),
    env.DB.prepare(`
      WITH ranked AS (
        SELECT page, session_hash,
          ROW_NUMBER() OVER (PARTITION BY session_hash ORDER BY received_at, id) AS position
        FROM events WHERE event_type = 'Pageview' AND received_at >= ?
      )
      SELECT page, COUNT(*) AS visits FROM ranked WHERE position = 1
      GROUP BY page ORDER BY visits DESC, page LIMIT 8
    `).bind(since),
    env.DB.prepare(`
      WITH ranked AS (
        SELECT session_hash,
          CASE
            WHEN campaign_source != '' THEN campaign_source || CASE WHEN campaign_name != '' THEN ' / ' || campaign_name ELSE '' END
            WHEN referrer != '' THEN referrer ELSE 'Direct'
          END AS source,
          ROW_NUMBER() OVER (PARTITION BY session_hash ORDER BY received_at, id) AS position
        FROM events WHERE event_type = 'Pageview' AND received_at >= ?
      )
      SELECT source, COUNT(*) AS visits FROM ranked WHERE position = 1
      GROUP BY source ORDER BY visits DESC, source LIMIT 8
    `).bind(since),
    env.DB.prepare(`
      SELECT conversion_category AS category, COUNT(*) AS actions
      FROM events WHERE event_type = 'Conversion' AND received_at >= ?
      GROUP BY conversion_category ORDER BY actions DESC
    `).bind(since),
    env.DB.prepare(`
      SELECT depth, COUNT(DISTINCT session_hash) AS visits
      FROM events WHERE event_type = 'Scroll Depth' AND received_at >= ?
      GROUP BY depth ORDER BY depth
    `).bind(since),
    env.DB.prepare(`
      SELECT COUNT(*) AS returning_visitors FROM (
        SELECT visitor_hash FROM events WHERE received_at >= ?
        GROUP BY visitor_hash HAVING COUNT(DISTINCT session_hash) > 1
      )
    `).bind(since),
    env.DB.prepare(`
      SELECT conversion_action AS step, COUNT(DISTINCT session_hash) AS actions
      FROM events
      WHERE event_type IN ('Hiring Funnel View', 'Hiring Funnel Step')
        AND conversion_action != ''
        AND received_at >= ?
      GROUP BY conversion_action
    `).bind(since)
  ];

  const results = await env.DB.batch(statements);
  const rows = (index) => results[index].results || [];
  return json({
    range_days: days,
    range_mode: range.mode,
    generated_at: new Date().toISOString(),
    retention_days: Number(env.RETENTION_DAYS || 400),
    integrity: {
      collection_started: "2026-08-09",
      clean_measurement_started: "2026-08-14",
      latest_private_backup: "2026-08-14",
      production_only: true,
      automated_traffic_rejected: true,
      historical_status: "Pre-exclusion data quality uncertain"
    },
    summary: rows(0)[0] || {},
    trend: rows(1),
    landing_pages: rows(2),
    sources: rows(3),
    conversions: rows(4),
    reading_completion: rows(5),
    returning_visitors: Number(rows(6)[0]?.returning_visitors || 0),
    hiring_funnel: rows(7)
  });
}

async function cleanup(env) {
  const retention = Math.min(730, Math.max(30, Number(env.RETENTION_DAYS || 400)));
  await env.DB.prepare("DELETE FROM events WHERE received_at < datetime('now', ?)")
    .bind(`-${retention} days`)
    .run();
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS" && url.pathname === "/v1/event") {
      const origin = allowedOrigin(request, env);
      return new Response(null, { status: origin ? 204 : 403, headers: corsHeaders(origin) });
    }
    if (request.method === "POST" && url.pathname === "/v1/event") return ingest(request, env);
    if (request.method === "GET" && url.pathname === "/v1/dashboard") return dashboardData(request, env);
    if (request.method === "GET" && url.pathname === "/health") {
      return json({ ok: true, storage: "d1", retention_days: Number(env.RETENTION_DAYS || 400) });
    }
    return env.ASSETS.fetch(request);
  },

  async scheduled(_controller, env, ctx) {
    ctx.waitUntil(cleanup(env));
  }
};
