

/* Round 1914 — Home machine windows stay on their deterministic stills until the
   explicit Open the window control is pressed. This keeps both shutters closed on
   startup and prevents iframe/model compilation from competing with shield motion. */
(()=>{'use strict';
function deferHomeWindows(){
 document.querySelectorAll('#home-machine-grid iframe.home-hero-engine-embed,#machine-stack iframe.machine-3d,#machine-stack iframe.cards-live-frame').forEach(frame=>{
  if(!frame.getAttribute('src')&&frame.dataset.src)frame.loading='lazy';
  try{frame.contentWindow?.postMessage({type:'automated-hearts:learning-activity',active:false},'*');}catch(_){}
  try{frame.contentWindow?.postMessage({type:'automated-hearts:viewport-activity',active:false},'*');}catch(_){}
 });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',deferHomeWindows,{once:true});else deferHomeWindows();
document.addEventListener('ah:persistent-route-complete',deferHomeWindows);
addEventListener('pageshow',deferHomeWindows,{passive:true});
})();

;


(() => {
  'use strict';
  const INTRO_KEY = 'ah-site-first-visit-intro-v1219';
  const forceIntro = new URLSearchParams(location.search).get('intro') === '1';
  const intro = document.getElementById('first-visit-intro');
  const lineEls = [...document.querySelectorAll('.intro-line')];
  const cursor = document.getElementById('intro-cursor');
  const signature = document.getElementById('intro-signature-heart');
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const esc = (v) => v.replace(/[&<>]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
function colorize(v){let x=esc(v);x=x.replace(/AI/g,'<span class="pink">AI</span>').replace(/Human/g,'<span class="green">Human</span>').replace(/maximum efficiency/g,'<span class="green">maximum efficiency</span>').replace(/Nothing you don&#39;t need\./g,'<span class="pink">Nothing</span> you <span class="green">don&#39;t need.</span>').replace(/Just what you do\./g,'<span class="pink">Just</span> <span class="green">what you do.</span>');return x}
  const state=['','','','',''];
  function render(i){lineEls[i].innerHTML=colorize(state[i]);lineEls[i].appendChild(cursor)}
  async function type(i,text){for(const ch of text){state[i]+=ch;render(i);try{window.__AHIntroKeySound?.('type')}catch(_){};let d=34+Math.random()*48;if(/[.,%]/.test(ch))d+=65;await sleep(d)}}
  async function back(i,n){for(let k=0;k<n;k++){state[i]=state[i].slice(0,-1);render(i);try{window.__AHIntroKeySound?.('delete')}catch(_){};await sleep(78+Math.random()*42)}}
  async function typeStory(){await type(0,'AI should elevtae');await sleep(330);await back(0,3);await sleep(160);await type(0,'ate the Human.');await sleep(620);await type(1,'Fully customized minimalistic systems in both design & foundation for maximum efficency');await sleep(340);await back(1,5);await sleep(160);await type(1,'ciency.');await sleep(610);await type(2,'Nothing you dont');await sleep(310);await back(2,4);await sleep(150);await type(2,"don't need.");await sleep(520);await type(3,'Just what you do.');await sleep(520)}
  function loadImage(url){return new Promise((resolve)=>{const img=new Image();img.decoding='async';img.onload=()=>img.decode?img.decode().catch(()=>{}).finally(resolve):resolve();img.onerror=resolve;img.src=url})}

  const stack=document.getElementById('machine-stack');
  const modelFrame=document.querySelector('.machine-3d-frame');
  const cardsFrame=document.querySelector('.cards-frame');
  const model=document.querySelector('.machine-3d');
  const modelPoster=document.querySelector('.machine-3d-frame .machine-live-poster');
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
    if(e.source!==model?.contentWindow)return;
    const type=e.data?.type;
    if(type==='ah-mobile-machine-ready'){
      modelReady=true;
      modelFrame?.classList.add('model-ready');
      modelReadyResolve(true);
      // Capture a finished still without keeping the animation engine running. The child
      // capture handler performs an explicit renderer.render(), so this does not add an
      // extra animation workload or change the model's load schedule.
      const ask=()=>{try{model.contentWindow.postMessage({type:'ah:capture-machine-poster'},'*')}catch(_){}};
      requestAnimationFrame(()=>setTimeout(ask,40));
      setModelActive(!!(modelFrame?.classList.contains('open')&&machineVisible&&!document.hidden));
      return;
    }
    if(type==='ah-mobile-machine-poster'&&modelPoster&&typeof e.data?.image==='string'&&e.data.image.startsWith('data:image/')){
      modelPoster.src=e.data.image;
      modelPoster.classList.add('is-live-capture-ready');
      modelFrame?.classList.add('live-poster-ready');
      setModelActive(!!(modelFrame?.classList.contains('open')&&machineVisible&&!document.hidden));
    }
  });

  const pendingVideos = new Map();
  async function fetchVideoBytes(url,timeout=5000){
    if(mediaCache[url])return true;
    try{
      const response=await fetch(url,{cache:'force-cache'}); if(!response.ok)throw new Error('video');
      const blob=await response.blob(); mediaCache[url]=URL.createObjectURL(blob);
      const probe=document.createElement('video'); probe.muted=true; probe.playsInline=true; probe.preload='auto'; probe.src=mediaCache[url];
      await Promise.race([new Promise((resolve)=>{probe.addEventListener('loadeddata',resolve,{once:true});probe.load()}),sleep(timeout)]);
      probe.pause(); probe.removeAttribute('src'); probe.load(); return true;
    }catch(_){return false}
  }
  function fetchVideo(url, timeout=5000){
    if (mediaCache[url]) return Promise.resolve(true);
    if (pendingVideos.has(url)) return pendingVideos.get(url);
    const pending = fetchVideoBytes(url, timeout).finally(() => pendingVideos.delete(url));
    pendingVideos.set(url, pending);
    return pending;
  }
  const cardsUrl='./assets/home-rolodex-scroll-mobile-round1147-smooth.mp4';
  async function prepareCards(){return fetchVideo(cardsUrl)}
  async function prepareCriticalAssets(){
    const images=['./assets/ah-empty-transparent.svg'];
    startModelLoad();
    const core=Promise.all([Promise.all(images.map(loadImage)),modelReadyPromise]);
    // Cards are intentionally NOT downloaded during the first-visit intro.
    // The full mobile MP4 is only warmed after the intro has completely released the page.
    return core;
  }

  async function ensureCardsPlaying(){
    if(!cards)return;
    if(!cards.src){
      await prepareCards(); // fetchVideoBytes completes the entire 1.5 MB clip before playback.
      cards.src=mediaCache[cardsUrl]||cards.dataset.src;
      cards.muted=true; cards.loop=true; cards.playsInline=true; cards.preload='auto';
      cards.load();
    }
    if(cards.readyState<2)await Promise.race([new Promise(r=>cards.addEventListener('loadeddata',r,{once:true})),sleep(1800)]);
    cards.defaultPlaybackRate=.8;
    cards.playbackRate=.8;
    cardsFrame?.classList.add('video-ready');
    if(machineVisible&&!document.hidden&&cardsFrame?.classList.contains('open'))cards.play().catch(()=>{});
  }
  function stopCards(){if(cards)cards.pause()}
  let cardsWarmAllowed=document.documentElement.getAttribute('data-ah-intro')!=='1';
  let cardsWarmScheduled=false;
  function scheduleCardsWarmup(){
    if(!cardsWarmAllowed||cardsWarmScheduled||mediaCache[cardsUrl])return;
    cardsWarmScheduled=true;
    const warm=()=>prepareCards().finally(()=>{cardsWarmScheduled=false});
    if('requestIdleCallback' in window)requestIdleCallback(warm,{timeout:2600});
    else setTimeout(warm,450);
  }
  function releaseCardsWarmup(){cardsWarmAllowed=true}
  addEventListener('ah:first-intro-top',releaseCardsWarmup,{once:true});
  function closeFrame(frame){
    if(!frame)return;
    frame.classList.remove('open');
    frame.querySelector('.window-shutter')?.setAttribute('aria-expanded','false');
  }
  function syncLiveSurface(){
    const leftOpen=!!modelFrame?.classList.contains('open');
    const rightOpen=!!cardsFrame?.classList.contains('open');
    const shouldRun=modelReady&&leftOpen&&machineVisible&&!document.hidden&&!rightOpen;
    setModelActive(shouldRun);
    if(leftOpen&&modelReady){
      requestAnimationFrame(()=>requestAnimationFrame(()=>setTimeout(()=>modelFrame?.classList.add('ah1644-live-painted'),90)));
    }
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
        if(!wasOpen) ensureCardsPlaying().catch(()=>{});
      }
      frame.classList.toggle('open',!wasOpen);
      shutter.setAttribute('aria-expanded',String(!wasOpen));
      shutter.style.setProperty('will-change','transform'); setTimeout(()=>shutter.style.removeProperty('will-change'),850);
      syncLiveSurface();
    },{passive:false});
  });

  if(stack&&'IntersectionObserver' in window){
    const io=new IntersectionObserver((entries)=>{
      machineVisible=!!entries[0]?.isIntersecting;
      syncLiveSurface();
    },{rootMargin:'240px 0px'});io.observe(stack);
  }
  document.addEventListener('visibilitychange',syncLiveSurface);

  async function runIntro(){
    intro.hidden=false;
    // Round 1868: do not start hidden machine/model downloads during intro.

    await typeStory();
    try{localStorage.setItem(INTRO_KEY,'1')}catch(_){}
    cursor.style.opacity='0'; await sleep(180); if(signature){signature.classList.add('is-visible');await sleep(1250)}else{await sleep(420)}; intro.classList.add('is-raising');
    try{window.dispatchEvent(new CustomEvent('ah:first-intro-raising',{detail:{intro}}))}catch(_){}
    await Promise.race([new Promise(r=>intro.addEventListener('transitionend',r,{once:true})),sleep(3300)]);
    intro.hidden=true; document.documentElement.setAttribute('data-ah-intro','0');
    cardsWarmAllowed=true;
    syncLiveSurface();
  }
  let seen=false;try{seen=localStorage.getItem(INTRO_KEY)==='1'}catch(_){}
  /* Round 1829: the first-visit introduction is owned by round1609-intro-first-loader.
     Older mobile markup no longer contains #first-visit-intro, so never dereference
     that retired node. Continue directly into normal Home media warmup instead. */
  const legacyIntroAvailable=!!(intro&&cursor&&lineEls.length>=4);
  if(!legacyIntroAvailable){
    document.documentElement.setAttribute('data-ah-intro','0');
    cardsWarmAllowed=true;
  }else if(window.__AH_EARLY_MOBILE_INTRO_STARTED__){
    // Round 1868: keep hidden machine assets deferred while the early intro runs.
    cardsWarmAllowed=true;
  }else if(forceIntro||!seen){
    runIntro();
  }else{
    intro.hidden=true;document.documentElement.setAttribute('data-ah-intro','0');
    cardsWarmAllowed=true;
  }

  // Native looping on a fully-buffered blob is normally gapless. This is a fallback only.
  cards?.addEventListener('ended',()=>{
    try{cards.currentTime=0}catch(_){}
    if(cardsFrame?.classList.contains('open')&&machineVisible&&!document.hidden)cards.play().catch(()=>{});
  });

  // Deferred half-carousel; manual motion only.
  const carousel=document.querySelector('.carousel');
  const deferred=[...document.querySelectorAll('.carousel img[data-src]')];
  const prevOrb=document.querySelector('.carousel-orb.prev');
  const nextOrb=document.querySelector('.carousel-orb.next');
  let deferredLoaded=false;
  function loadDeferred(){if(deferredLoaded)return;deferredLoaded=true;deferred.forEach(img=>{if(img.dataset.src){img.src=img.dataset.src;img.removeAttribute('data-src')}})}
  function figures(){return carousel?[...carousel.querySelectorAll('figure')]:[]}
  function currentIndex(){const figs=figures();let nearest=0,distance=Infinity;figs.forEach((f,i)=>{const left=f.offsetLeft-figs[0].offsetLeft;const delta=Math.abs(carousel.scrollLeft-left);if(delta<distance){distance=delta;nearest=i}});return nearest}
  let requestedIndex=null,lastPointerActivation=0;
  let glideFrame=0,gliding=false;
