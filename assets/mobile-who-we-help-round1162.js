(() => {
  'use strict';
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((regs)=>regs.forEach((r)=>r.unregister())).catch(()=>{});
  }
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const stage = $('#lite-model-stage');
  const modelShell = $('#lite-model-shell');
  let frame = null;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function smoothToElement(el,duration=1850){
    if(!el) return Promise.resolve();
    const scroller=document.scrollingElement||document.documentElement;
    const start=scroller.scrollTop;
    const fixedHeader=document.querySelector('.page-chip,.mobile-page-title,.lite-page-title');
    const headerOffset=fixedHeader ? Math.max(0,fixedHeader.getBoundingClientRect().height+18) : 18;
    const target=Math.max(0,start+el.getBoundingClientRect().top-headerOffset);
    const delta=target-start;
    if(reducedMotion||Math.abs(delta)<2){scroller.scrollTop=target;return Promise.resolve();}
    return new Promise(resolve=>{
      const t0=performance.now();
      const ease=t=>t<.5?16*t*t*t*t*t:1-Math.pow(-2*t+2,5)/2;
      const step=now=>{
        const u=Math.min(1,(now-t0)/duration);
        scroller.scrollTop=start+delta*ease(u);
        if(u<1)requestAnimationFrame(step);else{scroller.scrollTop=target;resolve();}
      };
      requestAnimationFrame(step);
    });
  }

  function unloadModel(){
    if(frame){
      frame.src='about:blank';
      frame.remove();
      frame=null;
    }
    if(modelShell) modelShell.hidden=true;
  }

  function loadIndustry(index){
    if(!modelShell) return;
    unloadModel();
    frame=document.createElement('iframe');
    frame.title='Interactive Automated Hearts industry model';
    frame.loading='eager';
    frame.allow='webgl';
    frame.setAttribute('allowtransparency','true');
    frame.src=`./models/who-we-help-industry-helix-round1093.html?industry=${encodeURIComponent(index)}&v=1160r`;
    modelShell.appendChild(frame);
    modelShell.hidden=false;
  }

  $$('[data-industry]').forEach((el)=>el.addEventListener('click',(e)=>{
    e.preventDefault();
    const index=el.dataset.industry || '0';
    if(stage) stage.hidden=false;
    smoothToElement(stage,1850).then(()=>loadIndustry(index));
  }));

  document.addEventListener('visibilitychange',()=>{ if(document.hidden) unloadModel(); });
})();
