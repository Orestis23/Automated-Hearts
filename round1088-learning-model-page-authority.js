/* Automated Hearts Round 1088 — authoritative Learning Center model controller.
   Owns route clicks, deterministic model reveal, and the return sequence.
   Return sequence is intentionally serialized: embossed local shield rises for 2 seconds,
   then the page scrolls slowly to its chooser, then the lower model stage is collapsed. */
(()=>{
  'use strict';
  if(window.__AH1088LearningModelAuthority) return;
  window.__AH1088LearningModelAuthority=1;
  window.__AH1084LearningModelAuthority=1;
  window.__AH1083LearningModelAuthority=1;
  window.__AH1081ModelAuthority=1;
  window.__AH1076ModelAuthority=1; window.__AH1079ModelAuthority=1;
  const BG='./assets/page-shield-embossed-strong-round1067.webp?v=1088r';
  const DURATION=1150;
  const RETURN_SHIELD_MS=2000;
  const RETURN_SCROLL_MS=1750;
  const RETURN_EASE='cubic-bezier(.22,.66,.24,1)';
  let state={page:'',stage:null,viewport:null,slides:[],group:'ai101',index:0,industry:0,activeFrame:null};
  const imp=(el,p,v)=>el&&el.style.setProperty(p,v,'important');
  const FRAME_BG='url("./assets/page-shield-embossed-strong-round1067.webp?v=1088r")';
  const paintFrame=(frame)=>{if(!frame)return;imp(frame,'background-color','#08172b');imp(frame,'background-image',FRAME_BG);imp(frame,'background-position','center center');imp(frame,'background-size','cover');imp(frame,'background-repeat','no-repeat');};
  const wake=(frame,on)=>{
    if(!frame?.contentWindow)return;
    for(const msg of [
      {type:'engine-visibility',visible:!!on},
      {type:'automated-hearts:learning-activity',active:!!on},
      {type:'automated-hearts:viewport-activity',active:!!on}
    ]){try{frame.contentWindow.postMessage(msg,'*')}catch(_){}}
  };
  const init=()=>{
    const page=document.body?.dataset?.page||'';
    if(page!=='learning'&&page!=='who-we-help')return false;
    const stage=document.getElementById(page==='learning'?'learning-model-stage':'who-help-model-stage');
    if(!stage)return false;
    state.page=page; state.stage=stage;
    state.viewport=stage.querySelector(':scope > .learning-lesson-viewport');
    state.slides=Array.from(stage.querySelectorAll('.learning-lesson-slide'));
    return true;
  };
  const scrollerFor=(el)=>{
    for(let p=el?.parentElement;p&&p!==document.body&&p!==document.documentElement;p=p.parentElement){
      const s=getComputedStyle(p); if(/auto|scroll/.test(s.overflowY)&&p.scrollHeight>p.clientHeight+4)return p;
    }
    return document.scrollingElement||document.documentElement;
  };
  const animateScroll=(host,target,duration)=>new Promise(resolve=>{
    const start=host.scrollTop;
    const delta=target-start;
    if(Math.abs(delta)<2){host.scrollTop=target;resolve();return;}
    const t0=performance.now();
    const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
    const step=now=>{
      const t=Math.min(1,(now-t0)/duration);
      host.scrollTop=start+delta*ease(t);
      if(t<1)requestAnimationFrame(step);else{host.scrollTop=target;resolve();}
    };
    requestAnimationFrame(step);
  });
  const smoothTo=(el,duration=DURATION)=>new Promise(resolve=>{
    if(!el){resolve();return;}
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      const host=scrollerFor(el), docHost=(host===document.scrollingElement||host===document.documentElement||host===document.body);
      const start=host.scrollTop;
      const hr=docHost?{top:0}:host.getBoundingClientRect();
      const er=el.getBoundingClientRect();
      const target=Math.max(0,start+(er.top-hr.top));
      animateScroll(host,target,duration).then(resolve);
    }));
  });
  const smoothToChoices=(duration=RETURN_SCROLL_MS)=>{
    const anchor=document.getElementById(state.page==='learning'?'learning-route-buttons':'who-we-help-solutions');
    if(!anchor)return Promise.resolve();
    return new Promise(resolve=>{
      requestAnimationFrame(()=>requestAnimationFrame(()=>{
        const host=scrollerFor(anchor),docHost=(host===document.scrollingElement||host===document.documentElement||host===document.body);
        const start=host.scrollTop;
        const hr=docHost?{top:0}:host.getBoundingClientRect();
        const er=anchor.getBoundingClientRect();
        const frameTop=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--current-frame-top'))||0;
        const target=Math.max(0,start+(er.top-hr.top)-frameTop-8);
        animateScroll(host,target,duration).then(resolve);
      }));
    });
  };
  const paintStaticBackdrop=()=>{
    const {stage,viewport}=state;if(!stage)return;
    for(const el of [stage,viewport]){
      imp(el,'background-color','#08172b');imp(el,'background-image',`url("${BG}")`);imp(el,'background-position','center center');imp(el,'background-size','cover');imp(el,'background-repeat','no-repeat');
    }
    const heart=viewport?.querySelector(':scope > .r1060-static-model-heart');
    if(heart){imp(heart,'display','block');imp(heart,'visibility','visible');imp(heart,'opacity','1');imp(heart,'position','absolute');imp(heart,'inset','0');imp(heart,'z-index','0');imp(heart,'background-color','#08172b');imp(heart,'background-image',`url("${BG}")`);imp(heart,'background-position','center center');imp(heart,'background-size','cover');imp(heart,'background-repeat','no-repeat');imp(heart,'transform','none');imp(heart,'animation','none');imp(heart,'transition','none');imp(heart,'pointer-events','none');}
    const track=viewport?.querySelector(':scope > .learning-lesson-track');
    if(track){imp(track,'background','transparent');imp(track,'background-color','transparent');imp(track,'background-image','none');}
    stage.querySelectorAll('.learning-lesson-slide iframe').forEach(paintFrame);
  };
  const showStage=()=>{
    if(!state.stage&&!init())return false;
    const {stage,viewport}=state;
    document.documentElement.classList.remove('ah-learning-choice-locked');
    document.body.classList.remove('ah-model-stage-locked');
    document.body.classList.add('r1073-model-open','r1075-model-open','r1076-model-open','r1079-model-open');
    stage.removeAttribute('hidden');stage.setAttribute('aria-hidden','false');
    for(const [p,v] of [['display','block'],['visibility','visible'],['opacity','1'],['pointer-events','auto']])imp(stage,p,v);
    if(viewport)for(const [p,v] of [['display','block'],['visibility','visible'],['opacity','1'],['pointer-events','auto']])imp(viewport,p,v);
    const shield=stage.querySelector(':scope > [data-learning-stage-shield]');
    if(shield){
      imp(stage,'overflow','hidden');
      imp(shield,'display','block');imp(shield,'visibility','visible');imp(shield,'opacity','1');
      imp(shield,'position','absolute');imp(shield,'inset','0');imp(shield,'z-index','140');
      imp(shield,'background-color','#08172b');imp(shield,'background-image',`url("${BG}")`);
      imp(shield,'background-position','center center');imp(shield,'background-size','cover');imp(shield,'background-repeat','no-repeat');
      imp(shield,'transform','translate3d(0,101.5%,0)');imp(shield,'transition','none');
      imp(shield,'will-change','transform');imp(shield,'backface-visibility','hidden');imp(shield,'pointer-events','none');
    }
    paintStaticBackdrop(); return true;
  };
  const sourceFor=(frame)=>{
    if(!frame)return'';
    if(state.page==='who-we-help'&&frame.closest('[data-shared-slide="helix"]'))return `./models/who-we-help-industry-helix-round1093.html?industry=${state.industry}&v=1125r`;
    const raw=frame.dataset.src||frame.getAttribute('src')||'';if(!raw)return'';
    try{const u=new URL(raw,location.href);u.searchParams.set('v','1125r');return u.href}catch(_){return raw}
  };
  const groupSlides=()=>state.page==='learning'?state.slides.filter(s=>s.dataset.learningSlide===state.group):state.slides;
  const prefetchAI101=()=>{
    if(state.page!=='learning'||state.group!=='ai101')return;
    const list=state.slides.filter(s=>s.dataset.learningSlide==='ai101');
    const warm=()=>list.forEach(slide=>{const frame=slide.querySelector('iframe');const raw=frame?.dataset?.src;if(!raw)return;try{const u=new URL(raw,location.href);u.searchParams.set('v','1125r');fetch(u.href,{cache:'force-cache',credentials:'same-origin'}).catch(()=>{});}catch(_){}});
    if('requestIdleCallback'in window)requestIdleCallback(warm,{timeout:900});else setTimeout(warm,220);
  };
  const syncOrbs=(list)=>{
    if(!state.stage)return;
    const single=(list?.length||0)<=1;
    if(state.page==='learning')state.stage.dataset.learningGroup=state.group||'';
    state.stage.querySelectorAll(':scope > .learning-lesson-orb').forEach(orb=>{
      orb.disabled=single;
      orb.setAttribute('aria-hidden',single?'true':'false');
      imp(orb,'display',single?'none':'block');
      imp(orb,'visibility',single?'hidden':'visible');
      imp(orb,'opacity',single?'0':'1');
      imp(orb,'pointer-events',single?'none':'auto');
    });
  };
  const activate=(n,{scroll=false,force=false,direction='' }={})=>{
    if(!showStage())return;
    const list=groupSlides();if(!list.length)return;
    syncOrbs(list);
    state.index=((n%list.length)+list.length)%list.length;
    const selected=list[state.index];
    const ai101OrbTransition=state.page==='learning'&&state.group==='ai101'&&!scroll&&(direction==='next'||direction==='previous');
    state.slides.forEach(slide=>{
      const on=slide===selected;slide.hidden=!on;slide.classList.toggle('is-active',on);slide.setAttribute('aria-hidden',on?'false':'true');
      for(const [p,v] of [['display',on?'block':'none'],['visibility',on?'visible':'hidden'],['opacity',on?'1':'0'],['pointer-events',on?'auto':'none'],['transform','none']])imp(slide,p,v);
      const f=slide.querySelector('iframe');if(f&&!on)wake(f,false);
    });
    if(ai101OrbTransition){
      selected.dataset.r1084Transitioning='1';
      imp(selected,'transition','none');
      imp(selected,'transform','none');
      imp(selected,'opacity','.18');
      selected.getBoundingClientRect();
      requestAnimationFrame(()=>requestAnimationFrame(()=>{
        imp(selected,'transition','opacity 520ms ease-out');
        imp(selected,'opacity','1');
      }));
      setTimeout(()=>{if(selected.dataset.r1084Transitioning==='1'){delete selected.dataset.r1084Transitioning;imp(selected,'transition','none');imp(selected,'transform','none');imp(selected,'opacity','1');}},620);
    }
    const frame=selected.querySelector('iframe');state.activeFrame=frame;
    if(frame){
      frame.loading='eager';frame.tabIndex=0;paintFrame(frame);
      for(const [p,v] of [['display','block'],['visibility','visible'],['opacity','1'],['pointer-events','auto'],['transform','none']])imp(frame,p,v);
      const src=sourceFor(frame),old=frame.getAttribute('src')||'';
      const sendIndustry=()=>{if(state.page==='who-we-help'&&selected.dataset.sharedSlide==='helix'&&frame?.contentWindow){try{frame.contentWindow.postMessage({type:'automated-hearts:who-help-industry',industryIndex:state.industry},'*')}catch(_){}}};
      const ping=()=>{wake(frame,true);sendIndustry();};
      frame.addEventListener('load',()=>{paintStaticBackdrop();[0,80,220,500,1000,1800].forEach(ms=>setTimeout(ping,ms));},{once:true});
      if(src&&(force||old!==src))frame.setAttribute('src',src);else [0,80,220,500,1000].forEach(ms=>setTimeout(ping,ms));
    }
    const status=state.stage.querySelector('[data-learning-carousel-status],[data-shared-carousel-status]');if(status)status.textContent=`${selected.dataset.modelName||'Model'} selected.`;
    /* Legacy runtimes contain delayed layout work. Reassert the chosen stage/frame a
       few times without restarting the scroll or renderer. */
    [60,180,420,900,1600,2800].forEach(ms=>setTimeout(()=>{
      if(returning||state.activeFrame!==frame||!document.body.classList.contains('r1079-model-open'))return;
      showStage();
      selected.hidden=false;selected.classList.add('is-active');selected.setAttribute('aria-hidden','false');
      for(const [p,v] of [['display','block'],['visibility','visible'],['pointer-events','auto']])imp(selected,p,v);
      if(!selected.dataset.r1084Transitioning){imp(selected,'opacity','1');imp(selected,'transform','none');}
      if(frame)for(const [p,v] of [['display','block'],['visibility','visible'],['opacity','1'],['pointer-events','auto'],['transform','none']])imp(frame,p,v);
      paintStaticBackdrop();wake(frame,true);
    },ms));
    if(scroll)smoothTo(state.stage);
  };
  let returning=false;
  const waitForTransform=(el,ms)=>new Promise(resolve=>{
    let done=false,timer=0;
    const finish=()=>{if(done)return;done=true;clearTimeout(timer);el.removeEventListener('transitionend',onEnd);el.removeEventListener('transitioncancel',onCancel);resolve();};
    const onEnd=e=>{if(e.target===el&&e.propertyName==='transform')finish();};
    const onCancel=e=>{if(e.target===el)finish();};
    el.addEventListener('transitionend',onEnd);el.addEventListener('transitioncancel',onCancel);
    timer=setTimeout(finish,ms+260);
  });
  const raiseReturnShield=async()=>{
    if(!state.stage&&!init())return;
    const shield=state.stage.querySelector(':scope > [data-learning-stage-shield]');
    if(!shield){await new Promise(r=>setTimeout(r,RETURN_SHIELD_MS));return;}
    /* Start completely below the model well, then move the full embossed surface upward
       as one compositor layer until it fully covers the 3D scene. */
    imp(state.stage,'overflow','hidden');
    imp(shield,'display','block');imp(shield,'visibility','visible');imp(shield,'opacity','1');
    imp(shield,'position','absolute');imp(shield,'inset','0');imp(shield,'z-index','140');
    imp(shield,'background-color','#08172b');imp(shield,'background-image',`url("${BG}")`);
    imp(shield,'background-position','center center');imp(shield,'background-size','cover');imp(shield,'background-repeat','no-repeat');
    imp(shield,'will-change','transform');imp(shield,'backface-visibility','hidden');imp(shield,'pointer-events','auto');
    imp(shield,'transition','none');imp(shield,'transform','translate3d(0,101.5%,0)');
    shield.getBoundingClientRect();
    const finished=waitForTransform(shield,RETURN_SHIELD_MS);
    imp(shield,'transition',`transform ${RETURN_SHIELD_MS}ms ${RETURN_EASE}`);
    requestAnimationFrame(()=>imp(shield,'transform','translate3d(0,0,0)'));
    await finished;
    imp(shield,'transform','translate3d(0,0,0)');
  };
  const resetReturnShield=()=>{
    const shield=state.stage?.querySelector(':scope > [data-learning-stage-shield]');
    if(!shield)return;
    imp(shield,'transition','none');imp(shield,'transform','translate3d(0,101.5%,0)');
    imp(shield,'pointer-events','none');
  };
  const hideStage=async()=>{
    if(returning)return;
    if(!state.stage&&!init())return;
    returning=true;
    const returnButton=state.stage.querySelector('.learning-stage-return,[data-learning-choose-another],[data-who-help-back-to-top]');
    if(returnButton) returnButton.disabled=true;
    try{
      /* 1) The embossed model shield rises slowly and completely covers the model. */
      await raiseReturnShield();
      /* Stop the hidden WebGL work before scrolling so the scroll has maximum compositor budget. */
      state.slides.forEach(s=>wake(s.querySelector('iframe'),false));
      /* 2) Only after the shield is fully closed, scroll smoothly back to the page's choice controls. */
      await smoothToChoices(RETURN_SCROLL_MS);
      /* 3) Collapse the lower stage after the viewport is already back at the choices. */
      document.body.classList.remove('r1073-model-open','r1075-model-open','r1076-model-open','r1079-model-open');
      document.body.classList.add('ah-model-stage-locked');
      for(const [p,v] of [['display','none'],['visibility','hidden'],['opacity','0'],['pointer-events','none']])imp(state.stage,p,v);
      state.stage.setAttribute('aria-hidden','true');
      resetReturnShield();
    }finally{
      if(returnButton) returnButton.disabled=false;
      returning=false;
    }
  };
  const controlFrom=(target)=>{
    if(!(target instanceof Element))return null;
    if(!state.page)init();
    if(state.page==='learning')return target.closest('#learning-route-buttons [data-learning-model],#learning-route-buttons article.r987-learning-flat-card,#learning-model-stage [data-learning-carousel-direction],#learning-model-stage .learning-stage-return,#learning-model-stage [data-learning-choose-another]');
    if(state.page==='who-we-help')return target.closest('#who-we-help-solutions .premium-route-card__image-button,#who-we-help-solutions article.who-help-route-card,#who-help-model-stage [data-shared-carousel-direction],#who-help-model-stage .learning-stage-return,#who-help-model-stage [data-who-help-back-to-top]');
    return null;
  };
  const run=(control)=>{
    if(!control||(!state.page&&!init()))return false;
    if(state.page==='learning'){
      const route=control.closest('[data-learning-model]')||control.querySelector?.('[data-learning-model]');
      if(route){state.group=route.dataset.learningModel||'ai101';state.index=0;activate(0,{scroll:true});prefetchAI101();return true;}
      if(control.matches('[data-learning-carousel-direction="previous"]')){activate(state.index-1,{direction:'previous'});return true;}
      if(control.matches('[data-learning-carousel-direction="next"]')){activate(state.index+1,{direction:'next'});return true;}
    }else{
      const card=control.closest('article.who-help-route-card')||control.closest('.premium-route-card__image-button')?.closest('article.who-help-route-card');
      if(card){state.industry=Math.max(0,Math.min(3,(Number(card.dataset.routeIndex)||1)-1));state.index=0;activate(0,{scroll:true,force:true});return true;}
      if(control.matches('[data-shared-carousel-direction="previous"]')){activate(state.index-1,{force:true});return true;}
      if(control.matches('[data-shared-carousel-direction="next"]')){activate(state.index+1,{force:true});return true;}
    }
    if(control.matches('.learning-stage-return,[data-learning-choose-another],[data-who-help-back-to-top]')){void hideStage();return true;}
    return false;
  };
  const intercept=(event)=>{
    const c=controlFrom(event.target);if(!c)return;
    event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();run(c);
  };
  window.addEventListener('click',intercept,true);
  window.addEventListener('keydown',e=>{if(e.key!=='Enter'&&e.key!==' ')return;const c=controlFrom(e.target);if(!c)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();run(c);},true);
  const ready=()=>{init();paintStaticBackdrop();if(state.stage){for(const [p,v] of [['display','none'],['visibility','hidden'],['opacity','0'],['pointer-events','none']])imp(state.stage,p,v);state.stage.setAttribute('aria-hidden','true');}document.documentElement.classList.remove('ah-learning-choice-locked');document.body?.classList.remove('r1073-model-open','r1075-model-open','r1076-model-open','r1079-model-open');};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
})();
