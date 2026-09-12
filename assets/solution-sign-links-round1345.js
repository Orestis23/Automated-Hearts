/* Automated Hearts Round 1345
   Reliable Solution red-sign behavior on desktop + mobile:
   1) the 3D model finishes its camera focus,
   2) the host page animates the ACTUAL scrolling surface,
   3) the selected section lands cleanly without a native anchor jump.

   This intentionally does not use scrollIntoView()/behavior:smooth because desktop
   scrolls main#main-content (a fixed internal viewport), while mobile scrolls the document. */
(() => {
  'use strict';

  const aliases = Object.freeze({ '#solution-real-data':'#solution-world-intelligence' });
  const validHashes = new Set([
    '#solution-consolidate',
    '#solution-streamline',
    '#solution-automate',
    '#solution-optimize',
    '#solution-explore',
    '#solution-world-intelligence'
  ]);
  const resolveHash = hash => aliases[hash] || hash;

  let activeToken = 0;
  let activeRAF = 0;
  let restoreScrollerStyles = () => {};

  const currentModelFrame = () =>
    document.querySelector('#solution-engine-model') ||
    document.querySelector('#lite-model-shell iframe');

  function getScroller(section){
    const main = document.getElementById('main-content');
    if(main && main.contains(section)){
      const style = getComputedStyle(main);
      const verticallyScrollable = /auto|scroll/.test(style.overflowY) && main.scrollHeight > main.clientHeight + 2;
      if(verticallyScrollable) return {node:main, documentScroll:false};
    }
    return {node:document.scrollingElement || document.documentElement, documentScroll:true};
  }

  function saveScrollerState(driver){
    const touched=[];
    const set=(node,prop,value)=>{
      if(!node?.style) return;
      touched.push([node,prop,node.style.getPropertyValue(prop),node.style.getPropertyPriority(prop)]);
      node.style.setProperty(prop,value,'important');
    };
    set(driver.node,'scroll-behavior','auto');
    set(driver.node,'scroll-snap-type','none');
    set(driver.node,'overflow-anchor','none');
    if(driver.documentScroll){
      set(document.documentElement,'scroll-behavior','auto');
      set(document.body,'scroll-behavior','auto');
      set(document.documentElement,'scroll-snap-type','none');
      set(document.body,'scroll-snap-type','none');
      set(document.documentElement,'overflow-anchor','none');
      set(document.body,'overflow-anchor','none');
    }
    return () => {
      while(touched.length){
        const [node,prop,value,priority]=touched.pop();
        if(value) node.style.setProperty(prop,value,priority);
        else node.style.removeProperty(prop);
      }
    };
  }

  function makeDriver(section){
    const base=getScroller(section);
    const node=base.node;
    const docScroller=document.scrollingElement || document.documentElement;
    const documentScroll=base.documentScroll;

    const read=()=> documentScroll
      ? Math.max(window.scrollY||0, docScroller.scrollTop||0, document.body?.scrollTop||0)
      : Math.max(0,node.scrollTop||0);

    const write=value=>{
      const top=Math.max(0,Number(value)||0);
      if(documentScroll){
        docScroller.scrollTop=top;
        if(document.body) document.body.scrollTop=top;
      }else node.scrollTop=top;
    };

    const max=()=>Math.max(0, documentScroll
      ? Math.max(document.documentElement.scrollHeight,document.body?.scrollHeight||0)-window.innerHeight
      : node.scrollHeight-node.clientHeight);

    const viewportTop=()=>documentScroll?0:node.getBoundingClientRect().top+node.clientTop;

    const landingOffset=()=>{
      if(!documentScroll) return 26;
      // The lightweight mobile shell has a fixed title/header. Keep the selected
      // section comfortably below it while leaving the heading immediately visible.
      let offset=innerWidth<=800?78:28;
      for(const el of document.querySelectorAll('.page-chip,.mobile-page-title,.lite-page-title,.rim-page-name-screen')){
        const cs=getComputedStyle(el);
        if(cs.position!=='fixed' && cs.position!=='sticky') continue;
        const r=el.getBoundingClientRect();
        if(r.bottom>0 && r.top<160 && r.width>0 && r.height>0) offset=Math.max(offset,r.bottom+14);
      }
      return Math.min(132,offset);
    };

    const target=()=>{
      const now=read();
      const relative=section.getBoundingClientRect().top-viewportTop();
      return Math.max(0,Math.min(max(),now+relative-landingOffset()));
    };

    return {node,documentScroll,read,write,max,target};
  }

  const easeInOut = t => t<.5 ? 16*t*t*t*t*t : 1-Math.pow(-2*t+2,5)/2;

  function animatePass(driver,duration,token){
    return new Promise(resolve=>{
      const start=driver.read();
      const t0=performance.now();
      let last=start;
      const step=now=>{
        if(token!==activeToken){ resolve(false); return; }
        const p=Math.min(1,(now-t0)/duration);
        const liveTarget=driver.target();
        let next=start+(liveTarget-start)*easeInOut(p);
        // Red-sign navigation from the machine is intended to move downward. Prevent
        // tiny layout changes from making the page visibly rock backward mid-glide.
        if(liveTarget>=start) next=Math.max(last,next);
        driver.write(next);
        last=next;
        if(p<1){ activeRAF=requestAnimationFrame(step); return; }
        activeRAF=0;
        resolve(true);
      };
      activeRAF=requestAnimationFrame(step);
    });
  }

  async function smoothNavigate(section){
    if(!section) return false;
    if(activeRAF) cancelAnimationFrame(activeRAF);
    restoreScrollerStyles();
    activeRAF=0;
    const token=++activeToken;
    const driver=makeDriver(section);
    restoreScrollerStyles=saveScrollerState(driver);

    // Ask nearby lazy assets to begin decoding before the long glide; dimensions in
    // the desktop build are already reserved, and this reduces mobile layout shifts.
    const allSections=[...document.querySelectorAll('main#main-content section,main#main-content article')];
    const targetIndex=allSections.indexOf(section);
    if(targetIndex>=0){
      allSections.slice(0,targetIndex+1).forEach(block=>block.querySelectorAll?.('img[loading="lazy"]').forEach(img=>{img.loading='eager';}));
    }

    // Force one complete layout before calculating distance.
    section.getBoundingClientRect();
    await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
    if(token!==activeToken){ restoreScrollerStyles(); return false; }

    const distance=Math.abs(driver.target()-driver.read());
    const duration=Math.max(1550,Math.min(3000,1450+distance*.36));
    let ok=await animatePass(driver,duration,token);
    if(!ok){ restoreScrollerStyles(); return false; }

    // One animated settling pass only if late-loading content actually moved the target.
    await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
    if(token!==activeToken){ restoreScrollerStyles(); return false; }
    const error=driver.target()-driver.read();
    if(Math.abs(error)>3){
      ok=await animatePass(driver,Math.max(360,Math.min(650,320+Math.abs(error)*.18)),token);
    }
    restoreScrollerStyles();
    return !!ok;
  }

  function navigate(hash){
    const resolved=resolveHash(hash);
    if(!validHashes.has(resolved)) return false;
    const section=document.getElementById(resolved.slice(1));
    if(!section) return false;
    smoothNavigate(section).then(ok=>{
      if(!ok) return;
      try{history.replaceState(history.state,'',resolved);}catch(_){ }
    });
    return true;
  }
  window.ahSolutionNavigate=navigate;

  // Normal in-page links use exactly the same controlled glide.
  document.addEventListener('click',event=>{
    const link=event.target.closest?.('a[href^="#solution-"]');
    if(!link) return;
    const hash=resolveHash(link.getAttribute('href'));
    if(!validHashes.has(hash)) return;
    event.preventDefault();
    event.stopPropagation();
    navigate(hash);
  },true);

  // The Three.js frame emits this only after its camera focus animation finishes.
  addEventListener('message',event=>{
    const data=event.data||{};
    if(data.type!=='ah:solution-anchor') return;
    const hash=resolveHash(data.hash);
    if(!validHashes.has(hash)) return;
    // Accept the current machine iframe. If a mobile iframe was just replaced, the
    // message can arrive during that DOM handoff, so also accept any iframe child source.
    const model=currentModelFrame();
    const fromCurrent=model && event.source===model.contentWindow;
    const fromKnownFrame=[...document.querySelectorAll('iframe')].some(f=>event.source===f.contentWindow);
    if(!fromCurrent && !fromKnownFrame) return;
    navigate(hash);
  });

  // Keep the existing mechanical cover behavior, but once the desktop cover is raised
  // it must never intercept clicks intended for the red signs underneath.
  const cover=document.getElementById('solution-process-cover');
  const close=document.getElementById('solution-cover-close');
  if(close) close.hidden=true;
  const setDesktopCover=open=>{
    if(!cover) return;
    cover.classList.toggle('is-open',!!open);
    cover.setAttribute('aria-expanded',open?'true':'false');
    cover.setAttribute('aria-label',open?'Machine window open':'Reveal the machine');
    if(open) cover.style.setProperty('pointer-events','none','important');
    else cover.style.removeProperty('pointer-events');
    currentModelFrame()?.contentWindow?.postMessage({type:'engine-visibility',visible:!!open},'*');
  };
  cover?.addEventListener('click',event=>{
    event.preventDefault();
    setDesktopCover(!cover.classList.contains('is-open'));
  });
  if(cover){ setDesktopCover(false); addEventListener('pageshow',()=>setDesktopCover(false),{passive:true}); }

  // Initial hashes should use the same controlled positioning, never a native jump.
  if(location.hash && validHashes.has(resolveHash(location.hash))){
    requestAnimationFrame(()=>requestAnimationFrame(()=>navigate(location.hash)));
  }
})();
