/* Intro-only entry: the rest of the page is inert until the first typed word is painted. */
setTimeout(() => {
 'use strict';
 const query=new URLSearchParams(location.search);
 const filename=(location.pathname.split('/').pop()||'').toLowerCase();
 const productionHost=/(^|\.)automatedhearts\.com$/i.test(location.hostname);
 const desktop=matchMedia('(min-width:901px)').matches;
 const homeEntry=!filename||filename==='index.html';
 let payload=document.getElementById('ah1609-page-source');
 /* Round 1613: the public homepage is always the clean site root. index.html is
    the responsive entry document and carries inert mobile + desktop payloads. */
 if(homeEntry&&desktop&&query.get('mobile')!=='1')payload=document.getElementById('ah1609-page-source-desktop')||payload;
 if(!payload)return;
 const source=JSON.parse(payload.textContent),key='ah-site-first-visit-intro-v1219';
 if(window.self===window.top){
  /* Production-only SEO normalization. Local/file/localhost testing must keep
     index.html intact; redirecting a file URL to ./ exposes the browser's folder index. */
  if(productionHost&&(filename==='index.html'||filename==='desktop-home.html'||filename==='mobile-home.html')){
   const clean=new URL('./',location.href);clean.search='';clean.hash=location.hash;location.replace(clean.href);return;
  }
  const mobileRoute=matchMedia('(max-width:900px)').matches&&['solutions.html','learning-center.html','who-we-help.html','pricing.html','policies.html'].includes(filename)?filename==='policies.html'?'mobile-policies.html':'mobile-'+filename:null;
  const desktopRoute=desktop&&filename.startsWith('mobile-')&&['mobile-solutions.html','mobile-learning-center.html','mobile-who-we-help.html','mobile-pricing.html','mobile-policies.html'].includes(filename)?(filename==='mobile-policies.html'?'policies.html':filename.replace(/^mobile-/,'')):null;
  const target=mobileRoute||desktopRoute;
  if(target){location.replace(new URL(target+location.search+location.hash,location.href).href);return;}
 }
 let seen=false;try{seen=localStorage.getItem(key)==='1';}catch(_){}
 const embedded=window.self!==window.top||query.get('ah_embed')==='1';
 const release=()=>{document.open();document.write(source);document.close();};
 if(embedded||(seen&&query.get('intro')!=='1')){release();return;}
 const sleep=ms=>new Promise(r=>setTimeout(r,ms));
 const painted=()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
 let ctx=null,buffers={},artURL='',released=false,introFont=null;
 const overlay=document.createElement('div');
 overlay.id='ah1609-intro';
 overlay.innerHTML=`<style>
 #ah1609-intro{position:fixed;inset:0;z-index:2147483647;display:block;color:#f2fbff;overflow:hidden;contain:paint;isolation:isolate;box-sizing:border-box;pointer-events:auto;background:transparent}
 #ah1609-intro .shield{position:absolute;inset:0;display:grid;place-items:center;overflow:hidden;box-sizing:border-box;background:#08172b url("./assets/page-shield-smoked-heart.webp") center/cover no-repeat;border:2px solid #cdaa4d;will-change:transform;contain:paint;backface-visibility:hidden;transform:translate3d(0,0,0)}
 #ah1609-intro .copy{width:min(84vw,760px);font:700 clamp(22px,2.05vw,36px)/1.48 AHIntroOrbitron,Orbitron,system-ui,sans-serif;letter-spacing:.012em;text-shadow:0 2px 3px #000}
 @media(max-width:900px){
   #ah1609-intro{top:var(--current-frame-top,62px);right:var(--current-frame-side,10px);bottom:var(--current-frame-bottom,74px);left:var(--current-frame-side,10px);border-radius:var(--current-frame-radius,18px);overflow:hidden;background:transparent}
   #ah1609-intro .shield{inset:0;border:1.5px solid rgba(214,178,87,.90);border-radius:var(--current-frame-radius,18px);box-shadow:inset 0 0 0 2px rgba(24,12,2,.94),inset 0 0 0 3px rgba(255,238,186,.18),inset 0 0 8px rgba(214,178,87,.18)}
   #ah1609-intro .copy{width:min(88%,520px);font-size:clamp(18px,4.8vw,26px);line-height:1.45}
 }
 #ah1609-intro p{margin:0 0 .8em;min-height:1.45em}#ah1609-intro .pink{color:#ff2ea8}#ah1609-intro .green{color:#8fffd7}
 #ah1609-intro button{color:#ff2ea8;background:#0b1728;border:1px solid #8fffd7;padding:16px 24px;font:600 18px system-ui;cursor:pointer}
 #ah1609-intro .cursor{display:inline-block;width:.5em;height:1em;background:#8fffd7;vertical-align:-.1em;margin-left:.12em;animation:ah1609-blink .8s steps(1,end) infinite}
 #ah1609-intro small{display:block;font:14px/1.5 system-ui;color:#d8e7e4;text-align:center} @keyframes ah1609-blink{50%{opacity:0}}
 </style><div class="shield"><div class="copy"><div class="ready" aria-hidden="true"></div><div class="story" hidden><p></p><p></p><p></p><p></p></div></div></div>`;
 document.body.appendChild(overlay);
 const shield=overlay.querySelector('.shield'),ready=overlay.querySelector('.ready'),story=overlay.querySelector('.story'),lines=[...story.querySelectorAll('p')];
 const cursor=document.createElement('span');cursor.className='cursor';
 async function bytes(url){const res=await fetch(url,{cache:'force-cache'});if(!res.ok)throw Error('Asset unavailable');return res.arrayBuffer();}
 function sound(name,when=ctx?.currentTime||0){
  if(!ctx||ctx.state!=='running'||!buffers[name])return;
  const src=ctx.createBufferSource(),gain=ctx.createGain();src.buffer=buffers[name];src.connect(gain);gain.connect(ctx.destination);
  const volume=name==='open'?.72:.25;gain.gain.setValueAtTime(volume,when);
  if(name==='open'){gain.gain.setValueAtTime(volume,when+Math.max(0,src.buffer.duration-.5));gain.gain.linearRampToValueAtTime(0,when+src.buffer.duration);}
  src.start(when);return src;
 }
 async function requireRiseAudio(){
  // Round 1705 no-tap patch: never block the shield on a user gesture. Browsers that
  // allow Web Audio autoplay still get the synchronized hit; others continue silently.
  if(!ctx||!buffers.open)return false;
  if(ctx.state!=='running')await ctx.resume().catch(()=>{});
  return ctx.state==='running';
 }
 const escaped=t=>t.replace(/[&<>']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;'}[c]));
 function render(i,text){lines[i].innerHTML=escaped(text).replace(/AI/g,'<span class="pink">AI</span>').replace(/Human|maximum efficiency/g,'<span class="green">$&</span>');lines[i].appendChild(cursor);}
 let strings=['','','',''];
 async function type(i,text){for(const char of text){strings[i]+=char;render(i,strings[i]);sound('type');await sleep(/[.,]/.test(char)?105:45);}}
 async function back(i,n){for(let j=0;j<n;j++){strings[i]=strings[i].slice(0,-1);render(i,strings[i]);sound('delete');await sleep(85);}}
 async function start(){
  ready?.remove();story.hidden=false;
  await type(0,'AI');await painted();
  // No site image, model, stylesheet, analytics or page runtime is discoverable before here.
  try{localStorage.setItem(key,'1');}catch(_){}
  window.__AH_EARLY_MOBILE_INTRO_STARTED__=true;window.__AH_EARLY_DESKTOP_INTRO_STARTED__=true;window.__AH_SITE_FIRST_VISIT_INTRO_1194=true;
  release();released=true;if(introFont)document.fonts.add(introFont);document.documentElement.appendChild(overlay);
  shield.style.backgroundImage=`url("${artURL}")`;
  await type(0,' should elevtae');await sleep(330);await back(0,3);await type(0,'ate the Human.');await sleep(620);
  await type(1,'Fully customized minimalistic systems in both design & foundation for maximum efficency');await back(1,5);await type(1,'ciency.');await sleep(610);
  await type(2,'Nothing you dont');await back(2,4);await type(2,"don't need.");await sleep(520);
  await type(3,'Just what you do.');await sleep(650);cursor.remove();
  // No-tap patch: the visual rise always proceeds. When Web Audio is available and
  // already running, arm the impact sound against the same visual start/finish window.
  const audioReady=await requireRiseAudio();
  const lead=.12,duration=2;
  const outputClockNow=()=>{
   if(ctx&&ctx.getOutputTimestamp){
    const stamp=ctx.getOutputTimestamp();
    if(stamp.performanceTime>0&&stamp.contextTime>=0)return stamp.contextTime+(performance.now()-stamp.performanceTime)/1000;
   }
   const latency=ctx?(Number.isFinite(ctx.outputLatency)?ctx.outputLatency:(Number.isFinite(ctx.baseLatency)?ctx.baseLatency:0)):0;
   return ctx?Math.max(0,ctx.currentTime-latency):0;
  };
  // Preserve the original cubic-bezier(.22,.66,.24,1) motion while driving it from
  // the speaker/output clock instead of a timer or animation-end callback.
  const ease=t=>{
   const x1=.22,y1=.66,x2=.24,y2=1,bez=(u,a,b)=>3*(1-u)*(1-u)*u*a+3*(1-u)*u*u*b+u*u*u;
   let u=t;for(let i=0;i<5;i++){const x=bez(u,x1,x2),dx=3*(1-u)*(1-u)*x1+6*(1-u)*u*(x2-x1)+3*u*u*(1-x2);if(Math.abs(dx)<1e-5)break;u=Math.min(1,Math.max(0,u-(x-t)/dx));}
   return bez(u,y1,y2);
  };
  const riseStartPerf=performance.now()+lead*1000;
  let riseStart=0,impactTime=0;
  if(audioReady){
   riseStart=outputClockNow()+lead;impactTime=riseStart+duration;
   sound('open',impactTime);
  }
  window.__AH_FIRST_INTRO_RISE_CLOCK__={audioMaster:audioReady,riseStart,impactTime,duration};
  window.dispatchEvent(new CustomEvent('ah:first-intro-raising',{detail:{intro:overlay}}));
  await new Promise(resolve=>{
   let topSent=false;
   const markTop=()=>{if(topSent)return;topSent=true;shield.style.transform='translate3d(0,-101%,0)';window.dispatchEvent(new CustomEvent('ah:first-intro-top',{detail:{intro:overlay}}));resolve();};
   const frame=()=>{
    if(!overlay.isConnected){resolve();return;}
    const progress=Math.min(1,Math.max(0,(performance.now()-riseStartPerf)/(duration*1000)));
    shield.style.transform=`translate3d(0,${(-101*ease(progress)).toFixed(4)}%,0)`;
    if(progress>=1){markTop();return;}
    requestAnimationFrame(frame);
   };
   requestAnimationFrame(frame);
  });
  overlay.remove();window.dispatchEvent(new CustomEvent('ah:first-intro-finished'));
 }
 async function prepare(){
  const AudioContext=window.AudioContext||window.webkitAudioContext;
  if(!AudioContext)throw Error('Web Audio unavailable');
  ctx=new AudioContext({latencyHint:'interactive'});
  const assets=[['type','./assets/intro-key-click-round1398.wav'],['delete','./assets/intro-key-delete-round1398.wav'],['open','./assets/shield-first-rise-hit-round1618.wav']];
  const work=assets.map(async([name,url])=>{const raw=await bytes(url);if(ctx)buffers[name]=await ctx.decodeAudioData(raw);});
  work.push((async()=>{const raw=await bytes('./assets/page-shield-smoked-heart.webp');artURL=URL.createObjectURL(new Blob([raw],{type:'image/webp'}));const img=new Image();img.src=artURL;await img.decode();shield.style.backgroundImage=`url("${artURL}")`})());
  // Resolve the font from the site's existing Google Fonts CSS rather than relying on a versioned URL.
  work.push(fetch('https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap').then(r=>r.text()).then(async css=>{const urls=[...css.matchAll(/url\(([^)]+)\)/g)];if(urls.length){const face=new FontFace('AHIntroOrbitron',`url(${urls[urls.length-1][1]})`,{weight:'700'});await face.load();document.fonts.add(face);introFont=face;}}).catch(()=>{}));
  await Promise.all(work);
  // Start immediately; do not require a click/tap just to enter the site.
  if(ctx?.state!=='running')await ctx.resume().catch(()=>{});
  await start();
 }
 prepare().catch(()=>{
  // Never replace a failed intro with another interaction gate.
  if(released){overlay.remove();return;}
  overlay.remove();release();
 });
},0);
