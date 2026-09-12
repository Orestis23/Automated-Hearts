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
  let selected = null;
  let modelIndex = 0;
  let scrollToken = 0;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function smoothToElement(el, duration=1850){
    const token=++scrollToken;
    if(!el) return Promise.resolve();
    const scroller=document.scrollingElement||document.documentElement;
    const start=scroller.scrollTop;
    const rect=el.getBoundingClientRect();
    const target=el===modelShell
      ? Math.max(0,Math.min(scroller.scrollHeight-innerHeight,start+rect.top+rect.height/2-innerHeight/2))
      : 0;
    const delta=target-start;
    if(reducedMotion || Math.abs(delta)<2){ scroller.scrollTop=target; return Promise.resolve(); }
    return new Promise(resolve=>{
      const t0=performance.now();
      const ease=t=>t<.5?16*t*t*t*t*t:1-Math.pow(-2*t+2,5)/2;
      const step=now=>{
        if(token!==scrollToken){resolve(false);return;}
        const t=Math.min(1,(now-t0)/duration);
        scroller.scrollTop=start+delta*ease(t);
        if(t<1) requestAnimationFrame(step);
        else { scroller.scrollTop=target; resolve(true); }
      };
      requestAnimationFrame(step);
    });
  }

  const learningModels = {
    ai101: [
      './models/ai-101-core-principles-round1316.html?v=1353r',
      './models/ai-101-human-ai-partnership-mobile-round1316.html?v=1327r',
      './models/ai-101-verification-lab-round1316.html?v=1327r'
    ],
    practical: ['./models/practical-ai-skills-helix-round1316.html?v=1353r'],
    strategy: ['./models/strategy-lab-ball-round1093.html?v=1327r']
  };

  function unloadModel(){
    if(frame){
      frame.src='about:blank';
      frame.remove();
      frame=null;
    }
    if(modelShell) modelShell.hidden=true;
  }

  function loadUrl(url){
    if(!modelShell) return;
    unloadModel();
    frame=document.createElement('iframe');
    frame.title='Interactive Automated Hearts 3D model';
    frame.loading='eager';
    frame.allow='webgl';
    frame.setAttribute('allowtransparency','true');
    frame.src=url;
    modelShell.appendChild(frame);
    modelShell.hidden=false;
  }

  $$('[data-lite-learning]').forEach((el) => el.addEventListener('click', (e) => {
    e.preventDefault();
    selected=el.dataset.liteLearning;
    modelIndex=0;
    unloadModel();
    if(stage) stage.hidden=false;
    stage.closest('.lite-section').style.contentVisibility='visible';
    modelShell.hidden=false;
    const models=learningModels[selected] || [];
    const ctrls=$('#model-controls');
    if(ctrls){const multi=models.length>1;ctrls.hidden=!multi;ctrls.style.setProperty('display',multi?'flex':'none','important');ctrls.style.setProperty('visibility',multi?'visible':'hidden','important');ctrls.style.setProperty('pointer-events',multi?'auto':'none','important');}
    const scrollDuration=1850;
    smoothToElement(modelShell, scrollDuration).then((finished)=>{
      if(finished===false)return;
      if(selected && learningModels[selected]) loadUrl(learningModels[selected][0]);
    });
  }));

  $('#model-prev')?.addEventListener('click',()=>{
    if(!selected) return;
    const models=learningModels[selected];
    modelIndex=(modelIndex-1+models.length)%models.length;
    loadUrl(models[modelIndex]);
  });

  $('#model-next')?.addEventListener('click',()=>{
    if(!selected) return;
    const models=learningModels[selected];
    modelIndex=(modelIndex+1)%models.length;
    loadUrl(models[modelIndex]);
  });

  $('#learning-choose-another')?.addEventListener('click', async (event)=>{
    event.preventDefault();
    const button=event.currentTarget;
    button.disabled=true;
    try{
      frame?.contentWindow?.postMessage({type:'automated-hearts:learning-activity',active:false},'*');
      const choices=document.querySelector('.route-grid') || document.querySelector('[data-lite-learning]')?.closest('.lite-section');
      await smoothToElement(choices, 1900);
      unloadModel();
      if(stage) stage.hidden=true;
      selected=null;
      modelIndex=0;
      document.querySelector('[data-lite-learning]')?.focus({preventScroll:true});
    } finally {
      button.disabled=false;
    }
  });

  document.addEventListener('visibilitychange',()=>{ if(document.hidden) unloadModel(); });
})();
