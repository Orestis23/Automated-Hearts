/* Automated Hearts Round 1062 lean deferred runtime. */

/* SOURCE: ah-js-bundle-02.js */
(() => {
  'use strict';
  const row=document.getElementById('home-title-fields');
  if(!row) return;
  const labels=['Automated Hearts','Web & Automation','Architecture'];
  const screens=Array.from(row.querySelectorAll(':scope > .home-header-screen'));
  screens.slice(0,3).forEach((screen,index)=>{
    const copy=screen.querySelector('.home-header-led-copy-round346');
    if(!copy) return;
    const text=labels[index];
    copy.textContent=text;
    copy.setAttribute('data-text',text);
    copy.setAttribute('aria-label',text);
    copy.classList.remove('r486-title-glyphs','r959-home-title-formatted');
  });
})();

;
/* Round 976 — primary Home 3D is loaded directly and locally. Defer the secondary Rolodex until after first paint. */
(() => {
  'use strict';
  const rolodex=document.getElementById('home-machine-rolodex');
  const hydrate=(frame)=>{if(!frame||frame.getAttribute('src'))return;const src=frame.dataset.src;if(src)frame.setAttribute('src',src)};
  const schedule=()=>{
    if(!rolodex)return;
    const run=()=>hydrate(rolodex);
    if('requestIdleCallback' in window) requestIdleCallback(run,{timeout:2200});
    else setTimeout(run,1200);
  };
  const primary=document.getElementById('home-machine-primary');
  if(primary) primary.addEventListener('load',()=>setTimeout(schedule,350),{once:true});
  else window.addEventListener('load',schedule,{once:true});
  document.addEventListener('click',e=>{const haze=e.target.closest?.('[data-machine-haze]');if(haze&&haze.closest('.home-hero-rolodex-frame'))hydrate(rolodex)},true);
  setTimeout(schedule,3000);
})();

