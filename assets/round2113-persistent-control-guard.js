/* Automated Hearts Round 2113 — one-shot persistent control guard.
   No observers. Reasserts only essential visibility/surface state after page/route lifecycle events. */
(()=>{'use strict';
  const imp=(el,p,v)=>{if(el)el.style.setProperty(p,v,'important')};
  const key='./assets/footer-button-carbon-inner-rim-round1586.svg';
  const apply=()=>{
    const b=document.body;if(!b)return;
    if(window.self!==window.top&&new URLSearchParams(location.search).get('ah_embed')==='1')return;
    const mobile=!!b.dataset.ahMobileSurface;
    const progress=document.getElementById('ah-page-progress');
    if(progress){
      imp(progress,'z-index','2147483647');imp(progress,'display','flex');imp(progress,'visibility','visible');imp(progress,'opacity','1');
      imp(progress,'background-color','#07111b');imp(progress,'clip-path','none');imp(progress,'-webkit-clip-path','none');imp(progress,'mask','none');imp(progress,'-webkit-mask','none');
    }
    if(mobile){
      const footer=document.getElementById('ah-mobile-footer');
      if(footer){imp(footer,'z-index','2147483647');imp(footer,'display','grid');imp(footer,'visibility','visible');imp(footer,'opacity','1');imp(footer,'transform','none');
        footer.querySelectorAll(':scope>a[href]').forEach(a=>{imp(a,'display','flex');imp(a,'visibility','visible');imp(a,'opacity','1');});
      }
      const msg=document.getElementById('ah-mobile-message');if(msg){imp(msg,'z-index','2147483647');imp(msg,'display','grid');imp(msg,'visibility','visible');imp(msg,'opacity','1');}
    }else{
      const footer=document.getElementById('site-footer');
      if(footer){imp(footer,'z-index','2147483647');imp(footer,'display','block');imp(footer,'visibility','visible');imp(footer,'opacity','1');
        footer.querySelectorAll('#primary-nav a[data-nav]').forEach(a=>{imp(a,'display','flex');imp(a,'visibility','visible');imp(a,'opacity','1');});
      }
      const msg=document.getElementById('header-send-message');if(msg){imp(msg,'z-index','2147483647');imp(msg,'display','grid');imp(msg,'visibility','visible');imp(msg,'opacity','1');}
    }
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
  addEventListener('pageshow',apply,{passive:true});
  addEventListener('ah:persistent-route-complete',apply,{passive:true});
})();
