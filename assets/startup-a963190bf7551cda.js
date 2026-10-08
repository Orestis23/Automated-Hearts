(()=>{function apply(){
const negativeTitle=document.querySelector('#home-negative-software-title .ah-negative-software-title-copy');
if(negativeTitle&&!negativeTitle.querySelector('.ah-negative-software-solution')){
 const first=document.createElement('span');first.className='ah-negative-software-pink ah1985-progress-text-glyphs';first.textContent='Negative-Software';
 const second=document.createElement('span');second.className='ah-negative-software-solution ah1985-progress-text-glyphs';second.textContent=' Solution';negativeTitle.replaceChildren(first,second);
}

for(const segment of document.querySelectorAll('#home-charity-ticker .charity-marquee__segment')){
 if(segment.querySelector('.ah-ticker-quote'))continue;
 const text=segment.textContent.replace(/^[“"]|[”"]$/g,'');
 const nodes=[['“','quote'],[text,'phrase'],['”','quote']].map(([value,kind])=>{const node=document.createElement('span');node.className='ah1985-progress-text-glyphs ah-ticker-'+kind;node.textContent=value;return node});
 segment.replaceChildren(...nodes);
}
const section=document.querySelector('#home-route-buttons,section[aria-label="Explore Automated Hearts"]');if(!section)return;const ticker=document.querySelector('#home-charity-ticker,body>.ticker');const bg=ticker?getComputedStyle(ticker).backgroundImage:'';const start=bg.lastIndexOf('linear-gradient(');section.style.setProperty('background','#01080f','important');section.style.setProperty('background-image','none','important');section.style.setProperty('backdrop-filter','none','important');for(const e of section.querySelectorAll('*')){if(getComputedStyle(e).backdropFilter!=='none')e.style.setProperty('backdrop-filter','none','important');if(e.matches('.ah2123-strategies-glass,.ah1759-section-frost,.ah1786-home-band-frost,.ah2123-section-glass-film')){e.style.setProperty('display','none','important');e.style.setProperty('background','none','important')}}}let pending=false;function queue(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;apply()})}function init(){apply();new MutationObserver(queue).observe(document.body||document.documentElement,{childList:true,subtree:true});setTimeout(apply,1000);addEventListener('ah:persistent-route-complete',queue)}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init()})();
;
(()=>{
function apply(){
 if(!document.body?.hasAttribute('data-ah-mobile-surface'))return;
 const main=document.querySelector('main#main-content');if(!main)return;
 const section=[...main.children].find(e=>e.tagName==='SECTION');if(!section)return;
 const set=(e,p,v)=>e.style.setProperty(p,v,'important');
 set(main,'padding-top','0px');set(section,'margin-top','0px');set(section,'padding-top','48px');
 set(section,'position','relative');set(section,'isolation','isolate');
 section.setAttribute('data-ah-mobile-brand-header','');
 for(const e of [section]){set(e,'background-color','#14212b');set(e,'background-image',"url('./assets/honeycomb-fine-tile-2367.svg?v=honeycomb-2125')");set(e,'background-size','auto max(70.4lvh,572px)');set(e,'background-position','center');set(e,'background-attachment','scroll');set(e,'background-repeat','repeat')}
 const first=[...section.children].filter(e=>!e.matches('span[aria-hidden],.sr-only')).sort((a,b)=>a.getBoundingClientRect().top-b.getBoundingClientRect().top)[0];
 if(first)set(first,'margin-top','0px');
 if(section.matches('.ah1616-services-about-intro')&&first){const excess=first.getBoundingClientRect().top-section.getBoundingClientRect().top-48;set(section,'padding-top',(48-excess)+'px')}
 let rim=parseFloat(getComputedStyle(document.body,'::after').top)||122;
 try{if(window.parent!==window)rim=parseFloat(parent.getComputedStyle(parent.document.body,'::after').top)||rim}catch(_){}
 const r=main.getBoundingClientRect();const margin=parseFloat(getComputedStyle(main).marginTop)||0;
 const desired=rim+4.5;const unscrolled=r.top+main.scrollTop+window.scrollY;
 set(main,'margin-top',(margin+desired-unscrolled)+'px');
 let film=section.querySelector(':scope > .ah2123-section-glass-film');
 if(!film){film=document.createElement('span');film.className='ah2123-section-glass-film';film.setAttribute('aria-hidden','true');section.prepend(film)}
 for(const [p,v]of Object.entries({display:'none',position:'absolute',inset:'0px','z-index':'0',background:'rgba(220,236,243,.03375)','backdrop-filter':'none','-webkit-backdrop-filter':'none',filter:'blur(3.5px) saturate(.82) brightness(1.06)','background-image':"linear-gradient(rgba(220,236,243,.021),rgba(220,236,243,.021)),url('./assets/honeycomb-fine-tile-2367.svg?v=honeycomb-2125')",'background-size':'1440px 900px','background-position':'center','background-attachment':'scroll',opacity:'1','pointer-events':'none'}))set(film,p,v);
 for(const e of section.querySelectorAll(':scope > .ah1883-header-glass,:scope > .ah1863-frost-pane'))set(e,'display','none');
 for(const e of section.children)if(e!==film&&!e.matches('span[aria-hidden]')){set(e,'position','relative');set(e,'z-index','1')}
}
window.ahMobileHeaderLayout=()=>{apply();window.ahUniformHoneycomb?.()};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();
addEventListener('resize',window.ahMobileHeaderLayout);addEventListener('ah:persistent-route-complete',window.ahMobileHeaderLayout);
})();
;
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
;
