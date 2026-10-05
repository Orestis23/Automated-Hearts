

;
/* Round 813 — deterministic Good Information ticker. */
(() => {
  'use strict';
  if (document.body?.dataset?.page !== 'learning') return;
  const track = document.querySelector('#learning-charity-ticker .learning-marquee__track');
  if (!track) return;

  const messages = [
    [{text:'Open 24/7',tone:'green'}],
    [{text:'Get rid of software costs.',tone:'pink'}],
    [{text:'With the right information, you can predict the future.',tone:'green'}],
    [{text:'Prioritizing',tone:'pink'},{text:'Job-Retention',tone:'green'}],
    [{text:'Automation with a',tone:'green'},{text:'human touch.',tone:'pink'}],
    [{text:'Elevating the human',tone:'green'},{text:', not obsoleting them.',tone:'pink',joined:true}]
  ];
  track.parentElement.setAttribute('aria-label', messages.map(parts => parts.map(part => part.text).join(' ')).join(' '));
  const makeCopy = (parts) => {
    const copy = document.createElement('span');
    copy.className = 'learning-marquee__copy';
    parts.forEach((part,index) => {
      const span = document.createElement('span');
      span.className = `learning-marquee__segment learning-marquee__segment--${part.tone}`;
      if (index && !part.joined) span.classList.add('learning-marquee__segment--spaced');
      span.textContent = part.text;
      copy.append(span);
    });
    return copy;
  };
  const makePerson = () => {
    const separator = document.createElement('span');
    separator.className = 'learning-marquee__separator';
    separator.setAttribute('aria-hidden','true');
    separator.innerHTML = '<svg class="learning-marquee__person" viewBox="0 0 18 30" focusable="false" aria-hidden="true"><circle cx="9" cy="5" r="3.2"></circle><path d="M9 8.5V18 M9 11.5L3.3 15.3 M9 11.5L14.7 15.3 M9 18L4.7 27 M9 18L13.3 27"></path></svg>';
    return separator;
  };
  const makeLoop = () => {
    const loop = document.createElement('span');
    loop.className = 'learning-marquee__loop';
    messages.forEach((parts) => loop.append(makeCopy(parts),makePerson()));
    return loop;
  };
  track.replaceChildren(makeLoop(),makeLoop());
})();
