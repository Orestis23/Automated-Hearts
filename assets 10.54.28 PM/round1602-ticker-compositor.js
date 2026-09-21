/* Round 1602 — ticker compositor cleanup.
   Keep exactly two identical loops so -50% equals one exact loop width.
   Set duration from measured loop width to keep a calm constant pixel speed
   after the human-spacing increase. */
(() => {
  'use strict';
  const setup = () => {
    document.querySelectorAll('#home-charity-ticker .charity-marquee__track').forEach(track => {
      const loops = Array.from(track.children).filter(el => el.classList && el.classList.contains('charity-marquee__loop'));
      if (loops.length < 2) return;
      loops.slice(2).forEach(el => el.remove());
      const first = loops[0];
      const apply = () => {
        const width = first.getBoundingClientRect().width;
        if (!(width > 0)) return;
        /* ~27 px/sec closely matches the Round-1600 visual pace before spacing doubled. */
        const duration = Math.max(120, Math.min(420, width / 27));
        track.style.setProperty('animation-name', 'ah1602-ticker-compositor', 'important');
        track.style.setProperty('animation-duration', `${duration.toFixed(3)}s`, 'important');
        track.style.setProperty('animation-timing-function', 'linear', 'important');
        track.style.setProperty('animation-iteration-count', 'infinite', 'important');
        track.style.removeProperty('transform');
        track.style.setProperty('will-change', 'transform', 'important');
        track.style.setProperty('backface-visibility', 'hidden', 'important');
        track.style.setProperty('-webkit-backface-visibility', 'hidden', 'important');
      };
      requestAnimationFrame(() => requestAnimationFrame(apply));
      if ('ResizeObserver' in window) {
        const ro = new ResizeObserver(() => requestAnimationFrame(apply));
        ro.observe(first);
      }
    });
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup, {once:true});
  } else {
    setup();
  }
})();
