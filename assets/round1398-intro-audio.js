/* Automated Hearts Round 1398 — intro keyboard clicks + shield-clear impact. */
(() => {
  'use strict';
  if (window.__AH_INTRO_AUDIO_1398) return;
  window.__AH_INTRO_AUDIO_1398 = true;

  const IMPACT = './assets/shield-open-complete-round1397.mp3';
  const KEY = './assets/intro-key-click-round1398.wav';
  const DEL = './assets/intro-key-delete-round1398.wav';
  let impact = null;
  let impactPlayed = false;
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
    if (!impact) impact = makeAudio(IMPACT, .58);
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
      // Tiny volume variation keeps repeated clicks from sounding synthetic.
      a.volume = kind === 'delete' ? (.20 + Math.random()*.035) : (.17 + Math.random()*.035);
      const p = a.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    } catch (_) {}
  }

  window.__AHIntroKeySound = (kind='type') => {
    if (kind === 'delete') playFrom(deletePool, 'delete');
    else playFrom(typePool, 'type');
  };

  function playImpact() {
    if (impactPlayed) return;
    impactPlayed = true;
    ensure();
    if (!impact) return;
    try {
      impact.currentTime = 0;
      const p = impact.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    } catch (_) {}
  }

  function upperGoldBoundary() {
    // Desktop: the visible upper edge of the inner gold rim.
    const gold = document.querySelector('body > .ah-persistent-gold-rim');
    if (gold) {
      const r = gold.getBoundingClientRect();
      if (Number.isFinite(r.top) && r.top >= 0) return r.top + 2;
    }
    // Mobile: the lower edge of the top shell/rim is the point the shield must clear.
    const topShell = document.querySelector('body > .shell-edge.t');
    if (topShell) {
      const r = topShell.getBoundingClientRect();
      if (Number.isFinite(r.bottom) && r.bottom > 0) return r.bottom;
    }
    return Math.max(18, Math.min(96, innerHeight * .08));
  }

  function watchShieldClear(intro) {
    if (!intro || impactPlayed) return;
    const threshold = upperGoldBoundary();
    const start = performance.now();
    const tick = () => {
      if (impactPlayed || !intro.isConnected) return;
      const rect = intro.getBoundingClientRect();
      if (rect.bottom <= threshold + 1) {
        playImpact();
        return;
      }
      if (performance.now() - start < 3600) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  window.addEventListener('ah:first-intro-raising', (e) => {
    watchShieldClear(e?.detail?.intro || document.getElementById('site-first-visit-intro') || document.getElementById('first-visit-intro'));
  }, {passive:true});

  // Safety fallback only. The intended trigger is the exact rim-crossing watcher above.
  window.addEventListener('ah:first-intro-finished', () => { if (!impactPlayed) playImpact(); }, {once:true, passive:true});

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ensure, {once:true, passive:true});
  else ensure();
})();
