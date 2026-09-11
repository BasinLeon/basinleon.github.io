/**
 * lbContextualClose: one closing path per page, chosen by context.
 *
 * Any element with data-lb-close="session|nexus|subscribe" gets the matching
 * closing block appended. No generic homepage links: each variant routes the
 * reader to the page that continues the thought.
 *
 * Variants:
 *   session:   "Working on this problem? Bring me the motion." → /working-session/
 *   nexus:     "Want the operating model? Inspect Basin::Nexus." → /basin-nexus/
 *   subscribe: "Want the next piece? Subscribe." → Substack (UTM-tagged)
 */
(function () {
  "use strict";

  var VARIANTS = {
    session: {
      eyebrow: "The next step",
      title: "Working on this problem? Bring me the motion.",
      text: "Ninety minutes. One broken GTM motion. You leave with the diagnosis, the next decision, and the operating artifact.",
      cta: "Open the working session",
      href: "/working-session/",
      track: "Contextual close: working session"
    },
    nexus: {
      eyebrow: "The operating model",
      title: "Want the operating model? Inspect Basin::Nexus.",
      text: "The experiments, models, and methods behind the work: how signals become systems, and systems become proof.",
      cta: "Inspect Basin::Nexus",
      href: "/basin-nexus/",
      track: "Contextual close: nexus"
    },
    subscribe: {
      eyebrow: "The next piece",
      title: "Want the next piece? Subscribe.",
      text: "Anchor essays every other Tuesday. Notes in between. 5,000+ operators, builders, and writers reading along.",
      cta: "Subscribe on Substack",
      href: "https://substack.com/@leonbasin?utm_source=site&utm_medium=contextual-close&utm_campaign=evergreen",
      track: "Contextual close: subscribe",
      external: true
    }
  };

  var CSS =
    ".lb-close{margin:3rem 0 0;padding:2.25rem 0 0;border-top:2px solid rgba(138,109,59,.65);}" +
    ".lb-close .lb-close-eyebrow{font-size:.68rem;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:#8a6d3b;margin-bottom:.6rem;}" +
    ".lb-close h2{margin:0 0 .6rem;font-family:'Instrument Serif',Georgia,serif;font-size:clamp(1.7rem,3.5vw,2.4rem);font-weight:400;line-height:1.1;}" +
    ".lb-close p{margin:0 0 1.1rem;color:#4d483e;font-size:.98rem;max-width:560px;line-height:1.55;}" +
    ".lb-close a.lb-close-cta{display:inline-flex;align-items:center;gap:.5rem;font-weight:800;font-size:.86rem;color:#6d5426;text-decoration:none;border-bottom:2px solid #8a6d3b;padding-bottom:.25rem;}" +
    ".lb-close a.lb-close-cta:hover{color:#8a6d3b;}";

  function injectCss() {
    if (document.getElementById("lb-close-css")) return;
    var style = document.createElement("style");
    style.id = "lb-close-css";
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function render(slot) {
    var key = (slot.getAttribute("data-lb-close") || "").trim().toLowerCase();
    var v = VARIANTS[key];
    if (!v || slot.dataset.lbCloseRendered === "1") return;
    slot.dataset.lbCloseRendered = "1";
    var ext = v.external ? ' rel="noopener" target="_blank"' : "";
    slot.innerHTML =
      '<aside class="lb-close" aria-label="Continue">' +
      '<div class="lb-close-eyebrow">' + esc(v.eyebrow) + "</div>" +
      "<h2>" + esc(v.title) + "</h2>" +
      "<p>" + esc(v.text) + "</p>" +
      '<a class="lb-close-cta" data-lb-engage data-track="' + esc(v.track) + '" href="' + esc(v.href) + '"' + ext + ">" +
      esc(v.cta) + ' <span aria-hidden="true">→</span></a>' +
      "</aside>";
  }

  function init() {
    injectCss();
    var slots = document.querySelectorAll("[data-lb-close]");
    for (var i = 0; i < slots.length; i++) render(slots[i]);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
