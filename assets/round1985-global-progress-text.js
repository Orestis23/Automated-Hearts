/* Round 1985 — make every visible text node use the exact page-progress glyph treatment. */
(()=>{
  'use strict';
  const C='ah1985-progress-text-glyphs';
  const EXISTING='.ah1985-progress-text-glyphs,.ah1905-digital-glyphs,.ah1887-button-glyphs,.ah1886-digital-glyphs,.ah1942-button-glyphs,.ah1943-ticker-button-glyphs,.ah1944-page-chip-glyphs,.ah1950-button-glyphs,.ah1928-progress-digital-glyphs';
  const IGNORE='script,style,noscript,template,svg,canvas,iframe,textarea,input,select,option,code,pre,[hidden],.sr-only,.seo-visually-hidden,.visually-hidden,.ah1905-no-digital,.ah1985-no-digital';
  const DIRECT='.footer-page-led,.header-page-led,.r1362-home-title-text,.title-stack .lcd-text,.ah1825-machine-window-title__text,.ah1807-home-window-control__text,.ah1940-solution-window-title__text,.ah1940-solution-window-control__text,.charity-marquee__segment,.screen-text-canonical';
  const digitalDot='radial-gradient(circle at 1.08px 1.08px,currentColor 0 .88px,transparent .98px)';
  const digitalPitch='3.18px 3.18px';
  const imp=(el,p,v)=>{try{el.style.setProperty(p,v,'important')}catch(_){}};
  function styleGlyph(el){
    if(!el||el.nodeType!==1)return;
    /* Round 2108: the persistent page-name/progress screen is first-paint CSS hardware. */
    if(el.matches?.('.footer-page-led,.header-page-led')||el.closest?.('.rim-page-name-screen'))return;
    if(window.__AH2084_BUTTON_LABEL_AUTHORITY__&&el.closest?.(':is(button,[role="button"],a.footer-structure-control,nav.footer>a,a.route-label,a.button,.button,.action,.consult,.back-top,.ah-rates__button,.r864-rates__drawer-toggle,.r865-rates__consultation-action,.home-process-key-button,.ah-unified-spacebar,.ah-mobile-contact__submit,.nav-contact-submit,.ah1807-home-window-control,.ah1940-solution-window-control,a[data-nav],a[data-action],a[data-route])'))return;
    const referenceKey=!!el.closest(":is(a.footer-structure-control,button.footer-structure-control,nav.footer>a,.ah-home-route-footer-clone,.premium-route-card__title-sign,.route-label,.ah1807-home-window-control,.ah1940-solution-window-control,.home-process-key-button,.explore-key,a.button,button.button,button.action,a.consult,.back-top,.ah-rates__button,.r864-rates__drawer-toggle,.r865-rates__consultation-action,.ah-mobile-contact__submit,.nav-contact-submit):not(#header-send-message):not(.message)");
    const mobileFooter=!!el.closest('body[data-ah-mobile-surface] > nav.footer > a[href]');
    if(referenceKey)imp(el,'color','#fff');
    imp(el,'font-family','"Orbitron", system-ui, sans-serif');
    imp(el,'font-weight',mobileFooter?'900':'800');
    imp(el,'font-style','normal');
    imp(el,'font-variant','normal');
    imp(el,'font-variant-ligatures','none');
    imp(el,'-webkit-text-stroke','0 transparent');
    imp(el,'-webkit-text-fill-color','transparent');
    imp(el,'background-color','transparent');
    imp(el,'background-image',digitalDot);
    imp(el,'background-size',digitalPitch);
    imp(el,'background-position','0 0');
    imp(el,'background-repeat','repeat');
    imp(el,'-webkit-background-clip','text');
    imp(el,'background-clip','text');
    imp(el,'-webkit-mask-image','none');
    imp(el,'mask-image','none');
    imp(el,'text-shadow','none');
    imp(el,'filter','none'); imp(el,'-webkit-filter','none');
    imp(el,'text-rendering','geometricPrecision');
    imp(el,'opacity','1'); imp(el,'visibility','visible');
  }
  function ignored(el){ return !el||el.nodeType!==1||!!el.closest(IGNORE); }
  function wrap(node){
    if(!node||node.nodeType!==Node.TEXT_NODE||!node.nodeValue||!node.nodeValue.trim())return;
    const p=node.parentElement; if(ignored(p)||p.closest(EXISTING))return;
    const s=document.createElement('span'); s.className=C; s.textContent=node.nodeValue; node.replaceWith(s); styleGlyph(s);
  }
  function scan(root=document.body){
    if(!root)return;
    if(root.nodeType===Node.TEXT_NODE){wrap(root);return;}
    const base=root.nodeType===Node.ELEMENT_NODE?root:document.body; if(!base||ignored(base))return;
    const w=document.createTreeWalker(base,NodeFilter.SHOW_TEXT,{acceptNode:n=>{
      if(!n.nodeValue||!n.nodeValue.trim())return NodeFilter.FILTER_REJECT;
      const p=n.parentElement;if(!p||ignored(p)||p.closest(EXISTING))return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }});
    const a=[];while(w.nextNode())a.push(w.currentNode);a.forEach(wrap);
  }
  function apply(root=document.body){
    if(!root)return;
    root.querySelectorAll?.(EXISTING+','+DIRECT).forEach(styleGlyph);
    if(root.matches?.(EXISTING+','+DIRECT))styleGlyph(root);
    scan(root);
    document.documentElement.setAttribute('data-ah1985-progress-text','1');
  }
  let q=false;function queue(root=document.body){if(q)return;q=true;requestAnimationFrame(()=>{q=false;apply(root||document.body);});}
  function start(){apply();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  addEventListener('pageshow',()=>queue(document.body),{passive:true});
  document.addEventListener('ah:persistent-route-complete',()=>queue(document.body));
  document.addEventListener('automated-hearts:stage-transition-end',()=>queue(document.body));
})();
