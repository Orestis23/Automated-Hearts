/* consultation-open-2257.js */
/* Matching top and bottom message controls share the normal contact drawer. */
(()=>{
 function mount(){
  const top=document.querySelector('.ah2254-consultation');const main=document.querySelector('main#main-content');if(!top||!main)return;
  if(!main.querySelector('.ah-services-bottom-message')){const wrap=document.createElement('div');wrap.className='ah-services-bottom-message ah2254-consultation-wrap';wrap.style.cssText='display:flex!important;justify-content:center!important;align-items:center!important;padding:24px 24px 48px!important;flex:0 0 auto!important;min-height:0!important;height:auto!important;box-sizing:border-box!important;';const bottom=top.cloneNode(true);bottom.removeAttribute('id');bottom.removeAttribute('onclick');bottom.removeAttribute('data-ah-prepared-text');bottom.removeAttribute('data-ah-message-copy');wrap.append(bottom);main.append(wrap);}
  for(const button of document.querySelectorAll('.ah2254-consultation')){
   button.removeAttribute('onclick');button.setAttribute('aria-label','Send a message.');button.setAttribute('role','button');button.tabIndex=0;
   let label=button.querySelector('.ah-consultation-label')||button.querySelector('span');if(!label){label=document.createElement('span');button.append(label);}
   if(button.dataset.ahMessageCopy!=='1'){label.innerHTML='Send a<br>message.';button.dataset.ahMessageCopy='1';}
   for(const[k,v]of Object.entries({display:'flex','align-items':'center','justify-content':'center','box-sizing':'border-box',padding:'18px 24px'}))if(button.style.getPropertyValue(k)!==v)button.style.setProperty(k,v,'important');
   for(const[k,v]of Object.entries({display:'block',position:'relative',inset:'auto',margin:'0',padding:'0',width:'100%','text-align':'center','white-space':'nowrap','line-height':'1.25',color:'#fff','-webkit-text-fill-color':'#fff',transform:'none','z-index':'3'}))if(label.style.getPropertyValue(k)!==v)label.style.setProperty(k,v,'important');
  }
 }
 function open(event){const button=event.target.closest?.('.ah2254-consultation');if(!button)return;event.preventDefault();event.stopImmediatePropagation();let owner=document;try{if(new URLSearchParams(location.search).get('ah_embed')==='1'&&parent!==window)owner=parent.document}catch{}owner.querySelector('#ah-mobile-message,#header-send-message')?.click();}
 addEventListener('click',open,true);
 addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' ')open(event)},true);
 let queued=false;const queue=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;mount()})};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',queue);else queue();new MutationObserver(queue).observe(document.documentElement,{childList:true,subtree:true});
})();

/* Form hardware: red top-right close control and footer-style submit key. */
(()=>{function apply(){for(const panel of document.querySelectorAll('.ah-mobile-contact__panel')){if(!panel.querySelector('.ah-contact-top-close')){const close=document.createElement('button');close.type='button';close.className='ah-contact-top-close ah1905-no-digital ah1985-no-digital';close.setAttribute('aria-label','Close contact form');close.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6L18 18M18 6L6 18" fill="none" stroke="#ff334f" stroke-width="2.6" stroke-linecap="round"/></svg>';panel.prepend(close);}const submit=panel.querySelector('.ah-mobile-contact__submit');if(submit){for(const[k,v]of Object.entries({'background-image':'url("./assets/button-art/footer-desktop-solution.svg?v=clean-envelope-2392")','background-size':'100% 100%','background-repeat':'no-repeat',border:'0','border-radius':'0','box-shadow':'none',height:'64px','min-height':'64px',padding:'0','box-sizing':'border-box'}))if(submit.style.getPropertyValue(k)!==v)submit.style.setProperty(k,v,'important');}}}addEventListener('click',event=>{if(!event.target.closest?.('.ah-contact-top-close'))return;event.preventDefault();event.stopImmediatePropagation();document.querySelector('#ah-mobile-message')?.click();},true);let queued=false;function queue(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply()})}new MutationObserver(queue).observe(document.documentElement,{childList:true,subtree:true});addEventListener('load',queue);queue()})();

;
/* smooth-ticker-2388.js */
// The ticker has been retired across desktop, mobile, and routed pages.
(()=>{
  const selector='#home-ticker-wrap,#home-charity-ticker,#home-charity-marquee,.ticker,.charity-marquee';
  const remove=()=>document.querySelectorAll(selector).forEach(node=>node.remove());
  const style=document.createElement('style');
  style.textContent=selector+'{display:none!important;visibility:hidden!important;height:0!important;min-height:0!important;margin:0!important;padding:0!important}';
  document.head.append(style);
  remove();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',remove,{once:true});
  new MutationObserver(records=>{for(const record of records)for(const node of record.addedNodes){
    if(node.nodeType!==1||node.matches('svg,style,script,.ah-bulb-word,.ah-steady-bulb')||node.closest('svg,.ah-bulb-word,.ah-steady-bulb'))continue;
    if(node.matches(selector))node.remove();else node.querySelectorAll(selector).forEach(ticker=>ticker.remove());
  }}).observe(document.documentElement,{childList:true,subtree:true});
  addEventListener('ah:persistent-route-complete',remove);
})();
