/* Machine sign navigation shared by desktop and mobile Solution pages. */
(() => {
  'use strict';
  const targetMap = Object.freeze({
    '#solution-real-data':'Real-time, real-world data',
    '#solution-consolidate':'Consolidate',
    '#solution-streamline':'Streamline',
    '#solution-automate':'Automate',
    '#solution-optimize':'Optimize',
    '#solution-explore':'Explore'
  });
  const targets = new Set(Object.keys(targetMap));
  const style = document.createElement('style');
  style.textContent = [...targets].join(',')+'{scroll-margin-top:80px}';
  document.head.appendChild(style);
  const frame = () => document.querySelector('#solution-engine-model, #lite-model-shell iframe');
  function navigate(hash) {
    if (!targets.has(hash)) return false;
    const section = document.getElementById(hash.slice(1));
    if (!section) return false;
    section.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
    try { history.replaceState(history.state, '', hash); } catch (_) {}
    return true;
  }
  window.ahSolutionNavigate = navigate;
  addEventListener('message', event => {
    const model = frame();
    if (!model || event.source !== model.contentWindow) return;
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
  // If the page is opened directly with one of the machine hashes, honor it after layout settles.
  if (targets.has(location.hash)) requestAnimationFrame(()=>navigate(location.hash));
})();
