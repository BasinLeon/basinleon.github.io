(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  const closeMenu = () => {
    if (!menuButton || !nav) return;
    menuButton.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  };

  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
      document.body.classList.toggle('menu-open', open);
    });
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });
    window.addEventListener('resize', () => { if (window.innerWidth > 980) closeMenu(); });
  }

  const items = [...document.querySelectorAll('.catalog-item')];
  const filterButtons = [...document.querySelectorAll('.filter')];
  const search = document.querySelector('#catalog-search');
  const empty = document.querySelector('#catalog-empty');
  const visibleCount = document.querySelector('#visible-count');
  let activeFilter = 'all';

  const applyCatalogState = () => {
    const query = (search?.value || '').trim().toLowerCase();
    let visible = 0;
    items.forEach((item) => {
      const categoryMatch = activeFilter === 'all' || item.dataset.category === activeFilter;
      const searchMatch = !query || `${item.dataset.search} ${item.textContent}`.toLowerCase().includes(query);
      item.hidden = !(categoryMatch && searchMatch);
      if (!item.hidden) visible += 1;
    });
    if (visibleCount) visibleCount.textContent = String(visible).padStart(2, '0');
    empty?.classList.toggle('is-visible', visible === 0);
  };

  const activateFilter = (filter) => {
    activeFilter = filter;
    filterButtons.forEach((button) => {
      const active = button.dataset.filter === filter;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    applyCatalogState();
  };

  filterButtons.forEach((button) => button.addEventListener('click', () => activateFilter(button.dataset.filter || 'all')));
  search?.addEventListener('input', applyCatalogState);
  document.querySelectorAll('[data-route-filter]').forEach((route) => {
    route.addEventListener('click', () => activateFilter(route.dataset.routeFilter || 'all'));
  });

  const revealItems = [...document.querySelectorAll('.reveal')];
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -7% 0px', threshold: .08 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }
})();
