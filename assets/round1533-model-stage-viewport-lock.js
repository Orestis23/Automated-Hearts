/* Round 1533 — model stage fills the usable field and locks at its exact top.
   The explicit return control remains the only way to move back above the stage. */
(()=>{
  'use strict';
  if(window.__AH1533ModelStageViewportLock)return;
  window.__AH1533ModelStageViewportLock=1;

  const desktopStage=()=>document.querySelector('#learning-model-stage,#who-help-model-stage');
  const mobileStage=()=>document.getElementById('lite-model-stage');
  const stage=()=>desktopStage()||mobileStage();
  const main=()=>document.getElementById('main-content');

  const visible=(el)=>{
    if(!el||el.hidden||el.getAttribute('aria-hidden')==='true')return false;
    const cs=getComputedStyle(el);
    return cs.display!=='none'&&cs.visibility!=='hidden'&&parseFloat(cs.opacity||'1')>0;
  };

  const getScroller=()=>{
    const m=main();
    if(m){
      const cs=getComputedStyle(m);
      if(/auto|scroll/.test(cs.overflowY||'') && m.scrollHeight>m.clientHeight+2)return m;
    }
    return document.scrollingElement||document.documentElement;
  };

  const isDocumentScroller=(s)=>s===document.scrollingElement||s===document.documentElement||s===document.body;

  const px=(v)=>{
    const n=parseFloat(v);
    return Number.isFinite(n)?n:0;
  };

  const mobileInsets=()=>{
    /* Round 1545: the mobile model controllers target a fixed 72px top / 74px
       bottom usable-field inset. The lock authority must use the identical values.
       Measuring transient browser/shell geometry here produced a different target
       after the transition and caused the visible end-of-scroll correction. */
    if(matchMedia('(max-width:800px)').matches)return {top:72,bottom:74};
    const rootStyle=getComputedStyle(document.documentElement);
    const top=px(rootStyle.getPropertyValue('--current-frame-top'));
    const bottom=px(rootStyle.getPropertyValue('--current-frame-bottom'));
    return {top:Math.max(0,top),bottom:Math.max(0,bottom)};
  };

  const returnButton=()=>{
    const s=stage();
    return s?.querySelector('[data-learning-choose-another],[data-who-help-back-to-top],#learning-choose-another,.lite-return-control,.learning-stage-return')||null;
  };

  const exiting=()=>!!returnButton()?.disabled;
  const programmaticScroll=()=>document.body?.dataset?.ahStageScrolling==='1';
  const stageTransition=()=>document.body?.dataset?.ahStageTransition==='1';

  const stageTopInScroller=(s,sc)=>{
    const sr=s.getBoundingClientRect();
    if(isDocumentScroller(sc))return sc.scrollTop+sr.top;
    const cr=sc.getBoundingClientRect();
    return sc.scrollTop+(sr.top-cr.top);
  };

  let armed=false;
  let lockTop=0;
  let correcting=false;
  let lastStage=null;
  let settleTimer=0;

  const sizeStage=()=>{
    const s=stage();
    /* Freeze the exact stage height chosen at transition start. Mobile browser
       chrome can resize visualViewport while scripted scrolling is in progress;
       resizing the stage mid-flight changes scrollHeight and reads as a jerk. */
    if(programmaticScroll()||stageTransition())return;
    if(!s||!visible(s))return;
    const sc=getScroller();
    let h=0;
    if(!isDocumentScroller(sc)){
      h=sc.clientHeight;
    }else{
      const inset=mobileInsets();
      const viewportH=Math.round(window.visualViewport?.height||window.innerHeight);
      h=Math.max(248,viewportH-inset.top-inset.bottom-12);
    }
    s.style.setProperty('--ah1527-model-stage-height',`${h}px`);
    s.style.setProperty('--ah1528-model-stage-height',`${h}px`);
    const parent=s.closest('.lite-section');
    if(parent){parent.style.setProperty('--ah1527-model-stage-height',`${h}px`);parent.style.setProperty('--ah1528-model-stage-height',`${h}px`);}
  };

  const computeLock=()=>{
    const s=stage();
    if(!s||!visible(s))return 0;
    const sc=getScroller();
    const raw=stageTopInScroller(s,sc);
    if(!isDocumentScroller(sc))return Math.max(0,raw);
    return Math.max(0,raw-mobileInsets().top);
  };

  const scrollToLock=()=>{
    const s=stage();
    if(!s||!visible(s)||exiting())return;
    const sc=getScroller();
    lockTop=computeLock();
    correcting=true;
    sc.scrollTop=lockTop;
    requestAnimationFrame(()=>{correcting=false;});
  };

  const sync=()=>{
    const s=stage();
    if(programmaticScroll()||stageTransition())return;
    if(!s||!visible(s)){
      armed=false;lockTop=0;lastStage=s||null;
      clearTimeout(settleTimer);
      return;
    }
    sizeStage();
    const sc=getScroller();
    if(s!==lastStage||!lockTop){
      lastStage=s;
      lockTop=computeLock();
      armed=false;
    }
    const y=sc.scrollTop;
    if(!armed&&y>=lockTop-4)armed=true;
    if(armed&&!exiting()&&y<lockTop-1&&!correcting){
      correcting=true;
      sc.scrollTop=lockTop;
      requestAnimationFrame(()=>{correcting=false;});
    }
    if(armed&&!exiting()){
      clearTimeout(settleTimer);
      settleTimer=setTimeout(()=>{
        const active=stage();
        if(active&&visible(active)&&!exiting()&&!stageTransition())scrollToLock();
      },140);
    }
  };

  const atUpperBoundary=()=>{
    const s=stage();
    if(programmaticScroll()||!armed||!s||!visible(s)||exiting())return false;
    const sc=getScroller();
    return sc.scrollTop<=lockTop+2;
  };

  addEventListener('scroll',sync,{passive:true,capture:true});
  addEventListener('wheel',e=>{
    if(stageTransition()){e.preventDefault();return;}
    if(atUpperBoundary()&&e.deltaY<0)e.preventDefault();
  },{passive:false,capture:true});

  let touchY=null;
  addEventListener('touchstart',e=>{touchY=e.touches?.[0]?.clientY??null;},{passive:true,capture:true});
  addEventListener('touchmove',e=>{
    if(stageTransition()){e.preventDefault();return;}
    if(touchY==null)return;
    const y=e.touches?.[0]?.clientY;
    if(y==null)return;
    if(atUpperBoundary()&&y>touchY+2)e.preventDefault();
    touchY=y;
  },{passive:false,capture:true});
  addEventListener('touchend',()=>{touchY=null;},{passive:true,capture:true});

  addEventListener('keydown',e=>{
    if(stageTransition()&&['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '].includes(e.key)){e.preventDefault();return;}
    if(atUpperBoundary()&&['ArrowUp','PageUp','Home'].includes(e.key))e.preventDefault();
  },true);

  const resyncSoon=()=>{
    requestAnimationFrame(sync);
    setTimeout(sync,80);
    setTimeout(sync,320);
    setTimeout(sync,900);
    setTimeout(sync,1900);
  };

  const observe=()=>{
    const s=stage();
    if(!s)return;
    const mo=new MutationObserver(resyncSoon);
    mo.observe(s,{attributes:true,attributeFilter:['style','hidden','aria-hidden','class'],childList:true,subtree:false});
    resyncSoon();
  };

  addEventListener('automated-hearts:stage-scroll-end',()=>{if(!stageTransition())resyncSoon();},{passive:true});
  addEventListener('automated-hearts:stage-transition-end',()=>{
    const s=stage();
    clearTimeout(settleTimer);
    if(!s||!visible(s)){armed=false;lockTop=0;lastStage=s||null;return;}
    /* Round 1546: adopt the exact position where the scripted transition ended.
       Do not issue a corrective scrollTop assignment after the animation; that was
       the small final kick users could see as the viewport lock took over. */
    lastStage=s;
    const sc=getScroller();
    lockTop=Math.max(0,sc.scrollTop);
    armed=true;
    correcting=false;
  },{passive:true});
  addEventListener('resize',()=>{if(!programmaticScroll()&&!stageTransition())sizeStage();sync();},{passive:true});
  if(window.visualViewport)window.visualViewport.addEventListener('resize',()=>{if(!programmaticScroll()&&!stageTransition())sizeStage();sync();},{passive:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',observe,{once:true});
  else observe();


  /* 3D envelope contact bridge.
     Model iframes post `automated-hearts:open-contact`; embedded page shells
     relay that intent upward, while a top-level page opens its existing contact
     control.  This makes the top/bottom envelope caps reliable on desktop,
     dedicated mobile pages, and persistent-shell embedded routes. */
  const openModelContact=(detail={})=>{
    const service=typeof detail==='string'?detail:(detail.service||detail.source||'3D model');

    // If the normal page contact API already exists (dedicated mobile), use it.
    const existing=window.AutomatedHeartsOpenContact;
    if(typeof existing==='function' && existing!==openModelContact){
      try{ existing({service}); return true; }catch(_){}
    }

    // Embedded route: relay to the persistent parent shell instead of creating
    // a second form inside the iframe.
    if(window.parent&&window.parent!==window){
      try{
        if(typeof window.parent.AutomatedHeartsOpenContact==='function'){
          window.parent.AutomatedHeartsOpenContact({service});
          return true;
        }
      }catch(_){}
      try{
        window.parent.postMessage({type:'automated-hearts:open-contact',service,source:'3D model'},'*');
        return true;
      }catch(_){}
    }

    // Desktop/top-level route: reuse the existing Messages trigger/drawer.
    const trigger=document.querySelector('#header-send-message[data-contact-trigger],.message[data-contact-trigger],[data-contact-trigger]');
    if(trigger){
      try{ trigger.click(); return true; }catch(_){}
    }
    return false;
  };

  if(typeof window.AutomatedHeartsOpenContact!=='function'){
    window.AutomatedHeartsOpenContact=openModelContact;
  }

  window.addEventListener('message',(event)=>{
    const data=event.data||{};
    if(data.type!=='automated-hearts:open-contact')return;
    // Ignore a message coming down from our parent to avoid relay loops.
    if(window.parent!==window && event.source===window.parent)return;
    openModelContact({service:data.service||data.source||'3D model'});
  });
})();
