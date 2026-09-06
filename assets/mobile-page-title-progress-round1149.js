(()=>{
  'use strict';
  const chip=document.querySelector('body > .page-chip');
  if(!chip)return;

  let raf=0;
  const update=()=>{
    raf=0;
    const root=document.scrollingElement||document.documentElement;
    const viewport=window.innerHeight||root.clientHeight||0;
    const max=Math.max(0,(root.scrollHeight||0)-viewport);
    const y=Math.max(0,window.scrollY||root.scrollTop||0);
    const p=max>0?Math.min(1,y/max):0;
    chip.style.setProperty('--ah-page-scroll-percent',`${(p*100).toFixed(2)}%`);
    chip.setAttribute('data-scroll-percent',String(Math.round(p*100)));
  };
  const schedule=()=>{
    if(raf)return;
    raf=requestAnimationFrame(update);
  };

  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',schedule,{passive:true});
  addEventListener('load',schedule,{once:true});
  addEventListener('pageshow',schedule,{passive:true});

  if('ResizeObserver' in window){
    const ro=new ResizeObserver(schedule);
    ro.observe(document.documentElement);
    if(document.body)ro.observe(document.body);
  }
  if('MutationObserver' in window && document.body){
    const mo=new MutationObserver(schedule);
    mo.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden','class']});
  }

  update();
})();
