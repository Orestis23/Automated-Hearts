/* Automated Hearts Round 1062 lean deferred runtime. */

/* Round 942 — lightweight runtime performance controller.
   - Stops hidden/offscreen WebGL iframes via a viewport activity signal.
   - Stops all embedded animation work when the tab is hidden.
   - Registers the zero-cost runtime cache service worker when HTTPS/localhost permits it.
   This does not alter render quality, DPR, geometry, textures, lighting, or animation timing. */
(() => {
  'use strict';

  const FRAME_SELECTOR = [
    'iframe.home-hero-engine-embed',
    'iframe.solutions-engine-model-embed',
    '.learning-lesson-slide > iframe',
    '.shared-model-carousel-stage iframe'
  ].join(',');

  const states = new WeakMap();
  const frames = () => Array.from(document.querySelectorAll(FRAME_SELECTOR));

  const allowedByActiveStage = (frame) => {
    const root = document.documentElement;
    if (root.dataset.pageShieldMotion === '1') return false;
    if (root.dataset.pageShieldState && root.dataset.pageShieldState !== 'open') return false;
    const stage = frame.closest('#learning-model-stage, #who-help-model-stage');
    if (!stage) return true;
    const slide = frame.closest('.learning-lesson-slide, [data-shared-slide]');
    /* Round 1063: the selected model is allowed to compile/render behind a fully
       closed leather shield. This is the loading buffer that prevents a deadlock
       between first-frame readiness and the visible shield reveal. */
    if (stage.dataset.modelPreparing === '1') return !slide || slide.classList.contains('is-active');
    if (stage.dataset.shieldMotion === '1' || !stage.classList.contains('is-learning-shield-open')) return false;
    return !slide || slide.classList.contains('is-active');
  };

  const sendViewportState = (frame, visible) => {
    if (!frame?.contentWindow) return;
    const next = !!visible && !document.hidden && allowedByActiveStage(frame);
    const prior = states.get(frame);
    if (prior === next) return;
    states.set(frame, next);
    try {
      frame.contentWindow.postMessage({
        type: 'automated-hearts:viewport-activity',
        active: next
      }, '*');
    } catch (_) {}
  };

  const rectVisible = (frame) => {
    const r = frame.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && r.bottom > -160 && r.top < innerHeight + 160 && r.right > 0 && r.left < innerWidth;
  };

  let observer = null;
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        sendViewportState(entry.target, entry.isIntersecting && entry.intersectionRatio > 0);
      }
    }, {
      root: null,
      rootMargin: '180px 0px 180px 0px',
      threshold: [0, 0.001]
    });
  }

  const registerFrame = (frame) => {
    if (!frame || frame.dataset.ahRuntimeObserved === '1') return;
    frame.dataset.ahRuntimeObserved = '1';
    if (observer) observer.observe(frame);
    else sendViewportState(frame, rectVisible(frame));
    frame.addEventListener('load', () => {
      states.delete(frame);
      sendViewportState(frame, observer ? rectVisible(frame) : rectVisible(frame));
    }, { passive: true });
  };

  const scan = () => frames().forEach(registerFrame);
  scan();

  /* Some lesson iframes are hydrated later. Observe only DOM additions, not attributes,
     so this remains nearly free after startup. */
  if ('MutationObserver' in window) {
    const mo = new MutationObserver((records) => {
      let needsScan = false;
      for (const record of records) {
        if (record.addedNodes?.length) { needsScan = true; break; }
      }
      if (needsScan) scan();
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }

  const resync = () => {
    for (const frame of frames()) {
      states.delete(frame);
      sendViewportState(frame, rectVisible(frame));
    }
  };
  document.addEventListener('visibilitychange', resync, { passive: true });
  window.addEventListener('pageshow', resync, { passive: true });
  window.addEventListener('ah:page-shield-open', resync, { passive: true });
  window.addEventListener('ah:local-shield-state', resync, { passive: true });

  /* Fallback visibility sync is throttled to one animation frame and is only used
     when IntersectionObserver is unavailable. */
  if (!observer) {
    let raf = 0;
    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => { raf = 0; resync(); });
    };
    addEventListener('scroll', schedule, { passive: true });
    (window.AHResponsive?window.AHResponsive.watch(schedule):window.addEventListener('resize',schedule,{passive:true}));
  }
})();