;
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
/* SOURCE: round998-home-authoritative-fix.js */
(function(){
  'use strict';
  const mobile = window.matchMedia('(max-width:760px)');

  function important(el, prop, value){
    if(el) el.style.setProperty(prop, value, 'important');
  }

  function lockDesktopProcessHeaders(){
    if(mobile.matches) return;
    const headers = Array.from(document.querySelectorAll(
      '#home-solution-framework .negative-software-grid-round344 > article.home-process-stage:not(.home-process-stage--key) > h3'
    ));
    if(headers.length < 4) return;
    /* Use the actual rendered size of the first preceding screen after all legacy fitters run. */
    const firstSize = Math.max(18, parseFloat(getComputedStyle(headers[0]).fontSize) || 18);
    [headers[2], headers[3]].forEach((el)=>{
      important(el,'font-size',firstSize+'px');
      important(el,'font-family','"Share Tech Mono",ui-monospace,"Courier New",monospace');
      important(el,'font-weight','700');
      important(el,'line-height','1');
      important(el,'letter-spacing','0');
    });
  }

  function lockMobileHomeBatch(){
    if(!mobile.matches) return;
    const framework=document.getElementById('home-solution-framework');
    if(!framework) return;

    const consoleEl=framework.querySelector('.home-zero-system-console');
    const heading=framework.querySelector('.home-zero-software-heading');
    const titleStack=framework.querySelector('.r902-mobile-zero-title-stack');
    const processSurface=framework.querySelector('.r504-process-surface');
    const processGrid=framework.querySelector('.negative-software-grid-round344');
    important(consoleEl,'min-height','0px');
    important(consoleEl,'height','auto');
    important(consoleEl,'padding-top','4px');
    important(heading,'margin','0 auto');
    important(heading,'padding','0');
    important(heading,'min-height','0px');
    important(titleStack,'margin','0 auto');
    important(titleStack,'padding','0');
    important(titleStack,'gap','8px');
    important(processSurface,'position','relative');
    important(processSurface,'z-index','10');
    important(processSurface,'margin-top',window.innerWidth<=360?'-125px':'-140px');
    important(processSurface,'padding-top','0');
    important(processSurface,'min-height','0px');
    important(processGrid,'margin-top','0');
    important(processGrid,'padding-top','0');
    important(processGrid,'row-gap','14px');

    const card=framework.querySelector('article.home-process-stage.home-process-stage--key.negative-software-explore-round344');
    const explore=document.getElementById('negative-software-explore');
    const title=explore && explore.querySelector(':scope > h3');
    const quote=explore && explore.querySelector(':scope > .r930-explore-quote');
    const attribution=explore && explore.querySelector(':scope > .r930-explore-attribution');
    const narrow=window.innerWidth<=360;
    const cardWidth=narrow?'95vw':'min(96vw,455px)';
    const cardHeight=narrow?'455px':'500px';
    important(card,'width',cardWidth); important(card,'min-width',cardWidth); important(card,'max-width',cardWidth);
    important(card,'height',cardHeight); important(card,'min-height',cardHeight); important(card,'max-height',cardHeight);
    important(card,'margin','0 auto');
    important(explore,'display','grid'); important(explore,'grid-template-rows','auto minmax(0,1fr) auto');
    important(explore,'width','100%'); important(explore,'min-width','100%'); important(explore,'max-width','100%');
    important(explore,'height','100%'); important(explore,'min-height','100%'); important(explore,'max-height','100%');
    important(explore,'padding','18px 18px 20px'); important(explore,'box-sizing','border-box');
    important(title,'font-size',narrow?'39px':'44px'); important(title,'font-weight','800'); important(title,'line-height','1');
    important(title,'margin','0'); important(title,'padding','0 0 10px'); important(title,'text-align','center');
    important(quote,'width','92%'); important(quote,'max-width','92%'); important(quote,'margin','0'); important(quote,'padding','0');
    important(quote,'font-size',narrow?'25px':'29px'); important(quote,'font-weight','800'); important(quote,'line-height','1.22');
    important(quote,'text-align','left'); important(quote,'transform','none'); important(quote,'align-self','center'); important(quote,'justify-self','center');
    important(attribution,'font-size',narrow?'18px':'20px'); important(attribution,'font-weight','700'); important(attribution,'line-height','1');
    important(attribution,'margin','0'); important(attribution,'padding','0 0 8px'); important(attribution,'transform','none');
    important(attribution,'align-self','end'); important(attribution,'justify-self','center');
  }

  function run(){
    lockDesktopProcessHeaders();
    lockMobileHomeBatch();
  }

  let timer=0;
  function queue(){ clearTimeout(timer); timer=setTimeout(run,40); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run,{once:true}); else run();
  window.addEventListener('load',run,{once:true});
  window.addEventListener('pageshow',run);
  window.addEventListener('resize',queue,{passive:true});
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(run).catch(function(){});
  setTimeout(run,250);
  setTimeout(run,900);
})();

