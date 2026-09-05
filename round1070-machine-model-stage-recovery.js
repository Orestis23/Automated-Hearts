/* Automated Hearts Round 1070 — authoritative machine shutters + 3D stage recovery. */
(()=>{
  'use strict';
  const page=document.body?.dataset?.page||'';
  const MACHINE_MS=1000;

  const frameActivity=(frame,active)=>{
    try{
      frame?.contentWindow?.postMessage({type:'automated-hearts:learning-activity',active:!!active},'*');
      frame?.contentWindow?.postMessage({type:'automated-hearts:viewport-activity',active:!!active},'*');
    }catch(_){}
  };
  const hydrate=(frame)=>{
    if(!frame) return;
    if(!frame.getAttribute('src')&&frame.dataset.src){
      frame.setAttribute('loading','eager');
      frame.setAttribute('src',frame.dataset.src);
    }
  };

  /* Machine shutters --------------------------------------------------- */
  const homeGrid=document.getElementById('home-machine-grid');
  const solutionFrame=document.querySelector('#solution-formula-machine-window .solutions-engine-model-frame');
  const solutionShutter=solutionFrame?.querySelector('[data-solution-machine-haze]');

  const machineOpen=(frame,open)=>{
    if(!frame) return;
    frame.classList.toggle('is-haze-open',!!open);
    const shutter=frame.querySelector('[data-machine-haze],[data-solution-machine-haze]');
    if(shutter){
      const solution=shutter.matches('[data-solution-machine-haze]');
      const raised=solution
        ? 'translate3d(0,calc(-100% + var(--r799-solution-shield-handle-visible,104px)),0)'
        : 'translate3d(0,calc(-100% + var(--r688-haze-handle-visible,104px)),0)';
      shutter.setAttribute('aria-expanded',open?'true':'false');
      shutter.style.setProperty('display','block','important');
      shutter.style.setProperty('visibility','visible','important');
      shutter.style.setProperty('opacity','1','important');
      shutter.style.setProperty('pointer-events','auto','important');
      shutter.style.setProperty('transition',`transform ${MACHINE_MS}ms cubic-bezier(.42,0,.20,1)`,'important');
      shutter.style.setProperty('will-change','transform','important');
      shutter.style.setProperty('transform',open?raised:'translate3d(0,0,0)','important');
      shutter.style.setProperty('-webkit-transform',open?raised:'translate3d(0,0,0)','important');
    }
    const model=frame.querySelector('iframe');
    if(open){ hydrate(model); frameActivity(model,true); }
    else window.setTimeout(()=>{ if(!frame.classList.contains('is-haze-open')) frameActivity(model,false); },MACHINE_MS+80);
  };

  const resetMachines=()=>{
    homeGrid?.querySelectorAll(':scope > .home-hero-engine-frame').forEach(frame=>machineOpen(frame,false));
    machineOpen(solutionFrame,false);
  };

  /* Close immediately when this final deferred script executes, then again on
     pageshow so no older Round 1065 default-open handler can win. */
  resetMachines();
  requestAnimationFrame(resetMachines);
  addEventListener('pageshow',()=>requestAnimationFrame(resetMachines),{passive:true});

  document.addEventListener('click',(event)=>{
    if(!(event.target instanceof Element)) return;
    const homeShutter=event.target.closest('[data-machine-haze]');
    if(homeShutter&&homeGrid?.contains(homeShutter)){
      event.preventDefault();
      event.stopImmediatePropagation();
      const target=homeShutter.closest('.home-hero-engine-frame');
      if(!target) return;
      const opening=!target.classList.contains('is-haze-open');
      if(opening){
        homeGrid.querySelectorAll(':scope > .home-hero-engine-frame.is-haze-open').forEach(frame=>{
          if(frame!==target) machineOpen(frame,false);
        });
      }
      machineOpen(target,opening);
      return;
    }
    const sol=event.target.closest('[data-solution-machine-haze]');
    if(sol&&solutionFrame?.contains(sol)){
      event.preventDefault();
      event.stopImmediatePropagation();
      machineOpen(solutionFrame,!solutionFrame.classList.contains('is-haze-open'));
    }
  },true);

  /* Learning Center / Who We Help model-stage recovery ---------------- */
  const modelConfig=window.__AH_R1071_MODEL_CONTROLLER?null:page==='learning'
    ? {stage:'#learning-model-stage',control:'#learning-route-buttons [data-learning-model]'}
    : page==='who-we-help'
      ? {stage:'#who-help-model-stage',control:'#who-we-help-solutions .premium-route-card__image-button'}
      : null;

  if(modelConfig){
    const stage=document.querySelector(modelConfig.stage);
    const enforceStageGeometry=()=>{
      if(!stage) return;
      const mobile=matchMedia('(max-width:760px)').matches;
      const toolbar=mobile?'68px':'78px';
      stage.style.setProperty('position','relative','important');
      stage.style.setProperty('background-color','#08172b','important');
      stage.style.setProperty('background-image','none','important');
      const viewport=stage.querySelector(':scope > .learning-lesson-viewport');
      if(viewport){
        viewport.style.setProperty('position','absolute','important');
        viewport.style.setProperty('top',toolbar,'important');
        viewport.style.setProperty('right',mobile?'44px':'clamp(64px,7vw,118px)','important');
        viewport.style.setProperty('bottom','0','important');
        viewport.style.setProperty('left',mobile?'44px':'clamp(64px,7vw,118px)','important');
        viewport.style.setProperty('width','auto','important');
        viewport.style.setProperty('height','auto','important');
        viewport.style.setProperty('background','transparent','important');
        viewport.style.setProperty('overflow','hidden','important');
        const backdrop=viewport.querySelector(':scope > .r1060-static-model-heart');
        if(backdrop){
          backdrop.style.setProperty('display','block','important');
          backdrop.style.setProperty('visibility','visible','important');
          backdrop.style.setProperty('opacity','1','important');
          backdrop.style.setProperty('position','absolute','important');
          backdrop.style.setProperty('inset','0','important');
          backdrop.style.setProperty('background-color','#08172b','important');
          backdrop.style.setProperty('background-image','url("./assets/page-shield-smoked-heart.webp?v=1070r")','important');
          backdrop.style.setProperty('background-position','center center','important');
          backdrop.style.setProperty('background-size','cover','important');
          backdrop.style.setProperty('background-repeat','no-repeat','important');
          backdrop.style.setProperty('transform','none','important');
          backdrop.style.setProperty('transition','none','important');
          backdrop.style.setProperty('animation','none','important');
          backdrop.style.setProperty('pointer-events','none','important');
        }
      }
      const returnButton=stage.querySelector(':scope > button.learning-stage-return');
      if(returnButton){
        returnButton.style.setProperty('top',mobile?'8px':'12px','important');
        returnButton.style.setProperty('bottom','auto','important');
        returnButton.style.setProperty('left','50%','important');
        returnButton.style.setProperty('right','auto','important');
        returnButton.style.setProperty('transform','translate3d(-50%,0,0)','important');
        returnButton.style.setProperty('z-index','90','important');
        returnButton.style.setProperty('display','flex','important');
        returnButton.style.setProperty('visibility','visible','important');
        returnButton.style.setProperty('opacity','1','important');
      }
    };
    const unlock=()=>{
      if(!stage) return;
      try{ window.__ahSetModelStageLockedRound558?.(false); }catch(_){}
      document.body?.classList.remove('ah-model-stage-locked');
      document.documentElement.classList.remove('ah-learning-choice-locked');
      stage.classList.remove('is-model-stage-locked');
      stage.style.removeProperty('display');
      stage.setAttribute('aria-hidden','false');
      stage.setAttribute('tabindex','0');
      enforceStageGeometry();
    };
    const activeFrame=()=>stage?.querySelector('.learning-lesson-slide.is-active iframe')
      ||stage?.querySelector('.learning-lesson-slide:not([hidden]) iframe');
    enforceStageGeometry();
    addEventListener('resize',enforceStageGeometry,{passive:true});

    const markReadyWhenRendered=(frame)=>{
      if(!frame||!stage) return;
      hydrate(frame);
      let tries=0;
      const probe=()=>{
        if(!stage.isConnected||!frame.isConnected) return;
        frameActivity(frame,true);
        let ready=false;
        try{
          const canvas=frame.contentDocument?.querySelector('canvas');
          ready=!!canvas&&canvas.width>2&&canvas.height>2;
        }catch(_){}
        if(ready){
          stage.classList.add('ah-model-frame-ready','is-learning-shield-open');
          stage.classList.remove('is-learning-shield-closed');
          stage.dataset.modelFirstFrame='1';
          window.dispatchEvent(new CustomEvent('ah:local-shield-state'));
          return;
        }
        if(++tries<140) setTimeout(probe,80);
      };
      frame.addEventListener('load',()=>{ frameActivity(frame,true); setTimeout(probe,40); },{once:true});
      probe();
    };

    const prime=(control)=>{
      if(!stage||!control) return;
      unlock();
      stage.classList.add('is-learning-shield-closed');
      stage.classList.remove('is-learning-shield-open','ah-model-frame-ready');
      if(page==='learning'){
        const group=control.dataset.learningModel||'ai101';
        try{ window.__ahActivateLearningLessonRound436?.(group,{scroll:false}); }catch(_){}
      }else{
        const index=Math.max(0,Math.min(3,(Number(control.dataset.routeIndex)||1)-1));
        try{ window.__ahActivateWhoHelpIndustryRound933?.(index); }catch(_){}
      }
      requestAnimationFrame(()=>{
        unlock();
        const frame=activeFrame();
        markReadyWhenRendered(frame);
      });
      /* A second assertion after the legacy click stack finishes fixes the case
         where an older lock controller writes display:none back during selection. */
      setTimeout(()=>{
        unlock();
        const frame=activeFrame();
        hydrate(frame);
        frameActivity(frame,true);
        markReadyWhenRendered(frame);
      },120);
    };

    document.addEventListener('pointerdown',(event)=>{
      if(!(event.target instanceof Element)) return;
      const control=event.target.closest(modelConfig.control);
      if(control) prime(control);
    },true);
    document.addEventListener('keydown',(event)=>{
      if(event.key!=='Enter'&&event.key!==' ') return;
      if(!(event.target instanceof Element)) return;
      const control=event.target.closest(modelConfig.control);
      if(control) prime(control);
    },true);

    /* If an iframe is selected by side arrows, guarantee it is hydrated and the
       static backdrop remains visible until the new canvas has actually rendered. */
    const observer=new MutationObserver(()=>{
      if(stage.classList.contains('is-model-stage-locked')) return;
      const frame=activeFrame();
      if(frame){ hydrate(frame); frameActivity(frame,true); markReadyWhenRendered(frame); }
    });
    observer.observe(stage,{subtree:true,attributes:true,attributeFilter:['class','hidden','src']});
  }
})();
