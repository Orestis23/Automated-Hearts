/* Consistent matte honeycomb hero headers and spacing from the inner rim. */
(()=>{
 'use strict';
 const frost=new URL('approved-honeycomb-content-rendered.webp',document.currentScript.src).href;
 const selectors='#home-opening-hero,#ah2123-home-mobile-header,#solution-process-header,.solution-mobile-header-section,#who-we-help-solutions,#learning-route-buttons,.ah1616-services-about-intro,.ah1883-nonhub-header-glass-host';
 function apply(){
 const main=document.querySelector('main#main-content');if(!main)return;
 if(document.body.getAttribute('data-ah-mobile-surface')==='home'){const grid=main.querySelector('[data-ah-insight-grid]');if(grid){grid.style.setProperty('margin-top','0','important');grid.style.setProperty('padding-top','0','important');}}

 // A routed shell delegates content spacing to its embedded page.
 const shell=!!main.querySelector(':scope > iframe.ah-shell-content-frame');
 if(!shell){const mobile=document.documentElement.dataset.ahResponsiveVariant==='mobile'||document.body.hasAttribute('data-ah-mobile-surface');const solution=document.body.classList.contains('page-solutions')||/industries|good-information/.test(location.pathname);main.style.setProperty('padding-top',document.body.dataset.ahMobileSurface==='industries'?'122px':mobile?(document.querySelector('.solution-mobile-header-section')||document.body.dataset.ahMobileSurface==='pricing'?'146px':'149.25px'):(solution||document.body.dataset.page==='home')?'0px':'48px','important');}
 const headers=new Set(main.querySelectorAll(selectors));
 const first=main.querySelector(':scope > section');
 if(first&&!first.matches('.ah-pricing-page')&&!headers.size)headers.add(first);
 for(const hero of headers){
 hero.dataset.ahMatteHero='1';
 const mobileSurface=document.body.hasAttribute('data-ah-mobile-surface')||document.documentElement.dataset.ahResponsiveVariant==='mobile';
 const properties={'background-color':'#07111b','background-image':`linear-gradient(rgba(220,236,243,.10),rgba(220,236,243,.10)),url("${frost}")`,'background-size':'auto,cover','background-position':'center','background-repeat':'no-repeat','background-blend-mode':'normal','margin-top':'0','filter':'none'};
 properties['background-color']=mobileSurface?'#071827':'transparent';properties['background-image']=`url("${frost}")`;properties['background-size']=getComputedStyle(main).backgroundSize;properties['background-position']='center center';properties['background-attachment']=mobileSurface?'scroll':'fixed';
 for(const [key,value]of Object.entries(properties))if(hero.style.getPropertyValue(key)!==value||hero.style.getPropertyPriority(key)!=='important')hero.style.setProperty(key,value,'important');
 }
 }
 const style=document.createElement('style');style.textContent='@media(max-width:900px){html body[data-ah-mobile-surface] main#main-content > section,html body[data-ah-mobile-surface] main#main-content .ah1840-carousel-frost-only{background-color:transparent!important;background-image:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important}}'+'html body [data-ah-matte-hero]::before,html body [data-ah-matte-hero]::after{background-image:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;pointer-events:none!important}';document.head.append(style);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
 addEventListener('load',apply);addEventListener('ah:persistent-route-complete',apply);
})();

