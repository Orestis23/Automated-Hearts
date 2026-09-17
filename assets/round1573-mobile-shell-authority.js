(()=>{
  'use strict';
  const mq=matchMedia('(max-width:900px)');
  const isAbout=(a)=>{
    if(!a)return false;
    if((a.dataset.nav||'').toLowerCase()==='about')return true;
    if((a.getAttribute('aria-label')||'').trim().toLowerCase()==='about us')return true;
    try{return /(?:^|\/)(?:mobile-)?about\.html$/i.test(new URL(a.href,location.href).pathname);}catch(_){return false;}
  };
  const imp=(el,p,v)=>{ if(el && el.style.getPropertyValue(p)!==v) el.style.setProperty(p,v,'important'); };
  const applyFooter=()=>{
    if(!mq.matches)return;
    const footer=document.querySelector('body > nav.footer');
    if(!footer)return;
    footer.querySelectorAll(':scope > a[href]').forEach(a=>{if(isAbout(a))a.remove();});
    const buttons=[...footer.querySelectorAll(':scope > a[href]')];
    footer.style.setProperty('--ah1573-footer-count',String(Math.max(1,buttons.length)));
    imp(footer,'left','0'); imp(footer,'right','0'); imp(footer,'width','100vw'); imp(footer,'min-width','100vw'); imp(footer,'max-width','100vw');
    imp(footer,'margin','0'); imp(footer,'padding-left','0'); imp(footer,'padding-right','0');
    imp(footer,'display','grid'); imp(footer,'grid-template-columns',`repeat(${Math.max(1,buttons.length)},minmax(0,1fr))`); imp(footer,'gap','0');
    buttons.forEach((a,i)=>{
      const label=a.querySelector('.footer-nav-label');
      imp(label,'font-size','clamp(10.8px,3.1vw,15px)');
      imp(label,'line-height','1.08');
      imp(a,'display','flex'); imp(a,'width','auto'); imp(a,'min-width','0'); imp(a,'max-width','none');
      imp(a,'margin','0'); imp(a,'align-self','stretch'); imp(a,'justify-self','stretch'); imp(a,'box-sizing','border-box');
      const accent=(i%2===0)?'mobile-footer-accent-mint-round1520.svg':'mobile-footer-accent-pink-round1520.svg';
      imp(a,'background-image',`url("./assets/${accent}?v=1573r"), url("./assets/mobile-footer-key-navy-clean-round1454.svg?v=1573r")`);
      imp(a,'background-size','100% 100%, 100% 100%'); imp(a,'background-position','center, center'); imp(a,'background-repeat','no-repeat, no-repeat');
      a.querySelectorAll(':scope > .ah-footer-pink-corners,:scope > .ah1451-message-match-accents,:scope > .ah1452-message-corner-overlay,:scope > .ah1453-message-corner-overlay,:scope > .ah1454-mobile-corner-overlay,:scope > .ah1520-mobile-rim-overlay').forEach(n=>{
        imp(n,'display','none'); imp(n,'visibility','hidden'); imp(n,'opacity','0');
      });
    });
  };
  const applyMessage=()=>{
    if(!mq.matches)return;
    const msg=document.querySelector('body > a.message[data-contact-trigger]');
    if(!msg)return;
    imp(msg,'top','calc(env(safe-area-inset-top,0px) + 6px)'); imp(msg,'right','6px'); imp(msg,'left','auto');
    imp(msg,'width','56px'); imp(msg,'min-width','56px'); imp(msg,'max-width','56px'); imp(msg,'height','56px'); imp(msg,'min-height','56px'); imp(msg,'max-height','56px');
    imp(msg,'margin','0'); imp(msg,'padding','0'); imp(msg,'border','0'); imp(msg,'border-image','none'); imp(msg,'border-radius','0'); imp(msg,'box-shadow','none');
    imp(msg,'background-image','url("./assets/mobile-message-accent-red-round1571.svg?v=1573r"), url("./assets/mobile-message-key-clean-round1568.svg?v=1573r")');
    imp(msg,'background-size','100% 100%, 100% 100%'); imp(msg,'background-position','center, center'); imp(msg,'background-repeat','no-repeat, no-repeat');
    msg.querySelectorAll(':scope > .ah1452-message-corner-overlay,:scope > .ah1453-message-corner-overlay,:scope > .ah1454-mobile-corner-overlay,:scope > .ah1568-mobile-message-rim-overlay,:scope > .ah1571-mobile-message-rim-overlay').forEach(n=>{
      imp(n,'display','none'); imp(n,'visibility','hidden'); imp(n,'opacity','0');
    });
    const svg=msg.querySelector(':scope > svg');
    if(svg){
      imp(svg,'position','absolute'); imp(svg,'z-index','5'); imp(svg,'left','50%'); imp(svg,'top','44.444444%'); imp(svg,'width','42%'); imp(svg,'height','28.875%'); imp(svg,'bottom','auto'); imp(svg,'right','auto'); imp(svg,'translate','none'); imp(svg,'margin','0'); imp(svg,'padding','0');
      imp(svg,'transform','translate(-50%,-50%)'); imp(svg,'transform-origin','center center'); imp(svg,'color','#ff3030'); imp(svg,'stroke','#ff3030');
      svg.querySelectorAll('path,polyline,line').forEach(n=>imp(n,'stroke','#ff3030'));
    }
  };
  const apply=()=>{applyFooter();applyMessage();};
  let raf=0;
  const queue=()=>{if(raf)return;raf=requestAnimationFrame(()=>{raf=0;apply();});};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true}); else apply();
  addEventListener('load',apply,{once:true}); addEventListener('pageshow',apply); addEventListener('resize',queue,{passive:true});
  addEventListener('ah:persistent-route-complete',queue);
  new MutationObserver(queue).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['href','data-nav','aria-label']});
})();
