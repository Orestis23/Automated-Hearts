/* Automated Hearts Round 1453 — final verified inline authority.
   Runs after legacy CSS/JS and reapplies only the specific requested controls. */
(()=>{
  'use strict';
  const PINK='#ff2ea8', MINT='#8fffd7', RED='#ff3030';
  const DESKTOP_ACC='./assets/ah-empty-transparent.svg?v=1453r';
  const MOBILE_MINT='./assets/ah-empty-transparent.svg?v=1453r';
  const MOBILE_PINK='./assets/ah-empty-transparent.svg?v=1453r';
  const MOBILE_BASE='./assets/footer-button-carbon-inner-rim-round1586.svg?v=1453r';
  const MOBILE_MSG='./assets/footer-button-carbon-flat-no-glow-round1738.svg?v=1453r';
  const imp=(el,p,v)=>{if(el)el.style.setProperty(p,v,'important');};
  const rem=(el,p)=>{if(el)el.style.removeProperty(p);};
  const props=(el,map)=>{if(!el)return;for(const [p,v] of Object.entries(map))imp(el,p,v);};

  const learningNodes=()=>{
    const sec=document.querySelector('body.page-learning[data-page="learning"] #learning-route-buttons');
    return {sec,shell:sec?.querySelector(':scope > .shell.compact-hero-grid'),paths:sec?.querySelector('#learning-paths'),grid:sec?.querySelector('.learning-header-grid.r987-learning-flat-grid')};
  };
  const clearLearning=()=>{
    const {sec,shell,paths,grid}=learningNodes();
    const base=['position','z-index','top','right','bottom','left','width','min-width','max-width','height','min-height','max-height','margin','padding','display','align-items','justify-content','overflow','inset','transform','translate'];
    [sec,shell,paths,grid].forEach(el=>base.forEach(p=>rem(el,p)));
  };
  const applyLearning=()=>{
    if(!matchMedia('(min-width:901px)').matches)return;
    const {sec,shell,paths,grid}=learningNodes();
    if(!sec||!document.body.classList.contains('ah-model-stage-locked')){clearLearning();return;}

    props(sec,{'position':'absolute','z-index':'18','top':'0','right':'0','bottom':'var(--r857-ticker-height,48px)','left':'0','width':'auto','min-width':'0','max-width':'none','height':'auto','min-height':'0','max-height':'none','margin':'0','padding':'0','display':'flex','align-items':'center','justify-content':'center','overflow':'visible','transform':'none','translate':'none'});
    props(shell,{'position':'relative','inset':'auto','width':'100%','min-width':'0','max-width':'100%','height':'100%','min-height':'0','max-height':'100%','margin':'0','padding':'0','display':'flex','align-items':'center','justify-content':'center','overflow':'visible','transform':'none','translate':'none'});
    props(paths,{'position':'relative','inset':'auto','width':'min(calc(100% - 36px),1600px)','min-width':'0','max-width':'1600px','height':'auto','min-height':'0','max-height':'100%','margin':'0 auto','padding':'0','transform':'none','translate':'none'});
    props(grid,{'position':'relative','inset':'auto','width':'100%','min-width':'0','max-width':'1600px','height':'auto','min-height':'0','max-height':'100%','margin':'0 auto','padding':'0','display':'grid','grid-template-columns':'repeat(3,minmax(0,1fr))','grid-template-rows':'auto','align-items':'center','justify-items':'center','align-content':'center','justify-content':'center','gap':'clamp(22px,3.2vw,58px)','transform':'none','translate':'none'});

    /* Size from BOTH vertical room and actual column width so the row stays
       centered without media spilling into adjacent columns at narrower desktop widths. */
    const available=Math.max(0,sec.getBoundingClientRect().height);
    const sampleSign=sec.querySelector('.premium-route-card__title-sign');
    const signH=Math.max(56,Math.min(72,sampleSign?.getBoundingClientRect().height||72));
    const itemGap=12, breathing=24;
    const verticalMax=Math.max(220,Math.floor(available-signH-itemGap-breathing));
    const gridW=Math.max(0,grid.getBoundingClientRect().width);
    const gapPx=parseFloat(getComputedStyle(grid).columnGap)||22;
    const columnMax=Math.max(220,Math.floor((gridW-(gapPx*2))/3));
    const med=Math.max(220,Math.min(460,verticalMax,columnMax));
    sec.style.setProperty('--ah1453-medallion',med+'px');

    sec.querySelectorAll('article.r987-learning-flat-card').forEach(card=>props(card,{'position':'relative','inset':'auto','display':'flex','flex-direction':'column','align-items':'center','justify-content':'center','gap':itemGap+'px','width':'100%','min-width':'0','max-width':'500px','height':'auto','min-height':'0','max-height':'none','margin':'0','padding':'0','overflow':'visible','transform':'none','translate':'none'}));
    sec.querySelectorAll('.learning-medallion-button,.learning-medallion-media').forEach(el=>props(el,{'width':med+'px','min-width':'0','max-width':med+'px','height':med+'px','min-height':'0','max-height':med+'px','aspect-ratio':'1/1','margin':'0 auto','flex':'0 0 auto'}));
    sec.querySelectorAll('img.r987-learning-flat-button-image').forEach(el=>props(el,{'display':'block','width':'100%','min-width':'0','max-width':med+'px','height':'100%','min-height':'0','max-height':med+'px','object-fit':'contain','margin':'0 auto'}));

    const line=sec.querySelector('.ah-learning-ticker-line-r1451');
    props(line,{'position':'absolute','z-index':'100','top':'auto','right':'0','bottom':'-2px','left':'0','display':'block','width':'auto','height':'2px','margin':'0','padding':'0','border':'0','background':PINK,'box-shadow':'0 0 3px rgba(255,46,168,.78),0 0 7px rgba(255,46,168,.25)','opacity':'1','pointer-events':'none'});
  };

  const overlayFor=(button,url)=>{
    if(!button)return;
    button.querySelectorAll('.ah-footer-pink-corners,.ah1451-message-match-accents,.ah1452-message-corner-overlay').forEach(old=>props(old,{'display':'none','visibility':'hidden','opacity':'0'}));
    let ov=button.querySelector(':scope > .ah1453-message-corner-overlay');
    if(!ov){ov=document.createElement('span');ov.className='ah1453-message-corner-overlay';ov.setAttribute('aria-hidden','true');button.appendChild(ov);}
    props(ov,{'position':'absolute','z-index':'96','inset':'0','display':'block','visibility':'visible','overflow':'hidden','pointer-events':'none','background-color':'transparent','background-image':`url("${url}")`,'background-position':'center','background-size':'100% 100%','background-repeat':'no-repeat','opacity':'1','filter':'none'});
  };
  const applyDesktopFooter=()=>{
    if(!matchMedia('(min-width:801px)').matches)return;
    /* Round 1559: desktop footer type/surface is owned by the final footer authority. */
  };
  const applyMobileFooter=()=>{
    if(!matchMedia('(max-width:900px)').matches)return;
    /* Round 1571: mobile footer/message styling is owned by the final mobile shell authority. */
    return;
    document.querySelectorAll('body > nav.footer > a[href]').forEach((button,i)=>{
      props(button,{'position':'relative','background-image':`url("${MOBILE_BASE}")`,'background-size':'100% 100%','background-position':'center','background-repeat':'no-repeat'});
      const mint=(i%2)===0,color=mint?MINT:PINK;
      overlayFor(button,mint?MOBILE_MINT:MOBILE_PINK);
      props(button.querySelector('.footer-nav-label'),{'color':color,'-webkit-text-fill-color':color});
    });
    const msg=document.querySelector('body > a.message');
    if(msg){
      props(msg,{'background-image':`url("${MOBILE_MSG}")`,'background-size':'100% 100%','background-position':'center','background-repeat':'no-repeat'});
      props(msg.querySelector('svg'),{'color':RED,'filter':'drop-shadow(0 0 1px rgba(255,48,48,.35))'});
      msg.querySelectorAll('svg path,svg polyline,svg line').forEach(el=>imp(el,'stroke',RED));
    }
  };

  const applyTicker=()=>{};

  const applyAll=()=>{applyLearning();};
  let raf=0;const queue=()=>{if(raf)return;raf=requestAnimationFrame(()=>{raf=0;applyAll();});};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',applyAll,{once:true});else applyAll();
  addEventListener('load',applyAll,{once:true});addEventListener('pageshow',applyAll);(window.AHResponsive?window.AHResponsive.watch(queue):addEventListener('resize',queue,{passive:true}));
  addEventListener('ah:persistent-route-complete',queue);
  const mo=new MutationObserver(applyAll);mo.observe(document.documentElement,{attributes:true,attributeFilter:['data-ah-shell-page','class']});
  if(document.body)mo.observe(document.body||document.documentElement,{attributes:true,attributeFilter:['class','data-page','data-ah-shell-page']});
})();
