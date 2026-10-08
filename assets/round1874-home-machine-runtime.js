/* Automated Hearts Round 1874 — deferred model runtime consolidation. */

/* Automated Hearts Round 1170 — tap-to-open / tap-to-load mobile machine windows.
   On phones neither MP4 has a src until its shutter is opened. Only one decoder is
   active at a time. Desktop keeps the existing interactive iframe behavior. */
(() => {
  'use strict';
  // Critical Information uses the same live card iframe at every viewport size.
  if(document.getElementById('home-machine-grid'))return;

  const mq = matchMedia('(max-width:760px)');
  const MOVE_MS = 720;
  const configs = [
    {
      frameClass: 'home-hero-rolodex-frame',
      template: 'home-machine-rolodex-template',
      iframe: 'home-machine-rolodex',
      video: 'home-machine-rolodex-video',
      mobileSrc: './assets/home-rolodex-scroll-mobile-round1147-smooth.mp4',
      desktopSrc: './heart-to-heart-digital-rolodex-round1094.html?v=2010r&home=1'
    }
  ];

  const grid = document.getElementById('home-machine-grid');
  if (!grid) return;

  const sanitizeMobileShutters = () => {
    if (!mq.matches) return;
    grid.querySelectorAll(':scope > .home-hero-engine-frame > [data-machine-haze]').forEach((shutter) => {
      ['display','visibility','opacity','pointer-events','transition','will-change','transform','-webkit-transform'].forEach((prop) => shutter.style.removeProperty(prop));
    });
  };

  const frameFor = (config) => {
    const tpl = document.getElementById(config.template);
    return tpl?.parentElement || grid.querySelector(`:scope > .${config.frameClass}`);
  };

  const configForFrame = (frame) => configs.find((c) => frameFor(c) === frame);

  const removeDesktopFrame = (config) => {
    const frame = document.getElementById(config.iframe);
    if (!frame) return;
    try { frame.src = 'about:blank'; } catch (_) {}
    frame.remove();
  };

  const mountDesktopFrame = (config) => {
    if (document.getElementById(config.iframe)) return;
    const tpl = document.getElementById(config.template);
    const host = frameFor(config);
    if (!tpl || !host) return;
    const fragment = tpl.content.cloneNode(true);
    const iframe = fragment.querySelector(`#${CSS.escape(config.iframe)}`);
    if (!iframe) return;
    if (!iframe.dataset.src) iframe.dataset.src = config.desktopSrc;
    iframe.removeAttribute('src');
    iframe.setAttribute('loading','lazy');
    host.insertBefore(fragment, host.firstChild);
  };

  const videoFor = (config) => config && config.video ? document.getElementById(config.video) : null;

  const markFirstFrame = (video) => {
    if (!video || video.classList.contains('is-video-ready')) return;
    const ready = () => video.classList.add('is-video-ready');
    if ('requestVideoFrameCallback' in video) video.requestVideoFrameCallback(ready);
    else if (video.readyState >= 2) requestAnimationFrame(ready);
    else video.addEventListener('loadeddata', () => requestAnimationFrame(ready), {once:true, passive:true});
  };

  const loadAndPlay = (config) => {
    if (!config || !config.mobileSrc) return;
    const video = videoFor(config);
    if (!video || !mq.matches) return;
    video.controls = false;
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.loop = true;
    video.disablePictureInPicture = true;
    video.preload = 'metadata';
    video.setAttribute('playsinline','');
    video.setAttribute('webkit-playsinline','');
    video.setAttribute('muted','');
    video.setAttribute('loop','');
    video.setAttribute('disablepictureinpicture','');
    if (video.dataset.activeSrc !== config.mobileSrc) {
      video.classList.remove('is-video-ready');
      video.dataset.activeSrc = config.mobileSrc;
      video.src = config.mobileSrc;
      video.load();
    }
    markFirstFrame(video);
    const play = () => {
      if (!frameFor(config)?.classList.contains('is-haze-open')) return;
      const p = video.play();
      if (p?.catch) p.catch(() => {});
    };
    if (video.readyState >= 2) play();
    else video.addEventListener('canplay', play, {once:true, passive:true});
  };

  const unloadVideo = (config, delay = 0) => {
    const video = videoFor(config);
    if (!video) return;
    video.pause();
    video.classList.remove('is-video-ready');
    const clear = () => {
      if (frameFor(config)?.classList.contains('is-haze-open')) return;
      video.removeAttribute('src');
      delete video.dataset.activeSrc;
      video.preload = 'none';
      try { video.load(); } catch (_) {}
    };
    if (delay) setTimeout(clear, delay);
    else clear();
  };

  const setMoving = (frame) => {
    frame.classList.add('is-haze-moving');
    clearTimeout(frame.__ah1102MoveTimer);
    frame.__ah1102MoveTimer = setTimeout(() => frame.classList.remove('is-haze-moving'), MOVE_MS + 80);
  };

  const setOpen = (frame, open) => {
    if (!frame) return;
    const config = configForFrame(frame);
    const shutter = frame.querySelector('[data-machine-haze]');
    setMoving(frame);
    frame.classList.toggle('is-haze-open', !!open);
    frame.classList.remove('is-haze-closing');
    shutter?.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (config) {
      if (open) {
        /* Let the transform begin first; then wake the decoder. */
        setTimeout(() => loadAndPlay(config), 90);
      } else {
        unloadVideo(config, MOVE_MS + 120);
      }
    }
  };

  const activateMobile = () => {
    document.documentElement.dataset.homeMobileVideo = 'tap';
    for (const config of configs) {
      removeDesktopFrame(config);
      unloadVideo(config);
      const frame = frameFor(config);
      frame?.classList.remove('is-haze-open','is-haze-closing','is-haze-moving');
      frame?.querySelector('[data-machine-haze]')?.setAttribute('aria-expanded','false');
    }
  };

  const activateDesktop = () => {
    delete document.documentElement.dataset.homeMobileVideo;
    for (const config of configs) {
      unloadVideo(config);
      frameFor(config)?.classList.remove('is-haze-open','is-haze-closing','is-haze-moving');
      mountDesktopFrame(config);
    }
  };

  /* Register before the older recovery controller and suppress direct taps on the Home shutters.
     Only the explicit Open the window controls should toggle them. */
  document.addEventListener('click', (event) => {
    if (!mq.matches || !(event.target instanceof Element)) return;
    const shutter = event.target.closest('[data-machine-haze]');
    if (!shutter || !grid.contains(shutter)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);

  const apply = () => {
    if (mq.matches) { activateMobile(); sanitizeMobileShutters(); }
    else activateDesktop();
  };
  apply();
  /* Older deferred recovery code executes after this file and writes inline !important
     shutter styles. Clear those once all deferred scripts have finished so Round 1102's
     lightweight mobile CSS remains authoritative. */
  document.addEventListener('DOMContentLoaded', () => { sanitizeMobileShutters(); requestAnimationFrame(() => requestAnimationFrame(sanitizeMobileShutters)); }, {once:true});
  window.addEventListener('pageshow', () => { if (mq.matches) setTimeout(sanitizeMobileShutters, 0); }, {passive:true});
  if (mq.addEventListener) mq.addEventListener('change', apply);
  else mq.addListener(apply);

  document.addEventListener('visibilitychange', () => {
    if (!mq.matches) return;
    for (const config of configs) {
      const video = videoFor(config);
      const frame = frameFor(config);
      if (!video) continue;
      if (document.hidden) video.pause();
      else if (frame?.classList.contains('is-haze-open') && video.dataset.activeSrc) {
        markFirstFrame(video);
        const p = video.play();
        if (p?.catch) p.catch(() => {});
      }
    }
  }, {passive:true});
})();



/* Automated Hearts Round 1062 lean deferred runtime. */


/* Round 1868 — closed Home machine windows stay unloaded until their explicit Open controls are pressed.
   This removes the old idle-time Rolodex hydration from initial page startup. */
(()=>{'use strict';})();

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
      screen.querySelectorAll('.footer-page-led,.header-page-led').forEach(el=>fitTextToWidth(el,22,28,.96));
    });
  }

  function controlFooterHoverBloom(){/* Round 2108: persistent footer paint is CSS-owned. */}

  function run(){
    fitProcessHeaders();
    controlFooterHoverBloom();
  }

  let resizeRaf=0;
  function queue(){ if(resizeRaf)return; resizeRaf=requestAnimationFrame(()=>{resizeRaf=0;run();}); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run,{once:true}); else run();
  addEventListener('ah:first-intro-preparing-reveal',run);
  addEventListener('pageshow',run);
  (window.AHResponsive?window.AHResponsive.watch(queue):window.addEventListener('resize',queue,{passive:true}));
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(run).catch(function(){});
})();

