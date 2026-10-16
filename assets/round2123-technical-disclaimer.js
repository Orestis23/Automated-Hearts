(()=>{
 const parts=["While this website is visually very different than most other websites, we cater to more conventional and traditional stylistic needs from our clients.","We build SYSTEMS originating from YOUR system's existing setup, we won't suggest anything you don't need.","We promise you honest work for a fair price."];
 const mobile=()=>document.body.hasAttribute('data-ah-mobile-surface');
 function prepare(){
 const host=document.querySelector('#ah2123-mobile-windows .ah2123-mobile-window')||document.querySelector('#home-machine-grid .home-hero-engine-frame');if(!host)return;
 let deck=host.querySelector('.ah2123-disclaimer-deck');
 if(!deck){deck=document.createElement('div');deck.className='ah2123-disclaimer-deck';deck.id='ah2123-technical-disclaimer';deck.setAttribute('role','region');deck.setAttribute('aria-label','Technical Disclaimer');deck.innerHTML=parts.map((p,i)=>'<article class="ah2123-disclaimer-card"><div class="ah2123-disclaimer-screen"><h3>'+['I','II','III'][i]+'</h3><p>'+p+'</p></div></article>').join('');deck.inert=true;deck.tabIndex=0;host.append(deck)}
 const travel=host.clientHeight;host.style.setProperty('--ah2123-machine-travel',travel+'px');
 // The decorative window surface is a fixed frame, never a sliding screen.
 const rim=host.querySelector(':scope > .ah-single-window-surface');
 if(rim)for(const [key,value]of Object.entries({transform:'none',transition:'none','will-change':'auto'}))rim.style.setProperty(key,value,'important');
 const shutter=host.querySelector(':scope > .ah2386-machine-shutter')||host.querySelector(':scope > img:not(.ah-single-window-surface)');
 const label=shutter?.classList.contains('ah2386-machine-shutter')?null:host.querySelector(':scope > .ah2123-machine-embedded-label');
 const layers=[shutter,label,deck].filter(Boolean);
 for(const layer of layers){layer.style.setProperty('transition','transform 950ms cubic-bezier(.25,.1,.25,1)','important');layer.style.setProperty('will-change','transform','important');layer.style.setProperty('backface-visibility','hidden','important');layer.style.setProperty('opacity','1','important');}
 const ready={host,deck,travel,layers};render(ready,host.classList.contains('ah2123-disclaimer-open'));return ready;
 }
 function render({host,deck,travel,layers},open){for(const layer of layers){const y=layer===deck?(open?0:travel):(open?-travel:0);layer.style.setProperty('transform','translate3d(0,'+y+'px,0)','important')}}
 window.ah2123ToggleDisclaimer=button=>{const ready=prepare();if(!ready)return;const {host,deck}=ready;const open=button.getAttribute('aria-expanded')!=='true';button.setAttribute('aria-expanded',String(open));if(open)deck.scrollTop=0;deck.inert=!open;host.classList.toggle('ah2123-disclaimer-open',open);render(ready,open);if(open&&!mobile())host.scrollIntoView({behavior:'smooth',block:'center'})};
 const scrollStyle=document.createElement('style');scrollStyle.textContent='html body .ah2123-disclaimer-deck{scrollbar-width:none!important;-ms-overflow-style:none!important;overflow-x:hidden!important;overflow-y:auto!important;touch-action:pan-y!important;-webkit-overflow-scrolling:touch}html body .ah2123-disclaimer-deck::-webkit-scrollbar{display:none!important;width:0!important;height:0!important}';document.head.append(scrollStyle);
 const style=document.createElement('style');style.textContent='@media(max-width:900px){html body[data-ah-mobile-surface] #ah2123-mobile-windows .ah2123-mobile-window > :is(img,.ah2123-machine-embedded-label,.ah2123-disclaimer-deck){will-change:transform!important;backface-visibility:hidden!important;transition:transform 950ms cubic-bezier(.25,.1,.25,1)!important;opacity:1!important}html body[data-ah-mobile-surface] #ah2123-mobile-windows .ah2123-mobile-window > img{transform:translate3d(0,0,0)!important}html body[data-ah-mobile-surface] #ah2123-mobile-windows .ah2123-mobile-window.ah2123-disclaimer-open > img{transform:translate3d(0,-100%,0)!important}html body[data-ah-mobile-surface] #ah2123-mobile-windows .ah2123-disclaimer-deck{transform:translate3d(0,100%,0)!important}html body[data-ah-mobile-surface] #ah2123-mobile-windows .ah2123-disclaimer-open > .ah2123-disclaimer-deck{transform:translate3d(0,0,0)!important}}';document.head.append(style);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',prepare,{once:true});else prepare();
})();
(()=>{function match(){if(innerWidth>900)return;const left=document.querySelector('#home-machine-grid > .home-hero-engine-frame')||document.querySelector('#ah2123-mobile-windows > .ah2123-mobile-window');const right=document.querySelector('.home-hero-rolodex-frame')||document.getElementById('ah2123-mobile-critical');if(!left||!right)return;function size(){const h=left.getBoundingClientRect().height;if(h>0){right.style.setProperty('height',h+'px','important');right.style.setProperty('min-height',h+'px','important');right.style.setProperty('max-height',h+'px','important')}}new ResizeObserver(size).observe(left);size()}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',match);else match()})();

// Avoid a second dot mask erasing the thin disclaimer lettering.
(()=>{function mount(){const deck=document.querySelector('.ah2123-disclaimer-deck');if(!deck)return;
function clear(){for(const el of deck.querySelectorAll('h3,p,h3 span,p span'))for(const [key,value]of Object.entries({'mask-image':'none','-webkit-mask-image':'none','opacity':'1','filter':'none'})){if(el.style.getPropertyValue(key)!==value||el.style.getPropertyPriority(key)!=='important')el.style.setProperty(key,value,'important')}}
let queued=false;const queue=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;clear()})};
new MutationObserver(queue).observe(deck,{childList:true,subtree:true});clear();
}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount()})();
(()=>{function mount(){const label=document.querySelector('.ah2123-machine-embedded-label');if(!label)return;function clear(){for(const key of ['mask-image','-webkit-mask-image'])if(label.style.getPropertyValue(key)!=='none'||label.style.getPropertyPriority(key)!=='important')label.style.setProperty(key,'none','important')}clear()}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount()})();
