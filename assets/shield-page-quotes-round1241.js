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
      'who-we-help.html': 'Thinking outside of the box begins Now.',
      'mobile-who-we-help.html': 'Thinking outside of the box begins Now.',
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

    const quoteMarkup = {
      'Automation with a Human touch.':'<span class="ah-shield-pink">Automation</span> with a <span class="ah-shield-green">Human</span> touch.',
      'Negative-Software Solution. Logic, not Size.':'<span class="ah-shield-pink">Negative-Software</span> Solution. <span class="ah-shield-green">Logic</span>, not <span class="ah-shield-pink">Size</span>.',
      'Thinking outside of the box begins Now.':'Thinking <span class="ah-shield-green">outside of the box</span> begins <span class="ah-shield-pink">Now</span>.',
      'With the right information, you can predict the future.':'With the <span class="ah-shield-green">right information</span>, you can <span class="ah-shield-pink">predict the future</span>.',
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
