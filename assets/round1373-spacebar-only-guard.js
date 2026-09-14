/* Round 1373 — route images are visual only. Only the keyboard/spacebar control may activate a route. */
(() => {
  'use strict';
  const imageSelector = '.ah-route-image-visual';
  const guardImageClick = (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (!target.closest(imageSelector)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  };
  /* Register on window in capture phase before the legacy route controllers. */
  window.addEventListener('click', guardImageClick, true);
  window.addEventListener('auxclick', guardImageClick, true);
})();
