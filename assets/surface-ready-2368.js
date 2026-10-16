/* Reveal a fully prepared surface on every visit, independently of the one-time intro. */
(()=>{
 const root=document.documentElement;root.dataset.ahSurfacePreparing='1';
 const nextFrame=()=>new Promise(resolve=>requestAnimationFrame(resolve));
 async function prepare(){
  const startedAt=performance.now();root.dataset.ahSurfacePreparationStarted=String(startedAt);const timings={};const mark=key=>{timings[key]=Math.round(performance.now()-startedAt);root.dataset.ahSurfaceTimings=JSON.stringify(timings);};
  // Same-origin routed pages reuse decoded materials for the life of the preview.
  let owner=window;
  try{if(top!==window&&top.location.origin===location.origin)owner=top;}catch(_){}
  const decoded=owner.AHDecodedMaterials||(owner.AHDecodedMaterials=new Map());
  const decode=src=>{if(!decoded.has(src)){const image=new Image();
   // Solution CSS renders these vectors itself; do not rasterize a second hidden copy.
   const ready=(innerWidth<=900||/the-solution|solution-desktop|solution-mobile|services/.test(location.pathname))&&/\.svg(?:[?#]|$)/.test(src)
     ?new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=reject;image.src=src;})
     :(image.src=src,image.decode());
   decoded.set(src,ready.catch(()=>{decoded.delete(src);}));
  }return decoded.get(src);};
  // Start fonts, visible images and shared materials together rather than serially.
  const images=[...document.querySelectorAll('main img')].filter(image=>{const b=image.getBoundingClientRect();return b.top<innerHeight&&b.bottom>0;});
  for(const image of images){image.loading='eager';image.fetchPriority='high';}
  const imageReady=image=>image.complete?Promise.resolve():new Promise(resolve=>{
   const done=()=>{image.removeEventListener('load',done);image.removeEventListener('error',done);resolve();};
   image.addEventListener('load',done,{once:true});image.addEventListener('error',done,{once:true});
   if(image.complete)done();
  });
  const fonts=document.fonts?[document.fonts.load('900 20px Orbitron'),document.fonts.load('600 20px Rajdhani')]:[];
  // Only the materials actually painted below gate readiness.
  // Image.decode() can wait on the compositor of a hidden destination frame.
  // Wait for image data instead; its final layout is committed by the router.
  const assetsReady=Promise.allSettled([Promise.allSettled(fonts).then(()=>mark('fonts')),Promise.allSettled(images.map(imageReady)).then(()=>mark('images'))]);
  window.AHFitHomeTitles?.();
  // The embedded window prepares independently; its dimensions and gold rim are already fixed.
  // It must not hold the entire page behind two sequential 12-second waits.
  mark('childFrameDeferred');
  // Closed interactive panels load independently and do not hold initial page readiness.
  // Decode the actual final background/material images before the first visible composite.
  const urls=new Set();
  for(const el of [root,document.body,...document.body.querySelectorAll('main,main>section,#ah-mobile-content-backdrop,#ah2376-mobile-outer-surface,#ah-official-rim,.ah-persistent-outer-rim,.ah-persistent-gold-rim,#ah-page-progress,#header-send-message,#ah-mobile-message,#primary-nav,#primary-nav a,#ah-mobile-footer,#ah-mobile-footer a,.home-hero-engine-frame,.ah2123-mobile-window,.solution-process-window')]){
   const bounds=el.getBoundingClientRect();if(!bounds.width||!bounds.height||bounds.top>innerHeight||bounds.bottom<0)continue;
   for(const pseudo of ['', '::before','::after']){
    const c=getComputedStyle(el,pseudo);if(c.display==='none')continue;
    for(const value of [c.backgroundImage,c.borderImageSource])for(const match of value.matchAll(/url\(["']?([^"')]+)["']?\)/g))if(!match[1].startsWith('data:'))urls.add(match[1]);
   }
  }
  // Start final background decoding alongside visible images, rather than after them.
  const finalMaterialsReady=Promise.allSettled([assetsReady,Promise.allSettled([...urls].map(decode)).then(()=>mark('materials'))]);
  // Wait for the shared button artwork/font commits before revealing shell controls.
  const buttons=[...document.querySelectorAll('[data-ah-brand-carbon],#header-send-message,#ah-mobile-message,a.message')].filter(button=>{const b=button.getBoundingClientRect();return b.width>0&&b.height>0&&(b.top<innerHeight&&b.bottom>0&&(innerWidth<=900||button.hasAttribute('data-ah-initial-art-gate')));});
  const buttonArtworkReady=Promise.allSettled(buttons.map(button=>button.dataset.ahArtworkReady==='1'?Promise.resolve():new Promise(resolve=>{let timer;const observer=new MutationObserver(()=>{if(button.dataset.ahArtworkReady==='1')done()});const done=()=>{observer.disconnect();clearTimeout(timer);resolve()};observer.observe(button,{attributes:true,attributeFilter:['data-ah-artwork-ready']});timer=setTimeout(done,innerWidth>900?1000:600)})));
  // Run artwork readiness alongside materials, avoiding a second serial hold.
  await Promise.allSettled([finalMaterialsReady,buttonArtworkReady]);
  // The two required font faces were already awaited in assetsReady.
  mark('finalMaterials');
  // Hidden routed frames can have their animation frames heavily throttled.
  // The router already waits for two visible frames before committing the page.
  if(!window.frameElement?.classList.contains('ah-shell-content-frame')){await nextFrame();await nextFrame();}
  if(root.dataset.ahHomeWindowFallback==='1')document.addEventListener('click',event=>{if(event.target.closest?.('[data-ah-home-window-control],#ah2123-mobile-critical-button'))delete root.dataset.ahHomeWindowFallback;},true);
  window.AHFitHomeTitles?.();
  root.classList.remove('ah2259-preparing');root.dataset.ahSurfacePreparationMs=String(Math.round(performance.now()-startedAt));window.AHApplyApprovedDesktop?.();root.dataset.ahHomeSurfaceReady='1';root.removeAttribute('data-ah-home-first-paint');document.dispatchEvent(new Event('ah:home-surface-ready'));if(!document.getElementById('ah1609-intro'))window.AHLoadingReady?.();
 }
 window.AHSurfaceReady=new Promise(resolve=>document.addEventListener('ah:home-surface-ready',resolve,{once:true}));
 const reveal=()=>{if(root.dataset.ahHomeSurfaceReady==='1')return;root.classList.remove('ah2259-preparing');window.AHApplyApprovedDesktop?.();root.dataset.ahHomeSurfaceReady='1';root.removeAttribute('data-ah-home-first-paint');document.dispatchEvent(new Event('ah:home-surface-ready'));window.AHLoadingReady?.();};
 const run=()=>{if(innerWidth>900){window.AHApplyApprovedDesktop?.();reveal();const main=document.querySelector('body>main#main-content');if(main){for(const [key,value] of Object.entries({display:'block',visibility:'visible',opacity:'1'}))main.style.setProperty(key,value,'important');main.style.setProperty('overflow-y','scroll','important');main.style.setProperty('pointer-events','auto','important');}}const deadline=setTimeout(reveal,5000);prepare().catch(reveal).finally(()=>clearTimeout(deadline));};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();

 // Initial content must stay visible unless an actual routed frame replaces it.
 const showInitialMain=()=>{if([...document.querySelectorAll('body>iframe.ah-shell-content-frame')].some(f=>getComputedStyle(f).visibility==='visible'&&parseFloat(getComputedStyle(f).opacity)>.5))return;const main=document.querySelector('body>main#main-content');if(!main)return;for(const [p,v]of Object.entries({display:'block',visibility:'visible',opacity:'1','pointer-events':'auto'}))main.style.setProperty(p,v,'important');root.classList.remove('page-shield-arrival','ah2280-first-shield');if(!document.getElementById('ah1609-intro'))document.getElementById('ah2280-first-shield')?.remove();};
 document.addEventListener('ah:home-surface-ready',showInitialMain);addEventListener('ah:first-intro-finished',showInitialMain);addEventListener('pageshow',()=>{if(root.dataset.ahHomeSurfaceReady==='1')showInitialMain()});
})();


