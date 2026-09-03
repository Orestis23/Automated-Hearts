/* Automated Hearts Round 1062 lean deferred runtime. */

/* SOURCE: round510-model-scroll.js */
/* Round 718 (based on Round 510): a single deterministic scroll owner for the Learning Center and
   Who We Help image buttons. This capture listener runs before the legacy
   navigation and generic hash handlers, preventing either from introducing a
   second animation or an instantaneous native hash jump. */
(() => {
  'use strict';

  const page = document.body?.dataset?.page || '';
  const config = page === 'learning'
    ? {
        selector:'#learning-route-buttons .learning-medallion-button',
        stage:'#learning-model-stage'
      }
    : page === 'who-we-help'
      ? {
          selector:'#who-we-help-solutions .premium-route-card__image-button',
          stage:'#who-help-model-stage'
        }
      : null;

  if (!config) return;

  const modelStage = document.querySelector(config.stage);
  const pageTopTarget = document.querySelector(
    page === 'learning' ? '#learning-route-buttons' : '#who-we-help-solutions'
  );
  const returnButton = document.querySelector(
    page === 'learning' ? '[data-learning-choose-another]' : '[data-who-help-back-to-top]'
  );
  const body = document.body;
  const shieldTravelMs = 2000;
  const shieldTravelEase = 'cubic-bezier(.22,.66,.24,1)';
  const ensureStageShield = () => {
    if (!modelStage) return null;
    let shield = modelStage.querySelector('[data-learning-stage-shield]');
    if (!shield) {
      shield = document.createElement('div');
      shield.className = 'learning-stage-shield';
      shield.dataset.learningStageShield = '';
      shield.setAttribute('aria-hidden','true');
      modelStage.insertBefore(shield,modelStage.firstChild);
    }
    return shield;
  };
  const ensureActiveModel = () => {
    const activeSlide = modelStage?.querySelector('.learning-lesson-slide.is-active')
      || modelStage?.querySelector('.learning-lesson-slide:not([hidden])');
    const frame = activeSlide?.querySelector('iframe');
    if (!frame) return;
    if (!frame.getAttribute('src') && frame.dataset.src) frame.setAttribute('src',frame.dataset.src);
    frame.setAttribute('loading','eager');
  };
  const coverModelStage = () => {
    const shield = ensureStageShield();
    if (!shield || !modelStage) return;
    shield.style.setProperty('transition',`transform ${shieldTravelMs}ms ${shieldTravelEase}`,'important');
    modelStage.classList.remove('is-learning-shield-open');
    modelStage.classList.add('is-learning-shield-closed');
  };
  const revealModelStage = () => {
    const shield = ensureStageShield();
    if (!shield || !modelStage) return;
    shield.style.setProperty('transition',`transform ${shieldTravelMs}ms ${shieldTravelEase}`,'important');
    modelStage.dataset.shieldMotion = '1';
    window.dispatchEvent(new CustomEvent('ah:local-shield-state'));
    modelStage.classList.remove('is-learning-shield-closed');
    modelStage.classList.add('is-learning-shield-open');
    window.setTimeout(() => {
      if (!modelStage.classList.contains('is-learning-shield-open')) return;
      delete modelStage.dataset.shieldMotion;
      window.dispatchEvent(new CustomEvent('ah:local-shield-state'));
    },shieldTravelMs);
  };

  /* Round 558: the lower model stage is physically removed from the document's
     scrollable layout until a route choice is made. This prevents wheel, trackpad,
     keyboard, touch, or scrollbar movement from exposing the model area early. */
  const setStageLocked = (locked) => {
    if (!modelStage || !body) return;
    const shouldLock = Boolean(locked);
    body.classList.toggle('ah-model-stage-locked',shouldLock);
    if (page === 'learning') {
      document.documentElement.classList.toggle('ah-learning-choice-locked',shouldLock);
    }
    modelStage.classList.toggle('is-model-stage-locked',shouldLock);
    modelStage.setAttribute('aria-hidden',String(shouldLock));
    modelStage.setAttribute('tabindex',shouldLock ? '-1' : '0');
    if (shouldLock) modelStage.style.setProperty('display','none','important');
    else modelStage.style.removeProperty('display');
  };
  window.__ahSetModelStageLockedRound558 = setStageLocked;

  /* Both pages begin with the leather stage closed and absent from the
     scrollable page. A successful button selection is the only unlock path. */
  coverModelStage();
  setStageLocked(true);

  let activeFrame = 0;
  let activeToken = 0;
  let restoreScrollState = null;

  const documentSurface = () => document.scrollingElement || document.documentElement;

  /* Round 718 — Who We Help scroll gate.
     While the model stage is locked, users may still scroll through the upper
     choice area on short/mobile viewports, but they cannot scroll past its
     bottom boundary into the lower stage/footer area. The only unlock path is
     clicking another Who We Help category card. */
  let whoHelpTouchY = null;
  let whoHelpClampFrame = 0;
  let returnInputLocked = false;

  const currentDocumentTop = () => {
    const surface = documentSurface();
    return Math.max(window.scrollY || 0,surface?.scrollTop || 0,document.body?.scrollTop || 0);
  };
  const whoHelpLockedMaxTop = () => {
    if (page !== 'who-we-help' || !pageTopTarget) return Infinity;
    const current = currentDocumentTop();
    const rect = pageTopTarget.getBoundingClientRect();
    const absoluteBottom = current + rect.bottom;
    return Math.max(0,absoluteBottom - window.innerHeight);
  };
  const whoHelpChoiceIsLocked = () => page === 'who-we-help'
    && Boolean(body?.classList.contains('ah-model-stage-locked'));
  const clampWhoHelpLockedScroll = () => {
    if (!whoHelpChoiceIsLocked()) return;
    const maxTop = whoHelpLockedMaxTop();
    const current = currentDocumentTop();
    if (current > maxTop + 1) window.scrollTo(0,maxTop);
  };
  const scheduleWhoHelpClamp = () => {
    if (!whoHelpChoiceIsLocked() || whoHelpClampFrame) return;
    whoHelpClampFrame = requestAnimationFrame(() => {
      whoHelpClampFrame = 0;
      clampWhoHelpLockedScroll();
    });
  };
  const shouldBlockWhoHelpDownwardScroll = () => {
    if (!whoHelpChoiceIsLocked()) return false;
    return currentDocumentTop() >= whoHelpLockedMaxTop() - 1;
  };
  const blockReturnInput = (event) => {
    if (!returnInputLocked) return;
    event.preventDefault();
  };
  const blockWhoHelpWheel = (event) => {
    if (returnInputLocked) {
      event.preventDefault();
      return;
    }
    if (event.deltaY > 0 && shouldBlockWhoHelpDownwardScroll()) event.preventDefault();
  };
  const blockWhoHelpKey = (event) => {
    if (returnInputLocked) {
      if (['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' ','Spacebar'].includes(event.key)) {
        event.preventDefault();
      }
      return;
    }
    if (!whoHelpChoiceIsLocked()) return;
    if (['ArrowDown','PageDown','End',' ','Spacebar'].includes(event.key) && shouldBlockWhoHelpDownwardScroll()) {
      event.preventDefault();
    }
  };
  const whoHelpTouchStart = (event) => {
    if (page !== 'who-we-help') return;
    whoHelpTouchY = event.touches?.[0]?.clientY ?? null;
  };
  const whoHelpTouchMove = (event) => {
    if (returnInputLocked) {
      event.preventDefault();
      return;
    }
    if (!whoHelpChoiceIsLocked() || whoHelpTouchY == null) return;
    const nextY = event.touches?.[0]?.clientY;
    if (nextY == null) return;
    const fingerMovedUp = nextY < whoHelpTouchY;
    whoHelpTouchY = nextY;
    if (fingerMovedUp && shouldBlockWhoHelpDownwardScroll()) event.preventDefault();
  };

  if (page === 'who-we-help') {
    window.addEventListener('scroll',scheduleWhoHelpClamp,{ passive:true });
    window.addEventListener('resize',scheduleWhoHelpClamp,{ passive:true });
    window.addEventListener('wheel',blockWhoHelpWheel,{ capture:true,passive:false });
    window.addEventListener('keydown',blockWhoHelpKey,true);
    window.addEventListener('touchstart',whoHelpTouchStart,{ capture:true,passive:true });
    window.addEventListener('touchmove',whoHelpTouchMove,{ capture:true,passive:false });
  }
  const isScrollable = (element) => {
    if (!element || element === document.body || element === document.documentElement) return false;
    const style = getComputedStyle(element);
    return /(auto|scroll)/.test(style.overflowY) && element.scrollHeight > element.clientHeight + 2;
  };
  const findSurface = (target) => {
    let parent = target?.parentElement || null;
    while (parent && parent !== document.body) {
      if (isScrollable(parent)) return parent;
      parent = parent.parentElement;
    }
    return documentSurface();
  };

  const rememberInline = (element, property) => ({
    value:element.style.getPropertyValue(property),
    priority:element.style.getPropertyPriority(property)
  });
  const applyAnimationScrollState = (surface) => {
    const elements = Array.from(new Set([
      surface,
      document.documentElement,
      document.body
    ].filter(Boolean)));
    const saved = elements.map((element) => ({
      element,
      behavior:rememberInline(element,'scroll-behavior'),
      anchor:rememberInline(element,'overflow-anchor'),
      snap:rememberInline(element,'scroll-snap-type')
    }));

    elements.forEach((element) => {
      element.style.setProperty('scroll-behavior','auto','important');
      element.style.setProperty('overflow-anchor','none','important');
      element.style.setProperty('scroll-snap-type','none','important');
    });

    return () => saved.forEach(({ element, behavior, anchor, snap }) => {
      const restore = (property, prior) => {
        if (prior.value) element.style.setProperty(property,prior.value,prior.priority);
        else element.style.removeProperty(property);
      };
      restore('scroll-behavior',behavior);
      restore('overflow-anchor',anchor);
      restore('scroll-snap-type',snap);
    });
  };

  const readTop = (surface) => surface === documentSurface()
    ? Math.max(window.scrollY || 0, surface.scrollTop || 0, document.body?.scrollTop || 0)
    : surface.scrollTop;
  const writeTop = (surface, top) => {
    const value = Math.max(0, Number(top) || 0);
    if (surface === documentSurface()) window.scrollTo(0,value);
    else surface.scrollTop = value;
  };

  const smoothToStage = async (stage) => {
    const token = ++activeToken;
    if (activeFrame) cancelAnimationFrame(activeFrame);
    activeFrame = 0;
    if (restoreScrollState) restoreScrollState();
    restoreScrollState = null;

    const surface = findSurface(stage);
    restoreScrollState = applyAnimationScrollState(surface);
    document.querySelector('main#main-content')?.classList.add('ah-model-scroll-active');

    /* Let the selected iframe settle before measuring its final destination. */
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    if (token !== activeToken) {
      document.querySelector('main#main-content')?.classList.remove('ah-model-scroll-active');
      if (restoreScrollState) restoreScrollState();
      restoreScrollState = null;
      return false;
    }

    const start = readTop(surface);
    const stageRect = stage.getBoundingClientRect();
    const surfaceRectTop = surface === documentSurface() ? 0 : surface.getBoundingClientRect().top;
    const scrollMargin = parseFloat(getComputedStyle(stage).scrollMarginTop) || 20;
    const viewportSize = surface === documentSurface() ? window.innerHeight : surface.clientHeight;
    const maximum = Math.max(0,surface.scrollHeight - viewportSize);
    const destination = Math.min(
      maximum,
      Math.max(0,start + stageRect.top - surfaceRectTop - scrollMargin)
    );
    const distance = destination - start;
    const duration = Math.min(1750,Math.max(1100,900 + Math.abs(distance) * .32));
    const started = performance.now();
    const ease = (value) => value < .5
      ? 4 * value * value * value
      : 1 - Math.pow(-2 * value + 2,3) / 2;

    return new Promise((resolve) => {
      let settled = false;
      let watchdog = 0;
      const cleanup = () => {
        if (activeFrame) cancelAnimationFrame(activeFrame);
        activeFrame = 0;
        if (watchdog) window.clearTimeout(watchdog);
        document.querySelector('main#main-content')?.classList.remove('ah-model-scroll-active');
        if (restoreScrollState) restoreScrollState();
        restoreScrollState = null;
      };
      const finish = () => {
        if (settled) return;
        settled = true;
        if (token !== activeToken) {
          cleanup();
          resolve(false);
          return;
        }
        writeTop(surface,destination);
        cleanup();
        revealModelStage();
        window.dispatchEvent(new CustomEvent('ah:model-stage-scroll-complete',{
          detail:{ page, stage:config.stage }
        }));
        resolve(true);
      };

      if (Math.abs(distance) < 2) {
        finish();
        return;
      }

      const step = (now) => {
        if (settled) return;
        if (token !== activeToken) {
          finish();
          return;
        }
        const progress = Math.min(1,Math.max(0,(now - started) / duration));
        writeTop(surface,start + distance * ease(progress));
        if (progress < 1) activeFrame = requestAnimationFrame(step);
        else activeFrame = requestAnimationFrame(finish);
      };

      activeFrame = requestAnimationFrame(step);
      /* Heavy 3D iframes can delay the last animation frame. This fallback
         completes the valid selection and reveals the shield reliably. */
      watchdog = window.setTimeout(finish,duration + 360);
    });
  };


  const forceShieldTravelTiming = () => {
    const shield = ensureStageShield();
    if (!shield) return null;
    shield.style.setProperty('transition',`transform ${shieldTravelMs}ms ${shieldTravelEase}`,'important');
    return shield;
  };

  /* Round 916: local stage shields use the same single transform transition as
     the viewport shield. One state change starts the move; transitionend is the
     completion signal. No frame-by-frame shield transform writes remain. */
  const animateShieldUp = () => new Promise((resolve) => {
    const shield = ensureStageShield();
    if (!shield || !modelStage) {
      resolve();
      return;
    }
    shield.style.setProperty('transition',`transform ${shieldTravelMs}ms ${shieldTravelEase}`,'important');
    modelStage.dataset.shieldMotion = '1';
    window.dispatchEvent(new CustomEvent('ah:local-shield-state'));
    let settled = false;
    let timer = 0;
    const finish = () => {
      if (settled) return;
      settled = true;
      shield.removeEventListener('transitionend',onEnd);
      shield.removeEventListener('transitioncancel',onCancel);
      if (timer) window.clearTimeout(timer);
      delete modelStage.dataset.shieldMotion;
      window.dispatchEvent(new CustomEvent('ah:local-shield-state'));
      resolve();
    };
    const onEnd = (event) => {
      if (event.target === shield && event.propertyName === 'transform') finish();
    };
    const onCancel = (event) => {
      if (event.target === shield) finish();
    };
    shield.addEventListener('transitionend',onEnd);
    shield.addEventListener('transitioncancel',onCancel);
    timer = window.setTimeout(finish,shieldTravelMs + 260);
    modelStage.classList.remove('is-learning-shield-open');
    modelStage.classList.add('is-learning-shield-closed');
  });

  const smoothBackToPageTop = async (target) => {
    if (!target) return;
    const token = ++activeToken;
    if (activeFrame) cancelAnimationFrame(activeFrame);
    activeFrame = 0;
    if (restoreScrollState) restoreScrollState();
    restoreScrollState = null;

    const surface = documentSurface();
    restoreScrollState = applyAnimationScrollState(surface);
    const start = readTop(surface);
    const destination = 0;
    const distance = destination - start;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = reducedMotion ? 1 : Math.min(1750,Math.max(1100,900 + Math.abs(distance) * .28));
    const started = performance.now();
    const ease = (value) => value < .5
      ? 4 * value * value * value
      : 1 - Math.pow(-2 * value + 2,3) / 2;

    await new Promise((resolve) => {
      const cancel = () => {
        activeFrame = 0;
        if (restoreScrollState) restoreScrollState();
        restoreScrollState = null;
        resolve();
      };
      const finish = () => {
        if (token !== activeToken) {
          cancel();
          return;
        }
        writeTop(surface,destination);
        activeFrame = 0;
        if (restoreScrollState) restoreScrollState();
        restoreScrollState = null;
        resolve();
      };
      if (Math.abs(distance) < 2) {
        finish();
        return;
      }
      const step = (now) => {
        if (token !== activeToken) {
          cancel();
          return;
        }
        const progress = Math.min(1,Math.max(0,(now - started) / duration));
        writeTop(surface,start + distance * ease(progress));
        if (progress < 1) activeFrame = requestAnimationFrame(step);
        else activeFrame = requestAnimationFrame(finish);
      };
      activeFrame = requestAnimationFrame(step);
    });
  };

  const activateCard = (link) => {
    const card = link.closest('.premium-route-card');
    card?.classList.add('is-route-pressed');
    coverModelStage();
    if (page === 'learning') {
      document.querySelectorAll(config.selector).forEach((button) => {
        button.setAttribute('aria-pressed',String(button === link));
        button.closest('.premium-route-card')?.classList.toggle('is-learning-active',button === link);
      });
      window.__ahActivateLearningLessonRound436?.(link.dataset.learningModel,{ scroll:false });
      window.__ahPrepareLearningStageShieldRound516?.();
    } else {
      document.querySelectorAll('#who-we-help-solutions .premium-route-card').forEach((item) => {
        item.classList.toggle('is-who-help-active',item === card);
        item.querySelector(':is(.premium-route-card__image-button,.learning-medallion-button)')?.setAttribute(
          'aria-pressed',String(item === card)
        );
      });
      const industryIndex = Math.max(0,Math.min(3,(Number(link.dataset.routeIndex) || 1) - 1));
      window.__ahActivateWhoHelpIndustryRound933?.(industryIndex);
    }

    /* Hydrate only after the requested group/category is active. Previously the
       default AI 101 frame could start before a Practical/Strategy selection,
       wasting parse and WebGL work during the transition. */
    ensureActiveModel();

    window.setTimeout(() => card?.classList.remove('is-route-pressed'),420);
  };

  window.addEventListener('click',(event) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      !(event.target instanceof Element)
    ) return;

    const link = event.target.closest(config.selector);
    if (!link) return;
    const stage = document.querySelector(config.stage);
    if (!stage) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    setStageLocked(false);
    activateCard(link);
    smoothToStage(stage).then((completed) => {
      if (!completed) return;
      try {
        if (window.location.hash !== config.stage) {
          history.replaceState(history.state,'',config.stage);
        }
      } catch (error) {}
    });
  },true);

  /* Round 604: both lower-stage return controls use one authoritative deterministic sequence:
     1) raise/close the local leather shield completely, 2) only after it is
     closed, smoothly scroll all the way back to the top, 3) remove the lower
     stage from the scrollable layout again. This listener is registered before
     the Learning Center legacy return listener and stops that duplicate path. */
  if (returnButton && pageTopTarget) {
    window.__ahSharedModelReturnRound604 = true;
    window.__ahSharedModelReturnRound603 = true;
    window.__ahSharedModelReturnRound602 = true;
    let returningToTop = false;

    returnButton.addEventListener('click',async (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (returningToTop || returnButton.disabled) return;

      returningToTop = true;
      returnButton.disabled = true;
      if (page === 'who-we-help') {
        returnInputLocked = true;
        body?.classList.add('ah-who-help-returning');
      }
      const status = modelStage?.querySelector(
        page === 'learning' ? '[data-learning-carousel-status]' : '[data-shared-carousel-status]'
      );
      if (status) status.textContent = page === 'learning'
        ? 'Closing the lesson shield and returning to the top of the page.'
        : 'Closing the model shield and returning to the top of the page.';

      try {
        /* Round 718: the shield completes its full upward trip before the page
           is allowed to move. animateShieldUp uses the exact same 2000ms travel
           time and cubic-bezier(.22,.66,.24,1) timing used by the downward trip. */
        await animateShieldUp();

        /* Only after the shield is fully closed do we smoothly return to y=0. */
        await smoothBackToPageTop(pageTopTarget);

        /* Remove the lower stage from layout again only after the smooth return.
           A subsequent Who We Help card click is the only code path that calls
           setStageLocked(false), so the lower stage cannot be scrolled back into. */
        setStageLocked(true);
        await new Promise((resolve) => requestAnimationFrame(resolve));
        if (page === 'who-we-help') {
          window.scrollTo(0,0);
          clampWhoHelpLockedScroll();
        }

        try {
          history.replaceState(history.state,'',window.location.pathname + window.location.search);
        } catch (error) {}

        pageTopTarget.querySelector(':is(.premium-route-card__image-button,.learning-medallion-button)')?.focus({ preventScroll:true });
        if (status) status.textContent = page === 'learning'
          ? 'Choose AI 101, Practical AI, or Strategy Lab.'
          : 'Choose a category to view the interactive models.';
      } finally {
        if (page === 'who-we-help') {
          returnInputLocked = false;
          body?.classList.remove('ah-who-help-returning');
          scheduleWhoHelpClamp();
        }
        returnButton.disabled = false;
        returningToTop = false;
      }
    },true);
  }
})();

