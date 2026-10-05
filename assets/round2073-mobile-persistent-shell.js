/* Round 2073 — persistent mobile shell guard.
   Keeps the original outer-shell DOM mounted while the persistent router swaps
   only inner viewport content. Route labels may change; their visual treatment does not. */
(()=>{'use strict';
  if(window.__AH2073_MOBILE_SHELL__)return;
  if(!matchMedia('(max-width:900px)').matches)return;
  if(window.self!==window.top||new URLSearchParams(location.search).get('ah_embed')==='1')return;
  window.__AH2073_MOBILE_SHELL__=true;

  const titleByKey={home:'Hub',solution:'The Solution',industries:'Industries','good-information':'Good Information',services:'Services','privacy-policy':'Privacy'};
  const keyFromPath=(value)=>{let p='';try{p=new URL(value,location.href).pathname.toLowerCase()}catch(_){p=String(value||'').toLowerCase()}
    if(/(?:^|\/)index\.html$|\/$/.test(p))return'home';
    if(p.endsWith('/the-solution.html'))return'solution';
    if(p.endsWith('/industries.html'))return'industries';
    if(p.endsWith('/good-information.html'))return'good-information';
    if(p.endsWith('/services.html'))return'services';
    if(p.endsWith('/privacy-policy.html'))return'privacy-policy';
    return'';
  };

  let shell={chip:null,message:null,footer:null};
  const capture=()=>{
    const body=document.body;if(!body)return;
    body.dataset.ahShellPersistent='2073';
    shell.chip ||= document.querySelector('body > .page-chip');
    shell.message ||= document.querySelector('body > a.message');
    shell.footer ||= document.querySelector('body > nav.footer');
    [shell.chip,shell.message,shell.footer].forEach(node=>{if(node)node.dataset.ahShellHardware='2073';});
  };

  const restoreIfDetached=()=>{
    capture();
    const body=document.body;if(!body)return;
    /* The route system should never replace the hardware. If a legacy handler
       detaches it, put the exact same node back instead of accepting a new copy. */
    if(shell.chip&&!shell.chip.isConnected)body.prepend(shell.chip);
    if(shell.message&&!shell.message.isConnected)body.appendChild(shell.message);
    if(shell.footer&&!shell.footer.isConnected)body.appendChild(shell.footer);
  };

  const start=()=>{
    capture();
    new MutationObserver(()=>queueMicrotask(restoreIfDetached)).observe(document.body||document.documentElement,{childList:true});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();

  addEventListener('ah:persistent-route-complete',(event)=>{
    restoreIfDetached();
    const key=event?.detail?.page||keyFromPath(location.href);
    const chip=shell.chip||document.querySelector('body > .page-chip');
    if(chip&&titleByKey[key]){
      const title=titleByKey[key];
      chip.textContent=title;
      chip.dataset.text=title;
      chip.setAttribute('aria-label',title);
    }
  });
  addEventListener('pageshow',restoreIfDetached,{passive:true});
})();
