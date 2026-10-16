/* Exposure is independent of a window's open/closed state. */
(()=>{'use strict';const states=new Map();let pending=false;
function sync(frame,state,force=false){let visible=state.intersects&&!document.hidden&&!document.documentElement.classList.contains('ah-shell-render-paused');
if(visible)for(let node=frame;node&&node!==document.documentElement;node=node.parentElement){if(node.hidden){visible=false;break}const s=getComputedStyle(node);if(s.display==='none'||s.visibility==='hidden'||s.visibility==='collapse'||Number(s.opacity)===0){visible=false;break}}
if(!force&&state.sent===visible)return;state.sent=visible;frame.dataset.ahModelExposed=visible?'1':'0';frame.contentWindow?.postMessage({type:'automated-hearts:viewport-exposure',active:visible},'*');}
const io=new IntersectionObserver(entries=>{for(const e of entries){const state=states.get(e.target);if(!state)continue;state.intersects=e.isIntersecting&&e.intersectionRatio>0;sync(e.target,state)}},{threshold:0,rootMargin:'0px'});
function bind(root=document){const list=[...(root.matches?.('iframe')?[root]:[]),...root.querySelectorAll('iframe')];for(const frame of list){const src=frame.getAttribute('src')||frame.dataset.src||'';if(!/machine|model|lab|learning.*html|engine/i.test(src)||states.has(frame))continue;const state={intersects:false,sent:null};states.set(frame,state);sync(frame,state);io.observe(frame);frame.addEventListener('load',()=>sync(frame,state,true))}}
const dirty=new Set();function queue(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;const changes=[...dirty];dirty.clear();for(const[frame,state]of states){if(!frame.isConnected){io.unobserve(frame);states.delete(frame);continue}if(changes.some(node=>node===frame||node.contains(frame)))sync(frame,state)}})}
new MutationObserver(records=>{for(const m of records){if(m.type==='childList'){for(const n of m.addedNodes)if(n.nodeType===1)bind(n)}else if([...states.keys()].some(frame=>frame===m.target||m.target.contains(frame)))dirty.add(m.target)}if(dirty.size)queue()}).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style','hidden']});
addEventListener('message',event=>{if(event.data?.type!=='ah:model-render-state')return;for(const frame of states.keys())if(event.source===frame.contentWindow){frame.dataset.ahModelActive=event.data.active?'1':'0';break}});
document.addEventListener('visibilitychange',()=>{for(const[f,s]of states)sync(f,s)});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>bind(),{once:true});else bind();
})();
(()=>{const s=document.createElement("script");s.src=new URL("landscape-center-pan.js",document.currentScript.src).href;document.head.append(s)})();

(()=>{const s=document.createElement("script");s.src=new URL("hero-matte-spacing.js?ahv=ccd162254439",document.currentScript.src).href;document.head.append(s)})();
