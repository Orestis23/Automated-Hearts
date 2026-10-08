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