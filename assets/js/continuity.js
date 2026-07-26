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
