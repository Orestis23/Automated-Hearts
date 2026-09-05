(() => {
  'use strict';
  const INTRO_KEY = 'ah-mobile-first-visit-intro-v1116';
  const forceIntro = new URLSearchParams(location.search).get('intro') === '1';
  const intro = document.getElementById('first-visit-intro');
  const lineEls = [...document.querySelectorAll('.intro-line')];
  const cursor = document.getElementById('intro-cursor');
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const esc = (v) => v.replace(/[&<>]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
  if ('serviceWorker' in navigator) navigator.serviceWorker.getRegistrations().then((regs)=>regs.forEach((r)=>r.unregister())).catch(()=>{});

  function colorize(v){let x=esc(v);x=x.replace(/AI/g,'<span class="pink">AI</span>').replace(/Human/g,'<span class="green">Human</span>').replace(/10%/g,'<span class="pink">10%</span>').replace(/local charities/g,'<span class="green">local charities</span>').replace(/maximum efficiency/g,'<span class="green">maximum efficiency</span>').replace(/Nothing you don&#39;t need\./g,'<span class="pink">Nothing</span> you <span class="green">don&#39;t need.</span>');return x}
  const state=['','','',''];
  function render(i){lineEls[i].innerHTML=colorize(state[i]);lineEls[i].appendChild(cursor)}
  async function type(i,text){for(const ch of text){state[i]+=ch;render(i);let d=34+Math.random()*48;if(/[.,%]/.test(ch))d+=65;await sleep(d)}}
  async function back(i,n){for(let k=0;k<n;k++){state[i]=state[i].slice(0,-1);render(i);await sleep(78+Math.random()*42)}}
  async function typeStory(){await type(0,'AI should elevtae');await sleep(330);await back(0,3);await sleep(160);await type(0,'ate the Human.');await sleep(620);await type(1,'10% to local charites');await sleep(290);await back(1,3);await sleep(150);await type(1,'ties.');await sleep(650);await type(2,'Fully customized minimalistic systems in both design & foundation for maximum efficency');await sleep(340);await back(2,5);await sleep(160);await type(2,'ciency.');await sleep(610);await type(3,'Nothing you dont');await sleep(310);await back(3,4);await sleep(150);await type(3,"don't need.");await sleep(700)}
  function loadImage(url){return new Promise((resolve)=>{const img=new Image();img.decoding='async';img.onload=()=>img.decode?img.decode().catch(()=>{}).finally(resolve):resolve();img.onerror=resolve;img.src=url})}

  const stack=document.getElementById('machine-stack');
  const modelFrame=document.querySelector('.machine-3d-frame');
  const cardsFrame=document.querySelector('.cards-frame');
  const model=document.querySelector('.machine-3d');
  const cards=document.querySelector('.cards-video');
  let modelReady=false, modelLoadStarted=false, modelReadyResolve=()=>{};
  const modelReadyPromise=new Promise((resolve)=>{modelReadyResolve=resolve});
  const mediaCache=window.__AH_PRELOADED_MEDIA=Object.create(null);
  let machineVisible=true;

  function setModelActive(active){
    if(!model?.contentWindow)return;
    try{model.contentWindow.postMessage({type:'engine-visibility',visible:!!active},'*')}catch(_){}
  }
  function startModelLoad(){
    if(!model||modelLoadStarted)return modelReadyPromise;
    modelLoadStarted=true;
    model.src=model.dataset.src;
    model.addEventListener('load',()=>{try{model.contentWindow.postMessage({type:'engine-visibility',visible:true},'*')}catch(_){}},{once:true});
    return modelReadyPromise;
  }
  addEventListener('message',(e)=>{
    if(e.source!==model?.contentWindow||e.data?.type!=='ah-mobile-machine-ready')return;
    modelReady=true;
    modelFrame?.classList.add('model-ready');
    modelReadyResolve(true);
    // Warm-up is complete; freeze until the visitor actually raises the left shutter.
    setModelActive(!!(modelFrame?.classList.contains('open')&&machineVisible&&!document.hidden));
  });

  async function fetchVideo(url,timeout=5000){
    if(mediaCache[url])return true;
    try{
      const response=await fetch(url,{cache:'force-cache'}); if(!response.ok)throw new Error('video');
      const blob=await response.blob(); mediaCache[url]=URL.createObjectURL(blob);
      const probe=document.createElement('video'); probe.muted=true; probe.playsInline=true; probe.preload='auto'; probe.src=mediaCache[url];
      await Promise.race([new Promise((resolve)=>{probe.addEventListener('loadeddata',resolve,{once:true});probe.load()}),sleep(timeout)]);
      probe.pause(); probe.removeAttribute('src'); probe.load(); return true;
    }catch(_){return false}
  }
  const cardsUrl='./assets/home-rolodex-scroll-mobile-round1101.mp4';
  async function prepareCards(){return fetchVideo(cardsUrl)}
  async function prepareCriticalAssets(){
    const images=['./assets/home-machine-orbit-mobile-round1101-poster.webp','./assets/home-rolodex-scroll-mobile-round1101-poster.webp','./assets/mobile-lite-heart.webp'];
    startModelLoad();
    const core=Promise.all([Promise.all(images.map(loadImage)),modelReadyPromise]);
    // Only after the 3D request is underway do we quietly cache the small cards clip.
    modelReadyPromise.then(()=>{if('requestIdleCallback' in window)requestIdleCallback(()=>prepareCards(),{timeout:2200});else setTimeout(prepareCards,350)}).catch(()=>{});
    return core;
  }

  async function ensureCardsPlaying(){
    if(!cards)return;
    if(!cards.src){await prepareCards();cards.src=mediaCache[cardsUrl]||cards.dataset.src;cards.load()}
    if(cards.readyState<2)await Promise.race([new Promise(r=>cards.addEventListener('loadeddata',r,{once:true})),sleep(1800)]);
    cards.playbackRate=.5;
    cardsFrame?.classList.add('video-ready');
    if(machineVisible&&!document.hidden)cards.play().catch(()=>{});
  }
  function stopCards(){if(cards)cards.pause()}
  function closeFrame(frame){
    if(!frame)return;
    frame.classList.remove('open');
    frame.querySelector('.window-shutter')?.setAttribute('aria-expanded','false');
  }
  function syncLiveSurface(){
    const leftOpen=!!modelFrame?.classList.contains('open');
    const rightOpen=!!cardsFrame?.classList.contains('open');
    setModelActive(modelReady&&leftOpen&&machineVisible&&!document.hidden&&!rightOpen);
    if(rightOpen&&machineVisible&&!document.hidden){stopCards();ensureCardsPlaying()}else stopCards();
  }

  document.querySelectorAll('.machine-frame').forEach((frame)=>{
    const shutter=frame.querySelector('.window-shutter');
    shutter?.addEventListener('click',(e)=>{
      e.preventDefault();
      const wasOpen=frame.classList.contains('open');
      if(frame===modelFrame){
        closeFrame(cardsFrame); stopCards(); startModelLoad();
      }else{
        closeFrame(modelFrame); setModelActive(false);
      }
      frame.classList.toggle('open',!wasOpen);
      shutter.setAttribute('aria-expanded',String(!wasOpen));
      shutter.style.setProperty('will-change','transform'); setTimeout(()=>shutter.style.removeProperty('will-change'),850);
      syncLiveSurface();
    },{passive:false});
  });

  if(stack&&'IntersectionObserver' in window){
    const io=new IntersectionObserver((entries)=>{machineVisible=!!entries[0]?.isIntersecting;syncLiveSurface()},{rootMargin:'80px 0px'});io.observe(stack);
  }
  document.addEventListener('visibilitychange',syncLiveSurface);

  async function runIntro(){
    intro.hidden=false;
    const critical=prepareCriticalAssets();
    await typeStory();
    // The typing normally gives the 3D scene ample time. If needed, allow a short final warm-up window.
    await Promise.race([critical,sleep(2600)]);
    try{localStorage.setItem(INTRO_KEY,'1')}catch(_){}
    cursor.style.opacity='0'; await sleep(150); intro.classList.add('is-raising');
    await Promise.race([new Promise(r=>intro.addEventListener('transitionend',r,{once:true})),sleep(3300)]);
    intro.hidden=true; document.documentElement.setAttribute('data-ah-intro','0');
    syncLiveSurface();
  }
  let seen=false;try{seen=localStorage.getItem(INTRO_KEY)==='1'}catch(_){}
  if(forceIntro||!seen)runIntro();
  else{
    intro.hidden=true;document.documentElement.setAttribute('data-ah-intro','0');
    startModelLoad();
    modelReadyPromise.then(()=>{if('requestIdleCallback' in window)requestIdleCallback(()=>prepareCards(),{timeout:2500})}).catch(()=>{});
  }

  // Deferred half-carousel; manual motion only.
  const carousel=document.querySelector('.carousel');
  const deferred=[...document.querySelectorAll('.carousel img[data-src]')];
  const prevOrb=document.querySelector('.carousel-orb.prev');
  const nextOrb=document.querySelector('.carousel-orb.next');
  let deferredLoaded=false;
  function loadDeferred(){if(deferredLoaded)return;deferredLoaded=true;deferred.forEach(img=>{img.src=img.dataset.src;img.removeAttribute('data-src')})}
  function figures(){return carousel?[...carousel.querySelectorAll('figure')]:[]}
  function stepWidth(){const f=figures()[0];return f?(f.getBoundingClientRect().width+12):0}
  function currentIndex(){const step=stepWidth();return step?Math.round(carousel.scrollLeft/step):0}
  function goTo(index){const figs=figures();if(!figs.length)return;const target=Math.max(0,Math.min(figs.length-1,index));if(target>=2)loadDeferred();carousel.scrollTo({left:target*stepWidth(),behavior:'smooth'})}
  prevOrb?.addEventListener('click',()=>goTo(currentIndex()-1));
  nextOrb?.addEventListener('click',()=>goTo(currentIndex()+1));
  if(carousel){carousel.addEventListener('scroll',()=>{const i=currentIndex();if(i>=1)loadDeferred();prevOrb?.toggleAttribute('disabled',i<=0);nextOrb?.toggleAttribute('disabled',i>=figures().length-1)},{passive:true});prevOrb?.setAttribute('disabled','')}
})();
