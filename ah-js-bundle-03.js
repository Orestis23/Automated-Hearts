/* Round 515: the Learning Center's three route buttons select model groups.
   Each Learning Center route owns the supplied interactive models for that
   lesson; the side orbs navigate only within the selected group. */
(() => {
  'use strict';

  if (document.body?.dataset?.page !== 'learning') return;

  const stage = document.querySelector('#learning-model-stage.learning-lesson-carousel-stage');
  const track = stage?.querySelector('[data-learning-lesson-track]');
  const slides = stage ? Array.from(stage.querySelectorAll('[data-learning-slide]')) : [];
  const triggers = Array.from(document.querySelectorAll('[data-learning-model]'));
  const orbs = stage ? Array.from(stage.querySelectorAll('[data-learning-carousel-direction]')) : [];
  const status = stage?.querySelector('[data-learning-carousel-status]');
  if (!stage || !track || !slides.length) return;

  const groupNames = {
    ai101:'AI 101',
    practical:'Practical AI',
    strategy:'Strategy Lab'
  };
  const activityMessage = 'automated-hearts:learning-activity';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const duration = reducedMotion ? 260 : 860;
  let activeGroup = 'ai101';
  let activeIndex = 0;
  let animating = false;
  let userActivatedLesson = false;

  const groupSlides = (key = activeGroup) => slides.filter(
    (slide) => slide.dataset.learningSlide === key
  );
  const normalize = (index, length) => (index + length) % length;
  const clearMotion = (slide) => {
    ['transition','transform','opacity','z-index','will-change'].forEach((name) => slide.style.removeProperty(name));
  };
  const ensureFrameLoaded = (slide) => {
    if (!userActivatedLesson) return;
    const frame = slide?.querySelector('iframe');
    if (!frame) return;
    const source = frame.dataset.src;
    if (source && !frame.getAttribute('src')) {
      frame.setAttribute('loading','eager');
      frame.setAttribute('src',source);
    }
  };

  const syncActivity = () => {
    slides.forEach((slide) => {
      const frame = slide.querySelector('iframe');
      if (!frame?.contentWindow) return;
      frame.contentWindow.postMessage({
        type:activityMessage,
        active:slide.classList.contains('is-active')
      },'*');
    });
  };

  const syncTriggers = () => {
    triggers.forEach((trigger) => {
      const selected = trigger.dataset.learningModel === activeGroup;
      trigger.setAttribute('aria-pressed',String(selected));
      trigger.closest('.premium-route-card')?.classList.toggle('is-learning-active',selected);
    });
    window.__ahSelectedLearningModel = activeGroup;
  };

  const finalize = (groupKey, index = 0) => {
    activeGroup = groupSlides(groupKey).length ? groupKey : 'ai101';
    const currentGroup = groupSlides(activeGroup);
    activeIndex = normalize(index,currentGroup.length);
    const activeSlide = currentGroup[activeIndex];
    ensureFrameLoaded(activeSlide);

    stage.classList.add('has-active-lesson');
    stage.classList.toggle('has-single-model',currentGroup.length < 2);
    stage.dataset.activeLesson = activeGroup;
    stage.dataset.activeModel = String(activeIndex + 1);
    stage.dataset.modelCount = String(currentGroup.length);
    track.style.setProperty('transform','none','important');

    slides.forEach((slide) => {
      const selected = slide === activeSlide;
      const inGroup = slide.dataset.learningSlide === activeGroup;
      clearMotion(slide);
      slide.hidden = !inGroup;
      slide.classList.toggle('is-active',selected);
      slide.setAttribute('aria-hidden',String(!selected));
      slide.querySelector('iframe')?.setAttribute('tabindex',selected ? '0' : '-1');
    });

    orbs.forEach((orb) => {
      orb.disabled = currentGroup.length < 2;
      orb.setAttribute('aria-disabled',String(currentGroup.length < 2));
    });

    const modelName = activeSlide.dataset.modelName || `Model ${activeIndex + 1}`;
    if (status) {
      status.textContent = `${groupNames[activeGroup] || activeGroup}: ${modelName}, model ${activeIndex + 1} of ${currentGroup.length}.`;
    }
    syncTriggers();
    syncActivity();
  };

  const animateTo = (requestedIndex,direction) => {
    const currentGroup = groupSlides();
    if (animating || currentGroup.length < 2) return;
    const nextIndex = normalize(requestedIndex,currentGroup.length);
    if (nextIndex === activeIndex) return;

    const current = currentGroup[activeIndex];
    const incoming = currentGroup[nextIndex];
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

    /* Commit the incoming model's off-screen position before the move. */
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
      finalize(activeGroup,activeIndex);
      delete stage.dataset.modelMotion;
      animating = false;
    },duration + 80);
  };

  const selectGroup = (groupKey,options = {}) => {
    userActivatedLesson = true;
    if (!groupSlides(groupKey).length) return;
    animating = false;
    finalize(groupKey,0);
    if (options.scroll !== false) {
      requestAnimationFrame(() => {
        if (typeof window.__ahSmoothScrollModelStageRound496 === 'function') {
          window.__ahSmoothScrollModelStageRound496(stage);
        } else {
          stage.scrollIntoView({behavior:'smooth',block:'start'});
        }
      });
    }
  };

  triggers.forEach((trigger) => {
    trigger.setAttribute('aria-pressed','false');
    trigger.addEventListener('click',(event) => {
      event.preventDefault();
      selectGroup(trigger.dataset.learningModel,{scroll:true});
    });
  });

  orbs.forEach((orb) => {
    orb.addEventListener('click',() => {
      const direction = orb.dataset.learningCarouselDirection === 'previous' ? 'previous' : 'next';
      animateTo(activeIndex + (direction === 'previous' ? -1 : 1),direction);
    });
  });

  stage.addEventListener('keydown',(event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const direction = event.key === 'ArrowLeft' ? 'previous' : 'next';
    animateTo(activeIndex + (direction === 'previous' ? -1 : 1),direction);
  });

  slides.forEach((slide) => slide.querySelector('iframe')?.addEventListener('load',syncActivity));
  finalize('ai101',0);
  window.__ahActivateLearningLessonRound436 = selectGroup;
})();

