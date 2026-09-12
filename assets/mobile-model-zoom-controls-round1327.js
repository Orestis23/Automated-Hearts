(()=>{
  'use strict';
  const controls=[...document.querySelectorAll('[data-model-zoom]')];
  if(!controls.length)return;
  const activeCanvas=()=>{
    const frame=document.querySelector('#lite-model-shell iframe');
    if(!frame)return null;
    try{return frame.contentDocument?.querySelector('canvas')||null}catch(_){return null}
  };
  const zoom=(direction)=>{
    const canvas=activeCanvas();
    if(!canvas)return false;
    const deltaY=direction==='in'?-120:120;
    try{
      const ev=new WheelEvent('wheel',{deltaY,bubbles:true,cancelable:true,view:canvas.ownerDocument.defaultView||window});
      canvas.dispatchEvent(ev);
      return true;
    }catch(_){return false}
  };
  controls.forEach(button=>{
    let timer=0,delay=0;
    const dir=button.dataset.modelZoom;
    const stop=()=>{if(delay){clearTimeout(delay);delay=0}if(timer){clearInterval(timer);timer=0}};
    button.addEventListener('pointerdown',e=>{
      e.preventDefault();e.stopPropagation();
      zoom(dir);
      delay=setTimeout(()=>{timer=setInterval(()=>zoom(dir),110)},320);
      try{button.setPointerCapture(e.pointerId)}catch(_){}
    });
    ['pointerup','pointercancel','lostpointercapture','pointerleave'].forEach(type=>button.addEventListener(type,stop));
    button.addEventListener('click',e=>{e.preventDefault();e.stopPropagation()});
  });
})();
