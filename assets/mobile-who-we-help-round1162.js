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
  let scrollToken = 0;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function smoothToElement(el,duration=1850){
    const token=++scrollToken;
    if(!el) return Promise.resolve();
    const scroller=document.scrollingElement||document.documentElement;
    const start=scroller.scrollTop;
    const rect=el.getBoundingClientRect();
    const target=el===modelShell
      ? Math.max(0,Math.min(scroller.scrollHeight-innerHeight,start+rect.top+rect.height/2-innerHeight/2))
      : 0;
    const delta=target-start;
    if(reducedMotion||Math.abs(delta)<2){scroller.scrollTop=target;return Promise.resolve();}
    return new Promise(resolve=>{
      const t0=performance.now();
      const ease=t=>t<.5?16*t*t*t*t*t:1-Math.pow(-2*t+2,5)/2;
      const step=now=>{
        if(token!==scrollToken){resolve(false);return;}
        const u=Math.min(1,(now-t0)/duration);
        scroller.scrollTop=start+delta*ease(u);
        if(u<1)requestAnimationFrame(step);else{scroller.scrollTop=target;resolve(true);}
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
    frame.src=`./models/who-we-help-industry-helix-round1093.html?industry=${encodeURIComponent(index)}&v=1353r`;
    modelShell.appendChild(frame);
    modelShell.hidden=false;
  }

  $$('[data-industry]').forEach((el)=>el.addEventListener('click',(e)=>{
    e.preventDefault();
    const index=el.dataset.industry || '0';
    if(stage) stage.hidden=false;
    stage.closest('.lite-section').style.contentVisibility='visible';
    modelShell.hidden=false;
    smoothToElement(modelShell,1850).then((finished)=>{if(finished!==false)loadIndustry(index);});
  }));

  if(stage){
    const back=document.createElement('button');
    back.type='button';
    back.className='lite-return-control';
    back.textContent='Choose another industry';
    stage.appendChild(back);
    back.addEventListener('click',async()=>{
      back.disabled=true;
      try{
        frame?.contentWindow?.postMessage({type:'automated-hearts:learning-activity',active:false},'*');
        await smoothToElement(document.querySelector('.route-grid'),1900);
        unloadModel();
        stage.hidden=true;
      }finally{back.disabled=false;}
    });
  }

  document.addEventListener('visibilitychange',()=>{ if(document.hidden) unloadModel(); });
})();