;
/* SOURCE: round999-home-authoritative.js */
(function(){
  'use strict';
  const mobile=window.matchMedia('(max-width:760px)');
  function imp(el,p,v){ if(el) el.style.setProperty(p,v,'important'); }

  function lockMobileProcessHeaders(){
    if(!mobile.matches) return;
    document.querySelectorAll('#home-solution-framework .negative-software-grid-round344 > article.home-process-stage:not(.home-process-stage--key) > h3').forEach(function(h){
      imp(h,'font-size','18px');
      imp(h,'font-family','"Share Tech Mono",ui-monospace,"Courier New",monospace');
      imp(h,'font-weight','700');
      imp(h,'line-height','1');
      imp(h,'letter-spacing','0');
      imp(h,'white-space','nowrap');
      imp(h,'overflow','visible');
    });
  }

  function restoreExploreFootprint(){
    if(!mobile.matches) return;
    const card=document.querySelector('#home-solution-framework article.home-process-stage.home-process-stage--key.negative-software-explore-round344');
    const explore=document.getElementById('negative-software-explore');
    if(!card || !explore) return;
    const narrow=window.innerWidth<=360;
    const w=narrow?'min(86vw,310px)':'min(86vw,330px)';
    const h=narrow?'370px':'390px';
    ['width','min-width','max-width'].forEach(function(p){imp(card,p,w);});
    ['height','min-height','max-height'].forEach(function(p){imp(card,p,h);});
    imp(card,'margin','0 auto');
    ['width','min-width','max-width','height','min-height','max-height'].forEach(function(p){imp(explore,p,'100%');});
    imp(explore,'padding','14px 14px 12px');
    imp(explore,'box-sizing','border-box');
    const title=explore.querySelector(':scope > h3');
    const quote=explore.querySelector(':scope > .r930-explore-quote');
    const attr=explore.querySelector(':scope > .r930-explore-attribution');
    imp(title,'font-size',narrow?'39px':'42px');
    imp(title,'line-height','1');
    imp(title,'margin','0');
    imp(title,'padding','0 0 9px');
    imp(quote,'font-size',narrow?'20px':'25px');
    imp(quote,'line-height','1.24');
    imp(quote,'width','90%'); imp(quote,'max-width','90%');
    imp(quote,'margin','0 auto'); imp(quote,'transform','none');
    imp(attr,'font-size',narrow?'15px':'18px');
    imp(attr,'margin','0 auto'); imp(attr,'padding-bottom','4px'); imp(attr,'transform','none');
  }

  function centerCarousel(){
    const section=document.querySelector('main#main-content > section.home-overview-display-section.home-overview-carousel-section');
    const shell=section && section.querySelector(':scope > .shell');
    const carousel=section && section.querySelector('.home-transition-carousel');
    const track=carousel && carousel.querySelector('.home-transition-track');
    if(!section || !carousel) return;

    /* Round 1026: the carousel is content-height, never viewport-height.
       The horizontal section border to visible carousel content clearance is the
       brand-standard 2/3 CSS inch (64px) on every viewport. */
    imp(section,'height','auto');
    imp(section,'min-height','0');
    imp(section,'max-height','none');
    imp(section,'padding','64px 0');
    imp(section,'display','block');
    imp(section,'place-items','initial');
    imp(section,'align-content','initial');

    if(shell){
      imp(shell,'height','auto');
      imp(shell,'min-height','0');
      imp(shell,'max-height','none');
      imp(shell,'margin','0 auto');
      imp(shell,'padding','0');
      imp(shell,'display','block');
      imp(shell,'place-items','initial');
      imp(shell,'align-content','initial');
    }

    imp(carousel,'position','relative');
    imp(carousel,'height','auto');
    imp(carousel,'min-height','0');
    imp(carousel,'max-height','none');
    imp(carousel,'top','auto');
    imp(carousel,'bottom','auto');
    imp(carousel,'margin','0');
    imp(carousel,'padding-top','0');
    imp(carousel,'padding-bottom','0');
    imp(carousel,'align-self','auto');
    imp(carousel,'justify-self','auto');
    imp(carousel,'transform','none');

    if(track){
      imp(track,'height','auto');
      imp(track,'min-height','0');
      imp(track,'max-height','none');
      imp(track,'margin-top','0');
      imp(track,'margin-bottom','0');
      imp(track,'padding-top','0');
      imp(track,'padding-bottom','0');
      imp(track,'align-items','center');
    }
  }

  function run(){ lockMobileProcessHeaders(); restoreExploreFootprint(); centerCarousel(); }
  let timer=0;
  function queue(){ clearTimeout(timer); timer=setTimeout(run,50); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run,{once:true}); else run();
  window.addEventListener('load',run,{once:true});
  window.addEventListener('pageshow',run);
  window.addEventListener('resize',queue,{passive:true});
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(run).catch(function(){});
  setTimeout(run,300); setTimeout(run,1000); setTimeout(run,1600);
})();

