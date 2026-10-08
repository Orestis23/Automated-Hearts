/* Round 2104: direct first-visit intro. The real page is already mounted.
   The first-visit typing/shield experience overlays the current page; it never
   swaps or rewrites the page document. */
(() => {
 'use strict';
 const query=new URLSearchParams(location.search);
 const desktop=matchMedia('(min-width:901px)').matches;
 const key='ah-site-first-visit-intro-v1219';
 let seen=false;try{seen=localStorage.getItem(key)==='1'||document.cookie.split(';').some(v=>v.trim()==='ah_site_intro_seen=1');}catch(_){}
 const embedded=query.get('ah_embed')==='1'||(window.self!==window.top&&query.get('intro')!=='1');
 if(embedded||(seen&&query.get('intro')!=='1'))return;
 /* Round 1966: first-access means first ACCESS, not first completed animation.
    Set the persistent marker before typing starts so refresh/back/revisit cannot replay it. */
 if(query.get('intro')!=='1'){
  try{localStorage.setItem(key,'1');document.cookie='ah_site_intro_seen=1; Max-Age=31536000; Path=/; SameSite=Lax';}catch(_){}
 }
 const TYPING_RATE=0.7;
 const sleep=ms=>new Promise(r=>setTimeout(r,ms));
 const painted=()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
 let ctx=null,buffers={},artURL='./assets/page-shield-official-honeycomb-r1877.webp',openReady=Promise.resolve(),impactAudio=null,impactPrimed=false,cacheWarmReady=Promise.resolve();

 /* Round 1920: install the actual page before typing begins.  A short first-paint
    hold prevents any unstyled/half-styled shell frame from becoming visible. */
 window.__AH_EARLY_MOBILE_INTRO_STARTED__=true;
 window.__AH_EARLY_DESKTOP_INTRO_STARTED__=true;
 window.__AH_SITE_FIRST_VISIT_INTRO_1194=true;
 document.documentElement.classList.add('ah1918-real-shell-mounted');

 async function waitForStableShell(){
  // Deferred shell builders and stylesheets must finish before a visible frame.
  if(document.readyState==='loading')await new Promise(resolve=>document.addEventListener('DOMContentLoaded',resolve,{once:true}));
  await Promise.allSettled([
   document.fonts.load('700 16px Orbitron','Automated Hearts'),
   ...[artURL].map(src=>{const img=new Image();img.src=src;return img.decode();})
  ]);
  // Typing needs only its own font and artwork; the page prepares behind it.
  await painted();
 }

 const textStyle=document.createElement('style');textStyle.textContent='@layer ah2267-intro-readable{html body #ah1609-intro .ah1912-intro-copy,html body #ah1609-intro .ah1912-intro-copy *{color:#f2fbff!important;-webkit-text-fill-color:#f2fbff!important;text-shadow:0 2px 3px #000,0 0 8px #000!important;}html body #ah1609-intro .ah1912-intro-copy .pink,html body #ah1609-intro .ah1912-intro-copy .pink *{color:#ff2ea8!important;-webkit-text-fill-color:#ff2ea8!important;}html body #ah1609-intro .ah1912-intro-copy .green,html body #ah1609-intro .ah1912-intro-copy .green *{color:#8fffd7!important;-webkit-text-fill-color:#8fffd7!important;}}';document.head.prepend(textStyle);
 const shellReady=waitForStableShell();
 const overlay=document.createElement('div');
 overlay.id='ah1609-intro';
 overlay.innerHTML=`<style>
 #ah1609-intro{position:fixed;z-index:2147483647;display:block;color:#f2fbff;overflow:hidden;contain:paint;isolation:isolate;box-sizing:border-box;pointer-events:auto;background:transparent;top:var(--current-frame-top,96px);right:var(--current-frame-side,88px);bottom:var(--current-frame-bottom,96px);left:var(--current-frame-side,88px);border-radius:var(--current-frame-radius,32px)}
 #ah1609-intro::before{content:none!important;display:none!important}
 #ah1609-intro::after{content:"";position:absolute;z-index:4;inset:0;pointer-events:none;border:4px solid #b5862e;border-radius:inherit;box-sizing:border-box;box-shadow:inset 0 0 0 1px rgba(238,211,125,.48),0 0 0 1px rgba(43,27,6,.98)}
 #ah1609-intro .ah1912-intro-panel{position:absolute;z-index:1;inset:4px;display:grid;place-items:center;overflow:hidden;box-sizing:border-box;background:#050b11 url("./assets/honeycomb-fine-tile-2367.svg") center/cover no-repeat;border:0;border-radius:calc(var(--current-frame-radius,32px) - 4px);will-change:transform;transform-origin:center;contain:paint;backface-visibility:hidden;transform:translate3d(0,0,0);transition:transform 1500ms cubic-bezier(.22,.66,.24,1);filter:none!important;-webkit-filter:none!important;-webkit-backdrop-filter:none!important;backdrop-filter:none!important}
 #ah1609-intro .ah1912-intro-panel::before{content:"";position:absolute;z-index:1;left:50%;top:58%;width:clamp(92px,18vw,180px);height:clamp(144px,28vw,282px);transform:translate3d(-50%,-50%,0);background:url("./assets/ah-empty-transparent.svg") center/contain no-repeat;opacity:.98;filter:none!important;-webkit-filter:none!important;pointer-events:none}
 #ah1609-intro .ah1912-intro-copy{position:relative;z-index:2;width:min(84vw,760px);font:700 clamp(22px,2.05vw,36px)/1.48 Orbitron,system-ui,sans-serif;letter-spacing:.012em;text-shadow:none}
 @media(max-width:900px){
   #ah1609-intro{top:var(--current-frame-top,62px);right:var(--current-frame-side,10px);bottom:var(--current-frame-bottom,74px);left:var(--current-frame-side,10px);border-radius:var(--current-frame-radius,18px);overflow:hidden;background:transparent}
   #ah1609-intro .ah1912-intro-panel{inset:2px;border:0;border-radius:calc(var(--current-frame-radius,18px) - 2px);box-shadow:none;background:#02070c}
   #ah1609-intro .ah1912-intro-panel::before{content:none;display:none}
   #ah1609-intro .ah1912-intro-panel::after{content:"";position:absolute;inset:0;z-index:1;background:rgba(221,232,233,.64);backdrop-filter:blur(1px);-webkit-backdrop-filter:blur(1px);pointer-events:none}
   #ah1609-intro .ah1912-intro-copy,#ah1609-intro .ah1912-intro-copy *{color:#07111b!important;-webkit-text-fill-color:#07111b!important;text-shadow:none!important}
   #ah1609-intro .cursor{background:#07111b!important}
   #ah1609-intro::before{inset:2px;border-radius:calc(var(--current-frame-radius,18px) - 2px);background:linear-gradient(to bottom,rgba(0,0,0,.70),rgba(0,0,0,.40) 16px,rgba(0,0,0,.17) 40px,rgba(0,0,0,.06) 64px,transparent 88px) top/100% 88px no-repeat,linear-gradient(to right,rgba(0,0,0,.60),rgba(0,0,0,.34) 16px,rgba(0,0,0,.14) 40px,rgba(0,0,0,.05) 64px,transparent 88px) left/88px 100% no-repeat,linear-gradient(to left,rgba(0,0,0,.60),rgba(0,0,0,.34) 16px,rgba(0,0,0,.14) 40px,rgba(0,0,0,.05) 64px,transparent 88px) right/88px 100% no-repeat,linear-gradient(to top,rgba(0,0,0,.46),rgba(0,0,0,.25) 16px,rgba(0,0,0,.10) 40px,rgba(0,0,0,.035) 64px,transparent 88px) bottom/100% 88px no-repeat;box-shadow:inset 0 6px 16px rgba(0,0,0,.22),inset 6px 0 16px rgba(0,0,0,.16),inset -6px 0 16px rgba(0,0,0,.16),inset 0 -6px 16px rgba(0,0,0,.12)}
   #ah1609-intro::after{border-width:2px;border-color:#b5862e;box-shadow:inset 0 0 0 1px rgba(238,211,125,.42),0 0 0 1px rgba(43,27,6,.96)}
   #ah1609-intro .ah1912-intro-copy{width:min(84%,440px);padding:16px 16px 12px;box-sizing:border-box;border:0;border-radius:10px;background:transparent;box-shadow:none;filter:none;-webkit-backdrop-filter:none;backdrop-filter:none;font-size:clamp(15px,4.1vw,20px);line-height:1.38;text-shadow:none}
   #ah1609-intro p{margin:0 0 .62em;min-height:1.25em}
 }
 #ah1609-intro p{margin:0 0 .8em;min-height:1.45em}#ah1609-intro .pink{color:#ff2ea8}#ah1609-intro .green{color:#8fffd7}
 #ah1609-intro button{color:#ff2ea8;background:#0b1728;border:1px solid #8fffd7;padding:16px 24px;font:600 18px system-ui;cursor:pointer}
 #ah1609-intro .cursor{display:inline-block;width:.5em;height:1em;background:#8fffd7;vertical-align:-.1em;margin-left:.12em;animation:ah1609-blink .8s steps(1,end) infinite}
 #ah1609-intro small{display:block;font:14px/1.5 system-ui;color:#d8e7e4;text-align:center} @keyframes ah1609-blink{50%{opacity:0}}
 </style><div class="ah1912-intro-panel"><div class="ah1912-intro-copy"><div class="story" hidden><p></p><p></p><p></p><p></p></div></div></div>`;
 document.body.appendChild(overlay);document.getElementById('ah2280-first-shield')?.remove();document.documentElement.classList.remove('ah2280-first-shield');overlay.style.setProperty('display','block','important');overlay.style.setProperty('visibility','visible','important');overlay.style.setProperty('opacity','1','important');if(!desktop){for(const[k,v]of Object.entries({top:'98px',left:'10px',right:'10px',bottom:'88px',width:'calc(100vw - 20px)',height:'calc(100dvh - 186px)'}))overlay.style.setProperty(k,v,'important')}
 let routeDismissed=false;
 const dismissForRoute=()=>{
  routeDismissed=true;
  overlay.getAnimations?.({subtree:true}).forEach(a=>a.cancel());
  overlay.remove();
  try{impactAudio?.pause();ctx?.close().catch(()=>{});}catch(_){}
  document.documentElement.removeAttribute('data-ah1920-prepaint');
  document.getElementById('ah1920-first-paint-hold')?.remove();
 };
 addEventListener('ah:persistent-route-start',dismissForRoute,{once:true});
 const shield=overlay.querySelector('.ah1912-intro-panel'),story=overlay.querySelector('.story'),lines=[...story.querySelectorAll('p')];
 if(!desktop){for(const[k,v]of Object.entries({width:'auto',height:'auto',inset:'4px',display:'grid',visibility:'visible',opacity:'1'}))shield.style.setProperty(k,v,'important')}
 shield.style.setProperty('background','#07111b','important');
 const material=document.createElement('style');material.textContent='#ah1609-intro .ah1912-intro-panel::before,#ah1609-intro .ah1912-intro-panel::after{display:none!important}#ah1609-intro .ah1912-intro-copy{background:transparent!important;padding:0!important;border-radius:0!important;font-size:clamp(39.6px,3.69vw,64.8px)!important;line-height:1.3!important;width:88%!important;text-shadow:0 2px 3px #000,0 0 8px rgba(0,0,0,.9)!important;}@media(max-width:900px){#ah1609-intro .ah1912-intro-copy{font-size:clamp(27px,7.38vw,36px)!important;}}';overlay.append(material);const heartDepth=document.createElement('style');heartDepth.textContent=`#ah1609-intro .ah1912-intro-panel::before{content:""!important;display:block!important;position:absolute!important;inset:0!important;left:0!important;top:0!important;width:100%!important;height:100%!important;transform:none!important;background:url("./assets/page-shield-official-honeycomb-r1877.webp") center/cover no-repeat!important;opacity:1!important;filter:contrast(1.2)!important;-webkit-filter:contrast(1.2)!important;z-index:0!important;pointer-events:none!important}#ah1609-intro .ah1912-intro-panel::after{content:""!important;display:block!important;position:absolute!important;inset:0!important;border-radius:inherit!important;padding:4.5px!important;box-sizing:border-box!important;background:url("./assets/hammered-gold-brand.svg") center/48px 48px repeat!important;-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0)!important;-webkit-mask-composite:xor!important;mask-composite:exclude!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;z-index:5!important;pointer-events:none!important}#ah1609-intro::after{display:none!important}@media(max-width:900px){#ah1609-intro .ah1912-intro-panel::after{padding:1.5px!important}}`;overlay.append(heartDepth);const heartBackground=document.createElement('div');heartBackground.className='ah-intro-heart-background';heartBackground.setAttribute('aria-hidden','true');heartBackground.style.cssText='position:absolute!important;inset:0!important;z-index:0!important;background:#07111b url("./assets/page-shield-official-honeycomb-r1877.webp") center/cover no-repeat!important;filter:contrast(1.2)!important;pointer-events:none!important;border-radius:inherit!important;';shield.prepend(heartBackground);overlay.querySelector('.ah1912-intro-copy').style.setProperty('text-shadow','0 2px 3px #000,0 0 8px rgba(0,0,0,.9)','important');
 const cursor=document.createElement('span');cursor.className='cursor';
 async function bytes(url){const res=await fetch(url,{cache:'force-cache'});if(!res.ok)throw Error('Asset unavailable');return res.arrayBuffer();}
 function sound(name,when=ctx?.currentTime||0){
  if(!ctx||ctx.state!=='running'||!buffers[name])return;
  const src=ctx.createBufferSource(),gain=ctx.createGain();src.buffer=buffers[name];src.connect(gain);gain.connect(ctx.destination);
  const volume=name==='open'?.72:name==='type'?.32:.25;
  if(name==='type')src.playbackRate.value=.96+Math.random()*.08;gain.gain.setValueAtTime(volume,when);
  if(name==='open'){gain.gain.setValueAtTime(volume,when+Math.max(0,src.buffer.duration-.5));gain.gain.linearRampToValueAtTime(0,when+src.buffer.duration);}
  src.start(when);return src;
 }
 function resumeAudio(){
  // Autoplay restrictions must never block the introduction or shield.
  if(ctx&&ctx.state!=='running')ctx.resume().catch(()=>{});
 }
 function primeImpactAudio(){
  resumeAudio();
  if(!impactAudio||impactPrimed)return;
  const oldVolume=impactAudio.volume;
  try{
   impactAudio.volume=0;impactAudio.currentTime=0;
   const p=impactAudio.play();
   if(p&&typeof p.then==='function')p.then(()=>{impactAudio.pause();impactAudio.currentTime=0;impactAudio.volume=oldVolume;impactPrimed=true;}).catch(()=>{impactAudio.volume=oldVolume;});
  }catch(_){impactAudio.volume=oldVolume;}
 }
 document.addEventListener('pointerdown',primeImpactAudio,{capture:true,passive:true});
 document.addEventListener('keydown',primeImpactAudio,{capture:true});
 const escaped=t=>t.replace(/[&<>']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;'}[c]));
 function render(i,text){lines[i].innerHTML=escaped(text).replace(/AI/g,'<span class="pink">AI</span>').replace(/Human|maximum efficiency/g,'<span class="green">$&</span>');lines[i].appendChild(cursor);}
 let strings=['','','',''];
 async function type(i,text){for(const char of text){if(routeDismissed)throw Error('Intro dismissed for navigation');strings[i]+=char;render(i,strings[i]);sound('type');await sleep((/[.,!?]/.test(char)?330:char===' '?95:38+Math.random()*62)/TYPING_RATE);}}
 async function back(i,n){for(let j=0;j<n;j++){if(routeDismissed)throw Error('Intro dismissed for navigation');strings[i]=strings[i].slice(0,-1);render(i,strings[i]);sound('delete');await sleep(50/TYPING_RATE);}}
 async function start(){
  /* The real shell is already the live document. Wait until its CSS/font authority is
     committed, reveal the shell + intro together, then type without any document swap. */
  // Asset warming continues behind the already lowered shield.
  shield.style.setProperty("transform","translate3d(0,0,0)");
  if(routeDismissed)return;
  document.documentElement.removeAttribute('data-ah1920-prepaint');
  document.getElementById('ah1920-first-paint-hold')?.remove();
  document.documentElement.classList.add('ah1918-shell-visible','ah1920-shell-visible');
  story.hidden=false;document.querySelectorAll('#ah2445-early-heart').forEach(el=>el.remove());window.AHLoadingReady?.();
  // Reserve each completed line's wrapping height before the first character paints.
  const finalLines=['Prioritizing Job-Retention','Human-Centric Automation','AI should elevate the human & the mind.'];
  lines[3].style.display='none';
  finalLines.forEach((text,i)=>{lines[i].textContent=text;});
  const lineHeights=finalLines.map((_,i)=>lines[i].getBoundingClientRect().height);
  finalLines.forEach((_,i)=>{lines[i].style.setProperty('height',lineHeights[i]+'px','important');lines[i].style.setProperty('min-height',lineHeights[i]+'px','important');lines[i].textContent='';});
  await type(0,'Prioritizing Job-Retention');await sleep(250/TYPING_RATE);
  await type(1,'Human-Centric Automation');await sleep(250/TYPING_RATE);
  await type(2,"AI should elevate the human & the mind.");await sleep(350/TYPING_RATE);cursor.remove();

  /* Round 1918: there is deliberately NO second document.write() here.  The outer rim,
     footer keys, message control, heart and page-name screen are the same DOM nodes that
     were visible at the first typed character and will remain mounted through routing. */
  if(document.documentElement.dataset.ahHomeSurfaceReady!=='1')await new Promise(resolve=>document.addEventListener('ah:home-surface-ready',resolve,{once:true}));
  // Settle underlying controls while the shield still fully covers the page.
  window.dispatchEvent(new CustomEvent('ah:first-intro-preparing-reveal'));
  window.AHApplyDigitalSigns?.();
  window.AHFitHomeTitles?.();
  // Preserve the selected artwork through the entire opening motion.
  await painted();

  /* The top-impact sound gets the entire typing sequence to fetch/decode. Give it one
     short final grace window before motion begins, but never allow sound to stall the UI. */
  void openReady;
  resumeAudio();

  /* Round 1917: one compositor transform over exactly 2 seconds.
     WebAudio is scheduled for the calculated top when available; transitionend
     provides the visual-clock fallback and an HTMLAudio attempt if WebAudio was
     unavailable or suspended. */
  const durationMs=2000;
  shield.style.setProperty('transition','none','important');
  shield.style.setProperty('transform','translate3d(0,0,0)');
  shield.style.willChange='transform';
  shield.style.backfaceVisibility='hidden';
  await painted();
  window.__AH_FIRST_INTRO_RISE_CLOCK__={audioMaster:!!(ctx&&ctx.state==='running'&&buffers.open),duration:durationMs/1000};
  window.dispatchEvent(new CustomEvent('ah:first-intro-raising',{detail:{intro:overlay}}));

  let scheduledImpact=null,scheduledWithWebAudio=false,topFinished=false;
  resumeAudio();
  const playImpactFallback=()=>{
   if(scheduledWithWebAudio&&ctx&&ctx.state==='running')return;
   resumeAudio();
   if(ctx&&ctx.state==='running'&&buffers.open){
    try{if(sound('open')){window.__AH_FIRST_INTRO_IMPACT_PLAYED__='webaudio-top';return;}}catch(_){}
   }
   if(impactAudio){
    try{impactAudio.pause();impactAudio.currentTime=0;impactAudio.volume=.88;const p=impactAudio.play();
     if(p&&typeof p.then==='function')p.then(()=>{window.__AH_FIRST_INTRO_IMPACT_PLAYED__='htmlaudio-top';}).catch(()=>{});
    }catch(_){}
   }
  };
  await new Promise(resolve=>{
   let timer=0,motion=null;
   const done=()=>{
    if(topFinished)return;topFinished=true;clearTimeout(timer);
    shield.removeEventListener('transitionend',onEnd);shield.removeEventListener('transitioncancel',onCancel);
    try{motion?.cancel()}catch(_){}
    shield.style.setProperty('transition','none','important');
    shield.style.setProperty('transform','translate3d(0,-101%,0)','important');
    if(scheduledWithWebAudio)window.__AH_FIRST_INTRO_IMPACT_PLAYED__='webaudio-scheduled';else playImpactFallback();
    window.dispatchEvent(new CustomEvent('ah:first-intro-top',{detail:{intro:overlay}}));resolve();
   };
   const onEnd=e=>{if(e.target===shield&&e.propertyName==='transform')done();};
   const onCancel=e=>{if(e.target===shield&&e.propertyName==='transform')done();};
   timer=setTimeout(done,durationMs+260);
   requestAnimationFrame(()=>{
    if(typeof shield.animate==='function'){
     try{
      motion=shield.animate([{transform:'translate3d(0,0,0)'},{transform:'translate3d(0,-101%,0)'}],{duration:durationMs,easing:'cubic-bezier(.22,.66,.24,1)',fill:'forwards'});
      motion.finished.then(done,done);
      return;
     }catch(_){}
    }
    shield.addEventListener('transitionend',onEnd);shield.addEventListener('transitioncancel',onCancel);
    shield.style.setProperty('transition',`transform ${durationMs}ms cubic-bezier(.22,.66,.24,1)`,'important');
    requestAnimationFrame(()=>shield.style.setProperty('transform','translate3d(0,-101%,0)','important'));
   });
  });
  /* Round 1954: the typed front-screen introduction is a true first-visit cache primer.
     Do not mark the browser as complete until the intro has finished and the priority
     site assets requested during typing have settled into the browser HTTP cache. */
  // Background warming never holds up the visible reveal.
  cacheWarmReady.then(()=>{try{localStorage.setItem('ah-site-first-load-assets-warmed-v1954','1');}catch(_){}}).catch(()=>{});
  try{
   localStorage.setItem(key,'1');
   document.cookie='ah_site_intro_seen=1; Max-Age=31536000; Path=/; SameSite=Lax';
  }catch(_){}
  overlay.remove();window.dispatchEvent(new CustomEvent('ah:first-intro-finished'));
 }
 async function prepare(){
  const AudioContext=window.AudioContext||window.webkitAudioContext;
  if(AudioContext)try{ctx=new AudioContext({latencyHint:'interactive'});}catch(_){}
  resumeAudio();
  const loadAudio=async(name,urls)=>{for(const url of [].concat(urls)){try{const raw=await bytes(url);if(ctx){buffers[name]=await ctx.decodeAudioData(raw);return true;}}catch(_){}}return false;};
  /* Prioritize the top-impact MP3 because it is broadly decodable and small. The FLAC remains
     a fallback only. Add an explicit preload hint before any other page resources exist. */
  try{
   const preload=document.createElement('link');preload.rel='preload';preload.as='audio';
   preload.href='./assets/shield-first-rise-hit-round1877-fallback.mp3';preload.type='audio/mpeg';
   document.head.appendChild(preload);
  }catch(_){}
  try{
   impactAudio=new Audio('./assets/shield-first-rise-hit-round1877-fallback.mp3');
   impactAudio.preload='auto';impactAudio.volume=.88;impactAudio.load();
  }catch(_){impactAudio=null;}
  openReady=loadAudio('open',['./assets/shield-first-rise-hit-round1877-fallback.mp3','./assets/shield-first-rise-hit-round1877.flac']);
  const typeReady=loadAudio('type','./assets/intro-key-click-round1398.wav');
  const deleteReady=loadAudio('delete','./assets/intro-key-delete-round1398.wav');

  /* Warm only resources visible during or immediately after the first-visit intro.
     Below-fold imagery, carousel media, models and videos remain demand-loaded. */
  const warm=()=>{
   const priority=[
    './assets/honeycomb-fine-tile-2367.svg',
    './assets/fonts/orbitron-latin-wght-round1912.woff2'
   ];
   const page=document.body?.dataset?.page||document.body?.dataset?.ahMobileSurface||'';
   if(page==='home'){
    priority.push('./assets/machine-artwork-unframed-2366.webp','./assets/home-critical-window-poster-round2010.webp');
   }else if(page==='solutions'||page==='solution'){
    priority.push('./assets/machine-artwork-unframed-2366.webp');
   }
   return Promise.allSettled([...new Set(priority)].map(url=>fetch(url,{cache:'force-cache'})));
  };
  // Start cache warming during the typing sequence. The completion marker is written
  // only after these high-value requests settle, so repeat visits bypass the typing screen.
  cacheWarmReady=warm();

  // Start the official shield artwork immediately without buffering a second Blob copy in JS memory.
  // Decoding continues in parallel with the first line of typing.
  try{const img=new Image();img.decoding='async';img.fetchPriority='high';img.src=artURL;img.decode().catch(()=>{});}catch(_){}
  // Audio decode is opportunistic. Autoplay restrictions already mean sound cannot be guaranteed
  // before a user gesture, so audio readiness must never delay the visible introduction.
  await shellReady;
  // Optional click audio prepares independently of the visible intro.
  void deleteReady;
  await start();
 }
 prepare().catch(()=>{
  try{document.documentElement.removeAttribute('data-ah1920-prepaint');document.getElementById('ah1920-first-paint-hold')?.remove();}catch(_){ }
  overlay.remove();window.AHLoadingReady?.();
 });
})();
