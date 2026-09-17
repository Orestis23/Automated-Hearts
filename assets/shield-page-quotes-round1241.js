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
      'solutions.html': 'The Negative-Software Solution',
      'mobile-solutions.html': 'The Negative-Software Solution',
      'who-we-help.html': 'Thinking outside of the box begins Now.',
      'mobile-who-we-help.html': 'Thinking outside of the box begins Now.',
      'learning-center.html': 'Choose a lesson.',
      'mobile-learning-center.html': 'Choose a lesson.',
      'about.html': 'Prioritizing Job-Retention.',
      'mobile-about.html': 'Prioritizing Job-Retention.',
      'policies.html': 'Prioritizing Job-Retention.',
      'pricing.html': 'Fully Customized to your layout.',
      'mobile-pricing.html': 'Fully Customized to your layout.'
    };
    const quoteText = byFile[name] || '';
    if (!quoteText) return;

    const quoteMarkup = {
      'Automation with a Human touch.':'<span class="ah-shield-pink">Automation</span> with a <span class="ah-shield-green">Human</span> touch.',
      'The Negative-Software Solution':'The <span class="ah-shield-pink">Negative-Software</span> <span class="ah-shield-green">Solution</span>',
      'Thinking outside of the box begins Now.':'Thinking <span class="ah-shield-green">outside of the box</span> begins <span class="ah-shield-pink">Now</span>.',
      'Choose a lesson.':'<span class="ah-shield-green">Choose</span> a <span class="ah-shield-pink">lesson</span>.',
      'Prioritizing Job-Retention.':'<span class="ah-shield-pink">Prioritizing</span> <span class="ah-shield-green">Job-Retention</span>.',
      'Fully Customized to your layout.':'<span class="ah-shield-pink">Fully Customized</span> to <span class="ah-shield-green">your layout</span>.'
    }[quoteText] || quoteText;

    const panel = document.querySelector('#page-transition-shield .page-transition-shield__panel');
    if (!panel || panel.querySelector('.page-transition-shield__quote')) return;
    const quote = document.createElement('span');
    quote.className = 'page-transition-shield__quote';
    quote.setAttribute('aria-hidden','true');
    quote.innerHTML = `“${quoteMarkup}”`;
    panel.appendChild(quote);
  } catch (_) {}
})();
