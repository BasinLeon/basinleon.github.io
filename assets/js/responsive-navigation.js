/* Complete the existing menu controls without changing their click behavior. */
(() => {
  const script = document.currentScript;
  const breakpoint = Number(script?.dataset.menuBreakpoint || 820);
  const button = document.querySelector('button[aria-controls][aria-expanded]');
  const menu = button && document.getElementById(button.getAttribute('aria-controls'));
  if (!button || !menu) return;
  const isOpen = () => button.getAttribute('aria-expanded') === 'true';
  const close = () => { if (isOpen()) button.click(); };
  document.addEventListener('keydown', event => {
    if (!isOpen()) return;
    if (event.key === 'Escape') { close(); button.focus(); }
    if (event.key !== 'Tab') return;
    const items = [button, ...menu.querySelectorAll('a[href],button:not([disabled])')]
      .filter(item => item.getClientRects().length && getComputedStyle(item).visibility !== 'hidden');
    const first = items[0], last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }, true);
  window.matchMedia(`(min-width: ${breakpoint + 1}px)`).addEventListener('change', event => {
    if (event.matches) close();
  });
})();
