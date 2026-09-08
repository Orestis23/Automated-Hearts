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

  let scrollFrame = 0;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let restoreScrollStyle = () => {};

  function scrollHost(section) {
    for (let node=section.parentElement; node && node!==document.body; node=node.parentElement) {
      if (/(auto|scroll)/.test(getComputedStyle(node).overflowY) && node.scrollHeight>node.clientHeight+1) return node;
    }
    return document.scrollingElement || document.documentElement;
  }

  function smoothScrollTo(section, duration=1850) {
    if (!section) return false;
    if (scrollFrame) cancelAnimationFrame(scrollFrame);
    restoreScrollStyle();
    scrollFrame = 0;
    const scroller = scrollHost(section);
    const isDocument=scroller===(document.scrollingElement||document.documentElement);
    const start = scroller.scrollTop || 0;
    const fixedTitle = document.querySelector('.page-chip,.rim-page-name-screen,.mobile-page-title,.lite-page-title');
    const headerOffset = fixedTitle ? Math.max(80, fixedTitle.getBoundingClientRect().bottom + 16) : 80;
    const hostTop=isDocument?0:scroller.getBoundingClientRect().top+scroller.clientTop;
    const offset=Math.max(hostTop+16,headerOffset);
    const target = Math.max(0, Math.min(scroller.scrollHeight-scroller.clientHeight,start + section.getBoundingClientRect().top - offset));
    const oldBehavior=scroller.style.getPropertyValue('scroll-behavior');
    const oldPriority=scroller.style.getPropertyPriority('scroll-behavior');
    scroller.style.setProperty('scroll-behavior','auto','important');
    restoreScrollStyle=()=>{
      if(oldBehavior)scroller.style.setProperty('scroll-behavior',oldBehavior,oldPriority);
      else scroller.style.removeProperty('scroll-behavior');
      restoreScrollStyle=()=>{};
    };
    const move=position=>{scroller.scrollTop=position;};
    const distance = target - start;
    if (reducedMotion || Math.abs(distance) < 2) {
      move(target);
      restoreScrollStyle();
      return true;
    }
    const t0 = performance.now();
    const ease = t => t < .5 ? 16*t*t*t*t*t : 1 - Math.pow(-2*t + 2, 5) / 2;
    const step = now => {
      const p = Math.min(1, (now - t0) / duration);
      move(start + distance * ease(p));
      if (p < 1) scrollFrame = requestAnimationFrame(step);
      else {
        move(target);
        scrollFrame = 0;
        restoreScrollStyle();
      }
    };
    scrollFrame = requestAnimationFrame(step);
    return true;
  }

  function navigate(hash) {
    const resolved = resolveHash(hash);
    if (!targets.has(resolved)) return false;
    const section = document.getElementById(resolved.slice(1));
    if (!section) return false;
    smoothScrollTo(section, 1850);
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
