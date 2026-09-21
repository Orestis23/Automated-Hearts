/* Automated Hearts Round 1636 — Home page-name progress structure.
   Separate pigment from inverse text so the matte film remains visually continuous. */
(()=>{'use strict';
  if(window.__ahRound1636PageProgress)return;
  window.__ahRound1636PageProgress=1;
  const install=()=>{
    const body=document.body;
    if(!body || body.dataset.page!=='home') return false;
    const sign=document.querySelector('body > .rim-page-name-screen.footer-page-screen.header-page-screen--top');
    if(!sign) return false;
    const label=sign.querySelector(':scope > .footer-page-led, :scope > .header-page-led');
    const inverse=sign.querySelector(':scope > .page-sign-progress-inverse');
    if(!label || !inverse) return false;

    let fill=sign.querySelector(':scope > .ah1636-page-progress-fill');
    if(!fill){
      fill=document.createElement('span');
      fill.className='ah1636-page-progress-fill';
      fill.setAttribute('aria-hidden','true');
      const matte=sign.querySelector(':scope > .r488-extra-matte-film');
      if(matte) sign.insertBefore(fill,matte); else sign.insertBefore(fill,sign.firstChild);
    }

    let text=inverse.querySelector(':scope > .ah1636-page-progress-text');
    if(!text){
      text=document.createElement('span');
      text.className='ah1636-page-progress-text';
      text.setAttribute('aria-hidden','true');
      inverse.replaceChildren(text);
    }
    text.textContent=(label.textContent||'Hub').trim()||'Hub';
    return true;
  };

  if(install()) return;
  const observer=new MutationObserver(()=>{if(install()) observer.disconnect();});
  observer.observe(document.documentElement,{childList:true,subtree:true});
  addEventListener('DOMContentLoaded',install,{once:true});
  addEventListener('load',install,{once:true});
  addEventListener('ah:persistent-route-complete',()=>{setTimeout(install,0)});
})();