;
/* SOURCE: ah-js-bundle-01.js */
(() => {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  let closeNavContactDrawer = () => {};


  /* Round 403: the top page-name sign is populated once and remains completely static. */
  const renderPageSignBulbs = (pageLed, label) => {
    if (!pageLed) return 0;
    const normalizedLabel = String(label || "").trim();
    pageLed.dataset.text = normalizedLabel;
    pageLed.setAttribute("aria-label", normalizedLabel);
    pageLed.classList.remove("is-bulb-entering", "is-bulb-exiting", "is-bulb-lit");
    if (pageLed.textContent !== normalizedLabel) pageLed.textContent = normalizedLabel;
    return 0;
  };

  /* Round 801: the footer hardware is static HTML on every primary page.
     Never create, replace, resize, or reorder footer controls at runtime.
     The destination documents supply the five labels/hrefs; only their text
     changes visually from page to page. */
  const balanceHeaderNavigation = () => {
    const nav = document.querySelector("#primary-nav");
    if (!nav) return;
    const pageScreen = document.querySelector("body > .rim-page-name-screen");
    const pageLed = pageScreen?.querySelector(".header-page-led, .footer-page-led");
    if (pageScreen && pageLed) {
      const label = pageLed.dataset.text || pageLed.textContent.trim();
      renderPageSignBulbs(pageLed, label);
      pageScreen.setAttribute("aria-label", `Current page: ${label}`);
    }
  };

  balanceHeaderNavigation();

  /* Round 375: retain native text in every screen that names a clickable route. */
  const repairRouteScreenLabels = () => {
    document.querySelectorAll(
      ".premium-route-card__title-sign > [data-text], #primary-nav .footer-nav-label"
    ).forEach((label) => {
      const expected = label.dataset.text || label.textContent.trim();
      if (expected && !label.textContent.trim()) label.textContent = expected;
      label.hidden = false;
      label.removeAttribute("aria-hidden");
    });
  };
  repairRouteScreenLabels();

  /* Round 453: feature-card handoff. The card physically sinks first, then its
     local leather cover travels at one-third the former speed. Home/outbound
     routes continue into the viewport shield. Learning Center and Who We Help
     stay on-page and smoothly scroll to their model stage without re-covering
     the viewport. */
  const pageTransitionShield = $(".page-transition-shield");
  if (pageTransitionShield) {
    const pageTransitionShieldPanel = pageTransitionShield.querySelector(".page-transition-shield__panel") || pageTransitionShield;
    const root = document.documentElement;
    const storageKey = "ah-page-shield";
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const localButtonSink = reducedMotion ? 1 : 210;
    const localShieldHold = reducedMotion ? 1 : 360;

    /* Round 495: deterministic smooth handoff to the lower 3D-model stage.
       Some browsers were still treating scrollTo({behavior:"smooth"}) on the
       fixed main viewport as an immediate jump. Drive the interpolation here
       so Learning Center and Who We Help visibly glide to the target. */
    let activeModelScrollFrame = 0;
    let activeModelScrollFinish = null;

    /* Round 496: one deterministic scroll owner for Learning Center and
       Who We Help. It explicitly disables native smooth-scroll, anchoring and
       snap behavior while the animation is active so the browser cannot add
       an instantaneous hash jump or a second competing scroll animation. */
    const smoothScrollModelStage = (stage, options = {}) => new Promise((resolve) => {
      const mainViewport = document.querySelector('main#main-content');
      if (!stage || !mainViewport) { resolve(); return; }

      if (activeModelScrollFrame) {
        cancelAnimationFrame(activeModelScrollFrame);
        activeModelScrollFrame = 0;
      }
      if (typeof activeModelScrollFinish === 'function') {
        activeModelScrollFinish();
        activeModelScrollFinish = null;
      }

      const documentSurface = document.scrollingElement || document.documentElement;
      const mainScrollable = (mainViewport.scrollHeight - mainViewport.clientHeight) > 2;
      const surface = mainScrollable ? mainViewport : documentSurface;
      const isDocumentSurface = surface === documentSurface;

      const captureInline = (element, property) => ({
        value: element?.style?.getPropertyValue(property) || '',
        priority: element?.style?.getPropertyPriority(property) || ''
      });
      const priorBehavior = captureInline(surface, 'scroll-behavior');
      const priorAnchor = captureInline(surface, 'overflow-anchor');
      const priorSnap = captureInline(surface, 'scroll-snap-type');

      mainViewport.classList.add('ah-model-scroll-active');
      /* Pause active embedded WebGL/model animation while the viewport itself
         is moving. This leaves the compositor/GPU budget to the scroll and
         prevents heavy 3D frames from making the glide look low-FPS. */
      try { syncEmbeddedAnimationActivity(false); } catch (error) {}
      surface.style.setProperty('scroll-behavior', 'auto', 'important');
      surface.style.setProperty('overflow-anchor', 'none', 'important');
      surface.style.setProperty('scroll-snap-type', 'none', 'important');

      let finished = false;
      const restoreInline = (property, prior) => {
        if (!surface?.style) return;
        if (prior.value) surface.style.setProperty(property, prior.value, prior.priority);
        else surface.style.removeProperty(property);
      };
      const finish = () => {
        if (finished) return;
        finished = true;
        if (activeModelScrollFrame) {
          cancelAnimationFrame(activeModelScrollFrame);
          activeModelScrollFrame = 0;
        }
        restoreInline('scroll-behavior', priorBehavior);
        restoreInline('overflow-anchor', priorAnchor);
        restoreInline('scroll-snap-type', priorSnap);
        mainViewport.classList.remove('ah-model-scroll-active');
        activeModelScrollFinish = null;
        requestAnimationFrame(() => {
          try { syncEmbeddedAnimationActivity(true); } catch (error) {}
        });
        resolve();
      };
      activeModelScrollFinish = finish;

      const readTop = () => isDocumentSurface
        ? Math.max(
            Number(window.scrollY || 0),
            Number(documentSurface.scrollTop || 0),
            Number(document.body?.scrollTop || 0)
          )
        : Number(surface.scrollTop || 0);

      const writeTop = (top) => {
        const value = Math.max(0, Number(top || 0));
        if (isDocumentSurface) {
          window.scrollTo({ top:value, left:0, behavior:'auto' });
        } else if (typeof surface.scrollTo === 'function') {
          surface.scrollTo({ top:value, left:Number(surface.scrollLeft || 0), behavior:'auto' });
        } else {
          surface.scrollTop = value;
        }
      };

      const run = async () => {
        try {
          if (typeof options.beforeMeasure === 'function') {
            await options.beforeMeasure();
          }

          /* Let model activation/layout settle while scroll anchoring is locked,
             then measure the final target. */
          await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)));

          const stageRect = stage.getBoundingClientRect();
          const startTop = readTop();
          const viewportTop = isDocumentSurface
            ? 0
            : surface.getBoundingClientRect().top;
          const maxScroll = Math.max(
            0,
            Number(surface.scrollHeight || document.documentElement.scrollHeight || 0) -
              Number(isDocumentSurface ? window.innerHeight : surface.clientHeight || 0)
          );
          const rawTarget = startTop + stageRect.top - viewportTop;
          const targetTop = Math.min(maxScroll, Math.max(0, rawTarget));
          const distance = targetTop - startTop;

          if (reducedMotion || Math.abs(distance) < 2) {
            writeTop(targetTop);
            finish();
            return;
          }

          const duration = Math.min(
            1600,
            Math.max(1050, 900 + Math.abs(distance) * 0.28)
          );
          const startTime = performance.now();
          const ease = (t) => t < .5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;

          const step = (now) => {
            const progress = Math.min(1, Math.max(0, (now - startTime) / duration));
            writeTop(startTop + distance * ease(progress));
            if (progress < 1) {
              activeModelScrollFrame = requestAnimationFrame(step);
            } else {
              writeTop(targetTop);
              /* One final painted frame at the exact destination prevents a
                 last-frame snap when native scroll behavior is restored. */
              activeModelScrollFrame = requestAnimationFrame(() => {
                activeModelScrollFrame = 0;
                finish();
              });
            }
          };
          activeModelScrollFrame = requestAnimationFrame(step);
        } catch (error) {
          finish();
        }
      };

      run();
    });
    window.__ahSmoothScrollModelStageRound496 = smoothScrollModelStage;
    window.__ahSmoothScrollModelStageRound495 = smoothScrollModelStage;
    window.__ahSmoothScrollModelStageRound479 = smoothScrollModelStage;

    const localRouteSelector = [
      'body.page-home #home-route-buttons .premium-route-card__image-button',
      'body.page-learning #learning-route-buttons .learning-medallion-button',
      'body.page-who-we-help #who-we-help-solutions .premium-route-card__image-button'
    ].join(',');

    /* Round 480: decode the shield artwork up front so a route click never
       has to begin the large transform while the browser is also decoding the
       texture. The preload in each page handles network priority; decode()
       prewarms the raster/compositor path. */
    const shieldArtworkReady = (() => {
      const shieldImage = new Image();
      shieldImage.decoding = 'async';
      shieldImage.src = './assets/page-shield-embossed-strong-round1067.webp';
      if (typeof shieldImage.decode === 'function') {
        return shieldImage.decode().catch(() => undefined);
      }
      return new Promise((resolve) => {
        if (shieldImage.complete) { resolve(); return; }
        shieldImage.addEventListener('load', resolve, { once: true });
        shieldImage.addEventListener('error', resolve, { once: true });
      });
    })();

    let navigationStarted = false;
    let revealStarted = false;
    let shieldState = root.classList.contains("page-shield-arrival") ? "covered" : "open";

    /* Round 916: one transform-only CSS transition owns the full viewport shield.
       JavaScript changes the shield state once, then waits for transitionend. No
       frame-by-frame transform writes, opacity/filter/clip animation, or duplicate
       motion trigger is allowed while the shield is travelling. */
    const pageShieldTravelMs = 2000;
    const pageShieldEase = 'cubic-bezier(.22,.66,.24,1)';
    const pageShieldOpenTransform = 'translate3d(0,-100.5%,0)';
    const pageShieldClosedTransform = 'translate3d(0,0,0)';
    let pageShieldMotionPromise = null;

    /* Round 1094: deterministic compositor-only shield travel.
       Every visible upward and downward motion gets a fresh 2000ms transform
       transition from a known endpoint. We intentionally do not use
       transitionend/cancel as the clock because page-specific style churn,
       BFCache restores, or a dropped transition event could make one page
       finish early while another waited longer. */
    const pageShieldPaintBarrier = () => new Promise((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    });

    const animatePageShield = (nextState) => {
      if (pageShieldMotionPromise) return pageShieldMotionPromise;
      const movingClosed = nextState === 'covering' || nextState === 'covered';
      const fromTransform = movingClosed ? pageShieldOpenTransform : pageShieldClosedTransform;
      const toTransform = movingClosed ? pageShieldClosedTransform : pageShieldOpenTransform;

      root.dataset.pageShieldMotion = '1';
      pageShieldMotionPromise = (async () => {
        try {
          pageTransitionShieldPanel.getAnimations?.().forEach((animation) => animation.cancel());
        } catch (_) {}

        /* Snap to the exact starting endpoint without animation, promote the
           already-sized panel, then start one transform-only transition. */
        pageTransitionShieldPanel.style.setProperty('transition','none','important');
        pageTransitionShieldPanel.style.setProperty('transform',fromTransform,'important');
        pageTransitionShieldPanel.style.setProperty('-webkit-transform',fromTransform,'important');
        pageTransitionShieldPanel.style.setProperty('will-change','transform','important');
        pageTransitionShieldPanel.style.setProperty('backface-visibility','hidden','important');
        pageTransitionShieldPanel.style.setProperty('contain','paint','important');
        setShieldClasses(nextState);

        await pageShieldPaintBarrier();

        pageTransitionShieldPanel.style.setProperty(
          'transition',
          `transform ${pageShieldTravelMs}ms ${pageShieldEase}`,
          'important'
        );
        pageTransitionShieldPanel.style.setProperty('transform',toTransform,'important');
        pageTransitionShieldPanel.style.setProperty('-webkit-transform',toTransform,'important');

        /* The visible travel itself is always exactly two seconds. */
        await new Promise((resolve) => window.setTimeout(resolve,pageShieldTravelMs));

        /* Keep the exact final transform and remove the transition until the
           next requested movement so no unrelated class/style change can
           retrigger or shorten the motion. */
        pageTransitionShieldPanel.style.setProperty('transition','none','important');
        pageTransitionShieldPanel.style.setProperty('transform',toTransform,'important');
        pageTransitionShieldPanel.style.setProperty('-webkit-transform',toTransform,'important');
      })().finally(() => {
        delete root.dataset.pageShieldMotion;
        pageShieldMotionPromise = null;
      });
      return pageShieldMotionPromise;
    };

    const delay = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));
    const nextPaint = () => new Promise((resolve) => {
      window.requestAnimationFrame(() => window.requestAnimationFrame(resolve));
    });

    const waitForLocalShield = (localShield) => new Promise((resolve) => {
      if (!localShield || reducedMotion) {
        resolve();
        return;
      }
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        localShield.removeEventListener('transitionend', onEnd);
        window.clearTimeout(fallbackTimer);
        resolve();
      };
      const onEnd = (event) => {
        if (event.target !== localShield || event.propertyName !== 'transform') return;
        finish();
      };
      localShield.addEventListener('transitionend', onEnd);
      const style = window.getComputedStyle(localShield);
      const duration = String(style.transitionDuration || '0s')
        .split(',')
        .reduce((max, value) => {
          const part = value.trim();
          const ms = part.endsWith('ms') ? parseFloat(part) : parseFloat(part) * 1000;
          return Number.isFinite(ms) ? Math.max(max, ms) : max;
        }, 0);
      const fallbackTimer = window.setTimeout(finish, duration + 180);
    });

    const setShieldClasses = (nextState) => {
      root.classList.remove("page-shield-arrival", "page-shield-covering", "page-shield-revealing");
      if (nextState === "covered") root.classList.add("page-shield-arrival");
      if (nextState === "covering") root.classList.add("page-shield-covering");
      if (nextState === "revealing") root.classList.add("page-shield-revealing");
      root.dataset.pageShieldState = nextState;
      shieldState = nextState;
    };

    const syncEmbeddedAnimationActivity = (active) => {
      document.querySelectorAll('iframe.home-hero-engine-embed, iframe.solutions-engine-model-embed').forEach((frame) => {
        try {
          frame.contentWindow?.postMessage({ type: 'engine-visibility', visible: !!active }, '*');
        } catch (error) {}
      });
      document.querySelectorAll('.learning-lesson-slide > iframe, .shared-model-carousel-stage iframe').forEach((frame) => {
        const slide = frame.closest('.learning-lesson-slide');
        const sharedSlide = frame.closest('[data-shared-slide]');
        const shouldRun = !!active && (
          !!slide?.classList.contains('is-active') ||
          !!sharedSlide?.classList.contains('is-active')
        );
        try {
          frame.contentWindow?.postMessage({ type: 'automated-hearts:learning-activity', active: shouldRun }, '*');
        } catch (error) {}
      });
    };

    const prepareEmbeddedAnimations = () => {
      const frames = Array.from(document.querySelectorAll(
        'iframe.home-hero-engine-embed, iframe.solutions-engine-model-embed, .learning-lesson-slide > iframe, .shared-model-carousel-stage iframe'
      ));
      frames.forEach((frame) => {
        frame.addEventListener('load', () => {
          if (shieldState !== 'open') syncEmbeddedAnimationActivity(false);
        });
      });
      syncEmbeddedAnimationActivity(false);
    };

    const waitForCriticalEngine = async () => {
      const frame = document.querySelector('iframe.home-hero-engine-embed');
      if (!frame) return;
      const rect = frame.getBoundingClientRect();
      if (rect.top >= window.innerHeight || rect.bottom <= 0) return;
      try {
        const ready = frame.contentDocument?.readyState === 'complete';
        if (ready) {
          syncEmbeddedAnimationActivity(false);
          return;
        }
      } catch (error) {}
      await new Promise((resolve) => frame.addEventListener('load', resolve, { once: true }));
      syncEmbeddedAnimationActivity(false);
    };

    const revealShield = async () => {
      if (revealStarted || shieldState === "open" || shieldState === "revealing") return;
      revealStarted = true;
      document.body.setAttribute("aria-busy", "true");
      syncEmbeddedAnimationActivity(false);

      await animatePageShield("revealing");
      setShieldClasses("open");
      root.classList.remove("routed-page-arrival");
      document.body.removeAttribute("aria-busy");
      revealStarted = false;
      syncEmbeddedAnimationActivity(true);
      window.dispatchEvent(new CustomEvent("ah:page-shield-open"));
    };

    const coverShield = async () => {
      if (shieldState === "covered") return;
      if (shieldState === "covering") {
        if (pageShieldMotionPromise) await pageShieldMotionPromise;
        return;
      }
      document.body.setAttribute("aria-busy", "true");
      syncEmbeddedAnimationActivity(false);
      await animatePageShield("covering");
      setShieldClasses("covered");
    };

    /* Round 1037: expose the single compositor-owned shield to the persistent
       navigation shell. The shell can therefore keep the outer hardware alive
       while only the page content beneath it changes. */
    window.__ahPersistentShieldCover = coverShield;
    window.__ahPersistentShieldReveal = revealShield;

    $$(localRouteSelector).forEach((button) => {
      if (button.querySelector(':scope > .route-card-leather-shield')) return;
      const localShield = document.createElement('span');
      localShield.className = 'route-card-leather-shield';
      localShield.setAttribute('aria-hidden', 'true');
      button.append(localShield);
    });

    /* Round 778: only run the covered-arrival readiness gate when navigation
       explicitly set the session handoff flag. Direct/refresh loads remain open
       from first paint, preventing the shield artwork from flashing unexpectedly. */
    const isRoutedArrival = root.classList.contains("page-shield-arrival");

    if (isRoutedArrival) {
      document.body.setAttribute("aria-busy", "true");
      /* Round 1035: shield travel no longer waits on fonts, page images, WebGL
         initialization, or window.load. Those systems can finish independently
         underneath the covered surface. Embedded animation remains paused until
         the shield is fully open. */
      syncEmbeddedAnimationActivity(false);
      const startIndependentReveal = async () => {
        await nextPaint();
        await nextPaint();
        revealShield();
      };
      startIndependentReveal();
    } else {
      root.dataset.pageShieldState = "open";
      document.body.removeAttribute("aria-busy");
      requestAnimationFrame(() => syncEmbeddedAnimationActivity(true));
    }

    document.addEventListener("click", (event) => {
      const target = event.target;
      const link = target && typeof target.closest === "function"
        ? target.closest("a[href]")
        : null;
      if (link?.dataset.routeShieldBypass === 'true') {
        delete link.dataset.routeShieldBypass;
        return;
      }
      if (
        navigationStarted ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) return;
      if (
        !link ||
        link.hasAttribute("download") ||
        link.hasAttribute("data-contact-trigger") ||
        (link.target && link.target.toLowerCase() !== "_self")
      ) return;

      const rawHref = link.getAttribute("href") || "";
      if (!rawHref || /^(?:mailto:|tel:|javascript:)/i.test(rawHref)) return;

      let destination;
      try {
        destination = new URL(link.href, window.location.href);
      } catch (error) {
        return;
      }
      if (destination.origin !== window.location.origin) return;
      const sameDocument =
        destination.pathname === window.location.pathname &&
        destination.search === window.location.search;
      const isLocalFeatureRoute = link.matches(localRouteSelector);
      const pageName = document.body?.dataset?.page || '';
      const isInPageModelRoute =
        sameDocument &&
        isLocalFeatureRoute &&
        (pageName === 'learning' || pageName === 'who-we-help');
      if (sameDocument && !isLocalFeatureRoute) return;

      event.preventDefault();
      if (isLocalFeatureRoute) event.stopImmediatePropagation();
      navigationStarted = true;
      closeNavContactDrawer();

      const routeCard = isLocalFeatureRoute ? link.closest(".premium-route-card") : null;
      const footerButton = !isLocalFeatureRoute
        ? link.closest("#primary-nav a[data-nav]")
        : null;
      if (routeCard) routeCard.classList.add("is-route-pressed");
      if (routeCard && pageName === "who-we-help") {
        document.querySelectorAll("#who-we-help-solutions .premium-route-card").forEach((card) => {
          card.classList.remove("is-who-help-active");
          card.querySelector(".premium-route-card__image-button")?.setAttribute("aria-pressed", "false");
        });
        routeCard.classList.add("is-who-help-active");
        link.setAttribute("aria-pressed", "true");
      }
      if (footerButton) footerButton.classList.add("is-nav-pressed");

      const resetLocalRoute = async () => {
        routeCard?.classList.remove('is-route-shielding');
        await delay(reducedMotion ? 1 : 260);
        routeCard?.classList.remove('is-route-pressed');
        navigationStarted = false;
        document.body.removeAttribute('aria-busy');
      };

      const performInPageModelAction = async () => {
        const stage = destination.hash ? document.querySelector(destination.hash) : null;
        const prepareTarget = async () => {
          if (
            pageName === 'learning' &&
            typeof window.__ahActivateLearningLessonRound436 === 'function'
          ) {
            window.__ahActivateLearningLessonRound436(link.dataset.learningModel, { scroll: false });
          }
        };

        if (stage) {
          await smoothScrollModelStage(stage, { beforeMeasure: prepareTarget });
          try {
            if (destination.hash && window.location.hash !== destination.hash) {
              history.replaceState(history.state, '', destination.hash);
            }
          } catch (error) {}
        } else {
          await prepareTarget();
        }
        await delay(reducedMotion ? 1 : 90);
        await resetLocalRoute();
      };

      const performDestinationAction = () => {
        /* Round 1037: normal internal navigation is handled inside the current
           document so the rim, heart, Messages control, ticker and footer DOM
           are never destroyed/recreated. Embedded content asks the parent shell
           to navigate instead of navigating its own iframe. */
        if (typeof window.__ahPersistentNavigate === 'function') {
          try {
            if (window.__ahPersistentNavigate(destination.href) !== false) return true;
          } catch (error) {}
        }
        try {
          window.sessionStorage.setItem(storageKey, "1");
        } catch (error) {
          /* Round 919 also carries the handoff in the URL, so local file://
             navigation remains covered when sessionStorage is unavailable. */
        }
        let routedHref = destination.href;
        try {
          const routedUrl = new URL(destination.href);
          routedUrl.searchParams.set("ah-route", "1");
          routedHref = routedUrl.href;
        } catch (error) {}
        window.location.assign(routedHref);
        return true;
      };

      const runNavigation = async () => {
        if (routeCard && isInPageModelRoute) {
          /* In-page model routes never use the leather cover or a hash jump.
             A short physical button sink is followed immediately by the one
             controlled scroll animation. */
          await delay(reducedMotion ? 1 : 120);
          await performInPageModelAction();
          return;
        }

        /* Embedded pages never animate a second hidden shield. Their parent
           document owns the one visible shield and persistent hardware. */
        if (window.self !== window.top && typeof window.__ahPersistentNavigate === 'function') {
          performDestinationAction();
          navigationStarted = false;
          document.body.removeAttribute('aria-busy');
          return;
        }

        if (routeCard) {
          await delay(localButtonSink);
          routeCard.classList.add('is-route-shielding');
          const localShield = routeCard.querySelector(':scope .route-card-leather-shield');
          await waitForLocalShield(localShield);
          await delay(localShieldHold);
        }

        /* Persistent routing starts the destination request and the shield at
           the same time. The router owns the independent reveal schedule. */
        if (typeof window.__ahPersistentNavigate === 'function') {
          performDestinationAction();
          return;
        }

        /* The artwork is decoded opportunistically above, but navigation never
           waits for that decode or any other resource before moving the shield. */
        await coverShield();

        /* Present two fully covered compositor frames before committing the
           document navigation. This prevents the browser from replacing the
           outgoing surface on the same frame that the shield finishes moving. */
        await nextPaint();
        await nextPaint();

        /* Navigation is committed only after the shield is visibly closed. */
        performDestinationAction();
      };

      runNavigation().catch(() => {
        navigationStarted = false;
        document.body.removeAttribute('aria-busy');
        syncEmbeddedAnimationActivity(true);
      });
    }, true);

    window.addEventListener('ah:persistent-route-complete', () => {
      navigationStarted = false;
      document.body.removeAttribute('aria-busy');
    });

    window.addEventListener("pageshow", async (event) => {
      if (!event.persisted) return;
      navigationStarted = false;
      revealStarted = false;
      $$(".is-route-pressed, .is-route-shielding, .is-nav-pressed").forEach((item) => {
        item.classList.remove("is-route-pressed", "is-route-shielding", "is-nav-pressed");
      });
      document.body.setAttribute("aria-busy", "true");
      root.dataset.pageShieldSnap = '1';
      setShieldClasses("covered");
      await nextPaint();
      delete root.dataset.pageShieldSnap;
      revealShield();
    });
  }

  /* Round 425: the page-name sign itself is the scroll indicator. Its color
     fills from left to right while a clipped duplicate label reverses to the
     opposite brand color wherever the fill has reached. */
  const scrollViewport = document.querySelector("main#main-content");
  const pageProgressSign = document.querySelector(
    "body > .rim-page-name-screen.footer-page-screen.header-page-screen--top"
  );
  const pageProgressLabel = pageProgressSign?.querySelector(
    ":scope > .footer-page-led, :scope > .header-page-led"
  ) || null;
  let pageProgressInverseLabel = pageProgressSign?.querySelector(
    ":scope > .page-sign-progress-inverse"
  ) || null;
  if (pageProgressSign && pageProgressLabel && !pageProgressInverseLabel) {
    pageProgressSign.dataset.progressTone = pageProgressLabel.classList.contains(
      "screen-text-canonical--green"
    ) ? "green" : "pink";
    pageProgressInverseLabel = document.createElement("span");
    pageProgressInverseLabel.className = "page-sign-progress-inverse";
    pageProgressInverseLabel.setAttribute("aria-hidden", "true");

    /* Round 916: keep the progress-fill layer, but do not add the former
       “Automated Hearts” words to the top progress field. */
    pageProgressSign.append(pageProgressInverseLabel);
  }
  const documentScrollViewport =
    document.scrollingElement || document.documentElement;

  const getScrollProgress = (surface, isDocumentSurface = false) => {
    if (!surface) return 0;
    const maximumScroll = Math.max(
      0,
      Number(surface.scrollHeight || 0) - Number(surface.clientHeight || 0)
    );
    if (maximumScroll <= 0) return 0;
    const scrollTop = isDocumentSurface
      ? Math.max(
          Number(window.scrollY || 0),
          Number(surface.scrollTop || 0),
          Number(document.body?.scrollTop || 0)
        )
      : Number(surface.scrollTop || 0);
    return Math.min(1, Math.max(0, scrollTop / maximumScroll));
  };

  let pageProgressFrame = 0;
  const updatePageProgress = () => {
    window.cancelAnimationFrame(pageProgressFrame);
    pageProgressFrame = window.requestAnimationFrame(() => {
      if (!pageProgressSign) return;
      const progress = Math.max(
        getScrollProgress(scrollViewport),
        getScrollProgress(documentScrollViewport, true)
      );
      const normalized = progress.toFixed(4);
      pageProgressSign.style.setProperty("--page-sign-scroll-progress", normalized);
      pageProgressSign.style.setProperty(
        "--page-sign-scroll-percent",
        `${(progress * 100).toFixed(2)}%`
      );
      pageProgressSign.dataset.scrollProgress = normalized;
      pageProgressSign.setAttribute("data-scroll-percent", String(Math.round(progress * 100)));
    });
  };

  updatePageProgress();
  scrollViewport?.addEventListener("scroll", updatePageProgress, { passive: true });
  window.addEventListener("scroll", updatePageProgress, { passive: true });
  document.addEventListener("scroll", updatePageProgress, {
    passive: true,
    capture: true,
  });
  window.addEventListener("resize", updatePageProgress, { passive: true });
  window.addEventListener("load", updatePageProgress, { once: true });
  window.addEventListener("pageshow", updatePageProgress, { passive: true });

  /* Round 443: fast, frame-rate-independent wheel smoothing for the site's
     internal viewport. Native touch and keyboard scrolling remain untouched. */
  if (scrollViewport && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let smoothTarget = scrollViewport.scrollTop;
    let smoothScrollFrame = 0;
    let lastSmoothFrameTime = 0;
    const priorInlineScrollBehavior = scrollViewport.style.getPropertyValue('scroll-behavior');
    const priorInlineScrollPriority = scrollViewport.style.getPropertyPriority('scroll-behavior');

    const restoreScrollBehavior = () => {
      if (priorInlineScrollBehavior) {
        scrollViewport.style.setProperty(
          'scroll-behavior',
          priorInlineScrollBehavior,
          priorInlineScrollPriority
        );
      } else {
        scrollViewport.style.removeProperty('scroll-behavior');
      }
    };

    const advanceSmoothScroll = (time) => {
      const current = scrollViewport.scrollTop;
      const remaining = smoothTarget - current;
      if (Math.abs(remaining) < .4) {
        scrollViewport.scrollTop = smoothTarget;
        smoothScrollFrame = 0;
        lastSmoothFrameTime = 0;
        restoreScrollBehavior();
        return;
      }

      const elapsed = lastSmoothFrameTime
        ? Math.min(34, Math.max(1, time - lastSmoothFrameTime))
        : 1000 / 60;
      lastSmoothFrameTime = time;
      // Frame-rate-independent exponential interpolation avoids the abrupt
      // catch-up that can make wheel and trackpad scrolling look jumpy.
      const blend = 1 - Math.exp(-elapsed / 92);
      scrollViewport.scrollTop = current + remaining * blend;
      smoothScrollFrame = window.requestAnimationFrame(advanceSmoothScroll);
    };

    scrollViewport.addEventListener('wheel', (event) => {
      if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      if (event.target.closest('input,select,textarea,[contenteditable="true"]')) return;
      const unit = event.deltaMode === 1
        ? 18
        : event.deltaMode === 2
          ? scrollViewport.clientHeight
          : 1;
      const maximum = Math.max(0, scrollViewport.scrollHeight - scrollViewport.clientHeight);
      const current = scrollViewport.scrollTop;
      const maxLead = Math.max(240, scrollViewport.clientHeight * 1.2);
      const requested = smoothTarget + event.deltaY * unit;
      smoothTarget = Math.max(
        0,
        Math.min(maximum, Math.max(current - maxLead, Math.min(current + maxLead, requested)))
      );
      event.preventDefault();
      scrollViewport.style.setProperty('scroll-behavior', 'auto', 'important');
      if (!smoothScrollFrame) {
        lastSmoothFrameTime = 0;
        smoothScrollFrame = window.requestAnimationFrame(advanceSmoothScroll);
      }
    }, { passive: false });

    scrollViewport.addEventListener('scroll', () => {
      if (!smoothScrollFrame) smoothTarget = scrollViewport.scrollTop;
    }, { passive: true });
  }

  // The retired top/mobile navigation toggle was removed; footer navigation remains active.

  const contactTriggers = $$('[data-contact-trigger]');

  if (contactTriggers.length) {
    const drawer = document.createElement("div");
    drawer.className = "nav-contact-drawer";
    drawer.innerHTML = `
      <div class="nav-contact-drawer__inner">
        <div
          class="nav-contact-panel casio-contact-panel"
          id="nav-contact-panel"
          aria-hidden="true"
          inert
        >
          <button class="nav-contact-close" type="button" aria-label="Close contact form">×</button>
          <form
            action="#"
            class="quick-contact-form nav-contact-form nav-contact-form--full"
            data-placeholder-contact-form
            method="post"
          >
            <label class="nav-contact-field">
              <span class="sr-only">Name</span>
              <input autocomplete="name" name="name" placeholder="Name" required type="text">
            </label>
            <label class="nav-contact-field">
              <span class="sr-only">Email</span>
              <input autocomplete="email" name="email" placeholder="Email" required type="email">
            </label>
            <label class="nav-contact-field">
              <span class="sr-only">Business or organization</span>
              <input autocomplete="organization" name="business" placeholder="Business or organization" type="text">
            </label>
            <label class="nav-contact-field">
              <span class="sr-only">Business type</span>
              <select aria-label="Business type" name="business_type">
                <option value="">Business type</option>
                <option>Professional services</option>
                <option>Construction or trades</option>
                <option>Local business operations</option>
                <option>Entrepreneur or small team</option>
                <option>Nonprofit or community organization</option>
                <option>Other</option>
              </select>
            </label>
            <label class="nav-contact-field nav-contact-field--full">
              <span class="sr-only">What feels harder than it should?</span>
              <textarea name="message" placeholder="What feels harder than it should?" required rows="4"></textarea>
            </label>
            <button class="button button--small send-question-button nav-contact-submit" type="submit">
              <span>Send Message</span>
            </button>
            <p aria-live="polite" class="quick-contact-form__status nav-contact-form-status"></p>
          </form>
        </div>
      </div>
    `;
    document.body.appendChild(drawer);

    const drawerPanel = $(".nav-contact-panel", drawer);
    const closeDrawerButton = $(".nav-contact-close", drawer);
    contactTriggers.forEach((trigger) => {
      trigger.classList.add("nav-contact-trigger");
      trigger.setAttribute("aria-controls", "nav-contact-panel");
      trigger.setAttribute("aria-expanded", "false");
      trigger.setAttribute("role", "button");
    });

    let drawerCloseTimer = 0;
    let contactResetTimer = 0;
    let activeDrawerOrigin = "header";

    const setDrawerOpen = (isOpen, origin = activeDrawerOrigin, trigger = null) => {
      window.clearTimeout(drawerCloseTimer);
      window.clearTimeout(contactResetTimer);
      const previouslyActiveTrigger = contactTriggers.find(
        (item) => item.getAttribute("aria-expanded") === "true"
      ) || null;
      contactTriggers.forEach((item) => {
        item.setAttribute("aria-expanded", "false");
        item.classList.remove("is-contact-latched");
        if (isOpen || item !== previouslyActiveTrigger) {
          item.classList.remove("is-contact-resetting");
        }
      });

      if (isOpen) {
        activeDrawerOrigin = origin === "footer" ? "footer" : "header";
        drawer.classList.remove("is-closing");
        drawer.classList.toggle("is-footer-origin", activeDrawerOrigin === "footer");
        drawer.classList.toggle("is-header-origin", activeDrawerOrigin !== "footer");
        drawer.classList.add("is-open");
        if (trigger) {
          trigger.classList.remove("is-contact-resetting");
          trigger.classList.add("is-contact-latched");
          trigger.setAttribute("aria-expanded", "true");
        }
        drawerPanel.setAttribute("aria-hidden", "false");
        drawerPanel.removeAttribute("inert");

        requestAnimationFrame(() => {
          const firstField = $("input", drawerPanel);
          if (firstField && window.matchMedia("(pointer: fine)").matches) {
            firstField.focus({ preventScroll: true });
          }
        });
        return;
      }

      if (previouslyActiveTrigger) {
        previouslyActiveTrigger.classList.remove("is-contact-resetting");
        void previouslyActiveTrigger.offsetWidth;
        previouslyActiveTrigger.classList.add("is-contact-resetting");
        contactResetTimer = window.setTimeout(() => {
          previouslyActiveTrigger.classList.remove("is-contact-resetting");
        }, 260);
      }

      // Keep the active corner origin during the exit transition. Removing the
      // origin classes immediately briefly repositions the still-visible panel
      // at its default top-left coordinates.
      drawer.classList.remove("is-open");
      drawer.classList.add("is-closing");
      drawerPanel.setAttribute("aria-hidden", "true");
      drawerPanel.setAttribute("inert", "");
      drawerCloseTimer = window.setTimeout(() => {
        drawer.classList.remove("is-closing", "is-footer-origin", "is-header-origin");
      }, 340);
    };

    closeNavContactDrawer = () => setDrawerOpen(false);

    contactTriggers.forEach((trigger) => {
      trigger.addEventListener("click", (event) => {
        event.preventDefault();
        const triggerIsActive = trigger.getAttribute("aria-expanded") === "true";
        if (drawer.classList.contains("is-open") && triggerIsActive) {
          closeNavContactDrawer();
          return;
        }
        setDrawerOpen(true, trigger.dataset.contactOrigin || "header", trigger);
      });

      trigger.addEventListener("keydown", (event) => {
        if (event.key === " ") {
          event.preventDefault();
          trigger.click();
        }
      });
    });

    if (closeDrawerButton) {
      closeDrawerButton.addEventListener("click", closeNavContactDrawer);
    }

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeNavContactDrawer();
    });

    document.addEventListener("click", (event) => {
      const clickedTrigger = contactTriggers.some((trigger) => trigger.contains(event.target));
      if (
        drawer.classList.contains("is-open") &&
        !drawer.contains(event.target) &&
        !clickedTrigger
      ) {
        closeNavContactDrawer();
      }
    });
  }

  const homeTransitionTrack = document.querySelector("[data-home-transition-track]");
  if (homeTransitionTrack && !homeTransitionTrack.dataset.initialized) {
    homeTransitionTrack.dataset.initialized = "true";

    const carousel = homeTransitionTrack.closest(".home-transition-carousel");
    const originalSlides = Array.from(homeTransitionTrack.children);
    originalSlides.forEach((slide) => {
      const clone = slide.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      homeTransitionTrack.appendChild(clone);
    });

    const controls = carousel
      ? Array.from(carousel.querySelectorAll("[data-carousel-direction]"))
      : [];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const automaticSpeed = reducedMotion ? -72 : -162;
    const directionalSpeed = reducedMotion ? 130 : 370;
    let position = 0;
    let currentSpeed = automaticSpeed;
    let targetSpeed = automaticSpeed;
    let loopWidth = 1;
    let previousTime = performance.now();
    let activePointer = null;
    let selectedControl = null;
    let selectedDirection = null;

    const readGap = () => {
      const styles = window.getComputedStyle(homeTransitionTrack);
      return Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
    };

    const measureCarousel = () => {
      const slides = Array.from(homeTransitionTrack.children).slice(0, originalSlides.length);
      const gap = readGap();
      loopWidth = Math.max(
        1,
        slides.reduce((total, slide) => total + slide.getBoundingClientRect().width, 0) +
          gap * originalSlides.length
      );
      while (position <= -loopWidth) position += loopWidth;
      while (position > 0) position -= loopWidth;
    };

    const normalizePosition = (value) => {
      let normalized = value;
      while (normalized <= -loopWidth) normalized += loopWidth;
      while (normalized > 0) normalized -= loopWidth;
      return normalized;
    };

    const beginDirectionalScroll = (button, direction) => {
      if (selectedControl && selectedControl !== button) {
        selectedControl.classList.remove("is-active");
      }
      selectedControl = button;
      selectedDirection = direction;
      button.classList.add("is-active");
      targetSpeed = direction * directionalSpeed;
    };

    controls.forEach((button) => {
      const direction = button.dataset.carouselDirection === "left" ? 1 : -1;

      button.addEventListener("pointerdown", (event) => {
        if (event.button !== 0 && event.pointerType === "mouse") return;
        event.preventDefault();
        activePointer = { button, direction, pointerId: event.pointerId };
        button.setPointerCapture?.(event.pointerId);
        beginDirectionalScroll(button, direction);
      });

      const releasePointer = (event) => {
        if (!activePointer || activePointer.button !== button) return;
        if (event?.pointerId != null && button.hasPointerCapture?.(event.pointerId)) {
          button.releasePointerCapture(event.pointerId);
        }
        activePointer = null;
      };

      button.addEventListener("pointerup", releasePointer);
      button.addEventListener("pointercancel", releasePointer);
      button.addEventListener("lostpointercapture", () => {
        if (activePointer?.button === button) activePointer = null;
      });

      button.addEventListener("keydown", (event) => {
        if (event.key !== " " && event.key !== "Enter") return;
        if (event.repeat) return;
        event.preventDefault();
        beginDirectionalScroll(button, direction);
      });

      button.addEventListener("keyup", (event) => {
        if (event.key !== " " && event.key !== "Enter") return;
        event.preventDefault();
      });

      button.addEventListener("click", (event) => {
        // Deliberately no image-to-image jump. A click selects a continuous
        // direction and that motion persists until the opposite orb is chosen.
        event.preventDefault();
        if (event.detail === 0) beginDirectionalScroll(button, direction);
      });
    });

    const animateCarousel = (time) => {
      const elapsedSeconds = Math.min(0.05, Math.max(0, (time - previousTime) / 1000));
      previousTime = time;
      const acceleration = 1 - Math.exp(-elapsedSeconds * 8.2);
      currentSpeed += (targetSpeed - currentSpeed) * acceleration;
      position = normalizePosition(position + currentSpeed * elapsedSeconds);
      homeTransitionTrack.style.transform = `translate3d(${position}px, 0, 0)`;
      requestAnimationFrame(animateCarousel);
    };

    measureCarousel();
    if ("ResizeObserver" in window && carousel) {
      new ResizeObserver(measureCarousel).observe(carousel);
    } else {
      window.addEventListener("resize", measureCarousel, { passive: true });
    }
    document.addEventListener("visibilitychange", () => {
      previousTime = performance.now();
      if (document.hidden) {
        activePointer = null;
        currentSpeed = selectedDirection == null
          ? automaticSpeed
          : selectedDirection * directionalSpeed;
        targetSpeed = currentSpeed;
      }
    });
    requestAnimationFrame(animateCarousel);
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const revealItems = $$(".reveal");

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries, activeObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            activeObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -30px 0px"
      }
    );

    revealItems.forEach((item) => observer.observe(item));
  }


  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;

    const href = link.getAttribute("href");
    if (!href || href === "#") return;
    const target = $(href);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start"
    });
    history.replaceState(null, "", href);
  });



  const exploreLockButton = document.querySelector("[data-explore-lock]");
  if (exploreLockButton) {
    exploreLockButton.addEventListener("click", (event) => {
      if (event.defaultPrevented) return;
      const destination = exploreLockButton.getAttribute("href");
      if (!destination) return;
      event.preventDefault();
      exploreLockButton.setAttribute("aria-pressed", "true");
      exploreLockButton.classList.add("is-locked");
      window.setTimeout(() => { window.location.href = destination; }, prefersReducedMotion ? 0 : 220);
    });
  }

  if (window.location.hash) {
    const hashTarget = document.querySelector(window.location.hash);
    if (hashTarget) {
      window.setTimeout(() => {
        hashTarget.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start"
        });
      }, 120);
    }
  }

  document.addEventListener("submit", (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    if (!form.matches("[data-placeholder-contact-form]")) return;

    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formStatus = $(".quick-contact-form__status", form);
    if (formStatus) {
      formStatus.textContent =
        "Your information is ready. Secure form delivery will be connected when the permanent site is hosted.";
    }
  });



})();

