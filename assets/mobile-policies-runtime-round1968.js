

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
  function unloadModel(){ if(frame){ frame.src='about:blank'; frame.remove(); frame=null; } if(modelShell) modelShell.hidden=true; }
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
  document.addEventListener('visibilitychange',()=>{ if(document.hidden) unloadModel(); });
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


(() => {
  'use strict';
  const normalizePanel = (panel) => {
    if (!panel || panel.dataset.ah1857Normalized === '1') return;
    const form = panel.querySelector('form.nav-contact-form');
    if (!form) return;
    panel.dataset.ah1857Normalized = '1';
    const force = (el, prop, value) => el && el.style.setProperty(prop, value, 'important');
    force(panel,'height','auto'); force(panel,'min-height','0'); force(panel,'max-height','none'); force(panel,'overflow','hidden');
    force(form,'display','grid'); force(form,'height','auto'); force(form,'min-height','0'); force(form,'max-height','none');
    force(form,'opacity','1'); force(form,'visibility','visible'); force(form,'transform','none'); force(form,'position','relative');
    [...form.querySelectorAll('.nav-contact-field')].forEach((label) => {
      force(label,'display','block'); force(label,'position','relative'); force(label,'opacity','1'); force(label,'visibility','visible');
      force(label,'transform','none'); force(label,'height','auto'); force(label,'min-height','0'); force(label,'max-height','none');
    });
    [...form.querySelectorAll('input.ah-contact-screen,select.ah-contact-screen,textarea.ah-contact-screen')].forEach((field) => {
      field.hidden = false;
      force(field,'display','block'); force(field,'position','relative'); force(field,'opacity','1'); force(field,'visibility','visible');
      force(field,'transform','none'); force(field,'clip-path','none'); force(field,'filter','none');
    });
    const button=form.querySelector('.nav-contact-submit');
    if(button){force(button,'display','flex');force(button,'opacity','1');force(button,'visibility','visible');}
    panel.scrollTop=0;
  };
  const normalizeAll = () => document.querySelectorAll('#nav-contact-panel.nav-contact-panel.casio-contact-panel').forEach(normalizePanel);
  normalizeAll();
  const mo = new MutationObserver(normalizeAll);
  mo.observe(document.documentElement,{subtree:true,childList:true});
  document.addEventListener('click',(event)=>{
    const trigger=event.target.closest('[data-contact-trigger]');
    if(!trigger)return;
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      const panel=document.querySelector('#nav-contact-panel');
      if(panel){panel.dataset.ah1857Normalized='';normalizePanel(panel);panel.scrollTop=0;}
    }));
  },true);
})();

/* Round 2109: mobile footer face/text is CSS-owned; legacy inline normalizer removed. */

;


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


