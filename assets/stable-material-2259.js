/* Reveal a fully prepared surface on every visit, independently of the one-time intro. */
(()=>{
 const root=document.documentElement;root.classList.add('ah2259-preparing');
 const nextFrame=()=>new Promise(resolve=>requestAnimationFrame(resolve));
 async function prepare(){
  const startedAt=performance.now();root.dataset.ahSurfacePreparationStarted=String(startedAt);const timings={};const mark=key=>{timings[key]=Math.round(performance.now()-startedAt);root.dataset.ahSurfaceTimings=JSON.stringify(timings);};
  const decoded=new Map();
  const decode=src=>{if(!decoded.has(src)){const image=new Image();image.src=src;decoded.set(src,image.decode().catch(()=>{}));}return decoded.get(src);};
  // Start fonts, visible images and shared materials together rather than serially.
  const images=[...document.querySelectorAll('#home-machine-grid img,#ah2123-mobile-windows img')];
  const fonts=document.fonts?[document.fonts.ready,document.fonts.load('900 20px Orbitron'),document.fonts.load('700 20px Rajdhani')]:[];
  const essentials=['./assets/honeycomb-mobile-continuous-2245.webp','./assets/hammered-gold-brand.svg'];
  const assetsReady=Promise.allSettled([Promise.allSettled(fonts).then(()=>mark('fonts')),Promise.allSettled(images.map(image=>image.decode?.())).then(()=>mark('images')),Promise.allSettled(essentials.map(src=>decode(new URL(src,location.href).href))).then(()=>mark('materials'))]);
  window.AHFitHomeTitles?.();
  const frame=document.querySelector('#home-machine-rolodex,#ah2123-mobile-critical iframe');
  if(frame){
   // The child signals only after its fonts and deterministic card geometry are ready.
   await new Promise(resolve=>{
    let finished=false,timer;const started=performance.now();const finish=()=>{if(finished)return;finished=true;clearTimeout(timer);removeEventListener('message',message);resolve();};
    const message=event=>{if(event.source===frame.contentWindow&&event.data?.type==='automated-hearts:home-window-first-frame')finish();};
    const check=()=>{if(performance.now()-started>12000){root.dataset.ahHomeWindowFallback='1';finish();return;}try{if(frame.contentWindow?.__AH1814_FIRST_FRAME_SENT__){finish();return;}}catch(_){}timer=setTimeout(check,50);};
    addEventListener('message',message);frame.addEventListener('error',finish,{once:true});check();
   });
  }
  mark('childFrame');
  const host=document.querySelector('.home-hero-rolodex-frame,#ah2123-mobile-critical');
  if(host){
   const started=performance.now();
   while(!host.style.getPropertyValue('border-image') || (host.matches('.home-hero-rolodex-frame') && host.dataset.ah1930Surface!=='live')){
    if(performance.now()-started>12000)break;
    await nextFrame();
   }
  }
  mark('hostSurface');
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
  root.classList.remove('ah2259-preparing');root.dataset.ahSurfacePreparationMs=String(Math.round(performance.now()-startedAt));root.dataset.ahHomeSurfaceReady='1';document.dispatchEvent(new Event('ah:home-surface-ready'));
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',prepare,{once:true});else prepare();
})();
