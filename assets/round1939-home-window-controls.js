/* Round 1939 — unified Home machine-window controller.
   Critical Information is eagerly prepared and committed to its live first frame while
   the shutter is still closed. Opening therefore moves only the shutter; card geometry
   never swaps during or after that motion. */
(()=>{
  'use strict';
  const CONTROL='[data-ah-home-window-control]';
  const SHUTTER_MS=1500;
  const SHUTTER_EASE='cubic-bezier(.22,.66,.24,1)';
  const MOBILE_PERF=matchMedia('(max-width:900px)').matches;
  const frames=()=>[...document.querySelectorAll('#home-machine-grid>.home-hero-engine-frame,#machine-stack>.machine-frame')];
  const shutterIn=frame=>frame?.querySelector('[data-machine-haze],.window-shutter')||null;
  const iframeIn=frame=>frame?.querySelector('iframe.home-hero-engine-embed,iframe.cards-live-frame,iframe.machine-3d,iframe')||null;
  const isCritical=frame=>!!frame&&(frame.classList.contains('home-hero-rolodex-frame')||frame.classList.contains('cards-frame')||iframeIn(frame)?.id==='home-machine-rolodex'||iframeIn(frame)?.classList.contains('cards-live-frame'));

  function shutterFor(control){
    const id=control?.dataset?.ahWindowShutterId;
    return id?document.getElementById(id):null;
  }
  function frameForControl(control){return shutterFor(control)?.closest('.home-hero-engine-frame,.machine-frame')||null;}
  function openState(shutter){
    if(!shutter)return false;
    if(shutter.getAttribute('aria-expanded')==='true')return true;
    const frame=shutter.closest('.home-hero-engine-frame,.machine-frame');
    return !!(frame&&(frame.classList.contains('is-haze-open')||frame.classList.contains('open')));
  }
  function setModelActivity(frame,active){
    const model=iframeIn(frame);
    try{model?.contentWindow?.postMessage({type:'automated-hearts:learning-activity',active:!!active},'*');}catch(_){}
    try{model?.contentWindow?.postMessage({type:'automated-hearts:viewport-activity',active:!!active},'*');}catch(_){}
  }
  function setSurface(frame,live){
    if(!frame)return;
    frame.dataset.ah1930Surface=live?'live':'poster';
  }
  function controlsFor(frame){
    const shutter=shutterIn(frame);
    if(!shutter?.id)return [];
    return [...document.querySelectorAll(`${CONTROL}[data-ah-window-shutter-id="${CSS.escape(shutter.id)}"]`)];
  }
  function syncOne(control){
    const shutter=shutterFor(control); if(!shutter)return;
    const open=openState(shutter),text=open?'Close window.':'Open the window.',expanded=open?'true':'false';
    const label=control.querySelector('.ah1807-home-window-control__text');
    if(label&&label.textContent!==text)label.textContent=text;
    control.setAttribute('aria-label',text); control.setAttribute('aria-expanded',expanded); control.dataset.windowState=open?'open':'closed';
  }
  function syncAll(){document.querySelectorAll(CONTROL).forEach(syncOne);}
  function placeDefinition(){
    const def=document.querySelector('.ah1759-definition-band[data-ah-definition-band]'); if(!def)return;
    const section=document.getElementById('home-route-buttons')||document.querySelector('.ah1759-insight-grid')?.closest('section');
    if(section&&def.parentElement!==section)section.prepend(def);
  }
  function probeChildReady(frame,attempt=0){
    const model=iframeIn(frame); if(!model||frame.dataset.ah1909LiveReady==='1')return;
    try{if(model.contentWindow?.__AH1814_FIRST_FRAME_SENT__){commitReady(frame);return;}}catch(_){}
    if(attempt<80)frame.__ah1930ReadyProbe=setTimeout(()=>probeChildReady(frame,attempt+1),50);
  }
  function hydrate(frame,eager=false){
    const model=iframeIn(frame); if(!model)return;
    const deferred=model.dataset?.src;
    if(deferred&&!model.getAttribute('src')){
      if(eager){model.setAttribute('loading','eager');model.setAttribute('fetchpriority','high');}
      model.setAttribute('src',deferred);
    }
    if(frame.dataset.ah1930ProbeBound!=='1'){
      frame.dataset.ah1930ProbeBound='1';
      model.addEventListener('load',()=>{clearTimeout(frame.__ah1930ReadyProbe);probeChildReady(frame,0);});
    }
    probeChildReady(frame,0);
  }
  function commitReady(frame){
    if(!frame)return;
    frame.dataset.ah1909LiveReady='1';
    frame.dataset.ah1814WindowReady='1';
    frame.classList.add('ah1909-live-ready','ah1814-window-ready');
    const critical=isCritical(frame);
    if(critical){
      /* Every Home window commits to its settled live first frame BEFORE any shutter travel. */
      setSurface(frame,true);
      requestAnimationFrame(()=>requestAnimationFrame(()=>{
        controlsFor(frame).forEach(control=>{
          if(control.dataset.ahWindowPendingOpen!=='1')return;
          control.removeAttribute('data-ah-window-pending-open');
          control.removeAttribute('aria-busy');
          if(!openState(shutterIn(frame)))setWindowOpen(frame,true);
        });
      }));
    }else{
      /* Primary machine uses the same pre-open live-surface rule as Critical Information. */
      setSurface(frame,true);
      if(openState(shutterIn(frame))&&frame.dataset.ah1930Moving!=='1')setModelActivity(frame,true);
    }
  }
  function finishMotion(frame,open){
    delete frame.dataset.ah1930Moving;
    const model=iframeIn(frame);
    try{model?.contentWindow?.postMessage({type:'ah:home-shutter-motion',moving:false},'*');}catch(_){}
    if(open){
      if(frame.dataset.ah1909LiveReady==='1')setSurface(frame,true);
      if(frame.dataset.ah1909LiveReady==='1')setModelActivity(frame,true);
    }else{
      setModelActivity(frame,false);
      /* Both windows remain on the same live frame behind the closed glass. */
      if(frame.dataset.ah1909LiveReady==='1')setSurface(frame,true);
    }
  }
  function setWindowOpen(frame,open){
    if(!frame)return;
    const shutter=shutterIn(frame); if(!shutter)return;
    frame.style.setProperty('--r688-haze-handle-visible','12px','important');
    frame.style.setProperty('--r1171-window-open-lip','12px','important');
    const target=open?'translate3d(0,calc(-100% + 12px),0)':'translate3d(0,0,0)';
    const token=(frame.__ah1930MotionToken||0)+1; frame.__ah1930MotionToken=token;
    let current='none'; try{current=getComputedStyle(shutter).transform||'none';}catch(_){}
    try{shutter.getAnimations?.().forEach(a=>a.cancel());}catch(_){}
    clearTimeout(frame.__ah1930MotionTimer); clearTimeout(frame.__ah1930HydrateTimer);
    frame.classList.toggle('is-haze-open',!!open); frame.classList.toggle('open',!!open); frame.classList.remove('is-haze-closing','is-haze-moving','ah-shutter-motion');
    frame.dataset.ah1930Moving='1'; shutter.setAttribute('aria-expanded',open?'true':'false');
    shutter.style.setProperty('display','block','important'); shutter.style.setProperty('visibility','visible','important'); shutter.style.setProperty('opacity','1','important'); shutter.style.setProperty('pointer-events','auto','important');
    shutter.style.setProperty('transition','none','important'); shutter.style.setProperty('will-change','transform','important'); shutter.style.setProperty('backface-visibility','hidden','important'); shutter.style.setProperty('-webkit-backface-visibility','hidden','important');
    if(current&&current!=='none'){shutter.style.setProperty('transform',current,'important');shutter.style.setProperty('-webkit-transform',current,'important');}
    else {const fallback=open?'translate3d(0,0,0)':'translate3d(0,calc(-100% + 12px),0)';shutter.style.setProperty('transform',fallback,'important');shutter.style.setProperty('-webkit-transform',fallback,'important');}
    setModelActivity(frame,false);
    try{iframeIn(frame)?.contentWindow?.postMessage({type:'ah:home-shutter-motion',moving:true},'*');}catch(_){}
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      if(frame.__ah1930MotionToken!==token)return;
      shutter.style.setProperty('transition',`transform ${SHUTTER_MS}ms ${SHUTTER_EASE}`,'important');
      shutter.style.setProperty('transform',target,'important'); shutter.style.setProperty('-webkit-transform',target,'important');
      frame.__ah1930MotionTimer=setTimeout(()=>{
        if(frame.__ah1930MotionToken!==token)return;
        shutter.style.setProperty('transition','none','important'); shutter.style.setProperty('transform',target,'important'); shutter.style.setProperty('-webkit-transform',target,'important');
        finishMotion(frame,!!open); syncAll();
      },SHUTTER_MS);
    }));
  }
  function resetClosed(frame){
    const shutter=shutterIn(frame); if(!shutter)return;
    frame.classList.remove('is-haze-open','open','is-haze-closing','is-haze-moving','ah-shutter-motion'); delete frame.dataset.ah1930Moving;
    shutter.setAttribute('aria-expanded','false'); shutter.style.setProperty('display','block','important'); shutter.style.setProperty('visibility','visible','important'); shutter.style.setProperty('opacity','1','important'); shutter.style.setProperty('pointer-events','auto','important'); shutter.style.setProperty('transition','none','important'); shutter.style.setProperty('transform','translate3d(0,0,0)','important'); shutter.style.setProperty('-webkit-transform','translate3d(0,0,0)','important');
    if(frame.dataset.ah1909LiveReady==='1')setSurface(frame,true); else setSurface(frame,false); setModelActivity(frame,false);
  }
  function prepareAll(){
    frames().forEach(frame=>{
      if(isCritical(frame))frame.dataset.ah1930Critical='1';
      frame.dataset.ah1939PreopenLive='1';
      /* Desktop preserves the settled live frame behind the glass. Phones keep
         the exact poster and do not initialize the iframe/WebGL until Open. */
      if(!MOBILE_PERF)hydrate(frame,true);
    });
  }
  function onControl(event,control){
    const frame=frameForControl(control),shutter=shutterFor(control); if(!frame||!shutter)return;
    event?.preventDefault?.(); event?.stopPropagation?.(); event?.stopImmediatePropagation?.();
    const opening=!openState(shutter);
    if(opening){
      frames().filter(other=>other!==frame&&openState(shutterIn(other))).forEach(other=>setWindowOpen(other,false));
      if(frame.dataset.ah1909LiveReady!=='1'){
        hydrate(frame,true); control.dataset.ahWindowPendingOpen='1'; control.setAttribute('aria-busy','true'); return false;
      }
      const model=iframeIn(frame),deferred=model?.dataset?.src;

    }
    setWindowOpen(frame,opening); syncAll(); requestAnimationFrame(syncAll); return false;
  }

  document.addEventListener('click',event=>{if(!(event.target instanceof Element))return;const c=event.target.closest(CONTROL);if(c)onControl(event,c);},true);
  document.addEventListener('keydown',event=>{if(!(event.target instanceof Element))return;const c=event.target.closest(CONTROL);if(!c||(event.key!=='Enter'&&event.key!==' '))return;onControl(event,c);},true);
  window.__AH_HOME_WINDOW_TOGGLE_1824__=(control,event)=>onControl(event,control);

  addEventListener('message',event=>{
    const data=event.data||{}; if(data.type!=='automated-hearts:home-window-first-frame')return;
    frames().forEach(frame=>{const f=iframeIn(frame);if(f&&f.contentWindow===event.source)commitReady(frame);});
  });

  let initialized=false;
  function bind(forceClosed=false){
    placeDefinition(); prepareAll();
    if(!initialized||forceClosed){frames().forEach(resetClosed);initialized=true;}
    /* Critical may already have signalled ready before a persistent-route rebind. */
    frames().forEach(frame=>{if(frame.dataset.ah1909LiveReady==='1')setSurface(frame,true);});
    syncAll();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>bind(true),{once:true});else bind(true);
  document.addEventListener('ah:persistent-route-complete',()=>setTimeout(()=>bind(true),0));
  addEventListener('pageshow',()=>bind(false),{passive:true});
  addEventListener('ah:first-intro-finished',()=>{prepareAll();syncAll();},{passive:true});
  (window.AHResponsive?window.AHResponsive.watch(()=>{placeDefinition();syncAll();}):addEventListener('resize',()=>{placeDefinition();syncAll();},{passive:true}));
})();

(()=>{function gap(){const hero=document.getElementById('home-opening-hero');if(!hero||hero.querySelector('.ah2123-home-button-honeycomb-gap'))return;const spacer=document.createElement('div');spacer.className='ah2123-home-button-honeycomb-gap';spacer.setAttribute('aria-hidden','true');hero.append(spacer)}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',gap);else gap()})();
