/* Automated Hearts Round 1595 — keep desktop Explore exactly the same height as the process screens. */
(()=>{
  'use strict';
  function syncExploreHeight(){
    if(!matchMedia('(min-width:901px)').matches) return;
    const root=document.querySelector('body.page-home[data-page="home"] #home-solution-framework');
    if(!root) return;
    const screen=root.querySelector('.negative-software-grid-round344 > article.home-process-stage.negative-software-screen-round344:not(.home-process-stage--key)');
    const article=root.querySelector('.negative-software-grid-round344 > article.ah1600-explore-footer-cell');
    const key=root.querySelector('#negative-software-explore');
    if(!screen||!article||!key) return;
    const h=Math.round(screen.getBoundingClientRect().height);
    if(!Number.isFinite(h)||h<120) return;
    [article,key].forEach(el=>{
      el.style.setProperty('height',h+'px','important');
      el.style.setProperty('min-height',h+'px','important');
      el.style.setProperty('max-height',h+'px','important');
    });
  }
  let raf=0;
  const schedule=()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(syncExploreHeight)};
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',schedule,{once:true}); else schedule();
  addEventListener('load',schedule,{once:true});
  addEventListener('resize',schedule,{passive:true});
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(schedule).catch(()=>{});
  setTimeout(schedule,120);
  setTimeout(schedule,500);
})();
