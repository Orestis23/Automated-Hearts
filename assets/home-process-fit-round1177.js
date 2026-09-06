/* Round 1177 — keep terminal text at the largest shared size that fully fits. */
(function(){
  'use strict';
  function fits(el){
    if(!el) return true;
    return el.scrollWidth <= el.clientWidth + 1 && el.scrollHeight <= el.clientHeight + 1;
  }
  function setSize(nodes, px){
    nodes.forEach(function(el){ el.style.setProperty('font-size', px.toFixed(2)+'px', 'important'); });
  }
  function fitShared(nodes, maxPx, minPx, step){
    if(!nodes.length) return;
    var size=maxPx;
    setSize(nodes,size);
    while(size>minPx && nodes.some(function(el){return !fits(el);})){ size-=step; setSize(nodes,size); }
  }
  function fitHomeTerminals(){
    if(!document.body || !document.body.classList.contains('page-home')) return;
    var headers=Array.prototype.slice.call(document.querySelectorAll('#home-solution-framework .r1176-process-heading-label'));
    fitShared(headers,22,15,0.25);

    var lines=Array.prototype.slice.call(document.querySelectorAll('#home-solution-framework .negative-software-screen-round344:not(.home-process-stage--key) .home-process-stage__list > li'));
    fitShared(lines,20,15,0.25);
  }
  var raf=0;
  function schedule(){ cancelAnimationFrame(raf); raf=requestAnimationFrame(fitHomeTerminals); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',schedule,{once:true}); else schedule();
  window.addEventListener('load',schedule,{once:true});
  window.addEventListener('resize',schedule,{passive:true});
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(schedule).catch(function(){});
})();
