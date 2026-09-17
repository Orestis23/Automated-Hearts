/* Automated Hearts Round 1590 — desktop footer surface/runtime authority.
   Keeps the full accent surfaces, uses a clearly visible neutral-black carbon weave,
   and explicitly removes the old hover pulse from footer buttons. */
(()=>{
  'use strict';
  if(window.__AH_R1564_FOOTER_AUTHORITY__) return;
  window.__AH_R1564_FOOTER_AUTHORITY__=true;
  const MQ='(min-width:801px)';
  const SEL='footer#site-footer nav#primary-nav a.footer-structure-control.mechanical-send-control[data-nav]';
  const REST_ART='./assets/footer-button-carbon-inner-rim-round1586.svg?v=1590r';
  const PRESSED_ART='./assets/footer-button-carbon-inner-rim-pressed-round1586.svg?v=1590r';
  const carbonFace=(overlay,pressed)=>`url("${overlay}"), linear-gradient(160deg,rgba(255,255,255,${pressed?'.075':'.12'}) 0%,rgba(255,255,255,${pressed?'.028':'.045'}) 9%,rgba(210,220,225,.025) 18%,transparent 38% 69%,rgba(255,255,255,.018) 84%,rgba(0,0,0,${pressed?'.24':'.16'}) 100%), radial-gradient(at 30% -20%,rgba(220,230,235,.08),transparent 65%), repeating-linear-gradient(135deg,rgba(185,185,185,.075) 0 3px,rgba(0,0,0,.08) 3px 6px), repeating-linear-gradient(45deg,rgba(145,145,145,.05) 0 3px,rgba(0,0,0,.07) 3px 6px), linear-gradient(#111315 0%,#08090a 48%,#030405 100%)`;
  const BG_SIZE='100% 100%, 100% 100%, 100% 100%, auto, auto, auto';
  const BG_POS='center, center, center, 0 0, 0 0, center';
  const BG_REPEAT='no-repeat, no-repeat, no-repeat, repeat, repeat, no-repeat';
  const imp=(el,p,v)=>{if(el)el.style.setProperty(p,v,'important');};
  const desktop=()=>matchMedia(MQ).matches;
  let pressed=null, raf=0, observer=null, painting=false;
  const buttons=()=>Array.from(document.querySelectorAll(SEL));

  function cleanLegacy(btn){
    btn.querySelectorAll(':scope > .ah1557-corner-layer,:scope > .ah1556-desktop-pink-accents,:scope > .ah-footer-pink-corners,:scope > .ah1451-message-match-accents,:scope > .ah1452-message-corner-overlay,:scope > .ah1453-message-corner-overlay,:scope > .ah1454-mobile-corner-overlay').forEach(n=>n.remove());
  }
  function layer(btn, cls, beforeCopy=false){
    let n=btn.querySelector(':scope > .'+cls);
    if(!n){
      n=document.createElement('span'); n.className=cls; n.setAttribute('aria-hidden','true');
      const copy=btn.querySelector(':scope > .send-control-copy.footer-control-copy');
      if(beforeCopy&&copy) btn.insertBefore(n,copy); else btn.insertBefore(n,btn.firstChild);
    }
    return n;
  }
  function veil(btn){return layer(btn,'ah1559-dim-layer',true);}
  function decorations(btn){
    btn.querySelectorAll(':scope > .ah1564-floor-shadow').forEach(n=>n.remove());
    layer(btn,'ah1564-inner-black-rim',true);
  }
  function removeFooterPulse(btn){
    btn.querySelectorAll(':scope > .ah1586-accent-pulse').forEach(n=>n.remove());
  }
  function messageStyleLabel(label,isPressed){
    const neon='#8fffd7';
    imp(label,'color',neon);
    imp(label,'-webkit-text-fill-color',neon);
    imp(label,'background','none');
    imp(label,'background-image','none');
    imp(label,'background-blend-mode','normal');
    imp(label,'background-size','auto');
    imp(label,'background-position','0 0');
    imp(label,'-webkit-background-clip','border-box');
    imp(label,'background-clip','border-box');
    imp(label,'text-shadow','none');
    imp(label,'filter',isPressed
      ? 'brightness(1.28) saturate(1.18) drop-shadow(0 0 2px rgba(209,255,241,1)) drop-shadow(0 0 7px rgba(143,255,215,.96)) drop-shadow(0 0 14px rgba(143,255,215,.72))'
      : 'brightness(1) saturate(1) drop-shadow(0 0 1px rgba(143,255,215,.18))');
  }
  function lockType(btn,hot){
    const copy=btn.querySelector('.send-control-copy.footer-control-copy');
    const label=btn.querySelector('.footer-nav-label');
    if(copy){
      imp(copy,'position','absolute');imp(copy,'z-index','30');imp(copy,'inset','0');imp(copy,'display','grid');imp(copy,'place-items','center');
      imp(copy,'width','100%');imp(copy,'height','100%');imp(copy,'margin','0');imp(copy,'padding','0 12px');imp(copy,'transform','none');imp(copy,'translate','none');imp(copy,'scale','1');imp(copy,'zoom','1');imp(copy,'filter','none');imp(copy,'animation','none');imp(copy,'transition','none');
    }
    if(label){
      imp(label,'font-family','Orbitron,system-ui,sans-serif');imp(label,'font-size','18.4px');imp(label,'font-weight','400');imp(label,'font-stretch','normal');imp(label,'font-style','normal');
      imp(label,'line-height','18.4px');imp(label,'letter-spacing','0');imp(label,'white-space','nowrap');imp(label,'text-align','center');
      imp(label,'transform','none');imp(label,'translate','none');imp(label,'scale','1');imp(label,'zoom','1');imp(label,'animation','none');imp(label,'transition','filter 180ms ease, color 180ms ease');imp(label,'opacity','1');
      messageStyleLabel(label,btn===pressed);
    }
  }
  function geometry(list){
    const nav=document.querySelector('footer#site-footer nav#primary-nav');
    const group=nav?.querySelector(':scope > .primary-nav__group');
    if(!nav||!group)return;
    const gap=innerWidth>=1200?128:96;
    const count=Math.max(1,list.length);
    const room=Math.max(480,innerWidth-32-gap*(count-1));
    const preferred=innerWidth>=1200?Math.min(280,Math.max(180,Math.floor(room/count))):Math.min(220,Math.max(145,Math.floor(room/count)));
    imp(nav,'position','absolute');imp(nav,'left','50%');imp(nav,'right','auto');imp(nav,'top','50%');imp(nav,'bottom','auto');imp(nav,'width','max-content');imp(nav,'max-width','calc(100vw - 16px)');imp(nav,'height','70px');imp(nav,'margin','0');imp(nav,'padding','0');imp(nav,'transform','translate3d(-50%,-50%,0)');imp(nav,'overflow','visible');
    imp(group,'position','relative');imp(group,'inset','auto');imp(group,'display','flex');imp(group,'align-items','center');imp(group,'justify-content','center');imp(group,'width','max-content');imp(group,'max-width','none');imp(group,'height','70px');imp(group,'margin','0');imp(group,'padding','0');imp(group,'gap',gap+'px');imp(group,'transform','none');imp(group,'overflow','visible');
    list.forEach(btn=>{imp(btn,'flex','0 0 '+preferred+'px');imp(btn,'width',preferred+'px');imp(btn,'min-width',preferred+'px');imp(btn,'max-width',preferred+'px');imp(btn,'height','70px');imp(btn,'min-height','70px');imp(btn,'max-height','70px');});
  }
  function paint(){
    raf=0;if(!desktop()||painting)return;painting=true;
    try{
      const list=buttons();if(!list.length)return;
      geometry(list);
      const hot=list.some(b=>b.matches(':hover')||b===document.activeElement||b.contains(document.activeElement))||!!pressed;
      list.forEach(btn=>{
        cleanLegacy(btn);decorations(btn);removeFooterPulse(btn);const v=veil(btn);const isDown=btn===pressed;
        imp(btn,'background-color','#050607');imp(btn,'background-image',carbonFace(isDown?PRESSED_ART:REST_ART,isDown));imp(btn,'background-size',BG_SIZE);imp(btn,'background-position',BG_POS);imp(btn,'background-repeat',BG_REPEAT);imp(btn,'background-blend-mode','normal');imp(btn,'border','0');imp(btn,'outline','0');imp(btn,'opacity','1');imp(btn,'filter','none');imp(btn,'overflow','visible');imp(btn,'isolation','isolate');
        imp(btn,'transition','transform 115ms cubic-bezier(.2,.78,.24,1), box-shadow 150ms ease');
        imp(btn,'transform',btn===pressed?'translate3d(0,3px,0) scale(.97)':'translate3d(0,0,0) scale(1)');imp(btn,'transform-origin','50% 50%');
        btn.classList.toggle('ah1559-pressed',btn===pressed);
        // Exterior shadow intentionally removed; only internal press depth remains.
        imp(btn,'box-shadow',btn===pressed?'inset 0 3px 6px rgba(0,0,0,.24), 0 0 4px rgba(255,46,168,.028)':'none');
        imp(v,'opacity',hot?'0':'1');
        lockType(btn,hot);
      });
    }finally{painting=false;}
  }
  const queue=()=>{if(!raf)raf=requestAnimationFrame(paint);};
  const find=e=>e.target?.closest?.(SEL)||null;
  document.addEventListener('pointerover',e=>{if(desktop()&&find(e))queue();},true);
  document.addEventListener('pointerout',e=>{if(desktop()&&find(e))requestAnimationFrame(queue);},true);
  document.addEventListener('focusin',e=>{if(desktop()&&find(e))queue();},true);
  document.addEventListener('focusout',e=>{if(desktop()&&find(e))requestAnimationFrame(queue);},true);
  document.addEventListener('pointerdown',e=>{if(!desktop())return;const b=find(e);if(!b)return;pressed=b;paint();},true);
  const release=()=>{const old=pressed;if(!old)return;setTimeout(()=>{if(pressed===old)pressed=null;queue();},150);};
  document.addEventListener('pointerup',release,true);document.addEventListener('pointercancel',release,true);
  document.addEventListener('keydown',e=>{if(!desktop()||!['Enter',' '].includes(e.key))return;const b=find(e);if(!b)return;pressed=b;paint();},true);
  document.addEventListener('keyup',e=>{if(['Enter',' '].includes(e.key))release();},true);
  function watch(){
    observer?.disconnect();const footer=document.querySelector('footer#site-footer');if(!footer)return;
    observer=new MutationObserver(m=>{if(painting)return;if(m.some(x=>x.type==='childList'||(x.type==='attributes'&&['class','style'].includes(x.attributeName))))queue();});
    observer.observe(footer,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style']});
  }
  addEventListener('resize',queue,{passive:true});addEventListener('pageshow',()=>{watch();queue();});addEventListener('ah:persistent-route-complete',()=>{watch();queue();});
  if(document.fonts?.ready)document.fonts.ready.then(queue).catch(()=>{});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{watch();paint();},{once:true});else{watch();paint();}
  addEventListener('load',()=>{watch();paint();setTimeout(paint,80);setTimeout(paint,350);},{once:true});
})();