(() => {
  const engineFrame = document.querySelector('.home-hero-engine-embed');
  if (engineFrame && 'IntersectionObserver' in window) {
    const notify = (visible) => engineFrame.contentWindow?.postMessage({ type: 'engine-visibility', visible }, location.origin === 'null' ? '*' : location.origin);
    new IntersectionObserver(([entry]) => notify(entry.isIntersecting), { rootMargin: '160px 0px' }).observe(engineFrame);
  }



})();


/* Round 314 heart-home highlight pulse */
document.addEventListener("DOMContentLoaded", () => {
  const heartHomeLink = document.querySelector(".rim-heart-home-link");
  if (!heartHomeLink) return;
  const pulseHeart = () => {
    heartHomeLink.classList.remove("is-heart-pulsing");
    void heartHomeLink.offsetWidth;
    heartHomeLink.classList.add("is-heart-pulsing");
    window.setTimeout(() => heartHomeLink.classList.remove("is-heart-pulsing"), 820);
  };
  heartHomeLink.addEventListener("pointerdown", pulseHeart, { passive: true });
  heartHomeLink.addEventListener("click", pulseHeart);
});


/* Round 372: authoritative digital-screen text normalization */
document.addEventListener("DOMContentLoaded", () => {
  const canonicalSelector = ".screen-text-canonical:not(.home-title-text-standard)";
  const normalize = (element) => {
    /* Round 530: the Who We Help route labels deliberately contain one span
       per character. Flattening those children erases the lamp-by-lamp aging
       pattern, so they are excluded from every legacy text normalizer. */
    if (element.classList.contains('r530-who-bulb-field') ||
        (element.classList.contains('brand-route-screen__label') &&
         (element.closest('#who-we-help-solutions') || element.closest('#learning-route-buttons')))) return;
    if (element.classList.contains('charity-marquee') || element.closest('.footer-page-screen')) return;
    const source = (element.dataset.text || element.getAttribute('aria-label') || element.textContent || '')
      .replace(/\s+/g, ' ')
      .trim();
    if (!source) return;
    const matteFilm = element.querySelector(':scope > .r488-extra-matte-film');
    const hasNonFilmChildren = [...element.children].some((child) => !child.classList.contains('r488-extra-matte-film'));
    if (element.textContent.replace(/\s+/g, ' ').trim() !== source || hasNonFilmChildren) {
      element.textContent = source;
      if (matteFilm) element.append(matteFilm);
    }
    if (!element.dataset.text) element.dataset.text = source;
  };

  document.querySelectorAll(canonicalSelector).forEach(normalize);
});


