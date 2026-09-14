/* Automated Hearts Round 1437 — intro keyboard clicks + first-rise audio fade. */
(() => {
  'use strict';
  if (window.__AH_INTRO_AUDIO_1437) return;
  window.__AH_INTRO_AUDIO_1437 = true;

  const RISE = './assets/shield-first-rise-round1437.mp3?v=1437r';
  const KEY = './assets/intro-key-click-round1398.wav';
  const DEL = './assets/intro-key-delete-round1398.wav';
  const RISE_MS = 3000;
  const START_VOLUME = 0.72;

  let riseAudio = null;
  let risePlayed = false;
  let fadeRaf = 0;
  let typePool = [];
  let deletePool = [];
  let typeIndex = 0;
  let deleteIndex = 0;

  function makeAudio(src, volume, preload='auto') {
    try {
      const a = new Audio(src);
      a.preload = preload;
      a.volume = volume;
      return a;
    } catch (_) { return null; }
  }

  function ensure() {
    if (!riseAudio) riseAudio = makeAudio(RISE, START_VOLUME);
    if (!typePool.length) typePool = Array.from({length:5}, () => makeAudio(KEY, .20)).filter(Boolean);
    if (!deletePool.length) deletePool = Array.from({length:3}, () => makeAudio(DEL, .23)).filter(Boolean);
  }

  function playFrom(pool, kind) {
    ensure();
    if (!pool.length) return;
    const idx = kind === 'delete' ? deleteIndex++ : typeIndex++;
    const a = pool[idx % pool.length];
    if (!a) return;
    try {
      a.pause();
      a.currentTime = 0;
      a.volume = kind === 'delete' ? (.20 + Math.random()*.035) : (.17 + Math.random()*.035);
      const p = a.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    } catch (_) {}
  }

  window.__AHIntroKeySound = (kind='type') => {
    if (kind === 'delete') playFrom(deletePool, 'delete');
    else playFrom(typePool, 'type');
  };

  function stopRiseAudio() {
    if (fadeRaf) cancelAnimationFrame(fadeRaf);
    fadeRaf = 0;
    if (!riseAudio) return;
    try {
      riseAudio.volume = 0;
      riseAudio.pause();
    } catch (_) {}
  }

  function playRiseFade() {
    if (risePlayed) return;
    risePlayed = true;
    ensure();
    if (!riseAudio) return;

    try {
      riseAudio.pause();
      riseAudio.currentTime = 0;
      riseAudio.volume = START_VOLUME;
      const startedAt = performance.now();
      const p = riseAudio.play();

      const fade = (now) => {
        const elapsed = Math.max(0, now - startedAt);
        const progress = Math.min(1, elapsed / RISE_MS);
        // Smooth, audible decay that reaches true silence exactly at shield-top.
        const gain = Math.pow(1 - progress, 1.45);
        try { riseAudio.volume = Math.max(0, Math.min(1, START_VOLUME * gain)); } catch (_) {}
        if (progress < 1) fadeRaf = requestAnimationFrame(fade);
        else stopRiseAudio();
      };

      if (p && typeof p.then === 'function') {
        p.then(() => { fadeRaf = requestAnimationFrame(fade); }).catch(() => {});
      } else {
        fadeRaf = requestAnimationFrame(fade);
      }
    } catch (_) {}
  }

  // This event fires immediately after the first typed-heart shield receives
  // its is-raising class. The shield transition is 3000 ms, so this fade ends
  // at the same moment the shield reaches its fully raised/top position.
  window.addEventListener('ah:first-intro-raising', playRiseFade, {once:true, passive:true});
  window.addEventListener('ah:first-intro-finished', stopRiseAudio, {once:true, passive:true});

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ensure, {once:true, passive:true});
  else ensure();
})();
