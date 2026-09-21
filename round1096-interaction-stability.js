/* Automated Hearts Round 1097 — responsive resize governor and interaction fail-safe.
   Native viewport-resize bursts are collapsed to one settled resize event, embedded
   animation and ResizeObserver work pause while the viewport is changing, and a
   stalled page shield can never leave the live controls covered or unclickable. */
(() => {
  'use strict';
  if (window.__AH1096InteractionStability) return;
  window.__AH1096InteractionStability = 1;

  const root = document.documentElement;
  const RESIZE_SETTLE_MS = 180;
  const ARRIVAL_FAILSAFE_MS = 3200;
  const NAVIGATION_FAILSAFE_MS = 5200;
  let resizeTimer = 0;
  let replayingResize = false;
  const deferredResizeObserverFlushes = new Set();

  /* ResizeObserver callbacks are normally delivered repeatedly while DevTools is
     docking. Preserve each observer's latest native result and deliver it once,
     after the same settled-resize event used by the older page runtimes. */
  if ('ResizeObserver' in window && !window.ResizeObserver.__AH1097Governed) {
    const NativeResizeObserver = window.ResizeObserver;
    const GovernedResizeObserver = function(callback) {
      let latestEntries = null;
      let latestObserver = null;
      let queued = false;
      const flush = () => {
        if (window.__AH_VIEWPORT_RESIZING === true || !queued) return;
        queued = false;
        deferredResizeObserverFlushes.delete(flush);
        const entries = latestEntries;
        const observer = latestObserver;
        latestEntries = null;
        latestObserver = null;
        if (entries) callback(entries, observer);
      };
      const observer = new NativeResizeObserver((entries, nativeObserver) => {
        if (window.__AH_VIEWPORT_RESIZING !== true) {
          callback(entries, nativeObserver);
          return;
        }
        latestEntries = entries;
        latestObserver = nativeObserver;
        queued = true;
        deferredResizeObserverFlushes.add(flush);
      });
      return observer;
    };
    GovernedResizeObserver.prototype = NativeResizeObserver.prototype;
    Object.setPrototypeOf(GovernedResizeObserver, NativeResizeObserver);
    Object.defineProperty(GovernedResizeObserver, '__AH1097Governed', { value:true });
    window.ResizeObserver = GovernedResizeObserver;
  }

  const frameShouldRun = (frame) => {
    if (!frame?.isConnected || frame.hidden) return false;
    const slide = frame.closest('.learning-lesson-slide,[data-shared-slide]');
    if (slide && !slide.classList.contains('is-active')) return false;
    const rect = frame.getBoundingClientRect();
    return rect.width > 1 && rect.height > 1 && rect.bottom > 0 && rect.top < innerHeight;
  };

  const setEmbeddedActivity = (allowVisibleFrames) => {
    document.querySelectorAll('iframe').forEach((frame) => {
      const active = !!allowVisibleFrames && frameShouldRun(frame);
      try {
        frame.contentWindow?.postMessage({ type:'engine-visibility', visible:active }, '*');
        frame.contentWindow?.postMessage({ type:'automated-hearts:learning-activity', active }, '*');
        frame.contentWindow?.postMessage({ type:'automated-hearts:viewport-activity', active }, '*');
      } catch (_) {}
    });
  };

  const finishViewportResize = () => {
    resizeTimer = 0;
    root.classList.remove('ah-viewport-resizing');
    window.__AH_VIEWPORT_RESIZING = false;
    replayingResize = true;
    try { window.dispatchEvent(new Event('resize')); } catch (_) {}
    replayingResize = false;
    requestAnimationFrame(() => {
      [...deferredResizeObserverFlushes].forEach((flush) => {
        try { flush(); } catch (error) { window.setTimeout(() => { throw error; }); }
      });
      setEmbeddedActivity(true);
    });
  };

  const beginViewportResize = (settleMs = RESIZE_SETTLE_MS) => {
    root.classList.add('ah-viewport-resizing');
    window.__AH_VIEWPORT_RESIZING = true;
    setEmbeddedActivity(false);
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(finishViewportResize, settleMs);
  };

  /* This listener is loaded before the accumulated page runtimes. It prevents
     dozens of legacy resize handlers from running on every intermediate pixel
     while DevTools is docking, then replays one resize after the viewport settles. */
  window.addEventListener('resize', (event) => {
    if (replayingResize) return;
    event.stopImmediatePropagation();
    beginViewportResize();
  }, true);

  /* Right-clicking before opening Inspect pauses the expensive canvases before
     Chrome starts resizing and recalculating its developer-tools panes. */
  document.addEventListener('contextmenu', () => beginViewportResize(900), true);

  const shieldIsStale = () => root.classList.contains('page-shield-arrival')
    || root.classList.contains('page-shield-covering')
    || root.classList.contains('page-shield-revealing')
    || root.dataset.pageShieldState === 'covered'
    || root.dataset.pageShieldState === 'covering'
    || root.dataset.pageShieldState === 'revealing';

  const releaseStaleShield = () => {
    if (!shieldIsStale()) return;
    const shield = document.getElementById('page-transition-shield');
    const panel = shield?.querySelector('.page-transition-shield__panel');
    root.classList.remove('page-shield-arrival', 'page-shield-covering', 'page-shield-revealing', 'routed-page-arrival');
    root.dataset.pageShieldState = 'open';
    delete root.dataset.pageShieldMotion;
    if (shield) shield.style.setProperty('pointer-events', 'none', 'important');
    if (panel) {
      panel.getAnimations?.().forEach((animation) => animation.cancel());
      panel.style.setProperty('transition', 'none', 'important');
      panel.style.setProperty('transform', 'translate3d(0,-101.25%,0)', 'important');
      panel.style.setProperty('-webkit-transform', 'translate3d(0,-101.25%,0)', 'important');
      panel.style.setProperty('pointer-events', 'none', 'important');
    }
    document.body?.removeAttribute('aria-busy');
    document.querySelectorAll('.is-route-pressed,.is-route-shielding,.is-nav-pressed').forEach((item) => {
      item.classList.remove('is-route-pressed', 'is-route-shielding', 'is-nav-pressed');
    });
    window.dispatchEvent(new CustomEvent('ah:persistent-route-complete'));
    window.dispatchEvent(new CustomEvent('ah:page-shield-open'));
    setEmbeddedActivity(true);
  };

  const armArrivalFailsafe = () => window.setTimeout(releaseStaleShield, ARRIVAL_FAILSAFE_MS);
  const armNavigationFailsafe = () => window.setTimeout(releaseStaleShield, NAVIGATION_FAILSAFE_MS);

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('page-transition-shield')?.style.setProperty('pointer-events', 'none', 'important');
    if (shieldIsStale()) armArrivalFailsafe();
  }, { once:true });

  document.addEventListener('click', (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
    if (!link || link.hasAttribute('download') || link.hasAttribute('data-contact-trigger')) return;
    let destination;
    try { destination = new URL(link.href, location.href); } catch (_) { return; }
    if (destination.origin === location.origin) armNavigationFailsafe();
  }, true);

  window.addEventListener('pageshow', () => {
    if (shieldIsStale()) armArrivalFailsafe();
  }, { passive:true });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && shieldIsStale()) armArrivalFailsafe();
  }, { passive:true });
})();
