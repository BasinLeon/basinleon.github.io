(() => {
  const mount = document.querySelector("[data-archive-ledger]");
  if (!mount) return;

  const storageKey = "basin.archive.ledger.v1";
  const sessionKey = `basin.archive.seen.${location.pathname}`;
  const emptyState = { visits: 0, opened: [], recent: null };

  const readState = () => {
    try {
      return { ...emptyState, ...JSON.parse(localStorage.getItem(storageKey) || "{}") };
    } catch {
      return { ...emptyState };
    }
  };

  const writeState = (state) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      // The reading experience still works when storage is unavailable.
    }
  };

  let state = readState();
  try {
    if (!sessionStorage.getItem(sessionKey)) {
      state.visits += 1;
      sessionStorage.setItem(sessionKey, "1");
      writeState(state);
    }
  } catch {
    state.visits += 1;
  }

  const styles = document.createElement("style");
  styles.textContent = `
    .archive-ledger{background:#0c0c0b;color:#f3efe6;border-bottom:1px solid rgba(255,255,255,.14)}
    .archive-ledger__inner{width:min(1240px,calc(100% - 64px));margin:0 auto;padding:1.15rem 0}
    .archive-ledger__bar{width:100%;display:grid;grid-template-columns:1fr auto auto auto;gap:1.5rem;align-items:center;border:0;background:none;color:inherit;padding:0;text-align:left;cursor:pointer;font:inherit}
    .archive-ledger__label,.archive-ledger__stat small{font-size:.68rem;letter-spacing:.17em;text-transform:uppercase}
    .archive-ledger__label{color:#e1b345}
    .archive-ledger__stat{display:flex;align-items:baseline;gap:.5rem;color:#f3efe6}
    .archive-ledger__stat strong{font:400 1.25rem/1 Georgia,serif}
    .archive-ledger__stat small{color:#8f8a80}
    .archive-ledger__mark{color:#e1b345;font-size:1.2rem;transition:transform 180ms ease}
    .archive-ledger__bar[aria-expanded="true"] .archive-ledger__mark{transform:rotate(45deg)}
    .archive-ledger__panel{display:grid;grid-template-columns:1fr auto;gap:1.5rem;align-items:end;padding:1.25rem 0 .35rem;border-top:1px solid rgba(255,255,255,.12);margin-top:1.1rem}
    .archive-ledger__panel[hidden]{display:none}
    .archive-ledger__panel p{max-width:620px;margin:0;color:#aaa49a;font-size:.9rem;line-height:1.55}
    .archive-ledger__actions{display:flex;flex-wrap:wrap;gap:.65rem}
    .archive-ledger__action{border:1px solid rgba(255,255,255,.28);background:none;color:#f3efe6;padding:.75rem 1rem;text-decoration:none;font:600 .72rem/1 Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;cursor:pointer}
    .archive-ledger__action:hover,.archive-ledger__action:focus-visible{border-color:#e1b345;color:#e1b345}
    .archive-ledger__action[hidden]{display:none}
    @media(max-width:800px){
      .archive-ledger__inner{width:min(100% - 36px,1240px)}
      .archive-ledger__bar{grid-template-columns:1fr auto auto;gap:.8rem}
      .archive-ledger__mark{display:none}
      .archive-ledger__stat{display:block;text-align:right}
      .archive-ledger__stat small{display:block;margin-top:.2rem;font-size:.56rem}
      .archive-ledger__panel{grid-template-columns:1fr;align-items:start}
    }
  `;
  document.head.appendChild(styles);

  mount.className = "archive-ledger";
  mount.innerHTML = `
    <div class="archive-ledger__inner">
      <button class="archive-ledger__bar" type="button" aria-expanded="false" aria-controls="archive-ledger-panel">
        <span class="archive-ledger__label">Your reading ledger</span>
        <span class="archive-ledger__stat"><strong data-ledger-visits>00</strong><small>visits</small></span>
        <span class="archive-ledger__stat"><strong data-ledger-opened>00</strong><small>opened</small></span>
        <span class="archive-ledger__mark" aria-hidden="true">+</span>
      </button>
      <div class="archive-ledger__panel" id="archive-ledger-panel" hidden>
        <p>This is a private counter stored only in this browser. It remembers rooms entered and stories opened so you can find your way back. It is not a public traffic claim.</p>
        <div class="archive-ledger__actions">
          <a class="archive-ledger__action" data-ledger-continue hidden>Continue reading</a>
          <button class="archive-ledger__action" type="button" data-ledger-random>Open a random page</button>
          <button class="archive-ledger__action" type="button" data-ledger-clear>Clear</button>
        </div>
      </div>
    </div>
  `;

  const visits = mount.querySelector("[data-ledger-visits]");
  const opened = mount.querySelector("[data-ledger-opened]");
  const continueLink = mount.querySelector("[data-ledger-continue]");
  const panel = mount.querySelector("#archive-ledger-panel");
  const toggle = mount.querySelector(".archive-ledger__bar");

  const render = () => {
    visits.textContent = String(state.visits).padStart(2, "0");
    opened.textContent = String(state.opened.length).padStart(2, "0");
    if (state.recent?.href) {
      continueLink.hidden = false;
      continueLink.href = state.recent.href;
      continueLink.textContent = `Continue: ${state.recent.title}`;
    } else {
      continueLink.hidden = true;
    }
  };

  const storyLinks = [...document.querySelectorAll('main a[href*="/blog/posts/"], main a[href^="posts/"]')];
  const labelFor = (link) => {
    const container = link.closest("article, .chapter, .shelf-item, .archive-record, .catalog-row");
    return container?.querySelector("h2, h3, strong")?.textContent.trim()
      || link.getAttribute("aria-label")?.replace(/^Read\s+/i, "")
      || link.textContent.trim()
      || "the last page";
  };

  storyLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const href = new URL(link.href, location.href).pathname;
      state.opened = [...new Set([...state.opened, href])];
      state.recent = { href, title: labelFor(link) };
      writeState(state);
    });
  });

  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    panel.hidden = expanded;
  });

  mount.querySelector("[data-ledger-random]").addEventListener("click", () => {
    if (!storyLinks.length) return;
    storyLinks[Math.floor(Math.random() * storyLinks.length)].click();
  });

  mount.querySelector("[data-ledger-clear]").addEventListener("click", () => {
    state = { visits: 1, opened: [], recent: null };
    writeState(state);
    render();
  });

  render();
})();
