/* Automated Hearts Round 1156 — true persistent shell router.
   The outer rim / heart / page screen / message control / footer hardware stay
   mounted in the top document. Primary page content is double-buffered in a
   same-origin iframe and swapped only after the destination has fully loaded,
   eliminating the black full-document flash on desktop and mobile. */
(() => {
  'use strict';

  /* Round 1182: this router is the sole persistent-page authority. Prevent the
     older bundled router from mounting a second page iframe underneath it. */
  window.__AH_DISABLE_PERSISTENT_ROUTER = true;
  window.__AH_PERSISTENT_SHELL_1182 = true;
  window.__AH_PERSISTENT_SHELL_1184 = true;
  window.__AH_PERSISTENT_SHELL_1218 = true;
  window.__AH_PERSISTENT_SHELL_1220 = true;
  window.__AH_PERSISTENT_SHELL_1234 = true;
  window.__AH_PERSISTENT_SHELL_1235 = true;

  const qs = new URLSearchParams(location.search);
  const embedded = qs.get('ah_embed') === '1' && window.self !== window.top;
  const basename = (value) => {
    try {
      const u = new URL(value, location.href);
      return (u.pathname.split('/').pop() || 'index.html').toLowerCase();
    } catch (_) { return ''; }
  };

  const aliasToKey = new Map([
    ['index.html','home'], ['desktop-home.html','home'], ['mobile-home.html','home'],
    ['solutions.html','solutions'], ['mobile-solutions.html','solutions'],
    ['who-we-help.html','who-we-help'], ['mobile-who-we-help.html','who-we-help'],
    ['learning-center.html','learning'], ['mobile-learning-center.html','learning'],
    ['about.html','about'], ['mobile-about.html','about'], ['policies.html','about'],
    ['pricing.html','pricing'], ['mobile-pricing.html','pricing']
  ]);

  const pages = {
    home: {
      title:'Hub', desktop:'desktop-home.html', mobile:'index.html',
      desktopFooter:'Hub', mobileFooter:'Hub', mobileMessage:'Automation with a human touch.',
      shieldQuote:'Automation with a Human touch.'
    },
    solutions: {
      title:'The Solution', desktop:'solutions.html', mobile:'mobile-solutions.html',
      desktopFooter:'The Solution', mobileFooter:'Solution', mobileMessage:'Negative-Software Solution',
      shieldQuote:'Negative-Software Solution. Logic, not Size.'
    },
    'who-we-help': {
      title:'Who We Help', mobileTitle:'Industries', desktop:'who-we-help.html', mobile:'mobile-who-we-help.html',
      desktopFooter:'Industries', mobileFooter:'Industries', mobileMessage:'Thinking outside of the box begins Now.',
      shieldQuote:'Thinking outside of the box begins Now.'
    },
    learning: {
      title:'Learning Center', desktop:'learning-center.html', mobile:'mobile-learning-center.html',
      desktopFooter:'Learning Center', mobileFooter:'Learning', mobileMessage:'Help others learn too.',
      shieldQuote:'With the right information, you can predict the future.'
    },
    about: {
      title:'About Us', desktop:'about.html', mobile:'mobile-about.html',
      desktopFooter:'About Us', mobileFooter:'About Us', mobileMessage:'Prioritizing Job-Retention',
      shieldQuote:'Prioritizing Job-Retention.'
    },
    pricing: {
      title:'Rates & Services', desktop:'pricing.html', mobile:'mobile-pricing.html',
      desktopFooter:'Rates & Services', mobileFooter:'Services', mobileMessage:'Premium Customization',
      shieldQuote:'Fully Customized to your layout.'
    }
  };

  const keyFromHref = (href) => aliasToKey.get(basename(href)) || null;

  /* Embedded page: render content only and ask the persistent parent shell to
     handle all primary navigation. This also streams mobile scroll progress to
     the parent's fixed page-name screen. */
  if (embedded) {
    document.documentElement.classList.add('ah-shell-embedded');
    document.documentElement.classList.add('ah-embedded-page');

    const askParentToNavigate = (href) => {
      let url;
      try { url = new URL(href, window.location.href); } catch (_) { return false; }
      const key = keyFromHref(url.href);
      if (!key || !pages[key]) return false;
      parent.postMessage({type:'ah:shell-route', href:url.href}, '*');
      return true;
    };
    window.__ahPersistentNavigate = askParentToNavigate;
    window.__ahShellNavigate = askParentToNavigate;

    addEventListener('message', (event) => {
      const data = event.data || {};
      if (data.type !== 'ah:shell-anchor' || typeof data.hash !== 'string') return;
      let el = null;
      try {
        const id = decodeURIComponent(data.hash.replace(/^#/,''));
        el = document.getElementById(id) || document.querySelector(data.hash);
      } catch (_) {}
      if (el) el.scrollIntoView({behavior:'smooth', block:'start'});
    });

    document.addEventListener('click', (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const node = event.target;
      const link = node && typeof node.closest === 'function' ? node.closest('a[href]') : null;
      if (!link || link.hasAttribute('download')) return;

      if (link.hasAttribute('data-contact-trigger') || link.hasAttribute('data-ah-contact')) {
        event.preventDefault();
        event.stopImmediatePropagation();
        parent.postMessage({type:'ah:shell-contact'}, '*');
        return;
      }

      const key = keyFromHref(link.href);
      if (!key) return;
      let url;
      try { url = new URL(link.href, location.href); } catch (_) { return; }
      const currentKey = keyFromHref(location.href);
      if (key === currentKey && url.hash && basename(url.href) === basename(location.href)) return; // preserve true same-document anchors
      event.preventDefault();
      event.stopImmediatePropagation();
      parent.postMessage({type:'ah:shell-route', href:url.href}, '*');
    }, true);

    /* Round 1218: embedded desktop pages scroll main#main-content rather than
       the iframe document. Measure BOTH surfaces and report the one that is
       actually moving so the fixed colored page-progress field never freezes
       after a persistent-shell route. */
    let progressRaf = 0;
    const contentScroller = document.querySelector('main#main-content');
    const progressFor = (surface, documentSurface = false) => {
      if (!surface) return 0;
      const client = Number(surface.clientHeight || 0);
      const maximum = Math.max(0, Number(surface.scrollHeight || 0) - client);
      if (maximum <= 0) return 0;
      const top = documentSurface
        ? Math.max(Number(scrollY || 0), Number(surface.scrollTop || 0), Number(document.body?.scrollTop || 0))
        : Number(surface.scrollTop || 0);
      return Math.max(0, Math.min(1, top / maximum));
    };
    const sendProgress = () => {
      progressRaf = 0;
      const root = document.scrollingElement || document.documentElement;
      const value = Math.max(
        progressFor(contentScroller, false),
        progressFor(root, true)
      );
      parent.postMessage({type:'ah:shell-progress', value}, '*');
    };
    const queueProgress = () => {
      if (!progressRaf) progressRaf = requestAnimationFrame(sendProgress);
    };
    contentScroller?.addEventListener('scroll', queueProgress, {passive:true});
    addEventListener('scroll', queueProgress, {passive:true});
    document.addEventListener('scroll', queueProgress, {passive:true, capture:true});
    addEventListener('resize', queueProgress, {passive:true});
    addEventListener('load', queueProgress, {once:true});
    addEventListener('pageshow', queueProgress, {passive:true});
    if ('ResizeObserver' in window) {
      const ro = new ResizeObserver(queueProgress);
      ro.observe(document.documentElement);
      if (document.body) ro.observe(document.body);
      if (contentScroller) ro.observe(contentScroller);
    }
    queueProgress();
    return;
  }

  const isMobile = matchMedia('(max-width:900px)').matches || basename(location.href).startsWith('mobile-') || qs.get('mobile') === '1';
  let currentKey = keyFromHref(location.href) || (isMobile ? 'home' : null);
  if (!currentKey || !pages[currentKey]) return;

  let currentFrame = null;
  let pendingFrame = null;
  let routeToken = 0;
  let initialMainRetired = false;
  let shieldPanel = null;
  let shieldMotion = null;
  let navigationTimeout = 0;
  const shieldStyle=document.createElement('style');
  shieldStyle.textContent=`
    #ah-route-shield{position:fixed;z-index:2147483200;inset:var(--current-frame-top,96px) var(--current-frame-side,88px) var(--current-frame-bottom,96px);overflow:hidden;border-radius:var(--current-frame-radius,32px);pointer-events:none}
    #ah-route-shield[hidden]{display:none}
    #ah-route-shield-panel{position:absolute;inset:0;height:100%;width:100%;box-sizing:border-box;overflow:hidden;border:2px solid rgba(214,178,87,.94);border-radius:inherit;background:#08172b url('./assets/page-shield-smoked-heart.webp') center/cover no-repeat;background-clip:padding-box;box-shadow:inset 0 0 0 2px rgba(31,19,3,.96),inset 0 0 0 4px rgba(232,202,126,.30),inset 0 0 10px rgba(216,176,76,.24),inset 0 0 0 5px rgba(255,239,194,.16);transform:translateY(-101%);will-change:transform}
    #ah-route-shield-quote{position:absolute;z-index:2;left:50%;top:50%;transform:translate(-50%,-50%);width:min(74%,980px);margin:0;text-align:center;color:#f1f7f4;font-family:Orbitron,"Orbitron",system-ui,sans-serif;font-size:clamp(22px,2.15vw,42px);font-weight:600;line-height:1.35;letter-spacing:.035em;text-wrap:balance;text-shadow:0 2px 2px rgba(0,0,0,.96),0 0 10px rgba(0,0,0,.88),0 0 16px rgba(143,255,215,.22);pointer-events:none}#ah-route-shield-quote[hidden]{display:none}#ah-route-shield-quote .ah-shield-pink{color:#ff2ea8;-webkit-text-fill-color:#ff2ea8;text-shadow:0 0 8px rgba(255,46,168,.34),0 2px 2px rgba(0,0,0,.96)}#ah-route-shield-quote .ah-shield-green{color:#8fffd7;-webkit-text-fill-color:#8fffd7;text-shadow:0 0 8px rgba(143,255,215,.30),0 2px 2px rgba(0,0,0,.96)}
    @media(max-width:900px){#ah-route-shield{inset:72px 10px calc(74px + env(safe-area-inset-bottom,0px));border-radius:18px}#ah-route-shield-panel{border:1.5px solid rgba(214,178,87,.90);border-radius:18px;box-shadow:inset 0 0 0 2px rgba(24,12,2,.94),inset 0 0 0 3px rgba(255,238,186,.18),inset 0 0 8px rgba(214,178,87,.18)}#ah-route-shield-quote{width:min(82%,560px);font-size:clamp(17px,5.4vw,28px);line-height:1.42;letter-spacing:.02em}}
  `;
  document.head.appendChild(shieldStyle);
  const escapeShieldText=(value)=>String(value).replace(/[&<>"']/g,(ch)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const shieldQuoteMarkup=(value)=>{
    const clean=String(value||'').trim();
    const exact={
      'Automation with a Human touch.':'<span class="ah-shield-pink">Automation</span> with a <span class="ah-shield-green">Human</span> touch.',
      'Negative-Software Solution. Logic, not Size.':'<span class="ah-shield-pink">Negative-Software</span> Solution. <span class="ah-shield-green">Logic</span>, not <span class="ah-shield-pink">Size</span>.',
      'Thinking outside of the box begins Now.':'Thinking <span class="ah-shield-green">outside of the box</span> begins <span class="ah-shield-pink">Now</span>.',
      'With the right information, you can predict the future.':'With the <span class="ah-shield-green">right information</span>, you can <span class="ah-shield-pink">predict the future</span>.',
      'Prioritizing Job-Retention.':'<span class="ah-shield-pink">Prioritizing</span> <span class="ah-shield-green">Job-Retention</span>.',
      'Fully Customized to your layout.':'<span class="ah-shield-pink">Fully Customized</span> to <span class="ah-shield-green">your layout</span>.'
    };
    return exact[clean]||escapeShieldText(clean);
  };
  const moveShield=async(covered, quoteText)=>{
    if(!shieldPanel){
      const shield=document.createElement('div');
      shield.id='ah-route-shield';
      shield.setAttribute('aria-hidden','true');
      shieldPanel=document.createElement('div');
      shieldPanel.id='ah-route-shield-panel';
      const quote=document.createElement('div');
      quote.id='ah-route-shield-quote';
      quote.setAttribute('aria-hidden','true');
      quote.hidden=true;
      shieldPanel.appendChild(quote);
      shield.appendChild(shieldPanel);
      document.body.appendChild(shield);
    }
    // Restore layout before sampling the transform: a display:none ancestor
    // makes percentage transforms unreliable on the second and later routes.
    shieldPanel.parentElement.hidden=false;
    if (typeof quoteText === 'string') {
      const quote = shieldPanel.querySelector('#ah-route-shield-quote');
      if (quote) {
        const clean = quoteText.trim();
        quote.innerHTML = clean ? `“${shieldQuoteMarkup(clean)}”` : '';
        quote.hidden = !clean;
      }
    }
    const from=getComputedStyle(shieldPanel).transform;
    shieldMotion?.cancel();
    const to=covered?'translateY(0)':'translateY(-101%)';
    if (typeof shieldPanel.animate === 'function') {
      shieldPanel.style.transform=to;
      const motion=shieldPanel.animate([{transform:from},{transform:to}],{
        duration:2000,
        easing:'cubic-bezier(.45,0,.55,1)'
      });
      shieldMotion=motion;
      try{await motion.finished;}catch(_){}
    } else {
      // Keep navigation functional on engines without Web Animations.
      shieldPanel.style.transition='none';
      shieldPanel.style.transform=from;
      void shieldPanel.offsetHeight;
      shieldPanel.style.transition='transform 2000ms cubic-bezier(.45,0,.55,1)';
      shieldPanel.style.transform=to;
      await new Promise(resolve=>setTimeout(resolve,2000));
    }

  };

  const contentFrameStyle = (frame) => {
    frame.className = 'ah-shell-content-frame';
    frame.setAttribute('aria-label', 'Automated Hearts page content');
    frame.setAttribute('title', 'Automated Hearts page content');
    frame.setAttribute('allow', 'fullscreen');
    frame.style.setProperty('position','fixed','important');
    frame.style.setProperty('inset','0','important');
    frame.style.setProperty('width','100%','important');
    frame.style.setProperty('height','100%','important');
    frame.style.setProperty('margin','0','important');
    frame.style.setProperty('padding','0','important');
    frame.style.setProperty('border','0','important');
    frame.style.setProperty('background','transparent','important');
    frame.style.setProperty('z-index','1000','important');
    frame.style.setProperty('opacity','0','important');
    frame.style.setProperty('visibility','hidden','important');
    frame.style.setProperty('pointer-events','none','important');
    return frame;
  };

  const shellPageTitle = () => {
    if (isMobile) return document.querySelector('body > .page-chip');
    return document.querySelector('body > .rim-page-name-screen .footer-page-led, body > .rim-page-name-screen .header-page-led');
  };

  const setProgress = (value) => {
    const p = Math.max(0, Math.min(1, Number(value) || 0));
    const percent = `${(p * 100).toFixed(2)}%`;
    const rounded = String(Math.round(p * 100));

    if (isMobile) {
      const chip = shellPageTitle();
      if (!chip) return;
      chip.style.setProperty('--ah-page-scroll-percent', percent);
      chip.setAttribute('data-scroll-percent', rounded);
      return;
    }

    /* Round 1184: desktop uses the same progress value as mobile, but paints
       it through the existing desktop rim-page-name-screen treatment. The
       prior persistent router returned early on desktop, so progress stopped
       after the first persistent-shell navigation. */
    const sign = document.querySelector(
      'body > .rim-page-name-screen.footer-page-screen.header-page-screen--top'
    );
    if (!sign) return;
    sign.style.setProperty('--page-sign-scroll-progress', p.toFixed(4));
    sign.style.setProperty('--page-sign-scroll-percent', percent);
    sign.dataset.scrollProgress = p.toFixed(4);
    sign.setAttribute('data-scroll-percent', rounded);
  };

  const pageHref = (key) => {
    const info = pages[key];
    if (!info) return '#';
    const file = isMobile ? info.mobile : info.desktop;
    const u = new URL(file, location.href);
    /* Round 1250: version mobile content documents as well as their CSS so the
       persistent iframe cannot reuse an older page shell after a visual round. */
    if (isMobile) u.searchParams.set('v','1263r');
    if (isMobile && key === 'home') u.searchParams.set('mobile','1');
    return u.href;
  };

  const labelFor = (key) => {
    const info = pages[key];
    return info ? (isMobile ? info.mobileFooter : info.desktopFooter) : '';
  };

  const identifyFooterButtons = () => {
    const buttons = isMobile
      ? Array.from(document.querySelectorAll('body > nav.footer a[href]'))
      : Array.from(document.querySelectorAll('body > footer#site-footer a[data-nav], body > footer#site-footer a[href]'));
    for (const button of buttons) {
      if (!button.dataset.nav) {
        const key = keyFromHref(button.href);
        if (key) button.dataset.nav = key;
      }
    }
    return buttons;
  };

  const setButton = (button, key) => {
    if (!button || !pages[key]) return;
    button.dataset.nav = key;
    button.href = pageHref(key);
    button.removeAttribute('aria-current');
    button.classList.remove('is-current-page');
    button.style.removeProperty('display');
    const label = labelFor(key);
    const nested = button.querySelector('.footer-nav-label');
    if (nested) nested.textContent = label;
    else button.textContent = label;
    button.setAttribute('aria-label', label);
  };

  const updateShell = (nextKey, previousKey) => {
    const info = pages[nextKey];
    const title = shellPageTitle();
    const displayTitle = (isMobile && info.mobileTitle) ? info.mobileTitle : info.title;
    if (title) {
      title.textContent = displayTitle;
      title.setAttribute('data-text', displayTitle);
      title.setAttribute('aria-label', displayTitle);
      const holder = title.closest('.rim-page-name-screen');
      if (holder) holder.setAttribute('aria-label', `Current page: ${displayTitle}`);
    }
    document.title = `Automated Hearts — ${displayTitle}`;
    if (isMobile) {
      const ticker = document.querySelector('body > .ticker');
      if (ticker) {
        const message = info.mobileMessage || '';
        ticker.replaceChildren();
        if (nextKey === 'who-we-help' && /Now\./.test(message)) {
          ticker.append(document.createTextNode(message.replace(/Now\.$/,'')));
          const now = document.createElement('span');
          now.className = 'pink';
          now.textContent = 'Now';
          ticker.append(now, document.createTextNode('.'));
        } else {
          ticker.textContent = message;
        }
      }
    }
    setProgress(0);

    const buttons = identifyFooterButtons();
    if (previousKey && previousKey !== nextKey) {
      const destinationButton = buttons.find((b) => b.dataset.nav === nextKey);
      if (destinationButton) setButton(destinationButton, previousKey);
    }
    /* Defensive guarantee: there is never a visible button for the live page.
       If an unusual direct-load footer has one, repurpose it to any missing key. */
    const liveButton = buttons.find((b) => b.dataset.nav === nextKey);
    if (liveButton) {
      const represented = new Set(buttons.map((b) => b.dataset.nav));
      const missing = Object.keys(pages).find((key) => key !== nextKey && !represented.has(key));
      if (missing) setButton(liveButton, missing);
    }
  };

  const retireInitialContent = () => {
    if (initialMainRetired) return;
    initialMainRetired = true;
    const main = document.querySelector('body > main#main-content');
    if (!main) return;
    main.querySelectorAll('video').forEach((video) => { try { video.pause(); } catch (_) {} });
    main.querySelectorAll('iframe').forEach((frame) => {
      try { frame.removeAttribute('src'); frame.setAttribute('src','about:blank'); } catch (_) {}
    });
    main.style.setProperty('display','none','important');
    main.style.setProperty('visibility','hidden','important');
    main.style.setProperty('pointer-events','none','important');
  };

  const normalizeTarget = (href) => {
    let supplied;
    try { supplied = new URL(href, location.href); } catch (_) { return null; }
    if (supplied.origin !== location.origin && location.protocol !== 'file:') return null;
    const key = keyFromHref(supplied.href);
    if (!key || !pages[key]) return null;
    const target = new URL(pageHref(key));
    target.hash = supplied.hash || '';
    target.searchParams.set('ah_embed','1');
    target.searchParams.set('ah_shell','1156');
    if (isMobile && key === 'home') target.searchParams.set('mobile','1');
    return {key, target, historyUrl:supplied};
  };

  const revealLoadedFrame = (frame) => {
    frame.style.setProperty('visibility','visible','important');
    frame.style.setProperty('opacity','1','important');
    frame.style.setProperty('pointer-events','auto','important');
  };

  const hideFrame = (frame) => {
    if (!frame) return;
    frame.style.setProperty('visibility','hidden','important');
    frame.style.setProperty('opacity','0','important');
    frame.style.setProperty('pointer-events','none','important');
  };

  const navigate = (href, options = {}) => {
    const normalized = normalizeTarget(href);
    if (!normalized) return false;
    const {key:nextKey, target, historyUrl} = normalized;
    const token = ++routeToken;
    clearTimeout(navigationTimeout);
    const shieldQuote = nextKey === 'home' ? 'Automation with a Human touch.' : (pages[nextKey].shieldQuote || '');
    const covered=moveShield(true, shieldQuote);

    if (pendingFrame) {
      pendingFrame.remove();
      pendingFrame = null;
    }

    const frame = contentFrameStyle(document.createElement('iframe'));
    pendingFrame = frame;
    frame.dataset.ahRouteKey = nextKey;
    document.body.appendChild(frame);

    let completed = false;
    const finish = async () => {
      await covered;
      // Paint the fully closed shield before swapping the loaded page.
      await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
      if (completed || token !== routeToken || pendingFrame !== frame) return;
      completed = true;
      clearTimeout(navigationTimeout);
      const previousKey = currentKey;
      updateShell(nextKey, previousKey);
      try { window.scrollTo(0,0); } catch (_) {}
      retireInitialContent();

      const oldFrame = currentFrame;
      revealLoadedFrame(frame);
      currentFrame = frame;
      pendingFrame = null;
      if (oldFrame && oldFrame !== frame) {
        hideFrame(oldFrame);
        setTimeout(() => oldFrame.remove(), 60);
      }
      currentKey = nextKey;

      if (options.push !== false) {
        try {
          const clean = new URL(historyUrl.href);
          clean.searchParams.delete('ah_embed');
          clean.searchParams.delete('ah_shell');
          if (isMobile && nextKey === 'home') clean.searchParams.set('mobile','1');
          history.pushState({ahShell:true,key:nextKey}, '', clean.href);
        } catch (_) {}
      }
      await moveShield(false);
      if(token!==routeToken)return;
      shieldPanel.parentElement.hidden=true;
      window.dispatchEvent(new CustomEvent('ah:persistent-route-complete', {detail:{page:nextKey}}));
    };

    frame.addEventListener('load', () => {
      if (token !== routeToken) return;
      /* about:blank can emit an initial load in some engines. */
      try {
        const loaded = new URL(frame.contentWindow.location.href);
        if (loaded.href === 'about:blank') return;
      } catch (_) {}
      requestAnimationFrame(() => requestAnimationFrame(finish));
    });
    frame.src = target.href;
    navigationTimeout=setTimeout(async()=>{
      if(token!==routeToken||completed)return;
      completed=true;
      frame.remove();
      pendingFrame=null;
      await moveShield(false);
      if(token!==routeToken)return;
      shieldPanel.parentElement.hidden=true;
      window.dispatchEvent(new CustomEvent('ah:persistent-route-complete'));
    },15000);
    return true;
  };

  window.__ahShellNavigate = (href) => navigate(href, {push:true});
  window.__ahPersistentNavigate = window.__ahShellNavigate;

  // Round 1201: on the dedicated mobile shell, complete footer navigation from
  // a clean pointerup instead of depending exclusively on the synthesized click.
  // This avoids dropped taps after repeated touch interactions while still
  // rejecting scroll gestures and preserving click/keyboard fallback behavior.
  let mobileTap = null;
  let suppressClickUntil = 0;
  let suppressClickHref = '';
  if (isMobile) {
    document.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) return;
      const node = event.target;
      const link = node && typeof node.closest === 'function' ? node.closest('body > nav.footer a[href]') : null;
      if (!link) { mobileTap = null; return; }
      const rect = link.getBoundingClientRect();
      mobileTap = {
        id:event.pointerId,
        link,
        x:event.clientX,
        y:event.clientY,
        t:performance.now(),
        left:rect.left - 10,
        right:rect.right + 10,
        top:rect.top - 10,
        bottom:rect.bottom + 10
      };
    }, true);

    document.addEventListener('pointerup', (event) => {
      const tap = mobileTap;
      mobileTap = null;
      if (!tap || event.pointerId !== tap.id) return;
      const dx = event.clientX - tap.x;
      const dy = event.clientY - tap.y;
      if ((dx * dx + dy * dy) > 196 || (performance.now() - tap.t) > 900) return;
      const node = document.elementFromPoint(event.clientX, event.clientY);
      const releaseLink = node && typeof node.closest === 'function' ? node.closest('body > nav.footer a[href]') : null;
      const insideOriginalButton = event.clientX >= tap.left && event.clientX <= tap.right &&
        event.clientY >= tap.top && event.clientY <= tap.bottom;
      // The physical press animation moves the button down by 5px before
      // pointerup. Accept the original hit rectangle so the animation itself
      // can never make a valid tap miss. Still reject release over a different
      // footer button.
      if (releaseLink && releaseLink !== tap.link) return;
      if (!releaseLink && !insideOriginalButton) return;
      const key = keyFromHref(tap.link.href);
      if (!key || !pages[key]) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      suppressClickHref = tap.link.href;
      suppressClickUntil = performance.now() + 800;
      tap.link.classList.remove('is-pressed','is-nav-pressed','is-route-pressed');
      tap.link.removeAttribute('data-ah-control-pressed');
      tap.link.removeAttribute('data-ah-footer-loading');
      tap.link.setAttribute('aria-pressed','false');
      document.documentElement.classList.remove('ah-footer-navigation-loading');
      navigate(tap.link.href, {push:true});
    }, true);

    document.addEventListener('pointermove', (event) => {
      const tap = mobileTap;
      if (!tap || event.pointerId !== tap.id) return;
      const dx = event.clientX - tap.x;
      const dy = event.clientY - tap.y;
      if ((dx * dx + dy * dy) > 196) mobileTap = null;
    }, {passive:true, capture:true});
    document.addEventListener('pointercancel', () => { mobileTap = null; }, true);
    // Do not cancel a footer tap merely because momentum/programmatic scrolling
    // emits a scroll event while the finger is down. Pointer movement above is
    // the reliable gesture discriminator.
  }

  document.addEventListener('click', (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const node = event.target;
    const link = node && typeof node.closest === 'function' ? node.closest('a[href]') : null;
    if (!link || link.hasAttribute('download') || link.hasAttribute('data-contact-trigger') || link.hasAttribute('data-ah-contact')) return;
    if (isMobile && performance.now() < suppressClickUntil && link.href === suppressClickHref) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    const key = keyFromHref(link.href);
    if (!key) return;
    let url;
    try { url = new URL(link.href, location.href); } catch (_) { return; }
    if (key === currentKey && url.hash) {
      if (currentFrame) {
        try { currentFrame.contentWindow.postMessage({type:'ah:shell-anchor', hash:url.hash}, '*'); } catch (_) {}
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }
      let localAnchor = null;
      try {
        const id = decodeURIComponent(url.hash.replace(/^#/,''));
        localAnchor = document.getElementById(id) || document.querySelector(url.hash);
      } catch (_) {}
      if (localAnchor) {
        event.preventDefault();
        event.stopImmediatePropagation();
        localAnchor.scrollIntoView({behavior:'smooth', block:'start'});
        return;
      }
    }
    event.preventDefault();
    event.stopImmediatePropagation();
    navigate(url.href, {push:true});
  }, true);

  addEventListener('message', (event) => {
    const data = event.data || {};
    const fromActive = currentFrame && event.source === currentFrame.contentWindow;
    const fromPending = pendingFrame && event.source === pendingFrame.contentWindow;
    if (!fromActive && !fromPending) return;
    if ((data.type === 'ah:shell-route' || data.type === 'ah:persistent-route') && typeof data.href === 'string') {
      navigate(data.href, {push:true});
    } else if (data.type === 'ah:shell-contact' || data.type === 'ah:persistent-contact') {
      const contact = document.querySelector('body > [data-contact-trigger], body > #header-send-message, body > .message');
      if (contact) contact.click();
    } else if (data.type === 'ah:shell-progress' && fromActive) {
      setProgress(data.value);
    }
  });


  addEventListener('popstate', () => {
    const key = keyFromHref(location.href);
    if (!key || key === currentKey) return;
    navigate(location.href, {push:false});
  });

  identifyFooterButtons();
  updateShell(currentKey, null);
  document.documentElement.classList.add('ah-shell-router-ready');
})();
