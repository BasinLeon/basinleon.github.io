/**
 * Leon Basin site insights
 *
 * One event vocabulary for the public studio. Events are sent only from the
 * production site to the private first-party edge collector. The endpoint can
 * be overridden with:
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
  if (!body) return;
  const productionOrigin = "https://basinleon.github.io";
  const ownerStorageKey = "lb:insights:owner-optout:v1";
  const ownerCookie = "lb_owner_optout";
  const ownerMode = readOwnerMode();
  if (location.origin !== productionOrigin) return;
  if (ownerMode) {
    applyOwnerMode(ownerMode);
    return;
  }
  if (body.dataset.lbAnalytics === "off" || isOwnerExcluded()) return;
  if (isAutomatedClient()) return;
  if (navigator.globalPrivacyControl === true || navigator.doNotTrack === "1") return;

  const endpoint = (
    document.querySelector('meta[name="lb-insights-endpoint"]')?.content ||
    window.LB_INSIGHTS_ENDPOINT ||
    "https://basin-site-insights.basin-site-insights.workers.dev/v1/event"
  ).trim();
  const source = body.dataset.lbSection || body.dataset.lbPage || "site";
  const page = cleanPath(location.href);
  const referrer = safeHost(document.referrer);
  const campaign = readCampaign();
  const sessionId = getSessionId();
  const visitorId = getVisitorId();
  const sentDepths = new Set();
  let activeSeconds = 0;
  let lastTick = Date.now();
  let engagementSent = false;

  function readOwnerMode() {
    const value = new URLSearchParams(location.search).get("lb_owner");
    if (value === "1") return "exclude";
    if (value === "0") return "include";
    return "";
  }

  function isOwnerExcluded() {
    if (document.cookie.split(";").some(function (item) {
      return item.trim() === `${ownerCookie}=1`;
    })) return true;
    try {
      return localStorage.getItem(ownerStorageKey) === "1";
    } catch (_) {
      return false;
    }
  }

  function isAutomatedClient() {
    if (navigator.webdriver === true) return true;
    return /bot|crawler|spider|headless|playwright|puppeteer|lighthouse|pagespeed/i.test(navigator.userAgent || "");
  }

  function applyOwnerMode(mode) {
    try {
      if (mode === "exclude") {
        localStorage.setItem(ownerStorageKey, "1");
      } else {
        localStorage.removeItem(ownerStorageKey);
      }
    } catch (_) {
      // The confirmation still explains the requested state if storage is unavailable.
    }
    document.cookie = mode === "exclude"
      ? `${ownerCookie}=1; Max-Age=34560000; Path=/; SameSite=Lax; Secure`
      : `${ownerCookie}=; Max-Age=0; Path=/; SameSite=Lax; Secure`;

    const url = new URL(location.href);
    url.searchParams.delete("lb_owner");
    history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);

    const notice = document.createElement("div");
    notice.setAttribute("role", "status");
    notice.dataset.lbOwnerStatus = mode;
    notice.textContent = mode === "exclude"
      ? "Owner analytics disabled on this browser."
      : "Owner analytics enabled on this browser.";
    Object.assign(notice.style, {
      position: "fixed",
      right: "16px",
      bottom: "16px",
      zIndex: "10000",
      maxWidth: "min(360px, calc(100vw - 32px))",
      padding: "14px 16px",
      border: "1px solid #c58a08",
      background: "#090909",
      color: "#fff",
      font: "700 12px/1.45 'JetBrains Mono', ui-monospace, monospace",
      boxShadow: "0 14px 40px rgba(0,0,0,.2)"
    });
    body.appendChild(notice);
    try {
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage({
          type: "lb-owner-status",
          excluded: mode === "exclude"
        }, "https://basin-site-insights.basin-site-insights.workers.dev");
        window.setTimeout(function () { window.close(); }, 900);
      }
    } catch (_) {
      // Owner exclusion is complete even if the dashboard handshake is unavailable.
    }
    window.setTimeout(function () { notice.remove(); }, 5000);
  }

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

  function getVisitorId() {
    const key = "lb:insights:visitor:v1";
    const createdKey = "lb:insights:visitor-created:v1";
    const maxAge = 400 * 24 * 60 * 60 * 1000;
    try {
      let value = localStorage.getItem(key);
      let created = Number(localStorage.getItem(createdKey) || 0);
      if (value && !created) {
        created = Date.now();
        localStorage.setItem(createdKey, String(created));
      }
      if (!value || Date.now() - created > maxAge) {
        value = crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
        localStorage.setItem(key, value);
        localStorage.setItem(createdKey, String(Date.now()));
      }
      return value;
    } catch (_) {
      return sessionId;
    }
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
      visitor: visitorId,
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
    if (url.hostname === "mail.google.com" && url.searchParams.get("to") === "lbasin23@gmail.com") {
      return { type: "Email Click", destination: "gmail" };
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

  function conversionDetail(link, click) {
    const path = click.detail.destination || "";
    const label = click.detail.label.toLowerCase();
    let category = "";
    let action = "";

    if (["Email Click", "Phone Click"].includes(click.type)) {
      category = "Commercial intent";
      action = click.type === "Email Click" ? "email" : "phone";
    } else if (/resume|case-stud|availability|work-with-me|gmail|email app/.test(`${path} ${label}`)) {
      category = "Commercial intent";
      action = "commercial-proof";
    } else if (/basin-nexus|nexus|system|tools?/.test(`${path} ${label}`)) {
      category = "Operating interest";
      action = "system";
    } else if (/blog|writing|fiction|archive|essay|dispatch|substack|subscribe/.test(`${path} ${label}`)) {
      category = "Reader interest";
      action = "read";
    }

    if (!category) return null;
    return {
      category,
      action,
      destination: path,
      label: click.detail.label,
      region: click.detail.region
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

  sendEdge("Pageview", {});

  const funnelStep = body.dataset.lbFunnelStep;
  if (funnelStep) record("Hiring Funnel View", { step: funnelStep });

  document.addEventListener("click", function (event) {
    const link = event.target.closest("a[href]");
    if (!link) {
      const copyButton = event.target.closest("button[data-copy-email], button[data-email]");
      if (!copyButton) return;
      const label = cleanLabel(copyButton.dataset.track || copyButton.textContent || "Copy email");
      record("Conversion", { category: "Commercial intent", action: "copy-email", destination: "email", label, region: "section" }, { beacon: true });
      record("Hiring Funnel Step", { step: "email", destination: "email", label }, { beacon: true });
      return;
    }
    const item = clickDetail(link);
    record(item.type, item.detail, { beacon: true });
    const conversion = conversionDetail(link, item);
    if (conversion) record("Conversion", conversion, { beacon: true });
    if (link.dataset.hiringStep) {
      record("Hiring Funnel Step", {
        step: link.dataset.hiringStep,
        destination: item.detail.destination,
        label: item.detail.label
      }, { beacon: true });
    } else if (item.type === "Email Click") {
      record("Hiring Funnel Step", {
        step: "email",
        destination: item.detail.destination,
        label: item.detail.label
      }, { beacon: true });
    }
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
