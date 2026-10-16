/* Automated Hearts Round 1453 — final verified inline authority.
   Runs after legacy CSS/JS and reapplies only the specific requested controls. */
(()=>{
  'use strict';
  const PINK='#ff2ea8', MINT='#8fffd7', RED='#ff3030';
  const DESKTOP_ACC='data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%221%22%20height=%221%22/%3E';
  const MOBILE_MINT='data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%221%22%20height=%221%22/%3E';
  const MOBILE_PINK='data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%221%22%20height=%221%22/%3E';
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
    const {sec,shell,paths,grid}=learningNodes();if(!sec||sec.hasAttribute('data-ah-responsive-deck'))return;
    const vars=getComputedStyle(document.documentElement);
    const usable=Math.max(280,innerHeight-(parseFloat(vars.getPropertyValue('--current-frame-top'))||96)-(parseFloat(vars.getPropertyValue('--current-frame-bottom'))||108));
    props(document.querySelector('main#main-content'),{'padding-top':'0','padding-bottom':'0'});
    props(sec,{position:'relative',inset:'auto',height:usable+'px','min-height':usable+'px','max-height':'none',padding:'24px clamp(16px,2vw,40px)',display:'flex','align-items':'center','justify-content':'center','box-sizing':'border-box',overflow:'visible'});
    props(shell,{position:'relative',inset:'auto',height:'521.6px','min-height':'521.6px','max-height':'none',width:'100%','max-width':'1600px',padding:'0',margin:'0 auto',display:'flex','flex-direction':'column','align-items':'center','justify-content':'center',gap:'24px',transform:'none'});
    props(paths,{position:'relative',inset:'auto',width:'100%',height:'auto',margin:'0',padding:'0',transform:'none'});
    props(grid,{display:'grid','grid-template-columns':'repeat(3,minmax(0,1fr))',gap:'24px',width:'100%',margin:'0',padding:'0',height:'auto'});
    const band=sec.querySelector('.ah-brand-digital-cta-band');props(band,{position:'relative',inset:'auto',transform:'none',width:'100%','max-width':'none',margin:'0'});
    const bandHeight=band?.getBoundingClientRect().height||60;
    const width=(grid.getBoundingClientRect().width-48)/3;
    const med=Math.max(100,Math.min(320,width,usable-bandHeight-24-56-12-48));
    for(const el of sec.querySelectorAll('.learning-medallion-button,.learning-medallion-media'))props(el,{width:med+'px',height:med+'px','min-width':'0','max-width':med+'px','min-height':'0','max-height':med+'px',margin:'0 auto','aspect-ratio':'1'});
    for(const el of sec.querySelectorAll('img.r987-learning-flat-button-image'))props(el,{width:'100%',height:'100%','min-width':'0','max-width':'100%','min-height':'0','max-height':'100%','object-fit':'contain'});
    sec.querySelector('.ah-learning-ticker-line-r1451')?.remove();
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
