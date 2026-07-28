(() => {
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

  const path = location.pathname.replace(/\/index\.html$/, "/");
  document.querySelectorAll("header a[href], nav a[href]").forEach((link) => {
    const target = new URL(link.href, location.href);
    if (target.origin !== location.origin) return;
    const targetPath = target.pathname.replace(/\/index\.html$/, "/");
    const matchesPath = targetPath === path || (targetPath !== "/" && path.startsWith(targetPath));
    const matchesHash = !target.hash || target.hash === location.hash;
    if (matchesPath && matchesHash) {
      link.setAttribute("aria-current", "page");
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

  const flowTargets = [...document.querySelectorAll("main > section")].filter((section, index) => {
    if (index === 0) return false;
    return !section.classList.contains("reveal") && !section.closest("[data-lb-flow-off]");
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
    }, { threshold: 0.08, rootMargin: "0px 0px -8% 0px" });
    flowTargets.forEach((section) => observer.observe(section));
  } else {
    flowTargets.forEach((section) => section.classList.add("lb-flow-visible"));
  }

  document.addEventListener("click", (event) => {
    if (reducedMotion || event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest("a[href]");
    if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
    const destination = new URL(link.href, location.href);
    if (destination.origin !== location.origin) return;
    if (destination.protocol !== "http:" && destination.protocol !== "https:") return;
    if (destination.pathname === location.pathname && destination.search === location.search) return;
    event.preventDefault();
    route.dataset.destination = (link.textContent || "Continue").replace(/\s+/g, " ").trim().slice(0, 42);
    root.classList.add("lb-route-leaving");
    window.setTimeout(() => { location.href = destination.href; }, 240);
  });

  window.addEventListener("pageshow", () => root.classList.remove("lb-route-leaving"));
})();
