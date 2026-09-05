/* Automated Hearts Round 1063 — predictive model cache + first-frame shield gate.
   Model documents/runtimes are warmed without speculative WebGL contexts. The moving
   leather shield remains closed until the selected model has produced a real frame. */
(() => {
  'use strict';
  const page = document.body?.dataset?.page || '';
  const isModelPage = page === 'learning' || page === 'who-we-help';
  const SHIELD_MS = 2000;
  const EASE = 'cubic-bezier(.22,.66,.24,1)';
  const readyFrames = new WeakSet();
  const waiters = new WeakMap();
  const warmed = new Set();
  let bypassOrb = null;

  const stageFor = (frame) => frame?.closest?.('#learning-model-stage,#who-help-model-stage') || null;
  const activeFrame = (stage) => stage?.querySelector('.learning-lesson-slide.is-active iframe') || null;
  const frameSrc = (frame) => frame?.dataset?.src || frame?.getAttribute?.('src') || '';
  const isActiveFrame = (stage, frame) => !!stage && !!frame && activeFrame(stage) === frame;

  const warm = (raw, high = false) => {
    if (!raw) return;
    let url;
    try { url = new URL(raw, location.href); } catch (_) { return; }
    if (location.protocol !== 'file:' && url.origin !== location.origin) return;
    if (warmed.has(url.href)) return;
    warmed.add(url.href);
    if (location.protocol === 'file:') {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url.href;
      document.head.appendChild(link);
      return;
    }
    const options = { cache:'force-cache', credentials:'same-origin' };
    if (high) options.priority = 'high';
    fetch(url.href, options).catch(() => {});
  };

  const warmAllModels = () => {
    if (!isModelPage) return;
    document.querySelectorAll('#learning-model-stage iframe[data-src],#who-help-model-stage iframe[data-src]')
      .forEach((frame) => warm(frame.dataset.src));
    warm('./vendor/three-0.160.0/three.min.js');
  };

  const hydrate = (frame) => {
    if (!frame) return null;
    const src = frame.dataset.src;
    if (src && !frame.getAttribute('src')) {
      frame.setAttribute('loading','eager');
      frame.setAttribute('src',src);
    } else {
      frame.setAttribute('loading','eager');
    }
    return frame;
  };

  const sendActive = (frame, active = true) => {
    try {
      frame?.contentWindow?.postMessage({type:'automated-hearts:learning-activity',active:!!active},'*');
      frame?.contentWindow?.postMessage({type:'automated-hearts:viewport-activity',active:!!active},'*');
    } catch (_) {}
  };

  const prepareStage = (stage, frame = null) => {
    if (!stage) return;
    stage.dataset.modelPreparing = '1';
    stage.classList.remove('ah-model-frame-ready');
    const target = frame || activeFrame(stage);
    if (target) {
      hydrate(target);
      if (readyFrames.has(target)) {
        stage.classList.add('ah-model-frame-ready');
      } else {
        sendActive(target,true);
      }
    }
    window.dispatchEvent(new CustomEvent('ah:local-shield-state'));
  };

  const markFrameReady = (frame) => {
    if (!frame) return;
    readyFrames.add(frame);
    const list = waiters.get(frame);
    if (list) {
      waiters.delete(frame);
      list.forEach((resolve) => resolve(true));
    }
    const stage = stageFor(frame);
    if (isActiveFrame(stage,frame)) {
      stage.classList.add('ah-model-frame-ready');
      stage.dataset.modelFirstFrame = '1';
      /* If the old stage controller already requested "open", adding this class
         starts the single 2-second downward transform now. */
      sendActive(frame,true);
    }
  };

  const sameOriginCanvasReady = (frame) => {
    try {
      const canvas = frame?.contentDocument?.querySelector('canvas');
      return !!canvas && canvas.width > 2 && canvas.height > 2;
    } catch (_) { return false; }
  };

  const waitForReady = (frame, timeout = 10000) => {
    if (!frame) return Promise.resolve(false);
    if (readyFrames.has(frame)) return Promise.resolve(true);
    hydrate(frame);
    sendActive(frame,true);
    return new Promise((resolve) => {
      const bucket = waiters.get(frame) || [];
      bucket.push(resolve);
      waiters.set(frame,bucket);
      const started = performance.now();
      const poll = () => {
        if (readyFrames.has(frame)) return;
        sendActive(frame,true);
        /* Robust same-origin fallback for a model that cannot postMessage for any
           reason: require a live canvas and two compositor frames before release. */
        if (sameOriginCanvasReady(frame) && performance.now() - started > 350) {
          requestAnimationFrame(() => requestAnimationFrame(() => markFrameReady(frame)));
          return;
        }
        if (performance.now() - started < timeout) setTimeout(poll,90);
      };
      poll();
    });
  };

  const shield = (stage) => stage?.querySelector(':scope > [data-learning-stage-shield]') || null;
  const waitTransform = (stage) => new Promise((resolve) => {
    const cover = shield(stage);
    if (!cover) { resolve(); return; }
    let done = false;
    let timer = 0;
    const finish = () => {
      if (done) return;
      done = true;
      cover.removeEventListener('transitionend',onEnd);
      cover.removeEventListener('transitioncancel',onCancel);
      if (timer) clearTimeout(timer);
      resolve();
    };
    const onEnd = (event) => {
      if (event.target === cover && event.propertyName === 'transform') finish();
    };
    const onCancel = (event) => { if (event.target === cover) finish(); };
    cover.addEventListener('transitionend',onEnd);
    cover.addEventListener('transitioncancel',onCancel);
    timer = setTimeout(finish,SHIELD_MS + 260);
  });

  const closeShield = async (stage) => {
    if (!stage) return;
    const cover = shield(stage);
    if (!cover) return;
    cover.style.setProperty('transition',`transform ${SHIELD_MS}ms ${EASE}`,'important');
    const wasOpen = stage.classList.contains('is-learning-shield-open') && stage.classList.contains('ah-model-frame-ready');
    const done = wasOpen ? waitTransform(stage) : Promise.resolve();
    stage.dataset.shieldMotion = '1';
    cover.style.setProperty('pointer-events','auto','important');
    stage.classList.remove('ah-model-frame-ready','is-learning-shield-open');
    stage.classList.add('is-learning-shield-closed');
    window.dispatchEvent(new CustomEvent('ah:local-shield-state'));
    await done;
    delete stage.dataset.shieldMotion;
  };

  const openShield = async (stage, frame) => {
    if (!stage || !frame) return;
    await waitForReady(frame);
    stage.classList.add('ah-model-frame-ready');
    const cover = shield(stage);
    if (!cover) return;
    cover.style.setProperty('transition',`transform ${SHIELD_MS}ms ${EASE}`,'important');
    const done = waitTransform(stage);
    stage.dataset.shieldMotion = '1';
    cover.style.setProperty('pointer-events','auto','important');
    stage.classList.remove('is-learning-shield-closed');
    stage.classList.add('is-learning-shield-open');
    window.dispatchEvent(new CustomEvent('ah:local-shield-state'));
    await done;
    delete stage.dataset.shieldMotion;
    delete stage.dataset.modelPreparing;
    window.dispatchEvent(new CustomEvent('ah:local-shield-state'));
    sendActive(frame,true);
  };

  const waitModelMotion = (stage, oldFrame, timeout=1500) => new Promise((resolve) => {
    const started = performance.now();
    const poll = () => {
      const current = activeFrame(stage);
      if (current && current !== oldFrame && !stage.dataset.modelMotion) { resolve(current); return; }
      if (performance.now() - started >= timeout) { resolve(current || activeFrame(stage)); return; }
      setTimeout(poll,45);
    };
    poll();
  });

  const protectedOrbSwitch = async (orb) => {
    const stage = orb?.closest('#learning-model-stage,#who-help-model-stage');
    if (!stage || stage.dataset.ah1063Switching === '1') return;
    stage.dataset.ah1063Switching = '1';
    const returnButton = stage.querySelector('[data-learning-choose-another],[data-who-help-back-to-top]');
    if (returnButton) returnButton.disabled = true;
    const priorFrame = activeFrame(stage);
    try {
      await closeShield(stage);
      prepareStage(stage);
      bypassOrb = orb;
      orb.click(); /* allow the original carousel controller to own all model/group bookkeeping */
      const frame = await waitModelMotion(stage,priorFrame);
      prepareStage(stage,frame);
      await openShield(stage,frame);
    } finally {
      bypassOrb = null;
      if (returnButton) returnButton.disabled = false;
      delete stage.dataset.ah1063Switching;
    }
  };

  if (isModelPage) {
    const stages = Array.from(document.querySelectorAll('#learning-model-stage,#who-help-model-stage'));
    stages.forEach((stage) => {
      const cover = shield(stage);
      if (cover) {
        /* Round 1020 intentionally made this legacy timing node invisible. Round
           1063 restores it as the actual moving cover; overwrite those older
           inline !important declarations after all legacy runtimes have loaded. */
        cover.style.setProperty('display','block','important');
        cover.style.setProperty('visibility','visible','important');
        cover.style.setProperty('opacity','1','important');
        cover.style.setProperty('background-color','#08172b','important');
        cover.style.setProperty('background-image','url("./assets/page-shield-embossed-strong-round1067.webp")','important');
        cover.style.setProperty('background-position','center center','important');
        cover.style.setProperty('background-size','cover','important');
        cover.style.setProperty('background-repeat','no-repeat','important');
        cover.style.setProperty('border','1px solid rgba(143,255,215,.24)','important');
        cover.style.setProperty('box-shadow','inset 0 0 0 1px rgba(0,0,0,.62)','important');
        cover.style.setProperty('filter','none','important');
        cover.style.setProperty('pointer-events','auto','important');
        cover.style.setProperty('transition',`transform ${SHIELD_MS}ms ${EASE}`,'important');
        cover.style.setProperty('will-change','transform','important');
        cover.style.setProperty('backface-visibility','hidden','important');
      }
      /* The older static-background authority watches child additions and can
         re-hide this node. Reassert after its callback if the stage structure changes. */
      if (cover && 'MutationObserver' in window) {
        new MutationObserver(() => {
          queueMicrotask(() => {
            cover.style.setProperty('display','block','important');
            cover.style.setProperty('visibility','visible','important');
            cover.style.setProperty('opacity','1','important');
            cover.style.setProperty('background-color','#08172b','important');
            cover.style.setProperty('background-image','url("./assets/page-shield-embossed-strong-round1067.webp")','important');
            cover.style.setProperty('background-position','center center','important');
            cover.style.setProperty('background-size','cover','important');
            cover.style.setProperty('background-repeat','no-repeat','important');
            cover.style.setProperty('box-shadow','inset 0 0 0 1px rgba(0,0,0,.62)','important');
            cover.style.setProperty('opacity','1','important');
          });
        }).observe(stage,{childList:true});
      }
      cover?.addEventListener('transitionend',(event) => {
        if (event.propertyName !== 'transform') return;
        if (stage.classList.contains('is-learning-shield-open') && stage.classList.contains('ah-model-frame-ready')) {
          delete stage.dataset.modelPreparing;
          delete stage.dataset.shieldMotion;
          cover.style.setProperty('pointer-events','none','important');
          window.dispatchEvent(new CustomEvent('ah:local-shield-state'));
          sendActive(activeFrame(stage),true);
        }
      });
    });

    window.addEventListener('message',(event) => {
      const data = event.data || {};
      if (data.type !== 'automated-hearts:model-first-frame') return;
      for (const frame of document.querySelectorAll('#learning-model-stage iframe,#who-help-model-stage iframe')) {
        if (frame.contentWindow === event.source) { markFrameReady(frame); break; }
      }
    });

    /* Start fetching the actual model document before click whenever intent is clear. */
    const intentSelector = page === 'learning'
      ? '#learning-route-buttons [data-learning-model]'
      : '#who-we-help-solutions .premium-route-card__image-button';
    const warmIntent = (target, high=false) => {
      const control = target?.closest?.(intentSelector);
      if (!control) return;
      let frame = null;
      if (page === 'learning') {
        frame = document.querySelector(`#learning-model-stage [data-learning-slide="${control.dataset.learningModel}"] iframe`);
      } else {
        frame = document.querySelector('#who-help-model-stage [data-shared-slide="helix"] iframe');
      }
      warm(frameSrc(frame),high);
      /* On actual activation, clear readiness before the legacy selector/scroll runs,
         but let the existing click controller unlock the stage before assigning src. */
      if (high) {
        const stage = stageFor(frame) || document.querySelector(page === 'learning' ? '#learning-model-stage' : '#who-help-model-stage');
        if (stage) {
          stage.dataset.modelPreparing = '1';
          stage.classList.remove('ah-model-frame-ready');
          if (frame && readyFrames.has(frame)) stage.classList.add('ah-model-frame-ready');
          window.dispatchEvent(new CustomEvent('ah:local-shield-state'));
        }
      }
    };
    document.addEventListener('pointerover',(e)=>warmIntent(e.target,false),{capture:true,passive:true});
    document.addEventListener('focusin',(e)=>warmIntent(e.target,false),{capture:true,passive:true});
    document.addEventListener('pointerdown',(e)=>warmIntent(e.target,true),{capture:true,passive:true});
    document.addEventListener('touchstart',(e)=>warmIntent(e.target,true),{capture:true,passive:true});
    document.addEventListener('keydown',(e)=>{
      if ((e.key === 'Enter' || e.key === ' ') && e.target instanceof Element) warmIntent(e.target,true);
    },true);

    if (!window.__AH_R1071_MODEL_CONTROLLER) {
    /* Side-arrow changes are performed completely behind the leather shield.
       The old 860ms two-WebGL slide animation may still run, but it is hidden and
       cannot steal compositor budget from the visible 2-second shield movement. */
    document.querySelectorAll('[data-learning-carousel-direction],[data-shared-carousel-direction]').forEach((orb) => {
      orb.addEventListener('click',(event) => {
        if (bypassOrb === orb) { bypassOrb = null; return; }
        event.preventDefault();
        event.stopImmediatePropagation();
        protectedOrbSwitch(orb);
      },true);
    });
    stages.forEach((stage) => stage.addEventListener('keydown',(event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      const orb = stage.querySelector(event.key === 'ArrowLeft'
        ? '[data-learning-carousel-direction="previous"],[data-shared-carousel-direction="previous"]'
        : '[data-learning-carousel-direction="next"],[data-shared-carousel-direction="next"]');
      if (!orb || orb.disabled) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      protectedOrbSwitch(orb);
    },true));
    }

    /* Once the first visible page content settles, fetch every tiny model document
       and the two shared Three runtimes into HTTP/SW cache. No hidden renderer is
       created, so this improves later selections without consuming extra WebGL contexts. */
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (!connection?.saveData) {
      if ('requestIdleCallback' in window) requestIdleCallback(warmAllModels,{timeout:1800});
      else setTimeout(warmAllModels,700);
    }
  }

  /* Global shield artwork decode is performed at idle too, so compositor travel
     never begins while the WebP is waiting for its first raster decode. */
  const decodeShield = () => {
    const image = new Image();
    image.decoding = 'async';
    image.src = './assets/page-shield-embossed-strong-round1067.webp';
    image.decode?.().catch(()=>{});
  };
  if ('requestIdleCallback' in window) requestIdleCallback(decodeShield,{timeout:800});
  else setTimeout(decodeShield,120);
})();