;
/* Round 516: the Learning Center lesson stage opens only after the controlled
   scroll reaches it. The return control closes the local leather shield first,
   then performs one deterministic smooth scroll back to the lesson choices. */
(() => {
  'use strict';

  if (document.body?.dataset?.page !== 'learning') return;

  const stage = document.querySelector('#learning-model-stage');
  const shield = stage?.querySelector('[data-learning-stage-shield]');
  const returnButton = stage?.querySelector('[data-learning-choose-another]');
  const lessonChoices = document.querySelector('#learning-route-buttons');
  const status = stage?.querySelector('[data-learning-carousel-status]');
  if (!stage || !shield || !returnButton || !lessonChoices) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const shieldDuration = 2000;
  let returning = false;
  let scrollFrame = 0;

  const ensureActiveModelFrame = () => {
    const activeSlide = stage.querySelector('.learning-lesson-slide.is-active')
      || stage.querySelector('.learning-lesson-slide:not([hidden])');
    const frame = activeSlide?.querySelector('iframe');
    if (!frame) return null;
    const source = frame.dataset.src;
    if (source && !frame.getAttribute('src')) frame.setAttribute('src',source);
    frame.setAttribute('loading','eager');
    return frame;
  };

  const closeShield = () => {
    shield.style.setProperty('transition',`transform ${shieldDuration}ms cubic-bezier(.22,.66,.24,1)`,'important');
    stage.classList.remove('is-learning-shield-open');
    stage.classList.add('is-learning-shield-closed');
  };

  const openShield = () => {
    if (returning) return;
    ensureActiveModelFrame();
    shield.style.setProperty('transition',`transform ${shieldDuration}ms cubic-bezier(.22,.66,.24,1)`,'important');
    stage.classList.remove('is-learning-shield-closed');
    stage.classList.add('is-learning-shield-open');
  };

  const waitForShield = () => new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      shield.removeEventListener('transitionend',onTransitionEnd);
      resolve();
    };
    const onTransitionEnd = (event) => {
      if (event.target === shield && event.propertyName === 'transform') finish();
    };
    shield.addEventListener('transitionend',onTransitionEnd);
    window.setTimeout(finish,shieldDuration + 120);
  });

  const smoothBackToChoices = () => new Promise((resolve) => {
    const scroller = document.scrollingElement || document.documentElement;
    const start = Math.max(window.scrollY || 0,scroller.scrollTop || 0);
    const destination = 0;
    const distance = destination - start;
    const duration = reducedMotion ? 1 : Math.min(1750,Math.max(1100,900 + Math.abs(distance) * .28));
    const started = performance.now();
    const rootBehavior = document.documentElement.style.getPropertyValue('scroll-behavior');
    const rootPriority = document.documentElement.style.getPropertyPriority('scroll-behavior');
    const bodyBehavior = document.body.style.getPropertyValue('scroll-behavior');
    const bodyPriority = document.body.style.getPropertyPriority('scroll-behavior');

    document.documentElement.style.setProperty('scroll-behavior','auto','important');
    document.body.style.setProperty('scroll-behavior','auto','important');
    const ease = (value) => value < .5
      ? 4 * value * value * value
      : 1 - Math.pow(-2 * value + 2,3) / 2;

    const restore = () => {
      if (rootBehavior) document.documentElement.style.setProperty('scroll-behavior',rootBehavior,rootPriority);
      else document.documentElement.style.removeProperty('scroll-behavior');
      if (bodyBehavior) document.body.style.setProperty('scroll-behavior',bodyBehavior,bodyPriority);
      else document.body.style.removeProperty('scroll-behavior');
    };

    const finish = () => {
      window.scrollTo(0,destination);
      scrollFrame = 0;
      restore();
      resolve();
    };

    if (Math.abs(distance) < 2) {
      finish();
      return;
    }

    const step = (now) => {
      const progress = Math.min(1,Math.max(0,(now - started) / duration));
      window.scrollTo(0,start + distance * ease(progress));
      if (progress < 1) scrollFrame = requestAnimationFrame(step);
      else scrollFrame = requestAnimationFrame(finish);
    };
    scrollFrame = requestAnimationFrame(step);
  });

  window.__ahPrepareLearningStageShieldRound516 = () => {
    returning = false;
    if (scrollFrame) cancelAnimationFrame(scrollFrame);
    scrollFrame = 0;
    ensureActiveModelFrame();
    closeShield();
  };

  window.addEventListener('ah:model-stage-scroll-complete',(event) => {
    if (event.detail?.page !== 'learning' || event.detail?.stage !== '#learning-model-stage') return;
    openShield();
  });

  /* Round 602: round510-model-scroll.js now owns the return sequence for both
     Learning Center and Who We Help. Keep this legacy fallback only if that
     shared controller did not initialize. */
  if (!window.__ahSharedModelReturnRound602) {
    returnButton.addEventListener('click',async () => {
      if (returning) return;
      returning = true;
      returnButton.disabled = true;
      if (status) status.textContent = 'Closing the lesson and returning to the lesson choices.';
      const shieldWasOpen = stage.classList.contains('is-learning-shield-open');
      closeShield();
      if (shieldWasOpen) await waitForShield();
      await smoothBackToChoices();
      window.__ahSetModelStageLockedRound558?.(true);
      try {
        history.replaceState(history.state,'',window.location.pathname + window.location.search);
      } catch (error) {}
      lessonChoices.querySelector('[data-learning-model]')?.focus({ preventScroll:true });
      if (status) status.textContent = 'Choose AI 101, Practical AI, or Strategy Lab.';
      returnButton.disabled = false;
      returning = false;
    });
  }

  closeShield();
})();

