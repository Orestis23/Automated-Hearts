/* Round 2123: destination-ready signal; canonical router owns route surfaces. */
/* Round 2122 explicit embedded-ready signal: wait for the deterministic poster
   that occupies the first visible machine window, then tell the parent router
   the destination can be revealed. */
(()=>{
  'use strict';
  let embedded=false;
  try{embedded=window.self!==window.top&&new URLSearchParams(location.search).get('ah_embed')==='1';}catch(_){ }
  if(!embedded)return;
  const waitImage=async(img)=>{
    if(!img)return;
    try{if(img.complete&&img.naturalWidth>0)return;if(typeof img.decode==='function')await img.decode();else await new Promise(r=>{const done=()=>r();img.addEventListener('load',done,{once:true});img.addEventListener('error',done,{once:true});});}catch(_){ }
  };
  const send=async()=>{
    const critical=[...document.images].filter(img=>{const r=img.getBoundingClientRect();return img.getAttribute('src')&&r.width>0&&r.height>0&&r.bottom>0&&r.top<innerHeight});critical.forEach(img=>img.loading='eager');
    await Promise.race([Promise.all(critical.map(waitImage)),new Promise(r=>setTimeout(r,1000))]);
    try{await (document.fonts?.ready||Promise.resolve());}catch(_){ }
    await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
    try{parent.postMessage({type:'ah:shell-dom-ready',round:2122},'*');}catch(_){ }
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',send,{once:true});else send();
})();
