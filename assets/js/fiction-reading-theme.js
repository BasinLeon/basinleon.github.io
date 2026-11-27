(() => {
  const THEME_KEY = 'fiction-reading-theme';
  const PROGRESS_KEY = 'lb-fiction-progress';

  const CHAPTERS = [
    { part: 'Part I · The Sam & Ink Cycle', num: '00', title: 'The Vanishing Archive', href: '/fiction/the-vanishing-archive/', mins: '2 min' },
    { part: 'Part I · The Sam & Ink Cycle', num: '01', title: 'The Typewriter', href: '/blog/posts/sam-ink-the-typewriter.html', mins: '4 min' },
    { part: 'Part I · The Sam & Ink Cycle', num: '02', title: 'The Outage', href: '/blog/posts/sam-ink-the-outage.html', mins: '4 min' },
    { part: 'Part I · The Sam & Ink Cycle', num: '03', title: 'The Note in the Other Room', href: '/blog/posts/sam-ink-note-in-the-other-room.html', mins: '3 min' },
    { part: 'Part I · The Sam & Ink Cycle', num: '04', title: 'The Map Made of Starlight', href: '/blog/posts/sam-ink-starlight-map.html', mins: '7 min' },
    { part: 'Part I · The Sam & Ink Cycle', num: '05', title: 'The Signal', href: '/blog/posts/sam-ink-the-signal.html', mins: '3 min' },
    { part: 'Part II · The Archive & The City', num: '06', title: 'The Archivist: Letter 004', href: '/blog/posts/the-archivist-letter-004.html', mins: '5 min' },
    { part: 'Part II · The Archive & The City', num: '07', title: 'Echoes of the Divine', href: '/blog/posts/echoes-divine-sf-reverie.html', mins: '5 min' },
    { part: 'Appendix · Earlier Fragments', num: 'F1', title: 'The Night the Code Asked for a Name', href: '/blog/posts/the-night-the-code-asked.html', mins: '1 min', appendix: true },
    { part: 'Appendix · Earlier Fragments', num: 'F2', title: 'Feed, Signal, Threshold', href: '/blog/posts/sam-ink-patch-003.html', mins: '1 min', appendix: true }
  ];

  const normalizePath = (p) => {
    if (!p) return '/';
    return p.replace(/index\.html$/, '');
  };

  const loadProgress = () => {
    try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}'); }
    catch (_) { return {}; }
  };

  const saveProgress = (map) => {
    try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(map)); } catch (_) {}
  };

  /* 1. Three-Surface Theme Toggle: Paper -> Sepia -> Night */
  const THEMES = ['light', 'sepia', 'dark'];
  const THEME_LABELS = { light: 'Paper', sepia: 'Sepia', dark: 'Night' };

  const headerControls = document.querySelector('.reading-controls, .head .shell');
  let currentTheme = 'light';
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (THEMES.includes(saved)) currentTheme = saved;
  } catch (_) {}

  const applyTheme = (theme, btn) => {
    currentTheme = THEMES.includes(theme) ? theme : 'light';
    document.documentElement.dataset.readingTheme = currentTheme;
    if (btn) {
      btn.textContent = THEME_LABELS[currentTheme];
      btn.setAttribute('aria-label', 'Reading surface: ' + THEME_LABELS[currentTheme] + '. Click to switch.');
      btn.setAttribute('title', 'Switch reading surface (Paper / Sepia / Night)');
    }
  };

  if (headerControls) {
    const themeBtn = document.createElement('button');
    themeBtn.type = 'button';
    themeBtn.className = 'reader-theme';
    headerControls.append(themeBtn);
    applyTheme(currentTheme, themeBtn);
    themeBtn.addEventListener('click', () => {
      const next = THEMES[(THEMES.indexOf(currentTheme) + 1) % THEMES.length];
      applyTheme(next, themeBtn);
      try { localStorage.setItem(THEME_KEY, next); } catch (_) {}
    });
  } else {
    applyTheme(currentTheme, null);
  }

  /* 2. Fiction Room Anthology Progress Hydration */
  const progressBarSlot = document.getElementById('anthology-progress');
  if (progressBarSlot) {
    const progressMap = loadProgress();
    const coreChapters = CHAPTERS.filter((c) => !c.appendix);
    let readCount = 0;
    let resumeCandidate = null;

    coreChapters.forEach((ch) => {
      const rec = progressMap[normalizePath(ch.href)];
      if (rec && rec.pct >= 88) readCount += 1;
      else if (rec && rec.pct >= 12 && (!resumeCandidate || (rec.ts || 0) > (resumeCandidate.ts || 0))) {
        resumeCandidate = { ...ch, pct: rec.pct, ts: rec.ts || 0 };
      }
    });

    const summary = document.createElement('span');
    summary.className = 'anthology-progress-text';
    summary.textContent = readCount > 0
      ? `${readCount} of ${coreChapters.length} core stories read`
      : `${coreChapters.length} core stories · 2 archival fragments`;
    progressBarSlot.replaceChildren(summary);

    if (resumeCandidate) {
      const resumeLink = document.createElement('a');
      resumeLink.className = 'anthology-resume-link';
      resumeLink.href = resumeCandidate.href;
      resumeLink.textContent = `Continue "${resumeCandidate.title}" (${resumeCandidate.pct}%) →`;
      progressBarSlot.append(resumeLink);
    }

    document.querySelectorAll('.story-row[href]').forEach((row) => {
      const path = normalizePath(new URL(row.getAttribute('href'), location.origin).pathname);
      const rec = progressMap[path];
      if (!rec) return;
      const meta = row.querySelector('.story-meta');
      if (!meta) return;
      if (rec.pct >= 88) {
        const badge = document.createElement('em');
        badge.className = 'story-status-badge is-read';
        badge.textContent = 'Read ✓';
        meta.prepend(badge);
      } else if (rec.pct >= 12) {
        const badge = document.createElement('em');
        badge.className = 'story-status-badge is-progress';
        badge.textContent = `${rec.pct}%`;
        meta.prepend(badge);
      }
    });
  }

  /* 3. Story Reader Enhancements (only on .fiction-story-reader pages) */
  if (!document.body.classList.contains('fiction-story-reader')) return;

  const currentPath = normalizePath(location.pathname);
  const currentIdx = CHAPTERS.findIndex((c) => normalizePath(c.href) === currentPath);
  const currentChapter = currentIdx >= 0 ? CHAPTERS[currentIdx] : null;
  const prevChapter = currentIdx > 0 ? CHAPTERS[currentIdx - 1] : null;
  const nextChapter = currentIdx >= 0 && currentIdx < CHAPTERS.length - 1 ? CHAPTERS[currentIdx + 1] : null;

  const controls = document.querySelector('.story-controls');

  /* 3a. Focus Mode (F key + subtle button) */
  const toggleFocus = (force) => {
    const on = typeof force === 'boolean' ? force : !document.body.classList.contains('focus-reading');
    document.body.classList.toggle('focus-reading', on);
    if (focusBtn) {
      focusBtn.setAttribute('aria-pressed', String(on));
      focusBtn.textContent = on ? 'Exit focus' : 'Focus';
    }
  };

  let focusBtn = null;
  if (controls) {
    focusBtn = document.createElement('button');
    focusBtn.type = 'button';
    focusBtn.className = 'reader-size-btn reader-focus-btn';
    focusBtn.textContent = 'Focus';
    focusBtn.setAttribute('aria-pressed', 'false');
    focusBtn.setAttribute('title', 'Distraction-free reading mode (shortcut: F)');
    focusBtn.addEventListener('click', () => toggleFocus());
    controls.insertBefore(focusBtn, controls.querySelector('.reading-controls'));
  }

  /* 3b. Slide-Out Book Spine ("Contents" drawer) */
  let drawer = null;
  let backdrop = null;
  let spineBtn = null;

  const setDrawer = (open) => {
    if (!drawer || !backdrop || !spineBtn) return;
    drawer.hidden = !open;
    backdrop.hidden = !open;
    requestAnimationFrame(() => {
      drawer.classList.toggle('is-open', open);
      backdrop.classList.toggle('is-open', open);
    });
    spineBtn.setAttribute('aria-expanded', String(open));
    if (open) {
      renderDrawerItems();
      const closeEl = drawer.querySelector('.book-spine-close');
      if (closeEl) closeEl.focus();
    }
  };

  const renderDrawerItems = () => {
    if (!drawer) return;
    const listWrap = drawer.querySelector('.book-spine-list');
    if (!listWrap) return;
    const progressMap = loadProgress();
    const groups = new Map();
    CHAPTERS.forEach((ch) => {
      if (!groups.has(ch.part)) groups.set(ch.part, []);
      groups.get(ch.part).push(ch);
    });

    listWrap.innerHTML = '';
    groups.forEach((items, partTitle) => {
      const heading = document.createElement('p');
      heading.className = 'book-spine-part';
      heading.textContent = partTitle;
      listWrap.append(heading);

      items.forEach((ch) => {
        const path = normalizePath(ch.href);
        const rec = progressMap[path];
        const isCurrent = path === currentPath;
        const a = document.createElement('a');
        a.className = 'book-spine-item' + (isCurrent ? ' is-current' : '');
        a.href = ch.href;
        if (isCurrent) a.setAttribute('aria-current', 'page');

        const status = rec && rec.pct >= 88
          ? 'Read ✓'
          : (rec && rec.pct >= 12 ? `${rec.pct}%` : ch.mins);

        a.innerHTML = `<span class="book-spine-num">${ch.num}</span><span class="book-spine-title">${ch.title}</span><span class="book-spine-meta">${status}</span>`;
        listWrap.append(a);
      });
    });
  };

  if (controls) {
    spineBtn = document.createElement('button');
    spineBtn.type = 'button';
    spineBtn.className = 'reader-size-btn reader-spine-btn';
    spineBtn.textContent = 'Contents';
    spineBtn.setAttribute('aria-expanded', 'false');
    spineBtn.setAttribute('aria-controls', 'book-spine-drawer');
    spineBtn.addEventListener('click', () => setDrawer(drawer.hidden));
    controls.insertBefore(spineBtn, controls.querySelector('.reader-size-btn'));

    backdrop = document.createElement('div');
    backdrop.className = 'book-spine-backdrop';
    backdrop.hidden = true;
    backdrop.addEventListener('click', () => setDrawer(false));

    drawer = document.createElement('aside');
    drawer.id = 'book-spine-drawer';
    drawer.className = 'book-spine-drawer';
    drawer.hidden = true;
    drawer.setAttribute('aria-label', 'Fiction anthology contents');
    drawer.innerHTML = `
      <div class="book-spine-head">
        <div>
          <p class="book-spine-kicker">Stories from Silicon Valley</p>
          <h2>Table of Contents</h2>
        </div>
        <button type="button" class="book-spine-close" aria-label="Close contents">✕</button>
      </div>
      <div class="book-spine-list"></div>
      <div class="book-spine-foot">
        <div class="book-spine-foot-row">
          <a href="/blog/fiction/">Open full Fiction Room →</a>
          <button type="button" class="book-spine-print" data-book-print>Print / Save PDF</button>
        </div>
        <p class="book-spine-keys">Shortcuts: <strong>← / →</strong> chapters · <strong>F</strong> focus</p>
      </div>
    `;
    drawer.querySelector('.book-spine-close').addEventListener('click', () => setDrawer(false));
    drawer.querySelector('[data-book-print]').addEventListener('click', () => {
      setDrawer(false);
      setTimeout(() => window.print(), 180);
    });
    document.body.append(backdrop, drawer);
  }

  /* 3c. Keyboard shortcuts (F = Focus, Esc = close/exit, ArrowLeft/Right = prev/next chapter) */
  document.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.target?.isContentEditable) return;

    if (e.key === 'Escape') {
      if (drawer && !drawer.hidden) setDrawer(false);
      else if (document.body.classList.contains('focus-reading')) toggleFocus(false);
    } else if (e.key === 'f' || e.key === 'F') {
      e.preventDefault();
      toggleFocus();
    } else if (e.key === 'ArrowRight' && nextChapter && (!drawer || drawer.hidden)) {
      location.href = nextChapter.href;
    } else if (e.key === 'ArrowLeft' && prevChapter && (!drawer || drawer.hidden)) {
      location.href = prevChapter.href;
    }
  });

  /* 3d. Automatic Bookmark & Reading Progress Memory */
  const articleEl = document.querySelector('article.story-body');
  if (articleEl) {
    const progressMap = loadProgress();
    const prior = progressMap[currentPath];
    if (prior && prior.pct >= 15 && prior.pct < 88 && prior.y > 260) {
      const resumePill = document.createElement('button');
      resumePill.type = 'button';
      resumePill.className = 'reader-resume-pill';
      resumePill.textContent = `Resume where you left off (${prior.pct}%) ↓`;
      resumePill.addEventListener('click', () => {
        window.scrollTo({ top: prior.y, behavior: 'smooth' });
        resumePill.remove();
      });
      document.body.append(resumePill);
      const dismissIfScrolled = () => {
        if (window.scrollY > 220) {
          resumePill.remove();
          window.removeEventListener('scroll', dismissIfScrolled);
        }
      };
      window.addEventListener('scroll', dismissIfScrolled, { passive: true });
    }

    let saveTimer = null;
    const recordScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const pct = Math.min(100, Math.max(0, Math.round((window.scrollY / max) * 100)));
      if (pct < 5) return;
      const map = loadProgress();
      const prevPct = map[currentPath]?.pct || 0;
      map[currentPath] = {
        pct: prevPct >= 88 ? 100 : pct,
        y: Math.round(window.scrollY),
        ts: Date.now()
      };
      saveProgress(map);
    };

    window.addEventListener('scroll', () => {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(recordScroll, 250);
    }, { passive: true });
  }

  /* 3e. Select-to-Quote Floating Pill (zero em-dashes) */
  if (articleEl) {
    const quotePill = document.createElement('button');
    quotePill.type = 'button';
    quotePill.className = 'reader-quote-pill';
    quotePill.hidden = true;
    quotePill.textContent = 'Copy quote';
    document.body.append(quotePill);

    let activeQuote = '';

    const hideQuote = () => {
      quotePill.hidden = true;
      activeQuote = '';
    };

    const showQuoteIfValid = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.rangeCount) { hideQuote(); return; }
      const text = sel.toString().replace(/\s+/g, ' ').trim();
      if (text.length < 12 || text.length > 320) { hideQuote(); return; }
      const range = sel.getRangeAt(0);
      if (!articleEl.contains(range.commonAncestorContainer)) { hideQuote(); return; }

      const rect = range.getBoundingClientRect();
      if (!rect || (rect.width === 0 && rect.height === 0)) { hideQuote(); return; }

      activeQuote = text;
      quotePill.textContent = 'Copy quote';
      quotePill.hidden = false;
      const top = Math.max(12, rect.top + window.scrollY - 46);
      const left = Math.min(
        window.innerWidth - 130,
        Math.max(16, rect.left + rect.width / 2 - 54)
      );
      quotePill.style.top = `${top}px`;
      quotePill.style.left = `${left}px`;
    };

    document.addEventListener('mouseup', () => setTimeout(showQuoteIfValid, 15));
    document.addEventListener('keyup', (e) => {
      if (e.shiftKey) setTimeout(showQuoteIfValid, 15);
    });
    document.addEventListener('mousedown', (e) => {
      if (e.target !== quotePill) hideQuote();
    });

    quotePill.addEventListener('click', async () => {
      if (!activeQuote) return;
      const title = currentChapter ? currentChapter.title : document.title.split('|')[0].trim();
      const canonical = document.querySelector('link[rel="canonical"]')?.href || location.href;
      const formatted = `"${activeQuote}"\n- Leon Basin, ${title}\n${canonical}`;
      try {
        await navigator.clipboard.writeText(formatted);
        quotePill.textContent = 'Copied ✓';
        setTimeout(hideQuote, 1200);
      } catch (_) {
        quotePill.textContent = 'Copy failed';
        setTimeout(hideQuote, 1200);
      }
    });
  }
})();
