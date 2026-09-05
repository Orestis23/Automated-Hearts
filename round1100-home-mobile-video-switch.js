/* Automated Hearts Round 1100 — do not download Home WebGL/card iframes on phones. */
(() => {
  'use strict';
  const mq = matchMedia('(max-width:760px)');
  const configs = [
    {
      iframe: 'home-machine-primary',
      video: 'home-machine-primary-video',
      desktopSrc: './home-machine-five-stage-engine-round1066.html?v=1100r',
      mobileSrc: './assets/home-machine-orbit-mobile-round1100.mp4'
    },
    {
      iframe: 'home-machine-rolodex',
      video: 'home-machine-rolodex-video',
      desktopSrc: './heart-to-heart-digital-rolodex-round1094.html?v=1100r',
      mobileSrc: './assets/home-rolodex-scroll-mobile-round1100.mp4'
    }
  ];

  const startVideo = (video, src) => {
    if (!video) return;
    if (video.dataset.activeSrc !== src) {
      video.dataset.activeSrc = src;
      video.src = src;
      video.preload = 'auto';
      video.load();
    }
    const play = () => video.play().catch(() => {});
    if (video.readyState >= 2) play();
    else video.addEventListener('canplay', play, {once:true});
  };

  const stopVideo = (video) => {
    if (!video) return;
    video.pause();
    video.removeAttribute('src');
    delete video.dataset.activeSrc;
    video.preload = 'none';
    video.load();
  };

  const useMobile = () => {
    configs.forEach(({iframe,video,mobileSrc}) => {
      const frame = document.getElementById(iframe);
      if (frame) {
        frame.removeAttribute('src');
        frame.removeAttribute('data-src');
        frame.setAttribute('loading','lazy');
        frame.setAttribute('aria-hidden','true');
        frame.tabIndex = -1;
      }
      startVideo(document.getElementById(video), mobileSrc);
    });
    document.documentElement.dataset.homeMobileVideo = '1';
  };

  const useDesktop = () => {
    configs.forEach(({iframe,video,desktopSrc}) => {
      stopVideo(document.getElementById(video));
      const frame = document.getElementById(iframe);
      if (frame && frame.getAttribute('src') !== desktopSrc) frame.setAttribute('src',desktopSrc);
      if (frame) {
        frame.setAttribute('loading','eager');
        frame.removeAttribute('aria-hidden');
        frame.removeAttribute('tabindex');
      }
    });
    delete document.documentElement.dataset.homeMobileVideo;
  };

  const apply = () => mq.matches ? useMobile() : useDesktop();
  apply();
  if (mq.addEventListener) mq.addEventListener('change', apply);
  else mq.addListener(apply);

  document.addEventListener('visibilitychange', () => {
    if (!mq.matches) return;
    configs.forEach(({video}) => {
      const el=document.getElementById(video);
      if (!el) return;
      if (document.hidden) el.pause();
      else el.play().catch(() => {});
    });
  }, {passive:true});
})();
