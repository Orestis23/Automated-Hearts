/* Round 1169 — keep the clicked footer control down until the destination is ready. */
(() => {
  'use strict';
  const root = document.documentElement;
  let held = null;
  let confirmed = false;
  let failsafe = 0;

  const isFooterLink = (node) => {
    const el = node && typeof node.closest === 'function'
      ? node.closest('footer#site-footer a[data-nav], body > nav.footer a[href]')
      : null;
    if (!el) return null;
    const href = el.getAttribute('href') || '';
    if (!href || href.startsWith('#')) return null;
    return el;
  };

  const apply = (link) => {
    if (!link) return;
    if (held && held !== link) held.removeAttribute('data-ah-footer-loading');
    held = link;
    confirmed = false;
    link.setAttribute('data-ah-footer-loading','1');
    link.classList.add('is-nav-pressed','is-pressed');
    link.setAttribute('aria-pressed','true');
    root.classList.add('ah-footer-navigation-loading');
    clearTimeout(failsafe);
    /* If navigation is cancelled by the browser or an extension, never leave
       the current control latched forever. Real navigation normally completes
       far sooner and is released by ah:persistent-route-complete/page load. */
    failsafe = setTimeout(release, 20000);
  };

  function release(){
    clearTimeout(failsafe);
    document.querySelectorAll('[data-ah-footer-loading="1"]').forEach((link) => {
      link.removeAttribute('data-ah-footer-loading');
      link.classList.remove('is-nav-pressed','is-pressed');
      link.setAttribute('aria-pressed','false');
      try { if (document.activeElement === link) link.blur(); } catch (_) {}
    });
    root.classList.remove('ah-footer-navigation-loading');
    held = null;
    confirmed = false;
  }

  document.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    const link = isFooterLink(event.target);
    if (!link) return;
    apply(link);
  }, true);

  document.addEventListener('click', (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = isFooterLink(event.target);
    if (!link) return;
    if (held !== link) apply(link);
    confirmed = true;
  }, true);

  document.addEventListener('pointercancel', () => {
    if (!confirmed) release();
  }, true);

  /* Persistent shell route completion is the exact moment requested for the
     hardware to rise again. Full-document navigation naturally destroys the
     old pressed DOM and the new page starts released. */
  addEventListener('ah:persistent-route-complete', release);
  addEventListener('pageshow', (event) => { if (event.persisted) release(); });

  /* Direct loads should always begin with neutral controls. */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', release, {once:true});
  } else {
    release();
  }
})();
