(()=>{
  'use strict';
  const BLUE='#07111b';
  const paintSurface=(el)=>{
    if(!el)return;
    el.style.setProperty('background-color',BLUE,'important');
    el.style.setProperty('background-image','none','important');
    el.style.setProperty('background-attachment','scroll','important');
    el.style.setProperty('animation','none','important');
    el.style.setProperty('transition','none','important');
  };
  const paintFrame=(frame)=>{
    if(!frame)return;
    paintSurface(frame);
    try{
      const doc=frame.contentDocument;
      if(!doc)return;
      [doc.documentElement,doc.body].filter(Boolean).forEach(paintSurface);
      doc.querySelectorAll('canvas').forEach(c=>{
        c.style.setProperty('background','transparent','important');
        c.style.setProperty('background-color','transparent','important');
        c.style.setProperty('background-image','none','important');
      });
    }catch(_){ }
  };
  const enforce=()=>{
    document.querySelectorAll('#learning-model-stage,#who-help-model-stage,#learning-model-stage>.learning-lesson-viewport,#who-help-model-stage>.learning-lesson-viewport,#lite-model-stage,#lite-model-shell,.r1060-static-model-heart').forEach(paintSurface);
    document.querySelectorAll('img.r978-persistent-model-backdrop,img.r980-persistent-embossed-backdrop').forEach(img=>{img.hidden=true;img.style.setProperty('display','none','important');});
    document.querySelectorAll('#learning-model-stage iframe,#who-help-model-stage iframe,#lite-model-shell iframe').forEach(frame=>{
      paintFrame(frame);
      if(!frame.dataset.ah1780BgGuard){
        frame.dataset.ah1780BgGuard='1';
        frame.addEventListener('load',()=>{paintFrame(frame);requestAnimationFrame(()=>paintFrame(frame));setTimeout(()=>paintFrame(frame),120);},{passive:true});
      }
    });
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',enforce,{once:true});else enforce();
  const root=document.querySelector('#learning-model-stage,#who-help-model-stage,#lite-model-stage')||document.body;
  if(root)new MutationObserver(enforce).observe(root,{childList:true,subtree:true});
})();
