/* Automated Hearts Round 2106 — one viewport coordinator.
   Replaces independent resize handlers with a single animation-frame batch. */
(()=>{'use strict';
  if(window.__AH2106_RESPONSIVE_COORDINATOR__)return;
  window.__AH2106_RESPONSIVE_COORDINATOR__=true;
  const callbacks=new Set();
  const elementCallbacks=new Map();
  let raf=0,lastEvent=null,lastKey='';
  const dims=()=>{
    const vv=window.visualViewport;
    const w=Math.round((vv&&vv.width)||window.innerWidth||document.documentElement.clientWidth||0);
    const h=Math.round((vv&&vv.height)||window.innerHeight||document.documentElement.clientHeight||0);
    return `${w}x${h}@${window.devicePixelRatio||1}`;
  };
  const flush=()=>{
    raf=0;
    const key=dims();
    if(key===lastKey&&lastEvent?.type!=='ah:force-responsive')return;
    lastKey=key;
    const event=lastEvent||new Event('resize');
    lastEvent=null;
    callbacks.forEach(fn=>{try{fn(event)}catch(err){setTimeout(()=>{throw err},0)}});
  };
  const schedule=(event)=>{lastEvent=event||lastEvent;if(!raf)raf=requestAnimationFrame(flush)};
  const watch=(fn,{immediate=false}={})=>{
    if(typeof fn!=='function')return ()=>{};
    callbacks.add(fn);
    if(immediate)requestAnimationFrame(()=>{try{fn(new Event('resize'))}catch(_){}});
    return ()=>callbacks.delete(fn);
  };
  const NativeRO=window.ResizeObserver;
  const sharedRO=NativeRO?new NativeRO(entries=>{
    const pending=new Set();
    for(const entry of entries){const set=elementCallbacks.get(entry.target);if(set)set.forEach(fn=>pending.add(fn));}
    if(!pending.size)return;
    requestAnimationFrame(()=>pending.forEach(fn=>{try{fn()}catch(err){setTimeout(()=>{throw err},0)}}));
  }):null;
  const watchElement=(el,fn)=>{
    if(!el||typeof fn!=='function'||!sharedRO)return ()=>{};
    let set=elementCallbacks.get(el);
    if(!set){set=new Set();elementCallbacks.set(el,set);sharedRO.observe(el)}
    set.add(fn);
    return ()=>{const s=elementCallbacks.get(el);if(!s)return;s.delete(fn);if(!s.size){elementCallbacks.delete(el);try{sharedRO.unobserve(el)}catch(_){}}};
  };
  window.addEventListener('resize',schedule,{passive:true});
  if(window.visualViewport)window.visualViewport.addEventListener('resize',schedule,{passive:true});
  window.AHResponsive={watch,watchElement,schedule,force(){lastEvent=new Event('ah:force-responsive');schedule(lastEvent)},get size(){return dims()}};
})();