function goTo(index){const figs=figures();if(!figs.length)return;const target=Math.max(0,Math.min(figs.length-1,index));requestedIndex=target;loadDeferred();cancelAnimationFrame(glideFrame);gliding=true;const start=carousel.scrollLeft,left=Math.min(figs[target].offsetLeft-figs[0].offsetLeft,carousel.scrollWidth-carousel.clientWidth),began=performance.now();const snap=carousel.style.getPropertyValue('scroll-snap-type'),snapPriority=carousel.style.getPropertyPriority('scroll-snap-type');carousel.style.setProperty('scroll-snap-type','none','important');carousel.style.setProperty('scroll-behavior','auto','important');const duration=matchMedia('(prefers-reduced-motion:reduce)').matches?0:650;function step(now){const t=duration?Math.min(1,(now-began)/duration):1;const eased=t*t*(3-2*t);carousel.scrollLeft=start+(left-start)*eased;if(t<1){glideFrame=requestAnimationFrame(step)}else{gliding=false;requestedIndex=null;if(snap)carousel.style.setProperty('scroll-snap-type',snap,snapPriority);else carousel.style.removeProperty('scroll-snap-type')}}glideFrame=requestAnimationFrame(step)}
  function bindArrow(button,direction){if(!button)return;
  // Keep generic button press effects from moving carousel controls.
  const lockOrb=()=>{for(const [prop,value] of [['transform','translateY(-50%)'],['translate','none'],['scale','none'],['transition-property','filter,box-shadow']]){if(button.style.getPropertyValue(prop)!==value||button.style.getPropertyPriority(prop)!=='important')button.style.setProperty(prop,value,'important')}};
  lockOrb();new MutationObserver(lockOrb).observe(button,{attributes:true,attributeFilter:['style','class']});
button.style.setProperty('touch-action','manipulation','important');window.addEventListener('pointerdown',event=>{if(event.button!==0||!button.contains(event.target)||button.disabled)return;event.preventDefault();lastPointerActivation=performance.now();goTo((requestedIndex??currentIndex())+direction)},true);button.addEventListener('click',()=>{if(performance.now()-lastPointerActivation<500)return;goTo((requestedIndex??currentIndex())+direction)})}
  bindArrow(prevOrb,-1);bindArrow(nextOrb,1);
  carousel?.addEventListener('scrollend',()=>{if(!gliding)requestedIndex=null});

  if(carousel){carousel.addEventListener('scroll',()=>{const i=currentIndex();if(i>=1)loadDeferred();prevOrb?.toggleAttribute('disabled',i<=0);nextOrb?.toggleAttribute('disabled',i>=figures().length-1)},{passive:true});prevOrb?.setAttribute('disabled','')}
})();

