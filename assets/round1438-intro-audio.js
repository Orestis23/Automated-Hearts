/* Automated Hearts Round 1438 — mechanical intro keys + shield-top full audio with final 0.5s fade. */
(() => {
  'use strict';
  if (window.__AH_INTRO_AUDIO_1438) return;
  window.__AH_INTRO_AUDIO_1438 = true;

  const SHIELD_TOP_AUDIO = './assets/shield-first-rise-round1437.mp3?v=1438r';
  const KEY_SOURCES = [1,2,3,4,5].map(n => `./assets/intro-mechanical-key-${n}-round1438.wav?v=1438r`);
  const DELETE_SOURCES = [1,2].map(n => `./assets/intro-mechanical-delete-${n}-round1438.wav?v=1438r`);
  const SHIELD_VOLUME = 0.72;
  const FINAL_FADE_SECONDS = 0.5;

  let shieldAudio = null;
  let shieldPlayed = false;
  let fadeRaf = 0;
  let typePool = [];
  let deletePool = [];
  let lastType = -1;
  let lastDelete = -1;

  function makeAudio(src, volume, preload='auto') {
    try {
      const a = new Audio(src);
      a.preload = preload;
      a.volume = volume;
      return a;
    } catch (_) { return null; }
  }

  function buildPool(sources, copiesEach, volume) {
    const pool = [];
    sources.forEach(src => {
      for (let i=0; i<copiesEach; i++) {
        const a = makeAudio(src, volume);
        if (a) pool.push(a);
      }
    });
    return pool;
  }

  function ensure() {
    if (!shieldAudio) shieldAudio = makeAudio(SHIELD_TOP_AUDIO, SHIELD_VOLUME);
    if (!typePool.length) typePool = buildPool(KEY_SOURCES, 2, .25);
    if (!deletePool.length) deletePool = buildPool(DELETE_SOURCES, 2, .28);
  }

  function pickDifferent(pool, lastIndex) {
    if (!pool.length) return [-1, null];
    let idx = Math.floor(Math.random()*pool.length);
    if (pool.length > 1 && idx === lastIndex) idx = (idx + 1 + Math.floor(Math.random()*(pool.length-1))) % pool.length;
    return [idx, pool[idx]];
  }

  function playKey(kind) {
    ensure();
    const isDelete = kind === 'delete';
    const pool = isDelete ? deletePool : typePool;
    const last = isDelete ? lastDelete : lastType;
    const [idx, a] = pickDifferent(pool, last);
    if (!a) return;
    if (isDelete) lastDelete = idx; else lastType = idx;
    try {
      a.pause();
      a.currentTime = 0;
      // Small level/rate differences keep repeated letters from sounding like one copied tick.
      a.volume = isDelete ? (.25 + Math.random()*.045) : (.215 + Math.random()*.045);
      a.playbackRate = isDelete ? (.96 + Math.random()*.07) : (.94 + Math.random()*.12);
      const p = a.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    } catch (_) {}
  }

  window.__AHIntroKeySound = (kind='type') => playKey(kind);

  function stopShieldAudio() {
    if (fadeRaf) cancelAnimationFrame(fadeRaf);
    fadeRaf = 0;
    if (!shieldAudio) return;
    try { shieldAudio.volume = 0; shieldAudio.pause(); } catch (_) {}
  }

  function monitorFinalFade() {
    if (!shieldAudio || shieldAudio.paused) return;
    const duration = Number.isFinite(shieldAudio.duration) ? shieldAudio.duration : 0;
    if (duration > 0) {
      const fadeStart = Math.max(0, duration - FINAL_FADE_SECONDS);
      if (shieldAudio.currentTime >= fadeStart) {
        const remaining = Math.max(0, duration - shieldAudio.currentTime);
        const gain = Math.min(1, remaining / FINAL_FADE_SECONDS);
        try { shieldAudio.volume = SHIELD_VOLUME * gain; } catch (_) {}
      } else {
        try { shieldAudio.volume = SHIELD_VOLUME; } catch (_) {}
      }
    }
    if (!shieldAudio.ended) fadeRaf = requestAnimationFrame(monitorFinalFade);
  }

  function playAtShieldTop() {
    if (shieldPlayed) return;
    shieldPlayed = true;
    ensure();
    if (!shieldAudio) return;
    try {
      shieldAudio.pause();
      shieldAudio.currentTime = 0;
      shieldAudio.volume = SHIELD_VOLUME;
      const p = shieldAudio.play();
      if (p && typeof p.then === 'function') {
        p.then(() => { fadeRaf = requestAnimationFrame(monitorFinalFade); }).catch(() => {});
      } else {
        fadeRaf = requestAnimationFrame(monitorFinalFade);
      }
    } catch (_) {}
  }

  // IMPORTANT: first-intro-finished is dispatched only after the shield's upward
  // transition has completed and it has reached its fully raised/top position.
  // The full 5.4s clip begins here; only its final 0.5s is faded.
  window.addEventListener('ah:first-intro-finished', playAtShieldTop, {once:true, passive:true});

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ensure, {once:true, passive:true});
  else ensure();
})();
