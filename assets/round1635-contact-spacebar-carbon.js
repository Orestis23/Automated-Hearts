(() => {
  'use strict';
  const GREEN='#24c978', WHITE='#ffffff';
  const CARBON='./assets/contact-spacebar-carbon-light-black-round1635.webp';
  const imp=(el,p,v)=>{if(el)el.style.setProperty(p,v,'important');};
  function applyPanel(panel){
    if(!panel)return;
    imp(panel,'background-color','#17191b');
    imp(panel,'background-image',`linear-gradient(180deg,rgba(255,255,255,.055) 0%,rgba(255,255,255,.018) 16%,rgba(0,0,0,.035) 48%,rgba(0,0,0,.20) 100%),url("${CARBON}")`);
    imp(panel,'background-size','100% 100%,190px 190px');
    imp(panel,'background-position','center,0 0');
    imp(panel,'background-repeat','no-repeat,repeat');
    imp(panel,'background-blend-mode','normal,normal');
    const form=panel.querySelector('form');
    if(form){
      imp(form,'background','transparent');imp(form,'background-color','transparent');imp(form,'background-image','none');
      imp(form,'border-color','transparent');imp(form,'outline','0');imp(form,'box-shadow','none');
    }
    panel.querySelectorAll('label').forEach(label=>{
      imp(label,'background','transparent');imp(label,'background-color','transparent');imp(label,'background-image','none');
      imp(label,'border-color','transparent');imp(label,'outline','0');imp(label,'box-shadow','none');
    });
    panel.querySelectorAll('input.ah-red-screen,textarea.ah-red-screen,select.ah-red-screen').forEach(field=>{
      imp(field,'color',GREEN);imp(field,'-webkit-text-fill-color',GREEN);imp(field,'caret-color',GREEN);
      imp(field,'text-shadow','0 0 2px rgba(36,201,120,.50),0 0 5px rgba(36,201,120,.18)');
    });
    panel.querySelectorAll('select[data-ah-placeholder-select]').forEach(select=>{
      const sync=()=>{const c=select.value?GREEN:WHITE;imp(select,'color',c);imp(select,'-webkit-text-fill-color',c);};
      if(!select.dataset.ah1635Bound){select.addEventListener('change',sync);select.dataset.ah1635Bound='1';}
      sync();
    });
  }
  function apply(){
    const d=document.querySelector('#nav-contact-panel.nav-contact-panel.casio-contact-panel');
    if(d){applyPanel(d);const inner=d.closest('.nav-contact-drawer__inner');if(inner){imp(inner,'background','transparent');imp(inner,'background-image','none');}}
    document.querySelectorAll('body > .ah-mobile-contact .ah-mobile-contact__panel').forEach(applyPanel);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
  new MutationObserver(apply).observe(document.documentElement,{subtree:true,childList:true});
  document.addEventListener('click',e=>{if(e.target.closest('[data-contact-trigger],#header-send-message,.message')){apply();setTimeout(apply,0);setTimeout(apply,80);setTimeout(apply,220);}},true);
  window.addEventListener('pageshow',apply,{passive:true});
})();
