/* Automated Hearts Round 1102 — tap-to-open / tap-to-load mobile machine windows.
   On phones neither MP4 has a src until its shutter is opened. Only one decoder is
   active at a time. Desktop keeps the existing interactive iframe behavior. */
(() => {
  'use strict';

  const mq = matchMedia('(max-width:760px)');
  const MOVE_MS = 720;
  const configs = [
    {
      frameClass: 'home-hero-engine-frame',
      template: 'home-machine-primary-template',
      iframe: 'home-machine-primary',
      video: 'home-machine-primary-video',
      mobileSrc: './assets/home-machine-orbit-mobile-round1101.mp4',
      desktopSrc: './home-machine-five-stage-engine-round1115.html?v=1116r'
    },
    {
      frameClass: 'home-hero-rolodex-frame',
      template: 'home-machine-rolodex-template',
      iframe: 'home-machine-rolodex',
      video: 'home-machine-rolodex-video',
      mobileSrc: './assets/home-rolodex-scroll-mobile-round1101.mp4',
      desktopSrc: './heart-to-heart-digital-rolodex-round1094.html?v=1115r'
    }
  ];

  const grid = document.getElementById('home-machine-grid');
  if (!grid) return;

  const sanitizeMobileShutters = () => {
    if (!mq.matches) return;
    grid.querySelectorAll(':scope > .home-hero-engine-frame > [data-machine-haze]').forEach((shutter) => {
      ['display','visibility','opacity','pointer-events','transition','will-change','transform','-webkit-transform'].forEach((prop) => shutter.style.removeProperty(prop));
    });
  };

  const frameFor = (config) => {
    const tpl = document.getElementById(config.template);
    return tpl?.parentElement || grid.querySelector(`:scope > .${config.frameClass}`);
  };

  const configForFrame = (frame) => configs.find((c) => frameFor(c) === frame);

  const removeDesktopFrame = (config) => {
    const frame = document.getElementById(config.iframe);
    if (!frame) return;
    try { frame.src = 'about:blank'; } catch (_) {}
    frame.remove();
  };

  const mountDesktopFrame = (config) => {
    if (document.getElementById(config.iframe)) return;
    const tpl = document.getElementById(config.template);
    const host = frameFor(config);
    if (!tpl || !host) return;
    const fragment = tpl.content.cloneNode(true);
    const iframe = fragment.querySelector(`#${CSS.escape(config.iframe)}`);
    if (!iframe) return;
    iframe.setAttribute('src', config.desktopSrc);
    host.insertBefore(fragment, host.firstChild);
  };

  const videoFor = (config) => document.getElementById(config.video);

  const markFirstFrame = (video) => {
    if (!video || video.classList.contains('is-video-ready')) return;
    const ready = () => video.classList.add('is-video-ready');
    if ('requestVideoFrameCallback' in video) video.requestVideoFrameCallback(ready);
    else if (video.readyState >= 2) requestAnimationFrame(ready);
    else video.addEventListener('loadeddata', () => requestAnimationFrame(ready), {once:true, passive:true});
  };

  const loadAndPlay = (config) => {
    const video = videoFor(config);
    if (!video || !mq.matches) return;
    video.controls = false;
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.loop = true;
    video.disablePictureInPicture = true;
    video.preload = 'metadata';
    video.setAttribute('playsinline','');
    video.setAttribute('webkit-playsinline','');
    video.setAttribute('muted','');
    video.setAttribute('loop','');
    video.setAttribute('disablepictureinpicture','');
    if (video.dataset.activeSrc !== config.mobileSrc) {
      video.classList.remove('is-video-ready');
      video.dataset.activeSrc = config.mobileSrc;
      video.src = config.mobileSrc;
      video.load();
    }
    markFirstFrame(video);
    const play = () => {
      if (!frameFor(config)?.classList.contains('is-haze-open')) return;
      const p = video.play();
      if (p?.catch) p.catch(() => {});
    };
    if (video.readyState >= 2) play();
    else video.addEventListener('canplay', play, {once:true, passive:true});
  };

  const unloadVideo = (config, delay = 0) => {
    const video = videoFor(config);
    if (!video) return;
    video.pause();
    video.classList.remove('is-video-ready');
    const clear = () => {
      if (frameFor(config)?.classList.contains('is-haze-open')) return;
      video.removeAttribute('src');
      delete video.dataset.activeSrc;
      video.preload = 'none';
      try { video.load(); } catch (_) {}
    };
    if (delay) setTimeout(clear, delay);
    else clear();
  };

  const setMoving = (frame) => {
    frame.classList.add('is-haze-moving');
    clearTimeout(frame.__ah1102MoveTimer);
    frame.__ah1102MoveTimer = setTimeout(() => frame.classList.remove('is-haze-moving'), MOVE_MS + 80);
  };

  const setOpen = (frame, open) => {
    if (!frame) return;
    const config = configForFrame(frame);
    const shutter = frame.querySelector('[data-machine-haze]');
    setMoving(frame);
    frame.classList.toggle('is-haze-open', !!open);
    frame.classList.remove('is-haze-closing');
    shutter?.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (config) {
      if (open) {
        /* Let the transform begin first; then wake the decoder. */
        setTimeout(() => loadAndPlay(config), 90);
      } else {
        unloadVideo(config, MOVE_MS + 120);
      }
    }
  };

  const activateMobile = () => {
    document.documentElement.dataset.homeMobileVideo = 'tap';
    for (const config of configs) {
      removeDesktopFrame(config);
      unloadVideo(config);
      const frame = frameFor(config);
      frame?.classList.remove('is-haze-open','is-haze-closing','is-haze-moving');
      frame?.querySelector('[data-machine-haze]')?.setAttribute('aria-expanded','false');
    }
  };

  const activateDesktop = () => {
    delete document.documentElement.dataset.homeMobileVideo;
    for (const config of configs) {
      unloadVideo(config);
      frameFor(config)?.classList.remove('is-haze-open','is-haze-closing','is-haze-moving');
      mountDesktopFrame(config);
    }
  };

  /* Register before the older recovery controller and own Home machine taps on mobile. */
  document.addEventListener('click', (event) => {
    if (!mq.matches || !(event.target instanceof Element)) return;
    const shutter = event.target.closest('[data-machine-haze]');
    if (!shutter || !grid.contains(shutter)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const target = shutter.closest('.home-hero-engine-frame');
    if (!target) return;
    const opening = !target.classList.contains('is-haze-open');
    if (opening) {
      grid.querySelectorAll(':scope > .home-hero-engine-frame.is-haze-open').forEach((other) => {
        if (other !== target) setOpen(other, false);
      });
    }
    setOpen(target, opening);
  }, true);

  const apply = () => {
    if (mq.matches) { activateMobile(); sanitizeMobileShutters(); }
    else activateDesktop();
  };
  apply();
  /* Older deferred recovery code executes after this file and writes inline !important
     shutter styles. Clear those once all deferred scripts have finished so Round 1102's
     lightweight mobile CSS remains authoritative. */
  document.addEventListener('DOMContentLoaded', () => { sanitizeMobileShutters(); requestAnimationFrame(() => requestAnimationFrame(sanitizeMobileShutters)); }, {once:true});
  window.addEventListener('pageshow', () => { if (mq.matches) setTimeout(sanitizeMobileShutters, 0); }, {passive:true});
  if (mq.addEventListener) mq.addEventListener('change', apply);
  else mq.addListener(apply);

  document.addEventListener('visibilitychange', () => {
    if (!mq.matches) return;
    for (const config of configs) {
      const video = videoFor(config);
      const frame = frameFor(config);
      if (!video) continue;
      if (document.hidden) video.pause();
      else if (frame?.classList.contains('is-haze-open') && video.dataset.activeSrc) {
        markFirstFrame(video);
        const p = video.play();
        if (p?.catch) p.catch(() => {});
      }
    }
  }, {passive:true});
})();