;


/* Automated Hearts Round 1873 — order-preserving runtime consolidation. */

/* Automated Hearts — Google Sheets form endpoint.
   After deploying google-apps-script/Code.gs as a Web App, paste the /exec URL below. */
window.AH_GOOGLE_SHEETS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzRT1Z-3GUQaRctYcN7_c-v2QEdVtzV4Yi4dFmiAt0-Ip_04p276QEGDDTPCHi8BVeMJQ/exec';



(() => {
  'use strict';

  const ENDPOINT = String(window.AH_GOOGLE_SHEETS_WEB_APP_URL || '').trim();
  if (!ENDPOINT || !/^https:\/\/script\.google\.com\/macros\/s\//i.test(ENDPOINT)) return;

  let lastSubmitAt = 0;

  function statusNode(form) {
    return form.querySelector('.quick-contact-form__status, .nav-contact-form-status, [data-form-status]');
  }

  function setBusy(form, busy) {
    const button = form.querySelector('button[type="submit"], input[type="submit"]');
    if (!button) return;
    button.disabled = busy;
    button.setAttribute('aria-busy', busy ? 'true' : 'false');
  }

  function contactContext(form) {
    const panel = form.closest('.nav-contact-panel');
    const mobilePanel = form.closest('.ah-mobile-contact');
    const active = document.querySelector('[data-contact-trigger][aria-expanded="true"], [data-contact-trigger].is-contact-latched');
    return active?.getAttribute('data-ah-contact') || active?.getAttribute('data-contact-origin') || panel?.dataset?.contactContext || mobilePanel?.dataset?.contactService || '';
  }

  document.addEventListener('submit', async (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    if (!form.matches('[data-placeholder-contact-form], [data-google-sheet-form]')) return;

    // Capture the form before the older placeholder submit handler can consume it.
    event.preventDefault();
    event.stopImmediatePropagation();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const now = Date.now();
    if (now - lastSubmitAt < 1200) return;
    lastSubmitAt = now;

    const status = statusNode(form);
    const data = new FormData(form);
    // Keep phone visible with the already-deployed receiver, which may not yet
    // have the new dedicated Phone column from the bundled Apps Script.
    const phone = String(data.get('phone') || '').trim();
    if (phone) data.set('message', String(data.get('message') || '') + '\n\nPhone number: ' + phone);
    data.set('page', document.body?.dataset?.page || document.title || '');
    data.set('page_url', location.href);
    data.set('contact_context', contactContext(form));
    data.set('submitted_at_client', new Date().toISOString());
    data.set('form_version', '1436');

    // Simple honeypot support if one is added later.
    if (data.get('website')) return;

    setBusy(form, true);
    if (status) status.textContent = 'Sending…';

    try {
      // no-cors avoids browser CORS failures with Apps Script redirects. The Sheet script
      // is responsible for validation and row creation.
      await fetch(ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-store',
        keepalive: true,
        body: data
      });
      form.reset();
      if (status) status.textContent = "Thank you for your message. We'll reach out to you within 48 hours!";
    } catch (error) {
      console.error('Automated Hearts form delivery failed', error);
      if (status) status.textContent = 'The message could not be sent. Please try again.';
    } finally {
      setBusy(form, false);
    }
  }, true);
})();



