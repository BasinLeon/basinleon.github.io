(() => {
  if (!('speechSynthesis' in window)) return;
  const article = document.getElementById('article') || document.querySelector('article');
  const header = document.querySelector('.essay-header') || document.querySelector('header h1')?.parentElement;
  if (!article || !header) return;

  const blocks = [...article.querySelectorAll('p, h2, h3, blockquote')].filter(el => {
    if (el.closest('blockquote') && el.tagName === 'P') return false;
    return (el.innerText || '').trim().length > 0;
  });
  if (!blocks.length) return;

  const totalWords = blocks.reduce((sum, el) => sum + (el.innerText || '').trim().split(/\s+/).length, 0);
  const mins = Math.max(1, Math.round(totalWords / 185));

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'lb-listen-trigger';
  trigger.setAttribute('aria-expanded', 'false');
  trigger.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="6 4 20 12 6 20 6 4"/></svg><span>Listen · ${mins} min</span>`;
  header.appendChild(trigger);

  const bar = document.createElement('div');
  bar.className = 'lb-audio-bar';
  bar.hidden = true;
  bar.setAttribute('role', 'region');
  bar.setAttribute('aria-label', 'Essay audio reader');
  bar.innerHTML = `
    <button type="button" class="lb-audio-btn lb-audio-btn--play" data-lb-play>Play</button>
    <div class="lb-audio-progress">
      <div class="lb-audio-meta"><span data-lb-status>Ready · ${mins} min</span><span data-lb-step>1 / ${blocks.length}</span></div>
      <div class="lb-audio-track"><div class="lb-audio-fill" data-lb-fill></div></div>
    </div>
    <button type="button" class="lb-audio-btn" data-lb-speed aria-label="Playback speed">1×</button>
    <button type="button" class="lb-audio-btn" data-lb-close aria-label="Close audio reader">✕</button>
  `;
  document.body.appendChild(bar);

  const playBtn = bar.querySelector('[data-lb-play]');
  const speedBtn = bar.querySelector('[data-lb-speed]');
  const closeBtn = bar.querySelector('[data-lb-close]');
  const statusEl = bar.querySelector('[data-lb-status]');
  const stepEl = bar.querySelector('[data-lb-step]');
  const fillEl = bar.querySelector('[data-lb-fill]');

  const speeds = [1, 1.25, 1.5];
  let speedIdx = 0;
  let idx = 0;
  let playing = false;

  const clearHighlight = () => blocks.forEach(b => b.classList.remove('lb-reading-active'));

  const updateUI = () => {
    playBtn.textContent = playing ? 'Pause' : 'Play';
    speedBtn.textContent = `${speeds[speedIdx]}×`;
    stepEl.textContent = `${Math.min(idx + 1, blocks.length)} / ${blocks.length}`;
    fillEl.style.width = `${Math.round(((idx + (playing ? 1 : 0)) / blocks.length) * 100)}%`;
    statusEl.textContent = playing ? 'Listening' : (idx >= blocks.length ? 'Finished' : `Paused · ${mins} min`);
  };

  const speakCurrent = () => {
    window.speechSynthesis.cancel();
    if (idx >= blocks.length) {
      playing = false;
      clearHighlight();
      updateUI();
      return;
    }
    const el = blocks[idx];
    clearHighlight();
    el.classList.add('lb-reading-active');
    el.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });

    const utter = new SpeechSynthesisUtterance((el.innerText || '').trim());
    utter.rate = speeds[speedIdx];
    utter.onend = () => {
      if (!playing) return;
      idx += 1;
      updateUI();
      speakCurrent();
    };
    utter.onerror = () => {
      playing = false;
      updateUI();
    };
    updateUI();
    window.speechSynthesis.speak(utter);
  };

  const togglePlay = () => {
    if (playing) {
      playing = false;
      window.speechSynthesis.cancel();
      updateUI();
    } else {
      if (idx >= blocks.length) idx = 0;
      playing = true;
      speakCurrent();
    }
  };

  trigger.addEventListener('click', () => {
    bar.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    if (!playing) togglePlay();
  });

  playBtn.addEventListener('click', togglePlay);
  speedBtn.addEventListener('click', () => {
    speedIdx = (speedIdx + 1) % speeds.length;
    if (playing) speakCurrent();
    else updateUI();
  });
  closeBtn.addEventListener('click', () => {
    playing = false;
    window.speechSynthesis.cancel();
    clearHighlight();
    bar.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    updateUI();
  });

  window.addEventListener('beforeunload', () => window.speechSynthesis.cancel());
})();
