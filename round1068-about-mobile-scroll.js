/* Round 1068: preserve About as the shell's real vertical scroll container on mobile.
   This only reasserts geometry/scroll properties; it does not intercept touch events. */
(() => {
  'use strict';
  if (document.body?.dataset?.page !== 'about') return;
  const main = document.getElementById('main-content');
  if (!main) return;
  const enforce = () => {
    main.style.setProperty('position','fixed','important');
    main.style.setProperty('width','auto','important');
    main.style.setProperty('height','auto','important');
    main.style.setProperty('min-height','0','important');
    main.style.setProperty('max-height','none','important');
    main.style.setProperty('overflow-x','hidden','important');
    main.style.setProperty('overflow-y','auto','important');
    main.style.setProperty('touch-action','pan-y pinch-zoom','important');
    main.style.setProperty('-webkit-overflow-scrolling','touch','important');
  };
  enforce();
  addEventListener('pageshow', enforce, {passive:true});
  addEventListener('resize', enforce, {passive:true});
  document.addEventListener('visibilitychange', () => { if (!document.hidden) enforce(); }, {passive:true});
})();
