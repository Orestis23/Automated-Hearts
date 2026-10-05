/* Round 1201 — mobile/desktop navigation press reliability.
   Physical button feedback is intentionally brief and is never tied to page
   loading. The persistent shell router is the sole navigation authority. */
(() => {
  'use strict';
  let held = null;
  let timer = 0;

  const footerLink = (node) => node && typeof node.closest === 'function'
    ? node.closest('footer#site-footer a[data-nav], body > nav.footer a[href]')
    : null;

  const clear = () => {
    clearTimeout(timer);
    document.documentElement.classList.remove('ah-footer-navigation-loading');
    document.querySelectorAll('footer#site-footer a[data-nav], body > nav.footer a[href]').forEach((link) => {
      link.removeAttribute('data-ah-footer-loading');
      link.removeAttribute('data-ah-control-pressed');
      link.classList.remove('is-nav-pressed','is-pressed','is-route-pressed');
      link.setAttribute('aria-pressed','false');
    });
    held = null;
  };

  const press = (link) => {
    clear();
    if (!link) return;
    const href = (link.getAttribute('href') || '').trim();
    if (!href || href.startsWith('#')) return;
    held = link;
    link.setAttribute('data-ah-footer-loading','1');
    link.setAttribute('data-ah-control-pressed','1');
    link.classList.add('is-nav-pressed','is-pressed');
    link.setAttribute('aria-pressed','true');
    document.documentElement.classList.add('ah-footer-navigation-loading');
    timer = setTimeout(clear, 360);
  };

  document.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    const link = footerLink(event.target);
    if (link) press(link);
  }, true);

  document.addEventListener('pointerup', () => setTimeout(clear, 90), true);
  document.addEventListener('pointercancel', clear, true);
  document.addEventListener('scroll', clear, {passive:true, capture:true});
  window.addEventListener('blur', clear, {passive:true});
  window.addEventListener('pagehide', clear, {passive:true});
  document.addEventListener('visibilitychange', () => { if (document.hidden) clear(); }, {passive:true});
  addEventListener('ah:persistent-route-complete', clear);
  addEventListener('pageshow', clear);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', clear, {once:true});
  else clear();
})();
