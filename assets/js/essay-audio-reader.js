(() => {
  if (window.__lbAudioReaderLoaded) return;
  window.__lbAudioReaderLoaded = true;

  const VOICE_KEY = 'lb-audio-voice';
  const SPEED_KEY = 'lb-audio-speed';
  const studioSrc = document.body?.dataset?.audioSrc || '';

  const article = document.getElementById('article')
    || document.querySelector('article.story-body')
    || document.querySelector('article');
  if (!article) return;

  const mountListenTrigger = (btn) => {
    const mastShell = document.querySelector('.mast .shell');
    if (mastShell) { mastShell.appendChild(btn); return true; }
    const essayHeader = document.querySelector('.essay-header');
    if (essayHeader) { essayHeader.appendChild(btn); return true; }
    const h1 = article.querySelector('h1') || document.querySelector('main h1') || document.querySelector('header h1');
    if (h1 && h1.parentElement) {
      const meta = h1.parentElement.querySelector('.post-meta, .meta, .subtitle, .standfirst, .lb-read-meta');
      if (meta && meta.nextSibling) h1.parentElement.insertBefore(btn, meta.nextSibling);
      else h1.insertAdjacentElement('afterend', btn);
      return true;
    }
    article.prepend(btn);
    return true;
  };

  const speeds = [0.9, 1.0, 1.15, 1.35];
  const speedLabels = ['0.9×', '1×', '1.15×', '1.35×'];
  let speedIdx = 1;
  try {
    const savedSpeed = parseInt(localStorage.getItem(SPEED_KEY) || '', 10);
    if (!Number.isNaN(savedSpeed) && savedSpeed >= 0 && savedSpeed < speeds.length) speedIdx = savedSpeed;
  } catch (_) {}

  /* =====================================================================
     MODE A: STUDIO NEURAL AUDIOBOOK (.mp3) PLAYBACK
     ===================================================================== */
  if (studioSrc) {
    const fmt = (sec) => {
      if (!Number.isFinite(sec) || sec < 0) return '0:00';
      const m = Math.floor(sec / 60);
      const s = Math.floor(sec % 60);
      return `${m}:${String(s).padStart(2, '0')}`;
    };

    const audio = new Audio();
    audio.preload = 'metadata';
    audio.src = studioSrc;
    audio.playbackRate = speeds[speedIdx];

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'lb-listen-trigger';
    trigger.setAttribute('aria-expanded', 'false');
    trigger.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="6 4 20 12 6 20 6 4"/></svg><span data-lb-trigger-label>Listen · Studio Audio</span>`;
    mountListenTrigger(trigger);

    const bar = document.createElement('div');
    bar.className = 'lb-audio-bar';
    bar.hidden = true;
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Studio audiobook player');
    bar.innerHTML = `
      <div class="lb-audio-controls">
        <button type="button" class="lb-audio-btn" data-lb-back aria-label="Rewind 10 seconds" title="Back 10s">-10s</button>
        <button type="button" class="lb-audio-btn lb-audio-btn--play" data-lb-play>Play</button>
        <button type="button" class="lb-audio-btn" data-lb-fwd aria-label="Forward 10 seconds" title="Forward 10s">+10s</button>
      </div>
      <div class="lb-audio-progress">
        <div class="lb-audio-meta">
          <span data-lb-status>Studio narration</span>
          <span data-lb-time>0:00 / --:--</span>
        </div>
        <div class="lb-audio-track" data-lb-track role="slider" aria-label="Audio timeline" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" tabindex="0">
          <div class="lb-audio-fill" data-lb-fill></div>
        </div>
      </div>
      <button type="button" class="lb-audio-btn" data-lb-speed aria-label="Playback speed" title="Playback speed">${speedLabels[speedIdx]}</button>
      <button type="button" class="lb-audio-btn lb-audio-btn--icon" data-lb-close aria-label="Close audio player" title="Close">✕</button>
    `;
    document.body.appendChild(bar);

    const backBtn = bar.querySelector('[data-lb-back]');
    const playBtn = bar.querySelector('[data-lb-play]');
    const fwdBtn = bar.querySelector('[data-lb-fwd]');
    const speedBtn = bar.querySelector('[data-lb-speed]');
    const closeBtn = bar.querySelector('[data-lb-close]');
    const statusEl = bar.querySelector('[data-lb-status]');
    const timeEl = bar.querySelector('[data-lb-time]');
    const fillEl = bar.querySelector('[data-lb-fill]');
    const trackEl = bar.querySelector('[data-lb-track]');
    const triggerLabel = trigger.querySelector('[data-lb-trigger-label]');

    const paint = () => {
      const dur = audio.duration || 0;
      const cur = audio.currentTime || 0;
      const pct = dur > 0 ? Math.min(100, (cur / dur) * 100) : 0;
      playBtn.textContent = audio.paused ? 'Play' : 'Pause';
      speedBtn.textContent = speedLabels[speedIdx];
      fillEl.style.width = `${pct.toFixed(1)}%`;
      trackEl.setAttribute('aria-valuenow', String(Math.round(pct)));
      timeEl.textContent = `${fmt(cur)} / ${dur > 0 ? fmt(dur) : '--:--'}`;
      statusEl.textContent = audio.ended ? 'Finished' : (audio.paused ? 'Paused · Studio' : 'Listening · Studio');
    };

    audio.addEventListener('loadedmetadata', () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        triggerLabel.textContent = `Listen · ${fmt(audio.duration)}`;
      }
      paint();
    });
    audio.addEventListener('timeupdate', paint);
    audio.addEventListener('play', paint);
    audio.addEventListener('pause', paint);
    audio.addEventListener('ended', paint);

    const togglePlay = () => {
      if (audio.paused) {
        audio.playbackRate = speeds[speedIdx];
        audio.play().catch(() => {});
      } else {
        audio.pause();
      }
    };

    trigger.addEventListener('click', () => {
      bar.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
      if (audio.paused) togglePlay();
    });

    playBtn.addEventListener('click', togglePlay);
    backBtn.addEventListener('click', () => {
      audio.currentTime = Math.max(0, (audio.currentTime || 0) - 10);
      paint();
    });
    fwdBtn.addEventListener('click', () => {
      const dur = audio.duration || 0;
      audio.currentTime = Math.min(dur || (audio.currentTime + 10), (audio.currentTime || 0) + 10);
      paint();
    });
    trackEl.addEventListener('click', (e) => {
      if (!audio.duration) return;
      const rect = trackEl.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      audio.currentTime = ratio * audio.duration;
      paint();
    });
    speedBtn.addEventListener('click', () => {
      speedIdx = (speedIdx + 1) % speeds.length;
      audio.playbackRate = speeds[speedIdx];
      try { localStorage.setItem(SPEED_KEY, String(speedIdx)); } catch (_) {}
      paint();
    });
    closeBtn.addEventListener('click', () => {
      audio.pause();
      bar.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
      paint();
    });
    document.addEventListener('keydown', (e) => {
      if (bar.hidden || e.code !== 'Space') return;
      const tag = (e.target && e.target.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || tag === 'BUTTON' || e.target?.isContentEditable) return;
      e.preventDefault();
      togglePlay();
    });

    paint();
    return;
  }

  /* =====================================================================
     MODE B: WEB SPEECH FALLBACK (FOR ESSAYS WITHOUT STUDIO MP3)
     ===================================================================== */
  if (!('speechSynthesis' in window)) return;

  const blocks = [...article.querySelectorAll('p, h2, h3, blockquote, .opening-block, .tweet-block, .pullquote')].filter((el) => {
    if (el.closest('blockquote, .note, .catalog, .end, .closing-note, .close, aside')) return false;
    if (el.tagName === 'P' && el.closest('.tweet-block, .opening-block')) return false;
    const txt = (el.innerText || '').trim();
    return txt.length > 0;
  });
  if (!blocks.length) return;

  const totalWords = blocks.reduce((sum, el) => sum + (el.innerText || '').trim().split(/\s+/).length, 0);
  const mins = Math.max(1, Math.round(totalWords / 175));

  const ROBOT_BLOCKLIST = /Albert|Bad News|Bahh|Bells|Boing|Bubbles|Cellos|Compact|Eddy|Flo|Fred|Good News|Grandma|Grandpa|Jester|Junior|Organ|Ralph|Reed|Rocko|Sandy|Shelley|Superstar|Trinoids|Whisper|Wobble|Zarvox|eSpeak/i;

  const VOICE_TIERS = [
    /Google US English/i,
    /Google UK English (Female|Male)/i,
    /Online \(Natural\)/i,
    /Natural|Neural/i,
    /(Ava|Zoe|Samantha|Daniel|Allison|Evan|Nathan|Serena|Moira).*(Premium|Enhanced)/i,
    /Siri/i,
    /^(Ava|Samantha|Daniel|Serena|Moira|Karen|Tessa|Alex)\b/i
  ];

  const scoreVoice = (v) => {
    let score = 0;
    for (let i = 0; i < VOICE_TIERS.length; i += 1) {
      if (VOICE_TIERS[i].test(v.name)) {
        score += (VOICE_TIERS.length - i) * 20;
        break;
      }
    }
    if (!v.localService) score += 8;
    if (/^en-US/i.test(v.lang)) score += 6;
    else if (/^en-GB/i.test(v.lang)) score += 4;
    return score;
  };

  const getRankedVoices = () => {
    const raw = window.speechSynthesis.getVoices() || [];
    return raw
      .filter((v) => /^en[-_]/i.test(v.lang) && !ROBOT_BLOCKLIST.test(v.name))
      .sort((a, b) => scoreVoice(b) - scoreVoice(a));
  };

  const normalizeForSpeech = (rawText) => {
    let t = (rawText || '').replace(/\s+/g, ' ').trim();
    t = t.replace(/\s*→\s*/g, ' to ').replace(/[↗↘↖↙]/g, '');
    t = t.replace(/\b(\d+)\s*TB\b/gi, '$1 terabytes');
    t = t.replace(/\b(\d+)\s*GB\b/gi, '$1 gigabytes');
    t = t.replace(/\s+>\s+/g, ' over ');
    const letters = t.replace(/[^a-zA-Z]/g, '');
    const uppers = t.replace(/[^A-Z]/g, '');
    if (letters.length >= 10 && uppers.length / letters.length > 0.78) {
      t = t.toLowerCase().replace(/(^\s*|[.!?]\s+)([a-z])/g, (_, p1, p2) => p1 + p2.toUpperCase());
      t = t.replace(/\bi\b/g, 'I').replace(/\bi'm\b/g, "I'm").replace(/\bi've\b/g, "I've").replace(/\bi'll\b/g, "I'll");
    }
    return t;
  };

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'lb-listen-trigger';
  trigger.setAttribute('aria-expanded', 'false');
  trigger.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="6 4 20 12 6 20 6 4"/></svg><span>Listen · ${mins} min</span>`;
  mountListenTrigger(trigger);

  const bar = document.createElement('div');
  bar.className = 'lb-audio-bar';
  bar.hidden = true;
  bar.setAttribute('role', 'region');
  bar.setAttribute('aria-label', 'Audio reader');
  bar.innerHTML = `
    <div class="lb-audio-controls">
      <button type="button" class="lb-audio-btn lb-audio-btn--icon" data-lb-prev aria-label="Previous paragraph" title="Previous paragraph">‹</button>
      <button type="button" class="lb-audio-btn lb-audio-btn--play" data-lb-play>Play</button>
      <button type="button" class="lb-audio-btn lb-audio-btn--icon" data-lb-next aria-label="Next paragraph" title="Next paragraph">›</button>
    </div>
    <div class="lb-audio-progress">
      <div class="lb-audio-meta">
        <span data-lb-status>Ready · ${mins} min</span>
        <span data-lb-step>1 / ${blocks.length}</span>
      </div>
      <div class="lb-audio-track" data-lb-track role="slider" aria-label="Reading position" aria-valuemin="1" aria-valuemax="${blocks.length}" aria-valuenow="1" tabindex="0">
        <div class="lb-audio-fill" data-lb-fill></div>
      </div>
    </div>
    <select class="lb-audio-voice" data-lb-voice aria-label="Narrator voice" title="Choose narrator voice"></select>
    <button type="button" class="lb-audio-btn" data-lb-speed aria-label="Playback speed" title="Playback speed">${speedLabels[speedIdx]}</button>
    <button type="button" class="lb-audio-btn lb-audio-btn--icon" data-lb-close aria-label="Close audio reader" title="Close">✕</button>
  `;
  document.body.appendChild(bar);

  const prevBtn = bar.querySelector('[data-lb-prev]');
  const playBtn = bar.querySelector('[data-lb-play]');
  const nextBtn = bar.querySelector('[data-lb-next]');
  const speedBtn = bar.querySelector('[data-lb-speed]');
  const closeBtn = bar.querySelector('[data-lb-close]');
  const voiceSelect = bar.querySelector('[data-lb-voice]');
  const statusEl = bar.querySelector('[data-lb-status]');
  const stepEl = bar.querySelector('[data-lb-step]');
  const fillEl = bar.querySelector('[data-lb-fill]');
  const trackEl = bar.querySelector('[data-lb-track]');

  let voices = [];
  let selectedVoice = null;
  let idx = 0;
  let playing = false;
  let pauseTimer = null;
  let speakToken = 0;

  const shortVoiceName = (name) => name
    .replace(/^Google\s+/i, 'Google ')
    .replace(/^Microsoft\s+/i, '')
    .replace(/\s+Online\s+\(Natural\).*$/i, ' (Natural)')
    .replace(/\s+\(Enhanced\)/i, ' · HD')
    .replace(/\s+\(Premium\)/i, ' · HD')
    .slice(0, 22);

  const populateVoices = () => {
    voices = getRankedVoices();
    if (!voices.length) { voiceSelect.hidden = true; return; }
    voiceSelect.hidden = false;
    let savedName = '';
    try { savedName = localStorage.getItem(VOICE_KEY) || ''; } catch (_) {}

    const topVoices = voices.slice(0, 12);
    voiceSelect.innerHTML = '';
    topVoices.forEach((v) => {
      const opt = document.createElement('option');
      opt.value = v.name;
      opt.textContent = shortVoiceName(v.name);
      voiceSelect.appendChild(opt);
    });

    const matched = topVoices.find((v) => v.name === savedName) || topVoices[0];
    selectedVoice = matched;
    voiceSelect.value = matched.name;
  };

  populateVoices();
  setTimeout(populateVoices, 180);
  setTimeout(populateVoices, 700);
  if (typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
    window.speechSynthesis.onvoiceschanged = populateVoices;
  }

  voiceSelect.addEventListener('change', () => {
    const picked = voices.find((v) => v.name === voiceSelect.value);
    if (picked) {
      selectedVoice = picked;
      try { localStorage.setItem(VOICE_KEY, picked.name); } catch (_) {}
      if (playing) speakCurrent();
    }
  });

  const clearHighlight = () => blocks.forEach((b) => b.classList.remove('lb-reading-active'));

  const updateUI = () => {
    playBtn.textContent = playing ? 'Pause' : 'Play';
    speedBtn.textContent = speedLabels[speedIdx];
    const currentStep = Math.min(idx + 1, blocks.length);
    stepEl.textContent = `${currentStep} / ${blocks.length}`;
    trackEl.setAttribute('aria-valuenow', String(currentStep));
    const pct = blocks.length > 0 ? Math.round(((idx + (playing ? 1 : 0)) / blocks.length) * 100) : 0;
    fillEl.style.width = `${Math.min(100, pct)}%`;
    prevBtn.disabled = idx <= 0;
    nextBtn.disabled = idx >= blocks.length - 1;
    statusEl.textContent = playing
      ? 'Listening'
      : (idx >= blocks.length ? 'Finished' : `Paused · ${mins} min`);
  };

  const stopSpeech = () => {
    speakToken += 1;
    clearTimeout(pauseTimer);
    window.speechSynthesis.cancel();
  };

  const speakCurrent = () => {
    stopSpeech();
    const myToken = speakToken;
    if (idx >= blocks.length) {
      playing = false;
      clearHighlight();
      updateUI();
      return;
    }

    const el = blocks[idx];
    clearHighlight();
    el.classList.add('lb-reading-active');
    el.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'center'
    });

    const text = normalizeForSpeech(el.innerText || '');
    if (!text) { idx += 1; speakCurrent(); return; }

    const utter = new SpeechSynthesisUtterance(text);
    if (!selectedVoice) populateVoices();
    if (selectedVoice) utter.voice = selectedVoice;
    utter.rate = speeds[speedIdx];
    utter.pitch = el.classList.contains('machine') ? 0.94 : 0.99;

    utter.onend = () => {
      if (!playing || myToken !== speakToken) return;
      const isHeading = /^H[23]$/.test(el.tagName);
      const isPauseHeavy = el.classList.contains('machine') || el.classList.contains('pullquote');
      const gapMs = isHeading ? 480 : (isPauseHeavy ? 380 : 250);
      idx += 1;
      updateUI();
      pauseTimer = setTimeout(() => {
        if (playing && myToken === speakToken) speakCurrent();
      }, gapMs);
    };

    utter.onerror = (ev) => {
      if (myToken !== speakToken) return;
      if (ev && (ev.error === 'interrupted' || ev.error === 'canceled')) return;
      playing = false;
      updateUI();
    };

    updateUI();
    window.speechSynthesis.speak(utter);
  };

  const togglePlay = () => {
    if (playing) {
      playing = false;
      stopSpeech();
      updateUI();
    } else {
      if (idx >= blocks.length) idx = 0;
      playing = true;
      speakCurrent();
    }
  };

  blocks.forEach((b, i) => {
    b.addEventListener('click', () => {
      if (bar.hidden) return;
      const sel = window.getSelection();
      if (sel && !sel.isCollapsed) return;
      idx = i;
      playing = true;
      speakCurrent();
    });
  });

  trigger.addEventListener('click', () => {
    bar.hidden = false;
    document.body.classList.add('lb-audio-open');
    trigger.setAttribute('aria-expanded', 'true');
    if (!playing) togglePlay();
  });

  playBtn.addEventListener('click', togglePlay);
  prevBtn.addEventListener('click', () => {
    idx = Math.max(0, Math.min(idx, blocks.length - 1) - 1);
    if (playing) speakCurrent();
    else {
      clearHighlight();
      blocks[idx].classList.add('lb-reading-active');
      blocks[idx].scrollIntoView({ behavior: 'smooth', block: 'center' });
      updateUI();
    }
  });
  nextBtn.addEventListener('click', () => {
    idx = Math.min(blocks.length - 1, idx + 1);
    if (playing) speakCurrent();
    else {
      clearHighlight();
      blocks[idx].classList.add('lb-reading-active');
      blocks[idx].scrollIntoView({ behavior: 'smooth', block: 'center' });
      updateUI();
    }
  });
  trackEl.addEventListener('click', (e) => {
    const rect = trackEl.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    idx = Math.min(blocks.length - 1, Math.floor(ratio * blocks.length));
    if (playing) speakCurrent();
    else {
      clearHighlight();
      blocks[idx].classList.add('lb-reading-active');
      updateUI();
    }
  });
  speedBtn.addEventListener('click', () => {
    speedIdx = (speedIdx + 1) % speeds.length;
    try { localStorage.setItem(SPEED_KEY, String(speedIdx)); } catch (_) {}
    if (playing) speakCurrent();
    else updateUI();
  });
  closeBtn.addEventListener('click', () => {
    playing = false;
    stopSpeech();
    clearHighlight();
    bar.hidden = true;
    document.body.classList.remove('lb-audio-open');
    trigger.setAttribute('aria-expanded', 'false');
    updateUI();
  });
  document.addEventListener('keydown', (e) => {
    if (bar.hidden || e.code !== 'Space') return;
    const tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || tag === 'BUTTON' || e.target?.isContentEditable) return;
    e.preventDefault();
    togglePlay();
  });

  updateUI();
  window.addEventListener('beforeunload', () => stopSpeech());
})();
