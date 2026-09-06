(()=>{
  'use strict';
  const DESKTOP='(min-width:801px)';
  function addLip(el){
    if(!el || el.querySelector(':scope > .r1180-desktop-pink-lip')) return;
    const lip=document.createElement('span');
    lip.className='r1180-desktop-pink-lip';
    lip.setAttribute('aria-hidden','true');
    el.appendChild(lip);
  }
  function install(){
    if(!window.matchMedia(DESKTOP).matches) return;
    document.querySelectorAll('footer#site-footer #primary-nav a.footer-structure-control.mechanical-send-control[data-nav]').forEach(addLip);
    addLip(document.querySelector('a#header-send-message.header-send-message.mechanical-send-control'));
    addLip(document.querySelector('#negative-software-explore'));
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
  window.addEventListener('resize',install,{passive:true});
  /* Persistent-shell route swaps can replace inner content while keeping the shell. */
  window.addEventListener('ah:persistent-route-ready',install);
  window.addEventListener('ah:route-ready',install);
})();