;
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
      important(el,'font-family','"Orbitron",system-ui,sans-serif');
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
  window.addEventListener('ah:first-intro-preparing-reveal',run);
  window.addEventListener('pageshow',run);
  (window.AHResponsive?window.AHResponsive.watch(queue):window.addEventListener('resize',queue,{passive:true}));
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(run).catch(function(){});
  // DOM, font readiness and responsive changes already schedule this pass.
})();

;
(function(){
  'use strict';
  const mobile=window.matchMedia('(max-width:760px)');
  function imp(el,p,v){ if(el) el.style.setProperty(p,v,'important'); }

  function lockMobileProcessHeaders(){
    if(!mobile.matches) return;
    document.querySelectorAll('#home-solution-framework .negative-software-grid-round344 > article.home-process-stage:not(.home-process-stage--key) > h3').forEach(function(h){
      imp(h,'font-size','18px');
      imp(h,'font-family','"Orbitron",system-ui,sans-serif');
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
    /* Round 1487: the Home ticker is fixed and visually overlaps the bottom
       of the scrollable content. Reserve the ticker's actual height plus the
       same 64px leather breathing room used above the carousel, so the visible
       image-to-ticker gap matches the upper border-to-image gap. */
    const ticker=document.getElementById('home-ticker-wrap');
    const tickerHeight=Math.max(0,Math.ceil(ticker?.getBoundingClientRect?.().height||48));
    const carouselBottomPad=64+tickerHeight+5;
    imp(section,'padding',`64px 0 ${carouselBottomPad}px`);
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
  window.addEventListener('ah:first-intro-preparing-reveal',run);
  window.addEventListener('pageshow',run);
  (window.AHResponsive?window.AHResponsive.watch(queue):window.addEventListener('resize',queue,{passive:true}));
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(run).catch(function(){});
  // DOM, font, load and resize events above already update this geometry.
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


