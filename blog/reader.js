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
  .lb-toc{margin:1rem 0 1.35rem;padding:.6rem 1rem;border:1px solid #403a30;border-left:2px solid var(--lb-gold);border-radius:0;\
    background:#181613;font-family:'Manrope',-apple-system,sans-serif;}\
  .lb-toc summary{cursor:pointer;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:.72rem;\
    letter-spacing:.12em;text-transform:uppercase;color:var(--lb-gold);min-height:32px;display:flex;align-items:center;}\
  .lb-toc ol{margin:.5rem 0 .1rem!important;padding-left:1.25rem!important;display:grid;gap:.25rem;}\
  .lb-toc li{margin:0!important;}\
  .lb-toc a{color:inherit;text-decoration:none;font-size:.9rem;line-height:1.4;min-height:auto!important;}\
  .lb-toc a:hover,.lb-toc a:focus-visible{color:var(--lb-gold);text-decoration:underline;}\
  .lb-toc.lb-light{border-color:#ccc4b5;border-left-color:var(--lb-bronze);background:#eeebe3;color:#29251e;}\
  .lb-toc.lb-light summary{color:var(--lb-bronze);}\
  .lb-code-wrap{position:relative;}\
  .lb-code-copy{position:absolute;top:.55rem;right:.55rem;z-index:2;min-height:30px;padding:.25rem .6rem;\
    border:1px solid #403a30;border-radius:2px;background:rgba(17,16,14,.92);color:#eee9de;\
    font-family:'JetBrains Mono',ui-monospace,monospace;font-size:.66rem;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;}\
  .lb-code-copy:hover,.lb-code-copy:focus-visible{background:var(--lb-gold);color:#11100e;border-color:var(--lb-gold);}\
  .lb-fiction-bridge{margin:2.75rem auto 1.5rem;max-width:720px;border:1px solid #403a30;border-top:2px solid var(--lb-gold);\
    background:#181613;display:grid;grid-template-columns:210px minmax(0,1fr);gap:1.25rem;align-items:center;\
    padding:1.25rem;font-family:'Manrope',-apple-system,sans-serif;text-align:left;}\
  .lb-fiction-bridge-media{display:block;overflow:hidden;border:1px solid #403a30;background:#11100e;}\
  .lb-fiction-bridge-media img{display:block;width:100%;height:auto;aspect-ratio:16/10;object-fit:cover;transition:transform .24s ease;}\
  .lb-fiction-bridge:hover .lb-fiction-bridge-media img{transform:scale(1.025);}\
  .lb-fiction-bridge-kicker{font-family:'JetBrains Mono',ui-monospace,monospace;font-size:.68rem;letter-spacing:.09em;\
    text-transform:uppercase;color:var(--lb-gold);margin:0 0 .35rem;}\
  .lb-fiction-bridge h3{font-family:'Instrument Serif',Georgia,serif;font-weight:400;font-size:1.55rem;line-height:1.15;\
    color:#eee9de;margin:0 0 .4rem;}\
  .lb-fiction-bridge h3 a{color:inherit;text-decoration:none;}\
  .lb-fiction-bridge h3 a:hover{color:var(--lb-gold);}\
  .lb-fiction-bridge p{color:#bcb3a2;font-size:.9rem;line-height:1.55;margin:0 0 .85rem;}\
  .lb-fiction-bridge-links{display:flex;flex-wrap:wrap;gap:.5rem 1.15rem;align-items:center;}\
  .lb-fiction-bridge-primary{font-family:'JetBrains Mono',ui-monospace,monospace;font-size:.7rem;letter-spacing:.08em;\
    text-transform:uppercase;color:#11100e!important;background:var(--lb-gold);padding:.5rem .85rem;text-decoration:none;font-weight:700;}\
  .lb-fiction-bridge-primary:hover{background:#e4be63;}\
  .lb-fiction-bridge-all{font-size:.82rem;color:#bcb3a2!important;text-decoration:underline;text-underline-offset:4px;}\
  .lb-fiction-bridge-all:hover{color:var(--lb-gold)!important;}\
  .lb-fiction-bridge.lb-light{background:#eeebe3;border-color:#ccc4b5;border-top-color:var(--lb-bronze);}\
  .lb-fiction-bridge.lb-light .lb-fiction-bridge-media{border-color:#ccc4b5;background:#f4f1ea;}\
  .lb-fiction-bridge.lb-light .lb-fiction-bridge-kicker{color:var(--lb-bronze);}\
  .lb-fiction-bridge.lb-light h3{color:#29251e;}\
  .lb-fiction-bridge.lb-light p{color:#6b6256;}\
  .lb-fiction-bridge.lb-light .lb-fiction-bridge-primary{background:var(--lb-bronze);color:#f4f1ea!important;}\
  .lb-fiction-bridge.lb-light .lb-fiction-bridge-all{color:#6b6256!important;}\
  @media(max-width:640px){.lb-fiction-bridge{grid-template-columns:1fr;}}\
  body{padding-bottom:calc(76px + env(safe-area-inset-bottom));}\
  .lb-site-footer{color:#eee9de;}.lb-site-footer .lb-footer-nav a,.lb-site-footer .lb-footer-meta{color:#bcb3a2;}\
  @media print{.lb-fab,.lb-progress,.lb-code-copy,.lb-fiction-bridge{display:none!important;}}";
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
      if (!isFragment && wordCount >= 900 && headings.length >= 3 && !document.querySelector(".lb-toc")) {
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

    // Context-aware Blog-to-Fiction Routing Engine + Reader-Signal Learning (all non-fiction essays AND Sam & Ink fragments)
    var isFictionStory = document.body.classList.contains("fiction-story-reader") ||
      /\/(sam-ink-|the-archivist-letter-004|echoes-divine|the-night-the-code-asked)/i.test(currentUrl);
    if (!isFictionStory && !document.querySelector(".lb-fiction-bridge")) {
      var isFragmentPage = /\/fragment-\d+\.html$/i.test(currentUrl);
      var corpus = (title + " " + (document.querySelector('meta[name="description"]')?.content || "")).toLowerCase();
      var route = {
        lane: isFragmentPage ? "fragment" : "human",
        kicker: isFragmentPage ? "Continue the story · Fiction Room · 2 min · Studio audio" : "After the essay · Fiction Room · 2 min · Studio audio",
        title: "The Vanishing Archive",
        excerpt: "Sam asks Ink for a cleaner draft. His daughter waits in the doorway with a book.",
        href: "/fiction/the-vanishing-archive/?utm_source=blog-bridge&utm_medium=owned&utm_campaign=blog-to-fiction&utm_content=" + (isFragmentPage ? "fragment-to-vanishing" : "human-to-vanishing"),
        img: "/assets/img/fiction/vanishing-archive-v1.jpg",
        alt: "A handwritten draft and a child's open book beside a laptop"
      };
      if (/\/fragment-15\.html$/i.test(currentUrl) || /\b(gtm|pipeline|revenue|arr|sdr|sales|saas|founder|operator|playbook|funnel|system|quarter|outbound|deal|crm|fed the machine)\b/.test(corpus)) {
        route = {
          lane: isFragmentPage ? "fragment-operator" : "operator",
          kicker: isFragmentPage ? "Read the full story · Fiction Room · 4 min · Studio audio" : "After the work · Fiction Room · 4 min · Studio audio",
          title: "The Typewriter",
          excerpt: "Mountain View, 1:17 a.m. \"I fed the machine all quarter. It got bigger. I got tired.\"",
          href: "/blog/posts/sam-ink-the-typewriter.html?utm_source=blog-bridge&utm_medium=owned&utm_campaign=blog-to-fiction&utm_content=" + (isFragmentPage ? "fragment-to-typewriter" : "operator-to-typewriter"),
          img: "/assets/img/fiction/the-typewriter-v1.jpg",
          alt: "A vintage black mechanical typewriter beside a half-closed laptop on a garage table"
        };
      } else if (/\/fragment-(14|17)\.html$/i.test(currentUrl) || /\b(signal|silence|ai|machine|noise|attention|quiet|focus|agent|workflow|brain|llm|outage|neutral)\b/.test(corpus)) {
        route = {
          lane: isFragmentPage ? "fragment-signal" : "signal",
          kicker: isFragmentPage ? "Step into the story · Fiction Room · 4 min · Studio audio" : "After the essay · Fiction Room · 4 min · Studio audio",
          title: "The Outage",
          excerpt: "The power fails across Castro Street. Ink disappears. Sam writes by lamplight and hears his own voice again.",
          href: "/blog/posts/sam-ink-the-outage.html?utm_source=blog-bridge&utm_medium=owned&utm_campaign=blog-to-fiction&utm_content=" + (isFragmentPage ? "fragment-to-outage" : "signal-to-outage"),
          img: "/assets/img/fiction/the-outage-v1.jpg",
          alt: "A brass camping lantern glowing beside a closed laptop and black typewriter during a blackout"
        };
      }

      var mountTarget = document.querySelector(".lb-endcta") || document.querySelector(".lb-reading-next, .read-next, .hub-follow") || document.querySelector("article") || document.querySelector("main");
      if (mountTarget) {
        var bridge = document.createElement("aside");
        bridge.className = "lb-fiction-bridge" + (isLightSurface ? " lb-light" : "");
        bridge.setAttribute("aria-label", "Continue to the Fiction Room");
        bridge.innerHTML =
          '<a class="lb-fiction-bridge-media" href="' + route.href + '" data-track="Blog-to-Fiction: bridge image - ' + route.title + '">' +
          '<img src="' + route.img + '" alt="' + route.alt + '" loading="lazy" decoding="async"></a>' +
          '<div>' +
          '<p class="lb-fiction-bridge-kicker">' + route.kicker + '</p>' +
          '<h3><a href="' + route.href + '" data-track="Blog-to-Fiction: bridge title - ' + route.title + '">' + route.title + '</a></h3>' +
          '<p>' + route.excerpt + '</p>' +
          '<div class="lb-fiction-bridge-links">' +
          '<a class="lb-fiction-bridge-primary" href="' + route.href + '" data-track="Blog-to-Fiction: bridge cta - ' + route.title + '">Read or listen →</a>' +
          '<a class="lb-fiction-bridge-all" href="/blog/fiction/?utm_source=blog-bridge&utm_medium=owned&utm_campaign=blog-to-fiction&utm_content=bridge-all" data-track="Blog-to-Fiction: bridge folio">All 8 illustrated stories</a>' +
          '</div></div>';

        if (mountTarget.matches("article, main")) mountTarget.appendChild(bridge);
        else mountTarget.parentNode.insertBefore(bridge, mountTarget);

        // Track genuine bridge impressions (reader scrolled to it) & clicks into first-party insights
        if ("IntersectionObserver" in window) {
          var seenBridge = false;
          var io = new IntersectionObserver(function (entries) {
            if (seenBridge) return;
            if (entries.some(function (e) { return e.isIntersecting; })) {
              seenBridge = true;
              io.disconnect();
              if (window.lbInsightsRecord) {
                window.lbInsightsRecord("Fiction Bridge Impression", {
                  lane: route.lane,
                  targetStory: route.title,
                  fromPost: currentUrl
                });
              }
            }
          }, { threshold: 0.35 });
          io.observe(bridge);
        }

        bridge.addEventListener("click", function (ev) {
          var a = ev.target.closest("a[href]");
          if (!a || !window.lbInsightsRecord) return;
          window.lbInsightsRecord("Conversion", {
            category: "Reader interest",
            action: "blog-to-fiction-route",
            destination: a.getAttribute("href"),
            label: route.lane + " -> " + route.title,
            region: "fiction-bridge"
          }, { beacon: true });
        });
      }
    }

    // Silent Reader-Signal Learning: passage copies + audio plays (helps learn what resonates without surveys)
    var lastCopySignal = 0;
    document.addEventListener("copy", function () {
      var sel = (window.getSelection ? String(window.getSelection()) : "").trim();
      if (sel.length < 25 || Date.now() - lastCopySignal < 4000) return;
      lastCopySignal = Date.now();
      if (window.lbInsightsRecord) {
        window.lbInsightsRecord("Reader Signal", {
          action: "quote-copied",
          chars: sel.length,
          post: currentUrl,
          title: title
        });
      }
    });
    document.addEventListener("play", function (ev) {
      if (ev.target && ev.target.tagName === "AUDIO" && window.lbInsightsRecord) {
        window.lbInsightsRecord("Reader Signal", {
          action: "studio-audio-play",
          post: currentUrl,
          title: title
        });
      }
    }, true);

    if (!window.__lbAudioReaderLoaded && !document.querySelector('script[src*="essay-audio-reader.js"]')) {
      if (!document.querySelector('link[href*="essay-audio-reader.css"]')) {
        var audioCss = document.createElement("link");
        audioCss.rel = "stylesheet";
        audioCss.href = "/assets/css/essay-audio-reader.css?v=3";
        document.head.appendChild(audioCss);
      }
      var audioJs = document.createElement("script");
      audioJs.src = "/assets/js/essay-audio-reader.js?v=4";
      audioJs.defer = true;
      document.body.appendChild(audioJs);
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
