(() => {
  'use strict';
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((regs)=>regs.forEach((r)=>r.unregister())).catch(()=>{});
  }
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const stage = $('#lite-model-stage');
  const modelShell = $('#lite-model-shell');
  let selected = null;
  let modelIndex = 0;
  let scrollToken = 0;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const frameCache = new Map();

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

  function sendActivity(frame, active){
    try{
      frame?.contentWindow?.postMessage({type:'automated-hearts:learning-activity',active:!!active},'*');
      frame?.contentWindow?.postMessage({type:'automated-hearts:viewport-activity',active:!!active},'*');
      frame?.contentWindow?.postMessage({type:'engine-visibility',visible:!!active},'*');
    }catch(_){}
  }

  function ensureFrame(url){
    if(!modelShell || !url) return null;
    if(frameCache.has(url)) return frameCache.get(url);
    const frame=document.createElement('iframe');
    frame.title='Interactive Automated Hearts 3D model';
    frame.loading='eager';
    frame.allow='webgl';
    frame.setAttribute('allowtransparency','true');
    frame.setAttribute('aria-hidden','true');
    frame.style.position='absolute';
    frame.style.inset='0';
    frame.style.width='100%';
    frame.style.height='100%';
    frame.style.border='0';
    frame.style.visibility='hidden';
    frame.style.opacity='0';
    frame.style.pointerEvents='none';
    frame.style.transform='none';
    frame.addEventListener('load',()=>{
      if(frame.dataset.ahActive==='1'){
        [0,80,220,520].forEach(ms=>setTimeout(()=>sendActivity(frame,true),ms));
      }else{
        [0,100,360].forEach(ms=>setTimeout(()=>sendActivity(frame,false),ms));
      }
    });
    modelShell.appendChild(frame);
    frameCache.set(url,frame);
    frame.src=url;
    return frame;
  }

  function warmGroup(group){
    const urls=learningModels[group]||[];
    urls.forEach((url,index)=>{
      if(index===0) ensureFrame(url);
      else setTimeout(()=>ensureFrame(url),80*index);
    });
  }

  function showModel(url){
    if(!modelShell || !url) return;
    const active=ensureFrame(url);
    frameCache.forEach((frame)=>{
      const on=frame===active;
      frame.dataset.ahActive=on?'1':'0';
      frame.setAttribute('aria-hidden',on?'false':'true');
      frame.style.visibility=on?'visible':'hidden';
      frame.style.opacity=on?'1':'0';
      frame.style.pointerEvents=on?'auto':'none';
      sendActivity(frame,on);
    });
    modelShell.hidden=false;
  }

  function pauseAll(){
    frameCache.forEach(frame=>{
      frame.dataset.ahActive='0';
      frame.style.pointerEvents='none';
      sendActivity(frame,false);
    });
  }

  $$('.route-label[data-lite-learning]').forEach((el) => el.addEventListener('click', (e) => {
    e.preventDefault();
    selected=el.dataset.liteLearning;
    modelIndex=0;
    if(stage) stage.hidden=false;
    stage?.closest('.lite-section')?.style.setProperty('content-visibility','visible');
    if(modelShell){
      modelShell.hidden=false;
      modelShell.style.position='relative';
    }
    const models=learningModels[selected] || [];
    warmGroup(selected); // Load every model in this lesson while the stage opens.
    const ctrls=$('#model-controls');
    if(ctrls){
      const multi=models.length>1;
      ctrls.hidden=!multi;
      ctrls.style.setProperty('display',multi?'flex':'none','important');
      ctrls.style.setProperty('visibility',multi?'visible':'hidden','important');
      ctrls.style.setProperty('pointer-events',multi?'auto':'none','important');
    }
    smoothToElement(modelShell,1850).then((finished)=>{
      if(finished===false || !selected || !learningModels[selected]) return;
      showModel(learningModels[selected][0]);
    });
  }));

  $('#model-prev')?.addEventListener('click',()=>{
    if(!selected) return;
    const models=learningModels[selected];
    modelIndex=(modelIndex-1+models.length)%models.length;
    showModel(models[modelIndex]);
  });

  $('#model-next')?.addEventListener('click',()=>{
    if(!selected) return;
    const models=learningModels[selected];
    modelIndex=(modelIndex+1)%models.length;
    showModel(models[modelIndex]);
  });

  $('#learning-choose-another')?.addEventListener('click', async (event)=>{
    event.preventDefault();
    const button=event.currentTarget;
    button.disabled=true;
    try{
      pauseAll();
      const choices=document.querySelector('.route-grid') || document.querySelector('[data-lite-learning]')?.closest('.lite-section');
      await smoothToElement(choices,1900);
      if(modelShell) modelShell.hidden=true;
      if(stage) stage.hidden=true;
      selected=null;
      modelIndex=0;
      document.querySelector('[data-lite-learning]')?.focus({preventScroll:true});
    } finally {
      button.disabled=false;
    }
  });

  document.addEventListener('visibilitychange',()=>{
    if(document.hidden) pauseAll();
    else if(selected){
      const models=learningModels[selected]||[];
      showModel(models[modelIndex]||models[0]);
    }
  });
})();