/* Round 485: deterministic multi-message charity marquee. Every loop is rebuilt
   from the same tone map so a repeated phrase can never swap colors between cycles. */
document.addEventListener("DOMContentLoaded", () => {
  const marquee = document.querySelector(".charity-marquee");
  if (!marquee) return;
  const messages = [
    [
      { text: "10%", tone: "green" },
      { text: "Back to Local Charities", tone: "pink" }
    ],
    [
      { text: "Prioritizing", tone: "pink" },
      { text: "Job-Retention", tone: "green" }
    ],
    [
      { text: "Automation with a", tone: "green" },
      { text: "human touch.", tone: "pink" }
    ],
    [
      { text: "10%", tone: "green" },
      { text: "Back to Local Charities", tone: "pink" }
    ],
    [
      { text: "Elevating the human,", tone: "green" },
      { text: "not obsoleting them.", tone: "pink", joined: true }
    ]
  ];

  const makeMessage = (parts) => {
    const copy = document.createElement("span");
    copy.className = "charity-marquee__copy";
    parts.forEach((part, index) => {
      const segment = document.createElement("span");
      segment.className = `charity-marquee__segment charity-marquee__segment--${part.tone}`;
      segment.textContent = part.text;
      if (index && !part.joined) segment.classList.add("charity-marquee__segment--spaced");
      copy.append(segment);
    });
    return copy;
  };

  const makeSeparator = () => {
    const separator = document.createElement("span");
    separator.className = "charity-marquee__separator";
    separator.setAttribute("aria-hidden", "true");

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add("charity-marquee__person");
    svg.setAttribute("viewBox", "0 0 18 30");
    svg.setAttribute("focusable", "false");
    svg.setAttribute("aria-hidden", "true");

    const head = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    head.setAttribute("cx", "9");
    head.setAttribute("cy", "5");
    head.setAttribute("r", "3.2");

    const body = document.createElementNS("http://www.w3.org/2000/svg", "path");
    body.setAttribute("d", "M9 8.5V18 M9 11.5L3.3 15.3 M9 11.5L14.7 15.3 M9 18L4.7 27 M9 18L13.3 27");

    svg.append(head, body);
    separator.append(svg);
    return separator;
  };

  const makeLoop = () => {
    const loop = document.createElement("span");
    loop.className = "charity-marquee__loop";
    messages.forEach((parts) => {
      loop.append(makeMessage(parts), makeSeparator());
    });
    return loop;
  };

  let track = marquee.querySelector(".charity-marquee__track");
  if (!track) {
    track = document.createElement("span");
    track.className = "charity-marquee__track";
    marquee.replaceChildren(track);
  }
  track.setAttribute("aria-hidden", "true");
  /* Eight identical loops keep several complete cycles beyond either viewport
     edge, including ultrawide screens and font-loading width changes. */
  track.replaceChildren(...Array.from({ length: 8 }, makeLoop));

  /* Round 601: the ticker motion is compositor-driven by CSS again.
     Keeping JavaScript limited to deterministic content construction avoids
     inline transform writes that can be suppressed or conflict with the
     existing high-specificity ticker cascade. */
  track.style.removeProperty("transform");
  track.style.setProperty("animation", "r966-ticker-compositor 160s linear infinite", "important");
  track.style.setProperty("animation-timing-function", "linear", "important");
  track.style.setProperty("will-change", "transform", "important");
  track.style.setProperty("backface-visibility", "hidden", "important");
  track.style.setProperty("-webkit-backface-visibility", "hidden", "important");
  track.style.setProperty("transform-origin", "0 50%", "important");
});


