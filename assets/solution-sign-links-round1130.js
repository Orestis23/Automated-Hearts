/* Machine sign navigation shared by desktop and mobile Solution pages. */
(() => {
  'use strict';
  const targets = new Set(['consolidate','streamline','automate','optimize','explore','real-data'].map(key=>'#solution-'+key));
  const style = document.createElement('style');
  style.textContent = [...targets].join(',')+'{scroll-margin-top:80px}';
  document.head.appendChild(style);
  const frame = () => document.querySelector('#solution-engine-model, #lite-model-shell iframe');
  function navigate(hash) {
    if (!targets.has(hash)) return;
    const section = document.getElementById(hash.slice(1));
    if (!section) return;
    section.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
    try { history.replaceState(history.state, '', hash); } catch (_) {}
  }
  window.ahSolutionNavigate = navigate;
  addEventListener('message', event => {
    if (event.source !== frame()?.contentWindow) return;
    if (event.data?.type === 'ah:solution-anchor') navigate(event.data.hash);
  });
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    entry.target.contentWindow?.postMessage({type:'engine-visibility',visible:entry.isIntersecting},location.origin==='null'?'*':location.origin);
  }));
  const observed = new WeakSet();
  function observeFrame() {
    const model = frame();
    if (model && !observed.has(model)) { observed.add(model); observer.observe(model); }
  }
  const cover = document.getElementById('solution-process-cover');
  const close = document.getElementById('solution-cover-close');
  cover?.addEventListener('click', () => {
    cover.classList.add('is-open'); cover.setAttribute('aria-expanded','true');
    if(close) close.hidden=false;
    frame()?.contentWindow?.postMessage({type:'engine-visibility',visible:true},'*');
  });
  close?.addEventListener('click', () => {
    cover.classList.remove('is-open'); cover.setAttribute('aria-expanded','false');
    close.hidden=true; cover.focus();
  });
  observeFrame();
  const shell = document.getElementById('lite-model-shell');
  if (shell) new MutationObserver(observeFrame).observe(shell,{childList:true});
})();