;


(() => {
  'use strict';
  // Round 1201: embedded pages defer contact/navigation to the persistent parent shell.
  // This prevents duplicate hidden contact overlays and competing tap handlers.
  if (window.self !== window.top && new URLSearchParams(location.search).get('ah_embed') === '1') return;
  const triggers = [...document.querySelectorAll('.message')];
  if (!triggers.length) return;

  triggers.forEach((trigger) => {
    trigger.setAttribute('href', '#contact-form');
    trigger.setAttribute('data-contact-trigger', '');
    trigger.setAttribute('data-ah-contact', 'Mobile Messages button');
    trigger.setAttribute('aria-expanded', 'false');
  });

  const overlay = document.createElement('div');
  overlay.className = 'ah-mobile-contact';
  overlay.id = 'contact-form';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = `
    <div class="ah-mobile-contact__panel" role="dialog" aria-modal="true" aria-label="Contact form">
      <form method="post" data-google-sheet-form>
        <label><span class="sr-only">Name</span><input class="ah-contact-screen" autocomplete="name" name="name" placeholder="Name (required)" required type="text"></label>
        <label><span class="sr-only">Email</span><input class="ah-contact-screen" autocomplete="email" name="email" placeholder="Email (required)" required type="email"></label>
<label class="nav-contact-field nav-contact-field--full ah-phone-field"><span class="sr-only">Phone number (required)</span><input class="ah-contact-screen" autocomplete="tel" inputmode="tel" name="phone" placeholder="Phone number (required)" required type="tel"></label>
        <label><span class="sr-only">Business or organization</span><input class="ah-contact-screen" autocomplete="organization" name="business" placeholder="Business or organization" type="text"></label>
        <label><span class="sr-only">Business type</span><select class="ah-contact-screen" data-ah-placeholder-select="1" aria-label="Business type" name="business_type"><option value="">Business type</option><option>Professional services</option><option>Construction or trades</option><option>Local business operations</option><option>Entrepreneur or small team</option><option>Nonprofit or community organization</option><option>Other</option></select></label>
        <label><span class="sr-only">What feels harder than it should?</span><textarea class="ah-contact-screen" name="message" placeholder="What feels harder than it should?" required rows="4"></textarea></label>
        <button class="ah-mobile-contact__submit ah-unified-spacebar" type="submit"><span class="ah-route-label-final">Send Message</span></button>
        <p class="ah-mobile-contact__status" data-form-status aria-live="polite"></p>
      </form>
    </div>`;
  document.body.appendChild(overlay);


  overlay.querySelectorAll("select[data-ah-placeholder-select]").forEach((select) => {
    const syncSelectColor = () => {
      const color = select.value ? "#69ff7d" : "#fff5f7";
      select.style.setProperty("color", color, "important");
      select.style.setProperty("-webkit-text-fill-color", color, "important");
    };
    select.addEventListener("change", syncSelectColor);
    syncSelectColor();
  });

  const panel = overlay.querySelector('.ah-mobile-contact__panel');
  let lastTrigger = null;

  function openContact(trigger) {
    lastTrigger = trigger || null;
    triggers.forEach((t) => t.setAttribute('aria-expanded', t === trigger ? 'true' : 'false'));
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('ah-contact-open');
    requestAnimationFrame(() => overlay.querySelector('input[name="name"]')?.focus({preventScroll:true}));
  }
  function closeContact() {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('ah-contact-open');
    triggers.forEach((t) => t.setAttribute('aria-expanded', 'false'));
    lastTrigger?.focus({preventScroll:true});
  }

  // Round 1201: one short, self-clearing press state for Messages. Never let a
  // missing pointerup, canceled touch, route transition, or focus change leave
  // the physical button latched down. Footer navigation is intentionally NOT
  // handled here; the persistent shell router is its single navigation owner.
  let messagePressTimer = 0;
  const clearMessagePress = () => {
    clearTimeout(messagePressTimer);
    triggers.forEach((trigger) => {
      trigger.classList.remove('is-pressed');
      trigger.removeAttribute('data-ah-control-pressed');
    });
  };
  const pressMessage = (trigger) => {
    clearMessagePress();
    trigger.classList.add('is-pressed');
    trigger.setAttribute('data-ah-control-pressed','1');
    messagePressTimer = setTimeout(clearMessagePress, 320);
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener('pointerdown', () => pressMessage(trigger), {passive:true});
    trigger.addEventListener('pointerup', () => setTimeout(clearMessagePress, 90), {passive:true});
    trigger.addEventListener('pointercancel', clearMessagePress, {passive:true});
    trigger.addEventListener('pointerleave', clearMessagePress, {passive:true});
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      clearMessagePress();
      const isOpen = overlay.classList.contains('is-open') && trigger.getAttribute('aria-expanded') === 'true';
      if (isOpen) closeContact();
      else openContact(trigger);
    });
  });

  window.addEventListener('blur', clearMessagePress, {passive:true});
  window.addEventListener('pagehide', clearMessagePress, {passive:true});
  document.addEventListener('visibilitychange', () => { if (document.hidden) clearMessagePress(); }, {passive:true});
  document.addEventListener('scroll', clearMessagePress, {passive:true});

  overlay.addEventListener('click', (event) => { if (event.target === overlay) closeContact(); });
  panel.addEventListener('click', (event) => event.stopPropagation());
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && overlay.classList.contains('is-open')) closeContact(); });

  // Round 1125: one contact destination for mobile UI and embedded 3D models.
  window.AutomatedHeartsOpenContact = (detail={}) => {
    const service = typeof detail === 'string' ? detail : (detail.service || detail.source || '');
    if (service) overlay.dataset.contactService = service;
    openContact(null);
  };
  window.addEventListener('message', (event) => {
    const data = event.data || {};
    if (data.type !== 'automated-hearts:open-contact') return;
    window.AutomatedHeartsOpenContact({service:data.service || data.source || '3D model'});
  });
  document.addEventListener('click', (event) => {
    const a = event.target.closest('a');
    if (!a) return;
    const href=(a.getAttribute('href')||'').trim();
    if (!/^mailto:/i.test(href) && !(a.hasAttribute('data-contact-trigger') && !a.classList.contains('message'))) return;
    event.preventDefault(); event.stopPropagation();
    window.AutomatedHeartsOpenContact({service:a.getAttribute('data-ah-contact') || a.textContent.trim() || 'Contact'});
  }, true);
})();

