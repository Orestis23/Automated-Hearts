/* Automated Hearts Round 1643 — enforce one centered page-name label with reversible dark-blue / pink-core LED inverse text. */
(()=>{
  'use strict';
  if(window.__ahRound1643PageNameAuthority) return;
  window.__ahRound1643PageNameAuthority = 1;

  const desktop = () => matchMedia('(min-width:901px)').matches;
  let raf = 0;

  function syncSign(sign){
    if(!sign) return;
    const label = sign.querySelector(':scope > .footer-page-led, :scope > .header-page-led');
    if(!label) return;

    let fill = sign.querySelector(':scope > .page-sign-progress-inverse');
    if(!fill){
      fill = document.createElement('span');
      fill.className = 'page-sign-progress-inverse';
      fill.setAttribute('aria-hidden','true');
      sign.appendChild(fill);
    }
    fill.classList.add('ah1643-page-progress-fill');
    fill.setAttribute('aria-hidden','true');
    fill.textContent = '';

    let text = fill.querySelector(':scope > .ah1643-page-progress-text');
    if(!text){
      text = document.createElement('span');
      text.className = 'ah1643-page-progress-text';
      fill.appendChild(text);
    }
    text.textContent = (label.textContent || '').replace(/\s+/g,' ').trim();

    // Remove/hide any old split-word children if they were injected by prior rounds.
    fill.querySelectorAll('.page-sign-brand-word, .ah1636-page-progress-text').forEach(node=>node.remove());
    const clone = sign.querySelector(':scope > .ah1641-page-name-dark-clone');
    if(clone) clone.remove();

    const sr = sign.getBoundingClientRect();
    const lr = label.getBoundingClientRect();
    const cs = getComputedStyle(label);
    const set = (prop, value) => text.style.setProperty(prop, value, 'important');
    set('left', `${lr.left - sr.left}px`);
    set('top', `${lr.top - sr.top}px`);
    set('width', `${lr.width}px`);
    set('height', `${lr.height}px`);
    set('padding-left', cs.paddingLeft);
    set('padding-right', cs.paddingRight);
    set('padding-top', cs.paddingTop);
    set('padding-bottom', cs.paddingBottom);
    set('font-family', cs.fontFamily);
    set('font-size', cs.fontSize);
    set('font-weight', cs.fontWeight);
    set('font-style', cs.fontStyle);
    set('line-height', cs.lineHeight);
    set('letter-spacing', cs.letterSpacing);
    set('text-transform', cs.textTransform);
    set('white-space', cs.whiteSpace);
    set('text-align', cs.textAlign);
  }

  function syncAll(){
    if(!desktop()) return;
    document.querySelectorAll('body > .rim-page-name-screen.footer-page-screen.header-page-screen--top').forEach(syncSign);
  }

  function schedule(){
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(syncAll);
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule, {once:true});
  else schedule();
  addEventListener('load', schedule, {once:true});
  addEventListener('resize', schedule, {passive:true});
  addEventListener('ah:persistent-route-complete', () => setTimeout(schedule, 0));
  if(document.fonts?.ready) document.fonts.ready.then(schedule).catch(()=>{});
  setTimeout(schedule, 120);
  setTimeout(schedule, 450);
})();
