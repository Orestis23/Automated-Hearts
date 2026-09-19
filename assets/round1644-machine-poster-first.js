/* Automated Hearts Round 1644 — lightweight poster-first Home machine handoff. */
(()=>{
  'use strict';
  if(window.__ahRound1644MachinePosterFirst) return;
  window.__ahRound1644MachinePosterFirst=1;

  const body=()=>document.body;
  const isHome=()=>body()?.dataset?.page==='home';
  const isDesktop=()=>matchMedia('(min-width:901px)').matches;
  const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));

  function introActive(){
    const root=document.documentElement;
    return window.__AH_SITE_FIRST_VISIT_INTRO_1194===true ||
      !!document.getElementById('ah1609-intro') ||
      root.getAttribute('data-ah-intro')==='1' || root.getAttribute('data-ah-desktop-intro')==='1';
  }

  function loadImageInto(img,url){
    if(!img || img.dataset.ah1644PosterLoaded==='1') return;
    img.dataset.ah1644PosterLoaded='1';
    const probe=new Image();
    try{probe.fetchPriority='low'}catch(_){}
    probe.decoding='async';
    probe.onload=()=>{
      const apply=()=>{ if(img.isConnected) img.src=url; };
      if(probe.decode) probe.decode().catch(()=>{}).finally(apply); else apply();
    };
    probe.onerror=()=>{ if(img.isConnected && !img.getAttribute('src')) img.src=url; };
    probe.src=url;
  }

  function mobilePosters(){
    // Round 1664: no static 3D-model poster. The closed machine keeps its neutral
    // surface until the current live model is ready. The cards video retains its tiny poster.
  }

  function ensureDesktopRolodexPoster(){
    const frame=document.querySelector('#home-machine-grid > .home-hero-rolodex-frame');
    if(!frame) return null;
    let img=frame.querySelector(':scope > .ah1644-machine-window-poster');
    if(!img){
      img=document.createElement('img');
      img.alt='';
      img.setAttribute('aria-hidden','true');
      img.className='ah1644-machine-window-poster';
      img.decoding='async';
      img.loading='lazy';
      const insertBefore=frame.querySelector(':scope > .machine-three-ridge-overlay, :scope > .home-machine-haze-screen');
      frame.insertBefore(img,insertBefore||null);
    }
    loadImageInto(img,'./assets/home-rolodex-mobile-poster-round1642.webp?v=1644r');
    return img;
  }

  function markDesktopReady(frame,iframe){
    if(!frame||!iframe||frame.dataset.ah1644ReadyBound==='1') return;
    frame.dataset.ah1644ReadyBound='1';
    const finish=()=>requestAnimationFrame(()=>requestAnimationFrame(()=>setTimeout(()=>frame.classList.add('ah1644-live-ready'),120)));
    const primary=iframe.id==='home-machine-primary';
    const waitCanvas=async()=>{
      if(!primary){finish();return;}
      const started=performance.now();
      while(performance.now()-started<1200){
        try{
          const canvas=iframe.contentDocument?.querySelector('canvas');
          if(canvas && canvas.width>2 && canvas.height>2){ finish(); return; }
        }catch(_){}
        await sleep(60);
      }
      // Safe fallback: the still remains while closed; if opened after load, switch
      // after a compositor grace period rather than leaving the poster forever.
      finish();
    };
    if(iframe.contentDocument?.readyState==='complete') waitCanvas();
    else iframe.addEventListener('load',waitCanvas,{once:true,passive:true});
  }

  function scanDesktop(){
    const grid=document.getElementById('home-machine-grid');
    if(!grid) return;
    ensureDesktopRolodexPoster();
    grid.querySelectorAll(':scope > .home-hero-engine-frame').forEach(frame=>{
      const iframe=frame.querySelector(':scope > iframe.home-hero-engine-embed');
      if(iframe) markDesktopReady(frame,iframe);
    });
  }

  let mo=null;
  function startDesktopObserver(){
    scanDesktop();
    const grid=document.getElementById('home-machine-grid');
    if(!grid || !('MutationObserver' in window)) return;
    mo?.disconnect();
    mo=new MutationObserver(()=>scanDesktop());
    mo.observe(grid,{childList:true,subtree:true});
  }

  function loadPosters(){
    if(!isHome()) return;
    if(isDesktop()) startDesktopObserver();
    else mobilePosters();
  }

  function scheduleNonCritical(){
    if(introActive()) return;
    // Returning visits have no intro to hide the handoff. Start only the tiny, low-priority
    // poster requests on the next paint; the heavy model/video schedules remain untouched.
    requestAnimationFrame(()=>setTimeout(loadPosters,0));
  }

  // On a first visit, wait until the expensive intro work is already complete and the
  // shield is beginning/finishing its reveal. The 26 KB/11 KB poster work cannot compete
  // with typing/audio/model initialization on the critical path.
  addEventListener('ah:first-intro-raising',loadPosters,{once:true});
  addEventListener('ah:first-intro-top',loadPosters,{once:true});
  addEventListener('ah:persistent-route-complete',()=>setTimeout(loadPosters,0));
  addEventListener('pageshow',scheduleNonCritical,{passive:true});
  addEventListener('resize',()=>{ if(isHome()) setTimeout(loadPosters,0); },{passive:true});
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',scheduleNonCritical,{once:true});
  else scheduleNonCritical();
})();