;


/* Round 2106: mobile progress is owned exclusively by the canonical router. */

;


/* Round 1201 — mobile/desktop navigation press reliability.
   Physical button feedback is intentionally brief and is never tied to page
   loading. The persistent shell router is the sole navigation authority. */
(() => {
  'use strict';
  let held = null;
  let timer = 0;

  const footerLink = (node) => node && typeof node.closest === 'function'
    ? node.closest('footer#site-footer a[data-nav], body > nav.footer a[href]')
    : null;

  const clear = () => {
    clearTimeout(timer);
    document.documentElement.classList.remove('ah-footer-navigation-loading');
    document.querySelectorAll('footer#site-footer a[data-nav], body > nav.footer a[href]').forEach((link) => {
      link.removeAttribute('data-ah-footer-loading');
      link.removeAttribute('data-ah-control-pressed');
      link.classList.remove('is-nav-pressed','is-pressed','is-route-pressed');
      link.setAttribute('aria-pressed','false');
    });
    held = null;
  };

  const press = (link) => {
    clear();
    if (!link) return;
    const href = (link.getAttribute('href') || '').trim();
    if (!href || href.startsWith('#')) return;
    held = link;
    link.setAttribute('data-ah-footer-loading','1');
    link.setAttribute('data-ah-control-pressed','1');
    link.classList.add('is-nav-pressed','is-pressed');
    link.setAttribute('aria-pressed','true');
    document.documentElement.classList.add('ah-footer-navigation-loading');
    timer = setTimeout(clear, 360);
  };

  document.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    const link = footerLink(event.target);
    if (link) press(link);
  }, true);

  document.addEventListener('pointerup', () => setTimeout(clear, 90), true);
  document.addEventListener('pointercancel', clear, true);
  document.addEventListener('scroll', clear, {passive:true, capture:true});
  window.addEventListener('blur', clear, {passive:true});
  window.addEventListener('pagehide', clear, {passive:true});
  document.addEventListener('visibilitychange', () => { if (document.hidden) clear(); }, {passive:true});
  addEventListener('ah:persistent-route-complete', clear);
  addEventListener('pageshow', clear);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', clear, {once:true});
  else clear();
})();

