(() => {
  if (!window.__lbInsightsLoaded && !document.querySelector('script[src^="/assets/js/insights.js"]')) {
    const insights = document.createElement("script");
    insights.src = "/assets/js/insights.js?v=20261118-unified";
    insights.defer = true;
    document.head.appendChild(insights);
  }

  const root = document.documentElement;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  root.classList.add("lb-continuity");

  const progress = document.createElement("div");
  progress.className = "lb-continuity-progress";
  progress.setAttribute("aria-hidden", "true");

  const route = document.createElement("div");
  route.className = "lb-continuity-route";
  route.setAttribute("aria-hidden", "true");
  route.dataset.destination = document.title.split("|")[0].trim() || "Leon Basin";

  document.body.prepend(route);
  document.body.prepend(progress);

  const supportsScrollTimeline = !reducedMotion && typeof CSS !== "undefined" && CSS.supports && CSS.supports("animation-timeline", "scroll()");
  if (!supportsScrollTimeline) {
    let scheduled = false;
    const updateProgress = () => {
      const available = document.documentElement.scrollHeight - window.innerHeight;
      const value = available > 0 ? Math.min(1, Math.max(0, window.scrollY / available)) : 0;
      root.style.setProperty("--lb-scroll-progress", value.toFixed(4));
      scheduled = false;
    };

    window.addEventListener("scroll", () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(updateProgress);
    }, { passive: true });
    window.addEventListener("resize", updateProgress, { passive: true });
    updateProgress();
  }

  const path = location.pathname.replace(/\/index\.html$/, "/") || "/";
  document.querySelectorAll("nav").forEach((nav) => {
    let bestLink = null;
    let bestScore = -1;
    nav.querySelectorAll("a[href]").forEach((link) => {
      let target;
      try {
        target = new URL(link.href, location.href);
      } catch (_) {
        return;
      }
      if (target.origin !== location.origin) return;
      const targetPath = target.pathname.replace(/\/index\.html$/, "/") || "/";
      const matchesHash = !target.hash || target.hash === location.hash;
      if (!matchesHash) return;
      let score = -1;
      if (targetPath === path && !target.hash) {
        score = targetPath.length + 1000;
      } else if (targetPath === path && target.hash === location.hash) {
        score = targetPath.length + 1500;
      } else if (targetPath !== "/") {
        const prefix = targetPath.endsWith("/") ? targetPath : `${targetPath}/`;
        if (path.startsWith(prefix)) score = prefix.length;
      }
      if (score > bestScore) {
        bestScore = score;
        bestLink = link;
      }
    });
    if (bestLink) {
      nav.querySelectorAll('a[aria-current="page"]').forEach((el) => {
        if (el !== bestLink) el.removeAttribute("aria-current");
      });
      bestLink.setAttribute("aria-current", "page");
    }
  });

  /*
   * The studio clock is a deliberately private, local-first instrument.
   * Nothing here is transmitted. The counters describe this browser only.
   *
   * First unlock: visit any page with #after-hours.
   * Later: Option + Shift + L, or press and hold the site wordmark.
   */
  const clockUnlockKey = "lb:studio-clock:unlocked:v1";
  const clockMetricsKey = "lb:studio-clock:metrics:v1";
  const clockSessionKey = "lb:studio-clock:session:v1";
  const clockPagesKey = "lb:studio-clock:pages:v1";
  const clockActiveKey = "lb:studio-clock:active:v1";
  const clockRequested = location.hash === "#after-hours";
  let clockUnlocked = false;

  try {
    clockUnlocked = clockRequested || localStorage.getItem(clockUnlockKey) === "yes";
    if (clockRequested) {
      localStorage.setItem(clockUnlockKey, "yes");
      history.replaceState(null, "", `${location.pathname}${location.search}`);
    }
  } catch (_) {
    clockUnlocked = clockRequested;
  }

  if (clockUnlocked) {
    const now = Date.now();
    let metrics = {
      firstSeen: now,
      lastSeen: now,
      previousVisit: 0,
      visits: 0,
      totalSeconds: 0
    };
    let hadSavedMetrics = false;

    try {
      const saved = JSON.parse(localStorage.getItem(clockMetricsKey) || "null");
      if (saved && typeof saved === "object") {
        metrics = { ...metrics, ...saved };
        hadSavedMetrics = true;
      }

      if (!sessionStorage.getItem(clockSessionKey)) {
        metrics.previousVisit = hadSavedMetrics ? Number(metrics.lastSeen) || 0 : 0;
        metrics.visits = Math.max(0, Number(metrics.visits) || 0) + 1;
        sessionStorage.setItem(clockSessionKey, String(now));
        sessionStorage.setItem(clockActiveKey, "0");
        sessionStorage.setItem(clockPagesKey, "[]");
      }

      const pages = JSON.parse(sessionStorage.getItem(clockPagesKey) || "[]");
      if (Array.isArray(pages) && !pages.includes(path)) {
        pages.push(path);
        sessionStorage.setItem(clockPagesKey, JSON.stringify(pages));
      }

      metrics.lastSeen = now;
      localStorage.setItem(clockMetricsKey, JSON.stringify(metrics));
    } catch (_) {
      // Storage may be disabled. The clock still works for the current page.
    }

    const clock = document.createElement("aside");
    clock.className = "lb-studio-clock";
    clock.setAttribute("aria-label", "Private studio clock");
    clock.setAttribute("aria-hidden", "true");
    clock.innerHTML = `
      <div class="lb-studio-clock__topline">
        <span>After hours / local instrument</span>
        <button type="button" class="lb-studio-clock__close" aria-label="Close studio clock">Close</button>
      </div>
      <time class="lb-studio-clock__time" datetime=""></time>
      <div class="lb-studio-clock__date"></div>
      <dl class="lb-studio-clock__ledger">
        <div><dt>Visit</dt><dd data-clock="visits">01</dd></div>
        <div><dt>This sitting</dt><dd data-clock="session">00:00</dd></div>
        <div><dt>Across sittings</dt><dd data-clock="total">00:00</dd></div>
        <div><dt>Pages crossed</dt><dd data-clock="pages">01</dd></div>
        <div><dt>Last here</dt><dd data-clock="returned">First visit</dd></div>
      </dl>
      <p class="lb-studio-clock__privacy">This browser only. No identity, location, or activity leaves the device.</p>
    `;
    document.body.append(clock);

    const timeNode = clock.querySelector(".lb-studio-clock__time");
    const dateNode = clock.querySelector(".lb-studio-clock__date");
    const visitsNode = clock.querySelector('[data-clock="visits"]');
    const sessionNode = clock.querySelector('[data-clock="session"]');
    const totalNode = clock.querySelector('[data-clock="total"]');
    const pagesNode = clock.querySelector('[data-clock="pages"]');
    const returnedNode = clock.querySelector('[data-clock="returned"]');
    const closeClock = clock.querySelector(".lb-studio-clock__close");
    let lastActiveTick = Date.now();
    let unsavedActiveSeconds = 0;
    let focusBeforeClock = null;

    const formatDuration = (seconds) => {
      const value = Math.max(0, Math.floor(Number(seconds) || 0));
      const hours = Math.floor(value / 3600);
      const minutes = Math.floor((value % 3600) / 60);
      const remainder = value % 60;
      return hours > 0
        ? `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`
        : `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
    };

    const formatReturn = (timestamp) => {
      if (!timestamp) return "First visit";
      const seconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
      if (seconds < 60) return "Just now";
      if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
      if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
      return `${Math.floor(seconds / 86400)}d ago`;
    };

    const readSessionValue = (key, fallback = 0) => {
      try {
        return Number(sessionStorage.getItem(key)) || fallback;
      } catch (_) {
        return fallback;
      }
    };

    const readPages = () => {
      try {
        const pages = JSON.parse(sessionStorage.getItem(clockPagesKey) || "[]");
        return Array.isArray(pages) ? pages.length : 1;
      } catch (_) {
        return 1;
      }
    };

    const saveActiveTime = () => {
      if (unsavedActiveSeconds < 1) return;
      const seconds = Math.floor(unsavedActiveSeconds);
      unsavedActiveSeconds -= seconds;
      metrics.totalSeconds = Math.max(0, Number(metrics.totalSeconds) || 0) + seconds;
      const sessionSeconds = readSessionValue(clockActiveKey) + seconds;
      metrics.lastSeen = Date.now();
      try {
        sessionStorage.setItem(clockActiveKey, String(sessionSeconds));
        localStorage.setItem(clockMetricsKey, JSON.stringify(metrics));
      } catch (_) {}
    };

    const updateClock = () => {
      const current = new Date();
      const elapsed = Math.max(0, (current.getTime() - lastActiveTick) / 1000);
      lastActiveTick = current.getTime();
      if (!document.hidden) unsavedActiveSeconds += Math.min(elapsed, 2);

      timeNode.textContent = new Intl.DateTimeFormat(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }).format(current);
      timeNode.dateTime = current.toISOString();
      dateNode.textContent = new Intl.DateTimeFormat(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
      }).format(current);
      visitsNode.textContent = String(Math.max(1, Number(metrics.visits) || 1)).padStart(2, "0");
      sessionNode.textContent = formatDuration(readSessionValue(clockActiveKey) + unsavedActiveSeconds);
      totalNode.textContent = formatDuration((Number(metrics.totalSeconds) || 0) + unsavedActiveSeconds);
      pagesNode.textContent = String(Math.max(1, readPages())).padStart(2, "0");
      returnedNode.textContent = formatReturn(Number(metrics.previousVisit) || 0);
    };

    const setClockOpen = (open) => {
      if (open) focusBeforeClock = document.activeElement;
      clock.classList.toggle("is-open", open);
      clock.setAttribute("aria-hidden", String(!open));
      if (open) {
        closeClock.focus({ preventScroll: true });
      } else if (focusBeforeClock && typeof focusBeforeClock.focus === "function") {
        focusBeforeClock.focus({ preventScroll: true });
      } else {
        closeClock.blur();
      }
    };

    closeClock.addEventListener("click", () => setClockOpen(false));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && clock.classList.contains("is-open")) {
        setClockOpen(false);
        return;
      }
      if (event.altKey && event.shiftKey && event.key.toLowerCase() === "l") {
        event.preventDefault();
        setClockOpen(!clock.classList.contains("is-open"));
      }
    });

    const wordmark = document.querySelector(
      '.brand, .site-brand, .wordmark, .nav-brand, header a[href="/"], footer'
    );
    if (wordmark) {
      let holdTimer = 0;
      const cancelHold = () => window.clearTimeout(holdTimer);
      wordmark.addEventListener("pointerdown", () => {
        holdTimer = window.setTimeout(() => {
          setClockOpen(true);
          if (navigator.vibrate) navigator.vibrate(18);
        }, 1200);
      });
      ["pointerup", "pointercancel", "pointerleave"].forEach((name) => {
        wordmark.addEventListener(name, cancelHold);
      });
    }

    window.setInterval(() => {
      updateClock();
      if (unsavedActiveSeconds >= 15) saveActiveTime();
    }, 1000);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) saveActiveTime();
      lastActiveTick = Date.now();
    });
    window.addEventListener("pagehide", saveActiveTime);
    updateClock();
    if (clockRequested) setClockOpen(true);
  }

  const flowTargets = [...document.querySelectorAll("main > section")].filter((section) => {
    if (section.classList.contains("reveal") || section.closest("[data-lb-flow-off]")) return false;
    if (section.offsetParent === null) return false;
    const rect = section.getBoundingClientRect();
    return rect.top > window.innerHeight * 0.92;
  });
  flowTargets.forEach((section) => section.setAttribute("data-lb-flow", ""));

  if (!reducedMotion && "IntersectionObserver" in window && flowTargets.length) {
    root.classList.add("lb-flow-ready");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("lb-flow-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.05, rootMargin: "0px 0px -4% 0px" });
    flowTargets.forEach((section) => observer.observe(section));
  } else {
    flowTargets.forEach((section) => section.classList.add("lb-flow-visible"));
  }

  if (HTMLScriptElement.supports && HTMLScriptElement.supports("speculationrules") && !document.querySelector('script[type="speculationrules"]')) {
    const spec = document.createElement("script");
    spec.type = "speculationrules";
    spec.textContent = JSON.stringify({
      prefetch: [{
        source: "document",
        where: {
          and: [
            { href_matches: "/*" },
            { not: { href_matches: "/assets/downloads/*" } },
            { not: { href_matches: "/assets/video/*" } },
            { not: { selector_matches: "[download], [target=_blank]" } }
          ]
        },
        eagerness: "moderate"
      }]
    });
    document.head.appendChild(spec);
  }

  const prefetched = new Set();
  const prefetchLink = (event) => {
    const link = event.target.closest?.("a[href]");
    if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
    let destination;
    try {
      destination = new URL(link.href, location.href);
    } catch (_) {
      return;
    }
    if (destination.origin !== location.origin) return;
    if (destination.pathname === location.pathname && destination.search === location.search) return;
    if (/\.(pdf|zip|mp4|mov|xml|txt|json)$/i.test(destination.pathname)) return;
    const key = destination.pathname + destination.search;
    if (prefetched.has(key)) return;
    prefetched.add(key);
    const hint = document.createElement("link");
    hint.rel = "prefetch";
    hint.href = key;
    hint.as = "document";
    document.head.appendChild(hint);
  };
  document.addEventListener("pointerenter", prefetchLink, { capture: true, passive: true });
  document.addEventListener("touchstart", prefetchLink, { capture: true, passive: true });

  const supportsCrossDocViewTransition = "onpagereveal" in window;
  document.addEventListener("click", (event) => {
    if (reducedMotion || event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest("a[href]");
    if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
    let destination;
    try {
      destination = new URL(link.href, location.href);
    } catch (_) {
      return;
    }
    if (destination.origin !== location.origin) return;
    if (destination.protocol !== "http:" && destination.protocol !== "https:") return;
    if (destination.pathname === location.pathname && destination.search === location.search) return;
    if (/\.(pdf|zip|mp4|mov|xml|txt|json)$/i.test(destination.pathname)) return;
    if (supportsCrossDocViewTransition) {
      if (destination.pathname.startsWith("/blog/posts/")) {
        const heading = link.querySelector("h2, h3, strong") || link;
        document.querySelectorAll('[style*="active-post-title"]').forEach((el) => { el.style.viewTransitionName = ""; });
        heading.style.viewTransitionName = "active-post-title";
      }
      return;
    }
    // Browsers without cross-document transitions navigate immediately.
  });

  window.addEventListener("pageshow", () => {
    root.classList.remove("lb-route-leaving");
    document.querySelectorAll('[style*="active-post-title"]').forEach((el) => { el.style.viewTransitionName = ""; });
  });

  /* Site-wide Cmd+K / Ctrl+K Studio Command Palette (native modal <dialog>) */
  if ("HTMLDialogElement" in window && !document.getElementById("lb-cmdk-dialog")) {
    const STUDIO_ROUTES = [
      { title: "Home — Leon Basin Studio", url: "/", type: "Room", meta: "Founding GTM operator & revenue systems architect" },
      { title: "The Writing Library", url: "/blog/", type: "Room", meta: "Complete archive of GTM essays, field notes & fiction" },
      { title: "The Tool Bench", url: "/tools/", type: "Room", meta: "Runnable GTM instruments, calculators & simulators" },
      { title: "Signal Architect (Live Scorer)", url: "/signal-architect/", type: "Tool", meta: "Run deterministic P0–P3 account priority logic in-browser" },
      { title: "GTM Motion Diagnostic", url: "/diagnostic.html", type: "Tool", meta: "4-pillar scorecard to isolate the real GTM constraint" },
      { title: "Revenue Architecture Simulator", url: "/revenue_architecture_simulator.html", type: "Tool", meta: "Model pipeline, cycle velocity & signal lift vs. cold outbound" },
      { title: "GTM Architecture Live", url: "/gtm-architecture-live/index-v2.html", type: "Tool", meta: "Market entry decision simulator (manual vs. signal)" },
      { title: "Hazel AI Prep", url: "/hazel-demo/", type: "Tool", meta: "Positioning & signal vocabulary workbench for commercial roles" },
      { title: "NEXUS::CRM Command Center", url: "/crm.html", type: "Tool", meta: "Local-first signal & pipeline command center prototype" },
      { title: "Case Studies & Operating Record", url: "/case-studies/", type: "Proof", meta: "Measured outcomes across enterprise & public-sector GTM" },
      { title: "Basin::Nexus System Portfolio", url: "/basin-nexus/", type: "System", meta: "Signal-to-action revenue architecture portfolio" },
      { title: "GTM Systems", url: "/gtm-systems/", type: "System", meta: "How signal routing, enablement & CRM governance connect" },
      { title: "Operator Q&A (Answer Index)", url: "/answers/", type: "Guide", meta: "Direct answers on revenue architecture, P0 scoring & SDR ramp" },
      { title: "Sam & Ink — Continuous Room", url: "/blog/fiction/sam-and-ink/", type: "Fiction", meta: "Literary series of fragments, readings & companion video" },
      { title: "Fiction Room", url: "/blog/fiction/", type: "Fiction", meta: "Stories from Silicon Valley about what machines cannot replace" },
      { title: "The Basin Blueprint", url: "/blueprint/", type: "Philosophy", meta: "Observe, Build, Sell, Market, Operate, Steward" },
      { title: "Working Session ($500 · 90 min)", url: "/working-session/", type: "Work", meta: "Fixed-fee working session on one live revenue constraint" },
      { title: "Services ($50 Diagnostic / $150 Setup)", url: "/services/", type: "Work", meta: "Hands-on remote setup for creators & small businesses" },
      { title: "Work With Me / Contact", url: "/work-with-me/", type: "Work", meta: "Current offers, fit criteria & private contact form" },
      { title: "Executive Résumé", url: "/resume.html", type: "Proof", meta: "Interactive operating record & role-by-role evidence" },
      { title: "The Working Library", url: "/library/", type: "Room", meta: "Complete public catalog of models, proof & field notes" }
    ];

    let cmdkItems = STUDIO_ROUTES.slice();
    let indexLoaded = false;
    let activeIdx = 0;

    const dialog = document.createElement("dialog");
    dialog.id = "lb-cmdk-dialog";
    dialog.className = "lb-cmdk";
    dialog.setAttribute("closedby", "any");
    dialog.setAttribute("aria-labelledby", "lb-cmdk-title");
    dialog.innerHTML =
      '<div class="lb-cmdk__head">' +
        '<h2 id="lb-cmdk-title" class="lb-cmdk__label">Jump to any room, tool, or essay</h2>' +
        '<label for="lb-cmdk-input" class="lb-cmdk__label">Search studio rooms, tools, and essays</label>' +
        '<input id="lb-cmdk-input" class="lb-cmdk__input" type="search" autocomplete="off" spellcheck="false" placeholder="Jump to any room, tool, or essay…">' +
        '<form method="dialog"><button class="lb-cmdk__close" value="close" aria-label="Close quick jump">Esc</button></form>' +
      '</div>' +
      '<ul class="lb-cmdk__list" id="lb-cmdk-list" role="listbox" aria-label="Search results"></ul>' +
      '<div class="lb-cmdk__foot"><span>↑↓ Move · Enter Open</span><span id="lb-cmdk-count">21 routes</span></div>';
    document.body.appendChild(dialog);

    const input = dialog.querySelector("#lb-cmdk-input");
    const list = dialog.querySelector("#lb-cmdk-list");
    const countNode = dialog.querySelector("#lb-cmdk-count");

    if (!("closedBy" in HTMLDialogElement.prototype)) {
      const outside = (e) => {
        const r = dialog.getBoundingClientRect();
        return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
      };
      let downOut = false;
      dialog.addEventListener("pointerdown", (e) => { downOut = outside(e); });
      dialog.addEventListener("pointerup", (e) => { if (downOut && outside(e)) dialog.close(); });
    }

    const escapeHtml = (s) => String(s || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

    const loadReadingIndex = () => {
      if (indexLoaded) return;
      indexLoaded = true;
      const promise = window.__lbReadingIndexPromise || (window.__lbReadingIndexPromise = fetch("/blog/reading-index.json").then((r) => (r.ok ? r.json() : [])));
      promise.then((rows) => {
        if (!Array.isArray(rows)) return;
        const existing = new Set(cmdkItems.map((x) => x.url));
        rows.forEach((row) => {
          if (!row || !row.url || existing.has(row.url)) return;
          existing.add(row.url);
          const tags = Array.isArray(row.tags) ? row.tags.slice(0, 3).join(" · ") : "";
          const mins = row.minutes ? `${row.minutes} min read` : "";
          cmdkItems.push({
            title: row.title || row.url,
            url: row.url,
            type: (row.tags || []).some((t) => /fiction|sam & ink|fragment/i.test(t)) ? "Fiction" : "Essay",
            meta: [row.date, mins, tags].filter(Boolean).join(" · ")
          });
        });
        if (dialog.open) renderResults(input.value);
      }).catch(() => {});
    };

    const renderResults = (query) => {
      const tokens = String(query || "").toLowerCase().trim().split(/\s+/).filter(Boolean);
      const matches = tokens.length
        ? cmdkItems.filter((item) => {
            const hay = `${item.title} ${item.meta} ${item.type} ${item.url}`.toLowerCase();
            return tokens.every((t) => hay.includes(t));
          }).slice(0, 18)
        : cmdkItems.slice(0, 12);

      activeIdx = 0;
      countNode.textContent = `${matches.length} ${matches.length === 1 ? "match" : "matches"} · ${cmdkItems.length} indexed`;
      if (!matches.length) {
        list.innerHTML = `<li class="lb-cmdk__empty">No matches for "${escapeHtml(query)}". Try searching the <a href="/blog/?q=${encodeURIComponent(query)}" style="color:var(--lb-continuity-accent-bright)">Writing Library →</a></li>`;
        return;
      }
      list.innerHTML = matches.map((item, i) => (
        `<li class="lb-cmdk__item" role="option"><a href="${escapeHtml(item.url)}" aria-selected="${i === 0 ? "true" : "false"}">` +
          `<strong>${escapeHtml(item.title)}</strong>` +
          `<small>${escapeHtml(item.meta)}</small>` +
          `<span class="lb-cmdk__badge">${escapeHtml(item.type)}</span>` +
        `</a></li>`
      )).join("");
    };

    const updateSelection = (nextIdx) => {
      const links = [...list.querySelectorAll(".lb-cmdk__item a")];
      if (!links.length) return;
      activeIdx = (nextIdx + links.length) % links.length;
      links.forEach((a, i) => {
        a.setAttribute("aria-selected", String(i === activeIdx));
        if (i === activeIdx) a.scrollIntoView({ block: "nearest" });
      });
    };

    const openPalette = () => {
      loadReadingIndex();
      input.value = "";
      renderResults("");
      if (!dialog.open) dialog.showModal();
      input.focus();
    };

    input.addEventListener("input", () => renderResults(input.value));
    input.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        updateSelection(activeIdx + 1);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        updateSelection(activeIdx - 1);
      } else if (event.key === "Enter") {
        event.preventDefault();
        if (event.isComposing || event.keyCode === 229) return;
        const selected = list.querySelector('.lb-cmdk__item a[aria-selected="true"]') || list.querySelector(".lb-cmdk__item a");
        if (selected) {
          dialog.close();
          location.href = selected.getAttribute("href");
        }
      }
    });

    document.addEventListener("keydown", (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (dialog.open) dialog.close();
        else openPalette();
      }
    });

    const footerNav = document.querySelector(".lb-footer-nav");
    if (footerNav && !footerNav.querySelector(".lb-cmdk-trigger")) {
      const trigger = document.createElement("button");
      trigger.type = "button";
      trigger.className = "lb-cmdk-trigger";
      trigger.setAttribute("aria-label", "Open quick jump search (Command K)");
      trigger.textContent = "Search ⌘K";
      trigger.addEventListener("click", openPalette);
      footerNav.appendChild(trigger);
    }
  }
})();
