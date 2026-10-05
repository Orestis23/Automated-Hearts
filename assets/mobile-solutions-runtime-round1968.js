

(() => {
  'use strict';
const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  // Native route cards remain ordinary links/buttons. Only explicit 3D loading uses JS.
  const stage = $('#lite-model-stage');
  const modelShell = $('#lite-model-shell');
  let frame = null;
  let selected = null;
  let modelIndex = 0;
  const learningModels={
    ai101:['./models/ai-101-core-principles-round1316.html?v=1533r','./models/ai-101-human-ai-partnership-mobile-round1640.html?v=1640r','./models/ai-101-verification-lab-round1828.html?v=1828r'],
    practical:['./models/practical-ai-helix-round1828.html?v=1828r'],
    strategy:['./models/strategy-lab-ball-round1093.html?v=1640r','./models/strategy-lab-readiness-diagnostic-round1828.html?v=1828r','./models/strategy-lab-hourglass-round1828.html?v=1828r']
  };
  function unloadModel(){ if(frame){ frame.src='about:blank'; frame.remove(); frame=null; } if(modelShell && !document.getElementById('solution-mobile-cover')) modelShell.hidden=true; }
  function loadUrl(url){
    if(!modelShell) return;
    unloadModel();
    frame=document.createElement('iframe');
    frame.title='Interactive Automated Hearts 3D model';
    frame.loading='eager';
    frame.allow='webgl';
    frame.setAttribute('allowtransparency','true');
    frame.src=url;
    modelShell.appendChild(frame);
    modelShell.hidden=false;
  }
  $$('[data-lite-learning]').forEach((el) => el.addEventListener('click', (e) => {
    e.preventDefault(); selected=el.dataset.liteLearning; modelIndex=0; unloadModel();
    if(stage){ stage.hidden=false; $('#stage-title').textContent=el.dataset.title || 'Interactive lesson'; }
    $$('.learning-copy>div').forEach(x=>x.classList.toggle('active',x.dataset.copy===selected));
    $('#load-learning-model')?.setAttribute('data-kind',selected);
    stage?.scrollIntoView({block:'start'});
  }));
  $('#load-learning-model')?.addEventListener('click', (e) => {
    const kind=e.currentTarget.dataset.kind || selected || 'ai101'; selected=kind; modelIndex=0; loadUrl(learningModels[kind][0]);
    const ctrls=$('#model-controls'); if(ctrls) ctrls.hidden=learningModels[kind].length<2;
  });
  $('#model-prev')?.addEventListener('click',()=>{ if(!selected) return; const a=learningModels[selected]; modelIndex=(modelIndex-1+a.length)%a.length; loadUrl(a[modelIndex]); });
  $('#model-next')?.addEventListener('click',()=>{ if(!selected) return; const a=learningModels[selected]; modelIndex=(modelIndex+1)%a.length; loadUrl(a[modelIndex]); });

  $$('[data-industry]').forEach((el)=>el.addEventListener('click',(e)=>{
    e.preventDefault(); unloadModel(); selected=el.dataset.industry; if(stage){stage.hidden=false; $('#stage-title').textContent=el.dataset.title;} $('#industry-helix')?.setAttribute('data-industry-index',selected); stage?.scrollIntoView({block:'start'});
  }));
  $('#industry-helix')?.addEventListener('click',(e)=>{ const i=e.currentTarget.dataset.industryIndex||'0'; loadUrl(`./models/who-we-help-industry-helix-round1093.html?industry=${encodeURIComponent(i)}&v=1353r`); });
  $('#industry-readiness')?.addEventListener('click',()=>loadUrl('./models/who-we-help-readiness-signals-round1513.html?v=1513r'));
  const solutionCover = $('#solution-mobile-cover');
  const solutionControl = $('#solution-mobile-window-heading') || $('.ah-solution-open-sign');
  const solutionUrl = './solution-machine-pipeline-round1865.html?preview=1&v=1958r';
  function setSolutionCover(open){
    if(!solutionCover) return;
    solutionCover.classList.toggle('is-open',!!open);
    solutionCover.setAttribute('aria-expanded',open?'true':'false');
    solutionCover.setAttribute('aria-label',open?'Lower the machine cover':'Reveal the machine');
    if(frame) frame.style.pointerEvents=open?'auto':'none';
    frame?.contentWindow?.postMessage({type:'engine-visibility',visible:!!open},'*');
  }
  function toggleSolutionCover(){
    const opening=!solutionCover?.classList.contains('is-open');
    if(opening && !frame){
      loadUrl(solutionUrl);
      solutionControl?.setAttribute('aria-busy','true');
      /* Round 1909: open immediately over the deterministic still. The live
         surface is allowed through only after its first-frame message. */
      setSolutionCover(true);
      return;
    }
    setSolutionCover(opening);
  }
  solutionControl?.addEventListener('click',(e)=>{
    if(window.__AH1940_SOLUTION_WINDOW__) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    toggleSolutionCover();
  },true);
  solutionControl?.addEventListener('keydown',(e)=>{
    if(window.__AH1940_SOLUTION_WINDOW__) return;
    if(e.key!=='Enter'&&e.key!==' ') return;
    e.preventDefault();
    e.stopImmediatePropagation();
    toggleSolutionCover();
  },true);
  solutionCover?.addEventListener('click',(e)=>{
    e.preventDefault();
    e.stopImmediatePropagation();
  },true);
  setSolutionCover(false);

  // Round 1868: keep the Solution model unloaded until the user presses Open the window.
  document.addEventListener('visibilitychange',()=>{ if(document.hidden){ unloadModel(); setSolutionCover(false); } });
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
  const desktopControl=document.getElementById('solution-process-heading')||document.querySelector('.ah-solution-open-sign');
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
  const toggleDesktopCover=()=>{
    const opening=!cover?.classList.contains('is-open');
    const model=currentModelFrame();
    const deferred=model?.dataset?.src;
    if(opening && model && deferred && !model.getAttribute('src')){
      desktopControl?.setAttribute('aria-busy','true');
      /* Round 1909: move the shutter immediately. The deterministic still remains
         visible until the live iframe reports its first rendered frame. */
      setDesktopCover(true);
      model.setAttribute('loading','eager');
      model.setAttribute('src',deferred);
      return;
    }
    setDesktopCover(opening);
  };
  desktopControl?.addEventListener('click',event=>{
    event.preventDefault();
    event.stopImmediatePropagation();
    toggleDesktopCover();
  },true);
  desktopControl?.addEventListener('keydown',event=>{
    if(event.key!=='Enter'&&event.key!==' ') return;
    event.preventDefault();
    event.stopImmediatePropagation();
    toggleDesktopCover();
  },true);
  cover?.addEventListener('click',event=>{
    event.preventDefault();
    event.stopImmediatePropagation();
  },true);
  if(cover){ setDesktopCover(false); addEventListener('pageshow',()=>setDesktopCover(false),{passive:true}); }

  // Initial hashes should use the same controlled positioning, never a native jump.
  if(location.hash && validHashes.has(resolveHash(location.hash))){
    requestAnimationFrame(()=>requestAnimationFrame(()=>navigate(location.hash)));
  }
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


(()=>{'use strict';const imp=(el,p,v)=>el&&el.style.setProperty(p,v,'important');function addMatte(el){if(!el||el.querySelector(':scope>.ah1469-clear-matte-film'))return;imp(el,'position','relative');imp(el,'isolation','isolate');imp(el,'overflow','hidden');const film=document.createElement('span');film.className='ah1469-clear-matte-film';film.setAttribute('aria-hidden','true');el.appendChild(film);}function applySolutionMatte(){document.querySelectorAll('body.page-solutions[data-page="solutions"] #solution-copper-tablets .solution-copper-tablet>h3,body[data-ah-mobile-surface="solutions"] main#main-content .outcome-grid .lite-card .lite-card-body>h3,body[data-ah-mobile-surface="solutions"] .ah-negative-software-title,body[data-ah-mobile-surface="solutions"] .ah-solution-open-sign,body[data-ah-mobile-surface="solutions"] .ah-negative-software-ticker').forEach(addMatte);}function addDivider(sec,ice){if(!sec)return;imp(sec,'position','relative');let line=sec.querySelector(':scope>.ah1469-home-divider-glow');if(!line){line=document.createElement('span');line.className='ah1469-home-divider-glow';line.setAttribute('aria-hidden','true');sec.prepend(line);}line.classList.toggle('ah1469-home-divider-glow--ice',!!ice);}function removeDivider(sec){if(!sec)return;sec.querySelectorAll(':scope>.ah1469-home-divider-glow').forEach(n=>n.remove());}function applyHomeDividers(){if(document.body?.matches('.page-home[data-page="home"]')){removeDivider(document.querySelector('#home-route-buttons'));removeDivider(document.querySelector('#home-solution-framework'));removeDivider(document.querySelector('#home-overview-section'));}if(document.body?.dataset?.ahMobileSurface==='home'){document.querySelectorAll('main#main-content>section').forEach(removeDivider);}}function applyLearningGap(){if(!document.body?.matches('.page-learning[data-page="learning"]')||!matchMedia('(min-width:901px)').matches)return;document.querySelectorAll('#learning-route-buttons .learning-header-grid.r987-learning-flat-grid>article.r987-learning-flat-card').forEach(card=>{imp(card,'gap','12px');imp(card,'row-gap','12px');});}function applyAll(){applySolutionMatte();applyHomeDividers();applyLearningGap();}let raf=0;const queue=()=>{if(raf)return;raf=requestAnimationFrame(()=>{raf=0;applyAll();});};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',applyAll,{once:true});else applyAll();addEventListener('load',applyAll,{once:true});addEventListener('pageshow',applyAll);(window.AHResponsive?window.AHResponsive.watch(queue):addEventListener('resize',queue,{passive:true}));addEventListener('ah:persistent-route-complete',queue);new MutationObserver(queue).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','data-page','data-ah-mobile-surface']});})();

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


