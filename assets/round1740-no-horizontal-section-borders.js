/* Round 2106 — one-pass horizontal-border cleanup. */
(()=>{'use strict';
 const SECTIONS='main>section,main#main-content>section,main#main-content>.r864-rates>.r864-rates__drawers,main#main-content>.r864-rates>.r864-rates__final,main#main-content>.r864-rates>.r972-bottom-consultation';
 const FILMS='main#main-content>section>[class*="section-matte"],main#main-content>section>[class*="surface-matte"],main#main-content>section>[class*="section-film"]';
 const DIVIDERS='main#main-content>.ah1483-section-break,main#main-content>.ah1483-section-break--top,main#main-content>[class*="section-break"],main#main-content>[class*="section-divider"],main#main-content>hr,main#main-content .ah1469-home-divider-glow,main#main-content [class*="divider-glow"],main#main-content [class*="section-rule"],main#main-content [class*="section-line"]';
 const imp=(e,p,v)=>e&&e.style.setProperty(p,v,'important');
 function apply(){document.querySelectorAll(SECTIONS).forEach(e=>{['border-top','border-bottom','border-image','outline','box-shadow'].forEach(p=>imp(e,p,p==='border-image'?'none':p==='outline'||p==='box-shadow'?'none':'0'))});document.querySelectorAll(FILMS).forEach(e=>{imp(e,'outline','0');imp(e,'border-top','0');imp(e,'border-bottom','0');imp(e,'box-shadow','none')});document.querySelectorAll(DIVIDERS).forEach(e=>{imp(e,'display','none');imp(e,'visibility','hidden');imp(e,'opacity','0');imp(e,'height','0');imp(e,'margin','0');imp(e,'padding','0');imp(e,'border','0');imp(e,'background','none');imp(e,'box-shadow','none')})}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();addEventListener('pageshow',apply,{passive:true});document.addEventListener('ah:persistent-route-complete',apply);
})();
