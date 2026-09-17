/* Automated Hearts Round 1562 — message/explore press authority + home process-screen geometry. */
(()=>{
  'use strict';
  if(window.__AH_R1562_CONTROL_AUTHORITY__) return;
  window.__AH_R1562_CONTROL_AUTHORITY__=true;
  const MQ='(min-width:801px)';
  const imp=(el,p,v)=>el&&el.style.setProperty(p,v,'important');
  const MSG='body[data-page] > a#header-send-message.header-send-message.mechanical-send-control';
  const EXP='body.page-home[data-page="home"] #negative-software-explore, body.page-home[data-page="home"] .explore-key';
  const MSG_REST='none';
  const MSG_DOWN='inset 0 3px 6px rgba(0,0,0,.24)';
  const EXP_REST='0 8px 16px -10px rgba(143,255,215,.22), 0 10px 20px -14px rgba(255,46,168,.18)';
  const EXP_DOWN='inset 0 3px 6px rgba(0,0,0,.24), 0 8px 16px -10px rgba(143,255,215,.22), 0 10px 20px -14px rgba(255,46,168,.18), 0 0 7px rgba(255,46,168,.06)';
  let active=null, releaseTimer=0;
  const desktop=()=>matchMedia(MQ).matches;
  function setRest(el){
    if(!el)return;
    imp(el,'transition','transform 115ms cubic-bezier(.2,.78,.24,1), box-shadow 150ms ease');
    imp(el,'transform-origin','50% 50%');
    imp(el,'transform','translate3d(0,0,0) scale(1)');
    imp(el,'translate','none');imp(el,'scale','1');
    imp(el,'box-shadow',el.matches(MSG)?MSG_REST:EXP_REST);
  }
  function setDown(el){
    if(!el)return;
    imp(el,'transition','transform 115ms cubic-bezier(.2,.78,.24,1), box-shadow 150ms ease');
    imp(el,'transform-origin','50% 50%');
    imp(el,'transform','translate3d(0,3px,0) scale(.97)');
    imp(el,'translate','none');imp(el,'scale','1');
    imp(el,'box-shadow',el.matches(MSG)?MSG_DOWN:EXP_DOWN);
  }
  function target(node){return node?.closest?.(`${MSG},${EXP}`)||null;}
  function applyHome(){
    if(!desktop()||document.body?.dataset.page!=='home')return;
    const grid=document.querySelector('#home-solution-framework .negative-software-grid-round344');
    if(grid){
      imp(grid,'--r1005-process-height','286px');imp(grid,'--r1005-process-min-height','286px');imp(grid,'--r1005-process-max-height','286px');imp(grid,'align-items','start');
    }
    document.querySelectorAll('#home-solution-framework .negative-software-grid-round344 > article.home-process-stage.negative-software-screen-round344.ah-home-process-box:not(.home-process-stage--key)').forEach(el=>{imp(el,'height','286px');imp(el,'min-height','286px');imp(el,'max-height','286px');});
    const key=document.querySelector('#home-solution-framework .negative-software-grid-round344 > article.home-process-stage--key');
    if(key){imp(key,'height','250px');imp(key,'min-height','250px');imp(key,'max-height','250px');}
    document.querySelectorAll('#home-solution-framework .negative-software-grid-round344 > article.ah-home-process-box:not(.home-process-stage--key) > h3, #home-solution-framework .negative-software-grid-round344 > article.ah-home-process-box:not(.home-process-stage--key) > h3 *, #home-solution-framework .r1176-process-heading-label').forEach(el=>{imp(el,'text-shadow','none');imp(el,'filter','none');});
    document.querySelectorAll(EXP).forEach(el=>{if(el!==active)setRest(el);});
  }
  function applyMessage(){if(!desktop())return;const m=document.querySelector(MSG);if(m&&m!==active)setRest(m);}
  function apply(){if(!desktop())return;applyMessage();applyHome();}
  document.addEventListener('pointerdown',e=>{if(!desktop())return;const el=target(e.target);if(!el)return;clearTimeout(releaseTimer);active=el;setDown(el);},true);
  function release(){const el=active;if(!el)return;clearTimeout(releaseTimer);releaseTimer=setTimeout(()=>{if(active===el)active=null;setRest(el);},125);}
  document.addEventListener('pointerup',release,true);document.addEventListener('pointercancel',release,true);
  document.addEventListener('keydown',e=>{if(!desktop()||!['Enter',' '].includes(e.key))return;const el=target(e.target);if(!el)return;active=el;setDown(el);},true);
  document.addEventListener('keyup',e=>{if(['Enter',' '].includes(e.key))release();},true);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
  addEventListener('pageshow',apply);addEventListener('resize',apply,{passive:true});addEventListener('ah:persistent-route-complete',apply);
  addEventListener('load',()=>{apply();setTimeout(apply,100);setTimeout(apply,400);},{once:true});
})();
