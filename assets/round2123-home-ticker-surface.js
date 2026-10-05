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