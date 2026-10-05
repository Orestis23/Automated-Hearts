


;
/* Round 1874: speculative model prefetch removed. Models and shared Three.js
   now load only when the visitor explicitly opens/selects a model. */
(() => {
  'use strict';
  const footer = document.getElementById('site-footer');
  const nav = document.getElementById('primary-nav');
  if (!footer || !nav || footer.dataset.r947HoverBound === '1') return;
  const buttons = [...nav.querySelectorAll('a.footer-structure-control[data-nav]')];
  if (!buttons.length) return;
  footer.dataset.r947HoverBound = '1';

  const sync = () => {
    const hot = buttons.some((button) => button.matches(':hover') || button === document.activeElement || button.contains(document.activeElement));
    footer.classList.toggle('r947-footer-hot', hot);
  };
  buttons.forEach((button) => {
    button.addEventListener('pointerenter', () => footer.classList.add('r947-footer-hot'), {passive:true});
    button.addEventListener('pointerleave', () => requestAnimationFrame(sync), {passive:true});
    button.addEventListener('focus', () => footer.classList.add('r947-footer-hot'), {passive:true});
    button.addEventListener('blur', () => requestAnimationFrame(sync), {passive:true});
  });
  nav.addEventListener('pointerleave', () => requestAnimationFrame(sync), {passive:true});
})();

;
(()=>{'use strict';
  const hydrateRolodex=()=>{const f=document.getElementById('home-machine-rolodex');if(f&&!f.src&&f.dataset.src)f.src=f.dataset.src};
  const init=()=>{
    const primary=document.getElementById('home-machine-primary');
    if(primary){
      let loaded=false;
      primary.addEventListener('load',()=>{loaded=true;primary.classList.add('r976-model-ready')},{once:true});
    }
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

;
(function(){
  'use strict';

  function fitTextToWidth(el, minPx, maxPx, targetRatio){
    if(!el || !el.isConnected) return;
    const parent=el.parentElement;
    if(!parent) return;
    const cs=getComputedStyle(parent);
    const available=parent.clientWidth - parseFloat(cs.paddingLeft||0) - parseFloat(cs.paddingRight||0);
    if(!(available>0)) return;
    el.style.setProperty('font-size',maxPx+'px','important');
    el.style.setProperty('white-space','nowrap','important');
    let lo=minPx, hi=maxPx, best=minPx;
    const target=available*(targetRatio||.94);
    for(let i=0;i<14;i++){
      const mid=(lo+hi)/2;
      el.style.setProperty('font-size',mid+'px','important');
      const width=el.scrollWidth;
      if(width<=target){ best=mid; lo=mid; } else { hi=mid; }
    }
    el.style.setProperty('font-size',best.toFixed(2)+'px','important');
  }

  function fitProcessHeaders(){
    document.querySelectorAll('#home-solution-framework .negative-software-grid-round344 > article.home-process-stage:not(.home-process-stage--key) > h3')
      .forEach(el=>fitTextToWidth(el,11,22,.98));
  }

  function fitMobilePageNames(){
    if(!matchMedia('(max-width:760px)').matches) return;
    document.querySelectorAll('.rim-page-name-screen.header-page-screen--top').forEach(screen=>{
      screen.style.setProperty('left','50%','important');
      screen.style.setProperty('right','auto','important');
      screen.style.setProperty('width','min(70vw, 300px)','important');
      screen.style.setProperty('min-width','min(70vw, 300px)','important');
      screen.style.setProperty('max-width','min(70vw, 300px)','important');
      screen.style.setProperty('height','48px','important');
      screen.style.setProperty('min-height','48px','important');
      screen.style.setProperty('max-height','48px','important');
      screen.style.setProperty('transform','translateX(-50%)','important');
      screen.querySelectorAll('.footer-page-led,.header-page-led').forEach(el=>fitTextToWidth(el,8,20,.94));
    });
  }

  function controlFooterHoverBloom(){/* Round 2108: persistent footer paint is CSS-owned. */}

  function run(){
    fitProcessHeaders();
    controlFooterHoverBloom();
  }

  let resizeTimer=0;
  function queue(){ clearTimeout(resizeTimer); resizeTimer=setTimeout(run,80); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run,{once:true}); else run();
  addEventListener('load',run,{once:true});
  addEventListener('pageshow',run);
  (window.AHResponsive?window.AHResponsive.watch(queue):window.addEventListener('resize',queue,{passive:true}));
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(run).catch(function(){});
})();

;
/* Round 1012 — mobile Good Information scroll authority.
   The historical choice lock disables document scrolling. On mobile, keep the
   lower 3D stage locked/hidden but leave the upper lesson choices scrollable. */
(() => {
  'use strict';
  if (document.body?.dataset?.page !== 'learning') return;

  const mq = window.matchMedia('(max-width:760px)');
  const html = document.documentElement;
  const body = document.body;
  const main = document.querySelector('main#main-content');
  if (!main) return;

  let frame = 0;
  let applying = false;

  const setImportant = (el, prop, value) => {
    if (el.style.getPropertyValue(prop) === value && el.style.getPropertyPriority(prop) === 'important') return;
    el.style.setProperty(prop, value, 'important');
  };
  const removeInline = (el, prop) => {
    if (!el.style.getPropertyValue(prop) && !el.style.getPropertyPriority(prop)) return;
    el.style.removeProperty(prop);
  };

  const normalize = () => {
    frame = 0;
    if (applying || !mq.matches) return;
    /* Do not interfere while the legacy controller is actively animating back up. */
    if (body.classList.contains('ah-learning-returning-round804')) return;

    applying = true;
    try {
      if (html.classList.contains('ah-learning-choice-locked')) html.classList.remove('ah-learning-choice-locked');

      setImportant(html,'height','auto');
      setImportant(html,'overflow-x','hidden');
      setImportant(html,'overflow-y','auto');
      setImportant(html,'overscroll-behavior-y','auto');
      setImportant(html,'touch-action','pan-y');

      setImportant(body,'height','auto');
      setImportant(body,'overflow-x','hidden');
      setImportant(body,'overflow-y','auto');
      setImportant(body,'overscroll-behavior-y','auto');
      setImportant(body,'touch-action','pan-y');

      removeInline(main,'overflow-y');
      removeInline(main,'overscroll-behavior-y');
      removeInline(main,'touch-action');
      setImportant(main,'overflow-x','hidden');
    } finally {
      applying = false;
    }
  };

  const schedule = () => {
    if (applying || frame) return;
    frame = requestAnimationFrame(normalize);
  };

  normalize();
  addEventListener('pageshow',schedule,{passive:true});
  (window.AHResponsive?window.AHResponsive.watch(schedule):window.addEventListener('resize',schedule,{passive:true}));
  mq.addEventListener?.('change',schedule);

  new MutationObserver(schedule).observe(html,{attributes:true,attributeFilter:['class','style']});
  new MutationObserver(schedule).observe(body,{attributes:true,attributeFilter:['class','style']});
  new MutationObserver(schedule).observe(main,{attributes:true,attributeFilter:['style']});
})();

;
/* Round 1017 — route every site/model contact action into the built-in Messages drawer. */
(() => {
  'use strict';
  if (window.__ahContactRouter1017) return;
  window.__ahContactRouter1017 = true;

  function openMessages(detail = {}) {
    const trigger = document.getElementById('header-send-message') || document.querySelector('[data-contact-trigger]');
    if (!trigger) return false;

    // If the drawer is already open, leave it open instead of toggling it closed.
    if (trigger.getAttribute('aria-expanded') !== 'true' && !trigger.classList.contains('is-contact-latched')) {
      trigger.click();
    }

    // Optionally carry context from a service/model contact point into an empty message box.
    const service = detail && typeof detail.service === 'string' ? detail.service.trim() : '';
    if (service) {
      requestAnimationFrame(() => {
        const field = document.querySelector('.nav-contact-panel textarea[name="message"]');
        if (field && !field.value.trim()) field.value = `I'm interested in: ${service}`;
      });
    }
    return true;
  }

  window.AutomatedHeartsOpenContact = openMessages;

  // Contact controls inside same-origin 3D model iframes use postMessage so they
  // open the parent page's built-in form instead of email or a new tab.
  window.addEventListener('message', (event) => {
    const data = event.data || {};
    if (data.type !== 'automated-hearts:open-contact') return;
    openMessages({ service: data.service || data.source || '' });
  });

  // No mailto/contact link on the site should launch an external mail client.
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link) return;
    const href = (link.getAttribute('href') || '').trim();
    const isMail = /^mailto:/i.test(href);
    const isPlainContactHash = href === '#contact' && !link.hasAttribute('data-contact-trigger');
    if (!isMail && !isPlainContactHash) return;
    event.preventDefault();
    event.stopPropagation();
    openMessages({ service: link.getAttribute('data-ah-contact') || link.textContent.trim() || 'Contact' });
  }, true);
})();

