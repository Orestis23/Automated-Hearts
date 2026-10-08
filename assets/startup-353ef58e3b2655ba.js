/* Automated Hearts Round 1873 — order-preserving runtime consolidation. */

(()=>{'use strict';const SRC='./assets/ah-empty-transparent.svg';function apply(root=document){root.querySelectorAll?.('a.rim-heart-emblem.rim-heart-home-link,a.heart').forEach(a=>{if(a.querySelector(':scope > img.ah1858-heart-image'))return;const img=document.createElement('img');img.className='ah1858-heart-image';img.src=SRC;img.alt='';img.setAttribute('aria-hidden','true');img.decoding='async';a.prepend(img);});}apply();if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>apply(),{once:true});const mo=new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes)if(n.nodeType===1){if(n.matches?.('a.rim-heart-emblem.rim-heart-home-link,a.heart'))apply(n.parentNode||document);else apply(n);}});mo.observe(document.documentElement,{subtree:true,childList:true});})();


(()=>{
  'use strict';
  const FRAME_SELECTOR='body.page-home[data-page="home"] #home-machine-grid > .home-hero-engine-frame,body[data-ah-mobile-surface="home"] #machine-stack > .machine-frame';
  const mediaReady=(media)=>{
    if(!media)return false;
    if(media.tagName==='VIDEO')return media.readyState>=2;
    try{
      const doc=media.contentDocument;
      return !!doc&&(doc.readyState==='interactive'||doc.readyState==='complete');
    }catch(_){return false;}
  };
  const setReady=(frame)=>{
    if(!frame||!frame.isConnected)return;
    frame.classList.remove('ah-machine-content-loading');
    frame.classList.add('ah-machine-content-ready');
  };
  const setLoading=(frame)=>{
    if(!frame||!frame.isConnected)return;
    frame.classList.remove('ah-machine-content-ready');
    frame.classList.add('ah-machine-content-loading');
  };
  const bindFrame=(frame)=>{
    if(!frame||frame.dataset.ah1862LoadGuard==='1')return;
    frame.dataset.ah1862LoadGuard='1';
    const media=frame.querySelector('iframe,video');
    if(!media){setReady(frame);return;}
    if(mediaReady(media))setReady(frame);else setLoading(frame);
    media.addEventListener('load',()=>setReady(frame),{passive:true});
    media.addEventListener('loadeddata',()=>setReady(frame),{passive:true});
    media.addEventListener('canplay',()=>setReady(frame),{passive:true});
    media.addEventListener('error',()=>frame.classList.remove('ah-machine-content-loading'),{passive:true});
    const attrObserver=new MutationObserver((records)=>{
      for(const record of records){
        if(record.type==='attributes'&&(record.attributeName==='src'||record.attributeName==='data-src')){
          setLoading(frame);
          requestAnimationFrame(()=>{if(mediaReady(media))setReady(frame);});
        }
      }
    });
    attrObserver.observe(media,{attributes:true,attributeFilter:['src','data-src']});
  };
  const scan=()=>document.querySelectorAll(FRAME_SELECTOR).forEach(bindFrame);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',scan,{once:true});else scan();
  new MutationObserver(scan).observe(document.documentElement,{childList:true,subtree:true});
})();



;
/* Automated Hearts Round 2109 — one idempotent UI text/state stabilizer.
   CSS owns appearance. This runtime only adds stable semantic glyph classes to new content. */
