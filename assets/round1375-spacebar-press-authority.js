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

/* Round 1714 — front-lip-only route-key press + footer-style label flash.
   Do not move the whole key. CSS moves only ::before (the front mechanical lip).
   Keep the flash visible for a short minimum interval on quick taps. */
(() => {
  'use strict';
  const selector = [
    '#home-route-buttons .ah-unified-spacebar',
    '#learning-route-buttons .ah-unified-spacebar',
    '#who-we-help-solutions .ah-unified-spacebar',
    'body[data-ah-mobile-surface="home"] main#main-content .route-label.ah-unified-spacebar',
    'body[data-ah-mobile-surface="learning"] main#main-content .route-label.ah-unified-spacebar',
    'body[data-ah-mobile-surface="industries"] main#main-content .route-label.ah-unified-spacebar'
  ].join(',');

  const MIN_FLASH_MS = 120;
  let active = null;
  let pressedAt = 0;
  let releaseTimer = 0;

  const clearReleaseTimer = () => {
    if (!releaseTimer) return;
    window.clearTimeout(releaseTimer);
    releaseTimer = 0;
  };

  const finishRelease = (control) => {
    if (!control) return;
    control.removeAttribute('data-ah-1714-pressed');
    control.removeAttribute('data-ah-1709-pressed');
    if (active === control) active = null;
  };

  const release = (control, immediate = false) => {
    if (!control) return;
    clearReleaseTimer();
    const elapsed = performance.now() - pressedAt;
    const wait = immediate ? 0 : Math.max(0, MIN_FLASH_MS - elapsed);
    if (wait > 0) {
      releaseTimer = window.setTimeout(() => {
        releaseTimer = 0;
        finishRelease(control);
      }, wait);
    } else {
      finishRelease(control);
    }
  };

  const press = (control) => {
    if (!control || active === control) return;
    if (active) release(active, true);
    clearReleaseTimer();
    active = control;
    pressedAt = performance.now();
    control.removeAttribute('data-ah-1709-pressed');
    control.setAttribute('data-ah-1714-pressed','1');
  };

  const closestControl = (event) => {
    const target = event.target;
    return target instanceof Element ? target.closest(selector) : null;
  };

  window.addEventListener('pointerdown', (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    const control = closestControl(event);
    if (control) press(control);
  }, true);
  window.addEventListener('pointerup', () => { if (active) release(active); }, true);
  window.addEventListener('pointercancel', () => { if (active) release(active, true); }, true);
  window.addEventListener('blur', () => { if (active) release(active, true); }, true);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && active) release(active, true);
  });

  window.addEventListener('keydown', (event) => {
    if (event.repeat || (event.key !== 'Enter' && event.key !== ' ')) return;
    const control = closestControl(event);
    if (control) press(control);
  }, true);
  window.addEventListener('keyup', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const control = closestControl(event) || active;
    if (control) release(control);
  }, true);
})();
