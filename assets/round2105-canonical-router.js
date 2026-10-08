(()=>{if(innerWidth>900||new URLSearchParams(location.search).get('ah_embed')!=='1')return;function clean(){for(const el of document.querySelectorAll('#ah-mobile-message,#header-send-message,#ah-page-progress,#ah-mobile-footer,#primary-nav,#site-footer'))el.remove()}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',clean);else clean();new MutationObserver(clean).observe(document.documentElement,{childList:true,subtree:true});})();
(()=>{const s=document.createElement('style');s.textContent='@layer ah2271-sharp-heart{html body :is(#ah-route-shield,#ah1609-intro) .ah-uniform-honeycomb-film{display:none!important;visibility:hidden!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;}html body :is(#ah-route-shield-panel,#ah1609-intro .ah1912-intro-panel){filter:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;}}';document.head.prepend(s)})();
/* Automated Hearts Round 2110 — deployment-stabilized canonical public-route shield router.
   Round 1897 assigned four directions in the parent shell, but clicks originating inside
   embedded page frames posted only the destination URL. The parent therefore normalized
   the missing direction to the default rightward sweep. Round 1898 carries the physical
   footer slot direction across the iframe boundary and preserves it end-to-end.
   The outer rim / heart / page screen / message control / footer hardware stay
   mounted in the top document. Primary page content is double-buffered in a
   same-origin iframe and swapped as soon as the destination DOM and deferred page runtime are ready,
   eliminating the black full-document flash on desktop and mobile. */
(() => {
  'use strict';

  /* Round 2118: there must be exactly one visible page-transition shield.
     Historical page runtimes still ship a #page-transition-shield element and
     can animate it independently inside both the top document and routed
     iframes. That second surface is what produced the large empty/black panel
     during some transitions. Keep the legacy node available for old runtime
     feature detection, but make it permanently non-rendering. The canonical
     #ah-route-shield below is the only route-transition artwork. */
  const suppressLegacyRouteShield = () => {
    // The static first-paint stylesheet owns legacy visibility. No injected
    // second stylesheet or attribute observer is needed after retiring its animator.
    document.documentElement.classList.remove('page-shield-arrival','page-shield-covering','page-shield-revealing','routed-page-arrival');
    document.documentElement.dataset.pageShieldState='open';
    const legacy=document.getElementById('page-transition-shield');
    if(legacy){
      try{legacy.getAnimations?.().forEach(animation=>animation.cancel());}catch(_){}
      legacy.setAttribute('aria-hidden','true');
      legacy.style.setProperty('display','none','important');
      legacy.style.setProperty('visibility','hidden','important');
      legacy.style.setProperty('opacity','0','important');
      legacy.style.setProperty('pointer-events','none','important');
      legacy.style.setProperty('animation','none','important');
      legacy.style.setProperty('transition','none','important');
      const panel=legacy.querySelector('.page-transition-shield__panel');
      if(panel){
        try{panel.getAnimations?.().forEach(animation=>animation.cancel());}catch(_){}
        panel.style.setProperty('display','none','important');
        panel.style.setProperty('visibility','hidden','important');
        panel.style.setProperty('opacity','0','important');
        panel.style.setProperty('pointer-events','none','important');
        panel.style.setProperty('animation','none','important');
        panel.style.setProperty('transition','none','important');
      }
    }
  };
  suppressLegacyRouteShield();

  const resetRouteFooterHardware = (doc=document) => {
    const controls=doc.defaultView?.AHControls||window.AHControls;
    controls?.resetFooter(doc);
  };
  const resetAllRouteFooterHardware = () => {
    resetRouteFooterHardware(document);
    document.querySelectorAll('iframe.ah-shell-content-frame').forEach((frame) => {
      try { if (frame.contentDocument) resetRouteFooterHardware(frame.contentDocument); } catch (_) {}
    });
  };

  window.__AH2005_PERSISTENT_SHELL__=true;
  window.__AH2006_PERSISTENT_SHELL_CLEAN__=true;


  const qs = new URLSearchParams(location.search);
  const embedded = qs.get('ah_embed') === '1' && window.self !== window.top;
  const basename = (value) => {
    try {
      const u = new URL(value, location.href);
      return (u.pathname.split('/').pop() || 'index.html').toLowerCase();
    } catch (_) { return ''; }
  };

  const canonicalPathToKey = new Map([
    ['index.html','home'],
    ['the-solution.html','solution'],
    ['industries.html','industries'],
    ['good-information.html','good-information'],
    ['services.html','services'],
    ['privacy-policy.html','privacy-policy']
  ]);

  const pages = {
    home: {
      title:'Hub', file:'index.html', desktopFooter:'Hub', mobileFooter:'Hub',
      mobileMessage:'Automation with a human touch.', shieldQuote:'Automation with a Human touch.'
    },
    solution: {
      title:'The Solution', file:'the-solution.html', desktopFooter:'The Solution', mobileFooter:'Solution',
      mobileMessage:'Negative-Software Solution', shieldQuote:'The Negative-Software Solution'
    },
    industries: {
      title:'Industries', file:'industries.html', desktopFooter:'Industries', mobileFooter:'Industries',
      mobileMessage:'Thinking outside of the box begins Now.', shieldQuote:'Thinking outside of the box begins Now.'
    },
    'good-information': {
      title:'Good Information', file:'good-information.html', desktopFooter:'Good Information', mobileFooter:'Good Info',
      mobileMessage:'Help others learn too.', shieldQuote:'Choose a lesson.'
    },
    services: {
      title:'Services', file:'services.html', desktopFooter:'Services', mobileFooter:'Services',
      mobileMessage:'Premium Customization', shieldQuote:'Fully Customized to your layout.'
    },
    'privacy-policy': {
      title:'Privacy', file:'privacy-policy.html', desktopFooter:'Privacy', mobileFooter:'Privacy',
      mobileMessage:'Your Information Stays Yours.', shieldQuote:'Your Information Stays Yours.'
    }
  };

  const keyFromHref = (href) => canonicalPathToKey.get(basename(href)) || null;

  /* Embedded page: render content only and ask the persistent parent shell to
     handle all primary navigation. This also streams mobile scroll progress to
     the parent's fixed page-name screen. */
  if (embedded) {
    suppressLegacyRouteShield();
    document.documentElement.classList.remove('page-shield-arrival','page-shield-covering','page-shield-revealing','routed-page-arrival');
    document.documentElement.dataset.pageShieldState='open';
    document.body?.removeAttribute('aria-busy');
    document.documentElement.classList.add('ah-shell-embedded');
    document.documentElement.classList.add('ah-embedded-page');

    /* Round 1899: footer direction must be identified inside the embedded page,
       because that is where the physical key click actually occurs after the first
       persistent-shell route. Round 1897 lost this value at postMessage(), so the
       parent always fell back to the default left-to-right sweep. */
    const EMBED_FOOTER_SHIELD_DIRECTIONS = Object.freeze(['left','up','down','right']);
    const embeddedFooterButtons = () => {
      const selector = 'body > footer#site-footer a[data-nav], body > footer#site-footer a[href], body > nav.footer a[href]';
      const seen = new Set();
      return Array.from(document.querySelectorAll(selector)).filter((button) => {
        if (seen.has(button)) return false;
        seen.add(button);
        return true;
      });
    };
    const identifyEmbeddedFooterButtons = () => {
      const buttons = embeddedFooterButtons();
      buttons.forEach((button,index) => {
        button.dataset.ahShieldDirection = EMBED_FOOTER_SHIELD_DIRECTIONS[index % EMBED_FOOTER_SHIELD_DIRECTIONS.length];
      });
      return buttons;
    };
    const embeddedDirectionForLink = (link) => {
      if (!link) return '';
      identifyEmbeddedFooterButtons();
      return link.dataset.ahShieldDirection || '';
    };
    identifyEmbeddedFooterButtons();
    let lastEmbeddedFooterDirection = '';
    const captureEmbeddedFooterDirection = (event) => {
      const node = event && event.target;
      const link = node && typeof node.closest === 'function'
        ? node.closest('body > footer#site-footer a[data-nav], body > footer#site-footer a[href], body > nav.footer a[href]')
        : null;
      if (!link) return;
      identifyEmbeddedFooterButtons();
      lastEmbeddedFooterDirection = link.dataset.ahShieldDirection || '';
    };
    document.addEventListener('pointerdown', captureEmbeddedFooterDirection, true);
    document.addEventListener('mousedown', captureEmbeddedFooterDirection, true);
    document.addEventListener('touchstart', captureEmbeddedFooterDirection, {capture:true,passive:true});
    document.addEventListener('focusin', captureEmbeddedFooterDirection, true);

    const askParentToNavigate = (href, direction = '') => {
      let url;
      try { url = new URL(href, window.location.href); } catch (_) { return false; }
      const key = keyFromHref(url.href);
      if (!key || !pages[key]) return false;
      if (!direction) {
        const active = document.activeElement && typeof document.activeElement.closest === 'function'
          ? document.activeElement.closest('a[data-ah-shield-direction]') : null;
        direction = (active && active.dataset.ahShieldDirection) || lastEmbeddedFooterDirection || '';
      }
      parent.postMessage({type:'ah:shell-route', href:url.href, direction}, '*');
      return true;
    };
    window.__ahPersistentNavigate = askParentToNavigate;
    window.__ahShellNavigate = askParentToNavigate;

    const setEmbeddedRenderActive = (active) => {
      const on = !!active;
      document.documentElement.classList.toggle('ah-shell-render-paused', !on);
      document.querySelectorAll('iframe').forEach((frame) => {
        try { frame.contentWindow?.postMessage({type:'engine-visibility', visible:on}, '*'); } catch (_) {}
        try { frame.contentWindow?.postMessage({type:'automated-hearts:viewport-activity', active:on}, '*'); } catch (_) {}
      });
      document.querySelectorAll('video').forEach((video) => {
        try { if (on) { if (video.dataset.ahShellWasPlaying === '1') video.play().catch(()=>{}); } else { video.dataset.ahShellWasPlaying = video.paused ? '0' : '1'; video.pause(); } } catch (_) {}
      });
    };

    addEventListener('message', (event) => {
      const data = event.data || {};
      if (data.type === 'ah:shell-render-active') {
        setEmbeddedRenderActive(data.active);
        return;
      }
      if (data.type !== 'ah:shell-anchor' || typeof data.hash !== 'string') return;
      let el = null;
      try {
        const id = decodeURIComponent(data.hash.replace(/^#/,''));
        el = document.getElementById(id) || document.querySelector(data.hash);
      } catch (_) {}
      if (el) el.scrollIntoView({behavior:'smooth', block:'start'});
    });

    document.addEventListener('click', (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const node = event.target;
      const link = node && typeof node.closest === 'function' ? node.closest('a[href]') : null;
      if (!link || link.hasAttribute('download') || link.target === '_blank') return;

      if (link.hasAttribute('data-contact-trigger') || link.hasAttribute('data-ah-contact')) {
        event.preventDefault();
        event.stopImmediatePropagation();
        parent.postMessage({type:'ah:shell-contact'}, '*');
        return;
      }

      const key = keyFromHref(link.href);
      if (!key) return;
      let url;
      try { url = new URL(link.href, location.href); } catch (_) { return; }
      const currentKey = keyFromHref(location.href);
      if (key === currentKey && url.hash && basename(url.href) === basename(location.href)) return; // preserve true same-document anchors
      event.preventDefault();
      event.stopImmediatePropagation();
      parent.postMessage({type:'ah:shell-route', href:url.href, direction:embeddedDirectionForLink(link)}, '*');
    }, true);

    /* Round 1218: embedded desktop pages scroll main#main-content rather than
       the iframe document. Measure BOTH surfaces and report the one that is
       actually moving so the fixed colored page-progress field never freezes
       after a persistent-shell route. */
    let progressRaf = 0;
    const contentScroller = document.querySelector('main#main-content');
    const progressFor = (surface, documentSurface = false) => {
      if (!surface) return 0;
      const client = Number(surface.clientHeight || 0);
      const maximum = Math.max(0, Number(surface.scrollHeight || 0) - client);
      if (maximum <= 0) return 0;
      const top = documentSurface
        ? Math.max(Number(scrollY || 0), Number(surface.scrollTop || 0), Number(document.body?.scrollTop || 0))
        : Number(surface.scrollTop || 0);
      return Math.max(0, Math.min(1, top / maximum));
    };
    const sendProgress = () => {
      progressRaf = 0;
      const root = document.scrollingElement || document.documentElement;
      const value = Math.max(
        progressFor(contentScroller, false),
        progressFor(root, true)
      );
      parent.postMessage({type:'ah:shell-progress', value}, '*');
    };
    const queueProgress = () => {
      if (!progressRaf) progressRaf = requestAnimationFrame(sendProgress);
    };
    contentScroller?.addEventListener('scroll', queueProgress, {passive:true});
    addEventListener('scroll', queueProgress, {passive:true});
    document.addEventListener('scroll', queueProgress, {passive:true, capture:true});
    (window.AHResponsive?window.AHResponsive.watch(queueProgress):addEventListener('resize',queueProgress,{passive:true}));
    addEventListener('load', queueProgress, {once:true});
    addEventListener('pageshow', queueProgress, {passive:true});
    if (window.AHResponsive?.watchElement) {
      window.AHResponsive.watchElement(document.documentElement,queueProgress);
      if(document.body)window.AHResponsive.watchElement(document.body,queueProgress);
      if(contentScroller)window.AHResponsive.watchElement(contentScroller,queueProgress);
    } else if ('ResizeObserver' in window) {
      const ro=new ResizeObserver(queueProgress);ro.observe(document.documentElement);if(document.body)ro.observe(document.body);if(contentScroller)ro.observe(contentScroller);
    }
    queueProgress();
    return;
  }

  const loadedVariant = document.documentElement.dataset.ahResponsiveVariant || '';
  const isMobile = loadedVariant === 'mobile' || (loadedVariant !== 'desktop' && (matchMedia('(max-width:900px)').matches || qs.get('mobile') === '1'));
  let currentKey = keyFromHref(location.href) || (isMobile ? 'home' : null);
  if (!currentKey || !pages[currentKey]) return;
  window.__AH_SHELL_PROGRESS_ACTIVE__ = true;

  let currentFrame = null;
  let pendingFrame = null;
  let routeToken = 0;
  let initialMainRetired = false;
  let shieldPanel = null;
  let shieldMotion = null;
  let shieldCovered = false;
  const ROUTE_SHIELD_FLY_MS = 650; // Shared desktop/mobile timing: 25% longer travel.
  const ROUTE_SHIELD_SWEEPS = Object.freeze({
    right:{start:'translate3d(-105%,0,0)', end:'translate3d(105%,0,0)'},
    left:{start:'translate3d(105%,0,0)', end:'translate3d(-105%,0,0)'},
    up:{start:'translate3d(0,105%,0)', end:'translate3d(0,-105%,0)'},
    down:{start:'translate3d(0,-105%,0)', end:'translate3d(0,105%,0)'}
  });
  const DEFAULT_SHIELD_DIRECTION = 'right';
  let activeShieldDirection = DEFAULT_SHIELD_DIRECTION;
  const normalizeShieldDirection=(value)=>Object.prototype.hasOwnProperty.call(ROUTE_SHIELD_SWEEPS,value)?value:DEFAULT_SHIELD_DIRECTION;
  const shieldSweep=(direction)=>ROUTE_SHIELD_SWEEPS[normalizeShieldDirection(direction)];
  let navigationTimeout = 0;
  let navigationActive = false;
  const shieldStyle=document.createElement('style');
  shieldStyle.textContent=`
    #ah-route-shield{position:fixed;z-index:2147483647;inset:var(--current-frame-top,96px) var(--current-frame-side,88px) var(--current-frame-bottom,96px);overflow:hidden;border-radius:var(--current-frame-radius,32px);pointer-events:none;visibility:hidden;opacity:0;background:transparent!important}
    #ah-route-shield[data-ah-flying="1"]{visibility:visible;opacity:1}
    #ah-route-shield[hidden]{display:none}
    #ah-route-shield-panel{position:absolute;inset:0;height:100%;width:100%;box-sizing:border-box;overflow:hidden;border:2px solid rgba(214,178,87,.94);border-radius:inherit;background:transparent url('./assets/honeycomb-fine-tile-2367.svg') center/cover no-repeat;background-clip:padding-box;box-shadow:inset 0 0 0 2px rgba(31,19,3,.96),inset 0 0 0 4px rgba(232,202,126,.30),inset 0 0 10px rgba(216,176,76,.24),inset 0 0 0 5px rgba(255,239,194,.16);transform:translate3d(-105%,0,0);will-change:transform;backface-visibility:hidden;transform-style:preserve-3d;contain:paint;isolation:isolate}
    #ah-route-shield-panel::before{content:"";position:absolute;z-index:1;left:50%;top:55%;width:clamp(110px,18vw,220px);height:clamp(150px,25vw,310px);transform:translate3d(-50%,-50%,0);background:url('./assets/ah-empty-transparent.svg') center/contain no-repeat;opacity:.98;filter:none;pointer-events:none}
    #ah-route-shield-quote{position:absolute;z-index:2;left:50%;top:50%;transform:translate(-50%,-50%);width:min(74%,980px);margin:0;text-align:center;color:#f1f7f4;font-family:Orbitron,"Orbitron",system-ui,sans-serif;font-size:clamp(22px,2.15vw,42px);font-weight:600;line-height:1.35;letter-spacing:.035em;text-wrap:balance;text-shadow:none;pointer-events:none}#ah-route-shield-quote[hidden]{display:none}#ah-route-shield-quote .ah-shield-pink{color:#ff2ea8;-webkit-text-fill-color:#ff2ea8;text-shadow:none}#ah-route-shield-quote .ah-shield-green{color:#8fffd7;-webkit-text-fill-color:#8fffd7;text-shadow:none}
    @media(max-width:900px){#ah-route-shield{inset:98px 10px calc(88px + env(safe-area-inset-bottom,0px));border-radius:18px}#ah-route-shield-panel{border:1.5px solid rgba(214,178,87,.90);border-radius:18px;background-image:url('./assets/page-shield-official-honeycomb-r1877.webp');box-shadow:inset 0 0 0 2px rgba(24,12,2,.94),inset 0 0 0 3px rgba(255,238,186,.18),inset 0 0 8px rgba(214,178,87,.18)}#ah-route-shield-panel::before{top:58%;width:clamp(84px,26vw,126px);height:clamp(118px,38vw,188px)}#ah-route-shield-quote{width:min(82%,560px);font-size:clamp(17px,5.4vw,28px);line-height:1.42;letter-spacing:.02em}}
  `;
  document.head.appendChild(shieldStyle);
  const escapeShieldText=(value)=>String(value).replace(/[&<>"']/g,(ch)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const shieldQuoteMarkup=(value)=>{
    const clean=String(value||'').trim();
    const exact={
      'Automation with a Human touch.':'<span class="ah-shield-pink">Automation</span> with a <span class="ah-shield-green">Human</span> touch.',
      'The Negative-Software Solution':'The <span class="ah-shield-pink">Negative-Software</span> <span class="ah-shield-green">Solution</span>',
      'Thinking outside of the box begins Now.':'Thinking <span class="ah-shield-green">outside of the box</span> begins <span class="ah-shield-pink">Now</span>.',
      'Choose a lesson.':'<span class="ah-shield-green">Choose</span> a <span class="ah-shield-pink">lesson</span>.',
      'Prioritizing Job-Retention.':'<span class="ah-shield-pink">Prioritizing</span> <span class="ah-shield-green">Job-Retention</span>.',
      'Fully Customized to your layout.':'<span class="ah-shield-pink">Fully Customized</span> to <span class="ah-shield-green">your layout</span>.'
    };
    return exact[clean]||escapeShieldText(clean);
  };
  let shieldArtDecoded=false, shieldArtPromise=null;
  const ensureShield = () => {
    if (shieldPanel) return shieldPanel;
    const shield=document.createElement('div');
    shield.id='ah-route-shield';
    shield.setAttribute('aria-hidden','true');
    shield.hidden=true;
    shieldPanel=document.createElement('div');
    shieldPanel.id='ah-route-shield-panel';
    if(!shieldArtDecoded)shieldPanel.style.setProperty('background-image','none','important');
    const quote=document.createElement('div');
    quote.id='ah-route-shield-quote';
    quote.setAttribute('aria-hidden','true');
    quote.hidden=true;
    shieldPanel.appendChild(quote);
    shield.appendChild(shieldPanel);
    document.body.appendChild(shield);
    const initialSweep=shieldSweep(activeShieldDirection);
    shieldPanel.style.transform=initialSweep.start;
    shieldPanel.style.webkitTransform=initialSweep.start;
    // Force one early layout/paint while the panel is offscreen so the first
    // route does not pay setup/raster cost during visible motion.
    void shieldPanel.offsetHeight;
    return shieldPanel;
  };

  const warmShieldArtwork=()=>{
    if(shieldArtPromise)return shieldArtPromise;
    shieldArtPromise=new Promise((resolve)=>{
      const img=new Image();img.decoding='async';
      const done=()=>{
        shieldArtDecoded=true;
        if(shieldPanel){
          shieldPanel.style.setProperty('background-color','#08172b','important');
          shieldPanel.style.setProperty('background-image',"url('./assets/page-shield-official-honeycomb-r1877.webp')",'important');
          shieldPanel.style.setProperty('background-position','center center','important');
          shieldPanel.style.setProperty('background-size','cover','important');
          shieldPanel.style.setProperty('background-repeat','no-repeat','important');
        }
        resolve();
      };
      img.src='./assets/page-shield-official-honeycomb-r1877.webp';
      if(typeof img.decode==='function'){img.decode().then(done,done);return;}
      if(img.complete){done();return;}
      img.addEventListener('load',done,{once:true});img.addEventListener('error',done,{once:true});
    });
    return shieldArtPromise;
  };
  const scheduleShieldArtworkWarm=()=>{
    const run=()=>warmShieldArtwork().catch(()=>{});
    if('requestIdleCallback'in window)requestIdleCallback(run,{timeout:1400});else setTimeout(run,500);
  };

  const setPageRenderActive = (active, frame=currentFrame) => {
    const on = !!active;
    if (frame) {
      try { frame.contentWindow?.postMessage({type:'ah:shell-render-active', active:on}, '*'); } catch (_) {}
      return;
    }
    document.querySelectorAll('body > main#main-content iframe').forEach((model) => {
      try { model.contentWindow?.postMessage({type:'engine-visibility', visible:on}, '*'); } catch (_) {}
      try { model.contentWindow?.postMessage({type:'automated-hearts:viewport-activity', active:on}, '*'); } catch (_) {}
    });
    document.querySelectorAll('body > main#main-content video').forEach((video) => {
      try { if (on) { if (video.dataset.ahShellWasPlaying === '1') video.play().catch(()=>{}); } else { video.dataset.ahShellWasPlaying = video.paused ? '0' : '1'; video.pause(); } } catch (_) {}
    });
  };

  /* Round 1898: every physical footer key owns one cardinal sweep direction.
     The shield always moves continuously in that direction: it enters from the
     opposite edge, covers the viewport, then exits through the named edge. The
     destination swaps while fully covered so the trailing edge reveals a stable
     new page. The same physical footer key keeps its direction even when the
     persistent shell repurposes its label for the previous page. */
  /* Round 1900: page transitions are one uninterrupted flyby. The destination
     is fully prepared behind the current page before motion begins. The shield
     then travels from one edge to the opposite edge in a single linear pass;
     the page swap happens once, at the midpoint, while the shield covers the
     viewport. There is no hold, reversal, or second animation. */
  const flyShield=async(direction,onMidpoint,ready=Promise.resolve())=>{
    ensureShield();
    const shieldRoot=shieldPanel?.parentElement;
    if(shieldRoot){
      const rim=getComputedStyle(document.body,'::after'),vars=getComputedStyle(document.documentElement);
      const value=(p,fallback)=>Number.isFinite(parseFloat(rim[p]))?parseFloat(rim[p]):fallback;
      const gold=4.5;
      const top=value('top',parseFloat(vars.getPropertyValue('--current-frame-top'))||96)+gold;
      const left=value('left',parseFloat(vars.getPropertyValue('--current-frame-side'))||88)+gold;
      const right=value('right',parseFloat(vars.getPropertyValue('--current-frame-side'))||88)+gold;
      const bottom=value('bottom',parseFloat(vars.getPropertyValue('--current-frame-bottom'))||96)+gold;
      const radius=Math.max(0,(parseFloat(rim.borderTopLeftRadius)||32)-gold);
      for(const [p,v]of Object.entries({inset:top+'px '+right+'px '+bottom+'px '+left+'px',overflow:'hidden','border-radius':radius+'px','clip-path':'inset(0 round '+radius+'px)',contain:'paint',transform:'none',width:'auto',height:'auto'}))shieldRoot.style.setProperty(p,v,'important');
      shieldRoot.style.setProperty('z-index','2147483647','important');document.body.appendChild(shieldRoot);shieldRoot.hidden=false;shieldRoot.dataset.ahFlying='1';shieldRoot.style.setProperty('display','block','important');shieldRoot.style.setProperty('visibility','visible','important');shieldRoot.style.setProperty('opacity','1','important');}
    if(!shieldPanel.querySelector('.ah-attached-shield-rim')){
 const rim=document.createElementNS('http://www.w3.org/2000/svg','svg');rim.classList.add('ah-attached-shield-rim');rim.setAttribute('aria-hidden','true');rim.style.cssText='position:absolute!important;inset:0!important;width:100%!important;height:100%!important;pointer-events:none!important;z-index:3!important;overflow:hidden!important';
 rim.innerHTML='<defs><pattern id="ah-shield-hammered" width="48" height="48" patternUnits="userSpaceOnUse"><image href="./assets/hammered-gold-brand.svg" width="48" height="48"/></pattern></defs><rect x="2.25" y="2.25" width="calc(100% - 4.5px)" height="calc(100% - 4.5px)" rx="16" fill="none" stroke="url(#ah-shield-hammered)" stroke-width="4.5"/>';shieldPanel.append(rim);
 }
 shieldPanel.style.setProperty('border','0','important');

 shieldPanel.style.setProperty('display','block','important');
    shieldPanel.style.setProperty('visibility','visible','important');
    shieldPanel.style.setProperty('opacity','1','important');
    activeShieldDirection=normalizeShieldDirection(direction);
    shieldPanel.dataset.ahSweepDirection=activeShieldDirection;
    const sweep=shieldSweep(activeShieldDirection);
    const horizontal=activeShieldDirection==='left'||activeShieldDirection==='right';
    shieldPanel.style.setProperty('width',horizontal?'116%':'100%','important');
    shieldPanel.style.setProperty('height',horizontal?'100%':'116%','important');
    shieldPanel.style.left=horizontal?'-8%':'0';
    shieldPanel.style.top=horizontal?'0':'-8%';
    shieldPanel.style.right='auto';
    shieldPanel.style.bottom='auto';
    try { shieldMotion?.cancel(); } catch (_) {}
    shieldMotion=null;
    shieldCovered=false;
    shieldPanel.style.transition='none';
    shieldPanel.style.transform=sweep.start;
    shieldPanel.style.webkitTransform=sweep.start;
    await warmShieldArtwork();
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));

    let midpointDone=false;
    const fireMidpoint=()=>{
      if(midpointDone)return;
      midpointDone=true;
      try { if(typeof onMidpoint==='function') onMidpoint(); } catch (_) {}
    };
    const half=Math.round(ROUTE_SHIELD_FLY_MS/2);

    const move=async(from,to)=>{
      if(typeof shieldPanel.animate==='function'){
        const motion=shieldPanel.animate([{transform:from},{transform:to}],{duration:half,easing:'cubic-bezier(.22,.65,.3,1)',fill:'forwards'});
        shieldMotion=motion;try{await motion.finished}catch(_){}
        shieldPanel.style.transform=to;shieldPanel.style.webkitTransform=to;
        motion.cancel();if(shieldMotion===motion)shieldMotion=null;
      }else{shieldPanel.style.transition=`transform ${half}ms ease`;shieldPanel.style.transform=to;await new Promise(r=>setTimeout(r,half));shieldPanel.style.transition='none'}
    };
    await move(sweep.start,'translate3d(0,0,0)');
    shieldCovered=true;
    await ready;
    fireMidpoint();
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    await move('translate3d(0,0,0)',sweep.end);

    shieldPanel.style.transition='none';
    shieldPanel.style.transform=sweep.start;
    shieldPanel.style.webkitTransform=sweep.start;
    shieldCovered=false;
    shieldPanel.style.setProperty('visibility','hidden','important');
    shieldPanel.style.setProperty('opacity','0','important');
    shieldPanel.style.setProperty('display','none','important');
    if(shieldRoot){delete shieldRoot.dataset.ahFlying;shieldRoot.style.setProperty('visibility','hidden','important');shieldRoot.style.setProperty('opacity','0','important');shieldRoot.style.setProperty('display','none','important');shieldRoot.hidden=true;}
    resetAllRouteFooterHardware();
  };


  const contentFrameStyle = (frame) => {
    frame.className = 'ah-shell-content-frame';
    frame.setAttribute('aria-label', 'Automated Hearts page content');
    frame.setAttribute('title', 'Automated Hearts page content');
    frame.setAttribute('allow', 'fullscreen');
    frame.setAttribute('fetchpriority','high');
    frame.style.setProperty('position','fixed','important');
    frame.style.setProperty('inset','0','important');
    frame.style.setProperty('width','100%','important');
    frame.style.setProperty('height','100%','important');
    frame.style.setProperty('margin','0','important');
    frame.style.setProperty('padding','0','important');
    frame.style.setProperty('border','0','important');
    frame.style.setProperty('background','transparent','important');
    frame.style.setProperty('background-color','transparent','important');
    frame.style.setProperty('background-image','none','important');
    frame.style.setProperty('z-index','1000','important');
    frame.style.setProperty('opacity','0','important');
    frame.style.setProperty('visibility','hidden','important');
    frame.style.setProperty('pointer-events','none','important');
    return frame;
  };

  const shellPageTitle = () => {
    if (isMobile) return document.querySelector('body > .page-chip');
    return document.querySelector('body > .rim-page-name-screen .footer-page-led, body > .rim-page-name-screen .header-page-led');
  };

  /* Round 1775: this page-name treatment is the master digitized-text reference.
     Legacy route runtimes still contain historical auto-fit code that can try to
     shrink this label to 20px. Keep the master reference authoritative. */
  const enforceBrandDigitalPageName = () => {}; // Round 1818: CSS owns the persistent page-name visual from first paint.
  const observeBrandDigitalPageName = () => {};

  const ensureProgressLayers = (sign) => {
    if(!sign.querySelector(':scope > .ah1781-page-progress-fill')){const fill=document.createElement('span');fill.className='ah1781-page-progress-fill';fill.setAttribute('aria-hidden','true');sign.prepend(fill);}
    if(!sign.querySelector(':scope > .ah-progress-matte')){const matte=document.createElement('span');matte.className='ah-progress-matte';matte.setAttribute('aria-hidden','true');sign.append(matte);}
  };
  const setProgress = (value) => {
    const p = Math.max(0, Math.min(1, Number(value) || 0));
    if (typeof window.__AH1781_PROGRESS_APPLY__ === 'function') { window.__AH1781_PROGRESS_APPLY__(p); return; }
    const percent = `${(p * 100).toFixed(2)}%`;
    const rounded = String(Math.round(p * 100));

    if (isMobile) {
      const chip = shellPageTitle();
      if (!chip) return;
      chip.style.setProperty('--ah-page-scroll-percent', percent);
      chip.setAttribute('data-scroll-percent', rounded);
      ensureProgressLayers(chip);
      return;
    }

    /* Round 1184: desktop uses the same progress value as mobile, but paints
       it through the existing desktop rim-page-name-screen treatment. The
       prior persistent router returned early on desktop, so progress stopped
       after the first persistent-shell navigation. */
    const sign = document.querySelector(
      'body > .rim-page-name-screen.footer-page-screen.header-page-screen--top'
    );
    if (!sign) return;
    let fill = sign.querySelector(':scope > .ah1781-page-progress-fill');
    if (!fill) { fill=document.createElement('span'); fill.className='ah1781-page-progress-fill'; fill.setAttribute('aria-hidden','true'); sign.insertBefore(fill,sign.firstChild); }
    sign.style.setProperty('--page-sign-scroll-progress', p.toFixed(4));
    sign.style.setProperty('--page-sign-scroll-percent', percent);
    sign.style.setProperty('--ah1781-progress-value', p.toFixed(4));
    sign.style.setProperty('--ah1781-progress-percent', percent);
    fill.style.setProperty('--page-sign-scroll-percent', percent);
    fill.style.setProperty('--page-sign-scroll-progress', p.toFixed(4));
    fill.style.removeProperty('transform');
    fill.style.setProperty('transform-origin','left center','important');
    ensureProgressLayers(sign);
    sign.dataset.scrollProgress = p.toFixed(4);
    sign.setAttribute('data-scroll-percent', rounded);
    const led=sign.querySelector('.footer-page-led,.header-page-led');
    if(led){const screenRect=sign.getBoundingClientRect(),textRect=led.getBoundingClientRect();const edge=screenRect.left+sign.clientLeft+p*sign.clientWidth;const local=Math.max(0,Math.min(1,(edge-textRect.left)/Math.max(1,textRect.width)));led.style.setProperty('--ah-progress-label-percent',(local*100).toFixed(3)+'%');}
  };

  /* Round 1773: one authoritative progress reader for both the initial page
     and persistent same-origin route frames. This removes dependence on which
     scroll surface happens to emit the first postMessage. */
  const ah1772ProgressDocs = new WeakSet();
  let ah1772ProgressRaf = 0;
  const ah1772SurfaceProgress = (surface, doc, documentSurface = false) => {
    if (!surface) return 0;
    const client = Number(surface.clientHeight || 0);
    const maximum = Math.max(0, Number(surface.scrollHeight || 0) - client);
    if (maximum <= 1) return 0;
    const win = doc?.defaultView || window;
    const top = documentSurface
      ? Math.max(Number(win?.scrollY || 0), Number(surface.scrollTop || 0), Number(doc?.body?.scrollTop || 0))
      : Number(surface.scrollTop || 0);
    return Math.max(0, Math.min(1, top / maximum));
  };
  const ah1772ProgressFromDocument = (doc) => {
    if (!doc) return 0;
    try {
      const main = doc.querySelector('main#main-content');
      const root = doc.scrollingElement || doc.documentElement;
      return Math.max(
        ah1772SurfaceProgress(main, doc, false),
        ah1772SurfaceProgress(root, doc, true)
      );
    } catch (_) { return 0; }
  };
  const ah1772SyncProgress = () => {
    ah1772ProgressRaf = 0;
    let sourceDoc = document;
    try {
      if (currentFrame?.contentDocument) sourceDoc = currentFrame.contentDocument;
    } catch (_) {}
    setProgress(ah1772ProgressFromDocument(sourceDoc));
  };
  const ah1772QueueProgress = () => {
    if (!ah1772ProgressRaf) ah1772ProgressRaf = requestAnimationFrame(ah1772SyncProgress);
  };
  const ah1772BindProgressDocument = (doc) => {
    if (!doc || ah1772ProgressDocs.has(doc)) return;
    ah1772ProgressDocs.add(doc);
    try {
      const main = doc.querySelector('main#main-content');
      main?.addEventListener('scroll', ah1772QueueProgress, {passive:true});
      doc.addEventListener('scroll', ah1772QueueProgress, {passive:true, capture:true});
      doc.defaultView?.addEventListener('scroll', ah1772QueueProgress, {passive:true});
      if(doc===document&&window.AHResponsive)window.AHResponsive.watch(ah1772QueueProgress);else doc.defaultView?.addEventListener('resize',ah1772QueueProgress,{passive:true});
      if (doc===document && window.AHResponsive?.watchElement) {
        if(doc.documentElement)window.AHResponsive.watchElement(doc.documentElement,ah1772QueueProgress);
        if(doc.body)window.AHResponsive.watchElement(doc.body,ah1772QueueProgress);
        if(main)window.AHResponsive.watchElement(main,ah1772QueueProgress);
      } else if ('ResizeObserver' in window) {
        const ro=new ResizeObserver(ah1772QueueProgress);if(doc.documentElement)ro.observe(doc.documentElement);if(doc.body)ro.observe(doc.body);if(main)ro.observe(main);
      }
    } catch (_) {}
    ah1772QueueProgress();
  };

  const pageHref = (key) => {
    const info = pages[key];
    if (!info) return '#';
    const u = new URL('./' + info.file, location.href);
    u.search = '';
    return u.href;
  };

  /* Route content now comes from the same canonical public documents. The
     ah_embed flag makes the destination render content-only inside the
     persistent shell, so no historical /embed/ document map is required. */
  const embedPageHref = (key) => pageHref(key);

  const publicPageHref = (key, hash = '') => {
    const info=pages[key];
    if(!info)return '#';
    const u=new URL('./'+info.file,location.href);
    u.search='';
    u.hash=hash||'';
    return u.href;
  };

  const labelFor = (key) => {
    const info = pages[key];
    return info ? (isMobile ? info.mobileFooter : info.desktopFooter) : '';
  };

  const FOOTER_SHIELD_DIRECTIONS = Object.freeze(['left','up','down','right']);
  const FIXED_FOOTER_KEYS = Object.freeze(['solution','industries','good-information','services']);
  const identifyFooterButtons = () => {
    const buttons = isMobile
      ? Array.from(document.querySelectorAll('body > nav.footer a[href]'))
      : Array.from(document.querySelectorAll('body > footer#site-footer a[data-nav], body > footer#site-footer a[href]'));
    for (const [index,button] of buttons.entries()) {
      const slotKey=FIXED_FOOTER_KEYS[index % FIXED_FOOTER_KEYS.length];
      const fixedKey=button.dataset.ahFooterDestination || (isMobile ? button.dataset.ahMobileDestination : '') || (slotKey===currentKey?'home':slotKey);
      button.dataset.ahFooterDestination=fixedKey;
      if(isMobile)button.dataset.ahMobileDestination=fixedKey;
      if (pages[fixedKey]) {
        button.dataset.nav=fixedKey;
        button.href=publicPageHref(fixedKey);
        button.removeAttribute('aria-current');
        button.classList.remove('is-current-page');
        const fixedLabel=labelFor(fixedKey);
        const nested=button.querySelector('.footer-nav-label');
        if(nested && nested.textContent!==fixedLabel) nested.textContent=fixedLabel;
        else if(!nested && button.textContent!==fixedLabel) button.textContent=fixedLabel;
        button.setAttribute('aria-label',fixedLabel);
      }
      /* Direction belongs permanently to the physical key/slot. */
      if (!button.dataset.ahShieldDirection) {
        button.dataset.ahShieldDirection = FOOTER_SHIELD_DIRECTIONS[index % FOOTER_SHIELD_DIRECTIONS.length];
      }
      button.dataset.ahShellHardware='2074';
    }
    return buttons;
  };

  let lastPhysicalFooterDirection = '';
  const capturePhysicalFooterDirection = (event) => {
    const node = event && event.target;
    const selector = isMobile
      ? 'body > nav.footer a[href]'
      : 'body > footer#site-footer a[data-nav], body > footer#site-footer a[href]';
    const link = node && typeof node.closest === 'function' ? node.closest(selector) : null;
    if (!link) return;
    identifyFooterButtons();
    lastPhysicalFooterDirection = link.dataset.ahShieldDirection || '';
  };
  document.addEventListener('pointerdown', capturePhysicalFooterDirection, true);
  document.addEventListener('mousedown', capturePhysicalFooterDirection, true);
  document.addEventListener('touchstart', capturePhysicalFooterDirection, {capture:true,passive:true});
  document.addEventListener('focusin', capturePhysicalFooterDirection, true);

  const setButton = (button, key) => {
    if (!button || !pages[key]) return;
    button.dataset.nav = key;
    button.dataset.ahFooterDestination=key;
    if(isMobile)button.dataset.ahMobileDestination=key;
    button.href = publicPageHref(key);
    button.removeAttribute('aria-current');
    button.classList.remove('is-current-page');
    button.style.removeProperty('display');
    const label = labelFor(key);
    const nested = button.querySelector('.footer-nav-label');
    if (nested) {
      const leaf=nested.querySelector('.ah2084-button-label-lock')||nested;
      if(leaf.textContent!==label)leaf.textContent=label;
    }
    else button.textContent = label;
    button.setAttribute('aria-label', label);
  };

  const updateShell = (nextKey, previousKey) => {
    const info = pages[nextKey];
    /* Round 1815: route loads never repaint outer-rim hardware. */
    try { document.documentElement.dataset.ahShellPage=nextKey; document.body.dataset.ahShellPage=nextKey; } catch (_) {}
    const title = shellPageTitle();
    const displayTitle = (isMobile && info.mobileTitle) ? info.mobileTitle : info.title;
    if (title) {
      title.textContent = displayTitle;
      title.setAttribute('data-text', displayTitle);
      title.setAttribute('aria-label', displayTitle);
      const holder = title.closest('.rim-page-name-screen');
      if (holder) holder.setAttribute('aria-label', `Current page: ${displayTitle}`);
    }
    const seo={"home": {"title": "Small Business AI Automation &amp; Web Development | Automated Hearts", "description": "Simplify business workflows with human-centered AI automation, connected tools, and custom web development. Explore practical solutions from Automated Hearts.", "url": "https://automatedhearts.com/"}, "solution": {"title": "Negative-Software Solution: Simplify Business Workflows", "description": "Consolidate information, streamline processes, automate routine work, and optimize decisions. Discover the Automated Hearts Negative-Software Solution.", "url": "https://automatedhearts.com/the-solution.html"}, "industries": {"title": "AI Automation for Business Industries | Automated Hearts", "description": "Explore practical AI automation for business teams, from supply chain and retail to everyday operations. Connect information and reduce repetitive work.", "url": "https://automatedhearts.com/industries.html"}, "good-information": {"title": "Practical AI Learning for Small Businesses | Automated Hearts", "description": "Learn AI principles, explore practical applications, and understand AI concerns and resources through interactive lessons from Automated Hearts.", "url": "https://automatedhearts.com/good-information.html"}, "services": {"title": "AI Automation &amp; Custom Web Development Services", "description": "Explore Automated Hearts services for practical AI automation, connected business workflows, and custom web development built around your existing tools.", "url": "https://automatedhearts.com/services.html"}, "privacy-policy": {"title": "Privacy Policy | Automated Hearts", "description": "Read the Automated Hearts privacy policy to understand how website information and contact inquiries are handled.", "url": "https://automatedhearts.com/privacy-policy.html"}};const metadata=seo[nextKey];if(metadata){document.title=metadata.title;for(const [selector,value]of [['meta[name="description"]',metadata.description],['meta[property="og:title"]',metadata.title],['meta[property="og:description"]',metadata.description],['meta[property="og:url"]',metadata.url]]){const node=document.querySelector(selector);if(node)node.setAttribute("content",value)}const canonical=document.querySelector('link[rel="canonical"]');if(canonical)canonical.href=metadata.url}
    setProgress(0);

    // Keep physical keys mounted; the selected destination becomes the page just left.
    const buttons=identifyFooterButtons();
    {
      const selected=buttons.find(button=>button.dataset.nav===nextKey);
      if(selected)setButton(selected,previousKey && previousKey!==nextKey ? previousKey : 'home');
    }
  };

  const retireInitialContent = () => {
    if (initialMainRetired) return;
    initialMainRetired = true;
    const main = document.querySelector('body > main#main-content');
    if (!main) return;
    main.querySelectorAll('video').forEach((video) => { try { video.pause(); } catch (_) {} });
    main.querySelectorAll('iframe').forEach((frame) => {
      try { frame.removeAttribute('src'); frame.setAttribute('src','about:blank'); } catch (_) {}
    });
    main.style.setProperty('display','none','important');
    main.style.setProperty('visibility','hidden','important');
    main.style.setProperty('pointer-events','none','important');
  };

  const normalizeTarget = (href) => {
    let supplied;
    try { supplied = new URL(href, location.href); } catch (_) { return null; }
    if (supplied.origin !== location.origin && location.protocol !== 'file:') return null;
    const key = keyFromHref(supplied.href);
    if (!key || !pages[key]) return null;
    const target = new URL(embedPageHref(key));
    target.hash = supplied.hash || '';
    target.searchParams.set('ah_embed','1');
    target.searchParams.set('ah_shell','1156');
    const historyUrl = key === 'home' ? new URL(publicPageHref('home', supplied.hash || '')) : supplied;
    return {key, target, historyUrl};
  };

  const revealLoadedFrame = (frame) => {
    frame.style.setProperty('visibility','visible','important');
    frame.style.setProperty('opacity','1','important');
    frame.style.setProperty('pointer-events','auto','important');
  };

  const hideFrame = (frame) => {
    if (!frame) return;
    frame.style.setProperty('visibility','hidden','important');
    frame.style.setProperty('opacity','0','important');
    frame.style.setProperty('pointer-events','none','important');
  };

  const settleDestinationFrame = async (frame) => {
    const doc=frame.contentDocument;
    if(!doc?.body)throw Error('Destination document is unavailable.');
    doc.documentElement.classList.add('ah-embedded-page');
    // Do not swap a still-cloaked destination into the visible viewport.
    if(doc.querySelector('script[src*="stable-material-2259"]')&&doc.documentElement.dataset.ahHomeSurfaceReady!=='1'){
      await new Promise((resolve,reject)=>{
        let timer;const finish=()=>{clearTimeout(timer);doc.removeEventListener('ah:home-surface-ready',finish);resolve();};
        doc.addEventListener('ah:home-surface-ready',finish,{once:true});
        timer=setTimeout(()=>{doc.removeEventListener('ah:home-surface-ready',finish);reject(Error('Destination surface did not become ready.'));},15000);
        if(doc.documentElement.dataset.ahHomeSurfaceReady==='1')finish();
      });
    }
    doc.querySelectorAll('#page-transition-shield,.page-transition-shield,#ah2022-route-shield,#ah1996-mobile-document-shield-panel').forEach(el=>{el.hidden=true;el.style.setProperty('display','none','important')});
    const visible=el=>{const r=el.getBoundingClientRect();return r.width>0&&r.height>0&&r.bottom>0&&r.top<frame.clientHeight};
    const critical=[...doc.images].filter(visible);
    for(const img of critical){if(img.dataset.src){img.src=img.dataset.src;img.removeAttribute('data-src')}img.loading='eager'}
    const bounded=p=>Promise.race([p,new Promise(resolve=>setTimeout(resolve,1000))]);
    await bounded(Promise.allSettled(critical.filter(img=>img.getAttribute('src')).map(img=>img.decode?.()||Promise.resolve())));
    await bounded(doc.fonts?.ready||Promise.resolve());
    doc.defaultView.ahMobileHeaderLayout?.();doc.defaultView.ahUniformHoneycomb?.();
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    frame.dataset.ahLayoutReady='true';
  };

  const trackShellPageView=(key,url)=>{
    try{
      if(typeof window.gtag!=='function')return;
      const title=pages[key]?.title||document.title;
      window.gtag('event','page_view',{page_title:title,page_location:url?.href||location.href,page_path:url?.pathname||location.pathname});
    }catch(_){}
  };

  const navigate = (href, options = {}) => {
    const normalized = normalizeTarget(href);
    if (!normalized) return false;
    if (navigationActive) return true;
    navigationActive = true; document.documentElement.dataset.ahRouteState='preparing'; delete document.documentElement.dataset.ahRouteError;
    window.dispatchEvent(new CustomEvent('ah:persistent-route-start'));
    resetAllRouteFooterHardware();
    suppressLegacyRouteShield();
    ensureShield();
    warmShieldArtwork().catch(()=>{});
    const {key:nextKey, target, historyUrl} = normalized;
    const transitionDirection = normalizeShieldDirection(options.direction);
    let releaseShield;const destinationReady=new Promise(resolve=>{releaseShield=resolve});
    let commitUnderShield=()=>{};
    const shieldPass=flyShield(transitionDirection,()=>commitUnderShield(),destinationReady);
    const token = ++routeToken;
    clearTimeout(navigationTimeout);

    if (pendingFrame) {
      pendingFrame.remove();
      pendingFrame = null;
    }

    /* Load and lay out the destination invisibly first. This lets the visible
       shield make one uninterrupted pass instead of stopping to wait for a page. */
    const frame = contentFrameStyle(document.createElement('iframe'));
    pendingFrame = frame;
    frame.dataset.ahRouteKey = nextKey;
    document.body.appendChild(frame);

    let completed = false;
    let readyListener = null;
    const recoverNavigation = (error) => {
      /* Round 1934: a destination-page exception must never leave the persistent
         shell in navigationActive=true. Round 1932 marked the route completed
         before its async settle/swap work finished, so any exception after that
         point also disabled the timeout recovery and made every later button
         appear frozen. */
      if (token !== routeToken) return;
      releaseShield();try{shieldMotion?.cancel()}catch(_){}
      try { if (readyListener) removeEventListener('message', readyListener); } catch (_) {}
      readyListener = null;
      clearTimeout(navigationTimeout);
      try { if (pendingFrame === frame) frame.remove(); } catch (_) {}
      if (pendingFrame === frame) pendingFrame = null;
      try { setPageRenderActive(true); } catch (_) {}
      try { const routeShield=document.getElementById('ah-route-shield'); if(routeShield){delete routeShield.dataset.ahFlying;routeShield.style.setProperty('display','none','important');routeShield.style.setProperty('visibility','hidden','important');routeShield.style.setProperty('opacity','0','important');routeShield.hidden=true;} const panel=document.getElementById('ah-route-shield-panel'); if(panel){panel.style.setProperty('display','none','important');panel.style.setProperty('visibility','hidden','important');panel.style.setProperty('opacity','0','important');} } catch (_) {}
      resetAllRouteFooterHardware();
      navigationActive = false;
      try { window.dispatchEvent(new CustomEvent('ah:persistent-route-complete',{detail:{page:currentKey,error:true}})); } catch (_) {}
      document.documentElement.dataset.ahRouteState='error';document.documentElement.dataset.ahRouteError=String(error?.message||error);
      if (error && console && console.error) console.error('[AH route recovery]', error);
    };
    const finish = async () => {
      if (completed || token !== routeToken || pendingFrame !== frame) return;
      completed = true;
      clearTimeout(navigationTimeout);
      if(readyListener){removeEventListener('message',readyListener);readyListener=null;}

      try {
      /* Allow fonts/layout to settle while the destination is still hidden. */
      setPageRenderActive(true, frame);
      // Prepare the destination compositor layer before starting the shield.
      frame.style.setProperty('visibility','visible','important');
      frame.style.setProperty('opacity','0.001','important');
      frame.style.setProperty('will-change','opacity','important');
      await settleDestinationFrame(frame);document.documentElement.dataset.ahRouteState='ready';
      // Destination stays active in the exact state validated before the shield.
      await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
      if(token!==routeToken || pendingFrame!==frame) return;

      const previousKey=currentKey;
      const oldFrame=currentFrame;
      let committed=false;
      const commitSwap=()=>{
        if(committed || token!==routeToken)return;
        committed=true;
        updateShell(nextKey, previousKey);
        // Only compositor opacity changes while the shield is moving.
        // Both pages remain mounted until the flyby has completely exited.
        frame.style.setProperty('opacity','1','important');
      };

      commitUnderShield=commitSwap;releaseShield();
      await shieldPass;document.documentElement.dataset.ahRouteState='complete';
      commitSwap();
      if(token!==routeToken)return;
      // Layout, frame teardown, observers, history and shell text updates are
      // deliberately outside the moving shield's critical path.
      retireInitialContent();
      revealLoadedFrame(frame);
      currentFrame=frame;
      pendingFrame=null;
      currentKey=nextKey;
      if(oldFrame && oldFrame!==frame){hideFrame(oldFrame);oldFrame.remove();}
      try { ah1772BindProgressDocument(frame.contentDocument); } catch (_) {}
      frame.style.removeProperty('will-change');
      if(options.push!==false){
        try{
          const clean=new URL(historyUrl.href);
          clean.searchParams.delete('ah_embed');
          clean.searchParams.delete('ah_shell');
          if(nextKey==='home')clean.search='';
          history.pushState({ahShell:true,key:nextKey},'',clean.href);
        }catch(_){}
      }
      trackShellPageView(nextKey,historyUrl);
      navigationActive=false;
      resetAllRouteFooterHardware();
      window.dispatchEvent(new CustomEvent('ah:persistent-route-complete',{detail:{page:nextKey}}));
      } catch (error) {
        recoverNavigation(error);
      }
    };

    readyListener=(event)=>{
      if(token!==routeToken||event.source!==frame.contentWindow)return;
      const data=event.data||{};
      if(data.type!=='ah:shell-dom-ready')return;
      finish();
    };
    addEventListener('message',readyListener);
    frame.addEventListener('load',()=>{
      if(token!==routeToken)return;
      try{
        const loaded=new URL(frame.contentWindow.location.href);
        if(loaded.href==='about:blank')return;
      }catch(_){}
      /* Responsive wrappers rewrite themselves with document.write(). The outer
         load event can precede the inner page's final DOM-ready signal, so allow
         that explicit signal to win before using load as a fallback. */
      setTimeout(()=>{if(token===routeToken&&!completed)finish();},80);
    });
    frame.src=target.href;
    navigationTimeout=setTimeout(()=>{
      if(token!==routeToken||completed)return;
      completed=true;
      recoverNavigation(new Error('Destination page did not become ready in time.'));
    },30000);
    return true;
  };

  const prefetched=new Set();
  const prewarmKey=(key,full=false)=>{
    if(!pages[key]||key===currentKey)return;
    const href=embedPageHref(key);
    const id=`${key}:${full?'full':'doc'}`;
    if(prefetched.has(id))return;
    prefetched.add(id);
    const add=(url,as)=>{const l=document.createElement('link');l.rel='prefetch';l.href=url;if(as)l.as=as;document.head.appendChild(l);};
    add(href,'document');
    if(full){
      /* The embedded HTML exposes all CSS/JS URLs to the browser cache; fetching the document early
         is enough to eliminate the HTML revalidation delay without front-loading every asset. */
    }
  };
  document.addEventListener('pointerover',(event)=>{const link=event.target?.closest?.('footer#site-footer a[data-nav],body>nav.footer a[href]');if(!link)return;const key=link.dataset.nav||keyFromHref(link.href);if(key)prewarmKey(key,true);},{passive:true,capture:true});
  document.addEventListener('focusin',(event)=>{const link=event.target?.closest?.('footer#site-footer a[data-nav],body>nav.footer a[href]');if(!link)return;const key=link.dataset.nav||keyFromHref(link.href);if(key)prewarmKey(key,true);},true);
  /* Assign the four physical footer slots their permanent sweep directions now,
     before the first navigation event can fire. */
  identifyFooterButtons();

  // Do not prefetch every other page after load. That background burst competed with the
  // active page's fonts/images on slower connections. Hover/focus prewarm above keeps
  // desktop navigation anticipatory without front-loading four documents on every visit.

  window.__ahShellNavigate = (href, direction='') => {
    if (!direction) {
      const active = document.activeElement && typeof document.activeElement.closest === 'function'
        ? document.activeElement.closest('a[data-ah-shield-direction]') : null;
      direction = (active && active.dataset.ahShieldDirection) || lastPhysicalFooterDirection || '';
    }
    return navigate(href, {push:true, direction});
  };
  window.__ahPersistentNavigate = window.__ahShellNavigate;

  // Round 1201: on the dedicated mobile shell, complete footer navigation from
  // a clean pointerup instead of depending exclusively on the synthesized click.
  // This avoids dropped taps after repeated touch interactions while still
  // rejecting scroll gestures and preserving click/keyboard fallback behavior.
  let mobileTap = null;
  let suppressClickUntil = 0;
  let suppressClickHref = '';
  if (isMobile) {
    document.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) return;
      const node = event.target;
      const link = node && typeof node.closest === 'function' ? node.closest('body > nav.footer a[href]') : null;
      if (!link) { mobileTap = null; return; }
      const rect = link.getBoundingClientRect();
      mobileTap = {
        id:event.pointerId,
        link,
        x:event.clientX,
        y:event.clientY,
        t:performance.now(),
        left:rect.left - 10,
        right:rect.right + 10,
        top:rect.top - 10,
        bottom:rect.bottom + 10
      };
    }, true);

    document.addEventListener('pointerup', (event) => {
      const tap = mobileTap;
      mobileTap = null;
      if (!tap || event.pointerId !== tap.id) return;
      const dx = event.clientX - tap.x;
      const dy = event.clientY - tap.y;
      if ((dx * dx + dy * dy) > 196 || (performance.now() - tap.t) > 900) return;
      const node = document.elementFromPoint(event.clientX, event.clientY);
      const releaseLink = node && typeof node.closest === 'function' ? node.closest('body > nav.footer a[href]') : null;
      const insideOriginalButton = event.clientX >= tap.left && event.clientX <= tap.right &&
        event.clientY >= tap.top && event.clientY <= tap.bottom;
      // The physical press animation moves the button down by 5px before
      // pointerup. Accept the original hit rectangle so the animation itself
      // can never make a valid tap miss. Still reject release over a different
      // footer button.
      if (releaseLink && releaseLink !== tap.link) return;
      if (!releaseLink && !insideOriginalButton) return;
      const key = keyFromHref(tap.link.href);
      if (!key || !pages[key]) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      suppressClickHref = tap.link.href;
      suppressClickUntil = performance.now() + 800;
      tap.link.classList.remove('is-pressed','is-nav-pressed','is-route-pressed');
      tap.link.removeAttribute('data-ah-control-pressed');
      tap.link.removeAttribute('data-ah-footer-loading');
      tap.link.setAttribute('aria-pressed','false');
      document.documentElement.classList.remove('ah-footer-navigation-loading');
      navigate(tap.link.href, {push:true, direction:tap.link.dataset.ahShieldDirection});
    }, true);

    document.addEventListener('pointermove', (event) => {
      const tap = mobileTap;
      if (!tap || event.pointerId !== tap.id) return;
      const dx = event.clientX - tap.x;
      const dy = event.clientY - tap.y;
      if ((dx * dx + dy * dy) > 196) mobileTap = null;
    }, {passive:true, capture:true});
    document.addEventListener('pointercancel', () => { mobileTap = null; }, true);
    // Do not cancel a footer tap merely because momentum/programmatic scrolling
    // emits a scroll event while the finger is down. Pointer movement above is
    // the reliable gesture discriminator.
  }

  document.addEventListener('click', (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const node = event.target;
    const link = node && typeof node.closest === 'function' ? node.closest('a[href]') : null;
    if (!link || link.hasAttribute('download') || link.target === '_blank' || link.hasAttribute('data-contact-trigger') || link.hasAttribute('data-ah-contact')) return;
    if (isMobile && performance.now() < suppressClickUntil && link.href === suppressClickHref) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    /* Round 1536: Good Information / Industries model controls are same-document
       anchors, but they own a serialized scroll + shield animation.  Do not let
       the persistent route layer consume these clicks or call scrollIntoView();
       the page-specific controller below must receive the event unchanged. */
    if (link.matches(
      '.route-label[data-lite-learning],.route-label[data-industry],'+
      '#learning-route-buttons .premium-route-card__title-sign[data-learning-model],'+
      '#who-we-help-solutions .premium-route-card__title-sign[data-route-index]'
    )) return;
    const key = keyFromHref(link.href);
    if (!key) return;
    let url;
    try { url = new URL(link.href, location.href); } catch (_) { return; }
    if (key === currentKey && url.hash) {
      if (currentFrame) {
        try { currentFrame.contentWindow.postMessage({type:'ah:shell-anchor', hash:url.hash}, '*'); } catch (_) {}
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }
      let localAnchor = null;
      try {
        const id = decodeURIComponent(url.hash.replace(/^#/,''));
        localAnchor = document.getElementById(id) || document.querySelector(url.hash);
      } catch (_) {}
      if (localAnchor) {
        event.preventDefault();
        event.stopImmediatePropagation();
        localAnchor.scrollIntoView({behavior:'smooth', block:'start'});
        return;
      }
    }
    event.preventDefault();
    event.stopImmediatePropagation();
    navigate(url.href, {push:true, direction:link.dataset.ahShieldDirection});
  }, true);

  addEventListener('message', (event) => {
    const data = event.data || {};
    const fromActive = currentFrame && event.source === currentFrame.contentWindow;
    const fromPending = pendingFrame && event.source === pendingFrame.contentWindow;
    if (!fromActive && !fromPending) return;
    if ((data.type === 'ah:shell-route' || data.type === 'ah:persistent-route') && typeof data.href === 'string') {
      navigate(data.href, {push:true, direction:data.direction});
    } else if (data.type === 'ah:shell-contact' || data.type === 'ah:persistent-contact') {
      const contact = document.querySelector('body > [data-contact-trigger], body > #header-send-message, body > .message');
      if (contact) contact.click();
    } else if (data.type === 'ah:shell-progress' && fromActive) {
      setProgress(data.value);
    }
  });


  addEventListener('popstate', () => {
    const key=keyFromHref(location.href);
    if (!key || key === currentKey) return;
    const target=new URL(pageHref(key));
    target.hash=location.hash||'';
    navigate(target.href, {push:false});
  });

  // Round 1394: keep the route shield mounted and precomposited between routes.
  // Recreating or display:none-hiding it forces avoidable raster/compositor work.
  ensureShield();
  scheduleShieldArtworkWarm();
  identifyFooterButtons();
  updateShell(currentKey, null);
  enforceBrandDigitalPageName();
  observeBrandDigitalPageName();
  ah1772BindProgressDocument(document);
  document.documentElement.classList.add('ah-shell-router-ready');
})();

(()=>{const mount=()=>{if(document.documentElement.classList.contains('ah-embedded-page')||document.getElementById('ah2123-corner-tl'))return;for(const corner of ['tl','tr','bl','br']){let n=document.createElement('div');n.id='ah2123-corner-'+corner;n.className='ah2123-solid-corner';n.setAttribute('aria-hidden','true');document.body.append(n)}};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount()})();




(()=>{function mount(){if(document.documentElement.classList.contains('ah-embedded-page'))return;document.getElementById('ah2123-opaque-rim-base')?.remove();const footer=document.getElementById('ah-mobile-footer');if(footer&&footer.parentElement!==document.body)document.body.append(footer)}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount()})();



(()=>{function rimMask(){if(document.documentElement.classList.contains('ah-embedded-page')||!document.body.hasAttribute('data-ah-mobile-surface'))return;const s=getComputedStyle(document.body,'::after'),w=innerWidth,h=innerHeight,x=14,y=98,right=w-14,bottom=h-88,r=Math.min(parseFloat(s.borderTopLeftRadius)||20,(right-x)/2,(bottom-y)/2),rb=Math.min(parseFloat(s.borderBottomLeftRadius)||r,(right-x)/2,(bottom-y)/2);const d='M0 0H'+w+'V'+h+'H0Z M'+(x+r)+' '+y+'H'+(right-r)+'Q'+right+' '+y+' '+right+' '+(y+r)+'V'+(bottom-rb)+'Q'+right+' '+bottom+' '+(right-rb)+' '+bottom+'H'+(x+rb)+'Q'+x+' '+bottom+' '+x+' '+(bottom-rb)+'V'+(y+r)+'Q'+x+' '+y+' '+(x+r)+' '+y+'Z';const svg='<svg xmlns="http://www.w3.org/2000/svg" width="'+w+'" height="'+h+'"><path fill="white" fill-rule="evenodd" d="'+d+'"/></svg>';document.documentElement.style.setProperty('--ah-mobile-rounded-rim-mask','url("data:image/svg+xml,'+encodeURIComponent(svg)+'")');document.documentElement.style.setProperty('--ah2116-mobile-frost-z','2147483647')}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(rimMask));else requestAnimationFrame(rimMask);addEventListener('resize',rimMask);addEventListener('ah:persistent-route-complete',rimMask)})();

// One material definition for all honeycomb content sections, including routed pages.
(()=>{
function apply(){
const mobile=document.body.hasAttribute('data-ah-mobile-surface');
const asset=new URL(mobile?'./honeycomb-fine-tile-2367.svg':'./honeycomb-fine-tile-2367.svg',document.querySelector('script[src*="round2105-canonical-router"]')?.src||location.href).href;
const material={
 'background-color':'#14212b','background-image':'linear-gradient(rgba(220,236,243,.02109375),rgba(220,236,243,.02109375)),url("'+asset+'")',
 'background-position':'center center,center center','background-size':mobile?'1440px 900px,1440px 900px':'cover,cover',
 'background-repeat':'no-repeat,no-repeat','background-attachment':'scroll,scroll','background-blend-mode':'normal,normal',
 'isolation':'isolate','backdrop-filter':'none','-webkit-backdrop-filter':'none'
};
const set=(el,props)=>{for(const [p,v]of Object.entries(props))el.style.setProperty(p,v,'important')};
for(const section of document.querySelectorAll('main section,main [data-ah2123-honeycomb-glass]')){
if(!/honeycomb/i.test(getComputedStyle(section).backgroundImage)||section.matches('[class*="frost-pane"],[class*="glass-film"]'))continue;
section.dataset.ahUniformHoneycomb='1';set(section,material);if(getComputedStyle(section).position==='static')section.style.setProperty('position','relative');
for(const old of section.querySelectorAll(':scope > [class*="frost"],:scope > [class*="glass"]')){if(!old.classList.contains('ah-uniform-honeycomb-film'))set(old,{display:'none','backdrop-filter':'none','-webkit-backdrop-filter':'none'});}
let film=section.querySelector(':scope > .ah-uniform-honeycomb-film');
if(!film){film=document.createElement('span');film.className='ah-uniform-honeycomb-film';film.setAttribute('aria-hidden','true');section.prepend(film)}
set(film,{position:'absolute',inset:'0',display:'block',background:'rgba(220,236,243,.035)',opacity:'1','z-index':'0','pointer-events':'none','backdrop-filter':mobile?'none':'blur(3.5px) saturate(.82) brightness(1.06)','-webkit-backdrop-filter':mobile?'none':'blur(3.5px) saturate(.82) brightness(1.06)'});
for(const child of section.children){if(child===film||/frost|glass/.test(child.className))continue;if(getComputedStyle(child).position==='static')child.style.setProperty('position','relative');child.style.setProperty('z-index','1');}
}
}
window.ahUniformHoneycomb=apply;
const queue=()=>requestAnimationFrame(apply);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',queue,{once:true});else queue();
addEventListener('load',queue,{once:true});addEventListener('ah:persistent-route-complete',queue);
})();

// Brand honeycomb: viewport-sized artwork and exactly one thin matte film.
(()=>{
const asset=new URL(innerWidth>900?'./honeycomb-fine-tile-2367.svg':'./honeycomb-fine-tile-2367.svg',document.querySelector('script[src*="round2105-canonical-router"]')?.src||location.href).href;
const set=(e,p,v)=>{if(e.style.getPropertyValue(p)!==v||e.style.getPropertyPriority(p)!=='important')e.style.setProperty(p,v,'important')};
function apply(){
const root=document.documentElement;
for(const [p,v]of Object.entries({'--ah2116-frost':'rgba(220,236,243,.045)','--ah2116-frost-blur':'1.2px','--ah2116-frost-sat':'1','--ah2116-frost-bright':'1'}))set(root,p,v);
for(const e of document.querySelectorAll('html,body,body *')){
 if(e.closest('svg,#ah1609-intro')||e.matches('script,style,link'))continue;

 if(e.getAttribute('aria-hidden')==='true'&&/frost|glass/.test(e.className)&&!e.classList.contains('ah-uniform-honeycomb-film'))continue;
 const bg=getComputedStyle(e).backgroundImage;
 if(!/honeycomb/i.test(bg)&&!e.hasAttribute('data-ah-uniform-honeycomb'))continue;
 const surface=!e.matches('html,body,.ah-shell-edge')&&!/corner/.test(e.className);
 for(const [p,v]of Object.entries({'background-color':'#14212b','background-image':e.id==='ah-route-shield-panel'?bg:'url("'+asset+'")','background-size':innerWidth>900?(surface?'auto 732px':'auto 832px'):'cover','background-position':'center center','background-repeat':innerWidth>900&&!surface?'repeat':'no-repeat','background-attachment':innerWidth>900&&!surface?'scroll':'fixed','background-blend-mode':'normal','backdrop-filter':'none','-webkit-backdrop-filter':'none'}))set(e,p,v);
 if(!surface)continue;
 e.dataset.ahUniformHoneycomb='1';
 if(getComputedStyle(e).position==='static')set(e,'position','relative');
 set(e,'isolation','isolate');
 for(const old of e.querySelectorAll(':scope > [class*="frost"],:scope > [class*="glass"]')){
  if(old.classList.contains('ah-uniform-honeycomb-film'))continue;
  set(old,'display','none');set(old,'backdrop-filter','none');set(old,'-webkit-backdrop-filter','none');
 }
 for(const pseudo of ['::before','::after']){
  const s=getComputedStyle(e,pseudo);
  if(s.backdropFilter!=='none'||/honeycomb/i.test(s.backgroundImage))e.setAttribute(pseudo==='::before'?'data-ah-old-frost-before':'data-ah-old-frost-after','');
 }
 let film=e.querySelector(':scope > .ah-uniform-honeycomb-film');
 if(!film){film=document.createElement('span');film.className='ah-uniform-honeycomb-film';film.setAttribute('aria-hidden','true');e.prepend(film)}
 for(const [p,v]of Object.entries({position:'absolute',inset:'0',display:'block',background:innerWidth>900?'rgba(220,236,243,.09)':'rgba(220,236,243,.045)',opacity:'1','z-index':'0','pointer-events':'none','backdrop-filter':innerWidth>900?'blur(1.8px)':'blur(1.2px)','-webkit-backdrop-filter':innerWidth>900?'blur(1.8px)':'blur(1.2px)'}))set(film,p,v);
 for(const child of e.children){if(child===film||child.matches('style,script')||/frost|glass/.test(child.className))continue;if(getComputedStyle(child).position==='static')set(child,'position','relative');set(child,'z-index','1');}
}
// The original rim keeps one masked matte film; disable duplicate glass copies.
for(const pane of document.querySelectorAll('[data-ah-rim-frost]')){set(pane,'background','rgba(220,236,243,.045)');set(pane,'backdrop-filter','none');set(pane,'-webkit-backdrop-filter','none');set(pane,'opacity','1')}
const intro=document.querySelector('#ah1609-intro .ah1912-intro-panel');

}
const style=document.createElement('style');style.textContent='[data-ah-old-frost-before]::before,[data-ah-old-frost-after]::after,html body #home-opening-hero[data-ah-old-frost-before]::before,html body #home-opening-hero[data-ah-old-frost-after]::after,#ah1609-intro .ah1912-intro-panel[data-ah-old-frost-after]::after{background:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important}';document.head.append(style);
window.ahUniformHoneycomb=apply;
let scheduled=false;const queue=()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;apply()})};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',queue,{once:true});else queue();
addEventListener('load',queue,{once:true});addEventListener('resize',queue);addEventListener('ah:persistent-route-complete',queue);
})();
// Light frost on shell strips and mobile home header, beneath controls.

