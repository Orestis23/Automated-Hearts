/* Automated Hearts Round 1641 — deterministic Home sign + reversible LED/bulb progress. */
(()=>{
  'use strict';
  if(window.__ahRound1641HomeProgress) return;
  window.__ahRound1641HomeProgress=1;

  const desktop=()=>matchMedia('(min-width:901px)').matches;
  let resizeRaf=0;

  function installProgress(){
    if(!desktop()) return false;
    const body=document.body;
    if(!body || body.dataset.page!=='home') return false;
    const sign=document.querySelector('body > .rim-page-name-screen.footer-page-screen.header-page-screen--top');
    if(!sign) return false;
    const label=sign.querySelector(':scope > .footer-page-led:not(.ah1641-page-name-dark-clone), :scope > .header-page-led:not(.ah1641-page-name-dark-clone)');
    if(!label) return false;

    let fill=sign.querySelector(':scope > .page-sign-progress-inverse');
    if(!fill){
      fill=document.createElement('span');
      fill.className='page-sign-progress-inverse';
      fill.setAttribute('aria-hidden','true');
      sign.insertBefore(fill,sign.firstChild);
    }
    fill.classList.add('ah1641-page-progress-fill');
    fill.replaceChildren();
    fill.setAttribute('aria-hidden','true');

    let clone=sign.querySelector(':scope > .ah1641-page-name-dark-clone');
    if(!clone){
      clone=label.cloneNode(true);
      clone.removeAttribute('aria-label');
      clone.removeAttribute('role');
      clone.setAttribute('aria-hidden','true');
      clone.classList.add('ah1641-page-name-dark-clone');
      sign.appendChild(clone);
    }
    clone.textContent=label.textContent;

    // Pixel-match the live LED label box so every dot/bulb in the dark clone sits
    // directly on the light original, regardless of responsive width changes.
    const sr=sign.getBoundingClientRect();
    const lr=label.getBoundingClientRect();
    const cs=getComputedStyle(label);
    const set=(p,v)=>clone.style.setProperty(p,v,'important');
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
    set('white-space',cs.whiteSpace);
    set('text-align',cs.textAlign);
    return true;
  }

  function sync(){
    cancelAnimationFrame(resizeRaf);
    resizeRaf=requestAnimationFrame(installProgress);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',sync,{once:true});
  else sync();
  addEventListener('load',sync,{once:true});
  addEventListener('resize',sync,{passive:true});
  addEventListener('ah:persistent-route-complete',()=>setTimeout(sync,0));
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(sync).catch(()=>{});
  setTimeout(sync,120);
  setTimeout(sync,450);
})();