/* Round 1909 — first-frame authority for Home + Solution machine windows. */
(()=>{
  'use strict';
  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>[...r.querySelectorAll(s)];

  function frameHostForSource(source){
    for(const iframe of qa('iframe')){
      try{
        if(iframe.contentWindow!==source)continue;
      }catch(_){continue;}
      return iframe.closest('.home-hero-engine-frame,.machine-frame,.solution-process-window,.solution-mobile-model-shell');
    }
    return null;
  }
  function setReady(host){
    if(!host)return;
    host.dataset.ah1909LiveReady='1';
    host.classList.add('ah1909-live-ready');
  }
  function syncSolutionHost(host,cover){
    if(!host||!cover)return;
    const open=cover.classList.contains('is-open')||cover.getAttribute('aria-expanded')==='true';
    host.classList.toggle('ah1909-window-open',open);
  }
  function bindSolutionPair(host,cover){
    if(!host||!cover||host.dataset.ah1909Bound==='1')return;
    host.dataset.ah1909Bound='1';
    syncSolutionHost(host,cover);
    const obs=new MutationObserver(()=>syncSolutionHost(host,cover));
    obs.observe(cover,{attributes:true,attributeFilter:['class','aria-expanded']});
  }
  function bind(){
    bindSolutionPair(q('#solution-process-header .solution-process-window'),q('#solution-process-cover'));
    bindSolutionPair(q('#lite-model-shell.solution-mobile-model-shell'),q('#solution-mobile-cover'));
  }
  addEventListener('message',event=>{
    const data=event.data||{};
    if(data.type==='automated-hearts:home-window-first-frame'){
      const host=frameHostForSource(event.source);
      if(host)setReady(host);
      return;
    }
    if(data.type==='automated-hearts:solution-window-first-frame'){
      const host=frameHostForSource(event.source);
      if(host){setReady(host);const cover=host.querySelector('#solution-process-cover,#solution-mobile-cover');syncSolutionHost(host,cover);}
      const control=q('.ah-solution-open-sign');
      control?.removeAttribute('aria-busy');
    }
  });
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});else bind();
  document.addEventListener('ah:persistent-route-complete',()=>setTimeout(bind,0));
  addEventListener('pageshow',bind,{passive:true});
})();