(()=>{'use strict';
  if(window.__AH2109_STATE_DIGITAL__)return;
  window.__AH2109_STATE_DIGITAL__=true;
  window.__AH2084_BUTTON_LABEL_AUTHORITY__=true;
  const CONTROL=['button','[role="button"]','a.footer-structure-control','nav.footer a','a.route-label','a.button','.button','.action','.consult','.back-top','.ah-rates__button','.r864-rates__drawer-toggle','.r865-rates__consultation-action','.home-process-key-button','.ah-unified-spacebar','.ah-mobile-contact__submit','.nav-contact-submit','.premium-route-card__title-sign','.explore-key','.ah-home-route-footer-clone','.ah1807-home-window-control','.ah1940-solution-window-control','a[data-nav]','a[data-action]','a[data-route]'].join(',');
  const EXISTING='.ah1985-progress-text-glyphs,.ah2084-button-label-lock,.footer-nav-label,.ah1886-digital-glyphs,.ah1887-button-glyphs,.ah1905-digital-glyphs,.ah1942-button-glyphs,.ah1943-ticker-button-glyphs,.ah1944-page-chip-glyphs,.ah1950-button-glyphs,.ah1928-progress-digital-glyphs,.ah2000-legible-digital-glyph';
  const IGNORE='script,style,noscript,template,svg,canvas,iframe,textarea,input,select,option,code,pre,[hidden],.sr-only,.seo-visually-hidden,.visually-hidden,.ah1905-no-digital,.ah1985-no-digital,.footer-page-led,.header-page-led';
  const BUTTON_SKIP='script,style,noscript,template,svg,canvas,iframe,textarea,select,option,[aria-hidden="true"],.sr-only';

  function wrapButton(control){
    if(!control||control.nodeType!==1||control.closest('[data-ah-brand-carbon]'))return;
    if(control.matches('.ah1807-home-window-control,footer#site-footer a[data-nav],body>nav.footer>a[href],#header-send-message,.message[data-contact-trigger]'))return;
    const walker=document.createTreeWalker(control,NodeFilter.SHOW_TEXT,{acceptNode:n=>n.nodeValue?.trim()&&!n.parentElement?.closest(BUTTON_SKIP)&&!n.parentElement?.closest(EXISTING)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT});
    const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
    for(const n of nodes){const s=document.createElement('span');s.className='ah2084-button-label-lock';s.textContent=n.nodeValue.trim();n.replaceWith(s);}
  }
  function wrapTextNode(node){
    if(!node||node.nodeType!==Node.TEXT_NODE||!node.nodeValue?.trim())return;
    const p=node.parentElement;if(!p||p.closest(IGNORE)||p.closest(EXISTING)||p.closest(CONTROL))return;
    const s=document.createElement('span');s.className='ah1985-progress-text-glyphs';s.textContent=node.nodeValue;node.replaceWith(s);
  }
  function scan(root=document.body){
    if(!root)return;
    if(root.nodeType===Node.TEXT_NODE){wrapTextNode(root);return;}
    if(root.nodeType!==Node.ELEMENT_NODE&&root!==document)return;
    if(root.nodeType===Node.ELEMENT_NODE&&(root.closest(IGNORE)||root.closest(EXISTING)||root.closest('[data-ah-brand-carbon]')))return;
    if(root.nodeType===Node.ELEMENT_NODE&&root.matches?.(CONTROL))wrapButton(root);
    root.querySelectorAll?.(CONTROL).forEach(wrapButton);
    const base=root===document?document.body:root;if(!base||base.closest?.(IGNORE))return;
    const walker=document.createTreeWalker(base,NodeFilter.SHOW_TEXT,{acceptNode:n=>{
      if(!n.nodeValue?.trim())return NodeFilter.FILTER_REJECT;
      const p=n.parentElement;if(!p||p.closest(IGNORE)||p.closest(EXISTING)||p.closest(CONTROL))return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }});
    const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);nodes.forEach(wrapTextNode);
    document.documentElement.dataset.ah2109StateDigital='1';
  }
  let raf=0,pending=[];
  const drain=()=>{const roots=[...new Set(pending.splice(0))].filter(r=>r?.isConnected!==false);return roots.filter(r=>!roots.some(parent=>parent!==r&&parent.contains?.(r)));};
  const queue=(root)=>{if(root)pending.push(root);if(raf)return;raf=requestAnimationFrame(()=>{raf=0;const roots=drain();if(!roots.length)roots.push(document.body);for(const r of roots)if(r?.isConnected!==false)scan(r);});};
  window.__AH2084_LOCK_BUTTONS__=()=>queue(document.body);
  const start=()=>{
    scan(document.body);
    const mo=new MutationObserver(records=>{
      let any=false;
      for(const record of records){for(const node of record.addedNodes){if((node.nodeType===1||node.nodeType===3)&&node.isConnected&&!node.parentElement?.closest(IGNORE)&&!node.parentElement?.closest('[data-ah-brand-carbon]')&&!(node.nodeType===1&&(node.matches(EXISTING)||node.closest(EXISTING)))){pending.push(node);any=true;}}}
      if(any&&!raf){raf=requestAnimationFrame(()=>{raf=0;const roots=drain();for(const r of roots)if(r?.isConnected!==false)scan(r);});}
    });
    mo.observe(document.body||document.documentElement,{childList:true,subtree:true});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();

;
