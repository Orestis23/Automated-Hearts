/* Automated Hearts Round 1454 — final accent authority. */
(()=>{
  'use strict';
  const DESKTOP_FOOTER='./assets/footer-button-message-border-match-clean-round1454.svg?v=1454r';
  const DESKTOP_MESSAGE='./assets/message-button-square-footer-match-round1095.svg?v=1585r';
  const MOBILE_BASE='./assets/mobile-footer-key-navy-clean-round1454.svg?v=1639r';
  const MOBILE_MINT='./assets/mobile-footer-accent-mint-round1454.svg?v=1454r';
  const MOBILE_PINK='./assets/mobile-footer-accent-pink-round1454.svg?v=1454r';
  const imp=(el,p,v)=>{if(el)el.style.setProperty(p,v,'important');};
  const hideOld=(scope)=>scope?.querySelectorAll?.('.ah-footer-pink-corners,.ah1451-message-match-accents,.ah1452-message-corner-overlay,.ah1453-message-corner-overlay')?.forEach(el=>{
    imp(el,'display','none');imp(el,'visibility','hidden');imp(el,'opacity','0');imp(el,'background-image','none');
  });
  const desktop=()=>{
    if(!matchMedia('(min-width:801px)').matches)return;
    /* Round 1586: do not rewrite desktop outer-rim hardware.
       The carbon footer/message authorities own those faces and accents. */
    const msg=document.querySelector('body > a#header-send-message');
    if(msg)hideOld(msg);
  };
  const mobile=()=>{
    if(!matchMedia('(max-width:900px)').matches)return;
    /* Round 1571: retired mobile accent writer; Round 1520 + 1571 own the live mobile shell. */
    return;
    document.querySelectorAll('body > nav.footer > a[href]').forEach((btn,i)=>{
      hideOld(btn);imp(btn,'position','relative');imp(btn,'background-image',`url("${MOBILE_BASE}")`);imp(btn,'background-size','100% 100%');imp(btn,'background-position','center');imp(btn,'background-repeat','no-repeat');
      let ov=btn.querySelector(':scope > .ah1454-mobile-corner-overlay');
      if(!ov){ov=document.createElement('span');ov.className='ah1454-mobile-corner-overlay';ov.setAttribute('aria-hidden','true');btn.appendChild(ov);}
      const url=(i%2===0)?MOBILE_MINT:MOBILE_PINK;
      imp(ov,'position','absolute');imp(ov,'z-index','96');imp(ov,'inset','0');imp(ov,'display','block');imp(ov,'visibility','visible');imp(ov,'opacity','1');imp(ov,'overflow','hidden');imp(ov,'pointer-events','none');imp(ov,'background-color','transparent');imp(ov,'background-image',`url("${url}")`);imp(ov,'background-position','center');imp(ov,'background-size','100% 100%');imp(ov,'background-repeat','no-repeat');imp(ov,'filter','none');
    });
  };
  const apply=()=>{desktop();mobile();};
  let raf=0;const queue=()=>{if(raf)return;raf=requestAnimationFrame(()=>{raf=0;apply();});};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
  addEventListener('load',apply,{once:true});addEventListener('pageshow',apply);addEventListener('resize',queue,{passive:true});addEventListener('ah:persistent-route-complete',queue);
  const mo=new MutationObserver(queue);mo.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style','data-page']});
})();
