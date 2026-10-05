/* Keep pricing text colors on the glyphs, including legacy inline text-fill passes. */
(()=>{'use strict';
 const left='.ah-pricing-tower--automation,[data-pricing-column="automation"]';
 const heads='.ah-pricing-tower-title,.section-title,.ah-pricing-card-title,.ah-pricing-retainer-heading>strong,.ah-pricing-retainer--mobile>strong';
 const set=(el,color)=>{for(const p of ['color','-webkit-text-fill-color'])if(el.style.getPropertyValue(p)!==color||el.style.getPropertyPriority(p)!=='important')el.style.setProperty(p,color,'important');};
 const apply=()=>{
  document.querySelectorAll(left).forEach(col=>col.querySelectorAll(heads).forEach(h=>{set(h,'rgb(255, 46, 168)');h.querySelectorAll('*').forEach(el=>set(el,'rgb(255, 46, 168)'));}));
  document.querySelectorAll('.ah-pricing-bullets,.ah-pricing-bullets *').forEach(el=>set(el,'rgb(255, 255, 255)'));
 };
 const start=()=>{apply();let queued=false;new MutationObserver(()=>{if(queued)return;queued=true;queueMicrotask(()=>{queued=false;apply();});}).observe(document.body||document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['style']});};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