;
/* SOURCE: round1017-contact-router.js */
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
/* SOURCE: round1019-mobile-footer-label-authority.js */
(function(){
  'use strict';
  const mq=window.matchMedia('(max-width:760px)');
  const labels={
    home:'Hub',
    solutions:'The Solution',
    'who-we-help':'Who We Help',
    learning:'Learning Center',
    about:'About Us',
    pricing:'Rates & Services'
  };
  let applying=false;

  function apply(){
    if(applying) return;
    applying=true;
    document.querySelectorAll('#primary-nav a[data-nav] .footer-nav-label').forEach(function(el){
      const a=el.closest('a[data-nav]');
      const key=a && a.getAttribute('data-nav');
      if(!el.dataset.r1019DesktopText){
        el.dataset.r1019DesktopText=(el.dataset.r992FullText || el.dataset.r993OriginalText || el.textContent || '').trim();
      }
      if(mq.matches){
        const wanted=labels[key] || el.dataset.r1019DesktopText;
        if(el.textContent.trim()!==wanted) el.textContent=wanted;
        el.classList.remove('r993-two-line','r993-one-line');
        /* Inline important intentionally wins old mobile fit scripts. Every button is identical. */
        el.style.setProperty('font-size','10px','important');
        el.style.setProperty('line-height','1.08','important');
        el.style.setProperty('letter-spacing','0','important');
        el.style.setProperty('white-space','normal','important');
        el.style.setProperty('word-break','keep-all','important');
        el.style.setProperty('overflow-wrap','normal','important');
      }else{
        const full=el.dataset.r1019DesktopText;
        if(full && el.textContent.trim()!==full) el.textContent=full;
        ['font-size','line-height','letter-spacing','white-space','word-break','overflow-wrap'].forEach(function(p){el.style.removeProperty(p);});
      }
    });
    applying=false;
  }

  function schedule(){ requestAnimationFrame(apply); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',schedule,{once:true}); else schedule();
  addEventListener('load',schedule,{once:true});
  addEventListener('pageshow',schedule);
  addEventListener('resize',schedule,{passive:true});
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(schedule).catch(function(){});

  /* If a legacy fitter rewrites a label after us, immediately put the fixed mobile label back. */
  const observer=new MutationObserver(function(mutations){
    if(!mq.matches || applying) return;
    if(mutations.some(function(m){
      const n=m.target && (m.target.nodeType===1 ? m.target : m.target.parentElement);
      return n && n.closest && n.closest('#primary-nav .footer-nav-label');
    })) schedule();
  });
  if(document.documentElement) observer.observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['style','class']});
})();

