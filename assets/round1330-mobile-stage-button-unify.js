/* Round 1330 — keep mobile 3D model sections sized to their real content. */
(() => {
  'use strict';
  const sync = () => {
    document.querySelectorAll('#lite-model-stage').forEach((stage) => {
      const section = stage.closest('.lite-section');
      if (section) section.classList.toggle('ah-stage-open', !stage.hidden);
    });
  };
  const boot = () => {
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.body, {
      subtree: true,
      attributes: true,
      attributeFilter: ['hidden', 'style', 'class']
    });
    window.addEventListener('pageshow', sync);
    window.addEventListener('resize', sync, { passive: true });
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
