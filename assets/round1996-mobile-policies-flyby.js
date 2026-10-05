/* Automated Hearts Round 1996 — mobile About/Policies shield flyby parity.
   This page sits outside the persistent primary-route shell, so its footer uses the
   same shield artwork and motion before a normal document navigation. */
(() => {
  'use strict';
  if (!matchMedia('(max-width:900px)').matches) return;

  const footerLinks = () => Array.from(document.querySelectorAll('body > nav.footer a[href]'));
  if (!footerLinks().length) return;

  const directions = ['left','up','down','right'];
  const sweeps = {
    right:{start:'translate3d(-105%,0,0)',end:'translate3d(105%,0,0)'},
    left:{start:'translate3d(105%,0,0)',end:'translate3d(-105%,0,0)'},
    up:{start:'translate3d(0,105%,0)',end:'translate3d(0,-105%,0)'},
    down:{start:'translate3d(0,-105%,0)',end:'translate3d(0,105%,0)'}
  };
  const duration = 1520;
  let active = false;
  let panel = null;

  const identify = () => {
    footerLinks().forEach((link,index) => {
      if (!link.dataset.ahShieldDirection) link.dataset.ahShieldDirection = directions[index % directions.length];
    });
  };

  const ensure = () => {
    if (panel?.isConnected) return panel;
    const wrap = document.createElement('div');
    wrap.id = 'ah1996-mobile-document-shield';
    wrap.setAttribute('aria-hidden','true');
    wrap.style.cssText = [
      'position:fixed','z-index:2147483200',
      'top:var(--ah77-shell-top,62px)',
      'right:0',
      'bottom:calc(var(--ah77-shell-bottom,74px) + env(safe-area-inset-bottom,0px))',
      'left:0','overflow:hidden','border-radius:18px','pointer-events:none'
    ].join(';');
    panel = document.createElement('div');
    panel.id = 'ah1996-mobile-document-shield-panel';
    panel.style.cssText = [
      'position:absolute','inset:0','width:100%','height:100%','box-sizing:border-box',
      'overflow:hidden','border:1.5px solid rgba(214,178,87,.90)','border-radius:18px',
      "background:#02070c url('./assets/honeycomb-mobile-continuous-2245.webp') center/cover no-repeat",
      'box-shadow:inset 0 0 0 2px rgba(24,12,2,.94),inset 0 0 0 3px rgba(255,238,186,.18),inset 0 0 8px rgba(214,178,87,.18)',
      'will-change:transform','backface-visibility:hidden','transform-style:preserve-3d','contain:paint'
    ].join(';');
    wrap.appendChild(panel);
    document.body.appendChild(wrap);
    return panel;
  };

  const flyThenNavigate = async (link) => {
    if (active) return;
    active = true;
    identify();
    const direction = sweeps[link.dataset.ahShieldDirection] ? link.dataset.ahShieldDirection : 'right';
    const sweep = sweeps[direction];
    const horizontal = direction === 'left' || direction === 'right';
    const p = ensure();
    p.style.width = horizontal ? '116%' : '100%';
    p.style.height = horizontal ? '100%' : '116%';
    p.style.left = horizontal ? '-8%' : '0';
    p.style.top = horizontal ? '0' : '-8%';
    p.style.right = 'auto';
    p.style.bottom = 'auto';
    p.style.transition = 'none';
    p.style.transform = sweep.start;
    p.style.webkitTransform = sweep.start;
    void p.offsetHeight;
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    try {
      if (typeof p.animate === 'function') {
        const motion = p.animate([{transform:sweep.start},{transform:sweep.end}], {
          duration, easing:'linear', fill:'forwards'
        });
        await motion.finished.catch(()=>{});
      } else {
        p.style.transition = `transform ${duration}ms linear`;
        p.style.transform = sweep.end;
        p.style.webkitTransform = sweep.end;
        await new Promise(resolve => setTimeout(resolve,duration));
      }
    } finally {
      location.assign(link.href);
    }
  };

  identify();

  // Warm the likely next document without starting any visual motion.
  const prefetch = (link) => {
    try {
      if (link.dataset.ah1996Prefetched === '1') return;
      link.dataset.ah1996Prefetched = '1';
      const l = document.createElement('link');
      l.rel = 'prefetch';
      l.as = 'document';
      l.href = link.href;
      document.head.appendChild(l);
    } catch (_) {}
  };
  document.addEventListener('pointerover', e => {
    const link = e.target?.closest?.('body > nav.footer a[href]');
    if (link) prefetch(link);
  }, {passive:true,capture:true});
  document.addEventListener('touchstart', e => {
    const link = e.target?.closest?.('body > nav.footer a[href]');
    if (link) prefetch(link);
  }, {passive:true,capture:true});

  document.addEventListener('click', event => {
    if (active || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target?.closest?.('body > nav.footer a[href]');
    if (!link || link.target === '_blank' || link.hasAttribute('download')) return;
    let url;
    try { url = new URL(link.href, location.href); } catch (_) { return; }
    if (url.origin !== location.origin && location.protocol !== 'file:') return;
    event.preventDefault();
    event.stopImmediatePropagation();
    flyThenNavigate(link);
  }, true);
})();
