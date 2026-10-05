/* Round 2074 — shell hardware node lock for desktop + mobile. */
(()=>{'use strict';
 if(window.__AH2074_SHELL_LOCK__)return;
 if(window.self!==window.top||new URLSearchParams(location.search).get('ah_embed')==='1')return;
 window.__AH2074_SHELL_LOCK__=true;
 const mobile=matchMedia('(max-width:900px)').matches;
 const selectors=mobile
  ? ['body > .page-chip','body > a.message','body > nav.footer']
  : ['body > .ah-persistent-outer-rim','body > .ah-persistent-gold-rim','body > .rim-heart-emblem','body > .rim-page-name-screen','body > #header-send-message','body > #home-ticker-wrap','body > #site-footer'];
 const nodes=new Map();
 const capture=()=>{for(const s of selectors){if(!nodes.has(s)){const n=document.querySelector(s);if(n){nodes.set(s,n);n.dataset.ahShellHardware='2074';}}}};
 const restore=()=>{capture();const b=document.body;if(!b)return;for(const [s,n] of nodes){if(n.isConnected)continue;if(s.includes('site-footer')||s.includes('nav.footer')||s.includes('home-ticker-wrap'))b.appendChild(n);else b.insertBefore(n,b.firstChild);}};
 const start=()=>{document.documentElement.classList.add('ah2074-shell-locked');capture();new MutationObserver(()=>queueMicrotask(restore)).observe(document.body||document.documentElement,{childList:true});restore();};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
 addEventListener('pageshow',restore,{passive:true});addEventListener('ah:persistent-route-complete',restore,{passive:true});
})();
