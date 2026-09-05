(() => {
  'use strict';
  if ('serviceWorker' in navigator) navigator.serviceWorker.getRegistrations().then((regs)=>regs.forEach((r)=>r.unregister())).catch(()=>{});
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  // Native route cards remain ordinary links/buttons. Only explicit 3D loading uses JS.
  const stage = $('#lite-model-stage');
  const modelShell = $('#lite-model-shell');
  let frame = null;
  let selected = null;
  let modelIndex = 0;
  const learningModels = {
    ai101: [
      './models/ai-101-1-round1093.html?v=1125r',
      './models/ai-101-2-round1093.html?v=1125r',
      './models/ai-101-3-round1093.html?v=1125r',
      './models/ai-101-4-round1093.html?v=1125r'
    ],
    practical: ['./models/practical-ai-skills-helix-round1093.html?v=1125r'],
    strategy: ['./models/strategy-lab-ball-round1093.html?v=1125r']
  };
  function unloadModel(){ if(frame){ frame.src='about:blank'; frame.remove(); frame=null; } if(modelShell) modelShell.hidden=true; }
  function loadUrl(url){
    if(!modelShell) return;
    unloadModel();
    frame=document.createElement('iframe');
    frame.title='Interactive Automated Hearts 3D model';
    frame.loading='eager';
    frame.allow='webgl';
    frame.setAttribute('allowtransparency','true');
    frame.src=url;
    modelShell.appendChild(frame);
    modelShell.hidden=false;
  }
  $$('[data-lite-learning]').forEach((el) => el.addEventListener('click', (e) => {
    e.preventDefault(); selected=el.dataset.liteLearning; modelIndex=0; unloadModel();
    if(stage){ stage.hidden=false; $('#stage-title').textContent=el.dataset.title || 'Interactive lesson'; }
    $$('.learning-copy>div').forEach(x=>x.classList.toggle('active',x.dataset.copy===selected));
    $('#load-learning-model')?.setAttribute('data-kind',selected);
    stage?.scrollIntoView({block:'start'});
  }));
  $('#load-learning-model')?.addEventListener('click', (e) => {
    const kind=e.currentTarget.dataset.kind || selected || 'ai101'; selected=kind; modelIndex=0; loadUrl(learningModels[kind][0]);
    const ctrls=$('#model-controls'); if(ctrls) ctrls.hidden=learningModels[kind].length<2;
  });
  $('#model-prev')?.addEventListener('click',()=>{ if(!selected) return; const a=learningModels[selected]; modelIndex=(modelIndex-1+a.length)%a.length; loadUrl(a[modelIndex]); });
  $('#model-next')?.addEventListener('click',()=>{ if(!selected) return; const a=learningModels[selected]; modelIndex=(modelIndex+1)%a.length; loadUrl(a[modelIndex]); });

  $$('[data-industry]').forEach((el)=>el.addEventListener('click',(e)=>{
    e.preventDefault(); unloadModel(); selected=el.dataset.industry; if(stage){stage.hidden=false; $('#stage-title').textContent=el.dataset.title;} $('#industry-helix')?.setAttribute('data-industry-index',selected); stage?.scrollIntoView({block:'start'});
  }));
  $('#industry-helix')?.addEventListener('click',(e)=>{ const i=e.currentTarget.dataset.industryIndex||'0'; loadUrl(`./models/who-we-help-industry-helix-round1093.html?industry=${encodeURIComponent(i)}&v=1125r`); });
  $('#industry-readiness')?.addEventListener('click',()=>loadUrl('./models/who-we-help-readiness-signals-round1093.html?v=1125r'));
  $('#load-solution-model')?.addEventListener('click',()=>loadUrl('./home-machine-five-stage-engine-round1115.html?v=1109r'));
  document.addEventListener('visibilitychange',()=>{ if(document.hidden) unloadModel(); });
})();