;
(function(){
  'use strict';
  const mq = window.matchMedia('(max-width:760px)');
  const small = window.matchMedia('(max-width:374px)');
  const props = ['position','top','left','right','bottom','width','min-width','max-width','height','min-height','max-height','margin','padding','transform','translate'];
  let applying = false;
  function setI(el,p,v){ el.style.setProperty(p,v,'important'); }
  function clear(el){ props.forEach(p=>el.style.removeProperty(p)); }
  function apply(){
    const heart = document.getElementById('rim-heart-home');
    if(!heart || applying) return;
    applying = true;
    if(!mq.matches){
      clear(heart);
      applying = false;
      return;
    }
    const compact = small.matches;
    setI(heart,'position','fixed');
    setI(heart,'top','0px');
    setI(heart,'left',compact ? '-3px' : '-4px');
    setI(heart,'right','auto');
    setI(heart,'bottom','auto');
    const w = compact ? '70px' : '74px';
    const h = compact ? '78px' : '83px';
    setI(heart,'width',w); setI(heart,'min-width',w); setI(heart,'max-width',w);
    setI(heart,'height',h); setI(heart,'min-height',h); setI(heart,'max-height',h);
    setI(heart,'margin','0px');
    setI(heart,'padding','0px');
    setI(heart,'transform','none');
    setI(heart,'translate','none');
    applying = false;
  }
  function schedule(){
    apply();
    requestAnimationFrame(apply);
    setTimeout(apply,0);
    setTimeout(apply,80);
    setTimeout(apply,300);
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded',schedule,{once:true});
  else schedule();
  window.addEventListener('pageshow',schedule);
  (window.AHResponsive?window.AHResponsive.watch(schedule):window.addEventListener('resize',schedule,{passive:true}));
  window.addEventListener('orientationchange',schedule,{passive:true});
  try{ mq.addEventListener('change',schedule); small.addEventListener('change',schedule); }
  catch(e){ try{ mq.addListener(schedule); small.addListener(schedule); }catch(_){} }
  const startObserver=()=>{
    const heart=document.getElementById('rim-heart-home');
    if(!heart) return;
    new MutationObserver(()=>{ if(!applying && mq.matches) requestAnimationFrame(apply); })
      .observe(heart,{attributes:true,attributeFilter:['style','class']});
  };
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded',startObserver,{once:true});
  else startObserver();
})();

;
