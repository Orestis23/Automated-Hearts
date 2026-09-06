/* Round 1137 — machine sign anchors + Home-style reversible Solution shield. */
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
  if (close) close.hidden = true;

  const setCover = open => {
    if (!cover) return;
    cover.classList.toggle('is-open', !!open);
    cover.setAttribute('aria-expanded', open ? 'true' : 'false');
    cover.setAttribute('aria-label', open ? 'Close the machine cover' : 'Reveal the machine');
    frame()?.contentWindow?.postMessage({type:'engine-visibility',visible:!!open},'*');
  };

  cover?.addEventListener('click', event => {
    event.preventDefault();
    setCover(!cover.classList.contains('is-open'));
  });

  /* Always start closed, matching the Home machine windows. */
  setCover(false);
  addEventListener('pageshow', () => setCover(false), {passive:true});

  observeFrame();
  const shell = document.getElementById('lite-model-shell');
  if (shell) new MutationObserver(observeFrame).observe(shell,{childList:true});

  if (targets.has(location.hash)) requestAnimationFrame(()=>navigate(location.hash));
})();
