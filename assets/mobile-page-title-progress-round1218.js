(()=>{
  'use strict';
  const chip=document.querySelector('body > .page-chip');
  if(!chip)return;

  let raf=0;
  const main=document.querySelector('main#main-content');
  const progressFor=(surface,documentSurface=false)=>{
    if(!surface)return 0;
    const max=Math.max(0,Number(surface.scrollHeight||0)-Number(surface.clientHeight||0));
    if(max<=0)return 0;
    const y=documentSurface
      ? Math.max(Number(window.scrollY||0),Number(surface.scrollTop||0),Number(document.body?.scrollTop||0))
      : Number(surface.scrollTop||0);
    return Math.max(0,Math.min(1,y/max));
  };
  const update=()=>{
    raf=0;
    const root=document.scrollingElement||document.documentElement;
    const p=Math.max(progressFor(main,false),progressFor(root,true));
    chip.style.setProperty('--ah-page-scroll-percent',`${(p*100).toFixed(2)}%`);
    chip.setAttribute('data-scroll-percent',String(Math.round(p*100)));
  };
  const schedule=()=>{
    if(raf)return;
    raf=requestAnimationFrame(update);
  };

  main?.addEventListener('scroll',schedule,{passive:true});
  addEventListener('scroll',schedule,{passive:true});
  document.addEventListener('scroll',schedule,{passive:true,capture:true});
  addEventListener('resize',schedule,{passive:true});
  addEventListener('load',schedule,{once:true});
  addEventListener('pageshow',schedule,{passive:true});

  if('ResizeObserver' in window){
    const ro=new ResizeObserver(schedule);
    ro.observe(document.documentElement);
    if(document.body)ro.observe(document.body);
    if(main)ro.observe(main);
  }
  if('MutationObserver' in window && document.body){
    const mo=new MutationObserver(schedule);
    mo.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden','class']});
  }

  update();
})();
