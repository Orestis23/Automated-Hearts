/* Round 1343 — unified mobile/desktop red-sign navigation: focus first, then controlled page glide.
   Red machine signs: camera focus + actual-scroll-surface, layout-shift-safe section glide.
   No native anchor jump is used. The destination is recomputed throughout the glide so
   lazy images, responsive layout changes, and nested desktop scrollers cannot leave the
   page short of the requested Solution section. */
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
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let scrollFrame = 0;
  let activeScrollToken = 0;
  let restoreScrollStyle = () => {};

  function scrollHost(section) {
    // Desktop uses the fixed, internally scrolling main viewport; mobile uses the
    // document. Resolve the actual moving surface every time instead of assuming one.
    const main = document.querySelector('main#main-content');
    if (main && main.contains(section)) {
      const cs = getComputedStyle(main);
      if (/auto|scroll/.test(cs.overflowY) && main.scrollHeight > main.clientHeight + 4) return main;
    }
    for (let node=section?.parentElement; node && node!==document.body && node!==document.documentElement; node=node.parentElement) {
      const cs=getComputedStyle(node);
      if (/auto|scroll/.test(cs.overflowY) && node.scrollHeight > node.clientHeight + 4) return node;
    }
    return document.scrollingElement || document.documentElement;
  }

  function smoothScrollTo(section, duration=2850) {
    if (!section) return Promise.resolve(false);
    if (scrollFrame) cancelAnimationFrame(scrollFrame);
    restoreScrollStyle();
    scrollFrame = 0;
    const token = ++activeScrollToken;

    const scroller = scrollHost(section);
    const docScroller = document.scrollingElement || document.documentElement;
    const isDocument = scroller === docScroller || scroller === document.documentElement || scroller === document.body;
    const readTop = () => isDocument
      ? Math.max(window.scrollY || 0, docScroller.scrollTop || 0, document.body?.scrollTop || 0)
      : Math.max(0, scroller.scrollTop || 0);
    const writeTop = value => {
      const next = Math.max(0, Number(value) || 0);
      if (isDocument) window.scrollTo(0, next);
      else scroller.scrollTop = next;
    };
    const maxTop = () => Math.max(0, (isDocument ? docScroller.scrollHeight - innerHeight : scroller.scrollHeight - scroller.clientHeight));
    const scrollerViewportTop = () => isDocument ? 0 : scroller.getBoundingClientRect().top + scroller.clientTop;
    const visibleHeaderOffset = () => {
      const top = scrollerViewportTop();
      const fixedTitle = document.querySelector('.page-chip,.rim-page-name-screen,.mobile-page-title,.lite-page-title');
      const titleBottom = fixedTitle ? fixedTitle.getBoundingClientRect().bottom : top + 64;
      // Offset is local to the actual scrolling viewport, not the browser window.
      return Math.max(18, titleBottom - top + 16);
    };
    const desiredTop = () => {
      const current = readTop();
      const relativeTop = section.getBoundingClientRect().top - scrollerViewportTop();
      return Math.max(0, Math.min(maxTop(), current + relativeTop - visibleHeaderOffset()));
    };

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

    if (reducedMotion) {
      writeTop(desiredTop());
      restoreScrollStyle();
      return Promise.resolve(true);
    }

    const ease = t => 0.5 - Math.cos(Math.PI * t) / 2;
    const runPass = (passDuration, startTop, passIndex=0) => new Promise(resolve => {
      const t0 = performance.now();
      const step = now => {
        if (token !== activeScrollToken) { resolve(false); return; }
        const p = Math.min(1, (now - t0) / passDuration);
        // Recompute the destination every frame. This is the key fix for lazy-loaded
        // sections and responsive/nested scrollers that move while the page is gliding.
        const liveTarget = desiredTop();
        writeTop(startTop + (liveTarget - startTop) * ease(p));
        if (p < 1) {
          scrollFrame = requestAnimationFrame(step);
          return;
        }
        writeTop(desiredTop());
        scrollFrame = 0;
        resolve(true);
      };
      scrollFrame = requestAnimationFrame(step);
    });

    return (async () => {
      let ok = await runPass(duration, readTop(), 0);
      if (!ok) return false;
      // Smooth settle passes catch late image/font/layout shifts. Never finish with
      // a direct write/snap; every correction remains animated.
      for (let i=0; i<4; i++) {
        await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
        const error = desiredTop() - readTop();
        if (Math.abs(error) <= 1.25) break;
        ok = await runPass(480, readTop(), i+1);
        if (!ok) return false;
      }
      restoreScrollStyle();
      return true;
    })().catch(() => {
      restoreScrollStyle();
      return false;
    });
  }

  function navigate(hash) {
    const resolved = resolveHash(hash);
    if (!targets.has(resolved)) return false;
    const section = document.getElementById(resolved.slice(1));
    if (!section) return false;
    smoothScrollTo(section, 3050).then(ok => {
      if (!ok) return;
      try { history.replaceState(history.state, '', resolved); } catch (_) {}
    });
    return true;
  }
  window.ahSolutionNavigate = navigate;

  document.addEventListener('click', event => {
    const link = event.target.closest?.('a[href^="#solution-"]');
    if (!link) return;
    const resolved = resolveHash(link.getAttribute('href'));
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
    cover.setAttribute('aria-label', open ? 'Machine window open' : 'Reveal the machine');
    // Several older desktop shield styles deliberately kept the raised cover clickable.
    // That exposed 104px lip sat directly over the overhead red-sign arc and intercepted
    // mouse clicks. Once open, make the glass/shield completely click-through so the
    // Three.js canvas owns every red-sign interaction.
    if (open) cover.style.setProperty('pointer-events','none','important');
    else cover.style.removeProperty('pointer-events');
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
  if (location.hash && targets.has(resolveHash(location.hash))) requestAnimationFrame(()=>navigate(location.hash));
})();
