/* Round 1527 — two-finger pinch zoom for Automated Hearts 3D canvases.
   One finger keeps the model's native drag/click behavior. Two fingers suspend
   native dragging and translate pinch distance into the model's existing wheel
   zoom handler, so every model keeps its own camera limits. */
(()=>{
  'use strict';
  if(window.__AHModelPinchZoom1527)return;
  window.__AHModelPinchZoom1527=1;

  const boot=()=>{
    const canvas=document.querySelector('canvas');
    if(!canvas){requestAnimationFrame(boot);return;}
    if(canvas.dataset.ahPinchZoom1527==='1')return;
    canvas.dataset.ahPinchZoom1527='1';
    canvas.style.touchAction='none';

    const points=new Map();
    let pinching=false;
    let pinchSession=false;
    let lastDistance=0;
    let resettingNativeDrag=false;

    const distance=()=>{
      const p=[...points.values()];
      if(p.length<2)return 0;
      return Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y);
    };

    const syntheticPointer=(type,p,x,y)=>{
      const Ctor=window.PointerEvent||window.MouseEvent;
      return new Ctor(type,{
        bubbles:true,cancelable:true,composed:true,
        pointerId:p.id,pointerType:'touch',isPrimary:true,
        clientX:x,clientY:y,screenX:x,screenY:y,
        button:0,buttons:type==='pointerup'?0:1,
        pressure:type==='pointerup'?0:.5
      });
    };

    /* The first finger may already have started the model's ordinary drag.
       End that drag cleanly when the second finger arrives, but first move it
       a few pixels so click-to-open handlers cannot mistake the reset for a tap. */
    const neutralizeNativeDrag=()=>{
      const first=[...points.values()][0];
      if(!first)return;
      resettingNativeDrag=true;
      try{
        canvas.dispatchEvent(syntheticPointer('pointermove',first,first.x+6,first.y));
        canvas.dispatchEvent(syntheticPointer('pointerup',first,first.x+6,first.y));
      }catch(_){ }
      resettingNativeDrag=false;
    };

    canvas.addEventListener('pointerdown',e=>{
      if(resettingNativeDrag||e.pointerType!=='touch')return;
      points.set(e.pointerId,{id:e.pointerId,x:e.clientX,y:e.clientY});
      if(points.size===2){
        pinching=true;
        pinchSession=true;
        lastDistance=distance();
        neutralizeNativeDrag();
        e.preventDefault();
        e.stopImmediatePropagation();
      }else if(points.size>2){
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    },{capture:true,passive:false});

    canvas.addEventListener('pointermove',e=>{
      if(resettingNativeDrag||e.pointerType!=='touch'||!points.has(e.pointerId))return;
      points.set(e.pointerId,{id:e.pointerId,x:e.clientX,y:e.clientY});
      if(!pinching||points.size<2)return;
      e.preventDefault();
      e.stopImmediatePropagation();
      const nextDistance=distance();
      if(!nextDistance||!lastDistance){lastDistance=nextDistance;return;}
      const delta=(lastDistance-nextDistance)*2.4;
      lastDistance=nextDistance;
      if(Math.abs(delta)<.15)return;
      try{
        canvas.dispatchEvent(new WheelEvent('wheel',{
          bubbles:true,cancelable:true,composed:true,
          deltaMode:0,deltaY:delta,
          clientX:e.clientX,clientY:e.clientY,
          view:window
        }));
      }catch(_){ }
    },{capture:true,passive:false});

    const finishPointer=e=>{
      if(resettingNativeDrag||e.pointerType!=='touch')return;
      const belongs=points.has(e.pointerId);
      if(belongs)points.delete(e.pointerId);
      if(pinchSession){
        e.preventDefault();
        e.stopImmediatePropagation();
      }
      if(points.size===0){
        pinching=false;
        pinchSession=false;
        lastDistance=0;
      }else if(points.size<2){
        pinching=false;
        lastDistance=0;
      }
    };
    canvas.addEventListener('pointerup',finishPointer,{capture:true,passive:false});
    canvas.addEventListener('pointercancel',finishPointer,{capture:true,passive:false});
    canvas.addEventListener('lostpointercapture',e=>{
      if(e.pointerType==='touch'&&points.size===0){pinching=false;pinchSession=false;lastDistance=0;}
    },true);
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
