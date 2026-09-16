(() => {
  'use strict';
const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const stage = $('#lite-model-stage');
  const modelShell = $('#lite-model-shell');
  let activeIndustry = null;
  let scrollToken = 0;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const frameCache = new Map();

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

  const urlFor=(index)=>`./models/who-we-help-industry-helix-round1093.html?industry=${encodeURIComponent(index)}&v=1372r`;

  function sendActivity(frame,active){
    try{
      frame?.contentWindow?.postMessage({type:'automated-hearts:learning-activity',active:!!active},'*');
      frame?.contentWindow?.postMessage({type:'automated-hearts:viewport-activity',active:!!active},'*');
      frame?.contentWindow?.postMessage({type:'engine-visibility',visible:!!active},'*');
    }catch(_){}
  }

  function ensureIndustry(index){
    const key=String(index);
    if(frameCache.has(key)) return frameCache.get(key);
    if(!modelShell) return null;
    const frame=document.createElement('iframe');
    frame.title='Interactive Automated Hearts industry model';
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
    frame.addEventListener('load',()=>{
      if(frame.dataset.ahActive==='1') [0,80,220,520].forEach(ms=>setTimeout(()=>sendActivity(frame,true),ms));
      else [0,120,360].forEach(ms=>setTimeout(()=>sendActivity(frame,false),ms));
    });
    modelShell.appendChild(frame);
    frameCache.set(key,frame);
    frame.src=urlFor(index);
    return frame;
  }

  function warmSelectedIndustry(index){
    ensureIndustry(index);
  }

  function showIndustry(index){
    activeIndustry=String(index);
    const active=ensureIndustry(activeIndustry);
    frameCache.forEach((frame,key)=>{
      const on=key===activeIndustry && frame===active;
      frame.dataset.ahActive=on?'1':'0';
      frame.setAttribute('aria-hidden',on?'false':'true');
      frame.style.visibility=on?'visible':'hidden';
      frame.style.opacity=on?'1':'0';
      frame.style.pointerEvents=on?'auto':'none';
      sendActivity(frame,on);
    });
    if(modelShell) modelShell.hidden=false;
  }

  function pauseAll(){
    frameCache.forEach(frame=>{
      frame.dataset.ahActive='0';
      frame.style.pointerEvents='none';
      sendActivity(frame,false);
    });
  }

  $$('.route-label[data-industry]').forEach((el)=>el.addEventListener('click',(e)=>{
    e.preventDefault();
    const index=el.dataset.industry || '0';
    activeIndustry=String(index);
    if(stage) stage.hidden=false;
    stage?.closest('.lite-section')?.style.setProperty('content-visibility','visible');
    if(modelShell){
      modelShell.hidden=false;
      modelShell.style.position='relative';
    }
    warmSelectedIndustry(activeIndustry); // Hydrate this section's 3D model before the scroll finishes.
    smoothToElement(modelShell,1850).then((finished)=>{if(finished!==false)showIndustry(activeIndustry);});
  }));

  if(stage){
    const back=document.createElement('button');
    back.type='button';
    back.className='lite-return-control';
    back.textContent='Choose another industry';
    if(modelShell && modelShell.parentNode===stage) stage.insertBefore(back,modelShell);
    else stage.prepend(back);
    const forceBackStyle=()=>{
      const st=back.style;
      const imp=(k,v)=>st.setProperty(k,v,'important');
      imp('position','relative'); imp('z-index','30'); imp('display','flex');
      imp('align-items','center'); imp('justify-content','center');
      imp('width','min(92%, 390px)'); imp('min-height','48px');
      imp('margin','0 auto 16px'); imp('padding','9px 14px');
      imp('border','1px solid rgba(143,255,215,.72)'); imp('border-radius','10px');
      imp('outline','0'); imp('background-color','#07111b');
      imp('background-image',"linear-gradient(180deg,rgba(24,43,60,.34),rgba(5,15,24,.12) 40%,rgba(0,5,10,.36)),url('./assets/home-carbon-fiber-procedural-round714.webp')");
      imp('background-position','center,center'); imp('background-size','100% 100%,180px 180px');
      imp('color','#f5fbff'); imp('font-family','Orbitron,system-ui,sans-serif');
      imp('font-size','clamp(13px,3.8vw,17px)'); imp('font-weight','700'); imp('line-height','1');
      imp('text-align','center');
      imp('box-shadow','inset 0 1px 0 rgba(255,255,255,.12),inset 0 -8px 12px rgba(0,0,0,.42),0 2px 0 rgba(143,255,215,.68),0 5px 9px rgba(143,255,215,.20)');
      imp('transform','none');
    };
    forceBackStyle();
    back.addEventListener('click',async()=>{
      back.disabled=true;
      try{
        pauseAll();
        await smoothToElement(document.querySelector('.route-grid'),1900);
        if(modelShell) modelShell.hidden=true;
        stage.hidden=true;
      }finally{back.disabled=false;}
    });
  }

  document.addEventListener('visibilitychange',()=>{
    if(document.hidden) pauseAll();
    else if(activeIndustry!==null) showIndustry(activeIndustry);
  });
})();
