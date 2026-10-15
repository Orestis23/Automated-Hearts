/* The router owns asset readiness and final layout. Announce the destination DOM
   directly for same-origin frames, without throttled hidden-page paint waits. */
(()=>{'use strict';
 let embedded=false;
 try{embedded=self!==top&&new URLSearchParams(location.search).get('ah_embed')==='1';}catch(_){}
 if(!embedded)return;
 const send=()=>{try{if(typeof frameElement?.__ahFinishLoading==='function')frameElement.__ahFinishLoading();else parent.postMessage({type:'ah:shell-dom-ready',round:2122},'*');}catch(_){}};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',send,{once:true});else send();
})();
