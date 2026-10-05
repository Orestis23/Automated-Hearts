/* Round 2106 — Privacy/About scroll rescue without viewport resize enforcement. */
(()=>{'use strict';
 const body=document.body;if(!body||body.dataset.page!=='about')return;const main=document.getElementById('main-content');if(!main)return;
 const set=(p,v)=>main.style.setProperty(p,v,'important');
 function enforce(){set('position','fixed');set('width','auto');set('min-width','0');set('max-width','none');set('height','auto');set('min-height','0');set('max-height','none');set('overflow-x','hidden');set('overflow-y','auto');set('overscroll-behavior-y','auto');set('touch-action','pan-y pinch-zoom');set('-webkit-overflow-scrolling','touch');set('pointer-events','auto');set('contain','none')}
 enforce();addEventListener('pageshow',enforce,{passive:true});document.addEventListener('ah:persistent-route-complete',enforce);document.addEventListener('visibilitychange',()=>{if(!document.hidden)enforce()},{passive:true});
 const policy=document.getElementById('policies');if(policy)policy.addEventListener('toggle',()=>{enforce();if(policy.open)requestAnimationFrame(()=>policy.querySelector(':scope>summary')?.scrollIntoView({block:'nearest',behavior:'auto'}))});
})();
