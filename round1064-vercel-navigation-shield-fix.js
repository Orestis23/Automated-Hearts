/* Automated Hearts Round 1064 — Vercel-safe full-document navigation guard. */
(() => {
  'use strict';
  window.__AH_DISABLE_PERSISTENT_ROUTER = true;

  const root = document.documentElement;
  root.classList.remove('ah-persistent-content-active');
  document.getElementById('ah-persistent-page-frame')?.remove();
  document.getElementById('ah-persistent-route-loading')?.remove();

  /* Any legacy bundle that installed the persistent router before this file loaded
     is neutralized. The established page-shield controller then falls through to
     normal same-origin document navigation after its two-second cover. */
  window.__ahPersistentNavigate = () => false;

  /* A routed arrival must begin fully covered, never animate downward again. */
  if (root.classList.contains('page-shield-arrival')) {
    root.dataset.pageShieldState = 'covered';
    const panel = document.querySelector('#page-transition-shield > .page-transition-shield__panel');
    if (panel) {
      panel.style.setProperty('transform','translate3d(0,0,0)','important');
      panel.style.setProperty('-webkit-transform','translate3d(0,0,0)','important');
    }
  }

  /* Defensive cleanup for BFCache/restores and a stale prior deployment. */
  addEventListener('pageshow', () => {
    root.classList.remove('ah-persistent-content-active');
    document.getElementById('ah-persistent-page-frame')?.remove();
    document.getElementById('ah-persistent-route-loading')?.remove();
    window.__ahPersistentNavigate = () => false;
  });
})();
