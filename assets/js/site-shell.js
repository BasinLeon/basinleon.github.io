(function () {
  'use strict';

  const body = document.body;
  const section = body.dataset.lbSection || 'home';
  const shellEnabled = body.dataset.lbShell !== 'off';

  const navItems = [
    ['work', 'Work', '/case-studies/'],
    ['systems', 'Systems', '/basin-nexus/'],
    ['writing', 'Writing', '/blog/'],
    ['library', 'Library', '/library/'],
    ['tools', 'Tools', '/tools/'],
    ['about', 'About', '/docs/about/']
  ];

  function ensureAnalytics() {
    if (body.dataset.lbAnalytics === 'off') return;
    window.plausible = window.plausible || function () {
      (window.plausible.q = window.plausible.q || []).push(arguments);
    };

    if (!document.querySelector('script[data-domain="basinleon.github.io"]')) {
      const script = document.createElement('script');
      script.defer = true;
      script.dataset.domain = 'basinleon.github.io';
      script.src = 'https://plausible.io/js/script.js';
      document.head.appendChild(script);
    }
  }

  function ensureFavicon() {
    if (document.querySelector('link[rel~="icon"]')) return;
    const icon = document.createElement('link');
    icon.rel = 'icon';
    icon.href = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%23090909'/%3E%3Cpath d='M18 18h10v28H18zM30 18h16v8H38v20h-8z' fill='%23D4AF37'/%3E%3C/svg%3E";
    document.head.appendChild(icon);
  }

  function classifyLink(link) {
    const href = link.getAttribute('href') || '';
    if (href.startsWith('mailto:')) return 'Contact';
    if (href.includes('/case-studies/')) return 'Review Proof';
    if (href.includes('/basin-nexus/') || href.includes('architecture')) return 'Inspect Systems';
    if (href.includes('/work-with-me/')) return 'Availability';
    if (href.includes('/tools/') || href.includes('diagnostic') || href.includes('simulator')) return 'Use Tool';
    if (href.includes('/blog/') || href.includes('/docs/')) return 'Read';
    return '';
  }

  function trackConversions() {
    document.addEventListener('click', function (event) {
      const link = event.target.closest('a[href]');
      if (!link) return;
      const eventName = link.dataset.track || classifyLink(link);
      if (!eventName) return;

      window.plausible(eventName, {
        props: {
          source: section,
          destination: link.getAttribute('href'),
          label: (link.textContent || '').trim().slice(0, 80)
        }
      });
    });
  }

  function buildHeader() {
    const skip = document.createElement('a');
    skip.className = 'lb-skip-link';
    skip.href = '#main-content';
    skip.textContent = 'Skip to content';

    const header = document.createElement('header');
    header.className = 'lb-site-header';
    header.innerHTML = `
      <div class="lb-site-nav-inner">
        <a class="lb-site-brand" href="/" data-track="Home">Leon <span>Basin</span></a>
        <button class="lb-site-menu-toggle" type="button" aria-expanded="false" aria-controls="lb-site-links">Menu</button>
        <nav class="lb-site-links" id="lb-site-links" aria-label="Primary navigation" data-open="false">
          ${navItems.map(([key, label, href]) => `<a href="${href}"${section === key ? ' aria-current="page"' : ''}>${label}</a>`).join('')}
          <a class="lb-site-contact" href="mailto:lbasin23@gmail.com?subject=Leon%20Basin%20Intro">Contact</a>
        </nav>
      </div>`;

    body.prepend(header);
    body.prepend(skip);

    const main = document.querySelector('main') || document.querySelector('[role="main"]') || document.querySelector('.main-content') || document.querySelector('.main');
    if (main && !main.id) main.id = 'main-content';

    const button = header.querySelector('.lb-site-menu-toggle');
    const links = header.querySelector('.lb-site-links');

    function setMenu(open) {
      links.dataset.open = String(open);
      button.setAttribute('aria-expanded', String(open));
      button.textContent = open ? 'Close' : 'Menu';
    }

    button.addEventListener('click', function () {
      setMenu(links.dataset.open !== 'true');
    });
    links.addEventListener('click', function () { setMenu(false); });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') setMenu(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 920) setMenu(false);
    });
  }

  function buildFooter() {
    const footer = document.createElement('footer');
    footer.className = 'lb-site-footer';
    footer.innerHTML = `
      <div class="lb-site-footer-inner">
        <div class="lb-site-footer-kicker">Next conversation</div>
        <h2>Make the system legible.</h2>
        <div class="lb-site-footer-actions">
          <a href="mailto:lbasin23@gmail.com?subject=Leon%20Basin%20Intro">Write to Leon</a>
          <a href="/case-studies/">Review proof</a>
          <a href="/basin-nexus/">Inspect systems</a>
        </div>
        <div class="lb-site-footer-meta">
          <span>© 2026 Leon Basin · GTM systems builder and operator</span>
          <nav aria-label="Social links">
            <a href="https://linkedin.com/in/leonbasin" rel="noopener noreferrer">LinkedIn</a>
            <a href="https://github.com/BasinLeon" rel="noopener noreferrer">GitHub</a>
            <a href="/blog/">Archive</a>
          </nav>
        </div>
      </div>`;
    body.appendChild(footer);
  }

  function improveMedia() {
    document.querySelectorAll('img:not([loading])').forEach(function (image, index) {
      if (index > 0 || !image.closest('header, .hero, .masthead')) image.loading = 'lazy';
      image.decoding = 'async';
    });
  }

  ensureAnalytics();
  ensureFavicon();
  trackConversions();
  improveMedia();

  if (shellEnabled) {
    buildHeader();
    buildFooter();
    body.classList.add('lb-shell-upgraded');
  }
}());