;
/* SOURCE: round1033-mobile-heart-learning-runtime.js */
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
  window.addEventListener('resize',schedule,{passive:true});
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
/* SOURCE: round1037-persistent-shell-router.js */
(() => {
  'use strict';

  if (window.__AH_DISABLE_PERSISTENT_ROUTER === true) return;
  const primaryPages = new Map([
    ['index.html', {page:'home', label:'Hub', navLabel:'Hub', href:'./index.html'}],
    ['solutions.html', {page:'solutions', label:'The Solution', navLabel:'The Solution', href:'./solutions.html'}],
    ['who-we-help.html', {page:'who-we-help', label:'Who We Help', navLabel:'Who We Help', href:'./who-we-help.html'}],
    ['learning-center.html', {page:'learning', label:'Learning Center', navLabel:'Learning Center', href:'./learning-center.html'}],
    ['about.html', {page:'about', label:'About Us & Policies', navLabel:'About Us', href:'./about.html'}],
    ['pricing.html', {page:'pricing', label:'Rates & Services', navLabel:'Rates & Services', href:'./pricing.html'}]
  ]);

  const cleanBaseName = (pathname) => {
    const raw = (pathname || '').split('/').pop() || 'index.html';
    return raw === '' ? 'index.html' : raw;
  };
  const isPrimary = (url) => primaryPages.has(cleanBaseName(url.pathname));

  /* Embedded content never navigates itself. It asks the persistent top-level
     shell to change the page under it. */
  if (window.self !== window.top) {
    window.__ahPersistentNavigate = (href) => {
      let url;
      try { url = new URL(href, window.location.href); } catch (_) { return false; }
      if (url.origin !== window.location.origin && window.location.protocol !== 'file:') return false;
      if (!isPrimary(url)) return false;
      window.parent.postMessage({type:'ah:persistent-route', href:url.href}, '*');
      return true;
    };

    /* The existing navigation controller calls __ahPersistentNavigate for all
       primary-page links. Only contact triggers need a bridge here because that
       controller deliberately ignores them. */
    document.addEventListener('click', (event) => {
      const target = event.target;
      const link = target && typeof target.closest === 'function' ? target.closest('a[href]') : null;
      if (!link) return;
      if (link.hasAttribute('data-contact-trigger') || link.getAttribute('href') === '#contact') {
        event.preventDefault();
        event.stopImmediatePropagation();
        window.parent.postMessage({type:'ah:persistent-contact'}, '*');
      }
    }, true);
    return;
  }

  let frame = null;
  let loadingSurface = null;
  let routeToken = 0;
  let currentCleanHref = window.location.href;

  const ensureFrame = () => {
    if (frame?.isConnected) return frame;
    frame = document.createElement('iframe');
    frame.id = 'ah-persistent-page-frame';
    frame.name = 'ah-persistent-page-frame';
    frame.title = 'Automated Hearts page content';
    frame.setAttribute('aria-label', 'Automated Hearts page content');
    frame.setAttribute('allow', 'webgl; fullscreen');
    document.body.appendChild(frame);
    return frame;
  };

  const ensureLoadingSurface = () => {
    if (loadingSurface?.isConnected) return loadingSurface;
    loadingSurface = document.createElement('div');
    loadingSurface.id = 'ah-persistent-route-loading';
    loadingSurface.setAttribute('aria-hidden', 'true');
    loadingSurface.hidden = true;
    document.body.appendChild(loadingSurface);
    return loadingSurface;
  };

  const routeInfo = (url) => primaryPages.get(cleanBaseName(url.pathname)) || null;

  const updateShellText = (url, previousUrl = null) => {
    const info = routeInfo(url);
    if (!info) return;
    const screen = document.querySelector('body > .rim-page-name-screen');
    const label = screen?.querySelector('.footer-page-led,.header-page-led');
    if (screen) screen.setAttribute('aria-label', `Current page: ${info.label}`);
    if (label) {
      label.textContent = info.label;
      label.setAttribute('data-text', info.label);
      label.setAttribute('aria-label', info.label);
    }

    /* The live page never gets a footer button. The existing persistent button
       for the destination is repurposed into the page the visitor just left.
       Hardware stays in the same five physical slots; only that one label/link changes. */
    if (previousUrl) {
      const previousInfo = routeInfo(previousUrl);
      if (previousInfo && previousInfo.page !== info.page) {
        const destinationButton = document.querySelector(`#site-footer a[data-nav="${info.page}"]`);
        if (destinationButton) {
          destinationButton.dataset.nav = previousInfo.page;
          destinationButton.setAttribute('href', previousInfo.href);
          destinationButton.removeAttribute('aria-current');
          destinationButton.classList.remove('is-current-page');
          const buttonLabel = destinationButton.querySelector('.footer-nav-label');
          if (buttonLabel) buttonLabel.textContent = previousInfo.navLabel || previousInfo.label;
          destinationButton.setAttribute('aria-label', previousInfo.navLabel || previousInfo.label);
        }
      }
    }

    /* No visible footer control may represent the live page. */
    document.querySelectorAll('#site-footer a[data-nav]').forEach((link) => {
      link.removeAttribute('aria-current');
      link.classList.remove('is-current-page');
      if (link.dataset.nav === info.page) link.style.display = 'none';
      else link.style.removeProperty('display');
    });
  };

  const revealParentShield = () => {
    try {
      const reveal = window.__ahPersistentShieldReveal;
      if (typeof reveal === 'function') return Promise.resolve(reveal());
    } catch (_) {}
    return Promise.resolve();
  };

  const nextPaint = () => new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  });

  const navigate = (href, options = {}) => {
    let target;
    try { target = new URL(href, window.location.href); } catch (_) { return false; }
    if (target.origin !== window.location.origin && window.location.protocol !== 'file:') return false;
    if (!isPrimary(target)) return false;

    const clean = new URL(target.href);
    clean.searchParams.delete('ah_embed');
    clean.searchParams.delete('ah-route');
    const embedded = new URL(clean.href);
    embedded.searchParams.set('ah_embed','1');

    const f = ensureFrame();
    const surface = ensureLoadingSurface();
    const token = ++routeToken;
    let coverFinished = false;
    let destinationLoaded = false;
    f.style.visibility = 'hidden';
    f.style.pointerEvents = 'none';
    surface.hidden = true;
    surface.classList.remove('is-hiding');

    const showDestination = () => {
      if (token !== routeToken || !coverFinished || !destinationLoaded) return;
      f.style.visibility = 'visible';
      f.style.pointerEvents = 'auto';
      surface.classList.add('is-hiding');
      window.setTimeout(() => {
        if (token !== routeToken) return;
        surface.hidden = true;
        surface.classList.remove('is-hiding');
      }, 180);
    };

    const onLoad = () => {
      if (token !== routeToken) {
        f.removeEventListener('load', onLoad);
        return;
      }
      try {
        const loaded = new URL(f.contentWindow.location.href);
        if (loaded.href === 'about:blank' || loaded.pathname !== embedded.pathname) return;
      } catch (_) {
        /* Same-origin primary routes are expected. If a browser with stricter
           file URL isolation hides location, its load event is still valid. */
      }
      f.removeEventListener('load', onLoad);
      destinationLoaded = true;
      showDestination();
    };
    f.addEventListener('load', onLoad);

    /* Start the destination request before the shield begins travelling. Its
       load event is deliberately not part of the shield timeline. */
    f.src = embedded.href;

    const cover = window.__ahPersistentShieldCover;
    const coverPromise = typeof cover === 'function'
      ? Promise.resolve().then(() => cover())
      : Promise.resolve();

    coverPromise.catch(() => {}).then(async () => {
      if (token !== routeToken) return;
      coverFinished = true;
      document.documentElement.classList.add('ah-persistent-content-active');
      surface.hidden = false;
      const previousCleanHref = currentCleanHref;
      updateShellText(clean, new URL(previousCleanHref));
      currentCleanHref = clean.href;
      if (options.push !== false) {
        try { history.pushState({ahPersistent:true}, '', clean.href); } catch (_) {}
      }
      showDestination();
      await nextPaint();
      if (token !== routeToken) return;
      await revealParentShield();
      if (token !== routeToken) return;
      window.dispatchEvent(new CustomEvent('ah:persistent-route-complete'));
    });
    return true;
  };

  window.__ahPersistentNavigate = (href) => navigate(href, {push:true});

  window.addEventListener('message', (event) => {
    if (!frame || event.source !== frame.contentWindow) return;
    const data = event.data || {};
    if (data.type === 'ah:persistent-route' && typeof data.href === 'string') {
      /* Loading and the parent shield start together; the shield never waits. */
      navigate(data.href, {push:true});
    } else if (data.type === 'ah:persistent-contact') {
      document.getElementById('header-send-message')?.click();
    }
  });

  window.addEventListener('popstate', () => {
    const target = new URL(window.location.href);
    if (!isPrimary(target)) return;
    navigate(target.href, {push:false});
  });

  /* Direct clicks not captured by the older shield router still use the same
     persistent route. Same-document anchors are deliberately left alone. */
  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = event.target;
    const link = target && typeof target.closest === 'function' ? target.closest('a[href]') : null;
    if (!link || link.hasAttribute('download') || link.hasAttribute('data-contact-trigger')) return;
    let url;
    try { url = new URL(link.href, window.location.href); } catch (_) { return; }
    if (!isPrimary(url)) return;
    const samePage = cleanBaseName(url.pathname) === cleanBaseName(window.location.pathname);
    if (samePage && url.hash) return;
    event.preventDefault();
    navigate(url.href, {push:true});
  }, true);

  updateShellText(new URL(currentCleanHref));
})();

