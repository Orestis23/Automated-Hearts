

(()=>{
  'use strict';
  if(window.__AH1874MobileLearningModels)return;
  window.__AH1874MobileLearningModels=1;
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const stage=$('#lite-model-stage'), modelShell=$('#lite-model-shell');
  const reducedMotion=false; // Round 1536: explicit smooth-transition authority.
  const frameCache=new Map();
  const learningModels={
    ai101:['./models/ai-101-core-principles-round1316.html?v=1874r','./models/ai-101-human-ai-partnership-mobile-round1640.html?v=1874r','./models/ai-101-verification-lab-round1828.html?v=1874r'],
    practical:['./models/practical-ai-helix-round1828.html?v=1874r'],
    strategy:['./models/strategy-lab-ball-round1093.html?v=1640r','./models/strategy-lab-readiness-diagnostic-round1828.html?v=1874r','./models/strategy-lab-hourglass-round1828.html?v=1828r']
  };
  let selected=null, modelIndex=0, scrollToken=0, transitioning=false;
  let rootAnchorSnapshot=null;
  const freezeRootAnchor=()=>{
    if(rootAnchorSnapshot!==null)return;
    const r=document.documentElement;
    rootAnchorSnapshot={value:r.style.getPropertyValue('overflow-anchor'),priority:r.style.getPropertyPriority('overflow-anchor')};
    r.style.setProperty('overflow-anchor','none','important');
  };
  const restoreRootAnchor=()=>{
    if(rootAnchorSnapshot===null)return;
    const r=document.documentElement,snap=rootAnchorSnapshot;rootAnchorSnapshot=null;
    if(snap.value)r.style.setProperty('overflow-anchor',snap.value,snap.priority||'');else r.style.removeProperty('overflow-anchor');
  };
  const SCROLL_DOWN_MS=1300, OPEN_SHIELD_MS=1000, RETURN_SHIELD_MS=500, SCROLL_UP_MS=2600;
  const SHIELD_EASE='cubic-bezier(.22,.66,.24,1)';

  function scroller(){return document.scrollingElement||document.documentElement;}
  function viewportHeight(){return Math.round(window.visualViewport?.height||window.innerHeight);}
  function maxScroll(){const s=scroller();return Math.max(0,s.scrollHeight-viewportHeight());}
  function stageTopTarget(){
    if(!stage)return maxScroll();
    const s=scroller(),start=s.scrollTop,rect=stage.getBoundingClientRect();
    /* Mobile chrome reserves 72px at the top both standalone and when embedded
       in the persistent shell. Target that exact visual boundary so the viewport
       lock never needs a late corrective snap. */
    const topInset=72;
    return Math.max(0,Math.min(maxScroll(),start+rect.top-topInset));
  }
  function animateScroll(target,duration){
    const token=++scrollToken,s=scroller(),start=s.scrollTop;
    target=Math.max(0,Math.min(maxScroll(),target));
    const delta=target-start,prevBehavior=s.style.scrollBehavior,prevAnchor=s.style.overflowAnchor;
    document.body.dataset.ahStageScrolling='1';
    s.style.setProperty('scroll-behavior','auto','important');
    s.style.setProperty('overflow-anchor','none','important');
    const cleanup=()=>{
      if(prevBehavior)s.style.scrollBehavior=prevBehavior;else s.style.removeProperty('scroll-behavior');
      if(prevAnchor)s.style.overflowAnchor=prevAnchor;else s.style.removeProperty('overflow-anchor');
      if(token===scrollToken){delete document.body.dataset.ahStageScrolling;window.dispatchEvent(new Event('automated-hearts:stage-scroll-end'));}
    };
    if(Math.abs(delta)<2){s.scrollTop=target;cleanup();return Promise.resolve(true);}
    return new Promise(resolve=>{
      const t0=performance.now(),ease=u=>u*u*u*(u*(u*6-15)+10);
      const step=now=>{
        if(token!==scrollToken){cleanup();resolve(false);return;}
        const u=Math.min(1,(now-t0)/duration);
        s.scrollTop=start+delta*ease(u);
        if(u<1)requestAnimationFrame(step);
        else{s.scrollTop=target;cleanup();resolve(true);}
      };
      requestAnimationFrame(step);
    });
  }
  function primeStageHeight(){
    if(!stage)return;
    const vh=Math.round(window.visualViewport?.height||window.innerHeight);
    const h=Math.max(248,vh-72-74-12);
    stage.style.setProperty('--ah1527-model-stage-height',`${h}px`);
    stage.style.setProperty('--ah1528-model-stage-height',`${h}px`);
    const parent=stage.closest('.lite-section');
    if(parent){parent.style.setProperty('--ah1527-model-stage-height',`${h}px`);parent.style.setProperty('--ah1528-model-stage-height',`${h}px`);}
  }
  function ensureShield(){
    if(!stage)return null;
    let shield=stage.querySelector(':scope > .ah1528-model-shield');
    if(!shield){
      shield=document.createElement('div');
      shield.className='ah1528-model-shield';
      shield.setAttribute('aria-hidden','true');
      stage.appendChild(shield);
    }
    return shield;
  }
  function waitTransform(el,ms){
    if(!el||reducedMotion)return Promise.resolve();
    return new Promise(resolve=>{
      let done=false,timer=0;
      const finish=()=>{if(done)return;done=true;clearTimeout(timer);el.removeEventListener('transitionend',end);el.removeEventListener('transitioncancel',cancel);resolve();};
      const end=e=>{if(e.target===el&&e.propertyName==='transform')finish();};
      const cancel=e=>{if(e.target===el)finish();};
      el.addEventListener('transitionend',end);el.addEventListener('transitioncancel',cancel);
      timer=setTimeout(finish,ms+280);
    });
  }
  function setShieldClosed(){
    const shield=ensureShield(); if(!shield)return;
    shield.style.setProperty('transition','none','important');
    shield.style.setProperty('transform','translate3d(0,0,0)','important');
    shield.style.setProperty('pointer-events','auto','important');
    shield.getBoundingClientRect();
  }
  async function lowerShield(){
    const shield=ensureShield(); if(!shield)return;
    shield.style.setProperty('transition','none','important');
    shield.style.setProperty('transform','translate3d(0,0,0)','important');
    shield.style.setProperty('pointer-events','auto','important');
    shield.getBoundingClientRect();
    if(reducedMotion){shield.style.setProperty('transform','translate3d(0,101.5%,0)','important');shield.style.setProperty('pointer-events','none','important');return;}
    const done=waitTransform(shield,OPEN_SHIELD_MS);
    shield.style.setProperty('transition',`transform ${OPEN_SHIELD_MS}ms ${SHIELD_EASE}`,'important');
    requestAnimationFrame(()=>shield.style.setProperty('transform','translate3d(0,101.5%,0)','important'));
    await done;
    shield.style.setProperty('transform','translate3d(0,101.5%,0)','important');
    shield.style.setProperty('pointer-events','none','important');
  }
  async function raiseShield(){
    const shield=ensureShield(); if(!shield)return;
    shield.style.setProperty('transition','none','important');
    shield.style.setProperty('transform','translate3d(0,101.5%,0)','important');
    shield.style.setProperty('pointer-events','auto','important');
    shield.getBoundingClientRect();
    if(reducedMotion){shield.style.setProperty('transform','translate3d(0,0,0)','important');return;}
    const done=waitTransform(shield,RETURN_SHIELD_MS);
    shield.style.setProperty('transition',`transform ${RETURN_SHIELD_MS}ms ${SHIELD_EASE}`,'important');
    requestAnimationFrame(()=>shield.style.setProperty('transform','translate3d(0,0,0)','important'));
    await done;
    shield.style.setProperty('transform','translate3d(0,0,0)','important');
  }
  function sendActivity(frame,active){
    try{
      frame?.contentWindow?.postMessage({type:'automated-hearts:learning-activity',active:!!active},'*');
      frame?.contentWindow?.postMessage({type:'automated-hearts:viewport-activity',active:!!active},'*');
      frame?.contentWindow?.postMessage({type:'engine-visibility',visible:!!active},'*');
    }catch(_){}
  }
  function ensureFrame(url){
    if(!modelShell||!url)return null;
    if(frameCache.has(url))return frameCache.get(url);
    const frame=document.createElement('iframe');
    frame.title='Interactive Automated Hearts 3D model';frame.loading='eager';frame.allow='webgl';
    frame.setAttribute('allowtransparency','true');frame.setAttribute('aria-hidden','true');
    Object.assign(frame.style,{position:'absolute',inset:'0',width:'100%',height:'100%',border:'0',visibility:'hidden',opacity:'0',pointerEvents:'none',transform:'none'});
    frame.addEventListener('load',()=>{
      frame.dataset.ah1533Loaded='1';
      if(frame.dataset.ahActive==='1')frame.style.opacity='1';
      const live=frame.dataset.ahActive==='1'&&document.body.dataset.ahModelHalf==='bottom'&&document.body.dataset.ahStageTransition!=='1';
      [0,80,220,520].forEach(ms=>setTimeout(()=>sendActivity(frame,live),ms));
    });
    modelShell.appendChild(frame);frameCache.set(url,frame);frame.src=url;return frame;
  }
  function showModel(url){
    if(!modelShell||!url)return;
    const active=ensureFrame(url);
    frameCache.forEach(frame=>{
      const on=frame===active;frame.dataset.ahActive=on?'1':'0';frame.setAttribute('aria-hidden',on?'false':'true');
      frame.style.visibility=on?'visible':'hidden';frame.style.opacity=(on&&frame.dataset.ah1533Loaded==='1')?'1':'0';frame.style.pointerEvents=on?'auto':'none';sendActivity(frame,on&&document.body.dataset.ahModelHalf==='bottom'&&document.body.dataset.ahStageTransition!=='1');
    });
    modelShell.hidden=false;
  }
  // Prepare only the selected model before visible travel; no speculative WebGL work.
  async function prepareTravelFrame(frame){
    if(!frame)return;
    if(frame.dataset.ah1533Loaded!=='1')await new Promise(resolve=>{
      let timer;
      const done=()=>{clearTimeout(timer);frame.removeEventListener('load',done);frame.removeEventListener('error',done);resolve();};
      frame.addEventListener('load',done,{once:true});frame.addEventListener('error',done,{once:true});
      timer=setTimeout(done,6000);
    });
    sendActivity(frame,true);
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    sendActivity(frame,false);
  }
  function pauseAll(){frameCache.forEach(frame=>{frame.dataset.ahActive='0';frame.style.pointerEvents='none';sendActivity(frame,false);});}
  function syncNavState(){
    const models=selected?(learningModels[selected]||[]):[],multi=models.length>1,prev=$('#model-prev'),next=$('#model-next');
    if(prev){prev.disabled=!multi;prev.setAttribute('aria-disabled',multi?'false':'true');}
    if(next){next.disabled=!multi;next.setAttribute('aria-disabled',multi?'false':'true');}
  }
  async function openSelected(){
    if(transitioning||!selected||!learningModels[selected]||!stage||!modelShell)return;
    transitioning=true;
    freezeRootAnchor();
    document.body.dataset.ahStageTransition='1';
    document.body.dataset.ahModelHalf='transition-in';
    primeStageHeight();
    stage.hidden=false;stage.setAttribute('aria-hidden','false');
    stage.closest('.lite-section')?.style.setProperty('content-visibility','visible');
    modelShell.hidden=false;modelShell.style.position='relative';
    setShieldClosed();
    syncNavState();
    /* Round 1545: stage geometry settles for two frames with document anchoring
       frozen; no instantaneous scrollTop correction is allowed before motion. */
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    try{
      // Load during travel; the shield and scroll start on the same animation frame.
      const url=learningModels[selected][modelIndex]||learningModels[selected][0];
      const frame=ensureFrame(url);
      await prepareTravelFrame(frame);
      showModel(url);
      const [finished]=await Promise.all([
        animateScroll(stageTopTarget(),SCROLL_DOWN_MS),
        lowerShield()
      ]);
      if(finished===false)return;
      document.body.dataset.ahModelHalf='bottom';
      showModel(learningModels[selected][modelIndex]||learningModels[selected][0]);
    }finally{delete document.body.dataset.ahStageTransition;if(document.body.dataset.ahModelHalf==='bottom'&&selected)showModel(learningModels[selected][modelIndex]||learningModels[selected][0]);restoreRootAnchor();window.dispatchEvent(new Event('automated-hearts:stage-transition-end'));transitioning=false;}
  }
  $$('.route-label[data-lite-learning]').forEach(el=>el.addEventListener('click',e=>{
    e.preventDefault();
    if(transitioning)return;
    selected=el.dataset.liteLearning;modelIndex=0;
    void openSelected();
  }));
  $('#model-prev')?.addEventListener('click',()=>{if(transitioning||!selected)return;const models=learningModels[selected]||[];if(models.length<2)return;modelIndex=(modelIndex-1+models.length)%models.length;showModel(models[modelIndex]);});
  $('#model-next')?.addEventListener('click',()=>{if(transitioning||!selected)return;const models=learningModels[selected]||[];if(models.length<2)return;modelIndex=(modelIndex+1)%models.length;showModel(models[modelIndex]);});
  $('#learning-choose-another')?.addEventListener('click',async event=>{
    event.preventDefault(); if(transitioning)return;
    const button=event.currentTarget;button.disabled=true;transitioning=true;
    freezeRootAnchor();
    document.body.dataset.ahStageTransition='1';
    document.body.dataset.ahModelHalf='transition-out';
    try{
      pauseAll();
      await Promise.all([raiseShield(),animateScroll(0,SCROLL_UP_MS)]);
      if(modelShell)modelShell.hidden=true;
      if(stage){stage.hidden=true;stage.setAttribute('aria-hidden','true');}
      document.body.dataset.ahModelHalf='top';
      selected=null;modelIndex=0;syncNavState();setShieldClosed();
      document.querySelector('[data-lite-learning]')?.focus({preventScroll:true});
    }finally{delete document.body.dataset.ahStageTransition;restoreRootAnchor();window.dispatchEvent(new Event('automated-hearts:stage-transition-end'));transitioning=false;button.disabled=false;}
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseAll();else if(selected&&document.body.dataset.ahModelHalf==='bottom'&&document.body.dataset.ahStageTransition!=='1'){const models=learningModels[selected]||[];showModel(models[modelIndex]||models[0]);}});
  document.body.dataset.ahModelHalf='top';syncNavState();setShieldClosed();
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


(()=>{
  'use strict';
  const BLUE='#07111b';
  const paintSurface=(el)=>{
    if(!el)return;
    el.style.setProperty('background-color',BLUE,'important');
    el.style.setProperty('background-image','none','important');
    el.style.setProperty('background-attachment','scroll','important');
    el.style.setProperty('animation','none','important');
    el.style.setProperty('transition','none','important');
  };
  const paintFrame=(frame)=>{
    if(!frame)return;
    paintSurface(frame);
    try{
      const doc=frame.contentDocument;
      if(!doc)return;
      [doc.documentElement,doc.body].filter(Boolean).forEach(paintSurface);
      doc.querySelectorAll('canvas').forEach(c=>{
        c.style.setProperty('background','transparent','important');
        c.style.setProperty('background-color','transparent','important');
        c.style.setProperty('background-image','none','important');
      });
    }catch(_){ }
  };
  const enforce=()=>{
    document.querySelectorAll('#learning-model-stage,#who-help-model-stage,#learning-model-stage>.learning-lesson-viewport,#who-help-model-stage>.learning-lesson-viewport,#lite-model-stage,#lite-model-shell,.r1060-static-model-heart').forEach(paintSurface);
    document.querySelectorAll('img.r978-persistent-model-backdrop,img.r980-persistent-embossed-backdrop').forEach(img=>{img.hidden=true;img.style.setProperty('display','none','important');});
    document.querySelectorAll('#learning-model-stage iframe,#who-help-model-stage iframe,#lite-model-shell iframe').forEach(frame=>{
      paintFrame(frame);
      if(!frame.dataset.ah1780BgGuard){
        frame.dataset.ah1780BgGuard='1';
        frame.addEventListener('load',()=>{paintFrame(frame);requestAnimationFrame(()=>paintFrame(frame));setTimeout(()=>paintFrame(frame),120);},{passive:true});
      }
    });
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',enforce,{once:true});else enforce();
  const root=document.querySelector('#learning-model-stage,#who-help-model-stage,#lite-model-stage')||document.body;
  if(root)new MutationObserver(enforce).observe(root,{childList:true,subtree:true});
})();

;


(()=>{'use strict';const imp=(el,p,v)=>el&&el.style.setProperty(p,v,'important');function addMatte(el){if(!el||el.querySelector(':scope>.ah1469-clear-matte-film'))return;imp(el,'position','relative');imp(el,'isolation','isolate');imp(el,'overflow','hidden');const film=document.createElement('span');film.className='ah1469-clear-matte-film';film.setAttribute('aria-hidden','true');el.appendChild(film);}function applySolutionMatte(){document.querySelectorAll('body.page-solutions[data-page="solutions"] #solution-copper-tablets .solution-copper-tablet>h3,body[data-ah-mobile-surface="solutions"] main#main-content .outcome-grid .lite-card .lite-card-body>h3,body[data-ah-mobile-surface="solutions"] .ah-negative-software-title,body[data-ah-mobile-surface="solutions"] .ah-solution-open-sign,body[data-ah-mobile-surface="solutions"] .ah-negative-software-ticker').forEach(addMatte);}function addDivider(sec,ice){if(!sec)return;imp(sec,'position','relative');let line=sec.querySelector(':scope>.ah1469-home-divider-glow');if(!line){line=document.createElement('span');line.className='ah1469-home-divider-glow';line.setAttribute('aria-hidden','true');sec.prepend(line);}line.classList.toggle('ah1469-home-divider-glow--ice',!!ice);}function removeDivider(sec){if(!sec)return;sec.querySelectorAll(':scope>.ah1469-home-divider-glow').forEach(n=>n.remove());}function applyHomeDividers(){if(document.body?.matches('.page-home[data-page="home"]')){removeDivider(document.querySelector('#home-route-buttons'));removeDivider(document.querySelector('#home-solution-framework'));removeDivider(document.querySelector('#home-overview-section'));}if(document.body?.dataset?.ahMobileSurface==='home'){document.querySelectorAll('main#main-content>section').forEach(removeDivider);}}function applyLearningGap(){if(!document.body?.matches('.page-learning[data-page="learning"]')||!matchMedia('(min-width:901px)').matches)return;document.querySelectorAll('#learning-route-buttons .learning-header-grid.r987-learning-flat-grid>article.r987-learning-flat-card').forEach(card=>{imp(card,'gap','12px');imp(card,'row-gap','12px');});}function applyAll(){applySolutionMatte();applyHomeDividers();applyLearningGap();}let raf=0;const queue=()=>{if(raf)return;raf=requestAnimationFrame(()=>{raf=0;applyAll();});};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',applyAll,{once:true});else applyAll();addEventListener('load',applyAll,{once:true});addEventListener('pageshow',applyAll);(window.AHResponsive?window.AHResponsive.watch(queue):addEventListener('resize',queue,{passive:true}));addEventListener('ah:persistent-route-complete',queue);new MutationObserver(queue).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','data-page','data-ah-mobile-surface']});})();

