/* Round 1719 — Home combined machine-window selector controls. */
(() => {
  'use strict';

  const init = () => {
    const controls = document.getElementById('home-combined-machine-controls');
    const grid = document.getElementById('home-machine-grid');
    if (!controls || !grid) return;

    const buttons = [...controls.querySelectorAll('.ah1719-machine-selector[data-ah1719-target]')];
    if (!buttons.length) return;

    const targetFrame = (name) => name === 'rolodex'
      ? grid.querySelector('.home-hero-rolodex-frame')
      : grid.querySelector('.home-hero-engine-frame:not(.home-hero-rolodex-frame)');

    const sync = () => {
      buttons.forEach((button) => {
        const frame = targetFrame(button.dataset.ah1719Target || 'primary');
        const shutter = frame?.querySelector('[data-machine-haze]');
        const open = !!(frame?.classList.contains('is-haze-open') || shutter?.getAttribute('aria-expanded') === 'true');
        button.setAttribute('aria-pressed', open ? 'true' : 'false');
      });
    };

    let activePress = null;
    let pressedAt = 0;
    let releaseTimer = 0;
    const minFlash = 120;

    const release = (button, immediate = false) => {
      if (!button) return;
      if (releaseTimer) window.clearTimeout(releaseTimer);
      const wait = immediate ? 0 : Math.max(0, minFlash - (performance.now() - pressedAt));
      releaseTimer = window.setTimeout(() => {
        button.removeAttribute('data-ah-1719-pressed');
        if (activePress === button) activePress = null;
        releaseTimer = 0;
      }, wait);
    };

    const press = (button) => {
      if (activePress && activePress !== button) release(activePress, true);
      activePress = button;
      pressedAt = performance.now();
      button.setAttribute('data-ah-1719-pressed','1');
    };

    controls.addEventListener('pointerdown', (event) => {
      if (event.button !== undefined && event.button !== 0) return;
      const button = event.target.closest('.ah1719-machine-selector');
      if (button) press(button);
    });
    window.addEventListener('pointerup', () => activePress && release(activePress), true);
    window.addEventListener('pointercancel', () => activePress && release(activePress, true), true);

    controls.addEventListener('click', (event) => {
      const button = event.target.closest('.ah1719-machine-selector[data-ah1719-target]');
      if (!button) return;
      const frame = targetFrame(button.dataset.ah1719Target || 'primary');
      const shutter = frame?.querySelector('[data-machine-haze]');
      if (!shutter) return;
      if (!(frame.classList.contains('is-haze-open') || shutter.getAttribute('aria-expanded') === 'true')) {
        shutter.click();
      }
      window.requestAnimationFrame(sync);
      window.setTimeout(sync, 1100);
    });

    buttons.forEach((button) => {
      button.addEventListener('keydown', (event) => {
        if (event.repeat || (event.key !== 'Enter' && event.key !== ' ')) return;
        press(button);
      });
      button.addEventListener('keyup', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        release(button);
      });
    });

    const observer = new MutationObserver(sync);
    grid.querySelectorAll('.home-hero-engine-frame,[data-machine-haze]').forEach((node) => {
      observer.observe(node,{attributes:true,attributeFilter:['class','aria-expanded']});
    });
    sync();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