;
/* SOURCE: round1040-home-mobile-spacing-runtime.js */
/* Round 1040 runtime guard: inline-important only for Home mobile geometry.
   This defeats legacy high-specificity bundle rules that reassert after load. */
(function(){
  'use strict';
  if (!document.body || document.body.dataset.page !== 'home') return;
  const set = (el, prop, value) => { if (el) el.style.setProperty(prop, value, 'important'); };
  const clear = (el, props) => { if (!el) return; props.forEach(p => el.style.removeProperty(p)); };
  function apply(){
    const mobile = matchMedia('(max-width:760px)').matches;
    const hero = document.getElementById('home-opening-hero');
    const shell = document.getElementById('home-hero-shell');
    const housing = document.getElementById('home-hero-housing');
    const titles = document.getElementById('home-title-fields');
    const machines = document.getElementById('home-machine-grid');
    const route = document.getElementById('home-route-buttons');
    const cards = route ? route.querySelectorAll('article.home-route-card') : [];
    if (!mobile) return;

    [['padding','0'],['margin','0'],['min-height','0'],['height','auto']].forEach(([p,v])=>set(hero,p,v));
    [['padding','0'],['margin','0'],['min-height','0'],['height','auto']].forEach(([p,v])=>set(shell,p,v));
    [['display','flex'],['flex-direction','column'],['align-items','center'],['justify-content','flex-start'],['padding','48px 0 0'],['margin','0'],['gap','48px'],['height','auto'],['min-height','0'],['max-height','none']].forEach(([p,v])=>set(housing,p,v));
    [['position','relative'],['inset','auto'],['order','1'],['margin','0 auto'],['transform','none']].forEach(([p,v])=>set(titles,p,v));
    [['position','relative'],['inset','auto'],['order','2'],['margin','0 auto'],['transform','none']].forEach(([p,v])=>set(machines,p,v));

    if (route){
      const grid = route.querySelector('.home-explore-grid.premium-route-grid');
      [['display','grid'],['grid-template-columns','minmax(0,1fr)'],['gap','32px 0'],['row-gap','32px']].forEach(([p,v])=>set(grid,p,v));
    }
    cards.forEach(card => {
      const image = card.querySelector(':scope > a.premium-route-card__image-button');
      const sign = card.querySelector(':scope > .premium-route-card__title-sign');
      [['display','grid'],['grid-template-columns','minmax(0,1fr)'],['grid-template-rows','auto auto'],['gap','4px 0'],['row-gap','4px'],['height','auto'],['min-height','0'],['max-height','none'],['margin','0 auto'],['padding','0']].forEach(([p,v])=>set(card,p,v));
      [['grid-column','1'],['grid-row','1'],['position','relative'],['inset','auto'],['margin','0'],['transform','none']].forEach(([p,v])=>set(image,p,v));
      [['grid-column','1'],['grid-row','2'],['position','relative'],['inset','auto'],['margin','0 auto'],['transform','none']].forEach(([p,v])=>set(sign,p,v));
    });
  }
  apply();
  document.addEventListener('DOMContentLoaded', apply, {once:true});
  window.addEventListener('pageshow', apply);
  window.addEventListener('resize', apply, {passive:true});
  window.addEventListener('orientationchange', apply, {passive:true});
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(apply).catch(()=>{});
})();

