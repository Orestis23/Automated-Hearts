/* Round 1945 tuning — deterministic ticker-line typography authority.
   Applies the ticker's exact LED-dot text recipe to the page-name progress display,
   outer-rim footer keys, and footer-key-style route controls.
   The mint LED cores stay bright while their halo is reduced to 25% opacity. */
(()=>{'use strict';
const GREEN='#8fffd7';
const DARK='#07111b';
const DOT='radial-gradient(circle at 1.08px 1.08px, rgba(255,255,255,.98) 0 .34px, currentColor .42px .88px, transparent .98px)';
const FILTER='brightness(1.24) contrast(1.34)';
const BUTTON_ROOTS='footer#site-footer, .ah-home-route-footer-clone, .premium-route-card__title-sign, .route-label, .home-process-key-button';
const BUTTON_GLYPHS='.ah1943-ticker-button-glyphs, .ah1942-button-glyphs, .ah1887-button-glyphs, .footer-nav-label';

function important(el,prop,val){
  if(el && el.style.getPropertyValue(prop)!==val || (el && el.style.getPropertyPriority(prop)!=='important')){
    el.style.setProperty(prop,val,'important');
  }
}
function tickerGlyph(el,{size=null,color=GREEN,filter=FILTER}={}){
  if(!el)return;
  if(el.closest(":is(a.footer-structure-control,button.footer-structure-control,nav.footer>a,.ah-home-route-footer-clone,.premium-route-card__title-sign,.route-label,.ah1807-home-window-control,.ah1940-solution-window-control,.home-process-key-button,.explore-key,a.button,button.button,button.action,a.consult,.back-top,.ah-rates__button,.r864-rates__drawer-toggle,.r865-rates__consultation-action,.ah-mobile-contact__submit,.nav-contact-submit):not(#header-send-message):not(.message)"))color='#fff';
  important(el,'color',color);
  important(el,'font-family','"Orbitron", system-ui, sans-serif');
  if(size)important(el,'font-size',size);
  important(el,'font-weight','800');
  important(el,'font-style','normal');
  important(el,'font-variant','normal');
  important(el,'font-variant-ligatures','none');
  important(el,'line-height','1');
  important(el,'letter-spacing','.01em');
  important(el,'-webkit-text-stroke','0 transparent');
  important(el,'-webkit-text-fill-color','transparent');
  important(el,'background-color','transparent');
  important(el,'background-image',DOT);
  important(el,'background-size','3.18px 3.18px');
  important(el,'background-position','0 0');
  important(el,'background-repeat','repeat');
  important(el,'-webkit-background-clip','text');
  important(el,'background-clip','text');
  important(el,'-webkit-mask-image','none');
  important(el,'mask-image','none');
  important(el,'text-shadow','none');
  important(el,'filter',filter);
  important(el,'opacity','1');
  important(el,'visibility','visible');
  important(el,'text-rendering','geometricPrecision');
}
function wrapChip(chip){
  if(!chip)return null;
  let span=chip.querySelector(':scope > .ah1944-page-chip-glyphs, :scope > .ah1905-digital-glyphs');
  if(span)return span;
  const text=Array.from(chip.childNodes).find(n=>n.nodeType===Node.TEXT_NODE&&n.nodeValue.trim());
  if(!text)return null;
  span=document.createElement('span');
  span.className='ah1944-page-chip-glyphs';
  span.textContent=text.nodeValue.trim();
  text.replaceWith(span);
  return span;
}
function applyProgress(){
  const mobile=matchMedia('(max-width:900px)').matches;
  const size=mobile?'15px':'20px';
  document.querySelectorAll('body[data-page] > .rim-page-name-screen.footer-page-screen.header-page-screen--top > .footer-page-led, body[data-page] > .rim-page-name-screen.footer-page-screen.header-page-screen--top > .header-page-led').forEach(el=>{
    tickerGlyph(el,{size});
    important(el,'display','flex');
    important(el,'align-items','center');
    important(el,'justify-content','center');
    important(el,'width','100%');
    important(el,'height','100%');
    important(el,'padding',mobile?'0 8px':'0 12px');
    important(el,'white-space','nowrap');
    important(el,'overflow','hidden');
    important(el,'text-align','center');
    // Pseudo dark-text layer inherits font metrics from the base element.
    important(el,'--ah1944-progress-inline-size',size);
  });
  document.querySelectorAll('body[data-ah-mobile-surface] > .page-chip').forEach(chip=>{
    const span=wrapChip(chip);
    if(span)tickerGlyph(span,{size:mobile?'15px':'20px'});
  });
}
function applyButtons(){
  if(window.__AH2084_BUTTON_LABEL_AUTHORITY__)return;
  document.querySelectorAll(BUTTON_ROOTS).forEach(root=>{
    root.querySelectorAll(BUTTON_GLYPHS).forEach(el=>tickerGlyph(el));
    if(root.matches(BUTTON_GLYPHS))tickerGlyph(root);
  });
}
let queued=false;
function apply(){
  queued=false;
  applyProgress();
  applyButtons();
}
function queue(){
  if(queued)return;
  queued=true;
  requestAnimationFrame(apply);
}
function start(){
  apply();
  // Reassert after legacy page runtimes finish their late typography passes.
  setTimeout(apply,120);
  setTimeout(apply,500);
  setTimeout(apply,1200);
  new MutationObserver(queue).observe(document.body||document.documentElement,{childList:true,subtree:true,characterData:true});
  addEventListener('resize',queue,{passive:true});
  addEventListener('pageshow',queue,{passive:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
