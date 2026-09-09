/* Automated Hearts Round 1235 — page-specific transition-shield quotes.
   Persistent routing owns destination quotes itself. This file covers direct
   page loads / non-router fallback shields without adding another animation. */
(() => {
  'use strict';
  try {
    const qs = new URLSearchParams(location.search);
    if (qs.get('ah_embed') === '1' && window.self !== window.top) return;

    const name = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    const byFile = {
      'index.html': 'Automation with a Human touch.',
      'desktop-home.html': 'Automation with a Human touch.',
      'mobile-home.html': 'Automation with a Human touch.',
      'solutions.html': 'Negative-Software Solution. Logic, not Size.',
      'mobile-solutions.html': 'Negative-Software Solution. Logic, not Size.',
      'who-we-help.html': 'Thinking out of the box begins, Now.',
      'mobile-who-we-help.html': 'Thinking out of the box begins, Now.',
      'learning-center.html': 'With the right information, you can predict the future.',
      'mobile-learning-center.html': 'With the right information, you can predict the future.',
      'about.html': 'Prioritizing Job-Retention.',
      'mobile-about.html': 'Prioritizing Job-Retention.',
      'policies.html': 'Prioritizing Job-Retention.',
      'pricing.html': 'Fully Customized to your layout.',
      'mobile-pricing.html': 'Fully Customized to your layout.'
    };
    const quoteText = byFile[name] || '';
    if (!quoteText) return;

    const panel = document.querySelector('#page-transition-shield .page-transition-shield__panel');
    if (!panel || panel.querySelector('.page-transition-shield__quote')) return;
    const quote = document.createElement('span');
    quote.className = 'page-transition-shield__quote';
    quote.setAttribute('aria-hidden','true');
    quote.textContent = `“${quoteText}”`;
    panel.appendChild(quote);
  } catch (_) {}
})();
