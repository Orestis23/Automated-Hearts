(()=>{
const animations=new WeakMap();
function scroller(node){for(let e=node instanceof Element?node:node?.parentElement;e;e=e.parentElement){const s=getComputedStyle(e);if(/auto|scroll/.test(s.overflowY)&&e.scrollHeight>e.clientHeight+1)return e}return document.scrollingElement}
addEventListener('wheel',event=>{if(event.ctrlKey||event.defaultPrevented||Math.abs(event.deltaX)>Math.abs(event.deltaY)||event.target.closest?.('canvas,model-viewer,[data-ah-no-smooth-scroll]'))return;
const e=scroller(event.target);if(!e||e.scrollHeight<=e.clientHeight+1)return;const max=e.scrollHeight-e.clientHeight;let state=animations.get(e);const delta=event.deltaY*(event.deltaMode===1?20:event.deltaMode===2?e.clientHeight:1);const target=Math.max(0,Math.min(max,(state?.target??e.scrollTop)+delta));if(!state&&target===e.scrollTop)return;event.preventDefault();
if(!state){state={target,last:performance.now(),running:false};animations.set(e,state)}state.target=target;if(state.running)return;state.running=true;
const tick=now=>{if(animations.get(e)!==state)return;const step=1-Math.exp(-Math.min(48,now-state.last)/65);state.last=now;const next=e.scrollTop+(state.target-e.scrollTop)*step;e.scrollTo({top:next,behavior:'instant'});if(Math.abs(state.target-e.scrollTop)>.7)requestAnimationFrame(tick);else{e.scrollTo({top:state.target,behavior:'instant'});animations.delete(e)}};state.last=performance.now();requestAnimationFrame(tick)
},{passive:false});
addEventListener('touchstart',event=>{animations.delete(scroller(event.target));animations.delete(document.scrollingElement)},{passive:true});
})();