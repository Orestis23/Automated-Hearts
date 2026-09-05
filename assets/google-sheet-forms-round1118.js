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
    data.set('page', document.body?.dataset?.page || document.title || '');
    data.set('page_url', location.href);
    data.set('contact_context', contactContext(form));
    data.set('submitted_at_client', new Date().toISOString());
    data.set('form_version', '1125');

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
      if (status) status.textContent = 'Thank you. Your message has been sent.';
    } catch (error) {
      console.error('Automated Hearts form delivery failed', error);
      if (status) status.textContent = 'The message could not be sent. Please try again.';
    } finally {
      setBusy(form, false);
    }
  }, true);
})();
