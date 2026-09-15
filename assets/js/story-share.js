(() => {
  const button = document.querySelector('.story-share');
  const status = document.querySelector('.share-status');
  if (!button || !status) return;
  const url = document.querySelector('link[rel="canonical"]').href;
  button.addEventListener('click', async () => {
    status.textContent = '';
    try {
      if (navigator.share) {
        await navigator.share({title: document.querySelector('h1').textContent, url});
        status.textContent = 'Share completed.';
      } else {
        await navigator.clipboard.writeText(url);
        status.textContent = 'Link copied.';
      }
      document.dispatchEvent(new CustomEvent('fiction-share-success', {detail: {method: navigator.share ? 'native-share' : 'copy-link'}}));
    } catch (error) {
      if (error.name !== 'AbortError') status.textContent = 'Copy this link: ' + url;
    }
  });
})();
