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
    <div class="ah-mobile-contact__panel" role="dialog" aria-modal="true" aria-labelledby="ah-mobile-contact-title">
      <button class="ah-mobile-contact__close" type="button" aria-label="Close contact form">×</button>
      <h2 class="ah-mobile-contact__title" id="ah-mobile-contact-title">Send Message</h2>
      <form method="post" data-google-sheet-form>
        <label><span class="sr-only">Name</span><input class="ah-red-screen" style="background:linear-gradient(180deg,#ad1027 0%,#7f081b 46%,#4c030f 100%)!important;color:#ffe1e5!important;-webkit-text-fill-color:#ffe1e5!important;font-family:ui-monospace,SFMono-Regular,Consolas,monospace!important;" autocomplete="name" name="name" placeholder="Name (required)" required type="text"></label>
        <label><span class="sr-only">Email</span><input class="ah-red-screen" style="background:linear-gradient(180deg,#ad1027 0%,#7f081b 46%,#4c030f 100%)!important;color:#ffe1e5!important;-webkit-text-fill-color:#ffe1e5!important;font-family:ui-monospace,SFMono-Regular,Consolas,monospace!important;" autocomplete="email" name="email" placeholder="Email (required)" required type="email"></label>
<label class="nav-contact-field nav-contact-field--full ah-phone-field"><span class="sr-only">Phone number (required)</span><input class="ah-red-screen" style="background:linear-gradient(180deg,#ad1027 0%,#7f081b 46%,#4c030f 100%)!important;color:#ffe1e5!important;-webkit-text-fill-color:#ffe1e5!important;font-family:ui-monospace,SFMono-Regular,Consolas,monospace!important;" autocomplete="tel" inputmode="tel" name="phone" placeholder="Phone number (required)" required type="tel"></label>
        <label><span class="sr-only">Business or organization</span><input class="ah-red-screen" style="background:linear-gradient(180deg,#ad1027 0%,#7f081b 46%,#4c030f 100%)!important;color:#ffe1e5!important;-webkit-text-fill-color:#ffe1e5!important;font-family:ui-monospace,SFMono-Regular,Consolas,monospace!important;" autocomplete="organization" name="business" placeholder="Business or organization" type="text"></label>
        <label><span class="sr-only">Business type</span><select class="ah-red-screen" style="background:linear-gradient(180deg,#ad1027 0%,#7f081b 46%,#4c030f 100%)!important;color:#ffe1e5!important;-webkit-text-fill-color:#ffe1e5!important;font-family:ui-monospace,SFMono-Regular,Consolas,monospace!important;" aria-label="Business type" name="business_type"><option value="">Business type</option><option>Professional services</option><option>Construction or trades</option><option>Local business operations</option><option>Entrepreneur or small team</option><option>Nonprofit or community organization</option><option>Other</option></select></label>
        <label><span class="sr-only">What feels harder than it should?</span><textarea class="ah-red-screen" style="background:linear-gradient(180deg,#ad1027 0%,#7f081b 46%,#4c030f 100%)!important;color:#ffe1e5!important;-webkit-text-fill-color:#ffe1e5!important;font-family:ui-monospace,SFMono-Regular,Consolas,monospace!important;" name="message" placeholder="What feels harder than it should?" required rows="4"></textarea></label>
        <button class="ah-mobile-contact__submit" type="submit">Send Message</button>
        <p class="ah-mobile-contact__status" data-form-status aria-live="polite"></p>
      </form>
    </div>`;
  document.body.appendChild(overlay);

  const panel = overlay.querySelector('.ah-mobile-contact__panel');
  const close = overlay.querySelector('.ah-mobile-contact__close');
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
      openContact(trigger);
    });
  });

  window.addEventListener('blur', clearMessagePress, {passive:true});
  window.addEventListener('pagehide', clearMessagePress, {passive:true});
  document.addEventListener('visibilitychange', () => { if (document.hidden) clearMessagePress(); }, {passive:true});
  document.addEventListener('scroll', clearMessagePress, {passive:true});

  close.addEventListener('click', closeContact);
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
