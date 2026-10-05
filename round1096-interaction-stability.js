/* Automated Hearts Round 2106 — non-blocking interaction stability.
   The old Round 1097 runtime intercepted every native resize, paused embedded content,
   waited 180ms, and then replayed a synthetic resize. Responsive work is now batched by
   round2106-responsive-coordinator.js, so this file keeps only the stale-shield failsafe. */
(()=>{
  'use strict';
  if(window.__AH2106InteractionStability)return;
  window.__AH2106InteractionStability=1;
  const root=document.documentElement;
  const ARRIVAL_FAILSAFE_MS=3200;
  const NAVIGATION_FAILSAFE_MS=5200;

  const frameShouldRun=(frame)=>{
    if(!frame?.isConnected||frame.hidden)return false;
    const slide=frame.closest('.learning-lesson-slide,[data-shared-slide]');
    if(slide&&!slide.classList.contains('is-active'))return false;
    const rect=frame.getBoundingClientRect();
    return rect.width>1&&rect.height>1&&rect.bottom>0&&rect.top<innerHeight;
  };
  const resumeVisibleFrames=()=>{
    document.querySelectorAll('iframe').forEach(frame=>{
      const active=frameShouldRun(frame);
      try{
        frame.contentWindow?.postMessage({type:'engine-visibility',visible:active},'*');
        frame.contentWindow?.postMessage({type:'automated-hearts:learning-activity',active},'*');
        frame.contentWindow?.postMessage({type:'automated-hearts:viewport-activity',active},'*');
      }catch(_){}
    });
  };
  const shieldIsStale=()=>root.classList.contains('page-shield-arrival')
    ||root.classList.contains('page-shield-covering')
    ||root.classList.contains('page-shield-revealing')
    ||root.dataset.pageShieldState==='covered'
    ||root.dataset.pageShieldState==='covering'
    ||root.dataset.pageShieldState==='revealing';
  const releaseStaleShield=()=>{
    if(!shieldIsStale())return;
    const shield=document.getElementById('page-transition-shield');
    const panel=shield?.querySelector('.page-transition-shield__panel');
    root.classList.remove('page-shield-arrival','page-shield-covering','page-shield-revealing','routed-page-arrival');
    root.dataset.pageShieldState='open';
    delete root.dataset.pageShieldMotion;
    if(shield)shield.style.setProperty('pointer-events','none','important');
    if(panel){
      panel.getAnimations?.().forEach(animation=>animation.cancel());
      panel.style.setProperty('transition','none','important');
      panel.style.setProperty('transform','translate3d(0,-101.25%,0)','important');
      panel.style.setProperty('-webkit-transform','translate3d(0,-101.25%,0)','important');
      panel.style.setProperty('pointer-events','none','important');
    }
    document.body?.removeAttribute('aria-busy');
    document.querySelectorAll('.is-route-pressed,.is-route-shielding,.is-nav-pressed').forEach(item=>{
      item.classList.remove('is-route-pressed','is-route-shielding','is-nav-pressed');
    });
    window.dispatchEvent(new CustomEvent('ah:persistent-route-complete'));
    window.dispatchEvent(new CustomEvent('ah:page-shield-open'));
    requestAnimationFrame(resumeVisibleFrames);
  };
  const armArrivalFailsafe=()=>window.setTimeout(releaseStaleShield,ARRIVAL_FAILSAFE_MS);
  const armNavigationFailsafe=()=>window.setTimeout(releaseStaleShield,NAVIGATION_FAILSAFE_MS);
  document.addEventListener('DOMContentLoaded',()=>{
    document.getElementById('page-transition-shield')?.style.setProperty('pointer-events','none','important');
    if(shieldIsStale())armArrivalFailsafe();
  },{once:true});
  document.addEventListener('click',event=>{
    if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    const link=event.target instanceof Element?event.target.closest('a[href]'):null;
    if(!link||link.hasAttribute('download')||link.hasAttribute('data-contact-trigger'))return;
    let destination;try{destination=new URL(link.href,location.href)}catch(_){return}
    if(destination.origin===location.origin)armNavigationFailsafe();
  },true);
  window.addEventListener('pageshow',()=>{if(shieldIsStale())armArrivalFailsafe()},{passive:true});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&shieldIsStale())armArrivalFailsafe()},{passive:true});
})();