/* Round 447: keep one complete text node per field. Homepage title fields use
   a cleaner 24pt bulb face; other fields retain the established fit tiers. */
(() => {
  const DIGITAL_SELECTOR = [
    '.screen-text-canonical:not(.home-title-text-standard):not(.charity-marquee)',
    '.charity-marquee__segment',
    '.negative-software-screen-round344 h3',
    '.negative-software-screen-round344 li',
    '#site-footer .footer-nav-label'
  ].join(',');

  const normalizeText = (value) => String(value || '').replace(/\s+/g, ' ').trim();

  const toneFor = (element) => {
    if (
      element.classList.contains('screen-text-canonical--pink') ||
      element.classList.contains('charity-marquee__segment--pink') ||
      element.classList.contains('footer-nav-label') ||
      element.closest('.negative-software-screen-round344')
    ) return {
      face: '#FF2EA8',
      middle: 'rgba(255,46,168,.88)',
      halo: 'rgba(255,46,168,.44)'
    };
    return {
      face: '#8FFFD7',
      middle: 'rgba(143,255,215,.88)',
      halo: 'rgba(143,255,215,.42)'
    };
  };

  const hashText = (value) => {
    let hash = 2166136261;
    Array.from(value).forEach((character) => {
      hash ^= character.charCodeAt(0);
      hash = Math.imul(hash, 16777619);
    });
    return hash >>> 0;
  };

  const seededFraction = (seed, index) => {
    let value = (seed + Math.imul(index + 1, 0x9e3779b9)) >>> 0;
    value = Math.imul(value ^ (value >>> 16), 0x21f0aaad);
    value = Math.imul(value ^ (value >>> 15), 0x735a2d97);
    return ((value ^ (value >>> 15)) >>> 0) / 4294967295;
  };

  const agingPatternFor = (source, fieldIndex, textBox = null, isHomeHeaderTitle = false) => {
    const visibleLength = source.replace(/\s/g, '').length;
    const count = isHomeHeaderTitle
      ? (visibleLength <= 18 ? 3 : 4)
      : (visibleLength <= 8 ? 1 : visibleLength <= 24 ? 2 : 3);
    const anchors = count === 1
      ? [52]
      : count === 2
        ? [29, 72]
        : count === 3
          ? [19, 51, 82]
          : [14, 39, 64, 87];
    const seed = hashText(`${document.body?.dataset?.page || 'page'}|${source}|${fieldIndex}`);
    const clusters = anchors.map((anchor, index) => {
      const rawX = anchor + (seededFraction(seed, index * 5) * 7 - 3.5);
      const rawY = 24 + seededFraction(seed, index * 5 + 1) * 52;
      const rawRadiusX = isHomeHeaderTitle
        ? .8 + seededFraction(seed, index * 5 + 2) * .9
        : 1.7 + seededFraction(seed, index * 5 + 2) * 1.8;
      const rawRadiusY = isHomeHeaderTitle
        ? 9 + seededFraction(seed, index * 5 + 3) * 8
        : 12 + seededFraction(seed, index * 5 + 3) * 12;
      const opacity = isHomeHeaderTitle
        ? .10 + seededFraction(seed, index * 5 + 4) * .12
        : .22 + seededFraction(seed, index * 5 + 4) * .16;

      if (!textBox) {
        return { x: rawX, y: rawY, radiusX: rawRadiusX, radiusY: rawRadiusY, opacity };
      }

      return {
        x: textBox.left + (rawX / 100) * textBox.width,
        y: textBox.top + (rawY / 100) * textBox.height,
        radiusX: Math.max(.5, (rawRadiusX / 100) * textBox.width),
        radiusY: Math.max(2.8, (rawRadiusY / 100) * textBox.height),
        opacity
      };
    });

    const gradients = clusters.map((cluster) => {
      const edgeOpacity = (cluster.opacity * .36).toFixed(3);
      return `radial-gradient(ellipse ${cluster.radiusX.toFixed(2)}% ${cluster.radiusY.toFixed(2)}% at ${cluster.x.toFixed(2)}% ${cluster.y.toFixed(2)}%, rgba(3,4,5,${cluster.opacity.toFixed(3)}) 0 26%, rgba(3,4,5,${edgeOpacity}) 48%, transparent 80%)`;
    });

    return {
      gradients,
      marker: clusters.map((cluster) => `${Math.round(cluster.x)}:${Math.round(cluster.y)}`).join('|')
    };
  };

  const applyAgingPattern = (element, source, fieldIndex, textBox = null) => {
    const isHomeHeaderTitle = element.classList.contains('home-title-text-standard') &&
      Boolean(element.closest('.home-header-screen'));
    const agingPattern = agingPatternFor(source, fieldIndex, textBox, isHomeHeaderTitle);
    const layerCount = agingPattern.gradients.length;
    const bulbGradient = isHomeHeaderTitle
      ? 'radial-gradient(circle at 1.28px 1.24px, #ffffff 0 .28px, var(--round418-bulb-face) .34px .86px, var(--round418-bulb-middle) .92px 1.10px, transparent 1.24px)'
      : 'radial-gradient(circle at 1.10px 1.10px, #f4fffb 0 .22px, var(--round418-bulb-face) .28px .84px, var(--round418-bulb-middle) .90px 1.14px, transparent 1.30px)';
    const bulbGrid = isHomeHeaderTitle ? '3.75px 3.75px' : '3.25px 3.25px';
    element.dataset.round418AgingPattern = agingPattern.marker;
    element.style.setProperty(
      'background-image',
      `${agingPattern.gradients.join(',')}, ${bulbGradient}`,
      'important'
    );
    element.style.setProperty('background-size', `${Array(layerCount).fill('auto').join(',')}, ${bulbGrid}`, 'important');
    element.style.setProperty('background-position', `${Array(layerCount).fill('0 0').join(',')}, 0 0`, 'important');
    element.style.setProperty('background-repeat', `${Array(layerCount).fill('no-repeat').join(',')}, repeat`, 'important');
    element.style.setProperty('background-blend-mode', `${Array(layerCount).fill('multiply').join(',')}, normal`, 'important');
  };

  const restoreCompleteDigitalText = () => {
    document.querySelectorAll(DIGITAL_SELECTOR).forEach((element, fieldIndex) => {
      if (element.classList.contains('r530-who-bulb-field') ||
          (element.classList.contains('brand-route-screen__label') &&
           (element.closest('#who-we-help-solutions') || element.closest('#learning-route-buttons')))) return;
      if (element.closest('#home-solution-framework')) return;
      const source = normalizeText(
        element.dataset.text ||
        element.getAttribute('aria-label') ||
        element.textContent
      );
      if (!source) return;

      /* Round 806: footer labels on every primary page have one fixed first-paint
         geometry in CSS. Never rewrite their font metrics or DOM here; page-specific
         inline !important writes caused inconsistent label sizes between pages. */
      const isStableFooterLabel = element.classList.contains('footer-nav-label');
      const isStableHomeHeaderTitle = element.classList.contains('home-title-text-standard') &&
        Boolean(element.closest('.home-header-screen'));
      if (isStableFooterLabel) {
        element.hidden = false;
        element.dataset.round418Size = 'footer';
        element.style.setProperty('font-family', '"Orbitron", system-ui, sans-serif', 'important');
        element.style.setProperty('font-size', window.matchMedia('(max-width:1100px)').matches ? '10.5pt' : '12.5pt', 'important');
        element.style.setProperty('font-weight', '700', 'important');
        element.style.setProperty('font-style', 'normal', 'important');
        element.style.setProperty('line-height', '1', 'important');
        element.style.setProperty('letter-spacing', '0', 'important');
        element.style.setProperty('word-spacing', '0', 'important');
        element.style.setProperty('opacity', '1', 'important');
        element.style.setProperty('visibility', 'visible', 'important');
        element.style.setProperty('transform', 'none', 'important');
        return;
      }
      if (isStableHomeHeaderTitle) return;

      const matteFilm = element.querySelector(':scope > .r488-extra-matte-film');
      const hasNonFilmChildren = [...element.children].some((child) => !child.classList.contains('r488-extra-matte-film'));
      if (normalizeText(element.textContent) !== source || hasNonFilmChildren) {
        element.textContent = source;
        if (matteFilm) element.append(matteFilm);
      }

      const tone = toneFor(element);
      const isFooterLabel = element.classList.contains('footer-nav-label');
      const isPageName = element.matches(
        '.rim-page-name-screen > .footer-page-led, .rim-page-name-screen > .header-page-led'
      );
      const isLearningFutureStatement = Boolean(element.closest('.learning-future-display'));
      const isHomeHeaderTitle = element.classList.contains('home-title-text-standard') &&
        Boolean(element.closest('.home-header-screen'));
      if (isFooterLabel) {
        element.hidden = false;
        element.dataset.round418Size = 'footer';
        [
          '-webkit-text-stroke','font-family','font-size','font-weight','font-style','line-height',
          'letter-spacing','word-spacing','opacity','visibility','text-shadow','animation','transition',
          'transform','color','-webkit-text-fill-color','background','background-image',
          '-webkit-background-clip','background-clip','filter','-webkit-filter'
        ].forEach((prop) => element.style.removeProperty(prop));
        return;
      }
      element.hidden = false;
      element.style.setProperty('-webkit-text-stroke', '0 transparent', 'important');
      element.style.setProperty('font-family', '"Share Tech Mono", ui-monospace, "Courier New", monospace', 'important');
      element.style.setProperty(
        'font-size',
        isFooterLabel
          ? '12pt'
          : isPageName
            ? (window.matchMedia('(max-width:760px)').matches ? '18.75pt' : '20pt')
            : isHomeHeaderTitle
              ? (window.matchMedia('(max-width:760px)').matches ? '18pt' : window.matchMedia('(max-width:1100px)').matches ? '21pt' : '24pt')
              : '20pt',
        'important'
      );
      element.style.setProperty('font-weight', isFooterLabel || isLearningFutureStatement ? '400' : '700', 'important');
      element.style.setProperty('font-style', 'normal', 'important');
      element.style.setProperty('line-height', isPageName ? '1' : '1.08', 'important');
      element.style.setProperty(
        'letter-spacing',
        isFooterLabel ? '.018em' : isPageName ? '.001em' : isHomeHeaderTitle ? '.018em' : '.045em',
        'important'
      );
      if (isHomeHeaderTitle) {
        element.style.setProperty(
          'word-spacing',
          element.closest('.home-header-screen--red') ? '-.14em' : '-.08em',
          'important'
        );
      }
      element.style.setProperty('opacity', '1', 'important');
      element.style.setProperty('visibility', 'visible', 'important');
      element.style.setProperty('text-shadow', 'none', 'important');
      element.style.setProperty('animation', 'none', 'important');
      element.style.setProperty('transition', 'none', 'important');
      element.style.setProperty('transform', 'none', 'important');

      element.dataset.round418Size = isPageName ? 'compact' : 'large';
      element.dataset.round418FieldIndex = String(fieldIndex);

      element.style.setProperty('--round418-bulb-face', tone.face, 'important');
      element.style.setProperty('--round418-bulb-middle', tone.middle, 'important');
      element.style.setProperty('--round418-bulb-halo', tone.halo, 'important');
      element.style.setProperty('color', 'transparent', 'important');
      element.style.setProperty('-webkit-text-fill-color', 'transparent', 'important');
      element.style.setProperty('background-color', 'transparent', 'important');
      applyAgingPattern(element, source, fieldIndex);
      element.style.setProperty('-webkit-background-clip', 'text', 'important');
      element.style.setProperty('background-clip', 'text', 'important');
      element.style.setProperty(
        'filter',
        `${isHomeHeaderTitle ? 'brightness(1.32) contrast(1.22)' : 'brightness(1.22) contrast(1.18)'} drop-shadow(0 0 .85px var(--round418-bulb-face)) drop-shadow(0 0 3.4px var(--round418-bulb-halo))`,
        'important'
      );
      element.style.setProperty(
        '-webkit-filter',
        `${isHomeHeaderTitle ? 'brightness(1.32) contrast(1.22)' : 'brightness(1.22) contrast(1.18)'} drop-shadow(0 0 .85px var(--round418-bulb-face)) drop-shadow(0 0 3.4px var(--round418-bulb-halo))`,
        'important'
      );
    });
  };

  let fitFrame = 0;
  const fitDigitalTextTiers = () => {
    if (fitFrame) window.cancelAnimationFrame(fitFrame);
    fitFrame = window.requestAnimationFrame(() => {
      fitFrame = 0;
      document.querySelectorAll(DIGITAL_SELECTOR).forEach((element) => {
        if (element.classList.contains('r530-who-bulb-field') ||
            (element.classList.contains('brand-route-screen__label') &&
             (element.closest('#who-we-help-solutions') || element.closest('#learning-route-buttons')))) return;
        if (element.closest('#home-solution-framework')) return;
        const isFooterLabel = element.classList.contains('footer-nav-label');
        const isPageName = element.matches(
          '.rim-page-name-screen > .footer-page-led, .rim-page-name-screen > .header-page-led'
        );
        const isHomeHeaderTitle = element.classList.contains('home-title-text-standard') &&
          Boolean(element.closest('.home-header-screen'));
        if (isFooterLabel || isPageName || isHomeHeaderTitle) return;

        element.dataset.round418Size = 'large';
        element.style.setProperty(
          'font-size',
          isHomeHeaderTitle
            ? (window.matchMedia('(max-width:760px)').matches ? '18pt' : window.matchMedia('(max-width:1100px)').matches ? '21pt' : '24pt')
            : '20pt',
          'important'
        );
      });

      /* Measure only after every candidate has been given the large tier.
         A four-pixel safety inset protects the bulb halo and glass edge. */
      document.querySelectorAll(DIGITAL_SELECTOR).forEach((element) => {
        if (element.classList.contains('r530-who-bulb-field') ||
            (element.classList.contains('brand-route-screen__label') &&
             (element.closest('#who-we-help-solutions') || element.closest('#learning-route-buttons')))) return;
        if (element.closest('#home-solution-framework')) return;
        const isFooterLabel = element.classList.contains('footer-nav-label');
        const isPageName = element.matches(
          '.rim-page-name-screen > .footer-page-led, .rim-page-name-screen > .header-page-led'
        );
        const isHomeHeaderTitle = element.classList.contains('home-title-text-standard') &&
          Boolean(element.closest('.home-header-screen'));
        if (isFooterLabel || isHomeHeaderTitle) return;

        const bounds = element.getBoundingClientRect();
        if (!bounds.width || !bounds.height) return;
        const range = document.createRange();
        range.selectNodeContents(element);
        const contentBounds = range.getBoundingClientRect();
        const overflows =
          contentBounds.width > Math.max(0, bounds.width - 4) ||
          contentBounds.height > Math.max(0, bounds.height - 4);

        if (isHomeHeaderTitle) {
          /* Round 447: the two homepage title fields stay out of the compact
             tier. Desktop uses 24pt; smaller viewports step down only to fit. */
          const homeTitleSize = window.matchMedia('(max-width:760px)').matches
            ? '18pt'
            : window.matchMedia('(max-width:1100px)').matches
              ? '21pt'
              : '24pt';
          element.style.setProperty('font-size', homeTitleSize, 'important');
          element.dataset.round447TitleSize = homeTitleSize;
        } else if (!isPageName && overflows) {
          element.dataset.round418Size = 'compact';
          element.style.setProperty('font-size', '16pt', 'important');
        }

        const finalContentBounds = range.getBoundingClientRect();
        const relativeLeft = Math.max(0, Math.min(bounds.width, finalContentBounds.left - bounds.left));
        const relativeTop = Math.max(0, Math.min(bounds.height, finalContentBounds.top - bounds.top));
        const relativeWidth = Math.max(1, Math.min(bounds.width - relativeLeft, finalContentBounds.width));
        const relativeHeight = Math.max(1, Math.min(bounds.height - relativeTop, finalContentBounds.height));
        const source = normalizeText(
          element.dataset.text || element.getAttribute('aria-label') || element.textContent
        );
        const fieldIndex = Number.parseInt(element.dataset.round418FieldIndex || '0', 10) || 0;
        applyAgingPattern(element, source, fieldIndex, {
          left: (relativeLeft / bounds.width) * 100,
          top: (relativeTop / bounds.height) * 100,
          width: (relativeWidth / bounds.width) * 100,
          height: (relativeHeight / bounds.height) * 100
        });
      });
    });
  };

  const initializeRound418DigitalText = () => {
    restoreCompleteDigitalText();
    fitDigitalTextTiers();
  };

  initializeRound418DigitalText();
  document.addEventListener('DOMContentLoaded', initializeRound418DigitalText, { once: true });
  window.addEventListener('pageshow', initializeRound418DigitalText);
  window.addEventListener('resize', fitDigitalTextTiers, { passive: true });
  if (document.fonts?.ready) document.fonts.ready.then(fitDigitalTextTiers).catch(() => {});
})();


