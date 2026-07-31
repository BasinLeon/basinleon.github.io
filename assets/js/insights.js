/**
 * Leon Basin site insights
 *
 * One event vocabulary for the public studio. Plausible receives aggregate
 * page and interaction events. An optional first-party edge collector can be
 * enabled with:
 *
 *   <meta name="lb-insights-endpoint" content="https://…/v1/event">
 *
 * The edge collector never stores a raw IP address.
 */
(function () {
  "use strict";

  if (window.__lbInsightsLoaded) return;
  window.__lbInsightsLoaded = true;

  const body = document.body;
  if (!body || body.dataset.lbAnalytics === "off") return;
  if (navigator.globalPrivacyControl === true || navigator.doNotTrack === "1") return;

  const endpoint = (
    document.querySelector('meta[name="lb-insights-endpoint"]')?.content ||
    window.LB_INSIGHTS_ENDPOINT ||
    ""
  ).trim();
  const source = body.dataset.lbSection || body.dataset.lbPage || "site";
  const page = cleanPath(location.href);
  const referrer = safeHost(document.referrer);
  const campaign = readCampaign();
  const sessionId = getSessionId();
  const sentDepths = new Set();
  let activeSeconds = 0;
  let lastTick = Date.now();
  let engagementSent = false;

  function cleanPath(value) {
    try {
      const url = new URL(value, location.href);
      return url.pathname.replace(/\/index\.html$/, "/") || "/";
    } catch (_) {
      return "/";
    }
  }

  function safeHost(value) {
    if (!value) return "";
    try {
      return new URL(value, location.href).hostname.replace(/^www\./, "");
    } catch (_) {
      return "";
    }
  }

  function cleanLabel(value) {
    return String(value || "").replace(/\s+/g, " ").trim().slice(0, 120);
  }

  function readCampaign() {
    const params = new URLSearchParams(location.search);
    return {
      source: cleanLabel(params.get("utm_source")),
      medium: cleanLabel(params.get("utm_medium")),
      campaign: cleanLabel(params.get("utm_campaign"))
    };
  }

  function getSessionId() {
    const key = "lb:insights:session:v1";
    try {
      let value = sessionStorage.getItem(key);
      if (!value) {
        value = crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
        sessionStorage.setItem(key, value);
      }
      return value;
    } catch (_) {
      return "";
    }
  }

  function ensurePlausible() {
    window.plausible = window.plausible || function () {
      (window.plausible.q = window.plausible.q || []).push(arguments);
    };

    if (document.querySelector('script[data-domain="basinleon.github.io"]')) return;
    const script = document.createElement("script");
    script.defer = true;
    script.dataset.domain = "basinleon.github.io";
    script.src = "https://plausible.io/js/script.js";
    document.head.appendChild(script);
  }

  function plausibleEvent(name, props) {
    if (typeof window.plausible !== "function") return;
    window.plausible(name, { props });
  }

  function sendEdge(type, detail, useBeacon) {
    if (!endpoint) return;

    const payload = JSON.stringify({
      v: 1,
      type,
      page,
      title: document.title.slice(0, 160),
      source,
      referrer,
      session: sessionId,
      campaign,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      language: navigator.language || "",
      detail: detail || {}
    });

    if (useBeacon && navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, new Blob([payload], { type: "application/json" }));
      return;
    }

    fetch(endpoint, {
      method: "POST",
      mode: "cors",
      keepalive: true,
      headers: { "content-type": "application/json" },
      body: payload
    }).catch(function () {
      // Analytics must never interrupt the reading experience.
    });
  }

  function record(type, detail, options) {
    const data = detail || {};
    const props = {
      page,
      source,
      referrer: referrer || "direct",
      ...data
    };
    plausibleEvent(type, props);
    sendEdge(type, data, options && options.beacon);
  }

  function classifyLink(link) {
    const raw = link.getAttribute("href") || "";
    if (raw.startsWith("mailto:")) return { type: "Email Click", destination: "email" };
    if (raw.startsWith("tel:")) return { type: "Phone Click", destination: "phone" };

    let url;
    try {
      url = new URL(link.href, location.href);
    } catch (_) {
      return { type: "Link Click", destination: "invalid" };
    }

    if (link.hasAttribute("download") || /\.(pdf|docx?|xlsx?|csv|zip)$/i.test(url.pathname)) {
      return { type: "Download", destination: cleanPath(url.href) };
    }
    if (url.origin !== location.origin) {
      return { type: "Outbound Click", destination: safeHost(url.href) };
    }
    return { type: "Internal Click", destination: cleanPath(url.href) };
  }

  function clickDetail(link) {
    const classification = classifyLink(link);
    const region = link.closest("header, nav, main, article, section, footer");
    return {
      type: classification.type,
      detail: {
        destination: classification.destination,
        label: cleanLabel(link.dataset.track || link.getAttribute("aria-label") || link.textContent),
        region: region ? region.tagName.toLowerCase() : "body"
      }
    };
  }

  function updateActiveTime() {
    const now = Date.now();
    const elapsed = Math.min(2, Math.max(0, (now - lastTick) / 1000));
    lastTick = now;
    if (!document.hidden) activeSeconds += elapsed;
    if (!engagementSent && activeSeconds >= 15) {
      engagementSent = true;
      record("Engaged Visit", { seconds: 15 });
    }
  }

  function trackDepth() {
    const available = document.documentElement.scrollHeight - window.innerHeight;
    if (available <= 0) return;
    const percent = Math.round((window.scrollY / available) * 100);
    [25, 50, 75, 100].forEach(function (depth) {
      if (percent < depth || sentDepths.has(depth)) return;
      sentDepths.add(depth);
      record("Scroll Depth", { depth });
    });
  }

  ensurePlausible();
  sendEdge("Pageview", {});

  document.addEventListener("click", function (event) {
    const link = event.target.closest("a[href]");
    if (!link) return;
    const item = clickDetail(link);
    record(item.type, item.detail, { beacon: true });
  }, { capture: true });

  let scrollQueued = false;
  window.addEventListener("scroll", function () {
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(function () {
      trackDepth();
      scrollQueued = false;
    });
  }, { passive: true });

  window.setInterval(updateActiveTime, 1000);
  document.addEventListener("visibilitychange", function () {
    updateActiveTime();
    lastTick = Date.now();
  });
  window.addEventListener("pagehide", function () {
    updateActiveTime();
    record("Reading Time", { seconds: Math.round(activeSeconds) }, { beacon: true });
  });
}());
