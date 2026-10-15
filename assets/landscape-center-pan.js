/* Landscape phones: give the center a roomy canvas and native two-axis touch scrolling. */
(()=>{
 'use strict';
 if(new URLSearchParams(location.search).get('ah_embed')==='1')return;
 const landscape=matchMedia('(orientation: landscape) and (max-height: 600px) and (pointer: coarse)');
 const style=document.createElement('style');
 style.textContent=`
 html[data-ah-landscape-pan] body > main#main-content{
 position:fixed!important;inset:44px 6px 48px!important;width:auto!important;height:auto!important;
 min-height:0!important;max-height:none!important;margin:0!important;padding:8px!important;
 overflow:auto!important;touch-action:pan-x pan-y!important;overscroll-behavior:contain;
 -webkit-overflow-scrolling:touch;scroll-behavior:auto!important;
 }
 html[data-ah-landscape-pan] body > main#main-content > :is(section,div,iframe){min-width:0!important;max-width:100%!important;}
 html[data-ah-landscape-pan] body > main#main-content > iframe.ah-shell-content-frame{width:100%!important;}
 html[data-ah-landscape-pan] #ah-mobile-footer{height:44px!important;min-height:44px!important;bottom:0!important;}
 html[data-ah-landscape-pan] #ah-mobile-footer a{height:40px!important;min-height:0!important;}
 html[data-ah-landscape-pan] #ah-mobile-message{max-height:38px!important;}
 `;
 (document.head||document.documentElement).append(style);
 function update(){document.documentElement.toggleAttribute('data-ah-landscape-pan',landscape.matches)}
 landscape.addEventListener('change',update);update();
 // Native finger gestures retain tap activation. Mouse/pen drags work on empty canvas too.
 let drag;
 document.addEventListener('pointerdown',event=>{
 if(!landscape.matches||event.pointerType==='touch'||event.button!==0)return;
 const main=event.target.closest?.('body > main#main-content');
 if(!main||event.target.closest('button,a,input,textarea,select,[role="button"],canvas,iframe'))return;
 drag={main,id:event.pointerId,x:event.clientX,y:event.clientY,left:main.scrollLeft,top:main.scrollTop,moved:false};
 },true);
 document.addEventListener('pointermove',event=>{
 if(!drag||event.pointerId!==drag.id)return;
 const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
 if(!drag.moved&&Math.hypot(dx,dy)<6)return;
 drag.moved=true;drag.main.scrollLeft=drag.left-dx;drag.main.scrollTop=drag.top-dy;event.preventDefault();
 },{passive:false});
 document.addEventListener('pointerup',()=>{drag=null});document.addEventListener('pointercancel',()=>{drag=null});
})();