;
(() => {
  'use strict';
  const footer = document.getElementById('site-footer');
  const nav = document.getElementById('primary-nav');
  if (!footer || !nav || footer.dataset.r947HoverBound === '1') return;
  const buttons = [...nav.querySelectorAll('a.footer-structure-control[data-nav]')];
  if (!buttons.length) return;
  footer.dataset.r947HoverBound = '1';

  const sync = () => {
    const hot = buttons.some((button) => button.matches(':hover') || button === document.activeElement || button.contains(document.activeElement));
    footer.classList.toggle('r947-footer-hot', hot);
  };
  buttons.forEach((button) => {
    button.addEventListener('pointerenter', () => footer.classList.add('r947-footer-hot'), {passive:true});
    button.addEventListener('pointerleave', () => requestAnimationFrame(sync), {passive:true});
    button.addEventListener('focus', () => footer.classList.add('r947-footer-hot'), {passive:true});
    button.addEventListener('blur', () => requestAnimationFrame(sync), {passive:true});
  });
  nav.addEventListener('pointerleave', () => requestAnimationFrame(sync), {passive:true});
})();

;
(()=>{'use strict';
  const hydrateRolodex=()=>{const f=document.getElementById('home-machine-rolodex');if(f&&!f.src&&f.dataset.src)f.src=f.dataset.src};
  const init=()=>{
    const primary=document.getElementById('home-machine-primary');
    if(primary){
      let loaded=false;
      primary.addEventListener('load',()=>{loaded=true;primary.classList.add('r976-model-ready')},{once:true});
    }
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

;
(function(){
  'use strict';

  function fitTextToWidth(el, minPx, maxPx, targetRatio){
    if(!el || !el.isConnected) return;
    const parent=el.parentElement;
    if(!parent) return;
    const cs=getComputedStyle(parent);
    const available=parent.clientWidth - parseFloat(cs.paddingLeft||0) - parseFloat(cs.paddingRight||0);
    if(!(available>0)) return;
    el.style.setProperty('font-size',maxPx+'px','important');
    el.style.setProperty('white-space','nowrap','important');
    let lo=minPx, hi=maxPx, best=minPx;
    const target=available*(targetRatio||.94);
    for(let i=0;i<14;i++){
      const mid=(lo+hi)/2;
      el.style.setProperty('font-size',mid+'px','important');
      const width=el.scrollWidth;
      if(width<=target){ best=mid; lo=mid; } else { hi=mid; }
    }
    el.style.setProperty('font-size',best.toFixed(2)+'px','important');
  }

  function fitProcessHeaders(){
    document.querySelectorAll('#home-solution-framework .negative-software-grid-round344 > article.home-process-stage:not(.home-process-stage--key) > h3')
      .forEach(el=>fitTextToWidth(el,11,22,.98));
  }

  function fitMobilePageNames(){
    if(!matchMedia('(max-width:760px)').matches) return;
    document.querySelectorAll('.rim-page-name-screen.header-page-screen--top').forEach(screen=>{
      screen.style.setProperty('left','50%','important');
      screen.style.setProperty('right','auto','important');
      screen.style.setProperty('width','min(70vw, 300px)','important');
      screen.style.setProperty('min-width','min(70vw, 300px)','important');
      screen.style.setProperty('max-width','min(70vw, 300px)','important');
      screen.style.setProperty('height','48px','important');
      screen.style.setProperty('min-height','48px','important');
      screen.style.setProperty('max-height','48px','important');
      screen.style.setProperty('transform','translateX(-50%)','important');
      screen.querySelectorAll('.footer-page-led,.header-page-led').forEach(el=>fitTextToWidth(el,8,20,.94));
    });
  }

  function controlFooterHoverBloom(){/* Round 2108: persistent footer paint is CSS-owned. */}

  function run(){
    fitProcessHeaders();
    controlFooterHoverBloom();
  }

  let resizeTimer=0;
  function queue(){ clearTimeout(resizeTimer); resizeTimer=setTimeout(run,80); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run,{once:true}); else run();
  addEventListener('load',run,{once:true});
  addEventListener('pageshow',run);
  (window.AHResponsive?window.AHResponsive.watch(queue):window.addEventListener('resize',queue,{passive:true}));
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(run).catch(function(){});
})();

;
/* Round 1017 — route every site/model contact action into the built-in Messages drawer. */
(() => {
  'use strict';
  if (window.__ahContactRouter1017) return;
  window.__ahContactRouter1017 = true;

  function openMessages(detail = {}) {
    const trigger = document.getElementById('header-send-message') || document.querySelector('[data-contact-trigger]');
    if (!trigger) return false;

    // If the drawer is already open, leave it open instead of toggling it closed.
    if (trigger.getAttribute('aria-expanded') !== 'true' && !trigger.classList.contains('is-contact-latched')) {
      trigger.click();
    }

    // Optionally carry context from a service/model contact point into an empty message box.
    const service = detail && typeof detail.service === 'string' ? detail.service.trim() : '';
    if (service) {
      requestAnimationFrame(() => {
        const field = document.querySelector('.nav-contact-panel textarea[name="message"]');
        if (field && !field.value.trim()) field.value = `I'm interested in: ${service}`;
      });
    }
    return true;
  }

  window.AutomatedHeartsOpenContact = openMessages;

  // Contact controls inside same-origin 3D model iframes use postMessage so they
  // open the parent page's built-in form instead of email or a new tab.
  window.addEventListener('message', (event) => {
    const data = event.data || {};
    if (data.type !== 'automated-hearts:open-contact') return;
    openMessages({ service: data.service || data.source || '' });
  });

  // No mailto/contact link on the site should launch an external mail client.
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link) return;
    const href = (link.getAttribute('href') || '').trim();
    const isMail = /^mailto:/i.test(href);
    const isPlainContactHash = href === '#contact' && !link.hasAttribute('data-contact-trigger');
    if (!isMail && !isPlainContactHash) return;
    event.preventDefault();
    event.stopPropagation();
    openMessages({ service: link.getAttribute('data-ah-contact') || link.textContent.trim() || 'Contact' });
  }, true);
})();

