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
