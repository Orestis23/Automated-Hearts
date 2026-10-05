/* Round 1914 — Home machine windows stay on their deterministic stills until the
   explicit Open the window control is pressed. This keeps both shutters closed on
   startup and prevents iframe/model compilation from competing with shield motion. */
(()=>{'use strict';
function deferHomeWindows(){
 document.querySelectorAll('#home-machine-grid iframe.home-hero-engine-embed,#machine-stack iframe.machine-3d,#machine-stack iframe.cards-live-frame').forEach(frame=>{
  if(!frame.getAttribute('src')&&frame.dataset.src)frame.loading='lazy';
  try{frame.contentWindow?.postMessage({type:'automated-hearts:learning-activity',active:false},'*');}catch(_){}
  try{frame.contentWindow?.postMessage({type:'automated-hearts:viewport-activity',active:false},'*');}catch(_){}
 });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',deferHomeWindows,{once:true});else deferHomeWindows();
document.addEventListener('ah:persistent-route-complete',deferHomeWindows);
addEventListener('pageshow',deferHomeWindows,{passive:true});
})();