;
/* SOURCE: round1048-mobile-page-name-legibility.js */
(function(){
  'use strict';
  const mq=window.matchMedia('(max-width:760px)');
  const selector='.rim-page-name-screen.header-page-screen--top .footer-page-led, .rim-page-name-screen.header-page-screen--top .header-page-led';

  function fitOne(el){
    if(!el || !mq.matches) return;
    const parent=el.parentElement;
    if(!parent) return;
    const pcs=getComputedStyle(parent);
    const available=parent.clientWidth-(parseFloat(pcs.paddingLeft)||0)-(parseFloat(pcs.paddingRight)||0)-4;
    if(!(available>0)) return;
    const max=window.innerWidth<=374?20:23;
    const min=window.innerWidth<=374?17.5:19;
    el.style.setProperty('font-size',max+'px','important');
    el.style.setProperty('white-space','nowrap','important');
    if(el.scrollWidth<=available) return;
    let lo=min, hi=max, best=min;
    for(let i=0;i<14;i++){
      const mid=(lo+hi)/2;
      el.style.setProperty('font-size',mid+'px','important');
      if(el.scrollWidth<=available){best=mid;lo=mid;}else{hi=mid;}
    }
    el.style.setProperty('font-size',best.toFixed(2)+'px','important');
  }

  function apply(){
    if(!mq.matches) return;
    document.querySelectorAll(selector).forEach(fitOne);
  }
  let raf=0;
  function queue(){ cancelAnimationFrame(raf); raf=requestAnimationFrame(apply); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',queue,{once:true}); else queue();
  addEventListener('load',queue,{once:true});
  addEventListener('pageshow',queue);
  addEventListener('resize',queue,{passive:true});
  addEventListener('orientationchange',queue,{passive:true});
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(queue).catch(function(){});

  const target=document.querySelector('body > .rim-page-name-screen');
  if(target && window.MutationObserver){
    new MutationObserver(queue).observe(target,{subtree:true,childList:true,characterData:true});
  }
})();

;
/* SOURCE: round1049-mobile-footer-label-contained.js */
(function(){
  'use strict';
  var mq=window.matchMedia('(max-width:760px)');
  var full={
    solutions:'The Solution',
    'who-we-help':'Who We Help',
    learning:'Learning Center',
    about:'About Us',
    pricing:'Rates & Services'
  };
  var busy=false;
  function apply(){
    if(!mq.matches || busy) return;
    busy=true;
    document.querySelectorAll('#site-footer #primary-nav a.footer-structure-control[data-nav]').forEach(function(a){
      var key=a.getAttribute('data-nav');
      var label=a.querySelector('.footer-nav-label');
      var copy=a.querySelector('.send-control-copy.footer-control-copy');
      if(!label) return;
      var text=full[key] || (label.textContent||'').trim();
      if(label.textContent.trim()!==text) label.textContent=text;
      label.classList.remove('r993-one-line','r993-two-line');

      /* Win over historical inline !important rules and keep the text inside the actual face. */
      a.style.setProperty('overflow','hidden','important');
      a.style.setProperty('padding','0','important');
      a.style.setProperty('display','flex','important');
      a.style.setProperty('align-items','center','important');
      a.style.setProperty('justify-content','center','important');
      if(copy){
        copy.style.setProperty('position','absolute','important');
        copy.style.setProperty('inset','6px 7px 7px 7px','important');
        copy.style.setProperty('width','auto','important');
        copy.style.setProperty('height','auto','important');
        copy.style.setProperty('padding','0','important');
        copy.style.setProperty('margin','0','important');
        copy.style.setProperty('display','grid','important');
        copy.style.setProperty('place-items','center','important');
        copy.style.setProperty('overflow','hidden','important');
        copy.style.setProperty('transform','none','important');
      }
      [
        ['display','block'],['box-sizing','border-box'],['width','100%'],['min-width','0'],['max-width','100%'],
        ['height','auto'],['max-height','100%'],['margin','0'],['padding','0'],['overflow','hidden'],
        ['font-family','"Orbitron",system-ui,sans-serif'],['font-size','10px'],['font-weight','700'],
        ['line-height','1.08'],['letter-spacing','0'],['text-align','center'],['white-space','normal'],
        ['word-break','normal'],['overflow-wrap','normal'],['hyphens','none'],['text-transform','none']
      ].forEach(function(p){label.style.setProperty(p[0],p[1],'important');});
    });
    busy=false;
  }
  function run(){requestAnimationFrame(apply);}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run,{once:true}); else run();
  addEventListener('load',run,{once:true});
  addEventListener('pageshow',run);
  addEventListener('resize',run,{passive:true});
  addEventListener('orientationchange',run,{passive:true});
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(run).catch(function(){});
  new MutationObserver(function(ms){
    if(!mq.matches||busy) return;
    if(ms.some(function(m){
      var n=m.target&&((m.target.nodeType===1)?m.target:m.target.parentElement);
      return n&&n.closest&&n.closest('#site-footer #primary-nav');
    })) run();
  }).observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['style','class']});
})();

;