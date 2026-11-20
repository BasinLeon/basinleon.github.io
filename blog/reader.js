/* Basin::Nexus reading layer — unified save-for-later, quick archive bar, Substack subscribe.
   Self-contained. Syncs with saved-shelf.js (basin-saved-reading-v1) and defers progress bar to continuity.js. */
(function () {
  if (window.__lbReaderLoaded) return;
  window.__lbReaderLoaded = true;

  var SUBSTACK = "https://basinandassociates.substack.com";
  var SHELF_KEY = "basin-saved-reading-v1";
  var LEGACY_KEY = "lb_saved";
  var isPost = /\/blog\/posts\//.test(location.pathname);

  function readShelf() {
    var items = [];
    try { items = JSON.parse(localStorage.getItem(SHELF_KEY) || "[]"); } catch (_) { items = []; }
    if (!Array.isArray(items)) items = [];
    try {
      var legacy = JSON.parse(localStorage.getItem(LEGACY_KEY) || "[]");
      if (Array.isArray(legacy) && legacy.length) {
        var seen = new Set(items.map(function (x) { return x && x.url; }));
        var changed = false;
        legacy.forEach(function (x) {
          if (x && typeof x.url === "string" && /^\/blog\/posts\/[a-z0-9-]+\.html$/.test(x.url) && !seen.has(x.url)) {
            items.push({ title: String(x.title || x.slug || "Saved entry"), url: x.url });
            seen.add(x.url);
            changed = true;
          }
        });
        if (changed) localStorage.setItem(SHELF_KEY, JSON.stringify(items.slice(0, 100)));
      }
    } catch (_) {}
    return items.filter(function (x) { return x && typeof x.url === "string" && /^\/blog\/posts\/[a-z0-9-]+\.html$/.test(x.url); }).slice(0, 100);
  }

  function writeShelf(items) {
    try {
      localStorage.setItem(SHELF_KEY, JSON.stringify(items.slice(0, 100)));
      document.dispatchEvent(new CustomEvent("lb-saved-shelf-changed", { detail: { saved: items } }));
    } catch (_) {}
  }

  var css = "\
  :root{--lb-gold:#D4AF37;--lb-gold-soft:rgba(212,175,55,.14);}\
  .lb-progress{position:fixed;top:0;left:0;height:3px;width:0;z-index:9999;\
    background:linear-gradient(90deg,#B8860B,#FFD700);transition:width .1s linear;}\
  .lb-fab{position:fixed;right:16px;bottom:max(16px,env(safe-area-inset-bottom));z-index:9998;display:flex;gap:8px;\
    flex-wrap:wrap;justify-content:flex-end;max-width:calc(100vw - 32px);}\
  .lb-fab .lb-btn{font-family:'JetBrains Mono',ui-monospace,monospace;font-size:.72rem;\
    letter-spacing:.08em;text-transform:uppercase;padding:.6rem .8rem;border-radius:999px;min-height:40px;\
    display:inline-flex;align-items:center;\
    border:1px solid rgba(212,175,55,.45);background:rgba(8,6,3,.86);color:#f0e6d3;\
    text-decoration:none;cursor:pointer;backdrop-filter:blur(6px);transition:.18s;line-height:1;}\
  .lb-fab .lb-btn:hover{background:var(--lb-gold-soft);border-color:var(--lb-gold);}\
  .lb-fab .lb-sub{background:var(--lb-gold);color:#0d0803;border-color:var(--lb-gold);font-weight:700;}\
  .lb-fab .lb-save.on{background:var(--lb-gold-soft);color:var(--lb-gold);}\
  .lb-endcta{margin:3.5rem auto 1rem;max-width:720px;padding:1.6rem 1.5rem;border-radius:16px;\
    border:1px solid rgba(212,175,55,.35);background:linear-gradient(180deg,rgba(212,175,55,.08),rgba(255,255,255,.02));\
    text-align:center;font-family:'JetBrains Mono',ui-monospace,monospace;}\
  .lb-endcta h3{font-family:'DM Sans',system-ui,sans-serif;color:#f0e6d3;margin:0 0 .5rem;font-size:1.1rem;letter-spacing:.02em;}\
  .lb-endcta p{color:#b7ad97;margin:0 0 1.1rem;font-size:.95rem;line-height:1.6;}\
  .lb-endcta-actions{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;}\
  .lb-share-actions{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:.8rem;}\
  .lb-share-actions .lb-btn{border-color:rgba(212,175,55,.45);background:transparent;color:#f0e6d3;}\
  .lb-endcta .lb-btn{font-size:.78rem;letter-spacing:.06em;text-transform:uppercase;padding:.7rem 1.1rem;\
    border-radius:999px;text-decoration:none;cursor:pointer;border:1px solid var(--lb-gold);}\
  .lb-endcta .lb-sub{background:var(--lb-gold);color:#0d0803;font-weight:700;}\
  .lb-endcta .lb-save2{background:transparent;color:#f0e6d3;}\
  .lb-endcta.lb-light{border-color:rgba(183,131,31,.42);\
    background:linear-gradient(180deg,rgba(255,255,255,.46),rgba(183,131,31,.055));}\
  .lb-endcta.lb-light h3{color:#171510;}\
  .lb-endcta.lb-light p{color:#625c50;}\
  .lb-endcta.lb-light .lb-save2{color:#171510;border-color:#b7831f;}\
  .lb-endcta.lb-light .lb-save2:hover{background:rgba(183,131,31,.1);}\
  .lb-endcta.lb-light .lb-share-actions .lb-btn{color:#171510;border-color:rgba(183,131,31,.55);}\
  .lb-related{margin:1.2rem auto 3.5rem;max-width:720px;border-top:1px solid rgba(212,175,55,.28);}\
  .lb-related a{display:grid;grid-template-columns:1fr auto;gap:1rem;padding:1rem 0;border-bottom:1px solid rgba(212,175,55,.2);color:inherit;text-decoration:none;}\
  .lb-related strong{font-family:'DM Sans',system-ui,sans-serif;font-size:.95rem;}\
  .lb-related span{color:#8b8573;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:.68rem;text-transform:uppercase;letter-spacing:.06em;}\
  .lb-saved-wrap{font-family:'JetBrains Mono',ui-monospace,monospace;}\
  .lb-saved-item{display:flex;justify-content:space-between;gap:12px;align-items:center;\
    padding:.6rem 0;border-bottom:1px solid rgba(212,175,55,.15);}\
  .lb-saved-item a{color:#f0e6d3;text-decoration:none;font-size:.9rem;}\
  .lb-saved-item a:hover{color:var(--lb-gold);}\
  .lb-saved-item button{background:none;border:0;color:#8b8573;cursor:pointer;font-size:1rem;}\
  .lb-saved-empty{color:#8b8573;font-size:.9rem;}\
  @media print{.lb-fab,.lb-progress{display:none!important;}}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  if (isPost) {
    var currentUrl = location.pathname;
    var h1 = document.querySelector("h1");
    var title = (h1 ? h1.textContent : document.title).replace(/\s*\|\s*Leon Basin.*$/, "").trim();

    var hasContinuity = Boolean(document.querySelector('.lb-continuity-progress, script[src*="continuity.js"]'));
    if (!hasContinuity) {
      var prog = document.createElement("div"); prog.className = "lb-progress"; prog.setAttribute("aria-hidden", "true"); document.body.appendChild(prog);
      window.addEventListener("scroll", function () {
        var d = document.documentElement, top = d.scrollTop || document.body.scrollTop;
        var h = d.scrollHeight - d.clientHeight; prog.style.width = (h > 0 ? (top / h) * 100 : 0) + "%";
      }, { passive: true });
    }

    var fab = document.createElement("div"); fab.className = "lb-fab";
    fab.innerHTML =
      '<a class="lb-btn" href="/blog/">← Archive</a>' +
      '<button class="lb-btn lb-save" type="button" aria-pressed="false">☆ Save</button>' +
      '<a class="lb-btn lb-sub" href="' + SUBSTACK + '/subscribe" target="_blank" rel="noopener noreferrer">Subscribe</a>';
    document.body.appendChild(fab);

    var saveBtn = fab.querySelector(".lb-save");
    var save2 = null;

    function isSaved() {
      return readShelf().some(function (x) { return x.url === currentUrl; });
    }
    function paint() {
      var on = isSaved();
      saveBtn.classList.toggle("on", on);
      saveBtn.setAttribute("aria-pressed", String(on));
      saveBtn.textContent = on ? "★ Saved" : "☆ Save";
      if (save2) {
        save2.setAttribute("aria-pressed", String(on));
        save2.textContent = on ? "★ Saved" : "☆ Save this piece";
      }
    }
    function toggle() {
      var a = readShelf();
      var i = a.findIndex(function (x) { return x.url === currentUrl; });
      if (i >= 0) a.splice(i, 1);
      else a.unshift({ title: title, url: currentUrl });
      writeShelf(a);
      paint();
    }
    saveBtn.addEventListener("click", toggle);
    document.addEventListener("lb-saved-shelf-changed", paint);
    window.addEventListener("storage", function (ev) { if (ev.key === SHELF_KEY) paint(); });
    paint();

    // Only inject legacy end CTA / related block on standalone posts lacking modern post chrome.
    var hasModernEndings = Boolean(document.querySelector(".lb-reading-next, .read-next, .hub-follow, [data-hiring-note], .hub-post-share, script[src*='hub-share.js']"));
    if (!hasModernEndings) {
      var art = document.querySelector("article") || document.querySelector("main") || document.body;
      var cta = document.createElement("div"); cta.className = "lb-endcta";
      var bodyColor = window.getComputedStyle(document.body).backgroundColor.match(/\d+(?:\.\d+)?/g);
      if (bodyColor && bodyColor.length >= 3) {
        var luminance = (Number(bodyColor[0]) * 299 + Number(bodyColor[1]) * 587 + Number(bodyColor[2]) * 114) / 1000;
        if (luminance > 150) cta.classList.add("lb-light");
      }
      var shareUrl = new URL(location.pathname, location.origin);
      shareUrl.searchParams.set("utm_source", "reader-share");
      shareUrl.searchParams.set("utm_medium", "referral");
      shareUrl.searchParams.set("utm_campaign", "article-share");
      var linkedinUrl = "https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent(shareUrl.toString());
      var emailUrl = "mailto:?subject=" + encodeURIComponent(title) + "&body=" + encodeURIComponent("I thought you might appreciate this:\n\n" + shareUrl.toString());
      cta.innerHTML =
        "<h3>Keep the signal coming.</h3>" +
        "<p>New field notes by email when they land. Save this one to come back to it.</p>" +
        '<div class="lb-endcta-actions">' +
        '<a class="lb-btn lb-sub" href="' + SUBSTACK + '/subscribe" target="_blank" rel="noopener noreferrer">Subscribe by email</a>' +
        '<button class="lb-btn lb-save2" type="button"></button></div>' +
        '<div class="lb-share-actions">' +
        '<a class="lb-btn" data-track="Article: share on LinkedIn" href="' + linkedinUrl + '" target="_blank" rel="noopener noreferrer">Share on LinkedIn</a>' +
        '<a class="lb-btn" data-track="Article: share by email" href="' + emailUrl + '">Email this</a>' +
        '<button class="lb-btn lb-copy-link" type="button">Copy link</button></div>';
      art.appendChild(cta);
      save2 = cta.querySelector(".lb-save2");
      save2.addEventListener("click", toggle);
      paint();
      var copyLink = cta.querySelector(".lb-copy-link");
      copyLink.addEventListener("click", async function () {
        try { await navigator.clipboard.writeText(shareUrl.toString()); }
        catch (_) {
          copyLink.textContent = "Copy unavailable: use your address bar";
          return;
        }
        copyLink.textContent = "Copied";
        window.setTimeout(function () { copyLink.textContent = "Copy link"; }, 1600);
        if (window.lbInsightsRecord) window.lbInsightsRecord("Conversion", { category: "Reader interest", action: "copy-article-link", destination: location.pathname, label: title, region: "article" });
      });
    }
  }

  var mount = document.getElementById("lb-saved-mount");
  if (mount) {
    function render() {
      var a = readShelf();
      if (!a.length) { mount.innerHTML = '<p class="lb-saved-empty">Nothing saved yet. Tap Save on any piece and it waits for you here, on this device.</p>'; return; }
      var w = document.createElement("div"); w.className = "lb-saved-wrap";
      a.forEach(function (x) {
        var row = document.createElement("div"); row.className = "lb-saved-item";
        var link = document.createElement("a"); link.href = x.url; link.textContent = x.title || x.url;
        row.appendChild(link);
        var b = document.createElement("button"); b.type = "button"; b.title = "Remove"; b.textContent = "✕";
        b.addEventListener("click", function () { writeShelf(readShelf().filter(function (y) { return y.url !== x.url; })); render(); });
        row.appendChild(b); w.appendChild(row);
      });
      mount.innerHTML = ""; mount.appendChild(w);
    }
    render();
  }
})();
