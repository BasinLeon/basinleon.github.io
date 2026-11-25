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

  /* Interactive Flow::Nexus Signal Workbench */
  const wb = document.getElementById('nexus-workbench');
  if (wb) {
    const MOTIONS = {
      govtech: {
        originTop: 'Council agenda',
        originSub: 'P0 public signal',
        weights: ['0.62', '0.24', '0.10', '0.04'],
        summaries: [
          'Dormant reply + same-week council agenda',
          'Verify open RFP window & owner fit',
          'Hold sequence, route 1-page brief',
          'Promote trigger weight across cities'
        ],
        stages: [
          {
            trigger: 'Inbound reply from a previously quiet municipal contact plus a same-week council traffic-safety agenda.',
            gate: 'Check CRM history, budget cycle timing, and rep ownership before drafting any outreach.',
            human: 'Operator pauses automated cadences and writes a 90-word note using the city\'s own staff-report phrasing.',
            outcome: 'Seller and AE align on a discovery plan; a qualified meeting is scheduled within 48 hours.'
          },
          {
            trigger: 'Public staff report names a recurring intersection safety issue twice in one quarter.',
            gate: 'Confirm no active RFP blackout period and verify who owns the corridor decision.',
            human: 'Cross-check council minutes against existing regional accounts so discovery opens with facts, not guesses.',
            outcome: 'Eliminates dead-end outreach and raises first-call conversion.'
          },
          {
            trigger: 'Verified problem owner replies with a specific operational question.',
            gate: 'Require explicit owner assignment (seller + AE) and agreed next date before sending.',
            human: 'Deliver a 1-page baseline brief tailored to that city\'s published goals.',
            outcome: 'Moves the account from passive reply into an owned, multi-threaded discovery motion.'
          },
          {
            trigger: 'Ten municipal accounts run through the exact same council-agenda signal play.',
            gate: 'Score response quality, signal-to-touch latency, and second-rep repeatability.',
            human: 'Keep only the steps that earned second questions; cut everything that only drove opens.',
            outcome: 'Council agenda + dormant reply becomes a reusable P0 play across California and Colorado.'
          }
        ]
      },
      cyber: {
        originTop: 'Hiring + VAR overlap',
        originSub: 'P0 co-sell signal',
        weights: ['0.58', '0.26', '0.11', '0.05'],
        summaries: [
          'Two PAM roles posted + reseller overlap',
          'Verify live MSA paper & direct conflict',
          'Route co-sell brief to SE & partner rep',
          'Lock PAM + VAR as top channel trigger'
        ],
        stages: [
          {
            trigger: 'Target enterprise posts two Privileged Access Management roles while renewing regional security stack.',
            gate: 'Check direct pipeline and map which regional reseller already holds MSA paper.',
            human: 'Flag as a P0 co-sell opportunity instead of cold-blasting the CISO.',
            outcome: 'Warm partner introduction replaces months of cold enterprise procurement friction.'
          },
          {
            trigger: 'Reseller partner confirms active security architecture review inside the account.',
            gate: 'Validate technical wedge (deployment speed and audit readiness) before requesting SE time.',
            human: 'Align seller, partner rep, and internal SE on one concrete proof scope.',
            outcome: 'Every stakeholder enters the first call with shared qualification criteria.'
          },
          {
            trigger: 'Security architect and budget owner both join the technical scoping session.',
            gate: 'Lock 7-day follow-up owner and explicit POC exit criteria.',
            human: 'Run a focused technical demonstration tied to the buyer\'s audit deadline.',
            outcome: 'Six-figure enterprise POC launched with clear commercial path.'
          },
          {
            trigger: 'Partner co-sell deals outperform direct cold outbound by 3x on cycle speed.',
            gate: 'Codify partner-mapping checklist so any U.S. rep can run it in week one.',
            human: 'Publish the 1-page co-sell handoff spec and train new SDRs from 90 days down to 5.',
            outcome: 'Generated $2M+ in partner-led pipeline across Americas.'
          }
        ]
      },
      midbound: {
        originTop: 'Champion job move',
        originSub: 'P0 warm signal',
        weights: ['0.66', '0.20', '0.10', '0.04'],
        summaries: [
          'Former power user joins Series B as VP',
          'Audit stack gaps & confirm ICP fit',
          'Route to warm-intro queue, zero spam',
          'Weight champion moves as top midbound'
        ],
        stages: [
          {
            trigger: 'Former power user joins a Series B AI company as VP of Operations while hiring GTM engineers.',
            gate: 'Confirm new company ICP fit and verify no active opportunity is already open.',
            human: 'Route directly to the warm-intro queue instead of dropping into an automated sequence.',
            outcome: 'High-trust reply within 24 hours without burning the relationship.'
          },
          {
            trigger: 'Public job descriptions reveal manual CRM routing and handoff bottlenecks.',
            gate: 'Verify buying committee across GTM Tech lead, Recruiting, and VP Sales.',
            human: 'Map concrete Day 1–30, 31–60, and 61–90 operating milestones before pitching.',
            outcome: 'Conversation starts on architecture rather than pricing.'
          },
          {
            trigger: 'Champion asks how the signal-to-touch workflow would fit their existing stack.',
            gate: 'Human-gated review of every line of copy before the follow-up goes out.',
            human: 'Share an inspectable live demo rather than a slide deck.',
            outcome: 'Executive working session booked directly with the hiring leader.'
          },
          {
            trigger: 'Quarterly deal autopsy compares cold outbound vs. champion job-change replies.',
            gate: 'Track latency from role announcement to first useful touch across all reps.',
            human: 'Promote champion job-change + hiring overlap to the highest-priority midbound trigger.',
            outcome: 'Compounding warm pipeline that survives territory handoffs.'
          }
        ]
      }
    };

    let currentMotion = 'govtech';
    let currentStage = 0;

    const motionBtns = [...document.querySelectorAll('.motion-tab')];
    const stageTabs = [...wb.querySelectorAll('.stage-tab')];
    const svgStages = [...wb.querySelectorAll('.svg-stage')];
    const edges = [...wb.querySelectorAll('.signal-edge')];
    const originTop = document.getElementById('svg-origin-top');
    const originSub = document.getElementById('svg-origin-sub');

    const render = () => {
      const m = MOTIONS[currentMotion];
      const s = m.stages[currentStage];
      wb.dataset.motion = currentMotion;
      wb.dataset.stage = String(currentStage);

      if (originTop) originTop.textContent = m.originTop;
      if (originSub) originSub.textContent = m.originSub;

      motionBtns.forEach(b => b.setAttribute('aria-selected', String(b.dataset.motion === currentMotion)));
      stageTabs.forEach((t, i) => {
        t.setAttribute('aria-selected', String(i === currentStage));
        const sum = t.querySelector('[data-stage-summary]');
        if (sum) sum.textContent = m.summaries[i];
      });
      svgStages.forEach((g, i) => {
        g.setAttribute('aria-pressed', String(i === currentStage));
        const w = g.querySelector('[data-weight]');
        if (w) w.textContent = m.weights[i];
      });
      edges.forEach((e, i) => {
        e.classList.toggle('is-active', i === currentStage);
        e.setAttribute('stroke-width', i === currentStage ? '3.4' : String(2.2 - i * 0.35));
      });

      ['trigger', 'gate', 'human', 'outcome'].forEach(key => {
        const el = wb.querySelector(`[data-wb="${key}"]`);
        if (el) el.textContent = s[key];
      });
    };

    motionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        currentMotion = btn.dataset.motion;
        currentStage = 0;
        render();
      });
    });

    const bindStage = el => {
      const idx = Number(el.dataset.stageBtn);
      el.addEventListener('click', () => { currentStage = idx; render(); });
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); currentStage = idx; render(); }
      });
    };
    stageTabs.forEach(bindStage);
    svgStages.forEach(bindStage);

    render();
  }
})();
