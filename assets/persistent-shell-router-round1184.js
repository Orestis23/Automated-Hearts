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
      desktopFooter:'Hub', mobileFooter:'Hub', mobileMessage:'10% to local charities.'
    },
    solutions: {
      title:'The Solution', desktop:'solutions.html', mobile:'mobile-solutions.html',
      desktopFooter:'The Solution', mobileFooter:'Solution', mobileMessage:'Negative-Software Solution'
    },
    'who-we-help': {
      title:'Who We Help', desktop:'who-we-help.html', mobile:'mobile-who-we-help.html',
      desktopFooter:'Who We Help', mobileFooter:'Industries', mobileMessage:'Thinking outside of the box begins, Now.'
    },
    learning: {
      title:'Learning Center', desktop:'learning-center.html', mobile:'mobile-learning-center.html',
      desktopFooter:'Learning Center', mobileFooter:'Learning', mobileMessage:'Help others learn too.'
    },
    about: {
      title:'About Us', desktop:'about.html', mobile:'mobile-about.html',
      desktopFooter:'About Us', mobileFooter:'About Us', mobileMessage:'Prioritizing Job-Retention'
    },
    pricing: {
      title:'Rates & Services', desktop:'pricing.html', mobile:'mobile-pricing.html',
      desktopFooter:'Rates & Services', mobileFooter:'Services', mobileMessage:'Premium Customization'
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

    let progressRaf = 0;
    const sendProgress = () => {
      progressRaf = 0;
      const root = document.scrollingElement || document.documentElement;
      const view = innerHeight || root.clientHeight || 0;
      const max = Math.max(0, (root.scrollHeight || 0) - view);
      const y = Math.max(0, scrollY || root.scrollTop || 0);
      const value = max > 0 ? Math.min(1, y / max) : 0;
      parent.postMessage({type:'ah:shell-progress', value}, '*');
    };
    const queueProgress = () => {
      if (!progressRaf) progressRaf = requestAnimationFrame(sendProgress);
    };
    addEventListener('scroll', queueProgress, {passive:true});
    addEventListener('resize', queueProgress, {passive:true});
    addEventListener('load', queueProgress, {once:true});
    if ('ResizeObserver' in window) {
      const ro = new ResizeObserver(queueProgress);
      ro.observe(document.documentElement);
      if (document.body) ro.observe(document.body);
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
    if (title) {
      title.textContent = info.title;
      title.setAttribute('data-text', info.title);
      title.setAttribute('aria-label', info.title);
      const holder = title.closest('.rim-page-name-screen');
      if (holder) holder.setAttribute('aria-label', `Current page: ${info.title}`);
    }
    document.title = `Automated Hearts — ${info.title}`;
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

    if (pendingFrame) {
      pendingFrame.remove();
      pendingFrame = null;
    }

    const frame = contentFrameStyle(document.createElement('iframe'));
    pendingFrame = frame;
    frame.dataset.ahRouteKey = nextKey;
    document.body.appendChild(frame);

    let completed = false;
    const finish = () => {
      if (completed || token !== routeToken || pendingFrame !== frame) return;
      completed = true;
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
    return true;
  };

  window.__ahShellNavigate = (href) => navigate(href, {push:true});
  window.__ahPersistentNavigate = window.__ahShellNavigate;

  document.addEventListener('click', (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const node = event.target;
    const link = node && typeof node.closest === 'function' ? node.closest('a[href]') : null;
    if (!link || link.hasAttribute('download') || link.hasAttribute('data-contact-trigger') || link.hasAttribute('data-ah-contact')) return;
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