/* Round 426: one physically smooth protective lens sits in front of every
   digital field on the homepage. Real elements avoid collisions with the
   legacy bulb and screen pseudo-elements. */
(() => {
  if (document.body?.dataset?.page !== 'home') return;
  const screenSelectors = [
    'body > .rim-page-name-screen.footer-page-screen.header-page-screen--top',
    'main#main-content .home-header-screen-row > .home-header-screen',
    'main#main-content .home-message-display',
    'main#main-content #home-route-buttons .premium-route-card__title-sign',
    'main#main-content #home-solution-framework .brand-lcd-bar',
    'main#main-content #home-solution-framework .negative-software-screen-round344',
    'main#main-content #home-solution-framework .negative-software-explore-round344'
  ];

  const installRound426Glass = () => {
    document.querySelectorAll(screenSelectors.join(',')).forEach((screen) => {
      if (screen.querySelector(':scope > .round426-glass-lens')) return;

      /* This must not be a span. Several legacy screen rules intentionally
         style direct-child spans as the visible label; using a span for the
         lens produced the empty secondary boxes seen on all three route signs. */
      const lens = document.createElement('i');
      lens.className = 'round426-glass-lens';
      lens.setAttribute('aria-hidden', 'true');
      screen.append(lens);
    });
  };

  /* The digital-text initializer can rebuild a field on DOMContentLoaded or
     pageshow. Reinstalling afterward guarantees that every screen retains one
     lens—never zero and never a duplicate. */
  installRound426Glass();
  document.addEventListener('DOMContentLoaded', installRound426Glass, { once: true });
  window.addEventListener('pageshow', installRound426Glass);
})();




/* Round 465: Learning Center 3D models use a static leather shield backdrop.
   The first model is populated by default. Orb navigation is direction-aware:
   previous enters from the left, next enters from the right, including wraps. */
(() => {
  if (document.body?.dataset?.page !== 'learning') return;

  const stage = document.querySelector('#learning-model-stage.learning-lesson-carousel-stage');
  const track = stage?.querySelector('[data-learning-lesson-track]');
  const slides = stage ? Array.from(stage.querySelectorAll('[data-learning-slide]')) : [];
  const triggers = Array.from(document.querySelectorAll('[data-learning-model]'));
  const orbs = stage ? Array.from(stage.querySelectorAll('[data-learning-carousel-direction]')) : [];
  const status = stage?.querySelector('[data-learning-carousel-status]');
  const lessonNames = {
    ai101: 'AI 101',
    practical: 'Practical Everyday AI',
    strategy: 'Strategy Lab'
  };
  const lessonActivityMessage = 'automated-hearts:learning-activity';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const duration = reducedMotion ? 1 : 680;
  let activeIndex = 0;
  let animating = false;

  if (!stage || !track || slides.length !== 3) return;

  const normalizeIndex = (index) => (index + slides.length) % slides.length;
  const clearMotion = (slide) => {
    ['transition','transform','opacity','z-index'].forEach((name) => slide.style.removeProperty(name));
  };

  const syncLessonActivity = () => {
    slides.forEach((slide, index) => {
      slide.querySelector('iframe')?.contentWindow?.postMessage(
        { type: lessonActivityMessage, active: index === activeIndex },
        '*'
      );
    });
  };

  const syncTriggers = () => {
    const activeKey = slides[activeIndex]?.dataset.learningSlide || '';
    triggers.forEach((trigger) => {
      const selected = trigger.dataset.learningModel === activeKey;
      trigger.setAttribute('aria-pressed', String(selected));
      trigger.closest('.premium-route-card')?.classList.toggle('is-learning-active', selected);
    });
    window.__ahSelectedLearningModel = activeKey;
  };

  const finalizeSelection = (index) => {
    activeIndex = normalizeIndex(index);
    stage.classList.add('has-active-lesson');
    stage.dataset.activeLesson = slides[activeIndex].dataset.learningSlide || '';
    track.style.setProperty('transform', 'none', 'important');

    slides.forEach((slide, idx) => {
      const selected = idx === activeIndex;
      clearMotion(slide);
      slide.classList.toggle('is-active', selected);
      slide.setAttribute('aria-hidden', String(!selected));
      slide.querySelector('iframe')?.setAttribute('tabindex', selected ? '0' : '-1');
    });

    const activeKey = slides[activeIndex].dataset.learningSlide;
    const activeName = lessonNames[activeKey] || activeKey;
    if (status) status.textContent = `${activeName} lesson selected. Use the side controls to change lessons.`;
    syncTriggers();
    syncLessonActivity();
  };

  const animateTo = (nextIndex, direction) => {
    nextIndex = normalizeIndex(nextIndex);
    if (animating || nextIndex === activeIndex) return;

    const current = slides[activeIndex];
    const incoming = slides[nextIndex];
    const enteringX = direction === 'previous' ? '-100%' : '100%';
    const leavingX = direction === 'previous' ? '100%' : '-100%';
    animating = true;
    stage.dataset.modelMotion = direction;
    track.style.setProperty('transform', 'none', 'important');

    slides.forEach((slide) => {
      if (slide !== current && slide !== incoming) {
        clearMotion(slide);
        slide.classList.remove('is-active');
        slide.setAttribute('aria-hidden', 'true');
        slide.querySelector('iframe')?.setAttribute('tabindex', '-1');
      }
    });

    current.classList.add('is-active');
    incoming.classList.add('is-active');
    incoming.querySelector('iframe')?.contentWindow?.postMessage(
      { type: lessonActivityMessage, active: true },
      '*'
    );
    current.setAttribute('aria-hidden', 'false');
    incoming.setAttribute('aria-hidden', 'false');
    current.style.setProperty('transition', 'none', 'important');
    incoming.style.setProperty('transition', 'none', 'important');
    current.style.setProperty('transform', 'translate3d(0,0,0)', 'important');
    incoming.style.setProperty('transform', `translate3d(${enteringX},0,0)`, 'important');
    current.style.setProperty('opacity', '1', 'important');
    incoming.style.setProperty('opacity', '1', 'important');
    current.style.setProperty('z-index', '2', 'important');
    incoming.style.setProperty('z-index', '3', 'important');

    requestAnimationFrame(() => requestAnimationFrame(() => {
      const transition = reducedMotion
        ? 'none'
        : 'transform 680ms cubic-bezier(.22,.72,.25,1), opacity 360ms ease';
      current.style.setProperty('transition', transition, 'important');
      incoming.style.setProperty('transition', transition, 'important');
      current.style.setProperty('transform', `translate3d(${leavingX},0,0)`, 'important');
      incoming.style.setProperty('transform', 'translate3d(0,0,0)', 'important');
    }));

    window.setTimeout(() => {
      current.classList.remove('is-active');
      current.setAttribute('aria-hidden', 'true');
      current.querySelector('iframe')?.setAttribute('tabindex', '-1');
      incoming.querySelector('iframe')?.setAttribute('tabindex', '0');
      clearMotion(current);
      clearMotion(incoming);
      activeIndex = nextIndex;
      finalizeSelection(activeIndex);
      delete stage.dataset.modelMotion;
      animating = false;
    }, duration + 40);
  };

  const selectLesson = (lessonKey, options = {}) => {
    const requestedIndex = slides.findIndex((slide) => slide.dataset.learningSlide === lessonKey);
    if (requestedIndex < 0) return;
    if (options.direction === 'previous' || options.direction === 'next') {
      animateTo(requestedIndex, options.direction);
    } else {
      finalizeSelection(requestedIndex);
    }
    if (options.scroll !== false) {
      requestAnimationFrame(() => {
        if (typeof window.__ahSmoothScrollModelStageRound496 === 'function') {
          window.__ahSmoothScrollModelStageRound496(stage);
        } else {
          stage.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
  };

  triggers.forEach((trigger) => {
    trigger.setAttribute('aria-pressed', 'false');
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      selectLesson(trigger.dataset.learningModel, { scroll: true });
    });
  });

  orbs.forEach((orb) => {
    orb.addEventListener('click', () => {
      const direction = orb.dataset.learningCarouselDirection === 'previous' ? 'previous' : 'next';
      const delta = direction === 'previous' ? -1 : 1;
      animateTo(activeIndex + delta, direction);
    });
  });

  stage.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const direction = event.key === 'ArrowLeft' ? 'previous' : 'next';
    animateTo(activeIndex + (direction === 'previous' ? -1 : 1), direction);
  });

  slides.forEach((slide) => {
    slide.querySelector('iframe')?.addEventListener('load', syncLessonActivity);
  });

  finalizeSelection(0);
  window.__ahActivateLearningLessonRound436 = selectLesson;
})();
/* Round 779 cleanup: removed redundant Round 533 footer rebuild fallback.
   The earlier balanceHeaderNavigation() fallback remains; primary pages ship the
   complete mechanical footer directly in HTML, so a second startup DOM rebuild
   was unnecessary and could only reintroduce layout/style instability. */
