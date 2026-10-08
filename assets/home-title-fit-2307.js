(()=>{'use strict';
const selector='#home-title-fields .r1362-home-title-text,.title-stack .lcd-text';
let scheduled=false;
function fit(){
 const quote=document.querySelector('.ah1759-definition-band');
 if(quote&&quote.style.getPropertyValue('padding-top')!=='0px')quote.style.setProperty('padding-top','0px','important');
 const main=document.querySelector('main#main-content'),ticker=document.querySelector('#home-charity-ticker');
 const carousel=document.querySelector('#home-overview-section,section[aria-label="Humans and AI working together"]');
 if(main&&carousel){
  let clearance;
  if(ticker&&ticker.getBoundingClientRect().height)clearance=ticker.getBoundingClientRect().height+1;
  else {
   const clip=getComputedStyle(main).clipPath.match(/inset\(\s*[\d.]+px\s+[\d.]+px\s+([\d.]+)px/);
   clearance=clip?Number(clip[1]):88;
   const sign=carousel.querySelector('.ahi-sign');
   if(sign)clearance=Math.max(0,clearance-parseFloat(getComputedStyle(carousel).paddingBottom)+parseFloat(getComputedStyle(sign).marginBottom));
  }
  const padding=clearance+'px';
  if(main.style.getPropertyValue('padding-bottom')!==padding)main.style.setProperty('padding-bottom',padding,'important');
 }
 const texts=[...document.querySelectorAll(selector)];if(!texts.length)return;
 let size=innerWidth>900?28.8:Math.min(28.8,innerWidth*.0594);
 for(const text of texts){
  const field=text.parentElement,c=getComputedStyle(field),style=getComputedStyle(text),r=field.getBoundingClientRect();
  if(!r.width||!r.height)continue;
  const width=r.width-parseFloat(c.borderLeftWidth)-parseFloat(c.borderRightWidth)-Math.max(8,parseFloat(c.paddingLeft))-Math.max(8,parseFloat(c.paddingRight));
  const height=r.height-parseFloat(c.borderTopWidth)-parseFloat(c.borderBottomWidth)-Math.max(4,parseFloat(c.paddingTop))-Math.max(4,parseFloat(c.paddingBottom));
  const range=document.createRange();range.selectNodeContents(text);const ink=range.getBoundingClientRect();
  const current=parseFloat(style.fontSize);
  if(ink.width>0)size=Math.min(size,current*Math.max(0,width-2)/ink.width,height/1.12);
 }
 const value=Math.max(1,Math.floor(size*100)/100)+'px';
 for(const text of texts)if(text.style.getPropertyValue('--ah-title-fit')!==value)text.style.setProperty('--ah-title-fit',value);
}
function queue(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;fit();});}
window.AHFitHomeTitles=fit;
function init(){fit();const observer=new ResizeObserver(fit);document.querySelectorAll('#home-title-fields>.r1362-home-title-field,.title-stack>.lcd').forEach(field=>observer.observe(field));document.querySelectorAll('#home-title-fields,.title-stack').forEach(group=>new MutationObserver(queue).observe(group,{childList:true,subtree:true}));}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
addEventListener('resize',fit,{passive:true});addEventListener('orientationchange',queue,{passive:true});
document.fonts?.ready.then(fit);document.fonts?.addEventListener('loadingdone',fit);
document.addEventListener('ah:persistent-route-complete',init);
})();
