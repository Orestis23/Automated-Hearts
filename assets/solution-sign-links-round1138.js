/* Round 1138 — machine sign anchors + reversible Solution shields.
   The removed legacy real-data block now resolves to Real-World Intelligence. */
(() => {
  'use strict';
  const aliases = Object.freeze({
    '#solution-real-data':'#solution-world-intelligence'
  });
  const targetMap = Object.freeze({
    '#solution-world-intelligence':'Real-time, real-world data / Real-World Intelligence',
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
  const resolveHash = hash => aliases[hash] || hash;

  function navigate(hash) {
    const resolved = resolveHash(hash);
    if (!targets.has(resolved)) return false;
    const section = document.getElementById(resolved.slice(1));
    if (!section) return false;
    section.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
    try { history.replaceState(history.state, '', resolved); } catch (_) {}
    return true;
  }
  window.ahSolutionNavigate = navigate;

  addEventListener('message', event => {
    const model = frame();
    if (!model || event.source !== model.contentWindow) return;
    if (event.data?.type === 'ah:solution-anchor') navigate(event.data.hash);
  });

  const observed = new WeakSet();
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => entries.forEach(entry => {
    entry.target.contentWindow?.postMessage({type:'engine-visibility',visible:entry.isIntersecting},location.origin==='null'?'*':location.origin);
  })) : null;
  function observeFrame() {
    const model = frame();
    if (model && observer && !observed.has(model)) { observed.add(model); observer.observe(model); }
  }

  const cover = document.getElementById('solution-process-cover');
  const close = document.getElementById('solution-cover-close');
  if (close) close.hidden = true;

  const setCover = open => {
    if (!cover) return;
    cover.classList.toggle('is-open', !!open);
    cover.setAttribute('aria-expanded', open ? 'true' : 'false');
    cover.setAttribute('aria-label', open ? 'Lower the machine cover' : 'Reveal the machine');
    frame()?.contentWindow?.postMessage({type:'engine-visibility',visible:!!open},'*');
  };

  cover?.addEventListener('click', event => {
    event.preventDefault();
    setCover(!cover.classList.contains('is-open'));
  });

  setCover(false);
  addEventListener('pageshow', () => setCover(false), {passive:true});

  observeFrame();
  const shell = document.getElementById('lite-model-shell');
  if (shell) new MutationObserver(observeFrame).observe(shell,{childList:true});

  if (location.hash && (targets.has(resolveHash(location.hash)))) requestAnimationFrame(()=>navigate(location.hash));
})();
