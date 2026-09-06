/* Round 1169 — Hub-specific footer/ticker message. */
(() => {
  'use strict';
  const label = '10% to local charities.';
  const render = () => {
    const marquee = document.getElementById('home-charity-marquee');
    if (!marquee) return;
    marquee.setAttribute('aria-label', label);
    marquee.dataset.text = label;
    let track = marquee.querySelector('.charity-marquee__track');
    if (!track) {
      track = document.createElement('span');
      track.className = 'charity-marquee__track';
      marquee.replaceChildren(track);
    }
    const makeLoop = () => {
      const loop = document.createElement('span');
      loop.className = 'charity-marquee__loop';
      const copy = document.createElement('span');
      copy.className = 'charity-marquee__copy';
      const amount = document.createElement('span');
      amount.className = 'charity-marquee__segment charity-marquee__segment--green';
      amount.textContent = '10%';
      const cause = document.createElement('span');
      cause.className = 'charity-marquee__segment charity-marquee__segment--pink charity-marquee__segment--spaced';
      cause.textContent = 'to local charities.';
      copy.append(amount,cause);
      const separator = document.createElement('span');
      separator.className = 'charity-marquee__separator';
      separator.setAttribute('aria-hidden','true');
      separator.textContent = '  •  ';
      loop.append(copy,separator);
      return loop;
    };
    track.setAttribute('aria-hidden','true');
    track.replaceChildren(...Array.from({length:12}, makeLoop));
  };
  const queue = () => setTimeout(render,0);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', queue, {once:true});
  else queue();
  addEventListener('pageshow', queue);
})();
