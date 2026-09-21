/* Automated Hearts Round 1655 — page-name bulb inversion alignment + footer metric lock. */
(()=>{
  'use strict';
  if(window.__ahRound1655PageFooterLock) return;
  window.__ahRound1655PageFooterLock=1;

  const desktop=()=>matchMedia('(min-width:901px)').matches;
  let raf=0;

  function lockFooter(){
    if(!desktop()) return;
    document.querySelectorAll('body > footer#site-footer a.footer-structure-control[data-nav]').forEach(btn=>{
      btn.style.setProperty('flex','0 0 var(--ah1653-footer-btn-w)','important');
      btn.style.setProperty('width','var(--ah1653-footer-btn-w)','important');
      btn.style.setProperty('min-width','var(--ah1653-footer-btn-w)','important');
      btn.style.setProperty('max-width','var(--ah1653-footer-btn-w)','important');
      btn.style.setProperty('height','70px','important');
      btn.style.setProperty('min-height','70px','important');
      btn.style.setProperty('max-height','70px','important');
      const label=btn.querySelector('.footer-nav-label');
      if(label){
        label.style.setProperty('font-family','Orbitron,system-ui,sans-serif','important');
        label.style.setProperty('font-size','18.4px','important');
        label.style.setProperty('font-weight','400','important');
        label.style.setProperty('font-style','normal','important');
        label.style.setProperty('font-stretch','normal','important');
        label.style.setProperty('line-height','18.4px','important');
        label.style.setProperty('letter-spacing','0','important');
        label.style.setProperty('white-space','nowrap','important');
        label.style.setProperty('transform','none','important');
        label.style.setProperty('transition','none','important');
        label.style.setProperty('animation','none','important');
      }
    });
  }

  function syncPageName(){
    if(!desktop()) return;
    document.querySelectorAll('body > .rim-page-name-screen.footer-page-screen.header-page-screen--top').forEach(sign=>{
      const label=sign.querySelector(':scope > .footer-page-led, :scope > .header-page-led');
      if(!label) return;

      sign.querySelectorAll(':scope > .ah1641-page-name-dark-clone').forEach(n=>n.remove());
      sign.querySelectorAll(':scope > .page-sign-progress-inverse > .ah1643-page-progress-text').forEach(n=>n.remove());

      let inverse=sign.querySelector(':scope > .ah1655-page-name-inverse');
      if(!inverse){
        inverse=document.createElement('span');
        inverse.className='ah1655-page-name-inverse';
        inverse.setAttribute('aria-hidden','true');
        sign.appendChild(inverse);
      }
      inverse.textContent=(label.textContent||'').replace(/\s+/g,' ').trim();

      const sr=sign.getBoundingClientRect();
      const lr=label.getBoundingClientRect();
      const cs=getComputedStyle(label);
      const set=(prop,val)=>inverse.style.setProperty(prop,val,'important');
      set('left',`${lr.left-sr.left}px`);
      set('top',`${lr.top-sr.top}px`);
      set('width',`${lr.width}px`);
      set('height',`${lr.height}px`);
      set('padding-left',cs.paddingLeft);
      set('padding-right',cs.paddingRight);
      set('padding-top',cs.paddingTop);
      set('padding-bottom',cs.paddingBottom);
      set('font-family',cs.fontFamily);
      set('font-size',cs.fontSize);
      set('font-weight',cs.fontWeight);
      set('font-style',cs.fontStyle);
      set('line-height',cs.lineHeight);
      set('letter-spacing',cs.letterSpacing);
      set('text-transform',cs.textTransform);
      set('white-space',cs.whiteSpace);
      set('text-align',cs.textAlign);
    });
  }

  function sync(){
    cancelAnimationFrame(raf);
    raf=requestAnimationFrame(()=>{lockFooter();syncPageName();});
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',sync,{once:true});
  else sync();
  addEventListener('load',sync,{once:true});
  addEventListener('resize',sync,{passive:true});
  addEventListener('pageshow',sync,{passive:true});
  addEventListener('ah:persistent-route-complete',()=>setTimeout(sync,0));
  if(document.fonts?.ready) document.fonts.ready.then(sync).catch(()=>{});
  setTimeout(sync,80);
  setTimeout(sync,320);
})();
