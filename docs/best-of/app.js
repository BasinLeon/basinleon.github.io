(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(open));
    });
  }

  const buttons = [...document.querySelectorAll('.shelf-button')];
  const readings = [...document.querySelectorAll('.reading')];
  const count = document.querySelector('#visible-count');
  const empty = document.querySelector('#empty-state');

  const showShelf = (filter) => {
    let visible = 0;
    readings.forEach((reading) => {
      const show = filter === 'all' || reading.dataset.category === filter;
      reading.hidden = !show;
      if (show) visible += 1;
    });
    buttons.forEach((button) => {
      const active = button.dataset.filter === filter;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    if (count) count.textContent = String(visible);
    if (empty) empty.classList.toggle('is-visible', visible === 0);
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => showShelf(button.dataset.filter || 'all'));
  });
})();
