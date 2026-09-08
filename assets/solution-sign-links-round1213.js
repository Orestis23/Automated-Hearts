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

  function smoothScrollTo(section, duration=3000) {
    if (!section) return Promise.resolve(false);
    if (scrollFrame) cancelAnimationFrame(scrollFrame);
    restoreScrollStyle();
    scrollFrame = 0;

    const scroller = scrollHost(section);
    const documentScroller = document.scrollingElement || document.documentElement;
    const isDocument = scroller === documentScroller;
    const readTop = () => isDocument
      ? Math.max(window.scrollY || 0, documentScroller.scrollTop || 0, document.body?.scrollTop || 0)
      : Math.max(0, scroller.scrollTop || 0);
    const writeTop = value => {
      const next = Math.max(0, Number(value) || 0);
      if (isDocument) window.scrollTo(0, next);
      else scroller.scrollTop = next;
    };

    const start = readTop();
    const fixedTitle = document.querySelector('.page-chip,.rim-page-name-screen,.mobile-page-title,.lite-page-title');
    const headerOffset = fixedTitle ? Math.max(80, fixedTitle.getBoundingClientRect().bottom + 16) : 80;
    const hostTop = isDocument ? 0 : scroller.getBoundingClientRect().top + scroller.clientTop;
    const offset = Math.max(hostTop + 16, headerOffset);
    const maxScroll = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
    const target = Math.max(0, Math.min(maxScroll, start + section.getBoundingClientRect().top - offset));
    const distance = target - start;

    const touched = [];
    const saveAndSet = (node, prop, value) => {
      if (!node?.style) return;
      touched.push([node, prop, node.style.getPropertyValue(prop), node.style.getPropertyPriority(prop)]);
      node.style.setProperty(prop, value, 'important');
    };
    saveAndSet(scroller, 'scroll-behavior', 'auto');
    saveAndSet(scroller, 'scroll-snap-type', 'none');
    saveAndSet(scroller, 'overflow-anchor', 'none');
    if (isDocument) {
      saveAndSet(document.documentElement, 'scroll-behavior', 'auto');
      saveAndSet(document.body, 'scroll-behavior', 'auto');
      saveAndSet(document.documentElement, 'scroll-snap-type', 'none');
      saveAndSet(document.body, 'scroll-snap-type', 'none');
      saveAndSet(document.documentElement, 'overflow-anchor', 'none');
      saveAndSet(document.body, 'overflow-anchor', 'none');
    }
    restoreScrollStyle = () => {
      while (touched.length) {
        const [node, prop, oldValue, oldPriority] = touched.pop();
        if (oldValue) node.style.setProperty(prop, oldValue, oldPriority);
        else node.style.removeProperty(prop);
      }
      restoreScrollStyle = () => {};
    };

    if (reducedMotion || Math.abs(distance) < 2) {
      writeTop(target);
      restoreScrollStyle();
      return Promise.resolve(true);
    }

    // Round 1213: the model focus finishes first. Only then does this long,
    // frame-by-frame sine-eased anchor glide begin. No native hash jump is used.
    return new Promise(resolve => {
      const t0 = performance.now();
      const ease = t => 0.5 - Math.cos(Math.PI * t) / 2;
      const step = now => {
        const p = Math.min(1, (now - t0) / duration);
        writeTop(start + distance * ease(p));
        if (p < 1) {
          scrollFrame = requestAnimationFrame(step);
          return;
        }
        writeTop(target);
        scrollFrame = 0;
        restoreScrollStyle();
        resolve(true);
      };
      scrollFrame = requestAnimationFrame(step);
    });
  }

  function navigate(hash) {
    const resolved = resolveHash(hash);
    if (!targets.has(resolved)) return false;
    const section = document.getElementById(resolved.slice(1));
    if (!section) return false;
    smoothScrollTo(section, 3000).then(() => {
      // replaceState changes the URL only after arrival and never invokes the
      // browser's instantaneous native anchor jump.
      try { history.replaceState(history.state, '', resolved); } catch (_) {}
    });
    return true;
  }
  window.ahSolutionNavigate = navigate;

  // Route any ordinary in-page Solution anchors through the same controlled
  // scroll path so mouse, keyboard, and 3D-machine navigation all feel alike.
  document.addEventListener('click', event => {
    const link = event.target.closest?.('a[href^="#solution-"]');
    if (!link) return;
    const raw = link.getAttribute('href');
    const resolved = resolveHash(raw);
    if (!targets.has(resolved)) return;
    event.preventDefault();
    navigate(resolved);
  }, true);

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
