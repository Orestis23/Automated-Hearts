/* Automated Hearts Round 1533 — authoritative Industries industry-model controller.
   Owns route clicks, deterministic model reveal, and the return sequence.
   Return sequence is intentionally serialized: embossed local shield rises for 2 seconds,
   then the page scrolls slowly to its chooser, then the lower model stage is collapsed. */
(()=>{
  'use strict';
  if(window.__AH1533WhoHelpModelAuthority) return;
  window.__AH1533WhoHelpModelAuthority=1;
  window.__AH1528WhoHelpModelAuthority=1;
  window.__AH1088WhoHelpModelAuthority=1;
  /* Mark older authorities as superseded before their deferred runtimes can attach competing handlers. */
  window.__AH1081ModelAuthority=1; window.__AH1076ModelAuthority=1; window.__AH1079ModelAuthority=1;
  const BG='./assets/page-shield-smoked-heart.webp?v=1533r';
  const MODEL_BG='./assets/model-backdrop-heartless-leather-desktop-round1323.webp?v=1327r';
  const DURATION=2600;
  const OPEN_SHIELD_MS=2000;
  const RETURN_SHIELD_MS=2000;
  const RETURN_SCROLL_MS=2600;
  const RETURN_EASE='cubic-bezier(.22,.66,.24,1)';
  let state={page:'',stage:null,viewport:null,slides:[],group:'ai101',index:0,industry:0,activeFrame:null};
  const imp=(el,p,v)=>{if(el&&el.style.getPropertyValue(p)!==v)el.style.setProperty(p,v,'important');};
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
  const reducedMotion=false; // Round 1536: explicit smooth-transition authority.
  const afterTwoFrames=()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  const animateScroll=(host,target,duration)=>new Promise(resolve=>{
    const limit=Math.max(0,host.scrollHeight-host.clientHeight);
    target=Math.max(0,Math.min(limit,target));
    const start=host.scrollTop;
    const delta=target-start;
    const prevBehavior=host.style.scrollBehavior;
    const prevAnchor=host.style.overflowAnchor;
    document.body.dataset.ahStageScrolling='1';
    host.style.setProperty('scroll-behavior','auto','important');
    host.style.setProperty('overflow-anchor','none','important');
    const finish=()=>{
      host.scrollTop=target;
      if(prevBehavior)host.style.scrollBehavior=prevBehavior;else host.style.removeProperty('scroll-behavior');
      if(prevAnchor)host.style.overflowAnchor=prevAnchor;else host.style.removeProperty('overflow-anchor');
      delete document.body.dataset.ahStageScrolling;
      window.dispatchEvent(new Event('automated-hearts:stage-scroll-end'));
      resolve();
    };
    if(Math.abs(delta)<2){finish();return;}
    const t0=performance.now();
    const ease=t=>t*t*t*(t*(t*6-15)+10);
    const step=now=>{
      const t=Math.min(1,(now-t0)/duration);
      host.scrollTop=start+delta*ease(t);
      if(t<1)requestAnimationFrame(step);else finish();
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
      imp(el,'background-color','#08172b');imp(el,'background-image',`url("${MODEL_BG}")`);imp(el,'background-position','center center');imp(el,'background-size','cover');imp(el,'background-repeat','no-repeat');
    }
    const heart=viewport?.querySelector(':scope > .r1060-static-model-heart');
    if(heart){imp(heart,'display','block');imp(heart,'visibility','visible');imp(heart,'opacity','1');imp(heart,'position','absolute');imp(heart,'inset','0');imp(heart,'z-index','0');imp(heart,'background-color','#08172b');imp(heart,'background-image',`url("${MODEL_BG}")`);imp(heart,'background-position','center center');imp(heart,'background-size','cover');imp(heart,'background-repeat','no-repeat');imp(heart,'transform','none');imp(heart,'animation','none');imp(heart,'transition','none');imp(heart,'pointer-events','none');}
    const track=viewport?.querySelector(':scope > .learning-lesson-track');
    if(track){imp(track,'background','transparent');imp(track,'background-color','transparent');imp(track,'background-image','none');}
  };
  const primeStageHeight=()=>{
    if(!state.stage&&!init())return;
    const s=state.stage, sc=scrollerFor(s);
    const docHost=(sc===document.scrollingElement||sc===document.documentElement||sc===document.body);
    let h=0;
    if(!docHost){
      h=sc.clientHeight;
    }else{
      const rs=getComputedStyle(document.documentElement);
      const top=parseFloat(rs.getPropertyValue('--current-frame-top'))||0;
      const bottom=parseFloat(rs.getPropertyValue('--current-frame-bottom'))||0;
      const vh=Math.round(window.visualViewport?.height||window.innerHeight);
      h=Math.max(248,vh-Math.max(0,top)-Math.max(0,bottom)-12);
    }
    if(!h)return;
    s.style.setProperty('--ah1527-model-stage-height',`${h}px`);
    s.style.setProperty('--ah1528-model-stage-height',`${h}px`);
    const parent=s.closest('.lite-section');
    if(parent){parent.style.setProperty('--ah1527-model-stage-height',`${h}px`);parent.style.setProperty('--ah1528-model-stage-height',`${h}px`);}
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
      imp(shield,'background-position','center center');imp(shield,'background-size','cover');imp(shield,'background-repeat','no-repeat');imp(shield,'box-sizing','border-box');imp(shield,'border-top','2px solid #CDAA4D');
      if(!shield.dataset.ah1528Prepared){
        imp(shield,'transition','none');imp(shield,'transform','translate3d(0,0,0)');
        shield.dataset.ah1528Prepared='1';
      }
      imp(shield,'will-change','transform');imp(shield,'backface-visibility','hidden');imp(shield,'pointer-events','auto');
    }
    paintStaticBackdrop(); return true;
  };
  const sourceFor=(frame)=>{
    if(!frame)return'';
    if(state.page==='who-we-help'&&frame.closest('[data-shared-slide="helix"]'))return `./models/who-we-help-industry-helix-round1093.html?industry=${state.industry}&v=1353r`;
    const raw=frame.dataset.src||frame.getAttribute('src')||'';if(!raw)return'';
    try{const u=new URL(raw,location.href);u.searchParams.set('v','1327r');return u.href}catch(_){return raw}
  };
  const groupSlides=()=>state.page==='learning'?state.slides.filter(s=>s.dataset.learningSlide===state.group):state.slides;
  const activate=(n,{scroll=false,force=false}={})=>{
    if(!state.stage&&!init())return;
    if(scroll)document.body.dataset.ahStageTransition='1';
    primeStageHeight();
    if(!showStage())return;
    const list=groupSlides();if(!list.length)return;
    state.index=((n%list.length)+list.length)%list.length;
    const selected=list[state.index];
    state.slides.forEach(slide=>{
      const on=slide===selected;slide.hidden=!on;slide.classList.toggle('is-active',on);slide.setAttribute('aria-hidden',on?'false':'true');
      for(const [p,v] of [['display',on?'block':'none'],['visibility',on?'visible':'hidden'],['opacity',on?'1':'0'],['pointer-events',on?'auto':'none'],['background','transparent'],['background-color','transparent'],['background-image','none'],['transform','none']])imp(slide,p,v);
      const f=slide.querySelector('iframe');if(f&&!on)wake(f,false);
    });
    const frame=selected.querySelector('iframe');state.activeFrame=frame;
    /* Round 1372: hydrate every other model in this opened section immediately.
       They stay hidden and paused, but their HTML/assets/WebGL setup are ready before
       the user advances the carousel. */
    const hydrateHiddenFrames=()=>list.forEach(slide=>{
      if(slide===selected)return;
      const hiddenFrame=slide.querySelector('iframe');
      if(!hiddenFrame)return;
      hiddenFrame.loading='eager';
      const hiddenSrc=sourceFor(hiddenFrame), hiddenOld=hiddenFrame.getAttribute('src')||'';
      if(hiddenSrc&&hiddenOld!==hiddenSrc){
        hiddenFrame.addEventListener('load',()=>{wake(hiddenFrame,false);},{once:true});
        hiddenFrame.setAttribute('src',hiddenSrc);
      }else if(hiddenOld){
        wake(hiddenFrame,false);
      }
    });
    if(scroll){
      setTimeout(()=>{if(document.body.dataset.ahModelHalf==='bottom'&&document.body.dataset.ahStageTransition!=='1')hydrateHiddenFrames();},DURATION+OPEN_SHIELD_MS+360);
    }else hydrateHiddenFrames();
    if(frame){
      frame.loading='eager';frame.tabIndex=0;
      for(const [p,v] of [['display','block'],['visibility','visible'],['opacity',frame.dataset.ah1533Loaded==='1'?'1':'0'],['pointer-events','auto'],['background','transparent'],['background-color','transparent'],['background-image','none'],['transform','none']])imp(frame,p,v);
      const src=sourceFor(frame),old=frame.getAttribute('src')||'';
      const sendIndustry=()=>{if(state.page==='who-we-help'&&selected.dataset.sharedSlide==='helix'&&frame?.contentWindow){try{frame.contentWindow.postMessage({type:'automated-hearts:who-help-industry',industryIndex:state.industry},'*')}catch(_){}}};
      const ping=()=>{const live=document.body.dataset.ahModelHalf==='bottom'&&document.body.dataset.ahStageTransition!=='1';wake(frame,live);if(live)sendIndustry();};
      frame.addEventListener('load',()=>{frame.dataset.ah1533Loaded='1';if(frame===state.activeFrame){requestAnimationFrame(()=>requestAnimationFrame(()=>imp(frame,'opacity','1')));}paintStaticBackdrop();[0,80,220,500,1000,1800].forEach(ms=>setTimeout(ping,ms));},{once:true});
      if(src&&(force||old!==src)){if(scroll)frame.dataset.ahPendingSrc=src;else frame.setAttribute('src',src);}else [0,80,220,500,1000].forEach(ms=>setTimeout(ping,ms));
    }
    const status=state.stage.querySelector('[data-learning-carousel-status],[data-shared-carousel-status]');if(status)status.textContent=`${selected.dataset.modelName||'Model'} selected.`;
    /* Legacy runtimes contain delayed layout work. Reassert the chosen stage/frame a
       few times without restarting the scroll or renderer. */
    [60,180,420,900,1600,2800].forEach(ms=>setTimeout(()=>{
      if(returning||state.activeFrame!==frame||!document.body.classList.contains('r1079-model-open'))return;
      if(document.body.dataset.ahStageScrolling==='1')return;
      showStage();
      selected.hidden=false;selected.classList.add('is-active');selected.setAttribute('aria-hidden','false');
      for(const [p,v] of [['display','block'],['visibility','visible'],['opacity','1'],['pointer-events','auto'],['background','transparent'],['background-color','transparent'],['background-image','none'],['transform','none']])imp(selected,p,v);
      if(frame)for(const [p,v] of [['display','block'],['visibility','visible'],['opacity',frame.dataset.ah1533Loaded==='1'?'1':'0'],['pointer-events','auto'],['background','transparent'],['background-color','transparent'],['background-image','none'],['transform','none']])imp(frame,p,v);
      paintStaticBackdrop();wake(frame,document.body.dataset.ahModelHalf==='bottom');
    },ms));
    if(scroll)void openStageTransition();
  };
  let entryScrollSnapshot=null;
  let returning=false;
  const waitForTransform=(el,ms)=>new Promise(resolve=>{
    let done=false,timer=0;
    const finish=()=>{if(done)return;done=true;clearTimeout(timer);el.removeEventListener('transitionend',onEnd);el.removeEventListener('transitioncancel',onCancel);resolve();};
    const onEnd=e=>{if(e.target===el&&e.propertyName==='transform')finish();};
    const onCancel=e=>{if(e.target===el)finish();};
    el.addEventListener('transitionend',onEnd);el.addEventListener('transitioncancel',onCancel);
    timer=setTimeout(finish,ms+260);
  });
  let entering=false;
  const prepareOpenShield=()=>{
    const shield=state.stage?.querySelector(':scope > [data-learning-stage-shield]');
    if(!shield)return;
    imp(state.stage,'overflow','hidden');
    imp(shield,'display','block');imp(shield,'visibility','visible');imp(shield,'opacity','1');
    imp(shield,'position','absolute');imp(shield,'inset','0');imp(shield,'z-index','140');
    imp(shield,'background-color','#08172b');imp(shield,'background-image',`url("${BG}")`);
    imp(shield,'background-position','center center');imp(shield,'background-size','cover');imp(shield,'background-repeat','no-repeat');
    imp(shield,'box-sizing','border-box');imp(shield,'border-top','2px solid #CDAA4D');
    imp(shield,'will-change','transform');imp(shield,'backface-visibility','hidden');imp(shield,'pointer-events','auto');
    imp(shield,'transition','none');imp(shield,'transform','translate3d(0,0,0)');shield.getBoundingClientRect();
  };
  const lowerOpenShield=async()=>{
    const shield=state.stage?.querySelector(':scope > [data-learning-stage-shield]');
    if(!shield){await new Promise(r=>setTimeout(r,OPEN_SHIELD_MS));return;}
    prepareOpenShield();
    const finished=waitForTransform(shield,OPEN_SHIELD_MS);
    imp(shield,'transition',`transform ${OPEN_SHIELD_MS}ms ${RETURN_EASE}`);
    requestAnimationFrame(()=>imp(shield,'transform','translate3d(0,101.5%,0)'));
    await finished;
    imp(shield,'transform','translate3d(0,101.5%,0)');imp(shield,'pointer-events','none');
  };
  const stageTopTarget=()=>{
    if(!state.stage)return 0;
    const host=scrollerFor(state.stage);
    const docHost=(host===document.scrollingElement||host===document.documentElement||host===document.body);
    const start=host.scrollTop;
    const hr=docHost?{top:0}:host.getBoundingClientRect();
    const er=state.stage.getBoundingClientRect();
    const frameTop=docHost?(parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--current-frame-top'))||0):0;
    return Math.max(0,start+(er.top-hr.top)-frameTop);
  };
  const smoothToPageBottom=(duration=DURATION)=>{
    if(!state.stage)return Promise.resolve();
    const host=scrollerFor(state.stage);
    return animateScroll(host,stageTopTarget(),duration);
  };
  const smoothToPageTop=(duration=RETURN_SCROLL_MS)=>{
    if(!state.stage)return Promise.resolve();
    const host=scrollerFor(state.stage);
    return animateScroll(host,0,duration);
  };
  const waitForActiveFrame=async(timeout=1250)=>{
    const frame=state.activeFrame;if(!frame)return;
    const pending=frame.dataset.ahPendingSrc;
    if(pending){delete frame.dataset.ahPendingSrc;frame.setAttribute('src',pending);}
    if(frame.dataset.ah1533Loaded==='1'||!frame.getAttribute('src')){await afterTwoFrames();return;}
    await Promise.race([
      new Promise(resolve=>frame.addEventListener('load',()=>{frame.dataset.ah1533Loaded='1';resolve();},{once:true})),
      new Promise(resolve=>setTimeout(resolve,timeout))
    ]);
    await afterTwoFrames();
  };
  const openStageTransition=async()=>{
    if(entering||returning||!state.stage)return;
    entering=true;
    document.body.dataset.ahStageTransition='1';
    document.body.dataset.ahModelHalf='transition-in';
    try{
      primeStageHeight();
      prepareOpenShield();
      state.slides.forEach(s=>wake(s.querySelector('iframe'),false));
      if(entryScrollSnapshot?.host){entryScrollSnapshot.host.scrollTop=entryScrollSnapshot.top;}
      await afterTwoFrames();
      if(entryScrollSnapshot?.host){entryScrollSnapshot.host.scrollTop=entryScrollSnapshot.top;}
      entryScrollSnapshot=null;
      await smoothToPageBottom(DURATION);
      showStage();paintStaticBackdrop();
      await waitForActiveFrame();
      document.body.dataset.ahModelHalf='bottom';
      wake(state.activeFrame,true);
      await afterTwoFrames();
      wake(state.activeFrame,false);
      await lowerOpenShield();
      wake(state.activeFrame,true);
    }finally{
      delete document.body.dataset.ahStageTransition;
      window.dispatchEvent(new Event('automated-hearts:stage-transition-end'));
      entering=false;
    }
  };
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
    imp(shield,'background-position','center center');imp(shield,'background-size','cover');imp(shield,'background-repeat','no-repeat');imp(shield,'box-sizing','border-box');imp(shield,'border-top','2px solid #CDAA4D');
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
    document.body.dataset.ahStageTransition='1';
    document.body.dataset.ahModelHalf='transition-out';
    const returnButton=state.stage.querySelector('.learning-stage-return,[data-learning-choose-another],[data-who-help-back-to-top]');
    if(returnButton) returnButton.disabled=true;
    try{
      /* Pause WebGL first so both the shield and the following scroll keep full compositor budget. */
      state.slides.forEach(s=>wake(s.querySelector('iframe'),false));
      /* Round 1544: pressing the bottom return control starts both motions together.
         The embossed shield rises while the page travels upward, so there is no
         stop-and-start handoff between the two animations. */
      await Promise.all([
        raiseReturnShield(),
        smoothToPageTop(RETURN_SCROLL_MS)
      ]);
      await afterTwoFrames();
      /* Collapse the lower stage only after both simultaneous motions finish. */
      document.body.classList.remove('r1073-model-open','r1075-model-open','r1076-model-open','r1079-model-open');
      document.body.classList.add('ah-model-stage-locked');
      for(const [p,v] of [['display','none'],['visibility','hidden'],['opacity','0'],['pointer-events','none']])imp(state.stage,p,v);
      state.stage.setAttribute('aria-hidden','true');
      resetReturnShield();
      document.body.dataset.ahModelHalf='top';
    }finally{
      delete document.body.dataset.ahStageTransition;
      window.dispatchEvent(new Event('automated-hearts:stage-transition-end'));
      if(returnButton) returnButton.disabled=false;
      returning=false;
    }
  };
  const controlFrom=(target)=>{
    if(!(target instanceof Element))return null;
    if(!state.page)init();
    if(state.page==='learning')return target.closest('#learning-route-buttons .premium-route-card__title-sign[data-learning-model],#learning-model-stage [data-learning-carousel-direction],#learning-model-stage .learning-stage-return,#learning-model-stage [data-learning-choose-another]');
    if(state.page==='who-we-help')return target.closest('#who-we-help-solutions .premium-route-card__title-sign[data-route-index],#who-help-model-stage [data-shared-carousel-direction],#who-help-model-stage .learning-stage-return,#who-help-model-stage [data-who-help-back-to-top]');
    return null;
  };
  const run=(control)=>{
    if(!control||(!state.page&&!init()))return false;
    if(state.page==='learning'){
      const route=control.closest('[data-learning-model]')||control.querySelector?.('[data-learning-model]');
      if(route){const h=scrollerFor(route);entryScrollSnapshot={host:h,top:h.scrollTop};state.group=route.dataset.learningModel||'ai101';state.index=0;activate(0,{scroll:true});return true;}
      if(control.matches('[data-learning-carousel-direction="previous"]')){activate(state.index-1);return true;}
      if(control.matches('[data-learning-carousel-direction="next"]')){activate(state.index+1);return true;}
    }else{
      const card=control.closest('article.who-help-route-card')||control.closest('.premium-route-card__image-button')?.closest('article.who-help-route-card');
      if(card){const h=scrollerFor(card);entryScrollSnapshot={host:h,top:h.scrollTop};state.industry=Math.max(0,Math.min(3,(Number(card.dataset.routeIndex)||1)-1));state.index=0;activate(0,{scroll:true,force:true});return true;}
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
  const ready=()=>{init();paintStaticBackdrop();if(state.stage){for(const [p,v] of [['display','none'],['visibility','hidden'],['opacity','0'],['pointer-events','none']])imp(state.stage,p,v);state.stage.setAttribute('aria-hidden','true');}document.documentElement.classList.remove('ah-learning-choice-locked');document.body?.classList.remove('r1073-model-open','r1075-model-open','r1076-model-open','r1079-model-open');if(document.body)document.body.dataset.ahModelHalf='top';};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
})();
