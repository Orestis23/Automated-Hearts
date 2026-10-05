/* Round 1375/1376 — images are visual only; only the keyboard/spacebar controls may react. */
(() => {
  'use strict';
  const imageSelector = '.ah-route-image-visual, .premium-route-card__image-button, .learning-medallion-button, .route-media';
  const cancelIfImage = (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const imageVisual = target.closest(imageSelector);
    if (!imageVisual) return;
    event.preventDefault();
    event.stopPropagation();
    if (typeof event.stopImmediatePropagation === 'function') event.stopImmediatePropagation();
  };
  ['pointerdown','pointerup','mousedown','mouseup','touchstart','touchend','click','auxclick','dblclick'].forEach(type => {
    window.addEventListener(type, cancelIfImage, true);
  });

  const inertify = () => {
    document.querySelectorAll(imageSelector).forEach((el) => {
      try { el.setAttribute('aria-hidden', 'true'); } catch (_) {}
      try { el.setAttribute('tabindex', '-1'); } catch (_) {}
      try { el.style.pointerEvents = 'none'; } catch (_) {}
      if (el.tagName && el.tagName.toLowerCase() === 'a') {
        try { el.removeAttribute('href'); } catch (_) {}
      }
    });
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inertify, { once:true });
  } else {
    inertify();
  }
})();