;
(() => {
  'use strict';

  const IMPORTANT = 'important';
  const set = (el, prop, value) => {
    if (el) el.style.setProperty(prop, value, IMPORTANT);
  };

  function naturalize(el) {
    if (!el) return;
    set(el, 'height', 'auto');
    set(el, 'min-height', '0');
    set(el, 'max-height', 'none');
    set(el, 'overflow', 'visible');
    set(el, 'overflow-x', 'visible');
    set(el, 'overflow-y', 'visible');
    set(el, 'clip-path', 'none');
  }

  function applyRatesLayout() {
    const body = document.body;
    if (!body || body.dataset.page !== 'pricing') return;

    const main = document.getElementById('main-content');
    const root = main?.querySelector(':scope > .r864-rates');
    const towers = root?.querySelector(':scope > .r864-rates__drawers.r984-rates-towers');
    const automation = document.getElementById('r864-ai');
    const web = document.getElementById('r864-web');
    if (!main || !root || !towers || !automation || !web) return;

    // The page scrolls; the individual service towers never do.
    set(main, 'overflow-x', 'hidden');
    set(main, 'overflow-y', 'auto');
    set(main, '-webkit-overflow-scrolling', 'touch');
    naturalize(root);
    naturalize(towers);

    const desktop = window.matchMedia('(min-width: 761px)').matches;
    set(towers, 'position', 'relative');
    set(towers, 'display', 'grid');
    set(towers, 'grid-template-columns', desktop ? 'minmax(0, 1fr) minmax(0, 1fr)' : 'minmax(0, 1fr)');
    set(towers, 'grid-template-rows', desktop ? 'auto' : 'auto auto');
    set(towers, 'grid-auto-flow', 'row');
    set(towers, 'align-items', 'start');
    set(towers, 'justify-items', 'stretch');
    set(towers, 'gap', desktop ? 'clamp(24px, 2.5vw, 44px)' : '24px');
    set(towers, 'width', desktop ? 'min(calc(100% - 32px), 1720px)' : 'calc(100% - 18px)');
    set(towers, 'max-width', desktop ? '1720px' : 'none');
    set(towers, 'margin-left', 'auto');
    set(towers, 'margin-right', 'auto');
    set(towers, 'visibility', 'visible');
    set(towers, 'opacity', '1');

    [[automation, 1], [web, 2]].forEach(([tower, order]) => {
      naturalize(tower);
      set(tower, 'position', 'relative');
      set(tower, 'inset', 'auto');
      set(tower, 'display', 'flex');
      set(tower, 'flex-direction', 'column');
      set(tower, 'width', '100%');
      set(tower, 'min-width', '0');
      set(tower, 'max-width', 'none');
      set(tower, 'margin', '0');
      set(tower, 'visibility', 'visible');
      set(tower, 'opacity', '1');
      set(tower, 'transform', 'none');
      set(tower, 'pointer-events', 'auto');
      set(tower, 'order', String(order));
      set(tower, 'grid-column', desktop ? String(order) : '1');
      set(tower, 'grid-row', desktop ? '1' : String(order));

      tower.querySelectorAll('.r864-rates__drawer-body, .r966-service-list, .r951-rates__card-grid, .r983-retainer-panel, .r983-retainer-grid, .r966-service-card, .r983-retainer-card')
        .forEach((el) => naturalize(el));

      const bodyPanel = tower.querySelector(':scope > .r864-rates__drawer-body');
      set(bodyPanel, 'display', 'block');
      set(bodyPanel, 'flex', 'none');
      set(bodyPanel, 'width', '100%');

      const serviceList = tower.querySelector('.r966-service-list');
      set(serviceList, 'display', 'grid');
      set(serviceList, 'grid-template-columns', 'minmax(0, 1fr)');
      set(serviceList, 'grid-auto-rows', 'auto');
      set(serviceList, 'grid-auto-flow', 'row');
      set(serviceList, 'width', '100%');

      const retainer = tower.querySelector(':scope > .r983-retainer-panel');
      set(retainer, 'display', 'block');
      set(retainer, 'flex', 'none');

      const retainerGrid = tower.querySelector('.r983-retainer-grid');
      set(retainerGrid, 'display', 'grid');
      set(retainerGrid, 'grid-template-columns', 'minmax(0, 1fr)');
      set(retainerGrid, 'grid-auto-rows', 'auto');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyRatesLayout, { once: true });
  } else {
    applyRatesLayout();
  }

  window.addEventListener('load', applyRatesLayout, { once: true });
  (window.AHResponsive?window.AHResponsive.watch(applyRatesLayout):window.addEventListener('resize',applyRatesLayout,{passive:true}));
})();

;
(function(){
  'use strict';
  const mq = window.matchMedia('(max-width:760px)');
  const small = window.matchMedia('(max-width:374px)');
  const props = ['position','top','left','right','bottom','width','min-width','max-width','height','min-height','max-height','margin','padding','transform','translate'];
  let applying = false;
  function setI(el,p,v){ el.style.setProperty(p,v,'important'); }
  function clear(el){ props.forEach(p=>el.style.removeProperty(p)); }
  function apply(){
    const heart = document.getElementById('rim-heart-home');
    if(!heart || applying) return;
    applying = true;
    if(!mq.matches){
      clear(heart);
      applying = false;
      return;
    }
    const compact = small.matches;
    setI(heart,'position','fixed');
    setI(heart,'top','0px');
    setI(heart,'left',compact ? '-3px' : '-4px');
    setI(heart,'right','auto');
    setI(heart,'bottom','auto');
    const w = compact ? '70px' : '74px';
    const h = compact ? '78px' : '83px';
    setI(heart,'width',w); setI(heart,'min-width',w); setI(heart,'max-width',w);
    setI(heart,'height',h); setI(heart,'min-height',h); setI(heart,'max-height',h);
    setI(heart,'margin','0px');
    setI(heart,'padding','0px');
    setI(heart,'transform','none');
    setI(heart,'translate','none');
    applying = false;
  }
  function schedule(){
    apply();
    requestAnimationFrame(apply);
    setTimeout(apply,0);
    setTimeout(apply,80);
    setTimeout(apply,300);
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded',schedule,{once:true});
  else schedule();
  window.addEventListener('pageshow',schedule);
  (window.AHResponsive?window.AHResponsive.watch(schedule):window.addEventListener('resize',schedule,{passive:true}));
  window.addEventListener('orientationchange',schedule,{passive:true});
  try{ mq.addEventListener('change',schedule); small.addEventListener('change',schedule); }
  catch(e){ try{ mq.addListener(schedule); small.addListener(schedule); }catch(_){} }
  const startObserver=()=>{
    const heart=document.getElementById('rim-heart-home');
    if(!heart) return;
    new MutationObserver(()=>{ if(!applying && mq.matches) requestAnimationFrame(apply); })
      .observe(heart,{attributes:true,attributeFilter:['style','class']});
  };
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded',startObserver,{once:true});
  else startObserver();
})();

;
