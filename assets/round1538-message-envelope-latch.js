/* Automated Hearts Round 1538 — envelope illumination follows contact drawer state. */
(() => {
  'use strict';
  const root=document.documentElement;
  const triggers=new Set();
  const observers=new WeakMap();
  const imp=(el,p,v)=>{if(el&&el.style.getPropertyValue(p)!==v)el.style.setProperty(p,v,'important');};
  const openState=(el)=>{
    if(!el)return false;
    const expanded=el.getAttribute('aria-expanded');
    if(expanded!==null){
      return expanded==='true' || el.classList.contains('is-contact-latched') ||
        (el.classList.contains('message') && document.body?.classList.contains('ah-contact-open'));
    }
    return root.classList.contains('ah-message-persist-open');
  };

  function sync(el){
    if(!el)return;
    const on=openState(el);
    const glow=on?'1':'0';
    if(el.dataset.ahEnvelopeGlow===glow)return;
    el.dataset.ahEnvelopeGlow=glow;
    const env=el.querySelector('.r1005-message-envelope');
    const svg=el.querySelector('svg');
    const target=env||svg;
    if(target){
      imp(target,'transition','filter 180ms ease,opacity 180ms ease');
      imp(target,'filter',on
        ? 'brightness(1.28) saturate(1.18) drop-shadow(0 0 2px rgba(255,84,96,1)) drop-shadow(0 0 7px rgba(255,59,79,.96)) drop-shadow(0 0 14px rgba(255,46,168,.72))'
        : 'brightness(1) saturate(1) drop-shadow(0 0 1px rgba(255,59,79,.16))');
    }
    if(svg){
      imp(svg,'overflow','visible');
      svg.querySelectorAll('path,polyline,line').forEach((p)=>{
        imp(p,'stroke','#ff3b4f');
        imp(p,'transition','stroke 180ms ease,filter 180ms ease');
        imp(p,'filter',on?'drop-shadow(0 0 2px rgba(255,59,79,.85))':'none');
      });
    }
  }

  function bind(el){
    if(!el||triggers.has(el))return;
    triggers.add(el);
    sync(el);
    const mo=new MutationObserver(()=>requestAnimationFrame(()=>sync(el)));
    mo.observe(el,{attributes:true,attributeFilter:['aria-expanded','class']});
    observers.set(el,mo);
    ['click','pointerup','keyup'].forEach((type)=>el.addEventListener(type,()=>{
      requestAnimationFrame(()=>sync(el));
      setTimeout(()=>sync(el),140);
    },{passive:true}));
  }
  function scan(){document.querySelectorAll('body > #header-send-message, body > .message').forEach(bind);}
  function syncAll(){
    scan();
    triggers.forEach(sync);
    const anyOpen=[...triggers].some(openState);
    if(!anyOpen && root.classList.contains('ah-message-persist-open')){
      root.classList.remove('ah-message-persist-open');
      try{sessionStorage.removeItem('ah-message-open-v1');}catch(_){}
    }
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',syncAll,{once:true});else syncAll();
  window.addEventListener('pageshow',syncAll,{passive:true});
  new MutationObserver(syncAll).observe(root,{attributes:true,attributeFilter:['class']});
  new MutationObserver(syncAll).observe(document.body||root,{childList:true,subtree:true,attributes:true,attributeFilter:['class','aria-hidden']});
})();
