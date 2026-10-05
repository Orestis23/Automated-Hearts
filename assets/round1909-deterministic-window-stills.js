/* Round 1909 — first-frame authority for Home + Solution machine windows. */
(()=>{
  'use strict';
  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>[...r.querySelectorAll(s)];

  function frameHostForSource(source){
    for(const iframe of qa('iframe')){
      try{
        if(iframe.contentWindow!==source)continue;
      }catch(_){continue;}
      return iframe.closest('.home-hero-engine-frame,.machine-frame,.solution-process-window,.solution-mobile-model-shell');
    }
    return null;
  }
  function setReady(host){
    if(!host)return;
    host.dataset.ah1909LiveReady='1';
    host.classList.add('ah1909-live-ready');
  }
  function syncSolutionHost(host,cover){
    if(!host||!cover)return;
    const open=cover.classList.contains('is-open')||cover.getAttribute('aria-expanded')==='true';
    host.classList.toggle('ah1909-window-open',open);
  }
  function bindSolutionPair(host,cover){
    if(!host||!cover||host.dataset.ah1909Bound==='1')return;
    host.dataset.ah1909Bound='1';
    syncSolutionHost(host,cover);
    const obs=new MutationObserver(()=>syncSolutionHost(host,cover));
    obs.observe(cover,{attributes:true,attributeFilter:['class','aria-expanded']});
  }
  function bind(){
    bindSolutionPair(q('#solution-process-header .solution-process-window'),q('#solution-process-cover'));
    bindSolutionPair(q('#lite-model-shell.solution-mobile-model-shell'),q('#solution-mobile-cover'));
  }
  addEventListener('message',event=>{
    const data=event.data||{};
    if(data.type==='automated-hearts:home-window-first-frame'){
      const host=frameHostForSource(event.source);
      if(host)setReady(host);
      return;
    }
    if(data.type==='automated-hearts:solution-window-first-frame'){
      const host=frameHostForSource(event.source);
      if(host){setReady(host);const cover=host.querySelector('#solution-process-cover,#solution-mobile-cover');syncSolutionHost(host,cover);}
      const control=q('.ah-solution-open-sign');
      control?.removeAttribute('aria-busy');
    }
  });
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});else bind();
  document.addEventListener('ah:persistent-route-complete',()=>setTimeout(bind,0));
  addEventListener('pageshow',bind,{passive:true});
})();