// Unbacked, centered Automation quotation on both surfaces.
(()=>{const style=document.createElement('style');style.textContent='@layer ah-definition-clear{html body [data-ah-definition-band],html body .ah1759-definition-band__shell,html body .ah1759-definition-band__text{background:transparent!important;background-image:none!important;box-shadow:none!important;border:0!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;text-align:center!important}html body [data-ah-definition-band]::before,html body [data-ah-definition-band]::after,html body .ah1759-definition-band__shell::before,html body .ah1759-definition-band__shell::after{display:none!important}html body [data-ah-definition-band]{margin-left:auto!important;margin-right:auto!important}html body .ah1759-definition-band__text{margin-left:auto!important;margin-right:auto!important}}';document.head.prepend(style)})();

// Responsive typography for the Automation definition.
(()=>{const style=document.createElement('style');style.textContent='@layer ah-definition-type{html body [data-ah-definition-band]{width:100%!important;max-width:960px!important;box-sizing:border-box!important;padding:28px 30px!important}html body .ah1759-definition-band__shell{width:100%!important;max-width:none!important;padding:0!important;box-sizing:border-box!important}html body .ah1759-definition-band__text{font-family:Rajdhani,sans-serif!important;font-size:clamp(24px,2.2vw,32px)!important;font-weight:600!important;line-height:1.45!important;max-width:900px!important;padding:0!important;color:#f2f5f7!important;text-wrap:balance!important}html body .ah1759-definition-band__label{display:block!important;margin-bottom:8px!important;color:#ed65ac!important;font-size:1.08em!important}html body .ah1759-definition-band__source{display:block!important;margin-top:12px!important;color:#80dfbd!important;font-size:.85em!important}@media(max-width:900px){html body [data-ah-definition-band]{padding:24px 18px!important}html body .ah1759-definition-band__text{font-size:24px!important;line-height:1.4!important}html body .ah1759-definition-band__label{margin-bottom:10px!important}html body .ah1759-definition-band__source{margin-top:14px!important}}';document.head.prepend(style)})();

