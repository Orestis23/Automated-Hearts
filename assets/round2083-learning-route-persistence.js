/* Round 2083 — runtime lock for Good Information route labels after model transitions. */
(()=>{'use strict';
  if(window.__AH2083_LEARNING_ROUTE_LOCK__)return;
  window.__AH2083_LEARNING_ROUTE_LOCK__=true;
  const mq=matchMedia('(max-width:900px)');
  const imp=(el,p,v)=>{if(el)el.style.setProperty(p,v,'important')};
  const labels=()=>document.querySelectorAll('body[data-ah-mobile-surface="learning"] main#main-content .route-card[data-lite-learning] > .route-label .footer-nav-label');
  function lock(){
    if(!mq.matches)return;
    if(!window.__AH2084_BUTTON_LABEL_AUTHORITY__)labels().forEach(el=>{
      imp(el,'display','grid');imp(el,'place-items','center');imp(el,'width','100%');imp(el,'height','auto');
      imp(el,'margin','0');imp(el,'padding','0 4px');imp(el,'font-family','"Orbitron",system-ui,sans-serif');
      imp(el,'font-size','28px');imp(el,'font-weight','900');imp(el,'font-style','normal');imp(el,'line-height','1.02');
      imp(el,'letter-spacing','0');imp(el,'white-space','normal');imp(el,'text-align','center');
      imp(el,'color','#8fffd7');imp(el,'-webkit-text-fill-color','transparent');imp(el,'-webkit-text-stroke','0 transparent');
      imp(el,'background-color','transparent');
      imp(el,'background-image','radial-gradient(circle at 1.12px 1.12px,currentColor 0 .94px,transparent 1.08px)');
      imp(el,'background-size','2.7px 2.7px');imp(el,'background-position','0 0');imp(el,'background-repeat','repeat');
      imp(el,'-webkit-background-clip','text');imp(el,'background-clip','text');
      imp(el,'-webkit-mask','none');imp(el,'mask','none');imp(el,'-webkit-mask-image','none');imp(el,'mask-image','none');
      imp(el,'text-shadow','none');imp(el,'filter','none');imp(el,'-webkit-filter','none');imp(el,'opacity','1');imp(el,'visibility','visible');imp(el,'transform','none');
    });
    document.querySelectorAll('body[data-ah-mobile-surface="learning"] main#main-content .route-card[data-lite-learning] > .route-media').forEach(media=>{
      imp(media,'padding','8px');imp(media,'aspect-ratio','1 / 1');imp(media,'height','auto');imp(media,'overflow','hidden');imp(media,'border-radius','50%');
      const img=media.querySelector('img');
      if(img){imp(img,'width','100%');imp(img,'height','100%');imp(img,'object-fit','contain');imp(img,'object-position','center center');imp(img,'transform','none');imp(img,'clip-path','none');}
    });
  }
  let raf=0;
  const queue=()=>{if(raf)return;raf=requestAnimationFrame(()=>{raf=0;lock()})};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',lock,{once:true});else lock();
  addEventListener('load',lock,{once:true});addEventListener('pageshow',lock,{passive:true});addEventListener('resize',queue,{passive:true});
  document.addEventListener('ah:persistent-route-complete',queue);
  document.addEventListener('automated-hearts:stage-transition-end',()=>{lock();setTimeout(lock,40);setTimeout(lock,180);});
  document.addEventListener('click',e=>{if(e.target.closest('#learning-choose-another,.route-label[data-lite-learning]')){queue();setTimeout(lock,60);setTimeout(lock,240);}},true);
  new MutationObserver(queue).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:window.__AH2084_BUTTON_LABEL_AUTHORITY__?['class','data-ah-model-half','data-ah-stage-transition']:['class','style','data-ah-model-half','data-ah-stage-transition']});
})();
