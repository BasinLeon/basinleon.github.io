(() => {
  const toggle = document.querySelector('.menu-toggle');
  const links = document.getElementById('primary-links');
  if (toggle && links) {
    const close = () => {
      document.body.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
    };
    toggle.addEventListener('click', () => {
      const open = document.body.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    links.querySelectorAll('a').forEach(link => link.addEventListener('click', close));
    document.addEventListener('keydown', event => {
      if (!document.body.classList.contains('menu-open')) return;
      if (event.key === 'Escape') { close(); toggle.focus(); }
      if (event.key === 'Tab') {
        const items = [toggle, ...links.querySelectorAll('a')];
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    });
    document.addEventListener('click', event => { if (!event.target.closest('.site-header')) close(); });
    window.matchMedia('(min-width: 761px)').addEventListener('change', event => { if (event.matches) close(); });
  }

  /* Two-state color-scheme toggle backed by <meta name="color-scheme"> and localStorage */
  const themeBtn = document.getElementById('theme-toggle');
  const schemeMeta = document.querySelector('meta[name="color-scheme"]');
  if (themeBtn && schemeMeta) {
    const darkMedia = window.matchMedia('(prefers-color-scheme: dark)');
    const readStored = () => {
      try {
        const val = localStorage.getItem('color-scheme');
        return (val === 'light' || val === 'dark') ? val : null;
      } catch (_) { return null; }
    };
    const applyScheme = (val, animate) => {
      const next = (val === 'light' || val === 'dark') ? val : 'light dark';
      const commit = () => { schemeMeta.content = next; };
      if (animate && document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        try {
          const t = document.startViewTransition(commit);
          if (t && t.ready) t.ready.catch(() => {});
          if (t && t.finished) t.finished.catch(() => {});
          return;
        } catch (_) {}
      }
      commit();
    };
    themeBtn.addEventListener('click', () => {
      const system = darkMedia.matches ? 'dark' : 'light';
      const current = (schemeMeta.content === 'dark' || schemeMeta.content === 'light')
        ? schemeMeta.content
        : system;
      const target = current === 'dark' ? 'light' : 'dark';
      let persisted = null;
      try {
        if (target === system) {
          localStorage.removeItem('color-scheme');
          persisted = null;
        } else {
          localStorage.setItem('color-scheme', target);
          persisted = target;
        }
      } catch (_) {
        persisted = target === system ? null : target;
      }
      applyScheme(persisted, true);
    });
    window.addEventListener('storage', event => {
      if (event.key === 'color-scheme') applyScheme(readStored(), false);
    });
  }

  const intentSelect = document.getElementById('home-contact-intent');
  const problemField = document.getElementById('home-contact-problem');
  const intentButtons = [...document.querySelectorAll('[data-contact-intent]')];
  if (intentSelect && intentButtons.length) {
    const syncChips = () => {
      intentButtons.forEach(btn => {
        btn.setAttribute('aria-pressed', String(btn.dataset.contactIntent === intentSelect.value));
      });
    };
    intentButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        intentSelect.value = btn.dataset.contactIntent;
        syncChips();
        problemField?.focus();
      });
    });
    intentSelect.addEventListener('change', syncChips);
    syncChips();
  }
})();