;
/* Round 804 — authoritative Learning Center return controller.
   Mirrors the proven Who We Help Round 719 return sequence:
   1) raise the local shield completely at the same 2000ms/easing used on reveal,
   2) only then smoothly return the real main viewport to the top,
   3) remove/lock the lesson stage again until another lesson is selected. */
(() => {
  'use strict';

  if (document.body?.dataset?.page !== 'learning') return;

  const stage = document.querySelector('#learning-model-stage');
  const shield = stage?.querySelector('[data-learning-stage-shield]');
  const returnButton = stage?.querySelector('[data-learning-choose-another]');
  const mainScroller = document.querySelector('main#main-content');
  const lessonChoices = document.querySelector('#learning-route-buttons');
  const cardSelector = '#learning-route-buttons .learning-medallion-button';
  const status = stage?.querySelector('[data-learning-carousel-status]');
  const body = document.body;
  if (!stage || !shield || !returnButton || !mainScroller || !lessonChoices || !body) return;

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
    body.classList.remove('ah-learning-return-hard-locked');
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
    body.classList.add('ah-learning-return-hard-locked');
    mainScroller.style.setProperty('overflow-y', 'hidden', 'important');
    mainScroller.style.setProperty('overscroll-behavior-y', 'none', 'important');
    mainScroller.style.setProperty('touch-action', 'none', 'important');
    hardLocked = true;
  };

  /* Release before the existing lesson controller measures/scrolls the stage. */
  window.addEventListener('pointerdown', (event) => {
    if (!(event.target instanceof Element)) return;
    if (event.target.closest(cardSelector)) releaseHardLock();
  }, true);

  /* Keyboard activation has no pointerdown. The shared model-stage lock class is
     the authoritative signal that a new lesson selection has reopened the stage. */
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
    body.classList.add('ah-learning-returning-round804');
    releaseHardLock();
    if (status) status.textContent = 'Closing the lesson shield and returning to the lesson choices.';

    try {
      /* Exact Who We Help sequence: shield first, then smooth main-scroll return. */
      await raiseShield();
      await smoothMainToTop();

      if (typeof window.__ahSetModelStageLockedRound558 === 'function') {
        window.__ahSetModelStageLockedRound558(true);
      } else {
        body.classList.add('ah-model-stage-locked');
        document.documentElement.classList.add('ah-learning-choice-locked');
        stage.classList.add('is-model-stage-locked');
        stage.style.setProperty('display', 'none', 'important');
      }
      await twoFrames();
      writeTop(0);
      engageHardLock();

      try {
        history.replaceState(history.state, '', window.location.pathname + window.location.search);
      } catch (error) {}

      lessonChoices.querySelector('[data-learning-model]')?.focus({ preventScroll: true });
      if (status) status.textContent = 'Choose AI 101, Practical AI, or Strategy Lab.';
    } finally {
      returnButton.disabled = false;
      body.classList.remove('ah-learning-returning-round804');
      returning = false;
    }
  };

  /* Window capture runs before the older shared/legacy button listeners. */
  window.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    if (!event.target.closest('[data-learning-choose-another]')) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    runReturn();
  }, true);
})();

