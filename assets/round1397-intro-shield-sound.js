/* Automated Hearts Round 1397 — play the supplied impact when the typed first-visit shield finishes rising. */
(() => {
  'use strict';
  if (window.__AH_INTRO_COMPLETE_SOUND_1397) return;
  window.__AH_INTRO_COMPLETE_SOUND_1397 = true;

  const src = './assets/shield-open-complete-round1397.mp3';
  let audio = null;
  let played = false;

  const ensureAudio = () => {
    if (audio) return audio;
    try {
      audio = new Audio(src);
      audio.preload = 'auto';
      audio.volume = 0.58;
      audio.load();
    } catch (_) {}
    return audio;
  };

  const playAtShieldOpenComplete = () => {
    if (played) return;
    played = true;
    const player = ensureAudio();
    if (!player) return;
    try {
      player.currentTime = 0;
      const attempt = player.play();
      if (attempt && typeof attempt.catch === 'function') attempt.catch(() => {});
    } catch (_) {}
  };

  /* Begin fetching during the typing/signature sequence so playback never becomes
     part of the shield's critical rendering path. */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureAudio, { once:true, passive:true });
  } else {
    ensureAudio();
  }

  /* All desktop/mobile first-visit intro implementations dispatch this event only
     after the upward transform has completed (or its safety timeout resolves). */
  window.addEventListener('ah:first-intro-finished', playAtShieldOpenComplete, { once:true });
})();
