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
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function smoothToElement(el, duration=1550){
    if(!el) return;
    const scroller=document.scrollingElement||document.documentElement;
    const start=scroller.scrollTop;
    const fixedHeader=document.querySelector('.page-chip,.page-title,.mobile-page-title,.lite-page-title');
    const headerOffset=fixedHeader ? Math.max(0, fixedHeader.getBoundingClientRect().height + 18) : 18;
    const target=Math.max(0,start+el.getBoundingClientRect().top-headerOffset);
    const delta=target-start;
    if(reducedMotion || Math.abs(delta)<2){ scroller.scrollTop=target; return; }
    const t0=performance.now();
    const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
    const step=now=>{
      const t=Math.min(1,(now-t0)/duration);
      scroller.scrollTop=start+delta*ease(t);
      if(t<1) requestAnimationFrame(step); else scroller.scrollTop=target;
    };
    requestAnimationFrame(step);
  }
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
    e.preventDefault();
    selected=el.dataset.liteLearning;
    modelIndex=0;
    unloadModel();
    if(stage){
      stage.hidden=false;
      $('#stage-title').textContent=el.dataset.title || 'Interactive lesson';
    }
    $$('.learning-copy>div').forEach(x=>x.classList.toggle('active',x.dataset.copy===selected));
    const ctrls=$('#model-controls');
    if(ctrls) ctrls.hidden=learningModels[selected].length<2;

    /* Start the scroll immediately, then begin only the selected WebGL lesson.
       The short compositor head-start prevents model initialization from stealing
       the first scroll frame while still loading the lesson during the descent. */
    smoothToElement(stage,1550);
    requestAnimationFrame(()=>requestAnimationFrame(()=>loadUrl(learningModels[selected][0])));
  }));
  $('#model-prev')?.addEventListener('click',()=>{ if(!selected) return; const a=learningModels[selected]; modelIndex=(modelIndex-1+a.length)%a.length; loadUrl(a[modelIndex]); });
  $('#model-next')?.addEventListener('click',()=>{ if(!selected) return; const a=learningModels[selected]; modelIndex=(modelIndex+1)%a.length; loadUrl(a[modelIndex]); });

  $$('[data-industry]').forEach((el)=>el.addEventListener('click',(e)=>{
    e.preventDefault(); unloadModel(); selected=el.dataset.industry; if(stage){stage.hidden=false; $('#stage-title').textContent=el.dataset.title;} $('#industry-helix')?.setAttribute('data-industry-index',selected); stage?.scrollIntoView({block:'start'});
  }));
  $('#industry-helix')?.addEventListener('click',(e)=>{ const i=e.currentTarget.dataset.industryIndex||'0'; loadUrl(`./models/who-we-help-industry-helix-round1093.html?industry=${encodeURIComponent(i)}&v=1125r`); });
  $('#industry-readiness')?.addEventListener('click',()=>loadUrl('./models/who-we-help-readiness-signals-round1093.html?v=1125r'));
  $('#load-solution-model')?.addEventListener('click',()=>loadUrl('./solution-machine-pipeline-round1130.html?v=1134r'));
  document.addEventListener('visibilitychange',()=>{ if(document.hidden) unloadModel(); });
})();
