(()=>{
  'use strict';
  const mobile=matchMedia('(max-width:800px)').matches;
  const PARENT_ASSET=mobile?'./assets/model-backdrop-heartless-leather-mobile-round1323.webp?v=1325r':'./assets/model-backdrop-heartless-leather-desktop-round1323.webp?v=1325r';
  const FRAME_ASSET=mobile?'../assets/model-backdrop-heartless-leather-mobile-round1323.webp?v=1325r':'../assets/model-backdrop-heartless-leather-desktop-round1323.webp?v=1325r';
  const applyParentBg=(el)=>{
    if(!el)return;
    el.style.setProperty('background-color','#02060c','important');
    el.style.setProperty('background-image',`url("${PARENT_ASSET}")`,'important');
    el.style.setProperty('background-position','50% 50%','important');
    el.style.setProperty('background-size','cover','important');
    el.style.setProperty('background-repeat','no-repeat','important');
    el.style.setProperty('background-attachment','scroll','important');
    el.style.setProperty('animation','none','important');
    el.style.setProperty('transition','none','important');
  };
  const applyFrameBg=(frame)=>{
    if(!frame)return;
    // Fallback while the child document is loading.
    applyParentBg(frame);
    try{
      const doc=frame.contentDocument;
      if(!doc)return;
      const paint=()=>{
        [doc.documentElement,doc.body].filter(Boolean).forEach(el=>{
          el.style.setProperty('background-color','#02060c','important');
          el.style.setProperty('background-image',`url("${FRAME_ASSET}")`,'important');
          el.style.setProperty('background-position','50% 50%','important');
          el.style.setProperty('background-size','cover','important');
          el.style.setProperty('background-repeat','no-repeat','important');
          el.style.setProperty('background-attachment','fixed','important');
          el.style.setProperty('animation','none','important');
          el.style.setProperty('transition','none','important');
        });
        doc.querySelectorAll('canvas').forEach(c=>{
          c.style.setProperty('background','transparent','important');
          c.style.setProperty('background-color','transparent','important');
          c.style.setProperty('background-image','none','important');
        });
      };
      paint();
      if(!doc.__ah1325BackdropObserver){
        let raf=0;
        doc.__ah1325BackdropObserver=new MutationObserver(()=>{
          cancelAnimationFrame(raf);
          raf=requestAnimationFrame(paint);
        });
        doc.__ah1325BackdropObserver.observe(doc.documentElement,{childList:true,subtree:true});
      }
    }catch(_){ }
  };
  const enforce=()=>{
    document.querySelectorAll('#learning-model-stage,#who-help-model-stage,#learning-model-stage>.learning-lesson-viewport,#who-help-model-stage>.learning-lesson-viewport,#lite-model-stage,#lite-model-shell,.r1060-static-model-heart').forEach(applyParentBg);
    document.querySelectorAll('img.r978-persistent-model-backdrop,img.r980-persistent-embossed-backdrop').forEach(img=>{
      if(img.getAttribute('src')!==PARENT_ASSET)img.setAttribute('src',PARENT_ASSET);
      img.style.setProperty('content',`url("${PARENT_ASSET}")`,'important');
      img.style.setProperty('object-fit','cover','important');
      img.style.setProperty('object-position','center','important');
    });
    document.querySelectorAll('#learning-model-stage iframe,#who-help-model-stage iframe,#lite-model-shell iframe').forEach(frame=>{
      applyFrameBg(frame);
      if(!frame.dataset.ah1325BgGuard){
        frame.dataset.ah1325BgGuard='1';
        frame.addEventListener('load',()=>{
          applyFrameBg(frame);
          requestAnimationFrame(()=>applyFrameBg(frame));
          setTimeout(()=>applyFrameBg(frame),120);
          setTimeout(()=>applyFrameBg(frame),600);
        });
      }
    });
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',enforce,{once:true});else enforce();
  const root=document.querySelector('#learning-model-stage,#who-help-model-stage,#lite-model-stage')||document.body;
  if(root)new MutationObserver(enforce).observe(root,{childList:true,subtree:true,attributes:false});
})();
