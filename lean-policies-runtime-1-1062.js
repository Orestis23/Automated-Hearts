/* Automated Hearts Round 1062 lean deferred runtime. */

/* SOURCE: round942-runtime-performance.js */
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
    addEventListener('resize', schedule, { passive: true });
  }

  /* Runtime cache. Service workers require HTTPS (localhost is also allowed).
     Register during the first idle slot instead of waiting for every image and
     model, so later model requests can reuse cache sooner. */
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    const register = () => navigator.serviceWorker.register('./ah-sw.js?v=1098', { scope: './' }).catch(() => {});
    if ('requestIdleCallback' in window) requestIdleCallback(register, { timeout: 1800 });
    else window.setTimeout(register, 500);
  }
})();

;
/* SOURCE: round947-footer-hover.js */
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
/* SOURCE: round976-batch.js */
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
/* SOURCE: round990-batch.js */
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

  function controlFooterHoverBloom(){
    document.querySelectorAll('footer#site-footer nav#primary-nav').forEach(nav=>{
      if(nav.dataset.r990BloomReady==='1') return;
      nav.dataset.r990BloomReady='1';
      const buttons=()=>nav.querySelectorAll('a.footer-structure-control.mechanical-send-control[data-nav]');
      const hot=()=>buttons().forEach(b=>{
        b.style.setProperty('filter','brightness(1.10) saturate(1.06) contrast(1.02)','important');
        b.style.setProperty('box-shadow','none','important');
      });
      const cool=()=>buttons().forEach(b=>{
        b.style.setProperty('filter','none','important');
        b.style.setProperty('box-shadow','none','important');
      });
      nav.addEventListener('pointerenter',hot,{passive:true});
      nav.addEventListener('pointerleave',cool,{passive:true});
      nav.addEventListener('focusin',hot);
      nav.addEventListener('focusout',function(e){ if(!nav.contains(e.relatedTarget)) cool(); });
    });
  }

  function run(){
    fitProcessHeaders();
    controlFooterHoverBloom();
  }

  let resizeTimer=0;
  function queue(){ clearTimeout(resizeTimer); resizeTimer=setTimeout(run,80); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run,{once:true}); else run();
  addEventListener('load',run,{once:true});
  addEventListener('pageshow',run);
  addEventListener('resize',queue,{passive:true});
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(run).catch(function(){});
})();

;
/* SOURCE: round992-mobile-header-persistent-footer.js */
(function(){
  'use strict';
  const mq = window.matchMedia('(max-width:760px)');
  const pageNames = {
    home: 'Hub',
    pricing: 'Services',
    solutions: 'Solution',
    'who-we-help': 'Industries'
  };
  const navNames = {
    home: 'Hub',
    pricing: 'Services',
    solutions: 'Solution',
    'who-we-help': 'Industries'
  };

  function remember(el){
    if(!el || el.dataset.r992FullText) return;
    el.dataset.r992FullText = (el.textContent || '').trim();
    if(el.hasAttribute('data-text')) el.dataset.r992FullDataText = el.getAttribute('data-text') || '';
  }

  function fit(el, min, max){
    if(!el) return;
    const parent = el.parentElement;
    if(!parent) return;
    const pcs = getComputedStyle(parent);
    const available = parent.clientWidth - (parseFloat(pcs.paddingLeft)||0) - (parseFloat(pcs.paddingRight)||0) - 4;
    if(!(available > 0)) return;
    el.style.setProperty('font-size', max + 'px', 'important');
    el.style.setProperty('white-space', 'nowrap', 'important');
    let lo=min, hi=max, best=min;
    for(let i=0;i<14;i++){
      const mid=(lo+hi)/2;
      el.style.setProperty('font-size', mid+'px', 'important');
      if(el.scrollWidth <= available){ best=mid; lo=mid; } else { hi=mid; }
    }
    el.style.setProperty('font-size', best.toFixed(2)+'px', 'important');
  }

  function apply(){
    const mobile = mq.matches;
    const page = document.body && document.body.dataset.page;
    document.querySelectorAll('.rim-page-name-screen.header-page-screen--top .footer-page-led, .rim-page-name-screen.header-page-screen--top .header-page-led').forEach((el)=>{
      remember(el);
      const full = el.dataset.r992FullText || '';
      const shown = mobile && pageNames[page] ? pageNames[page] : full;
      el.textContent = shown;
      if(el.hasAttribute('data-text')) el.setAttribute('data-text', shown);
      el.style.removeProperty('font-size');
    });

    document.querySelectorAll('#primary-nav a[data-nav] .footer-nav-label').forEach((el)=>{
      remember(el);
      const a = el.closest('a[data-nav]');
      const key = a && a.getAttribute('data-nav');
      const full = el.dataset.r992FullText || '';
      el.textContent = mobile && navNames[key] ? navNames[key] : full;
      if(mobile) fit(el, 6.2, 9.5);
      else el.style.removeProperty('font-size');
    });

    document.querySelectorAll('footer#site-footer').forEach((footer)=>{
      footer.classList.remove('r972-mobile-nav-open');
    });
  }

  function runSoon(){ requestAnimationFrame(apply); }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', runSoon, {once:true});
  else runSoon();
  addEventListener('load', runSoon, {once:true});
  addEventListener('pageshow', runSoon);
  addEventListener('resize', runSoon, {passive:true});
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(runSoon).catch(function(){});
})();

