(() => {
  const button = document.querySelector('.story-share');
  const panel = document.querySelector('#story-share-options');
  const status = document.querySelector('.share-status');
  if (!button || !panel || !status) return;
  const url = document.querySelector('link[rel="canonical"]').href;
  const title = document.querySelector('h1').textContent;
  const text = `${title} by Leon Basin\n${url}`;
  const record = method => document.dispatchEvent(new CustomEvent('fiction-share-success', {detail: {method}}));
  const link = (label, href) => {
    const a = document.createElement('a');
    a.textContent = label; a.href = href; a.target = '_blank'; a.rel = 'noopener noreferrer';
    a.dataset.track = 'Fiction: share ' + label;
    panel.append(a);
  };
  const action = (label, run) => {
    const b = document.createElement('button'); b.type = 'button'; b.textContent = label;
    b.addEventListener('click', run); panel.append(b);
  };
  const copy = async (value, message) => {
    try { await navigator.clipboard.writeText(value); status.textContent = message; record('copy-link'); }
    catch (_) { status.textContent = 'Copy manually: ' + value; }
  };
  link('Share on X', 'https://twitter.com/intent/tweet?' + new URLSearchParams({text: title + ' by Leon Basin', url}));
  link('Send by email', 'mailto:?' + new URLSearchParams({subject: title, body: text}));
  action('Copy for Substack', () => copy(text, 'Copied. Paste into a Substack Note.'));
  action('Copy for Instagram', () => copy(text, 'Copied. Paste into a message, or use the story URL in a Story link sticker.'));
  action('Copy link', () => copy(url, 'Link copied.'));
  if (navigator.share) action('More apps…', async () => {
    try { await navigator.share({title, text: title + ' by Leon Basin', url}); status.textContent = 'Share completed.'; record('native-share'); }
    catch (error) { if (error.name !== 'AbortError') status.textContent = 'Sharing unavailable. Try Copy link.'; }
  });
  button.addEventListener('click', () => { panel.hidden = !panel.hidden; button.setAttribute('aria-expanded', String(!panel.hidden)); });
  panel.addEventListener('keydown', event => { if (event.key === 'Escape') { panel.hidden = true; button.setAttribute('aria-expanded', 'false'); button.focus(); } });
})();
