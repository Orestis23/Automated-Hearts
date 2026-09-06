(() => {
  'use strict';
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((regs)=>regs.forEach((r)=>r.unregister())).catch(()=>{});
  }
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const stage = $('#lite-model-stage');
  const modelShell = $('#lite-model-shell');
  let frame = null;

  function unloadModel(){
    if(frame){
      frame.src='about:blank';
      frame.remove();
      frame=null;
    }
    if(modelShell) modelShell.hidden=true;
  }

  function loadIndustry(index){
    if(!modelShell) return;
    unloadModel();
    frame=document.createElement('iframe');
    frame.title='Interactive Automated Hearts industry model';
    frame.loading='eager';
    frame.allow='webgl';
    frame.setAttribute('allowtransparency','true');
    frame.src=`./models/who-we-help-industry-helix-round1093.html?industry=${encodeURIComponent(index)}&v=1160r`;
    modelShell.appendChild(frame);
    modelShell.hidden=false;
  }

  $$('[data-industry]').forEach((el)=>el.addEventListener('click',(e)=>{
    e.preventDefault();
    const index=el.dataset.industry || '0';
    if(stage) stage.hidden=false;
    loadIndustry(index);
    stage?.scrollIntoView({behavior:'smooth',block:'start'});
  }));

  document.addEventListener('visibilitychange',()=>{ if(document.hidden) unloadModel(); });
})();
