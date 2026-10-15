// The ticker has been retired across desktop, mobile, and routed pages.
(()=>{
  const selector='#home-ticker-wrap,#home-charity-ticker,#home-charity-marquee,.ticker,.charity-marquee';
  const remove=()=>document.querySelectorAll(selector).forEach(node=>node.remove());
  const style=document.createElement('style');
  style.textContent=selector+'{display:none!important;visibility:hidden!important;height:0!important;min-height:0!important;margin:0!important;padding:0!important}';
  document.head.append(style);
  remove();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',remove,{once:true});
  new MutationObserver(remove).observe(document.documentElement,{childList:true,subtree:true});
  addEventListener('ah:persistent-route-complete',remove);
})();
