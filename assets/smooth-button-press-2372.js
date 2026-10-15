/* Shared physical key motion. Does not intercept clicks or change toggle state. */
(()=>{
 'use strict';if(window.__ahSmoothButtonPress)return;window.__ahSmoothButtonPress=true;
 const controls='#header-send-message,#ah-mobile-message,button,input[type="button"],input[type="submit"],input[type="reset"],[role="button"],[data-ah-brand-carbon],#site-footer a,#primary-nav a,nav.footer a,#ah-mobile-footer a,a.message,.message-tab,.message-button,[data-ah-message-button],.ah1807-home-window-control,.ah1940-solution-window-control,.ah-unified-spacebar,.home-process-key-button,.premium-route-card__title-sign,.explore-key,.ah1600-explore-footer-key,.ah-rates__button,.r864-rates__drawer-toggle,.r865-rates__consultation-action,.ah-mobile-contact__submit,.nav-contact-submit,a.route-label,a.button,.action,.consult,.back-top,.learning-stage-return';
 const states=new WeakMap();let active=null;
 const reduced=()=>false;
 const remember=(el,props)=>props.map(prop=>[prop,el.style.getPropertyValue(prop),el.style.getPropertyPriority(prop)]);
 const restore=(el,props)=>{for(const[prop,value,priority]of props)value?el.style.setProperty(prop,value,priority):el.style.removeProperty(prop)};
 function glowDefinitions(){
  if(document.getElementById('ah-key-glow-defs'))return;
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.id='ah-key-glow-defs';svg.setAttribute('width','0');svg.setAttribute('height','0');svg.setAttribute('aria-hidden','true');svg.style.cssText='position:absolute;pointer-events:none';
  svg.innerHTML='<defs>'+Array.from({length:8},(_,i)=>'<filter id="ah-key-glow-'+i+'" x="-35%" y="-80%" width="170%" height="260%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency=".08 .015" numOctaves="1" seed="'+(i*13+7)+'" result="noise"/><feColorMatrix in="noise" type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 2.2 0 0 0 -.55" result="uneven"/><feComposite in="uneven" in2="SourceAlpha" operator="in" result="cores"/><feGaussianBlur in="cores" stdDeviation="4.4" result="blur"/><feFlood flood-color="#8fffd7" flood-opacity=".9" result="mint"/><feComposite in="mint" in2="blur" operator="in" result="halo"/><feMerge><feMergeNode in="halo"/><feMergeNode in="SourceGraphic"/></feMerge></filter>').join('')+'</defs>';
  const defs=svg.querySelector('defs');defs.insertAdjacentHTML('beforeend',Array.from({length:8},(_,i)=>'<filter id="ah-idle-bulbs-'+i+'" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency=".16 .09" numOctaves="1" seed="'+(i*19+11)+'" result="noise"/><feColorMatrix in="noise" type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 1.7 0 0 0 .25" result="levels"/><feComposite in="SourceGraphic" in2="levels" operator="in"/></filter>').join(''));(document.body||document.documentElement).append(svg);
 }
 let glowSerial=0;
 function fadeGlow(glow,target,duration){
  cancelAnimationFrame(glow.frame);const from=glow.level,start=performance.now();
  const tick=now=>{const t=duration?Math.min(1,(now-start)/duration):1;glow.level=from+(target-from)*t;glow.flood.setAttribute('flood-opacity',String(glow.level));if(t<1)glow.frame=requestAnimationFrame(tick);};
  glow.frame=requestAnimationFrame(tick);
 }
 function cleanGlows(state){for(const glow of state.glows||[]){cancelAnimationFrame(glow.frame);glow.filter.remove();}}

 function press(el){
  if(!el||el.matches(':disabled,[aria-disabled="true"],.carousel-orb,.home-transition-orb'))return;
  if(active===el)return;if(active)release(active);
  glowDefinitions();let previous=states.get(el);if(previous){clearTimeout(previous.timer);cleanGlows(previous);restore(el,previous.styles);for(const item of previous.labels)restore(item.el,item.styles);for(const overlay of previous.overlays||[])overlay.remove();}
  let labels=[...el.querySelectorAll('.ah-brand-carbon-label,.footer-nav-label,.ah1807-home-window-control__text,.ah1940-solution-window-control__text,.send-control-copy,.ah2084-button-label-lock,.route-label,.ah2123-explore-quote')].filter(node=>!node.parentElement.closest('.ah-brand-carbon-label,.footer-nav-label,.send-control-copy,.ah2084-button-label-lock'));
  if(el.matches('#negative-software-explore,.explore-key'))labels=[...el.querySelectorAll('.ah1597-explore-title,.ah1597-explore-quote,.ah2123-explore-quote,.ah1597-explore-attribution,.ah2172-explore-title,.ah2172-explore-quote,.ah2172-explore-source')];if(!labels.length){const copy=el.querySelector('.ah-green-control-copy');if(copy)labels.push(copy);}// Lettering is prepared at initialization; pressing must not rebuild or resize it.

  if(el.querySelector('.ah-mobile-clean-copy'))labels=[...el.querySelectorAll('.ah-mobile-clean-copy text')];
  const state={styles:remember(el,['translate','scale','transition','transform-origin','position','transform','box-shadow']),labels:labels.map(label=>({el:label,styles:remember(label,['filter','transition','text-shadow'])})).concat(labels.flatMap(label=>[...label.querySelectorAll('.ah-steady-bulb')].map(bulb=>({el:bulb,styles:remember(bulb,['opacity'])})))),overlays:[],glows:[],downAt:performance.now(),timer:0};states.set(el,state);active=el;el.dataset.ahPressActive='1';
  let seed=0;for(const c of (el.id||el.getAttribute('aria-label')||el.textContent||''))seed=(seed*31+c.charCodeAt(0))>>>0;
  const duration=reduced()?0:80;
  el.style.setProperty('transition','scale '+duration+'ms cubic-bezier(.22,.7,.3,1), translate '+duration+'ms cubic-bezier(.22,.7,.3,1)','important');
  el.style.setProperty('transform-origin','50% 50%','important');
  el.style.setProperty('translate','0 0','important');el.style.setProperty('scale','1','important');void el.offsetWidth;
  el.style.setProperty('scale','.97','important');el.style.setProperty('translate',el.matches('.nav-contact-close,.ah2257-form-close,.ah-mobile-contact__close')?'0 0':'0 2px','important');
  for(const label of labels){
   // Keep the loaded letter pixels and opacity unchanged during pressing.
   const template=document.getElementById('ah-key-glow-'+(seed%8));
   const filter=template.cloneNode(true);filter.id='ah-pressed-glow-'+(++glowSerial);
   const flood=filter.querySelector('feFlood');flood.setAttribute('flood-color',label.closest('.ah-mobile-clean-copy')?(label.style.stroke||'#8fffd7'):getComputedStyle(label).color);flood.setAttribute('flood-opacity','0');
   template.parentNode.append(filter);
   const glow={filter,flood,level:0,frame:0};state.glows.push(glow);
   label.style.setProperty('filter','url("#'+filter.id+'")','important');
   const homeWindow=true;
   if(homeWindow){filter.querySelector('feGaussianBlur').setAttribute('stdDeviation','2.8');const merge=filter.querySelector('feMerge');const halo=merge.querySelector('feMergeNode');for(let i=0;i<3;i++)merge.insertBefore(halo.cloneNode(true),merge.lastElementChild);}
   fadeGlow(glow,1,duration);
   label.style.setProperty('transition','none','important');
  }
 }
 function release(el=active,immediate=false){
  if(!el)return;if(active===el)active=null;const state=states.get(el);if(!state)return;clearTimeout(state.timer);
  const rise=()=>{el.style.setProperty('transition','scale 140ms cubic-bezier(.22,.7,.3,1), translate 140ms cubic-bezier(.22,.7,.3,1)','important');el.style.setProperty('translate','0 0','important');el.style.setProperty('scale','1','important');for(const glow of state.glows)fadeGlow(glow,0,140);state.timer=setTimeout(()=>{cleanGlows(state);for(const overlay of state.overlays)overlay.remove();for(const item of state.labels)restore(item.el,item.styles);restore(el,state.styles);states.delete(el);delete el.dataset.ahPressActive},reduced()?0:150)};
  if(immediate||reduced()){cleanGlows(state);restore(el,state.styles);for(const item of state.labels)restore(item.el,item.styles);for(const overlay of state.overlays)overlay.remove();states.delete(el);delete el.dataset.ahPressActive;return;}
  // A quick tap still completes the centered depression before returning.
  state.timer=setTimeout(rise,Math.max(0,60-(performance.now()-state.downAt)));
 }

 // Button lettering uses the same mint as the title fields.
 const labelSelector='.ah-brand-carbon-label,.footer-nav-label,.footer-page-led,.ah1807-home-window-control__text,.ah1940-solution-window-control__text,.send-control-copy,.ah2084-button-label-lock,.route-label,.ah2123-explore-quote';

 const bulbMasks=new WeakMap();
 function idleBulbs(label){
  if(label.closest('#ah-mobile-footer,#site-footer,#primary-nav,nav.footer')){
   // Keep footer words as one text run. Splitting them into letter spans
   // changes kerning for a frame each time the router replaces their text.
   if(label.children.length)label.textContent=label.textContent;
   const mobile=!!label.closest('#ah-mobile-footer,nav.footer');
   const values={'font-family':'Orbitron,system-ui,sans-serif','font-weight':'400','font-size':mobile?'11px':'16px','letter-spacing':'.3px','line-height':'1.2','font-kerning':'none','font-variant-ligatures':'none','white-space':'nowrap','mask-image':'radial-gradient(circle at 1.2px 1.2px,#000 0 1.02px,transparent 1.16px)','-webkit-mask-image':'radial-gradient(circle at 1.2px 1.2px,#000 0 1.02px,transparent 1.16px)','mask-size':'2.4px 2.4px','-webkit-mask-size':'2.4px 2.4px'};
   for(const [key,value]of Object.entries(values))if(label.style.getPropertyValue(key)!==value)label.style.setProperty(key,value,'important');
   return;
  }
  if(label.closest('.ah1807-home-window-control,#ah2123-mobile-critical-button,.ah2123-disclaimer-button'))label.style.setProperty('transition','none','important');
  let mask=bulbMasks.get(label);if(!mask){const c=getComputedStyle(label);mask={image:c.maskImage!=='none'?c.maskImage:'radial-gradient(circle at 1.2px 1.2px,#000 0 1.02px,transparent 1.16px)',size:c.maskSize==='auto'?'2.4px 2.4px':c.maskSize};bulbMasks.set(label,mask);}
  const put=(el,p,v)=>{if(el.style.getPropertyValue(p)!==v||el.style.getPropertyPriority(p)!=='important')el.style.setProperty(p,v,'important');};
  const walker=document.createTreeWalker(label,NodeFilter.SHOW_TEXT,{acceptNode:n=>n.parentElement.closest('.ah-steady-bulb,.ah-bulb-space')?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
  for(const node of nodes){const fragment=document.createDocumentFragment();for(const word of node.textContent.split(/(\s+)/)){if(!word)continue;if(/\s/.test(word)){const space=document.createElement('span');space.className='ah-bulb-space';space.textContent=' ';space.style.cssText='display:inline-block!important;width:.22em!important;min-width:.22em!important;white-space:pre!important;';fragment.append(space);continue;}const group=document.createElement('span');group.className='ah-bulb-word';group.style.cssText='display:inline-block!important;white-space:nowrap!important;';for(const char of word){const bulb=document.createElement('span');bulb.className='ah-steady-bulb';bulb.textContent=char;group.append(bulb);}fragment.append(group);}node.replaceWith(fragment);}
  const levels=[.28,1,.56,.36,.87,.44,1,.31,.69,1,.39,.52,.24,.95,.63,.34,1,.47,.76,.30];[...label.querySelectorAll('.ah-steady-bulb')].forEach((bulb,i)=>{put(bulb,'opacity','1');for(const prop of ['font','letter-spacing'])put(bulb,prop,'inherit');put(bulb,'display','inline-block');put(bulb,'line-height','1');put(bulb,'vertical-align','baseline');put(bulb,'mask-size',mask.size);put(bulb,'-webkit-mask-size',mask.size);const worn=false;const dots=worn?'radial-gradient(circle at 1.2px 1.2px,#000 0 .78px,transparent .97px)':mask.image;put(bulb,'mask-image',dots);put(bulb,'-webkit-mask-image',dots);});
  // Mask the individual bulbs; leave their parent unmasked so its glow is visible.
  // Footer placement belongs to the carbon-button layout. Rebuilding the bulb
  // lettering must not switch its centered label to a relative block.
  if(!label.closest('#negative-software-explore,.explore-key,#ah-mobile-footer,#site-footer,#primary-nav,nav.footer')){put(label,'display','block');put(label,'position','relative');put(label,'top','auto');put(label,'left','auto');put(label,'right','auto');put(label,'bottom','auto');put(label,'transform','none');put(label,'margin','0 auto');put(label,'text-align','center');put(label,'align-self','center');put(label,'height','auto');put(label,'min-height','0');put(label,'max-height','none');put(label,'flex','0 0 auto');put(label,'padding-top','0');put(label,'padding-bottom','0');put(label,'line-height','1.12');put(label,'white-space','nowrap');put(label,'text-overflow','clip');put(label,'translate','none');const button=label.closest(controls);put(label,'font-size',innerWidth>900&&innerWidth<1200&&button?.hasAttribute('data-ah1846-industry')?'12px':'16px');}

  put(label,'mask-image','none');put(label,'-webkit-mask-image','none');glowDefinitions();let seed=0;for(const c of label.textContent)seed=(seed*31+c.charCodeAt(0))>>>0;put(label,'filter','none');
 }

 function greenBulbs(){
  const put=(el,p,v)=>{if(el.style.getPropertyValue(p)!==v||el.style.getPropertyPriority(p)!=='important')el.style.setProperty(p,v,'important')};
  for(const button of document.querySelectorAll(controls)){
   const textKey=button.textContent+'|'+button.clientWidth;if(button.dataset.ahPreparedText===textKey)continue;button.dataset.ahPreparedText=textKey;
   if(states.has(button)||button.matches('.ah1807-home-window-control,.ah-home-route-footer-clone'))continue;if(button.matches('#negative-software-explore,.explore-key')){for(const label of button.querySelectorAll('.ah1597-explore-title,.ah1597-explore-quote,.ah2123-explore-quote,.ah1597-explore-attribution'))idleBulbs(label);continue;}
   if(button.closest('svg')||button.matches('#header-send-message,#ah-mobile-message,a.message,.ah2254-consultation'))continue;if(button.matches('input')){put(button,'color','#8fffd7');put(button,'-webkit-text-fill-color','#8fffd7');continue;}
   let labels=[...button.querySelectorAll(labelSelector)].filter(l=>!l.parentElement.closest(labelSelector));
   if(!labels.length){if(button.querySelector('img,svg,canvas,video')||!button.textContent.trim())continue;let face=button.querySelector(':scope > .ah-green-control-copy');if(!face){face=document.createElement('span');face.className='ah-green-control-copy';while(button.firstChild)face.append(button.firstChild);button.append(face);}labels=[face];}
   for(const label of labels){
    if(button.closest('#primary-nav,#site-footer,#ah-mobile-footer,nav.footer')&&/good-information/.test(button.getAttribute('href')||'')){const copy=button.closest('#ah-mobile-footer')?'Good Info':'Good Information';if(label.textContent.trim()!==copy)label.textContent=copy;button.setAttribute('aria-label',copy);}
    put(label,'color','#8fffd7');put(label,'-webkit-text-fill-color','#8fffd7');
    // Recolor the actual rendered bulb pixels, so brightness rules cannot turn them white.
    idleBulbs(label);put(label,'text-shadow','none');
    for(const child of label.querySelectorAll('*:not(svg):not(svg *):not(.ah-key-glow-overlay)')){put(child,'color','inherit');put(child,'-webkit-text-fill-color','inherit');put(child,'filter','none');}
   }
  }
 }
 let greenQueued=false;const queueGreen=()=>{if(document.documentElement.dataset.ahShieldMoving==='1')return;if(greenQueued)return;greenQueued=true;requestAnimationFrame(()=>{greenQueued=false;greenBulbs();brandText();uniformButtonText()})};
 function brandText(){if(matchMedia('(min-width:901px)').matches)return;
  for(const el of document.querySelectorAll('body *:not(svg):not(svg *):not(script):not(style):not(img):not(canvas):not(iframe)')){
   if(el.closest('[data-ah-static-ticker],#ah-page-progress'))continue;if(![...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()))continue;
   const c=getComputedStyle(el),rgb=c.color.match(/[\d.]+/g)?.map(Number);if(!rgb||rgb.length>3&&rgb[3]===0)continue;
   const [r,g,b]=rgb;const color=g>r*1.12&&g>b*1.04?'#8fffd7':r>g*1.15&&b>g*1.10?'#ff77bd':null;
   if(!color)continue;
   if(el.closest('.ah2189-red-sign-copy')||el.textContent.trim()==='Click a red sign.')continue;
   for(const key of ['color','-webkit-text-fill-color'])if(el.style.getPropertyValue(key)!==color)el.style.setProperty(key,color,'important');
   if(/brightness|contrast/.test(c.filter))el.style.setProperty('filter','none','important');
  }
 }
 function centerFooterLabels(){for(const button of document.querySelectorAll('#ah-mobile-footer a')){const label=button.querySelector('.footer-nav-label,.ah-brand-carbon-label');if(label){if(button.closest('#ah-mobile-footer')){for(const [key,value]of Object.entries({position:'absolute',inset:'10px',top:'10px',right:'10px',bottom:'10px',left:'10px',display:'flex','align-items':'center','justify-content':'center',width:'auto','max-width':'none',height:'auto',margin:'0',padding:'0','text-align':'center','box-sizing':'border-box'}))label.style.setProperty(key,value,'important');}}}}
 
 function uniformButtonText(){
  for(const button of document.querySelectorAll(controls)){
   if(states.has(button)||button.matches('.ah2254-consultation'))continue;
   if(button.closest('#ah-mobile-footer,#site-footer,#primary-nav,nav.footer'))continue;
   const prepared=button.textContent+'|'+button.clientWidth;if(button.dataset.ahUniformText===prepared)continue;
   const w=button.clientWidth,h=button.clientHeight;
   if(button.dataset.ahExploreFace==='2')continue;
   if(button.matches('.explore-key,#negative-software-explore')||button.querySelector('.ah2172-explore-title')){
    for(const label of button.querySelectorAll('.ah2172-explore-title,.ah2172-explore-quote,.ah2172-explore-source'))for(const [key,value]of Object.entries({'font-family':'Orbitron,system-ui,sans-serif','font-size':'16px','font-weight':'400','letter-spacing':'.3px','line-height':'1.35','mask-image':'radial-gradient(circle at 1.2px 1.2px,#000 0 1.02px,transparent 1.16px)','mask-size':'2.4px 2.4px'}))if(label.style.getPropertyValue(key)!==value)label.style.setProperty(key,value,'important');
    button.dataset.ahUniformText=prepared;button.dataset.ahCarbonSettled=button.textContent+'|'+button.clientWidth+'|'+button.clientHeight;continue;
   }
   if(w<60||h<30)continue;
   const label=button.querySelector('.ah-brand-carbon-label,.footer-nav-label,.ah1807-home-window-control__text,.ah1940-solution-window-control__text,.send-control-copy,.ah2084-button-label-lock');if(!label)continue;
   if(w>=140&&h<=96&&!button.matches('.solution-mobile-window-cover')){
    const set=(node,values)=>{for(const [key,value]of Object.entries(values))if(node.style.getPropertyValue(key)!==value)node.style.setProperty(key,value,'important');};
    set(label,{position:'absolute',inset:'12px',top:'12px',right:'12px',bottom:'12px',left:'12px',width:'auto','inline-size':'auto','max-width':'none','max-inline-size':'none',height:'auto','block-size':'auto','min-height':'0',display:'flex','align-items':'center','justify-content':'center','flex-direction':'row','flex-wrap':'nowrap',gap:'0','white-space':'nowrap','line-height':'1.2',overflow:'visible',margin:'0',padding:'0',transform:'none'});
    for(const inner of label.querySelectorAll('.ah2084-button-label-lock,.ah-brand-carbon-label'))set(inner,{display:'contents',position:'static',width:'auto',height:'auto',font:'inherit','white-space':'nowrap'});
    for(const group of label.querySelectorAll('.ah-bulb-word'))set(group,{display:'inline-block',position:'static',width:'auto','inline-size':'auto',height:'auto','block-size':'auto','font':'inherit','white-space':'nowrap',flex:'0 0 auto','min-width':'0','max-width':'none',margin:'0',padding:'0'});
    for(const bulb of label.querySelectorAll('.ah-steady-bulb'))set(bulb,{display:'inline-block',position:'static',width:'auto','inline-size':'auto',height:'auto','block-size':'auto'});

    const walker=document.createTreeWalker(label,NodeFilter.SHOW_TEXT,{acceptNode:n=>n.parentElement.closest('.ah-steady-bulb,.ah-bulb-space')?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
    for(const node of nodes){const fragment=document.createDocumentFragment();for(const word of node.textContent.split(/(\s+)/)){if(!word)continue;if(/\s/.test(word)){const space=document.createElement('span');space.className='ah-bulb-space';space.textContent=' ';fragment.append(space);continue;}const group=document.createElement('span');group.className='ah-bulb-word';group.style.cssText='display:inline-block!important;white-space:nowrap!important;flex:0 0 auto!important;width:auto!important;height:auto!important;position:static!important';for(const char of word){const bulb=document.createElement('span');bulb.className='ah-steady-bulb';bulb.textContent=char;group.append(bulb);}fragment.append(group);}node.replaceWith(fragment);}
    for(const node of [label,...label.querySelectorAll('*')]){
     if(node.classList.contains('ah-bulb-space')){for(const [key,value]of Object.entries({display:'inline-block',width:'.22em','min-width':'.22em','max-width':'.22em',flex:'0 0 .22em','white-space':'pre'}))if(node.style.getPropertyValue(key)!==value)node.style.setProperty(key,value,'important');}
     const isBulb=node.classList.contains('ah-steady-bulb');const mask=isBulb?'radial-gradient(circle at 1.2px 1.2px,#000 0 1.02px,transparent 1.16px)':'none';
     for(const key of ['mask-image','-webkit-mask-image'])if(node.style.getPropertyValue(key)!==mask)node.style.setProperty(key,mask,'important');
     if(isBulb){for(const [key,value]of Object.entries({'mask-size':'2.4px 2.4px',opacity:'1',font:'inherit'}))if(node.style.getPropertyValue(key)!==value)node.style.setProperty(key,value,'important');}
    }
   }
   const size=button.closest('#ah-mobile-footer')||w<140?11:16;
   const type={'font-family':'Orbitron,system-ui,sans-serif','font-weight':'400','letter-spacing':'.3px','line-height':'1.2',color:'#8fffd7','-webkit-text-fill-color':'#8fffd7','text-shadow':'none','font-style':'normal'};
   for(const [key,value]of Object.entries(type))if(label.style.getPropertyValue(key)!==value)label.style.setProperty(key,value,'important');
   for(const child of label.querySelectorAll('*')){for(const [key,value]of Object.entries({font:'inherit','letter-spacing':'inherit',color:'inherit','-webkit-text-fill-color':'inherit'}))if(child.style.getPropertyValue(key)!==value)child.style.setProperty(key,value,'important');}
   if(label.style.getPropertyValue('font-size')!==size+'px')label.style.setProperty('font-size',size+'px','important');button.dataset.ahUniformText=prepared;
  }
 }
function initGreen(){if(document.body.hasAttribute('data-ah-button-gallery'))return;document.addEventListener('ah:shield-motion-complete',queueGreen);greenBulbs();brandText();centerFooterLabels();uniformButtonText();new MutationObserver(queueGreen).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initGreen,{once:true});else initGreen();

 document.addEventListener('pointerdown',e=>{if(e.button===0)press(e.target.closest?.(controls))},true);
 window.addEventListener('pointerup',()=>release(),true);
 window.addEventListener('pointercancel',()=>release(),true);
 document.addEventListener('pointerout',e=>{if(active&&e.target instanceof Node&&active.contains(e.target)&&!active.contains(e.relatedTarget))release()},true);
 document.addEventListener('keydown',e=>{if(!e.repeat&&(e.key==='Enter'||e.key===' '))press(e.target.closest?.(controls))},true);
 document.addEventListener('keyup',e=>{if(e.key==='Enter'||e.key===' ')release()},true);
 window.addEventListener('blur',()=>release(active,true));
 window.addEventListener('pageshow',()=>release(active,true));
 window.AHControls=Object.freeze({normalizeText:uniformButtonText,resetFooter(){release();document.documentElement.classList.remove('ah-footer-navigation-loading');for(const el of document.querySelectorAll('#site-footer a,nav.footer a,#ah-mobile-footer a')){el.removeAttribute('data-ah-footer-loading');el.removeAttribute('data-ah-control-pressed');el.classList.remove('is-nav-pressed','is-route-pressed');}}});
})();


