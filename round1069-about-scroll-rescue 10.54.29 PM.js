/* Automated Hearts Round 1069 — About scroll rescue.
   Reasserts one touch-scrollable main container after legacy shell/runtime callbacks. */
(() => {
  'use strict';
  const body = document.body;
  if (!body || body.dataset.page !== 'about') return;
  const main = document.getElementById('main-content');
  if (!main) return;

  const set = (name, value) => main.style.setProperty(name, value, 'important');
  const enforce = () => {
    set('position','fixed');
    set('width','auto');
    set('min-width','0');
    set('max-width','none');
    set('height','auto');
    set('min-height','0');
    set('max-height','none');
    set('overflow-x','hidden');
    set('overflow-y','scroll');
    set('overscroll-behavior-y','auto');
    set('touch-action','pan-y');
    set('-webkit-overflow-scrolling','touch');
    set('pointer-events','auto');
    set('contain','none');
  };

  enforce();
  requestAnimationFrame(enforce);
  setTimeout(enforce, 0);
  setTimeout(enforce, 250);
  addEventListener('pageshow', enforce, {passive:true});
  addEventListener('resize', enforce, {passive:true});
  if (window.visualViewport) window.visualViewport.addEventListener('resize', enforce, {passive:true});
  document.addEventListener('visibilitychange', () => { if (!document.hidden) enforce(); }, {passive:true});

  /* Expanding the policy increases the same main scroller; never create a second
     internal scroll surface and keep the summary in view after the height change. */
  const policy = document.getElementById('policies');
  if (policy) {
    policy.addEventListener('toggle', () => {
      enforce();
      if (policy.open) requestAnimationFrame(() => {
        const summary = policy.querySelector(':scope > summary');
        if (!summary) return;
        const mainRect = main.getBoundingClientRect();
        const sumRect = summary.getBoundingClientRect();
        if (sumRect.top < mainRect.top + 8 || sumRect.bottom > mainRect.bottom - 8) {
          summary.scrollIntoView({block:'nearest',behavior:'auto'});
        }
      });
    });
  }
})();
