(() => {
  document.documentElement.classList.add('js');
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
      const willOpen = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(willOpen));
      nav.classList.toggle('is-open', willOpen);
      document.body.classList.toggle('menu-open', willOpen);
    });
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  const revealItems = [...document.querySelectorAll('.reveal')];
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const copyButton = document.querySelector('.copy-email');

  const contactParams = new URLSearchParams(window.location.search);
  const contactSubject = (contactParams.get('subject') || 'Leon Basin conversation').slice(0, 160);
  const contactBody = (contactParams.get('body') || 'Company:\nBroken motion:\nWhat success must change:').slice(0, 4000);
  const gmailLinks = document.querySelectorAll('[data-gmail-contact]');

  if (gmailLinks.length) {
    const gmailUrl = new URL('https://mail.google.com/mail/');
    gmailUrl.searchParams.set('view', 'cm');
    gmailUrl.searchParams.set('fs', '1');
    gmailUrl.searchParams.set('to', 'lbasin23@gmail.com');
    gmailUrl.searchParams.set('su', contactSubject);
    gmailUrl.searchParams.set('body', contactBody);
    gmailLinks.forEach((link) => {
      link.href = gmailUrl.toString();
    });
  }

  if (copyButton) {
    copyButton.addEventListener('click', async () => {
      const email = copyButton.dataset.email || '';
      try {
        await navigator.clipboard.writeText(email);
      } catch {
        const input = document.createElement('textarea');
        input.value = email;
        input.setAttribute('readonly', '');
        input.style.position = 'fixed';
        input.style.opacity = '0';
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        input.remove();
      }
      const original = copyButton.textContent;
      copyButton.textContent = 'Email copied';
      window.setTimeout(() => { copyButton.textContent = original; }, 1800);
    });
  }
})();