/* Round 939: removed legacy footer-cluster illumination so each footer control
   behaves independently like the top Messages control. */
/* Round 527: pronounced deterministic aging for the two homepage title
   fields. Whole letters range from overdriven to nearly failed, and each glyph
   receives independent hot, flare, survivor, dim, dead, and charred bulbs. */
(() => {
  "use strict";
  const fields = [...document.querySelectorAll('.home-title-text-standard[data-text]')];
  if (!fields.length) return;
  /* Hand-balanced sequences prevent repetitive stripes while guaranteeing
     that both fields contain every kind of aging. */
  const fieldPatterns = [
    ['normal','surge','weak','burnt','hot','failing','normal','burnt','surge','weak','normal','hot','failing','burnt','normal'],
    ['weak','normal','hot','burnt','surge','normal','failing','hot','burnt','weak','normal','surge','failing','normal','hot','burnt','normal','weak','surge','failing','normal','hot','burnt','normal','weak','surge']
  ];
  fields.forEach((field, fieldIndex) => {
    if (field.classList.contains('r486-title-glyphs')) return;
    const source = field.dataset.text || field.textContent || '';
    const frag = document.createDocumentFragment();
    let visibleIndex = 0;
    [...source].forEach((char) => {
      const span = document.createElement('span');
      span.className = 'r486-title-char';
      span.setAttribute('aria-hidden','true');
      if (/\s/.test(char)) {
        span.classList.add('r486-title-space');
        span.textContent = '\u00a0';
      } else {
        const pattern = fieldPatterns[fieldIndex % fieldPatterns.length];
        const state = pattern[visibleIndex % pattern.length];
        if (state !== 'normal') span.dataset.lamp = state;
        span.dataset.glyph = char;
        let hash = 2166136261;
        for (const code of `${fieldIndex}:${visibleIndex}:${char}`) {
          hash ^= code.charCodeAt(0);
          hash = Math.imul(hash,16777619) >>> 0;
        }
        const pick = (shift,modulo) => (hash >>> shift) % modulo;
        span.style.setProperty('--r526-grid-x',`${pick(0,5) - 2}px`);
        span.style.setProperty('--r526-grid-y',`${pick(3,5) - 2}px`);
        span.style.setProperty('--r526-hot-x',`${pick(6,4) * 5}px`);
        span.style.setProperty('--r526-hot-y',`${pick(9,4) * 5}px`);
        span.style.setProperty('--r526-flare-x',`${pick(11,5) * 5}px`);
        span.style.setProperty('--r526-flare-y',`${pick(14,5) * 5}px`);
        span.style.setProperty('--r526-survivor-x',`${pick(5,6) * 5}px`);
        span.style.setProperty('--r526-survivor-y',`${pick(17,6) * 5}px`);
        span.style.setProperty('--r526-dead-x',`${pick(12,5) * 5}px`);
        span.style.setProperty('--r526-dead-y',`${pick(15,5) * 5}px`);
        span.style.setProperty('--r526-dim-x',`${pick(18,4) * 5}px`);
        span.style.setProperty('--r526-dim-y',`${pick(21,4) * 5}px`);
        span.style.setProperty('--r526-scar-x',`${pick(24,6) * 5}px`);
        span.style.setProperty('--r526-scar-y',`${pick(27,4) * 5}px`);
        span.textContent = char;
        visibleIndex += 1;
      }
      frag.appendChild(span);
    });
    field.replaceChildren(frag);
    field.classList.add('r486-title-glyphs');
  });
})();

/* Round 1037: route labels are plain text on both Who We Help and Learning Center.
   The retired per-character aged-bulb renderers (Rounds 528/530/531) were removed
   because they rebuilt words after load and collapsed/blurred visible spaces. */
(() => {
  "use strict";
  const selectors = [
    'body.page-home[data-page="home"] #home-route-buttons .brand-route-screen__label[data-text]',
    'body.page-who-we-help[data-page="who-we-help"] #who-we-help-solutions .brand-route-screen__label[data-text]',
    'body.page-learning[data-page="learning"] #learning-route-buttons .brand-route-screen__label[data-text]'
  ].join(',');
  const normalize = () => {
    document.querySelectorAll(selectors).forEach((label) => {
      const source = label.dataset.text || label.getAttribute('aria-label') || label.textContent || '';
      label.replaceChildren(document.createTextNode(source));
      label.classList.remove('r528-who-glyphs','r530-who-bulb-field','r531-learning-bulb-field');
      label.setAttribute('aria-label', source);
    });
  };
  normalize();
  document.addEventListener('DOMContentLoaded', normalize, { once:true });
  window.addEventListener('pageshow', normalize);
})();

/* Round 958: scroll-direction section leaning/depth effect removed entirely. */

/* Round 661 — final Home title fitting and linked footer illumination.
   This runs after the legacy digital-text/glyph passes so they cannot restore
   oversized title text or single-button-only hover behavior afterward. */
(() => {
  "use strict";

  /* Round 780: no post-paint Home title measurements. */
  if (document.body?.dataset?.page === 'home') return;

  const fitHomeTitles = () => {
    const row = document.getElementById('home-title-fields');
    if (!row) return;
    const fields = [...row.querySelectorAll('.home-title-text-standard')];
    fields.forEach((field) => {
      const screen = field.closest('.home-header-screen');
      if (!screen) return;
      const red = screen.classList.contains('home-header-screen--red');
      const narrow = window.matchMedia('(max-width:760px)').matches;
      const mid = !narrow && window.matchMedia('(max-width:1180px)').matches;
      const maxSize = narrow ? 24 : mid ? (red ? 25.5 : 29) : (red ? 32 : 36);
      const minSize = narrow ? 12 : 14;

      // Round 723: measure against the title row's allocated grid track, not
      // the screen's previously trimmed width. Measuring the already-trimmed
      // screen created a feedback loop that clipped both titles more on every
      // fit pass. Desktop/tablet use the canonical 38/62 (40/60 mid) split.
      const rowWidth = Math.max(1, row.clientWidth || row.getBoundingClientRect().width || 1);
      const rowGap = narrow ? 12 : (mid ? 14 : 18);
      const usableRow = Math.max(1, rowWidth - (narrow ? 0 : rowGap));
      const trackRatio = narrow ? 1 : (mid ? (red ? .60 : .40) : (red ? .62 : .38));
      const trackWidth = narrow ? rowWidth : usableRow * trackRatio;
      const horizontalAllowance = narrow ? 26 : (red ? 60 : 48);
      const available = Math.max(120, trackWidth - horizontalAllowance);

      field.style.setProperty('display', 'inline-flex', 'important');
      field.style.setProperty('width', 'max-content', 'important');
      field.style.setProperty('max-width', 'none', 'important');
      field.style.setProperty('letter-spacing', red ? '.040em' : '.052em', 'important');
      field.style.setProperty('word-spacing', '0', 'important');
      field.style.setProperty('white-space', 'nowrap', 'important');

      let low = minSize;
      let high = maxSize;
      let best = minSize;
      for (let i = 0; i < 12; i += 1) {
        const test = (low + high) / 2;
        field.style.setProperty('font-size', `${test}px`, 'important');
        const width = field.getBoundingClientRect().width;
        if (width <= available) {
          best = test;
          low = test;
        } else {
          high = test;
        }
      }
      field.style.setProperty('font-size', `${Math.floor(best * 10) / 10}px`, 'important');

      // Round 675: trim the physical blue field to the actual rendered title.
      // Keep only a modest side margin while preserving the established title size.
      const renderedTitleWidth = Math.ceil(field.getBoundingClientRect().width);
      const trimAllowance = narrow ? 30 : (red ? 56 : 44);
      const trimmedScreenWidth = Math.min(trackWidth, renderedTitleWidth + trimAllowance);
      screen.style.setProperty('width', `${Math.max(120, Math.round(trimmedScreenWidth))}px`, 'important');
      screen.style.setProperty('min-width', '0', 'important');
      screen.style.setProperty('max-width', `${Math.max(120, Math.round(trackWidth))}px`, 'important');
      screen.style.setProperty('justify-self', 'center', 'important');
      screen.style.setProperty('flex', '0 0 auto', 'important');
    });
  };

  let resizeFrame = 0;
  const scheduleFit = () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => {
      fitHomeTitles();
      requestAnimationFrame(fitHomeTitles);
    });
  };

  scheduleFit();
  document.addEventListener('DOMContentLoaded', scheduleFit, { once: true });
  window.addEventListener('load', scheduleFit, { once: true });
  window.addEventListener('pageshow', scheduleFit);
  window.addEventListener('resize', scheduleFit, { passive: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(scheduleFit).catch(() => {});

  /* Round 939: footer cluster-light listeners removed; controls are independent. */
})();

/* Round 680 — slow, exclusive Home machine-window shutters. */
(function(){
  'use strict';
  function initHomeMachineHaze(){
    var grid=document.getElementById('home-machine-grid');
    if(!grid) return;
    var frames=Array.prototype.slice.call(grid.querySelectorAll(':scope > .home-hero-engine-frame'));
    if(!frames.length) return;
    var duration=1000;

    function setOpen(frame,open){
      if(!frame) return;
      frame.classList.toggle('is-haze-open',!!open);
      var screen=frame.querySelector('[data-machine-haze]');
      if(screen) screen.setAttribute('aria-expanded',open?'true':'false');
    }
    function resetClosed(){
      frames.forEach(function(frame){
        frame.classList.remove('is-haze-open','is-haze-closing');
        var screen=frame.querySelector('[data-machine-haze]');
        if(screen) screen.setAttribute('aria-expanded','false');
      });
      grid.dataset.hazeBusy='0';
    }
    function finishClose(frame,done){
      if(!frame){ if(done) done(); return; }
      frame.classList.add('is-haze-closing');
      setOpen(frame,false);
      var screen=frame.querySelector('[data-machine-haze]');
      var finished=false;
      function complete(){
        if(finished) return;
        finished=true;
        frame.classList.remove('is-haze-closing');
        if(screen) screen.removeEventListener('transitionend',onEnd);
        if(done) done();
      }
      function onEnd(e){
        if(e.propertyName==='transform') complete();
      }
      if(screen) screen.addEventListener('transitionend',onEnd);
      window.setTimeout(complete,duration+120);
    }

    if(grid.dataset.hazeInit!=='1'){
      grid.dataset.hazeInit='1';
      resetClosed();
      grid.addEventListener('click',function(e){
        var screen=e.target.closest('[data-machine-haze]');
        if(!screen || !grid.contains(screen) || grid.dataset.hazeBusy==='1') return;
        var target=screen.closest('.home-hero-engine-frame');
        if(!target) return;
        e.preventDefault();

        /* Clicking the retained heart handle on an already-open shield lowers it. */
        if(target.classList.contains('is-haze-open')){
          grid.dataset.hazeBusy='1';
          finishClose(target,function(){
            grid.dataset.hazeBusy='0';
          });
          return;
        }

        var current=grid.querySelector(':scope > .home-hero-engine-frame.is-haze-open');
        if(current && current!==target){
          grid.dataset.hazeBusy='1';
          finishClose(current,function(){
            setOpen(target,true);
            grid.dataset.hazeBusy='0';
          });
        }else{
          setOpen(target,true);
        }
      });
    }
    return resetClosed;
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',function(){ initHomeMachineHaze(); },{once:true});
  }else{
    initHomeMachineHaze();
  }
  window.addEventListener('pageshow',function(){
    var reset=initHomeMachineHaze();
    if(reset) reset();
  });
})();

;
/* Round 913 — keep the Message control/contact state stable across same-tab
   navigation. The early head marker prevents the control from visually
   resetting before the shared contact drawer has rebuilt on the destination. */