;
/* SOURCE: round993-mobile-footer-label-fit.js */
(function(){
  'use strict';
  const mq = window.matchMedia('(max-width:760px)');
  const mobileLabels = {
    home: ['Hub'],
    solutions: ['Solution'],
    'who-we-help': ['Industries'],
    learning: ['Learning','Center'],
    about: ['About','Us'],
    pricing: ['Services']
  };

  function storeOriginal(el){
    if(!el || el.dataset.r993OriginalText) return;
    el.dataset.r993OriginalText = (el.dataset.r992FullText || el.textContent || '').trim();
  }

  function renderMobile(el, words){
    el.textContent='';
    el.classList.toggle('r993-two-line', words.length > 1);
    el.classList.toggle('r993-one-line', words.length === 1);
    if(words.length > 1){
      words.forEach(function(word){
        const span=document.createElement('span');
        span.textContent=word;
        el.appendChild(span);
      });
    } else {
      el.textContent=words[0] || '';
    }
  }

  function fit(el, minPx, maxPx){
    if(!el) return;
    const parent=el.closest('.send-control-copy') || el.parentElement;
    if(!parent) return;
    const cs=getComputedStyle(parent);
    const availW=parent.clientWidth-(parseFloat(cs.paddingLeft)||0)-(parseFloat(cs.paddingRight)||0)-2;
    const availH=parent.clientHeight-(parseFloat(cs.paddingTop)||0)-(parseFloat(cs.paddingBottom)||0)-2;
    if(availW<=0 || availH<=0) return;
    let lo=minPx, hi=maxPx, best=minPx;
    for(let i=0;i<16;i++){
      const mid=(lo+hi)/2;
      el.style.setProperty('font-size',mid+'px','important');
      const fits=el.scrollWidth<=availW+0.5 && el.scrollHeight<=availH+0.5;
      if(fits){ best=mid; lo=mid; } else { hi=mid; }
    }
    el.style.setProperty('font-size',best.toFixed(2)+'px','important');
  }

  function apply(){
    document.querySelectorAll('#primary-nav a[data-nav] .footer-nav-label').forEach(function(el){
      storeOriginal(el);
      const a=el.closest('a[data-nav]');
      const key=a && a.getAttribute('data-nav');
      if(mq.matches){
        const words=mobileLabels[key] || [el.dataset.r993OriginalText || ''];
        renderMobile(el,words);
        requestAnimationFrame(function(){
          /* Largest clean size per individual button. Two-line labels can be larger. */
          fit(el, 9, words.length>1 ? 18 : 19);
        });
      } else {
        el.classList.remove('r993-two-line','r993-one-line');
        el.textContent=el.dataset.r993OriginalText || '';
        el.style.removeProperty('font-size');
      }
    });
  }

  function run(){ requestAnimationFrame(apply); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run,{once:true}); else run();
  addEventListener('load',run,{once:true});
  addEventListener('pageshow',run);
  addEventListener('resize',run,{passive:true});
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(run).catch(function(){});
})();

;