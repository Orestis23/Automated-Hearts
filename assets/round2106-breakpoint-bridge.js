/* Round 2106 — reload only when crossing the desktop/mobile architecture breakpoint.
   No resize polling or debounce: matchMedia fires only when the 900px boundary changes. */
(()=>{'use strict';
  if(window.__AH2106_BREAKPOINT_BRIDGE__)return;
  window.__AH2106_BREAKPOINT_BRIDGE__=true;
  const root=document.documentElement;
  const q=new URLSearchParams(location.search);
  if(q.get('desktop')==='1'||q.get('mobile')==='1')return; // explicit QA/preview override owns the architecture
  const mq=matchMedia('(max-width:900px)');
  const initial=root.dataset.ahResponsiveVariant||(mq.matches?'mobile':'desktop');
  let reloading=false;
  const onChange=()=>{
    const next=mq.matches?'mobile':'desktop';
    if(reloading||next===initial)return;
    reloading=true;
    requestAnimationFrame(()=>location.reload());
  };
  if(mq.addEventListener)mq.addEventListener('change',onChange);else mq.addListener(onChange);
})();