(()=>{
  'use strict';
  const KEY='ah-message-open-v1';
  const getStored=()=>{try{return sessionStorage.getItem(KEY)==='1';}catch(_){return false;}};
  const store=(open)=>{try{sessionStorage.setItem(KEY,open?'1':'0');}catch(_){}}
  const root=document.documentElement;
  const syncRoot=(open)=>root.classList.toggle('ah-message-persist-open',!!open);

  const bind=()=>{
    const trigger=document.getElementById('header-send-message');
    if(!trigger) return;
    const syncFromTrigger=()=>{
      const open=trigger.getAttribute('aria-expanded')==='true'||trigger.classList.contains('is-contact-latched');
      store(open);syncRoot(open);
    };
    new MutationObserver(syncFromTrigger).observe(trigger,{attributes:true,attributeFilter:['aria-expanded','class']});

    if(getStored()){
      syncRoot(true);
      // script-round447 creates/binds the drawer first because this file is loaded after it.
      requestAnimationFrame(()=>{
        if(trigger.getAttribute('aria-expanded')!=='true') trigger.click();
      });
    }else{
      syncRoot(false);
    }
    window.addEventListener('pagehide',syncFromTrigger,{capture:true});
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',bind,{once:true});
  else bind();
})();


/* Round 1034: footer hardware dimensions are CSS-owned and immutable; no runtime sizing. */

;
/* SOURCE: ah-js-bundle-05.js */
/* Round 933: Who We Help shared model carousel.
   Uses the supplied Industry Helix first and Readiness Diagnostic second.
   Any industry route resets to the Helix and asks it to focus that industry. */
(() => {
  'use strict';

  const stages = Array.from(document.querySelectorAll('.shared-model-carousel-stage'));
  if (!stages.length) return;

  const activityMessage = 'automated-hearts:learning-activity';
  const industryMessage = 'automated-hearts:who-help-industry';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const duration = reducedMotion ? 260 : 860;

  stages.forEach((stage) => {
    const track = stage.querySelector('[data-shared-carousel-track]');
    const slides = Array.from(stage.querySelectorAll('[data-shared-slide]'));
    const orbs = Array.from(stage.querySelectorAll('[data-shared-carousel-direction]'));
    const status = stage.querySelector('[data-shared-carousel-status]');
    if (!track || !slides.length) return;

    let activeIndex = 0;
    let animating = false;
    let selectedIndustry = 0;
    let userActivatedModel = false;
    const normalize = (index) => (index + slides.length) % slides.length;
    const clearMotion = (slide) => {
      ['transition','transform','opacity','z-index','will-change'].forEach((name) => slide.style.removeProperty(name));
    };
    const ensureFrameLoaded = (slide) => {
      if (!userActivatedModel) return null;
      const frame = slide?.querySelector('iframe');
      if (!frame) return null;
      if (!frame.getAttribute('src') && frame.dataset.src) {
        frame.setAttribute('loading','eager');
        frame.setAttribute('src',frame.dataset.src);
      }
      return frame;
    };
    const modelName = (slide,index) => slide?.dataset.modelName || `Model ${index + 1}`;

    const sendIndustry = () => {
      const frame = slides[0]?.querySelector('iframe');
      frame?.contentWindow?.postMessage({
        type:industryMessage,
        industryIndex:selectedIndustry
      },'*');
    };

    const syncActivity = () => {
      slides.forEach((slide,index) => {
        const frame = slide.querySelector('iframe');
        if (!frame?.contentWindow) return;
        frame.contentWindow.postMessage({ type:activityMessage, active:index === activeIndex },'*');
      });
      if (activeIndex === 0) sendIndustry();
    };

    const finalize = (index) => {
      activeIndex = normalize(index);
      const activeSlide = slides[activeIndex];
      ensureFrameLoaded(activeSlide);
      stage.classList.add('has-active-lesson');
      stage.classList.toggle('has-single-model',slides.length < 2);
      stage.dataset.activeModel = String(activeIndex + 1);
      stage.dataset.modelCount = String(slides.length);
      track.style.setProperty('transform','none','important');

      slides.forEach((slide,idx) => {
        const selected = idx === activeIndex;
        clearMotion(slide);
        slide.hidden = false;
        slide.classList.toggle('is-active',selected);
        slide.setAttribute('aria-hidden',String(!selected));
        slide.querySelector('iframe')?.setAttribute('tabindex',selected ? '0' : '-1');
      });

      orbs.forEach((orb) => {
        orb.disabled = slides.length < 2;
        orb.setAttribute('aria-disabled',String(slides.length < 2));
      });

      if (status) {
        status.textContent = `${modelName(activeSlide,activeIndex)}, model ${activeIndex + 1} of ${slides.length}.`;
      }
      syncActivity();
    };

    const animateTo = (requestedIndex,direction) => {
      if (animating || slides.length < 2) return;
      const nextIndex = normalize(requestedIndex);
      if (nextIndex === activeIndex) return;

      const current = slides[activeIndex];
      const incoming = slides[nextIndex];
      const enteringX = direction === 'previous' ? '-104%' : '104%';
      const leavingX = direction === 'previous' ? '104%' : '-104%';
      ensureFrameLoaded(incoming);
      incoming.hidden = false;
      animating = true;
      stage.dataset.modelMotion = direction;

      current.classList.add('is-active');
      incoming.classList.add('is-active');
      current.setAttribute('aria-hidden','false');
      incoming.setAttribute('aria-hidden','false');
      current.style.setProperty('transition','none','important');
      incoming.style.setProperty('transition','none','important');
      current.style.setProperty('transform','translate3d(0,0,0)','important');
      incoming.style.setProperty('transform',`translate3d(${enteringX},0,0)`,'important');
      current.style.setProperty('opacity','1','important');
      incoming.style.setProperty('opacity','1','important');
      current.style.setProperty('z-index','2','important');
      incoming.style.setProperty('z-index','3','important');
      current.style.setProperty('will-change','transform, opacity','important');
      incoming.style.setProperty('will-change','transform, opacity','important');

      incoming.getBoundingClientRect();
      requestAnimationFrame(() => {
        const transition = `transform ${duration}ms cubic-bezier(.22,.72,.25,1), opacity ${Math.max(180,Math.round(duration * .54))}ms ease`;
        current.style.setProperty('transition',transition,'important');
        incoming.style.setProperty('transition',transition,'important');
        current.style.setProperty('transform',`translate3d(${leavingX},0,0)`,'important');
        incoming.style.setProperty('transform','translate3d(0,0,0)','important');
      });

      window.setTimeout(() => {
        activeIndex = nextIndex;
        finalize(activeIndex);
        delete stage.dataset.modelMotion;
        animating = false;
      },duration + 80);
    };

    orbs.forEach((orb) => {
      orb.addEventListener('click',() => {
        const direction = orb.dataset.sharedCarouselDirection === 'previous' ? 'previous' : 'next';
        animateTo(activeIndex + (direction === 'previous' ? -1 : 1),direction);
      });
    });

    stage.addEventListener('keydown',(event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      const direction = event.key === 'ArrowLeft' ? 'previous' : 'next';
      animateTo(activeIndex + (direction === 'previous' ? -1 : 1),direction);
    });

    slides.forEach((slide,index) => {
      slide.querySelector('iframe')?.addEventListener('load',() => {
        if (index === 0) sendIndustry();
        syncActivity();
      });
    });

    window.__ahActivateWhoHelpIndustryRound933 = (industryIndex = 0) => {
      userActivatedModel = true;
      selectedIndustry = Math.max(0,Math.min(3,Number(industryIndex) || 0));
      stage.dataset.industryIndex = String(selectedIndustry);
      animating = false;
      finalize(0);
      sendIndustry();
    };

    finalize(0);
  });
})();

;
/* Round 719 — authoritative Who We Help return controller.
   The page scrolls inside fixed main#main-content, NOT the browser document.
   Sequence: local shield closes upward for the same 2000ms/easing used to reveal
   it -> the real main scroller smoothly returns to top -> the lower stage is
   removed -> that same main scroller is hard-locked until another category is
   selected. */
(() => {
  'use strict';

  if (document.body?.dataset?.page !== 'who-we-help') return;

  const stage = document.querySelector('#who-help-model-stage');
  const shield = stage?.querySelector('[data-learning-stage-shield]');
  const returnButton = stage?.querySelector('[data-who-help-back-to-top]');
  const mainScroller = document.querySelector('main#main-content');
  const cardSelector = '#who-we-help-solutions .premium-route-card__image-button';
  const body = document.body;
  if (!stage || !shield || !returnButton || !mainScroller || !body) return;

  const SHIELD_MS = 2000;
  const SHIELD_EASE = 'cubic-bezier(.22,.66,.24,1)';
  let returning = false;
  let hardLocked = false;
  let scrollFrame = 0;
  let savedScrollerState = null;

  const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));
  const twoFrames = async () => { await nextFrame(); await nextFrame(); };

  const rememberInline = (element, property) => ({
    value: element.style.getPropertyValue(property),
    priority: element.style.getPropertyPriority(property)
  });
  const restoreInline = (element, property, prior) => {
    if (!prior) return;
    if (prior.value) element.style.setProperty(property, prior.value, prior.priority);
    else element.style.removeProperty(property);
  };

  const readTop = () => Math.max(0, mainScroller.scrollTop || 0);
  const writeTop = (top) => { mainScroller.scrollTop = Math.max(0, Number(top) || 0); };

  const releaseHardLock = () => {
    if (!hardLocked) return;
    hardLocked = false;
    body.classList.remove('ah-who-help-return-hard-locked');
    if (savedScrollerState) {
      restoreInline(mainScroller, 'overflow-y', savedScrollerState.overflowY);
      restoreInline(mainScroller, 'overscroll-behavior-y', savedScrollerState.overscrollY);
      restoreInline(mainScroller, 'touch-action', savedScrollerState.touchAction);
      savedScrollerState = null;
    }
  };

  const engageHardLock = () => {
    releaseHardLock();
    writeTop(0);
    savedScrollerState = {
      overflowY: rememberInline(mainScroller, 'overflow-y'),
      overscrollY: rememberInline(mainScroller, 'overscroll-behavior-y'),
      touchAction: rememberInline(mainScroller, 'touch-action')
    };
    body.classList.add('ah-who-help-return-hard-locked');
    mainScroller.style.setProperty('overflow-y', 'hidden', 'important');
    mainScroller.style.setProperty('overscroll-behavior-y', 'none', 'important');
    mainScroller.style.setProperty('touch-action', 'none', 'important');
    hardLocked = true;
  };

  /* Release the hard lock before the existing category controller measures and
     scrolls the reopened stage. This fires before its click listener. */
  window.addEventListener('pointerdown', (event) => {
    if (!(event.target instanceof Element)) return;
    if (event.target.closest(cardSelector)) releaseHardLock();
  }, true);

  /* Keyboard activation has no pointerdown. Existing selection removes the
     ah-model-stage-locked class, which becomes the authoritative unlock signal. */
  new MutationObserver(() => {
    if (!body.classList.contains('ah-model-stage-locked')) releaseHardLock();
  }).observe(body, { attributes: true, attributeFilter: ['class'] });

  const blockReturnInput = (event) => {
    if (!returning) return;
    event.preventDefault();
    event.stopPropagation();
  };
  const blockReturnKeys = (event) => {
    if (!returning) return;
    if (['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' ','Spacebar'].includes(event.key)) {
      event.preventDefault();
      event.stopPropagation();
    }
  };
  mainScroller.addEventListener('wheel', blockReturnInput, { capture: true, passive: false });
  mainScroller.addEventListener('touchmove', blockReturnInput, { capture: true, passive: false });
  window.addEventListener('keydown', blockReturnKeys, true);

  const waitForShieldTransform = () => new Promise((resolve) => {
    let settled = false;
    let timer = 0;
    const finish = () => {
      if (settled) return;
      settled = true;
      shield.removeEventListener('transitionend', onEnd);
      shield.removeEventListener('transitioncancel', onCancel);
      if (timer) window.clearTimeout(timer);
      resolve();
    };
    const onEnd = (event) => {
      if (event.target === shield && event.propertyName === 'transform') finish();
    };
    const onCancel = (event) => {
      if (event.target === shield) finish();
    };
    shield.addEventListener('transitionend', onEnd);
    shield.addEventListener('transitioncancel', onCancel);
    timer = window.setTimeout(finish, SHIELD_MS + 220);
  });

  const raiseShield = async () => {
    /* Round 916: the shield is already at its fully-open class state. One
       class-state change starts the compositor transition back to closed. */
    shield.style.setProperty('transition', `transform ${SHIELD_MS}ms ${SHIELD_EASE}`, 'important');
    stage.dataset.shieldMotion = '1';
    window.dispatchEvent(new CustomEvent('ah:local-shield-state'));
    const finished = waitForShieldTransform();
    stage.classList.remove('is-learning-shield-open');
    stage.classList.add('is-learning-shield-closed');
    await finished;
    delete stage.dataset.shieldMotion;
    window.dispatchEvent(new CustomEvent('ah:local-shield-state'));
  };

  const smoothMainToTop = () => new Promise((resolve) => {
    const start = readTop();
    if (start <= 1) {
      writeTop(0);
      resolve();
      return;
    }

    if (scrollFrame) cancelAnimationFrame(scrollFrame);
    scrollFrame = 0;

    const oldBehavior = rememberInline(mainScroller, 'scroll-behavior');
    const oldAnchor = rememberInline(mainScroller, 'overflow-anchor');
    const oldSnap = rememberInline(mainScroller, 'scroll-snap-type');
    mainScroller.style.setProperty('scroll-behavior', 'auto', 'important');
    mainScroller.style.setProperty('overflow-anchor', 'none', 'important');
    mainScroller.style.setProperty('scroll-snap-type', 'none', 'important');

    const duration = Math.min(1850, Math.max(1100, 900 + start * .28));
    const started = performance.now();
    const ease = (value) => value < .5
      ? 4 * value * value * value
      : 1 - Math.pow(-2 * value + 2, 3) / 2;

    const cleanup = () => {
      if (scrollFrame) cancelAnimationFrame(scrollFrame);
      scrollFrame = 0;
      writeTop(0);
      restoreInline(mainScroller, 'scroll-behavior', oldBehavior);
      restoreInline(mainScroller, 'overflow-anchor', oldAnchor);
      restoreInline(mainScroller, 'scroll-snap-type', oldSnap);
      resolve();
    };

    const step = (now) => {
      const progress = Math.min(1, Math.max(0, (now - started) / duration));
      writeTop(start * (1 - ease(progress)));
      if (progress < 1) scrollFrame = requestAnimationFrame(step);
      else cleanup();
    };
    scrollFrame = requestAnimationFrame(step);
  });

  const runReturn = async () => {
    if (returning) return;
    returning = true;
    returnButton.disabled = true;
    body.classList.add('ah-who-help-returning-round719');
    releaseHardLock();

    try {
      /* 1) Shield fully rises before the scroll viewport moves at all. */
      await raiseShield();

      /* 2) Smoothly scroll the REAL fixed main viewport back to its top. */
      await smoothMainToTop();

      /* 3) Remove the lower stage only after the return scroll has finished. */
      if (typeof window.__ahSetModelStageLockedRound558 === 'function') {
        window.__ahSetModelStageLockedRound558(true);
      } else {
        body.classList.add('ah-model-stage-locked');
        stage.classList.add('is-model-stage-locked');
        stage.style.setProperty('display', 'none', 'important');
      }
      await twoFrames();
      writeTop(0);

      /* 4) Lock this same main viewport until another category is selected. */
      engageHardLock();

      try {
        history.replaceState(history.state, '', window.location.pathname + window.location.search);
      } catch (error) {}
    } finally {
      returnButton.disabled = false;
      body.classList.remove('ah-who-help-returning-round719');
      returning = false;
    }
  };

  /* Window capture runs before the older button-level return listener. */
  window.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    if (!event.target.closest('[data-who-help-back-to-top]')) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    runReturn();
  }, true);
})();

;