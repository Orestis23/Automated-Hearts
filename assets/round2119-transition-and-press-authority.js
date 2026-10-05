/* Round 2122 — shared physical press controller. Routing owns route completion. */
(()=>{
  'use strict';
  const FOOTER='footer#site-footer a[data-nav],body > nav.footer a[href]';
  const BUTTONS='button,[role="button"],#site-footer a,nav.footer a,a.message,.message-tab,.message-button,[data-ah-message-button],.ah1807-home-window-control,.ah1940-solution-window-control,.ah-unified-spacebar,.home-process-key-button,.premium-route-card__title-sign,.explore-key,.ah1600-explore-footer-key,.ah-rates__button,.r864-rates__drawer-toggle,.r865-rates__consultation-action,.ah-mobile-contact__submit,.nav-contact-submit,a.route-label,.action,.consult,.back-top,.learning-stage-return';
  let active=null;
  const cancelPop=el=>el.getAnimations?.().filter(a=>a.id==='ah2119-release-pop').forEach(a=>a.cancel());
  const clear=(el,preserveRelease=false)=>{
    if(!preserveRelease)cancelPop(el);
    el.classList.remove('ah2119-pressing','is-pressed','is-nav-pressed','is-route-pressed');
    el.removeAttribute('data-ah-control-pressed');
    el.removeAttribute('data-ah-footer-loading');
    // Do not overwrite aria-pressed: it may describe a real toggle state.
    ['transform','translate','scale'].forEach(p=>el.style.removeProperty(p));
  };
  const release=(animate=true)=>{
    const el=active;active=null;if(!el)return;const releaseScale=getComputedStyle(el).scale||'.94';
    clear(el);
    if(animate&&!el.matches('[data-ah-brand-carbon]')&&!el.closest('#site-footer,#primary-nav,#ah-mobile-footer,nav.footer')&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&el.animate){
      const desktopFooter=!!el.closest('#site-footer,#primary-nav,#ah-mobile-footer,nav.footer');const animation=el.animate(desktopFooter?[{scale:releaseScale==='none'?'.94':releaseScale},{scale:'1'}]:[{scale:'.94'},{scale:'1.035',offset:.58},{scale:'1'}],{duration:desktopFooter?220:210,easing:desktopFooter?'cubic-bezier(.22,.7,.3,1)':'cubic-bezier(.18,.86,.28,1)'});
      animation.id='ah2119-release-pop';
    }
  };
  const press=el=>{
    if(!el||el.matches(':disabled,[aria-disabled="true"]'))return;
    if(active&&active!==el)release(false);
    active=el;cancelPop(el);el.classList.add('ah2119-pressing');
    queueMicrotask(()=>{if(active===el){el.style.setProperty('transform','scale(1)','important');el.style.setProperty('translate','none','important');el.style.setProperty('scale','.94','important');}});
  };
  const resetFooter=(doc=document)=>{
    doc.documentElement.classList.remove('ah-footer-navigation-loading');
    doc.querySelectorAll(FOOTER).forEach(el=>{if(el===active)active=null;clear(el,true);});
  };
  window.AHControls=Object.freeze({resetFooter});window.addEventListener('click',e=>{if(e.target.closest?.('#ah-mobile-footer a,nav.footer a'))setTimeout(()=>resetFooter(),0)},true);
  document.addEventListener('pointerdown',e=>{if(e.button===0)press(e.target.closest?.(BUTTONS));},true);
  window.addEventListener('pointerup',()=>release(),true);
  window.addEventListener('pointercancel',()=>release(false),true);
  addEventListener('blur',()=>release(false));
  document.addEventListener('keydown',e=>{if((e.key===' '||e.key==='Enter')&&!e.repeat)press(e.target.closest?.(BUTTONS));},true);
  document.addEventListener('keyup',e=>{if(e.key===' '||e.key==='Enter')release();},true);
  addEventListener('pageshow',()=>resetFooter());
})();