;


/* Round 1533 — model stage fills the usable field and locks at its exact top.
   The explicit return control remains the only way to move back above the stage. */
(()=>{
  'use strict';
  if(window.__AH1533ModelStageViewportLock)return;
  window.__AH1533ModelStageViewportLock=1;

  const desktopStage=()=>document.querySelector('#learning-model-stage,#who-help-model-stage');
  const mobileStage=()=>document.getElementById('lite-model-stage');
  const stage=()=>desktopStage()||mobileStage();
  const main=()=>document.getElementById('main-content');

  const visible=(el)=>{
    if(!el||el.hidden||el.getAttribute('aria-hidden')==='true')return false;
    const cs=getComputedStyle(el);
    return cs.display!=='none'&&cs.visibility!=='hidden'&&parseFloat(cs.opacity||'1')>0;
  };

  const getScroller=()=>{
    const m=main();
    if(m){
      const cs=getComputedStyle(m);
      if(/auto|scroll/.test(cs.overflowY||'') && m.scrollHeight>m.clientHeight+2)return m;
    }
    return document.scrollingElement||document.documentElement;
  };

  const isDocumentScroller=(s)=>s===document.scrollingElement||s===document.documentElement||s===document.body;

  const px=(v)=>{
    const n=parseFloat(v);
    return Number.isFinite(n)?n:0;
  };

  const mobileInsets=()=>{
    /* Round 1545: the mobile model controllers target a fixed 72px top / 74px
       bottom usable-field inset. The lock authority must use the identical values.
       Measuring transient browser/shell geometry here produced a different target
       after the transition and caused the visible end-of-scroll correction. */
    if(matchMedia('(max-width:800px)').matches)return {top:72,bottom:74};
    const rootStyle=getComputedStyle(document.documentElement);
    const top=px(rootStyle.getPropertyValue('--current-frame-top'));
    const bottom=px(rootStyle.getPropertyValue('--current-frame-bottom'));
    return {top:Math.max(0,top),bottom:Math.max(0,bottom)};
  };

  const returnButton=()=>{
    const s=stage();
    return s?.querySelector('[data-learning-choose-another],[data-who-help-back-to-top],#learning-choose-another,#industry-choose-another,.lite-return-control,.learning-stage-return')||null;
  };

  const exiting=()=>!!returnButton()?.disabled;
  const programmaticScroll=()=>document.body?.dataset?.ahStageScrolling==='1';
  const stageTransition=()=>document.body?.dataset?.ahStageTransition==='1';

  const stageTopInScroller=(s,sc)=>{
    const sr=s.getBoundingClientRect();
    if(isDocumentScroller(sc))return sc.scrollTop+sr.top;
    const cr=sc.getBoundingClientRect();
    return sc.scrollTop+(sr.top-cr.top);
  };

  let armed=false;
  let lockTop=0;
  let correcting=false;
  let lastStage=null;
  let settleTimer=0;

  const setSize=(el,key,value)=>{if(el&&el.style.getPropertyValue(key)!==value)el.style.setProperty(key,value);};
  const sizeStage=()=>{
    const s=stage();
    /* Freeze the exact stage height chosen at transition start. Mobile browser
       chrome can resize visualViewport while scripted scrolling is in progress;
       resizing the stage mid-flight changes scrollHeight and reads as a jerk. */
    if(programmaticScroll()||stageTransition())return;
    if(!s||!visible(s))return;
    const sc=getScroller();
    let h=0;
    if(!isDocumentScroller(sc)){
      h=sc.clientHeight;
    }else{
      const inset=mobileInsets();
      const viewportH=Math.round(window.visualViewport?.height||window.innerHeight);
      h=Math.max(248,viewportH-inset.top-inset.bottom-12);
    }
    setSize(s,'--ah1527-model-stage-height',`${h}px`);
    setSize(s,'--ah1528-model-stage-height',`${h}px`);
    const parent=s.closest('.lite-section');
    if(parent){setSize(parent,'--ah1527-model-stage-height',`${h}px`);setSize(parent,'--ah1528-model-stage-height',`${h}px`);}
  };

  const computeLock=()=>{
    const s=stage();
    if(!s||!visible(s))return 0;
    const sc=getScroller();
    const raw=stageTopInScroller(s,sc);
    if(!isDocumentScroller(sc))return Math.max(0,raw);
    const viewportH=Math.round(window.visualViewport?.height||window.innerHeight);
    return Math.max(0,Math.min(sc.scrollHeight-viewportH,raw-mobileInsets().top));
  };

  const scrollToLock=()=>{
    const s=stage();
    if(!s||!visible(s)||exiting())return;
    const sc=getScroller();
    lockTop=computeLock();
    correcting=true;
    sc.scrollTop=lockTop;
    requestAnimationFrame(()=>{correcting=false;});
  };

  const sync=()=>{
    const s=stage();
    if(programmaticScroll()||stageTransition())return;
    if(!s||!visible(s)){
      armed=false;lockTop=0;lastStage=s||null;
      clearTimeout(settleTimer);
      return;
    }
    sizeStage();
    const sc=getScroller();
    if(s!==lastStage||!lockTop){
      lastStage=s;
      lockTop=computeLock();
      armed=false;
    }
    const y=sc.scrollTop;
    if(!armed&&(y>=lockTop-4||document.body.dataset.ahModelHalf==='bottom'))armed=true;
    if(armed&&!exiting()&&y<lockTop-1&&!correcting){
      correcting=true;
      sc.scrollTop=lockTop;
      requestAnimationFrame(()=>{correcting=false;});
    }
    if(armed&&!exiting()){
      clearTimeout(settleTimer);
      settleTimer=setTimeout(()=>{
        const active=stage();
        if(active&&visible(active)&&!exiting()&&!stageTransition())scrollToLock();
      },140);
    }
  };

  const atUpperBoundary=()=>{
    const s=stage();
    if(programmaticScroll()||!armed||!s||!visible(s)||exiting())return false;
    const sc=getScroller();
    return sc.scrollTop<=lockTop+2;
  };

  addEventListener('scroll',sync,{passive:true,capture:true});
  addEventListener('wheel',e=>{
    if(stageTransition()){e.preventDefault();return;}
    if(atUpperBoundary()&&e.deltaY<0)e.preventDefault();
  },{passive:false,capture:true});

  let touchY=null;
  addEventListener('touchstart',e=>{touchY=e.touches?.[0]?.clientY??null;},{passive:true,capture:true});
  addEventListener('touchmove',e=>{
    if(stageTransition()){e.preventDefault();return;}
    if(touchY==null)return;
    const y=e.touches?.[0]?.clientY;
    if(y==null)return;
    if(atUpperBoundary()&&y>touchY+2)e.preventDefault();
    touchY=y;
  },{passive:false,capture:true});
  addEventListener('touchend',()=>{touchY=null;},{passive:true,capture:true});

  addEventListener('keydown',e=>{
    if(stageTransition()&&['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '].includes(e.key)){e.preventDefault();return;}
    if(atUpperBoundary()&&(['ArrowUp','PageUp','Home'].includes(e.key)||(e.key===' '&&e.shiftKey)))e.preventDefault();
  },true);

  let syncFrame=0, syncTimer=0;
  const resyncSoon=()=>{
    if(programmaticScroll()||stageTransition())return;
    if(!syncFrame)syncFrame=requestAnimationFrame(()=>{syncFrame=0;sync();});
    clearTimeout(syncTimer);syncTimer=setTimeout(sync,160);
  };

  const observe=()=>{
    const s=stage();
    if(!s)return;
    const mo=new MutationObserver(resyncSoon);
    mo.observe(s,{attributes:true,attributeFilter:['style','hidden','aria-hidden','class'],childList:true,subtree:false});
    resyncSoon();
  };

  addEventListener('automated-hearts:stage-scroll-end',()=>{if(!stageTransition())resyncSoon();},{passive:true});
  addEventListener('automated-hearts:stage-transition-end',()=>{
    const s=stage();
    clearTimeout(settleTimer);
    if(!s||!visible(s)){armed=false;lockTop=0;lastStage=s||null;return;}
    /* Round 1546: adopt the exact position where the scripted transition ended.
       Do not issue a corrective scrollTop assignment after the animation; that was
       the small final kick users could see as the viewport lock took over. */
    lastStage=s;
    const sc=getScroller();
    lockTop=Math.max(0,sc.scrollTop);
    armed=true;
    correcting=false;
  },{passive:true});
  const syncResponsiveStage=()=>{if(!programmaticScroll()&&!stageTransition())sizeStage();sync();};
  if(window.AHResponsive)window.AHResponsive.watch(syncResponsiveStage);
  else { addEventListener('resize',syncResponsiveStage,{passive:true}); if(window.visualViewport)window.visualViewport.addEventListener('resize',syncResponsiveStage,{passive:true}); }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',observe,{once:true});
  else observe();


  /* 3D envelope contact bridge.
     Model iframes post `automated-hearts:open-contact`; embedded page shells
     relay that intent upward, while a top-level page opens its existing contact
     control.  This makes the top/bottom envelope caps reliable on desktop,
     dedicated mobile pages, and persistent-shell embedded routes. */
  const openModelContact=(detail={})=>{
    const service=typeof detail==='string'?detail:(detail.service||detail.source||'3D model');

    // If the normal page contact API already exists (dedicated mobile), use it.
    const existing=window.AutomatedHeartsOpenContact;
    if(typeof existing==='function' && existing!==openModelContact){
      try{ existing({service}); return true; }catch(_){}
    }

    // Embedded route: relay to the persistent parent shell instead of creating
    // a second form inside the iframe.
    if(window.parent&&window.parent!==window){
      try{
        if(typeof window.parent.AutomatedHeartsOpenContact==='function'){
          window.parent.AutomatedHeartsOpenContact({service});
          return true;
        }
      }catch(_){}
      try{
        window.parent.postMessage({type:'automated-hearts:open-contact',service,source:'3D model'},'*');
        return true;
      }catch(_){}
    }

    // Desktop/top-level route: reuse the existing Messages trigger/drawer.
    const trigger=document.querySelector('#header-send-message[data-contact-trigger],.message[data-contact-trigger],[data-contact-trigger]');
    if(trigger){
      try{ trigger.click(); return true; }catch(_){}
    }
    return false;
  };

  if(typeof window.AutomatedHeartsOpenContact!=='function'){
    window.AutomatedHeartsOpenContact=openModelContact;
  }

  window.addEventListener('message',(event)=>{
    const data=event.data||{};
    if(data.type!=='automated-hearts:open-contact')return;
    // Ignore a message coming down from our parent to avoid relay loops.
    if(window.parent!==window && event.source===window.parent)return;
    openModelContact({service:data.service||data.source||'3D model'});
  });
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


