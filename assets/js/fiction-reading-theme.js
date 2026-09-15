(() => {
  const header = document.querySelector('.head .shell');
  if (!header) return;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'reader-theme';
  header.append(button);
  const paint = dark => {
    document.documentElement.dataset.readingTheme = dark ? 'dark' : 'light';
    button.textContent = dark ? 'Paper reading' : 'Dark reading';
    button.setAttribute('aria-pressed', String(dark));
  };
  try { paint(localStorage.getItem('fiction-reading-theme') === 'dark'); } catch (_) { paint(false); }
  button.addEventListener('click', () => {
    const dark = document.documentElement.dataset.readingTheme !== 'dark';
    paint(dark);
    try { localStorage.setItem('fiction-reading-theme', dark ? 'dark' : 'light'); } catch (_) {}
  });
})();
