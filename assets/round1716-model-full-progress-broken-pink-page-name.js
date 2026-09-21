/* Automated Hearts Round 1716 — force 100% progress in locked 3D stages and
   replace only the progress-covered part of every page name with broken pink LEDs. */
(()=>{
  'use strict';
  if(window.__ahRound1716ProgressName) return;
  window.__ahRound1716ProgressName=1;

  const SIGN_SELECTOR='body > .rim-page-name-screen.footer-page-screen.header-page-screen--top';
  let raf=0;

  function hashText(str){
    let h=2166136261>>>0;
    for(const ch of str){h^=ch.codePointAt(0);h=Math.imul(h,16777619)>>>0;}
    return h>>>0;
  }
  function mix(seed,n){
    let x=(seed ^ Math.imul(n+1,0x45d9f3b))>>>0;
    x=Math.imul(x^(x>>>16),0x45d9f3b)>>>0;
    x=Math.imul(x^(x>>>16),0x45d9f3b)>>>0;
    return (x^(x>>>16))>>>0;
  }
  function statesFor(text){
    const n=[...text].filter(ch=>!(/\s/u).test(ch)).length;
    const seed=hashText(`covered:${text}`);
    const states=new Array(n).fill('normal');
    const cluster=n>=12?3:2;
    for(let i=0;i<n;i++){
      const r=mix(seed,Math.floor(i/cluster))%100;
      states[i]=r<18?'hot':r<39?'burnt':r<58?'dim':'normal';
    }
    if(n>=6){
      const burntStart=mix(seed,91)%Math.max(1,n-2);
      const hotStart=(burntStart+Math.max(3,Math.floor(n*.43)))%Math.max(1,n-1);
      for(let k=0;k<Math.min(3,n-burntStart);k++)states[burntStart+k]='burnt';
      for(let k=0;k<Math.min(2,n-hotStart);k++)states[hotStart+k]='hot';
    }else if(n){
      states[mix(seed,17)%n]='hot';
      if(n>2)states[mix(seed,31)%n]='burnt';
    }
    return {states,seed};
  }

  function buildPink(overlay,text){
    const signature=text.replace(/\s+/g,' ').trim();
    if(!signature) return;
    if(overlay.dataset.ah1716Signature===signature && overlay.querySelector('.ah1716-pink-char')) return;
    const {states,seed}=statesFor(signature);
    const frag=document.createDocumentFragment();
    let li=0;
    [...signature].forEach((ch,sourceIndex)=>{
      if(/\s/u.test(ch)){
        const s=document.createElement('span');
        s.className='ah1716-pink-space';
        s.setAttribute('aria-hidden','true');
        s.textContent='\u00a0';
        frag.appendChild(s);
        return;
      }
      const state=states[li]||'normal';
      const r=mix(seed,li*13+sourceIndex);
      const span=document.createElement('span');
      span.className=`ah1716-pink-char ah1716-${state}`;
      if((r%6===0 && state!=='burnt') || (state==='dim' && r%3===0))span.classList.add('ah1716-restrike');
      span.dataset.glyph=ch;
      span.setAttribute('aria-hidden','true');
      span.textContent=ch;
      span.style.setProperty('--ah1716-x',`${r%5}px`);
      span.style.setProperty('--ah1716-y',`${(r>>>4)%5}px`);
      span.style.setProperty('--ah1716-delay',`${-((r%5000)/1000).toFixed(3)}s`);
      frag.appendChild(span);
      li++;
    });
    overlay.replaceChildren(frag);
    overlay.dataset.ah1716Signature=signature;
  }

  function alignOverlay(sign){
    const label=sign.querySelector(':scope > .footer-page-led, :scope > .header-page-led');
    if(!label)return;
    const text=(label.getAttribute('aria-label')||label.getAttribute('data-text')||label.textContent||'').replace(/\s+/g,' ').trim();
    if(!text)return;
    let overlay=sign.querySelector(':scope > .ah1716-progress-page-name');
    if(!overlay){
      overlay=document.createElement('span');
      overlay.className='ah1716-progress-page-name';
      overlay.setAttribute('aria-hidden','true');
      sign.appendChild(overlay);
    }
    buildPink(overlay,text);

    const sr=sign.getBoundingClientRect();
    const lr=label.getBoundingClientRect();
    const cs=getComputedStyle(label);
    const set=(p,v)=>overlay.style.setProperty(p,v,'important');
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
  }

  function modelProgressMustBeFull(){
    const half=document.body?.dataset?.ahModelHalf||'';
    return half==='bottom'||half==='transition-out';
  }

  function forceModelProgress(){
    const full=modelProgressMustBeFull();
    document.querySelectorAll(SIGN_SELECTOR).forEach(sign=>{
      if(full){
        sign.classList.add('ah1716-model-progress-full');
        sign.style.setProperty('--page-sign-scroll-progress','1','important');
        sign.style.setProperty('--page-sign-scroll-percent','100%','important');
        sign.dataset.scrollProgress='1.0000';
        sign.setAttribute('data-scroll-percent','100');
      }else if(sign.classList.contains('ah1716-model-progress-full')){
        sign.classList.remove('ah1716-model-progress-full');
        sign.style.removeProperty('--page-sign-scroll-progress');
        sign.style.removeProperty('--page-sign-scroll-percent');
        // Let the site's existing progress authority immediately restore the live value.
        requestAnimationFrame(()=>{
          window.dispatchEvent(new Event('scroll'));
          document.dispatchEvent(new Event('scroll',{bubbles:false}));
        });
      }
    });
  }

  function sync(){
    cancelAnimationFrame(raf);
    raf=requestAnimationFrame(()=>{
      document.querySelectorAll(SIGN_SELECTOR).forEach(alignOverlay);
      forceModelProgress();
    });
  }

  function observeBody(){
    if(!document.body)return;
    const mo=new MutationObserver(sync);
    mo.observe(document.body,{attributes:true,attributeFilter:['data-ah-model-half','data-ah-stage-transition','class','data-page']});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{observeBody();sync();},{once:true});
  else{observeBody();sync();}
  addEventListener('load',sync,{once:true});
  addEventListener('pageshow',sync,{passive:true});
  addEventListener('resize',sync,{passive:true});
  addEventListener('scroll',forceModelProgress,{passive:true,capture:true});
  addEventListener('automated-hearts:stage-scroll-end',sync,{passive:true});
  addEventListener('automated-hearts:stage-transition-end',sync,{passive:true});
  addEventListener('ah:persistent-route-complete',()=>{setTimeout(sync,0);setTimeout(sync,100);});
  if(document.fonts?.ready)document.fonts.ready.then(sync).catch(()=>{});
  setTimeout(sync,80);
  setTimeout(sync,360);
})();