;
/* Round 813 — deterministic Learning Center ticker. */
(() => {
  'use strict';
  if (document.body?.dataset?.page !== 'learning') return;
  const track = document.querySelector('#learning-charity-ticker .learning-marquee__track');
  if (!track) return;

  const messages = [
    [{text:'With the right information, you can predict the future.',tone:'green'}],
    [{text:'10%',tone:'green'},{text:'Back to Local Charities',tone:'pink'}],
    [{text:'Prioritizing',tone:'pink'},{text:'Job-Retention',tone:'green'}],
    [{text:'Automation with a',tone:'green'},{text:'human touch.',tone:'pink'}],
    [{text:'Elevating the human',tone:'green'},{text:', not obsoleting them.',tone:'pink',joined:true}]
  ];
  const makeCopy = (parts) => {
    const copy = document.createElement('span');
    copy.className = 'learning-marquee__copy';
    parts.forEach((part,index) => {
      const span = document.createElement('span');
      span.className = `learning-marquee__segment learning-marquee__segment--${part.tone}`;
      if (index && !part.joined) span.classList.add('learning-marquee__segment--spaced');
      span.textContent = part.text;
      copy.append(span);
    });
    return copy;
  };
  const makePerson = () => {
    const separator = document.createElement('span');
    separator.className = 'learning-marquee__separator';
    separator.setAttribute('aria-hidden','true');
    separator.innerHTML = '<svg class="learning-marquee__person" viewBox="0 0 18 30" focusable="false" aria-hidden="true"><circle cx="9" cy="5" r="3.2"></circle><path d="M9 8.5V18 M9 11.5L3.3 15.3 M9 11.5L14.7 15.3 M9 18L4.7 27 M9 18L13.3 27"></path></svg>';
    return separator;
  };
  const makeLoop = () => {
    const loop = document.createElement('span');
    loop.className = 'learning-marquee__loop';
    messages.forEach((parts) => loop.append(makeCopy(parts),makePerson()));
    return loop;
  };
  track.replaceChildren(makeLoop(),makeLoop());
})();