;


/* Round 2109: envelope appearance is CSS state-owned; duplicate repaint block removed. */

;


/* Round 2105: duplicate persistent router removed; canonical router is loaded once by the page. */

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


/* Round 1939 — unified Home machine-window controller.
   Critical Information is eagerly prepared and committed to its live first frame while
   the shutter is still closed. Opening therefore moves only the shutter; card geometry
   never swaps during or after that motion. */
(()=>{
  'use strict';
  const CONTROL='[data-ah-home-window-control]';
  const SHUTTER_MS=1500;
  const SHUTTER_EASE='cubic-bezier(.22,.66,.24,1)';
  const MOBILE_PERF=matchMedia('(max-width:900px)').matches;
  const frames=()=>[...document.querySelectorAll('#home-machine-grid>.home-hero-engine-frame,#machine-stack>.machine-frame')];
  const shutterIn=frame=>frame?.querySelector('[data-machine-haze],.window-shutter')||null;
  const iframeIn=frame=>frame?.querySelector('iframe.home-hero-engine-embed,iframe.cards-live-frame,iframe.machine-3d,iframe')||null;
  const isCritical=frame=>!!frame&&(frame.classList.contains('home-hero-rolodex-frame')||frame.classList.contains('cards-frame')||iframeIn(frame)?.id==='home-machine-rolodex'||iframeIn(frame)?.classList.contains('cards-live-frame'));

  function shutterFor(control){
    const id=control?.dataset?.ahWindowShutterId;
    return id?document.getElementById(id):null;
  }
  function frameForControl(control){return shutterFor(control)?.closest('.home-hero-engine-frame,.machine-frame')||null;}
  function openState(shutter){
    if(!shutter)return false;
    if(shutter.getAttribute('aria-expanded')==='true')return true;
    const frame=shutter.closest('.home-hero-engine-frame,.machine-frame');
    return !!(frame&&(frame.classList.contains('is-haze-open')||frame.classList.contains('open')));
  }
  function setModelActivity(frame,active){
    const model=iframeIn(frame);
    try{model?.contentWindow?.postMessage({type:'automated-hearts:learning-activity',active:!!active},'*');}catch(_){}
    try{model?.contentWindow?.postMessage({type:'automated-hearts:viewport-activity',active:!!active},'*');}catch(_){}
  }
  function setSurface(frame,live){
    if(!frame)return;
    frame.dataset.ah1930Surface=live?'live':'poster';
  }
  function controlsFor(frame){
    const shutter=shutterIn(frame);
    if(!shutter?.id)return [];
    return [...document.querySelectorAll(`${CONTROL}[data-ah-window-shutter-id="${CSS.escape(shutter.id)}"]`)];
  }
  function syncOne(control){
    const shutter=shutterFor(control); if(!shutter)return;
    const open=openState(shutter),text=open?'Close window.':'Open the window.',expanded=open?'true':'false';
    const label=control.querySelector('.ah1807-home-window-control__text');
    if(label&&label.textContent!==text)label.textContent=text;
    control.setAttribute('aria-label',text); control.setAttribute('aria-expanded',expanded); control.dataset.windowState=open?'open':'closed';
  }
  function syncAll(){document.querySelectorAll(CONTROL).forEach(syncOne);}
  function placeDefinition(){
    const def=document.querySelector('.ah1759-definition-band[data-ah-definition-band]'); if(!def)return;
    const desktopGrid=document.getElementById('home-machine-grid'),desktopSection=document.getElementById('home-opening-hero');
    if(matchMedia('(min-width:761px)').matches&&desktopGrid){if(def.parentElement!==desktopGrid)desktopGrid.appendChild(def);}
    else if(desktopSection&&def.parentElement===desktopGrid)desktopSection.appendChild(def);
  }
  function probeChildReady(frame,attempt=0){
    const model=iframeIn(frame); if(!model||frame.dataset.ah1909LiveReady==='1')return;
    try{if(model.contentWindow?.__AH1814_FIRST_FRAME_SENT__){commitReady(frame);return;}}catch(_){}
    if(attempt<80)frame.__ah1930ReadyProbe=setTimeout(()=>probeChildReady(frame,attempt+1),50);
  }
  function hydrate(frame,eager=false){
    const model=iframeIn(frame); if(!model)return;
    const deferred=model.dataset?.src;
    if(deferred&&!model.getAttribute('src')){
      if(eager){model.setAttribute('loading','eager');model.setAttribute('fetchpriority','high');}
      model.setAttribute('src',deferred);
    }
    if(frame.dataset.ah1930ProbeBound!=='1'){
      frame.dataset.ah1930ProbeBound='1';
      model.addEventListener('load',()=>{clearTimeout(frame.__ah1930ReadyProbe);probeChildReady(frame,0);});
    }
    probeChildReady(frame,0);
  }
  function commitReady(frame){
    if(!frame)return;
    frame.dataset.ah1909LiveReady='1';
    frame.dataset.ah1814WindowReady='1';
    frame.classList.add('ah1909-live-ready','ah1814-window-ready');
    const critical=isCritical(frame);
    if(critical){
      /* Every Home window commits to its settled live first frame BEFORE any shutter travel. */
      setSurface(frame,true);
      requestAnimationFrame(()=>requestAnimationFrame(()=>{
        controlsFor(frame).forEach(control=>{
          if(control.dataset.ahWindowPendingOpen!=='1')return;
          control.removeAttribute('data-ah-window-pending-open');
          control.removeAttribute('aria-busy');
          if(!openState(shutterIn(frame)))setWindowOpen(frame,true);
        });
      }));
    }else{
      /* Primary machine uses the same pre-open live-surface rule as Critical Information. */
      setSurface(frame,true);
      if(openState(shutterIn(frame))&&frame.dataset.ah1930Moving!=='1')setModelActivity(frame,true);
    }
  }
  function finishMotion(frame,open){
    delete frame.dataset.ah1930Moving;
    const model=iframeIn(frame);
    try{model?.contentWindow?.postMessage({type:'ah:home-shutter-motion',moving:false},'*');}catch(_){}
    if(open){
      if(frame.dataset.ah1909LiveReady==='1')setSurface(frame,true);
      if(frame.dataset.ah1909LiveReady==='1')setModelActivity(frame,true);
    }else{
      setModelActivity(frame,false);
      /* Both windows remain on the same live frame behind the closed glass. */
      if(frame.dataset.ah1909LiveReady==='1')setSurface(frame,true);
    }
  }
  function setWindowOpen(frame,open){
    if(!frame)return;
    const shutter=shutterIn(frame); if(!shutter)return;
    frame.style.setProperty('--r688-haze-handle-visible','12px','important');
    frame.style.setProperty('--r1171-window-open-lip','12px','important');
    const target=open?'translate3d(0,calc(-100% + 12px),0)':'translate3d(0,0,0)';
    const token=(frame.__ah1930MotionToken||0)+1; frame.__ah1930MotionToken=token;
    let current='none'; try{current=getComputedStyle(shutter).transform||'none';}catch(_){}
    try{shutter.getAnimations?.().forEach(a=>a.cancel());}catch(_){}
    clearTimeout(frame.__ah1930MotionTimer); clearTimeout(frame.__ah1930HydrateTimer);
    frame.classList.toggle('is-haze-open',!!open); frame.classList.toggle('open',!!open); frame.classList.remove('is-haze-closing','is-haze-moving','ah-shutter-motion');
    frame.dataset.ah1930Moving='1'; shutter.setAttribute('aria-expanded',open?'true':'false');
    shutter.style.setProperty('display','block','important'); shutter.style.setProperty('visibility','visible','important'); shutter.style.setProperty('opacity','1','important'); shutter.style.setProperty('pointer-events','auto','important');
    shutter.style.setProperty('transition','none','important'); shutter.style.setProperty('will-change','transform','important'); shutter.style.setProperty('backface-visibility','hidden','important'); shutter.style.setProperty('-webkit-backface-visibility','hidden','important');
    if(current&&current!=='none'){shutter.style.setProperty('transform',current,'important');shutter.style.setProperty('-webkit-transform',current,'important');}
    else {const fallback=open?'translate3d(0,0,0)':'translate3d(0,calc(-100% + 12px),0)';shutter.style.setProperty('transform',fallback,'important');shutter.style.setProperty('-webkit-transform',fallback,'important');}
    setModelActivity(frame,false);
    try{iframeIn(frame)?.contentWindow?.postMessage({type:'ah:home-shutter-motion',moving:true},'*');}catch(_){}
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      if(frame.__ah1930MotionToken!==token)return;
      shutter.style.setProperty('transition',`transform ${SHUTTER_MS}ms ${SHUTTER_EASE}`,'important');
      shutter.style.setProperty('transform',target,'important'); shutter.style.setProperty('-webkit-transform',target,'important');
      frame.__ah1930MotionTimer=setTimeout(()=>{
        if(frame.__ah1930MotionToken!==token)return;
        shutter.style.setProperty('transition','none','important'); shutter.style.setProperty('transform',target,'important'); shutter.style.setProperty('-webkit-transform',target,'important');
        finishMotion(frame,!!open); syncAll();
      },SHUTTER_MS);
    }));
  }
  function resetClosed(frame){
    const shutter=shutterIn(frame); if(!shutter)return;
    frame.classList.remove('is-haze-open','open','is-haze-closing','is-haze-moving','ah-shutter-motion'); delete frame.dataset.ah1930Moving;
    shutter.setAttribute('aria-expanded','false'); shutter.style.setProperty('display','block','important'); shutter.style.setProperty('visibility','visible','important'); shutter.style.setProperty('opacity','1','important'); shutter.style.setProperty('pointer-events','auto','important'); shutter.style.setProperty('transition','none','important'); shutter.style.setProperty('transform','translate3d(0,0,0)','important'); shutter.style.setProperty('-webkit-transform','translate3d(0,0,0)','important');
    if(frame.dataset.ah1909LiveReady==='1')setSurface(frame,true); else setSurface(frame,false); setModelActivity(frame,false);
  }
  function prepareAll(){
    frames().forEach(frame=>{
      if(isCritical(frame))frame.dataset.ah1930Critical='1';
      frame.dataset.ah1939PreopenLive='1';
      /* Desktop preserves the settled live frame behind the glass. Phones keep
         the exact poster and do not initialize the iframe/WebGL until Open. */
      if(!MOBILE_PERF)hydrate(frame,true);
    });
  }
  function onControl(event,control){
    const frame=frameForControl(control),shutter=shutterFor(control); if(!frame||!shutter)return;
    event?.preventDefault?.(); event?.stopPropagation?.(); event?.stopImmediatePropagation?.();
    const opening=!openState(shutter);
    if(opening){
      frames().filter(other=>other!==frame&&openState(shutterIn(other))).forEach(other=>setWindowOpen(other,false));
      if(frame.dataset.ah1909LiveReady!=='1'){
        hydrate(frame,true); control.dataset.ahWindowPendingOpen='1'; control.setAttribute('aria-busy','true'); return false;
      }
      const model=iframeIn(frame),deferred=model?.dataset?.src;

    }
    setWindowOpen(frame,opening); syncAll(); requestAnimationFrame(syncAll); return false;
  }

  document.addEventListener('click',event=>{if(!(event.target instanceof Element))return;const c=event.target.closest(CONTROL);if(c)onControl(event,c);},true);
  document.addEventListener('keydown',event=>{if(!(event.target instanceof Element))return;const c=event.target.closest(CONTROL);if(!c||(event.key!=='Enter'&&event.key!==' '))return;onControl(event,c);},true);
  window.__AH_HOME_WINDOW_TOGGLE_1824__=(control,event)=>onControl(event,control);

  addEventListener('message',event=>{
    const data=event.data||{}; if(data.type!=='automated-hearts:home-window-first-frame')return;
    frames().forEach(frame=>{const f=iframeIn(frame);if(f&&f.contentWindow===event.source)commitReady(frame);});
  });

  let initialized=false;
  function bind(forceClosed=false){
    placeDefinition(); prepareAll();
    if(!initialized||forceClosed){frames().forEach(resetClosed);initialized=true;}
    /* Critical may already have signalled ready before a persistent-route rebind. */
    frames().forEach(frame=>{if(frame.dataset.ah1909LiveReady==='1')setSurface(frame,true);});
    syncAll();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>bind(true),{once:true});else bind(true);
  document.addEventListener('ah:persistent-route-complete',()=>setTimeout(()=>bind(true),0));
  addEventListener('pageshow',()=>bind(false),{passive:true});
  addEventListener('ah:first-intro-finished',()=>{prepareAll();syncAll();},{passive:true});
  (window.AHResponsive?window.AHResponsive.watch(()=>{placeDefinition();syncAll();}):addEventListener('resize',()=>{placeDefinition();syncAll();},{passive:true}));
})();

;


