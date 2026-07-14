/* Basin::Nexus reading layer — progress, save-for-later, Substack subscribe.
   Self-contained. Injected into every post + the archive index. */
(function () {
  var SUBSTACK = "https://basinandassociates.substack.com";
  var KEY = "lb_saved";
  var isPost = /\/blog\/posts\//.test(location.pathname);

  function saved() { try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { return []; } }
  function setSaved(a) { localStorage.setItem(KEY, JSON.stringify(a)); }

  var css = "\
  :root{--lb-gold:#D4AF37;--lb-gold-soft:rgba(212,175,55,.14);}\
  .lb-progress{position:fixed;top:0;left:0;height:3px;width:0;z-index:9999;\
    background:linear-gradient(90deg,#B8860B,#FFD700);transition:width .1s linear;}\
  .lb-fab{position:fixed;right:16px;bottom:16px;z-index:9998;display:flex;gap:8px;\
    flex-wrap:wrap;justify-content:flex-end;max-width:70vw;}\
  .lb-fab .lb-btn{font-family:'JetBrains Mono',ui-monospace,monospace;font-size:.72rem;\
    letter-spacing:.08em;text-transform:uppercase;padding:.6rem .8rem;border-radius:999px;\
    border:1px solid rgba(212,175,55,.45);background:rgba(8,6,3,.82);color:#f0e6d3;\
    text-decoration:none;cursor:pointer;backdrop-filter:blur(6px);transition:.18s;line-height:1;}\
  .lb-fab .lb-btn:hover{background:var(--lb-gold-soft);border-color:var(--lb-gold);}\
  .lb-fab .lb-sub{background:var(--lb-gold);color:#0d0803;border-color:var(--lb-gold);font-weight:700;}\
  .lb-fab .lb-save.on{background:var(--lb-gold-soft);color:var(--lb-gold);}\
  .lb-endcta{margin:3.5rem auto 1rem;max-width:720px;padding:1.6rem 1.5rem;border-radius:16px;\
    border:1px solid rgba(212,175,55,.35);background:linear-gradient(180deg,rgba(212,175,55,.08),rgba(255,255,255,.02));\
    text-align:center;font-family:'JetBrains Mono',ui-monospace,monospace;}\
  .lb-endcta h3{font-family:'Orbitron',sans-serif;color:#f0e6d3;margin:0 0 .5rem;font-size:1.1rem;letter-spacing:.04em;}\
  .lb-endcta p{color:#b7ad97;margin:0 0 1.1rem;font-size:.95rem;line-height:1.6;}\
  .lb-endcta-actions{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;}\
  .lb-endcta .lb-btn{font-size:.78rem;letter-spacing:.06em;text-transform:uppercase;padding:.7rem 1.1rem;\
    border-radius:999px;text-decoration:none;cursor:pointer;border:1px solid var(--lb-gold);}\
  .lb-endcta .lb-sub{background:var(--lb-gold);color:#0d0803;font-weight:700;}\
  .lb-endcta .lb-save2{background:transparent;color:#f0e6d3;}\
  .lb-saved-wrap{font-family:'JetBrains Mono',ui-monospace,monospace;}\
  .lb-saved-item{display:flex;justify-content:space-between;gap:12px;align-items:center;\
    padding:.6rem 0;border-bottom:1px solid rgba(212,175,55,.15);}\
  .lb-saved-item a{color:#f0e6d3;text-decoration:none;font-size:.9rem;}\
  .lb-saved-item a:hover{color:var(--lb-gold);}\
  .lb-saved-item button{background:none;border:0;color:#8b8573;cursor:pointer;font-size:1rem;}\
  .lb-saved-empty{color:#8b8573;font-size:.9rem;}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  if (isPost) {
    var slug = location.pathname.split("/").pop();
    var h1 = document.querySelector("h1");
    var title = (h1 ? h1.textContent : document.title).replace(/\s*\|\s*Leon Basin.*$/, "").trim();

    var prog = document.createElement("div"); prog.className = "lb-progress"; document.body.appendChild(prog);
    window.addEventListener("scroll", function () {
      var d = document.documentElement, top = d.scrollTop || document.body.scrollTop;
      var h = d.scrollHeight - d.clientHeight; prog.style.width = (h > 0 ? (top / h) * 100 : 0) + "%";
    }, { passive: true });

    var fab = document.createElement("div"); fab.className = "lb-fab";
    fab.innerHTML =
      '<a class="lb-btn" href="/writing/">← Archive</a>' +
      '<button class="lb-btn lb-save" type="button">☆ Save</button>' +
      '<a class="lb-btn lb-sub" href="' + SUBSTACK + '/subscribe" target="_blank" rel="noopener">Subscribe</a>';
    document.body.appendChild(fab);
    var saveBtn = fab.querySelector(".lb-save");
    function isSaved() { return saved().some(function (x) { return x.slug === slug; }); }
    function paint() { var on = isSaved(); saveBtn.classList.toggle("on", on); saveBtn.innerHTML = on ? "★ Saved" : "☆ Save"; }
    function toggle() {
      var a = saved(), i = a.findIndex(function (x) { return x.slug === slug; });
      if (i >= 0) a.splice(i, 1); else a.unshift({ slug: slug, title: title, url: location.pathname, ts: Date.now() });
      setSaved(a); paint();
    }
    saveBtn.addEventListener("click", toggle); paint();

    var art = document.querySelector("article") || document.querySelector("main") || document.body;
    var cta = document.createElement("div"); cta.className = "lb-endcta";
    cta.innerHTML =
      "<h3>Keep the signal coming.</h3>" +
      "<p>New field notes by email when they land. Save this one to come back to it.</p>" +
      '<div class="lb-endcta-actions">' +
      '<a class="lb-btn lb-sub" href="' + SUBSTACK + '/subscribe" target="_blank" rel="noopener">Subscribe by email</a>' +
      '<button class="lb-btn lb-save2" type="button"></button></div>';
    art.appendChild(cta);
    var save2 = cta.querySelector(".lb-save2");
    function paint2() { save2.innerHTML = isSaved() ? "★ Saved" : "☆ Save this piece"; }
    save2.addEventListener("click", function () { toggle(); paint2(); }); paint2();
  }

  var mount = document.getElementById("lb-saved-mount");
  if (mount) {
    function render() {
      var a = saved();
      if (!a.length) { mount.innerHTML = '<p class="lb-saved-empty">Nothing saved yet. Tap Save on any piece and it waits for you here, on this device.</p>'; return; }
      var w = document.createElement("div"); w.className = "lb-saved-wrap";
      a.forEach(function (x) {
        var row = document.createElement("div"); row.className = "lb-saved-item";
        row.innerHTML = '<a href="' + x.url + '">' + (x.title || x.slug) + "</a>";
        var b = document.createElement("button"); b.type = "button"; b.title = "Remove"; b.textContent = "✕";
        b.addEventListener("click", function () { setSaved(saved().filter(function (y) { return y.slug !== x.slug; })); render(); });
        row.appendChild(b); w.appendChild(row);
      });
      mount.innerHTML = ""; mount.appendChild(w);
    }
    render();
  }
})();