(()=>{const imp=(e,p,v)=>{if(e&&e.style.getPropertyValue(p)!==v)e.style.setProperty(p,v,'important')};function apply(){const button=document.querySelector('#negative-software-explore,.explore-key');if(!button)return;const screen=document.querySelector('.ah-home-process-box,.negative-software-screen-round344');if(!screen)return;const height=screen.getBoundingClientRect().height;if(!height)return;const heading=screen.querySelector('h3 .ah1985-progress-text-glyphs')||screen.querySelector('h3 .r1176-process-heading-label')||screen.querySelector('h3');const font=heading?getComputedStyle(heading):null;const card=button.closest('article');for(const el of [card,button])for(const prop of ['height','min-height','max-height'])imp(el,prop,height+'px');imp(button,'border-radius','0');imp(button,'padding','14px 12px');imp(button,'display','flex');let copy=button.querySelector('.ah1597-explore-copy,.ah2172-explore-copy');if(!copy){copy=document.createElement('span');copy.className='ah2172-explore-copy';button.replaceChildren(copy)}if(!copy.querySelector('.ah2172-explore-title'))copy.innerHTML='<span class="ah2172-explore-title">Explore</span><span class="ah2172-explore-quote">“The only limitation is your imagination.”</span><span class="ah2172-explore-source">– TruthBot</span>';for(const [key,val]of Object.entries({display:'grid','grid-template-rows':'auto 1fr auto',width:'100%',height:'100%',position:'relative',inset:'auto',transform:'none',gap:'12px','text-align':'center',padding:'0'}))imp(copy,key,val);const parts=[copy.querySelector('.ah2172-explore-title'),copy.querySelector('.ah2172-explore-quote'),copy.querySelector('.ah2172-explore-source')];parts.forEach((el,i)=>{for(const [key,val]of Object.entries({position:'static',inset:'auto',transform:'none',margin:'0',padding:'0',color:['#ed65ac','#ffffff','#8fffd7'][i],'-webkit-text-fill-color':['#ed65ac','#ffffff','#8fffd7'][i],'text-align':'center','line-height':'1.3','white-space':'normal',mask:'none','font-family':i===0?(font?.fontFamily||'Orbitron,sans-serif'):'Rajdhani,sans-serif','font-size':i===0?(font?.fontSize||'24px'):(innerWidth<=900?'22px':'20px'),'font-weight':i===0?'700':'600','align-self':i===1?'center':i===0?'start':'end','text-shadow':'none'}))imp(el,key,val)});}let queued=false;const queue=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply()})};function init(){queue();new MutationObserver(queue).observe(document.body||document.documentElement,{subtree:true,childList:true});const watch=()=>{const el=document.querySelector('#negative-software-explore,.explore-key');if(el&&!el.dataset.ahExploreStable){el.dataset.ahExploreStable='1';new MutationObserver(queue).observe(el,{attributes:true,subtree:true,attributeFilter:['style','class']});}};watch();new MutationObserver(watch).observe(document.body||document.documentElement,{childList:true,subtree:true});}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();addEventListener('resize',queue);addEventListener('load',queue);addEventListener('ah:persistent-route-complete',queue);document.fonts?.ready.then(queue);setTimeout(queue,1200)})();
(()=>{const selector='#negative-software-explore,.explore-key';const style=document.createElement('style');style.textContent='@layer ah-explore-press{html body :is(#negative-software-explore,.explore-key){transition:scale 180ms cubic-bezier(.22,.7,.3,1)!important;transform:none!important;translate:none!important;scale:1!important}html body :is(#negative-software-explore,.explore-key)[data-ah-explore-down]{scale:.97!important}html body :is(#negative-software-explore,.explore-key)[data-ah-explore-lit] :is(.ah2172-explore-title,.ah2172-explore-quote,.ah2172-explore-source){filter:brightness(1.55) drop-shadow(0 0 4px currentColor)!important;transition:filter 100ms ease-out!important}}';document.head.prepend(style);let pressed=null;const timers=new WeakMap();function release(){if(pressed){pressed.removeAttribute('data-ah-explore-down');pressed.style.setProperty('scale','1','important');pressed=null}}addEventListener('pointerdown',e=>{const b=e.target.closest?.(selector);if(!b)return;pressed=b;b.setAttribute('data-ah-explore-down','');queueMicrotask(()=>{b.style.setProperty('transition','scale 180ms cubic-bezier(.22,.7,.3,1)','important');b.style.setProperty('transform','none','important');b.style.setProperty('scale','.97','important')});b.setAttribute('data-ah-explore-lit','');clearTimeout(timers.get(b));timers.set(b,setTimeout(()=>b.removeAttribute('data-ah-explore-lit'),360))},true);addEventListener('pointerup',release,true);addEventListener('pointercancel',release,true);addEventListener('blur',release);addEventListener('keydown',e=>{if(!['Enter',' '].includes(e.key))return;const b=e.target.closest?.(selector);if(b){b.setAttribute('data-ah-explore-lit','');setTimeout(()=>b.removeAttribute('data-ah-explore-lit'),360)}},true)})();
(()=>{function center(){if(innerWidth>900)return;const b=document.querySelector('.explore-key,#negative-software-explore');if(!b)return;const card=b.closest('article');for(const e of [card,b]){if(!e)continue;for(const [k,v]of Object.entries({'margin-left':'auto','margin-right':'auto','justify-self':'center','align-self':'center'}))if(e.style.getPropertyValue(k)!==v)e.style.setProperty(k,v,'important')}}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',center);else center();addEventListener('resize',center);let queued=false;new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;center()})}).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['style','class']})})();
