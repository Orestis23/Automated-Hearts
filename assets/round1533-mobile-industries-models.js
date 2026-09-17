(()=>{
  'use strict';
  if(window.__AH1533MobileIndustriesModels)return;
  window.__AH1533MobileIndustriesModels=1;
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const stage=$('#lite-model-stage'), modelShell=$('#lite-model-shell');
  const reducedMotion=false; // Round 1536: explicit smooth-transition authority.
  const frameCache=new Map();
  let activeIndustry=null, modelIndex=0, scrollToken=0, transitioning=false;
  let rootAnchorSnapshot=null;
  const freezeRootAnchor=()=>{
    if(rootAnchorSnapshot!==null)return;
    const r=document.documentElement;
    rootAnchorSnapshot={value:r.style.getPropertyValue('overflow-anchor'),priority:r.style.getPropertyPriority('overflow-anchor')};
    r.style.setProperty('overflow-anchor','none','important');
  };
  const restoreRootAnchor=()=>{
    if(rootAnchorSnapshot===null)return;
    const r=document.documentElement,snap=rootAnchorSnapshot;rootAnchorSnapshot=null;
    if(snap.value)r.style.setProperty('overflow-anchor',snap.value,snap.priority||'');else r.style.removeProperty('overflow-anchor');
  };
  const SCROLL_DOWN_MS=2600, SHIELD_MS=2000, SCROLL_UP_MS=2600;
  const SHIELD_EASE='cubic-bezier(.22,.66,.24,1)';
  function scroller(){return document.scrollingElement||document.documentElement;}
  function viewportHeight(){return Math.round(window.visualViewport?.height||window.innerHeight);}
  function maxScroll(){const s=scroller();return Math.max(0,s.scrollHeight-viewportHeight());}
  function stageTopTarget(){
    if(!stage)return maxScroll();
    const s=scroller(),start=s.scrollTop,rect=stage.getBoundingClientRect();
    /* Mobile chrome reserves 72px at the top both standalone and when embedded
       in the persistent shell. Target that exact visual boundary so the viewport
       lock never needs a late corrective snap. */
    const topInset=72;
    return Math.max(0,Math.min(maxScroll(),start+rect.top-topInset));
  }
  function animateScroll(target,duration){
    const token=++scrollToken,s=scroller(),start=s.scrollTop;
    target=Math.max(0,Math.min(maxScroll(),target));
    const delta=target-start,prevBehavior=s.style.scrollBehavior,prevAnchor=s.style.overflowAnchor;
    document.body.dataset.ahStageScrolling='1';
    s.style.setProperty('scroll-behavior','auto','important');
    s.style.setProperty('overflow-anchor','none','important');
    const cleanup=()=>{
      if(prevBehavior)s.style.scrollBehavior=prevBehavior;else s.style.removeProperty('scroll-behavior');
      if(prevAnchor)s.style.overflowAnchor=prevAnchor;else s.style.removeProperty('overflow-anchor');
      if(token===scrollToken){delete document.body.dataset.ahStageScrolling;window.dispatchEvent(new Event('automated-hearts:stage-scroll-end'));}
    };
    if(Math.abs(delta)<2){s.scrollTop=target;cleanup();return Promise.resolve(true);}
    return new Promise(resolve=>{const t0=performance.now(),ease=u=>u*u*u*(u*(u*6-15)+10);const step=now=>{if(token!==scrollToken){cleanup();resolve(false);return;}const u=Math.min(1,(now-t0)/duration);s.scrollTop=start+delta*ease(u);if(u<1)requestAnimationFrame(step);else{s.scrollTop=target;cleanup();resolve(true);}};requestAnimationFrame(step);});
  }
  function primeStageHeight(){if(!stage)return;const vh=Math.round(window.visualViewport?.height||window.innerHeight),h=Math.max(248,vh-72-74-12);stage.style.setProperty('--ah1527-model-stage-height',`${h}px`);stage.style.setProperty('--ah1528-model-stage-height',`${h}px`);const parent=stage.closest('.lite-section');if(parent){parent.style.setProperty('--ah1527-model-stage-height',`${h}px`);parent.style.setProperty('--ah1528-model-stage-height',`${h}px`);}}
  function ensureShield(){if(!stage)return null;let shield=stage.querySelector(':scope > .ah1528-model-shield');if(!shield){shield=document.createElement('div');shield.className='ah1528-model-shield';shield.setAttribute('aria-hidden','true');stage.appendChild(shield);}return shield;}
  function waitTransform(el,ms){if(!el||reducedMotion)return Promise.resolve();return new Promise(resolve=>{let done=false,timer=0;const finish=()=>{if(done)return;done=true;clearTimeout(timer);el.removeEventListener('transitionend',end);el.removeEventListener('transitioncancel',cancel);resolve();};const end=e=>{if(e.target===el&&e.propertyName==='transform')finish();};const cancel=e=>{if(e.target===el)finish();};el.addEventListener('transitionend',end);el.addEventListener('transitioncancel',cancel);timer=setTimeout(finish,ms+280);});}
  function setShieldClosed(){const shield=ensureShield();if(!shield)return;shield.style.setProperty('transition','none','important');shield.style.setProperty('transform','translate3d(0,0,0)','important');shield.style.setProperty('pointer-events','auto','important');shield.getBoundingClientRect();}
  async function lowerShield(){const shield=ensureShield();if(!shield)return;shield.style.setProperty('transition','none','important');shield.style.setProperty('transform','translate3d(0,0,0)','important');shield.style.setProperty('pointer-events','auto','important');shield.getBoundingClientRect();if(reducedMotion){shield.style.setProperty('transform','translate3d(0,101.5%,0)','important');shield.style.setProperty('pointer-events','none','important');return;}const done=waitTransform(shield,SHIELD_MS);shield.style.setProperty('transition',`transform ${SHIELD_MS}ms ${SHIELD_EASE}`,'important');requestAnimationFrame(()=>shield.style.setProperty('transform','translate3d(0,101.5%,0)','important'));await done;shield.style.setProperty('transform','translate3d(0,101.5%,0)','important');shield.style.setProperty('pointer-events','none','important');}
  async function raiseShield(){const shield=ensureShield();if(!shield)return;shield.style.setProperty('transition','none','important');shield.style.setProperty('transform','translate3d(0,101.5%,0)','important');shield.style.setProperty('pointer-events','auto','important');shield.getBoundingClientRect();if(reducedMotion){shield.style.setProperty('transform','translate3d(0,0,0)','important');return;}const done=waitTransform(shield,SHIELD_MS);shield.style.setProperty('transition',`transform ${SHIELD_MS}ms ${SHIELD_EASE}`,'important');requestAnimationFrame(()=>shield.style.setProperty('transform','translate3d(0,0,0)','important'));await done;shield.style.setProperty('transform','translate3d(0,0,0)','important');}
  const urlsFor=index=>[`./models/who-we-help-industry-helix-round1093.html?industry=${encodeURIComponent(index)}&v=1533r`,'./models/who-we-help-readiness-signals-round1513.html?v=1533r'];
  function sendActivity(frame,active){try{frame?.contentWindow?.postMessage({type:'automated-hearts:learning-activity',active:!!active},'*');frame?.contentWindow?.postMessage({type:'automated-hearts:viewport-activity',active:!!active},'*');frame?.contentWindow?.postMessage({type:'engine-visibility',visible:!!active},'*');}catch(_){} }
  function ensureFrame(url){if(!modelShell||!url)return null;if(frameCache.has(url))return frameCache.get(url);const frame=document.createElement('iframe');frame.title='Interactive Automated Hearts industry model';frame.loading='eager';frame.allow='webgl';frame.setAttribute('allowtransparency','true');frame.setAttribute('aria-hidden','true');Object.assign(frame.style,{position:'absolute',inset:'0',width:'100%',height:'100%',border:'0',visibility:'hidden',opacity:'0',pointerEvents:'none'});frame.addEventListener('load',()=>{frame.dataset.ah1533Loaded='1';if(frame.dataset.ahActive==='1'){requestAnimationFrame(()=>requestAnimationFrame(()=>{frame.style.opacity='1';}));}const live=frame.dataset.ahActive==='1'&&document.body.dataset.ahModelHalf==='bottom'&&document.body.dataset.ahStageTransition!=='1';[0,80,220,520].forEach(ms=>setTimeout(()=>sendActivity(frame,live),ms));});modelShell.appendChild(frame);frameCache.set(url,frame);frame.src=url;return frame;}
  function warm(index){urlsFor(index).forEach((url,i)=>{if(i===0)ensureFrame(url);else setTimeout(()=>ensureFrame(url),100);});}
  function showCurrent(){if(activeIndustry===null||!modelShell)return;const urls=urlsFor(activeIndustry),url=urls[modelIndex]||urls[0],active=ensureFrame(url);frameCache.forEach(frame=>{const on=frame===active;frame.dataset.ahActive=on?'1':'0';frame.setAttribute('aria-hidden',on?'false':'true');frame.style.visibility=on?'visible':'hidden';frame.style.opacity=(on&&frame.dataset.ah1533Loaded==='1')?'1':'0';frame.style.pointerEvents=on?'auto':'none';sendActivity(frame,on&&document.body.dataset.ahModelHalf==='bottom'&&document.body.dataset.ahStageTransition!=='1');});modelShell.hidden=false;}
  // Prepare only the selected model before visible travel; no speculative WebGL work.
  async function prepareTravelFrame(frame){
    if(!frame)return;
    if(frame.dataset.ah1533Loaded!=='1')await new Promise(resolve=>{
      let timer;
      const done=()=>{clearTimeout(timer);frame.removeEventListener('load',done);frame.removeEventListener('error',done);resolve();};
      frame.addEventListener('load',done,{once:true});frame.addEventListener('error',done,{once:true});
      timer=setTimeout(done,6000);
    });
    sendActivity(frame,true);
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    sendActivity(frame,false);
  }
  function pauseAll(){frameCache.forEach(frame=>{frame.dataset.ahActive='0';frame.style.pointerEvents='none';sendActivity(frame,false);});}
  async function openIndustry(){
    if(transitioning||activeIndustry===null||!stage||!modelShell)return;
    transitioning=true;freezeRootAnchor();document.body.dataset.ahStageTransition='1';document.body.dataset.ahModelHalf='transition-in';
    primeStageHeight();
    stage.hidden=false;stage.setAttribute('aria-hidden','false');stage.closest('.lite-section')?.style.setProperty('content-visibility','visible');modelShell.hidden=false;modelShell.style.position='relative';
    setShieldClosed();
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    try{
      const urls=urlsFor(activeIndustry),frame=ensureFrame(urls[modelIndex]||urls[0]);
      await prepareTravelFrame(frame);
      showCurrent();
      const [finished]=await Promise.all([
        animateScroll(stageTopTarget(),SCROLL_DOWN_MS),
        lowerShield()
      ]);
      if(finished===false)return;
      document.body.dataset.ahModelHalf='bottom';showCurrent();
    }finally{delete document.body.dataset.ahStageTransition;if(document.body.dataset.ahModelHalf==='bottom')showCurrent();restoreRootAnchor();window.dispatchEvent(new Event('automated-hearts:stage-transition-end'));transitioning=false;}
  }
  $$('.route-label[data-industry]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();if(transitioning)return;activeIndustry=String(el.dataset.industry||'0');modelIndex=0;void openIndustry();}));
  $('#industry-model-prev')?.addEventListener('click',()=>{if(transitioning||activeIndustry===null)return;const urls=urlsFor(activeIndustry);modelIndex=(modelIndex-1+urls.length)%urls.length;showCurrent();});
  $('#industry-model-next')?.addEventListener('click',()=>{if(transitioning||activeIndustry===null)return;const urls=urlsFor(activeIndustry);modelIndex=(modelIndex+1)%urls.length;showCurrent();});
  const back=$('#industry-choose-another');
  back?.addEventListener('click',async event=>{
    event.preventDefault();if(transitioning)return;back.disabled=true;transitioning=true;freezeRootAnchor();document.body.dataset.ahStageTransition='1';document.body.dataset.ahModelHalf='transition-out';
    try{pauseAll();await Promise.all([raiseShield(),animateScroll(0,SCROLL_UP_MS)]);await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));if(modelShell)modelShell.hidden=true;if(stage){stage.hidden=true;stage.setAttribute('aria-hidden','true');}activeIndustry=null;modelIndex=0;document.body.dataset.ahModelHalf='top';setShieldClosed();document.querySelector('[data-industry]')?.focus({preventScroll:true});}finally{delete document.body.dataset.ahStageTransition;restoreRootAnchor();window.dispatchEvent(new Event('automated-hearts:stage-transition-end'));transitioning=false;back.disabled=false;}
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseAll();else if(activeIndustry!==null&&document.body.dataset.ahModelHalf==='bottom'&&document.body.dataset.ahStageTransition!=='1')showCurrent();});
  document.body.dataset.ahModelHalf='top';setShieldClosed();
})();