/* Mobile material sizing is declared before first paint in the mobile HTML. */
/* Routed mobile pages scroll only their content, never the iframe document. */
(()=>{
 function constrainEmbeddedScroll(){
  if(innerWidth>900||new URLSearchParams(location.search).get('ah_embed')!=='1')return;
  const main=document.querySelector('main#main-content');if(!main)return;
  for(const root of [document.documentElement,document.body]){
   for(const [key,value]of Object.entries({height:'100%',overflow:'hidden','overscroll-behavior':'none'}))root.style.setProperty(key,value,'important');
  }
  for(const [key,value]of Object.entries({position:'fixed',inset:'0',height:'100%','min-height':'0','max-height':'100%','overflow-x':'hidden','overflow-y':'auto','overscroll-behavior-y':'contain','scrollbar-width':'none'}))main.style.setProperty(key,value,'important');
  window.scrollTo({top:0,left:0,behavior:'instant'});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',constrainEmbeddedScroll,{once:true});else constrainEmbeddedScroll();
 addEventListener('load',constrainEmbeddedScroll);addEventListener('resize',constrainEmbeddedScroll);
})();

/* Scrollbar tracks must not subtract width from the centered mobile content. */
(()=>{const style=document.createElement('style');style.textContent='@media(max-width:900px){html body main#main-content{scrollbar-width:none!important}html body main#main-content::-webkit-scrollbar{display:none!important;width:0!important}}';document.head.append(style)})();

/* Keep the final learning button above the clipped mobile rim with a full card gap. */
(()=>{
 function learningBottomSpace(){
  if(innerWidth>900||document.body.dataset.ahMobileSurface==='industries')return;
  const main=document.querySelector('main#main-content');
  const cards=[...document.querySelectorAll('.route-card[data-lite-learning],.route-card[data-industry]')];
  if(!main||cards.length<2)return;
  const previous=cards[cards.length-2].querySelector('a[data-lite-learning],button.route-label');
  const circle=cards[cards.length-1].querySelector('img');
  const last=cards[cards.length-1].querySelector('a[data-lite-learning],button.route-label');
  if(!previous||!circle||!last)return;
  const gap=cards[0].hasAttribute('data-industry')?42:Math.max(0,circle.getBoundingClientRect().top-previous.getBoundingClientRect().bottom);
  const current=parseFloat(getComputedStyle(main).paddingBottom)||0;
  const bottom=last.getBoundingClientRect().bottom-main.getBoundingClientRect().top+main.scrollTop;
  const other=Math.max(0,main.scrollHeight-bottom-current);
  const padding=Math.max(0,88+gap-other);
  main.style.setProperty('padding-bottom',padding+'px','important');
 }
 const queue=()=>requestAnimationFrame(()=>requestAnimationFrame(learningBottomSpace));
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',queue,{once:true});else queue();
 addEventListener('load',queue);addEventListener('resize',queue);
})();




/* Balance the two homepage section breaks without adding height to Explore's band. */
(()=>{
 function balanceHomeGaps(){return; // Replaced by the shared 48px/64px section rule.
  if(innerWidth>900||document.body.dataset.ahMobileSurface!=='home')return;
  const route=document.querySelector('.home-route-section');
  const section=document.querySelector('section[aria-label="Negative Software Solution"]');
  const explore=section?.querySelector('.explore-key');
  if(!route||!section||!explore)return;
  route.style.setProperty('padding-bottom','54px','important');
  section.style.setProperty('padding-bottom','45px','important');
  explore.style.setProperty('margin-top','45px','important');
  explore.style.setProperty('margin-bottom','0','important');
  const grid=section.querySelector('.process-grid');
  if(grid){const b=explore.getBoundingClientRect(),g=grid.getBoundingClientRect(),r=section.getBoundingClientRect();const above=b.top-g.bottom,below=r.bottom-b.bottom;explore.style.setProperty('margin-top',(45+(below-above)/2)+'px','important');}
 }
 const queue=()=>requestAnimationFrame(()=>requestAnimationFrame(balanceHomeGaps));
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',queue,{once:true});else queue();
 addEventListener('load',queue);addEventListener('resize',queue);
})();
/* Crisp blue page-name bulbs over the illuminated portion of the progress bar. */
(()=>{
 function progressInk(){
  const bar=document.querySelector('#ah-page-progress');if(!bar)return;
  const label=bar.querySelector('.ah1985-progress-text-glyphs,.page-progress-label');if(!label)return;
  const percent=Number(bar.dataset.scrollPercent)||0;
  const br=bar.getBoundingClientRect(),lr=label.getBoundingClientRect();
  const edge=Math.max(0,Math.min(100,(br.width*percent/100-(lr.left-br.left))/lr.width*100));
  const values={'background-image':`linear-gradient(to right,#092d4c 0%,#092d4c ${edge}%,#8fffd7 ${edge}%,#8fffd7 100%)`,'background-size':'100% 100%','background-clip':'text','-webkit-background-clip':'text',color:'#092d4c','-webkit-text-fill-color':'transparent','mask-image':'none','-webkit-mask-image':'none','mask-size':'2px 2px','-webkit-mask-size':'2px 2px',filter:'none','text-shadow':'none',opacity:'1','font-weight':'400'};
  for(const [key,value]of Object.entries(values))if(label.style.getPropertyValue(key)!==value)label.style.setProperty(key,value,'important');
 }
 function init(){progressInk();const bar=document.querySelector('#ah-page-progress');if(bar)new MutationObserver(progressInk).observe(bar,{attributes:true,attributeFilter:['data-scroll-percent'],childList:true});}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
 addEventListener('resize',progressInk);
})();
/* The critical-window face and lettering move only with the shared button press. */
(()=>{
 const style=document.createElement('style');
 style.textContent='html body #ah2123-mobile-critical-button .ah1807-home-window-control__face,html body #ah2123-mobile-critical-button .ah1807-home-window-control__text,html body #ah2123-mobile-critical-button .ah1807-home-window-control__text *{transform:none!important;translate:none!important;scale:1!important;transition:none!important;animation:none!important}html body #ah2123-mobile-critical-button .ah1807-home-window-control__text{position:absolute!important;inset:12px!important;width:auto!important;height:auto!important;min-height:0!important;display:flex!important;align-items:center!important;justify-content:center!important;margin:0!important;padding:0!important;line-height:1.2!important;}';
 document.head.append(style);
})();
(()=>{const style=document.createElement('style');style.textContent='html body #ah2123-mobile-critical-button .ah1807-home-window-control__text{font-size:16px!important;letter-spacing:.3px!important;word-spacing:0!important;gap:0!important;flex-wrap:nowrap!important;}html body #ah2123-mobile-critical-button .ah-bulb-word{display:inline-block!important;flex:0 0 auto!important;white-space:nowrap!important;font:inherit!important;letter-spacing:inherit!important;margin:0!important;padding:0!important;}html body #ah2123-mobile-critical-button .ah-bulb-space{display:inline-block!important;flex:0 0 3.52px!important;width:3.52px!important;min-width:3.52px!important;max-width:3.52px!important;margin:0!important;padding:0!important;}html body #ah2123-mobile-critical-button .ah-steady-bulb{font:inherit!important;letter-spacing:inherit!important;flex:0 0 auto!important;margin:0!important;padding:0!important;}';document.head.append(style)})();
(()=>{function init(){const label=document.querySelector('#ah2123-mobile-critical-button .ah1807-home-window-control__text');if(!label)return;function words(){if(label.querySelector('.ah-bulb-word'))return;const copy=label.textContent;const fragment=document.createDocumentFragment();for(const word of copy.split(/(\s+)/)){if(!word)continue;const span=document.createElement('span');span.className=/\s/.test(word)?'ah-bulb-space':'ah-bulb-word';span.textContent=/\s/.test(word)?' ':word;fragment.append(span);}label.replaceChildren(fragment);}words();new MutationObserver(words).observe(label,{childList:true});}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();})();
/* Reveal site controls only after the gallery font and final label layout are ready. */
(()=>{const style=document.createElement('style');style.textContent='html:not([data-button-type-ready]) body :is(.route-label,.ah1807-home-window-control,.ah-unified-spacebar,[data-ah-brand-carbon],#ah-mobile-footer a):not(.ah1807-home-window-control){visibility:hidden!important}';document.head.append(style);async function ready(){if(document.fonts){await document.fonts.load('900 16px Orbitron');await document.fonts.ready;}window.AHControls?.normalizeText();document.documentElement.setAttribute('data-button-type-ready','1');}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();})();
(()=>{const style=document.createElement('style');style.textContent='html body #negative-software-explore,html body .explore-key{background-color:transparent!important;box-shadow:none!important;outline:none!important;clip-path:inset(1px)!important;}';document.head.append(style);})();
/* Keep narrow-phone image panels square instead of stretching their artwork. */
(()=>{function fit(){if(innerWidth>360)return;for(const media of document.querySelectorAll('.route-card .route-media')){const size=media.getBoundingClientRect().width;if(!size)continue;for(const key of ['height','min-height','max-height'])media.style.setProperty(key,size+'px','important');for(const image of media.querySelectorAll('img')){image.style.setProperty('width','100%','important');image.style.setProperty('height','100%','important');image.style.setProperty('object-fit','cover','important');}}}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fit,{once:true});else fit();addEventListener('load',fit);addEventListener('resize',fit);})();
(()=>{const style=document.createElement('style');style.id='ah-forced-smooth-scroll';style.textContent='html,body,body *{scroll-behavior:smooth!important}';document.head.append(style);})();
/* Smooth wheel input in the page's actual scroll container. */
(()=>{
 const motion=new WeakMap();
 function scrollerFor(node){for(let el=node instanceof Element?node:node?.parentElement;el;el=el.parentElement){if(el.scrollHeight>el.clientHeight+1&&/auto|scroll/.test(getComputedStyle(el).overflowY))return el;}const root=document.scrollingElement;return root&&root.scrollHeight>root.clientHeight+1?root:null;}
 document.addEventListener('wheel',event=>{
  if(event.ctrlKey||event.metaKey||Math.abs(event.deltaX)>Math.abs(event.deltaY)||!event.deltaY)return;
  if(event.target.closest?.('canvas,.ah-floating-lesson-slot,#lite-model-shell iframe,.solution-process-window iframe'))return;
  const el=scrollerFor(event.target);if(!el)return;
  const delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?el.clientHeight*.85:1);
  let state=motion.get(el);if(!state){state={target:el.scrollTop,frame:0,last:0};motion.set(el,state);}
  if(!state.frame)state.target=el.scrollTop;
  const max=el.scrollHeight-el.clientHeight,target=Math.max(0,Math.min(max,state.target+delta));
  if(target===state.target&&!state.frame)return;
  event.preventDefault();state.target=target;
  if(state.frame)return;
  state.last=performance.now();
  const tick=now=>{const dt=Math.min(50,now-state.last);state.last=now;const remaining=state.target-el.scrollTop;
   if(Math.abs(remaining)<.6){el.scrollTo({top:state.target,behavior:'instant'});state.frame=0;return;}
   el.scrollTo({top:el.scrollTop+remaining*(1-Math.exp(-dt/75)),behavior:'instant'});state.frame=requestAnimationFrame(tick);
  };state.frame=requestAnimationFrame(tick);
 },{passive:false});
 document.addEventListener('pointerdown',event=>{const el=scrollerFor(event.target),state=el&&motion.get(el);if(state){cancelAnimationFrame(state.frame);state.frame=0;state.target=el.scrollTop;}},true);
})();
/* Carousel images must be ready before manual motion brings them on screen. */
(()=>{const known=new WeakSet();function loadCarousel(){for(const image of document.querySelectorAll('.carousel img,#home-overview-section img')){if(known.has(image))continue;known.add(image);image.loading='eager';image.decoding='async';if(image.dataset.src){image.src=image.dataset.src;image.removeAttribute('data-src');}if(image.dataset.srcset){image.srcset=image.dataset.srcset;image.removeAttribute('data-srcset');}image.style.setProperty('content-visibility','visible','important');}}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',loadCarousel,{once:true});else loadCarousel();addEventListener('load',loadCarousel);new MutationObserver(loadCarousel).observe(document.documentElement,{childList:true,subtree:true});})();
(()=>{const base=document.currentScript.src;function restore(){const figures=[...document.querySelectorAll('.carousel figure')];if(!figures.length)return;const images=[['home-carousel-work-concept-round494.webp','Human explaining one practical concept to an AI collaborator'],['home-carousel-living-room-anatomical-sharp-round502.webp','Humans and AI relaxing together'],['home-carousel-work-simplify-round494.webp','Human and AI simplifying a working system']];let index=0;for(const figure of figures){if(figure.querySelector('img')||index>=images.length)continue;const [src,alt]=images[index++];const image=document.createElement('img');image.src=new URL(src,base).href;image.alt=alt;image.loading='eager';image.decoding='async';image.style.cssText='display:block!important;width:100%!important;height:100%!important;object-fit:cover!important;object-position:center!important';figure.append(image);}}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',restore,{once:true});else restore();addEventListener('load',restore);})();
/* Desktop hero control labels have one fixed position from their first visible paint. */
(()=>{const style=document.createElement('style');style.textContent='@media(min-width:901px){html body #home-machine-grid>.ah1807-home-window-control .ah1807-home-window-control__face{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;transform:none!important;transition:none!important;}html body #home-machine-grid>.ah1807-home-window-control .ah1807-home-window-control__text{position:absolute!important;inset:12px!important;display:flex!important;align-items:center!important;justify-content:center!important;width:auto!important;height:auto!important;margin:0!important;padding:0!important;font-family:Orbitron,system-ui,sans-serif!important;font-size:16px!important;font-weight:900!important;line-height:1.2!important;letter-spacing:.3px!important;transform:none!important;transition:none!important;animation:none!important;white-space:nowrap!important;}html body #home-machine-grid>.ah1807-home-window-control,html body #home-machine-grid>.ah1807-home-window-control *{visibility:visible!important}}';document.head.append(style);async function ready(){if(innerWidth<=900)return;await document.fonts?.load('900 16px Orbitron');await document.fonts?.ready;window.AHControls?.normalizeText();requestAnimationFrame(()=>requestAnimationFrame(()=>document.documentElement.setAttribute('data-desktop-hero-controls-ready','1')));}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();})();
/* Approved gallery rim: shared desktop/mobile, above the patterned surface. */
(()=>{function apply(){for(const rim of document.querySelectorAll('#ah2288-mobile-complete-rim,#ah2280-first-shield')){if(rim.id==='ah2288-mobile-complete-rim'&&rim.querySelector('.ah-single-viewport-surface'))continue;if(rim.id==='ah-official-rim'&&innerWidth>900&&document.querySelector('.ah-persistent-gold-rim')){rim.style.setProperty('border','0','important');rim.style.setProperty('border-image','none','important');rim.style.setProperty('box-shadow','none','important');continue;}for(const [k,v]of Object.entries({'border':'2px solid #c79a43','border-radius':'18px','border-image':'none','box-shadow':rim.matches('#ah-official-rim,#ah2288-mobile-complete-rim')?'inset 0 0 0 2px #1f1303,inset 0 0 0 4px #67502a,inset 0 0 0 6px #1f1303,inset 0 42px 52px -18px rgba(0,0,0,.88),inset 31px 0 39px -17px rgba(0,0,0,.78),inset -31px 0 39px -17px rgba(0,0,0,.78),inset 0 -29px 39px -18px rgba(0,0,0,.62)':'inset 0 0 0 2px #1f1303,inset 0 0 0 4px #e8ca7e4d','filter':'none','backdrop-filter':'none'})){if(rim.style.getPropertyValue(k)!==v)rim.style.setProperty(k,v,'important')}if(rim.id==='ah2288-mobile-complete-rim'&&innerWidth<=900){for(const[k,v]of Object.entries({position:'fixed',inset:'98px 14px 88px',width:'calc(100% - 28px)',height:'calc(100dvh - 186px)','box-sizing':'border-box',margin:'0',padding:'0','z-index':'2147483647'}))rim.style.setProperty(k,v,'important');for(const outline of rim.querySelectorAll('rect'))outline.style.setProperty('display','none','important');}if(rim.id==='ah-official-rim'||rim.id==='ah2288-mobile-complete-rim'){rim.style.setProperty('box-shadow','inset 0 0 0 2px #1f1303,inset 0 0 0 4px #67502a,inset 0 0 0 6px #1f1303,inset 0 42px 52px -18px rgba(0,0,0,.88),inset 31px 0 39px -17px rgba(0,0,0,.78),inset -31px 0 39px -17px rgba(0,0,0,.78),inset 0 -29px 39px -18px rgba(0,0,0,.62)','important');rim.style.setProperty('background','none','important');rim.style.setProperty('pointer-events','none','important')}}}apply();addEventListener('load',apply);addEventListener('ah:persistent-route-complete',apply);new MutationObserver(apply).observe(document.body,{childList:true,subtree:true});})();

/* Smaller cells and recessed content; never draw a perimeter gold border. */



/* Mobile perimeter uses one continuous texture rather than independent corner patches. */
(()=>{
 function align(){if(innerWidth>900)return;
  for(const corner of document.querySelectorAll('.ah-r932-corner-mask,.ah2123-solid-corner,.ah-opaque-corner,[id^="ah2266-corner-"]'))corner.style.setProperty('display','none','important');
  const outer=document.getElementById('ah2376-mobile-outer-surface');if(!outer)return;
  const svg='<svg xmlns="http://www.w3.org/2000/svg" width="'+innerWidth+'" height="'+innerHeight+'"><defs><mask id="hole"><rect width="100%" height="100%" fill="white"/><rect x="14" y="98" width="'+Math.max(0,innerWidth-28)+'" height="'+Math.max(0,innerHeight-186)+'" rx="18" fill="black"/></mask></defs><rect width="100%" height="100%" fill="white" mask="url(#hole)"/></svg>';
  const value='url("data:image/svg+xml,'+encodeURIComponent(svg)+'")';
  for(const prefix of ['', '-webkit-']){outer.style.setProperty(prefix+'mask-image',value,'important');outer.style.setProperty(prefix+'mask-size','100% 100%','important');outer.style.setProperty(prefix+'mask-origin','border-box','important');outer.style.setProperty(prefix+'mask-clip','border-box','important');outer.style.setProperty(prefix+'mask-position','0 0','important');outer.style.setProperty(prefix+'mask-repeat','no-repeat','important');outer.style.setProperty(prefix+'mask-composite',prefix?'source-over':'add','important');}
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',align,{once:true});else align();
 addEventListener('load',align);addEventListener('resize',align);addEventListener('ah:persistent-route-complete',align);
 let queued=false;new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;align()})}).observe(document.documentElement,{subtree:true,childList:true});
})();
/* White copy on blue information signs uses Rajdhani in both layouts. */
(()=>{
 const selector='.ah-home-process-box li,.ah-home-process-box li *, .home-process-stage__list li,.home-process-stage__list li *, .ah1846-info-detail,.ah1846-info-detail *, .ah2123-disclaimer-screen p,.ah2123-disclaimer-screen p *, .ah2172-explore-quote,.ah2172-explore-quote *';
 function apply(){const size=innerWidth<=900?'16pt':'16px';for(const node of document.querySelectorAll(selector)){if(node.style.getPropertyValue('font-family')!=='Rajdhani, system-ui, sans-serif')node.style.setProperty('font-family','Rajdhani, system-ui, sans-serif','important');const textSize=node.closest('.ah2172-explore-quote')?(innerWidth<=900?'20px':'16px'):size;if(node.style.getPropertyValue('font-size')!==textSize)node.style.setProperty('font-size',textSize,'important')}}
 let pending=false;function queue(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;apply()})}
 apply();addEventListener('resize',queue);addEventListener('ah:persistent-route-complete',queue);new MutationObserver(queue).observe(document.documentElement,{childList:true,subtree:true});
})();
