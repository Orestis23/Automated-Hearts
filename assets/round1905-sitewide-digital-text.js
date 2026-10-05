/* Round 1905 — wrap every visible site text node in the shared clean digital
   glyph treatment. This deliberately catches copy older page-specific passes
   missed, and watches persistent-router/dynamic content added later. */
(()=>{
  'use strict';
  const GLYPH='ah1905-digital-glyphs';
  const EXISTING='.ah1886-digital-glyphs,.ah1887-button-glyphs,.ah1905-digital-glyphs';
  const IGNORE='script,style,noscript,template,svg,canvas,iframe,textarea,input,select,option,[hidden],.sr-only,.seo-visually-hidden,.visually-hidden,.ah1905-no-digital';
  const DIRECT_AUTHORITY='.rim-page-name-screen,.r1362-home-title-text,.title-stack .lcd-text,.ah1825-machine-window-title__text';

  function ignored(el){
    if(window.__AH2084_BUTTON_LABEL_AUTHORITY__ && el?.closest?.('button,[role="button"],a.footer-structure-control,nav.footer a,.route-label,.button,.action,.consult,.back-top,.ah-rates__button,.r864-rates__drawer-toggle,.r865-rates__consultation-action,.home-process-key-button,.ah-unified-spacebar,.ah-mobile-contact__submit,.nav-contact-submit,.premium-route-card__title-sign,.explore-key,.ah1807-home-window-control,.ah1940-solution-window-control,a[data-nav],a[data-action],a[data-route]'))return true;
    return !el || el.nodeType!==1 || !!el.closest(IGNORE) || !!el.closest(DIRECT_AUTHORITY);
  }
  function wrap(node){
    if(!node || node.nodeType!==Node.TEXT_NODE || !node.nodeValue || !node.nodeValue.trim()) return;
    const parent=node.parentElement;
    if(ignored(parent) || parent.closest(EXISTING)) return;
    const span=document.createElement('span');
    span.className=GLYPH;
    span.textContent=node.nodeValue;
    node.replaceWith(span);
  }
  function scan(root=document.body){
    if(!root) return;
    if(root.nodeType===Node.TEXT_NODE){ wrap(root); return; }
    const base=root.nodeType===Node.ELEMENT_NODE ? root : document.body;
    if(!base || ignored(base)) return;
    const walker=document.createTreeWalker(base,NodeFilter.SHOW_TEXT,{acceptNode:n=>{
      if(!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      const p=n.parentElement;
      if(!p || ignored(p) || p.closest(EXISTING)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }});
    const nodes=[];
    while(walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(wrap);
  }
  function markExisting(){
    document.querySelectorAll('.ah1886-digital-glyphs,.ah1887-button-glyphs').forEach(el=>{
      el.style.textShadow='none';
    });
  }
  function apply(root=document.body){
    markExisting();
    scan(root);
    document.documentElement.setAttribute('data-ah-sitewide-digital','1905');
  }
  function start(){
    apply();
    let queued=false;
    const pending=new Set();
    const mo=new MutationObserver(records=>{
      for(const r of records){
        if(r.type==='childList') r.addedNodes.forEach(n=>pending.add(n));
      }
      if(queued || !pending.size) return;
      queued=true;
      requestAnimationFrame(()=>{
        queued=false;
        const items=[...pending]; pending.clear();
        items.forEach(n=>{
          if(n.nodeType===Node.TEXT_NODE) wrap(n);
          else if(n.nodeType===Node.ELEMENT_NODE) scan(n);
        });
        markExisting();
      });
    });
    mo.observe(document.body||document.documentElement,{childList:true,subtree:true,characterData:false});
    addEventListener('pageshow',()=>apply(),{passive:true});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
