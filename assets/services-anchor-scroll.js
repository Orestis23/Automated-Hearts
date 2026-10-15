(()=>{
 let frame=0,finish=null;
 window.ahServicesAnchorScroll=(event,link,target)=>{
  if(!['r864-ai','r864-web'].includes(target.id))return;
  event.preventDefault();event.stopImmediatePropagation();cancelAnimationFrame(frame);finish?.();
  let container=target.parentElement;
  while(container&&!(container.scrollHeight>container.clientHeight+1&&/auto|scroll/.test(getComputedStyle(container).overflowY)))container=container.parentElement;
  container=container||document.scrollingElement;
  window.ahCancelSmoothScroll?.(container);
  const previous=container.style.getPropertyValue('scroll-behavior'),priority=container.style.getPropertyPriority('scroll-behavior');
  container.style.setProperty('scroll-behavior','auto','important');
  finish=()=>{previous?container.style.setProperty('scroll-behavior',previous,priority):container.style.removeProperty('scroll-behavior');finish=null;};
  const root=container===document.scrollingElement,start=container.scrollTop;
  const clearance=innerWidth<=900?110:24;
  const end=Math.max(0,Math.min(container.scrollHeight-container.clientHeight,start+target.getBoundingClientRect().top-(root?0:container.getBoundingClientRect().top)-clearance));
  const began=performance.now(),duration=1400;
  const tick=now=>{const t=Math.min(1,(now-began)/duration),ease=t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;container.scrollTop=start+(end-start)*ease;if(t<1)frame=requestAnimationFrame(tick);else{container.scrollTop=end;finish?.();try{history.replaceState(history.state,'',link.hash)}catch{}}};
  frame=requestAnimationFrame(tick);
 };
 addEventListener('click',event=>{if(event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;const link=event.target.closest?.('.ah2249-pricing-options a[href^="#"]');if(!link)return;const target=document.getElementById(link.hash.slice(1));if(target)window.ahServicesAnchorScroll(event,link,target);},true);
})();
