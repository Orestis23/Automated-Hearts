/* Reveal a fully prepared surface on every visit, independently of the one-time intro. */
(()=>{
 const root=document.documentElement;root.classList.add('ah2259-preparing');
 const nextFrame=()=>new Promise(resolve=>requestAnimationFrame(resolve));
 async function prepare(){
  const startedAt=performance.now();root.dataset.ahSurfacePreparationStarted=String(startedAt);const timings={};const mark=key=>{timings[key]=Math.round(performance.now()-startedAt);root.dataset.ahSurfaceTimings=JSON.stringify(timings);};
  const decoded=new Map();
  const decode=src=>{if(!decoded.has(src)){const image=new Image();image.src=src;decoded.set(src,image.decode().catch(()=>{}));}return decoded.get(src);};
  // Start fonts, visible images and shared materials together rather than serially.
  const images=[...document.querySelectorAll('#home-machine-grid img,#ah2123-mobile-windows img')].filter(image=>{const b=image.getBoundingClientRect();return b.top<innerHeight&&b.bottom>0;});
  const fonts=document.fonts?[document.fonts.load('900 20px Orbitron'),document.fonts.load('600 20px Rajdhani')]:[];
  const essentials=['./assets/honeycomb-fine-tile-2367.svg','./assets/hammered-gold-brand.svg'];
  const assetsReady=Promise.allSettled([Promise.allSettled(fonts).then(()=>mark('fonts')),Promise.allSettled(images.map(image=>image.decode?.())).then(()=>mark('images')),Promise.allSettled(essentials.map(src=>decode(new URL(src,location.href).href))).then(()=>mark('materials'))]);
  window.AHFitHomeTitles?.();
  // The embedded window prepares independently; its dimensions and gold rim are already fixed.
  // It must not hold the entire page behind two sequential 12-second waits.
  mark('childFrameDeferred');
  await assetsReady;
  // Decode the actual final background/material images before the first visible composite.
  const urls=new Set();
  for(const el of [root,document.body,...document.body.querySelectorAll('main,main>section,#ah-page-progress,#header-send-message,#ah-mobile-message,#primary-nav,#primary-nav a,#ah-mobile-footer,#ah-mobile-footer a,.home-hero-engine-frame,.ah2123-mobile-window,.solution-process-window')]){
   const bounds=el.getBoundingClientRect();if(!bounds.width||!bounds.height||bounds.top>innerHeight||bounds.bottom<0)continue;
   for(const pseudo of ['', '::before','::after']){
    const c=getComputedStyle(el,pseudo);if(c.display==='none')continue;
    for(const value of [c.backgroundImage,c.borderImageSource])for(const match of value.matchAll(/url\(["']?([^"')]+)["']?\)/g))if(!match[1].startsWith('data:'))urls.add(match[1]);
   }
  }
  await Promise.allSettled([...urls].map(decode));
  mark('finalMaterials');
  await nextFrame();await nextFrame();
  if(root.dataset.ahHomeWindowFallback==='1')document.addEventListener('click',event=>{if(event.target.closest?.('[data-ah-home-window-control],#ah2123-mobile-critical-button'))delete root.dataset.ahHomeWindowFallback;},true);
  window.AHFitHomeTitles?.();
  root.classList.remove('ah2259-preparing');root.dataset.ahSurfacePreparationMs=String(Math.round(performance.now()-startedAt));root.dataset.ahHomeSurfaceReady='1';document.dispatchEvent(new Event('ah:home-surface-ready'));if(!document.getElementById('ah1609-intro'))window.AHLoadingReady?.();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',prepare,{once:true});else prepare();
})();