;


/* Round 1958 — Solution window controller.
   The actual machine iframe is eagerly created/hydrated so its first rendered
   frame is visible behind the closed Home-style glass before the window opens. */
(()=>{'use strict';window.__AH1940_SOLUTION_WINDOW__=true;
 const COVER='#solution-process-cover,#solution-mobile-cover', CONTROL='.ah-solution-open-sign';
 const DESKTOP_URL='./solution-machine-pipeline-round1865.html?v=1958r';
 const MOBILE_URL='./solution-machine-pipeline-round1865.html?preview=1&v=1968r';
 const MOBILE_PERF=matchMedia('(max-width:900px)').matches;
 const cover=()=>document.querySelector(COVER), control=()=>document.querySelector(CONTROL);

 function ensureFrame(){
   let f=document.querySelector('#solution-engine-model,#lite-model-shell>iframe');
   if(f)return f;
   const shell=document.querySelector('#lite-model-shell.solution-mobile-model-shell');
   if(!shell)return null;
   f=document.createElement('iframe');
   f.title='Interactive Automated Hearts machine; select an overhead sign to explore its section';
   f.loading='eager';
   f.setAttribute('fetchpriority','high');
   f.setAttribute('allow','webgl');
   f.setAttribute('allowtransparency','true');
   f.dataset.src=MOBILE_URL;
   shell.appendChild(f);
   return f;
 }
 const frame=()=>ensureFrame();
 const isOpen=()=>{const c=cover();return !!c&&(c.classList.contains('is-open')||c.getAttribute('aria-expanded')==='true');};

 function sync(){
   const c=cover(),b=control();if(!c||!b)return;
   const open=isOpen(),txt=open?'Close window.':'Open the window.';
   const l=b.querySelector('.ah-solution-open-sign__text');
   if(l)l.textContent=txt;
   b.setAttribute('aria-label',txt);
   b.setAttribute('aria-expanded',open?'true':'false');
   b.dataset.windowState=open?'open':'closed';
 }

 function hydrate(){
   const f=frame();if(!f)return null;
   if(f.id==='solution-engine-model'&&!f.dataset.src&&!f.getAttribute('src'))f.dataset.src=DESKTOP_URL;
   const d=f.dataset?.src||DESKTOP_URL;
   if(!f.getAttribute('src')){
     f.setAttribute('loading','eager');
     f.setAttribute('fetchpriority','high');
     f.setAttribute('src',d);
   }
   return f;
 }

 function set(open){
   const c=cover(),f=(open||!MOBILE_PERF)?hydrate():frame();if(!c)return;
   c.classList.toggle('is-open',!!open);
   c.setAttribute('aria-expanded',open?'true':'false');
   c.setAttribute('aria-label',open?'Machine window open':'Reveal the machine');
   if(f)f.style.pointerEvents=open?'auto':'none';
   try{f?.contentWindow?.postMessage({type:'engine-visibility',visible:!!open},'*');}catch(_){}
   sync();
 }

 function toggle(e){
   e?.preventDefault?.();e?.stopPropagation?.();e?.stopImmediatePropagation?.();
   set(!isOpen());return false;
 }

 function bind(){
   if(!MOBILE_PERF)hydrate();
   const c=cover(),b=control();if(!c||!b)return;
   if(b.dataset.ah1940Bound!=='1'){
     b.dataset.ah1940Bound='1';
     b.addEventListener('click',toggle,true);
     b.addEventListener('keydown',e=>{
       if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle(e);}
     },true);
   }
   set(false);sync();
 }

 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});else bind();
 document.addEventListener('ah:persistent-route-complete',()=>setTimeout(bind,0));
 addEventListener('pageshow',()=>{if(!MOBILE_PERF)hydrate();sync();},{passive:true});
})();

;


