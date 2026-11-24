/* Flow::Nexus reading layer — unified save-for-later, quick archive bar, Substack subscribe.
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
  :root{--lb-gold:#d9ab45;--lb-gold-soft:rgba(217,171,69,.14);--lb-bronze:#805d27;}\
  .lb-progress{position:fixed;top:0;left:0;height:2px;width:0;z-index:9999;\
    background:var(--lb-gold);transition:width .1s linear;}\
  .lb-fab{position:fixed;right:16px;bottom:max(16px,env(safe-area-inset-bottom));z-index:9998;display:flex;gap:8px;\
    flex-wrap:wrap;justify-content:flex-end;max-width:calc(100vw - 32px);}\
  .lb-fab .lb-btn{font-family:'JetBrains Mono',ui-monospace,monospace;font-size:.72rem;\
    letter-spacing:.08em;text-transform:uppercase;padding:.6rem .85rem;border-radius:2px;min-height:40px;\
    display:inline-flex;align-items:center;\
    border:1px solid #403a30;background:rgba(17,16,14,.94);color:#eee9de!important;\
    text-decoration:none;cursor:pointer;backdrop-filter:blur(8px);transition:.18s;line-height:1;}\
  .lb-fab .lb-btn:hover{background:#181613;border-color:var(--lb-gold);color:#d9ab45!important;}\
  .lb-fab .lb-sub{background:var(--lb-gold)!important;color:#11100e!important;border-color:var(--lb-gold)!important;font-weight:700;}\
  .lb-fab .lb-sub:hover{background:#e4be63!important;color:#11100e!important;}\
  .lb-fab .lb-save.on{background:#181613;color:var(--lb-gold)!important;border-color:var(--lb-gold);}\
  .lb-endcta{margin:3.25rem auto 1.25rem;max-width:720px;padding:1.75rem 1.75rem;border-radius:0;\
    border:1px solid #403a30;border-left:3px solid var(--lb-gold);background:#181613;\
    text-align:left;font-family:'Manrope',-apple-system,sans-serif;}\
  .lb-endcta h3{font-family:'Instrument Serif',Georgia,serif;font-weight:400;color:#eee9de;margin:0 0 .45rem;font-size:1.65rem;line-height:1.15;}\
  .lb-endcta p{color:#bcb3a2;margin:0 0 1.15rem;font-size:.96rem;line-height:1.6;}\
  .lb-endcta-actions{display:flex;gap:10px;justify-content:flex-start;flex-wrap:wrap;}\
  .lb-share-actions{display:flex;gap:8px;justify-content:flex-start;flex-wrap:wrap;margin-top:.9rem;padding-top:.9rem;border-top:1px solid #403a30;}\
  .lb-share-actions .lb-btn{border-color:#403a30;background:transparent;color:#bcb3a2;}\
  .lb-endcta .lb-btn{font-family:'JetBrains Mono',ui-monospace,monospace;font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;padding:.7rem 1.1rem;\
    border-radius:0;text-decoration:none;cursor:pointer;border:1px solid var(--lb-gold);display:inline-flex;align-items:center;min-height:42px;}\
  .lb-endcta .lb-sub{background:var(--lb-gold);color:#11100e;font-weight:700;}\
  .lb-endcta .lb-save2{background:transparent;color:#eee9de;}\
  .lb-endcta.lb-light{border-color:#ccc4b5;border-left:3px solid var(--lb-bronze);background:#eeebe3;}\
  .lb-endcta.lb-light h3{color:#29251e;}\
  .lb-endcta.lb-light p{color:#6b6256;}\
  .lb-endcta.lb-light .lb-sub{background:var(--lb-bronze);border-color:var(--lb-bronze);color:#f4f1ea;}\
  .lb-endcta.lb-light .lb-save2{color:#29251e;border-color:#ccc4b5;}\
  .lb-endcta.lb-light .lb-save2:hover{border-color:var(--lb-bronze);color:var(--lb-bronze);}\
  .lb-endcta.lb-light .lb-share-actions{border-top-color:#ccc4b5;}\
  .lb-endcta.lb-light .lb-share-actions .lb-btn{color:#6b6256;border-color:#ccc4b5;}\
  .lb-related{margin:1.25rem auto 3.5rem;max-width:720px;border-top:2px solid var(--lb-gold);}\
  .lb-related a{display:grid;grid-template-columns:1fr auto;gap:1rem;padding:1.05rem 0;border-bottom:1px solid #403a30;color:inherit;text-decoration:none;align-items:baseline;}\
  .lb-related a:hover strong{color:var(--lb-gold);}\
  .lb-related strong{font-family:'Instrument Serif',Georgia,serif;font-weight:400;font-size:1.3rem;line-height:1.2;}\
  .lb-related span{color:#bcb3a2;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:.68rem;text-transform:uppercase;letter-spacing:.08em;}\
  .lb-saved-wrap{font-family:'JetBrains Mono',ui-monospace,monospace;}\
  .lb-saved-item{display:flex;justify-content:space-between;gap:12px;align-items:center;\
    padding:.6rem 0;border-bottom:1px solid #403a30;}\
  .lb-saved-item a{color:#eee9de;text-decoration:none;font-size:.9rem;}\
  .lb-saved-item a:hover{color:var(--lb-gold);}\
  .lb-saved-item button{background:none;border:0;color:#bcb3a2;cursor:pointer;font-size:1rem;}\
  .lb-saved-empty{color:#bcb3a2;font-size:.9rem;}\
  .lb-read-meta{margin:.55rem 0 1.4rem;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:.72rem;\
    letter-spacing:.08em;text-transform:uppercase;color:#bcb3a2;}\
  .lb-read-meta.lb-light{color:#6b6256;}\
  .lb-toc{margin:1.4rem 0 2rem;padding:.95rem 1.15rem;border:1px solid #403a30;border-left:2px solid var(--lb-gold);border-radius:0;\
    background:#181613;font-family:'Manrope',-apple-system,sans-serif;}\
  .lb-toc summary{cursor:pointer;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:.72rem;\
    letter-spacing:.12em;text-transform:uppercase;color:var(--lb-gold);min-height:36px;display:flex;align-items:center;}\
  .lb-toc ol{margin:.65rem 0 .2rem;padding-left:1.25rem;display:grid;gap:.35rem;}\
  .lb-toc a{color:inherit;text-decoration:none;font-size:.92rem;line-height:1.45;}\
  .lb-toc a:hover,.lb-toc a:focus-visible{color:var(--lb-gold);text-decoration:underline;}\
  .lb-toc.lb-light{border-color:#ccc4b5;border-left-color:var(--lb-bronze);background:#eeebe3;color:#29251e;}\
  .lb-toc.lb-light summary{color:var(--lb-bronze);}\
  .lb-code-wrap{position:relative;}\
  .lb-code-copy{position:absolute;top:.55rem;right:.55rem;z-index:2;min-height:30px;padding:.25rem .6rem;\
    border:1px solid #403a30;border-radius:2px;background:rgba(17,16,14,.92);color:#eee9de;\
    font-family:'JetBrains Mono',ui-monospace,monospace;font-size:.66rem;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;}\
  .lb-code-copy:hover,.lb-code-copy:focus-visible{background:var(--lb-gold);color:#11100e;border-color:var(--lb-gold);}\
  body{padding-bottom:calc(76px + env(safe-area-inset-bottom));}\
  .lb-site-footer{color:#eee9de;}.lb-site-footer .lb-footer-nav a,.lb-site-footer .lb-footer-meta{color:#bcb3a2;}\
  @media print{.lb-fab,.lb-progress,.lb-code-copy{display:none!important;}}";
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

    var isLightSurface = false;
    var bgMatch = window.getComputedStyle(document.body).backgroundColor.match(/\d+(?:\.\d+)?/g);
    if (bgMatch && bgMatch.length >= 3) {
      isLightSurface = (Number(bgMatch[0]) * 299 + Number(bgMatch[1]) * 587 + Number(bgMatch[2]) * 114) / 1000 > 150;
    }

    // Reader Upgrade: reading-time badge, auto-TOC for long essays (3+ h2s), and code-block Copy buttons
    var contentRoot = document.querySelector("article") || document.querySelector(".post-content") || document.querySelector("main");
    if (contentRoot) {
      var isFragment = /\/fragment-\d+\.html$/i.test(currentUrl);
      var rawText = (contentRoot.textContent || "").replace(/\s+/g, " ").trim();
      var wordCount = rawText ? rawText.split(/\s+/).length : 0;
      if (!isFragment && wordCount >= 180 && h1 && !document.querySelector(".lb-read-meta, .hub-reading-time")) {
        var mins = Math.max(1, Math.round(wordCount / 225));
        var metaLine = document.createElement("p");
        metaLine.className = "lb-read-meta" + (isLightSurface ? " lb-light" : "");
        metaLine.textContent = mins + " min read · " + wordCount.toLocaleString() + " words";
        h1.insertAdjacentElement("afterend", metaLine);
      }

      var headings = Array.from(contentRoot.querySelectorAll("h2")).filter(function (el) {
        return !el.closest("aside, nav, footer, .lb-endcta, .read-next, .hub-follow, .hub-daily");
      });
      if (!isFragment && headings.length >= 3 && !document.querySelector(".lb-toc")) {
        var usedIds = new Set();
        var toc = document.createElement("details");
        toc.className = "lb-toc" + (isLightSurface ? " lb-light" : "");
        var summary = document.createElement("summary");
        summary.textContent = "In this essay (" + headings.length + " sections)";
        toc.appendChild(summary);
        var ol = document.createElement("ol");
        headings.forEach(function (heading, idx) {
          if (!heading.id) {
            var slug = (heading.textContent || "section-" + (idx + 1))
              .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || ("section-" + (idx + 1));
            var unique = slug;
            var n = 2;
            while (usedIds.has(unique) || document.getElementById(unique)) { unique = slug + "-" + (n++); }
            heading.id = unique;
          }
          usedIds.add(heading.id);
          var li = document.createElement("li");
          var a = document.createElement("a");
          a.href = "#" + heading.id;
          a.textContent = (heading.textContent || "").trim();
          li.appendChild(a);
          ol.appendChild(li);
        });
        toc.appendChild(ol);
        headings[0].parentNode.insertBefore(toc, headings[0]);
      }

      contentRoot.querySelectorAll("pre").forEach(function (pre) {
        if (pre.dataset.lbCopyBound) return;
        pre.dataset.lbCopyBound = "1";
        var wrapper = document.createElement("div");
        wrapper.className = "lb-code-wrap";
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "lb-code-copy";
        btn.textContent = "Copy";
        btn.setAttribute("aria-label", "Copy code block");
        btn.addEventListener("click", function () {
          var codeText = (pre.querySelector("code") || pre).textContent || "";
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(codeText).then(function () {
              btn.textContent = "Copied";
              window.setTimeout(function () { btn.textContent = "Copy"; }, 1800);
            }).catch(function () {
              btn.textContent = "Select text";
              window.setTimeout(function () { btn.textContent = "Copy"; }, 1800);
            });
          }
        });
        wrapper.appendChild(btn);
      });
    }

    // Only inject legacy end CTA / related block on standalone posts lacking modern post chrome.
    var hasModernEndings = Boolean(document.querySelector(".lb-reading-next, .read-next, .hub-follow, [data-hiring-note], .hub-post-share, script[src*='hub-share.js']"));
    if (!hasModernEndings) {
      var art = document.querySelector("article") || document.querySelector("main") || document.body;
      var cta = document.createElement("div"); cta.className = "lb-endcta";
      if (isLightSurface) cta.classList.add("lb-light");
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
