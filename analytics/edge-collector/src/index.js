/**
 * Dataset: leon_site_events
 *
 * Blobs:
 *  1 event, 2 page, 3 destination, 4 label, 5 source
 *  6 referrer, 7 country, 8 region, 9 city, 10 device
 * 11 campaign source, 12 campaign medium, 13 campaign name
 * 14 session, 15 title, 16 language, 17 viewport
 *
 * Doubles:
 *  1 count, 2 reading seconds, 3 scroll depth
 *
 * Index:
 *  1 keyed visitor token. A raw IP is never stored.
 */

const VERSION = "2026-07-30";
const MAX_BODY_BYTES = 12_000;
const ALLOWED_ORIGINS = new Set([
  "https://basinleon.github.io",
  "http://127.0.0.1:4173",
  "http://localhost:4173"
]);

export default {
  async fetch(request, env) {
    const origin = request.headers.get("origin") || "";
    const headers = corsHeaders(origin);
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }
    if (url.pathname === "/health") {
      return json({ ok: true, version: VERSION }, 200, headers);
    }
    if (url.pathname !== "/v1/event" || request.method !== "POST") {
      return json({ error: "not_found" }, 404, headers);
    }
    if (!ALLOWED_ORIGINS.has(origin)) {
      return json({ error: "origin_not_allowed" }, 403, headers);
    }
    if (!env.VISITOR_HASH_KEY) {
      return json({ error: "collector_not_configured" }, 503, headers);
    }

    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > MAX_BODY_BYTES) {
      return json({ error: "payload_too_large" }, 413, headers);
    }

    let body;
    try {
      body = await request.json();
    } catch (_) {
      return json({ error: "invalid_json" }, 400, headers);
    }
    if (!body || body.v !== 1 || typeof body.type !== "string") {
      return json({ error: "invalid_event" }, 400, headers);
    }

    const ip = request.headers.get("cf-connecting-ip") || "";
    const userAgent = request.headers.get("user-agent") || "";
    const visitor = await hmac(env.VISITOR_HASH_KEY, `${ip}\n${userAgent}`);
    const cf = request.cf || {};
    const detail = body.detail && typeof body.detail === "object" ? body.detail : {};
    const campaign = body.campaign && typeof body.campaign === "object" ? body.campaign : {};

    env.ANALYTICS.writeDataPoint({
      blobs: [
        clean(body.type, 48),
        pathOnly(body.page),
        clean(detail.destination, 180),
        clean(detail.label, 120),
        clean(body.source, 48),
        clean(body.referrer, 120),
        clean(cf.country, 8),
        clean(cf.region, 80),
        clean(cf.city, 80),
        deviceType(userAgent),
        clean(campaign.source, 80),
        clean(campaign.medium, 80),
        clean(campaign.campaign, 120),
        clean(body.session, 80),
        clean(body.title, 160),
        clean(body.language, 24),
        clean(body.viewport, 32)
      ],
      doubles: [
        1,
        finite(detail.seconds, 0, 86_400),
        finite(detail.depth, 0, 100)
      ],
      indexes: [visitor]
    });

    return new Response(null, { status: 204, headers });
  }
};

function corsHeaders(origin) {
  const headers = new Headers({
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "content-type",
    "access-control-max-age": "86400",
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
    "referrer-policy": "no-referrer"
  });
  if (ALLOWED_ORIGINS.has(origin)) {
    headers.set("access-control-allow-origin", origin);
    headers.set("vary", "origin");
  }
  return headers;
}

function json(value, status, headers) {
  const next = new Headers(headers);
  next.set("content-type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(value), { status, headers: next });
}

function clean(value, max) {
  return String(value || "").replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max);
}

function pathOnly(value) {
  const text = clean(value, 240);
  return text.startsWith("/") && !text.includes("?") && !text.includes("#") ? text : "/";
}

function finite(value, min, max) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : 0;
}

function deviceType(userAgent) {
  if (/bot|crawler|spider|slurp/i.test(userAgent)) return "bot";
  if (/ipad|tablet/i.test(userAgent)) return "tablet";
  if (/mobile|iphone|android/i.test(userAgent)) return "mobile";
  return "desktop";
}

async function hmac(secret, input) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(input));
  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}
