/* Automated Hearts Round 1715 — deterministic aged page-name lamps. */
(()=>{
  'use strict';
  if(window.__ahRound1715AgedPageName) return;
  window.__ahRound1715AgedPageName=1;

  const SIGNS='body > .rim-page-name-screen.footer-page-screen.header-page-screen--top';
  let raf=0;

  function hashText(str){
    let h=2166136261>>>0;
    for(const ch of str){ h^=ch.codePointAt(0); h=Math.imul(h,16777619)>>>0; }
    return h>>>0;
  }
  function mix(seed,n){
    let x=(seed ^ Math.imul(n+1,0x45d9f3b))>>>0;
    x=Math.imul(x^(x>>>16),0x45d9f3b)>>>0;
    x=Math.imul(x^(x>>>16),0x45d9f3b)>>>0;
    return (x^(x>>>16))>>>0;
  }
  function stateMap(text){
    const letters=[...text].filter(ch=>!(/\s/u).test(ch));
    const n=letters.length;
    const seed=hashText(text);
    const states=new Array(n).fill('normal');
    const cluster= n>=12 ? 3 : 2;
    for(let i=0;i<n;i++){
      const g=Math.floor(i/cluster);
      const r=mix(seed,g)%100;
      states[i]=r<20?'hot':r<38?'dim':r<52?'burnt':'normal';
    }
    if(n>=7){
      const hotStart=(mix(seed,71)%(Math.max(1,n-2)));
      const burntStart=(hotStart+Math.max(3,Math.floor(n*.42)))%Math.max(1,n-1);
      for(let k=0;k<Math.min(3,n-hotStart);k++) states[hotStart+k]='hot';
      for(let k=0;k<Math.min(2,n-burntStart);k++) states[burntStart+k]='burnt';
    }else if(n>=3){
      states[mix(seed,13)%n]='hot';
      states[mix(seed,29)%n]='dim';
      if(n>4) states[mix(seed,47)%n]='burnt';
    }
    return {states,seed};
  }

  function build(el,text,inverse=false){
    if(!el || !text) return;
    text=text.replace(/\s+/g,' ').trim();
    if(!text) return;
    const signature=`${inverse?'i':'n'}:${text}`;
    if(el.dataset.ah1715Signature===signature && el.querySelector('.ah1715-page-char')) return;

    const {states,seed}=stateMap(text);
    const frag=document.createDocumentFragment();
    let li=0;
    [...text].forEach((ch,sourceIndex)=>{
      if(/\s/u.test(ch)){
        const space=document.createElement('span');
        space.className='ah1715-page-space';
        space.setAttribute('aria-hidden','true');
        space.textContent='\u00a0';
        frag.appendChild(space);
        return;
      }
      const state=states[li]||'normal';
      const r=mix(seed,li*11+sourceIndex);
      const span=document.createElement('span');
      span.className=`ah1715-page-char ah1715-${state}`;
      if((r%7===0 && state!=='burnt') || (state==='dim' && r%4===0)) span.classList.add('ah1715-restrike');
      span.dataset.glyph=ch;
      span.setAttribute('aria-hidden','true');
      span.textContent=ch;
      span.style.setProperty('--ah1715-x',`${r%5}px`);
      span.style.setProperty('--ah1715-y',`${(r>>>4)%5}px`);
      span.style.setProperty('--ah1715-delay',`${-((r%5200)/1000).toFixed(3)}s`);
      frag.appendChild(span);
      li++;
    });
    el.replaceChildren(frag);
    el.dataset.ah1715Signature=signature;
    el.classList.toggle('ah1715-aged-page-name',!inverse);
    el.classList.toggle('ah1715-aged-page-name-inverse',inverse);
  }

  function syncSign(sign){
    if(!sign) return;
    const label=sign.querySelector(':scope > .footer-page-led, :scope > .header-page-led');
    if(!label) return;
    const text=(label.getAttribute('data-text') || label.getAttribute('aria-label') || label.textContent || '').replace(/\s+/g,' ').trim();
    if(!text) return;
    if(!label.getAttribute('aria-label')) label.setAttribute('aria-label',text);
    build(label,text,false);

    const inverse=sign.querySelector(':scope > .ah1655-page-name-inverse');
    if(inverse){
      build(inverse,text,true);
    }
  }

  function sync(){
    cancelAnimationFrame(raf);
    raf=requestAnimationFrame(()=>document.querySelectorAll(SIGNS).forEach(syncSign));
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',sync,{once:true});
  else sync();
  addEventListener('load',sync,{once:true});
  addEventListener('pageshow',sync,{passive:true});
  addEventListener('resize',sync,{passive:true});
  addEventListener('ah:persistent-route-complete',()=>{setTimeout(sync,0);setTimeout(sync,90);});
  if(document.fonts?.ready) document.fonts.ready.then(sync).catch(()=>{});
  setTimeout(sync,80);
  setTimeout(sync,360);
})();
