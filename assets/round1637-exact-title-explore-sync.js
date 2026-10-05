/* Automated Hearts Round 1637 — exact title-field clone + Explore bottom alignment.
   The Negative-Software Solution sign inherits the live computed material from the
   first Home title field (Automated Hearts), including its matte pseudo layer.
   Explore is measured against the adjacent process screen and forced to the same
   rendered height on load/resize/font settlement. */
(()=>{
  'use strict';
  const DESKTOP='(min-width:901px)';
  const important=(el,prop,val)=>{ try{ el.style.setProperty(prop,val,'important'); }catch(_){} };
  const copyComputed=(from,to,skip=new Set())=>{
    const cs=getComputedStyle(from);
    for(let i=0;i<cs.length;i++){
      const p=cs[i];
      if(skip.has(p)) continue;
      const v=cs.getPropertyValue(p);
      if(v) important(to,p,v);
    }
  };
  const copyPseudo=(from,pseudo,to)=>{
    const cs=getComputedStyle(from,pseudo);
    for(let i=0;i<cs.length;i++){
      const p=cs[i];
      if(p==='content') continue;
      const v=cs.getPropertyValue(p);
      if(v) important(to,p,v);
    }
    important(to,'content','none');
  };
  function syncTitle(){
    if(!matchMedia(DESKTOP).matches) return;
    const source=document.querySelector('#home-title-fields > .r1362-home-title-field--green');
    const sourceText=source&&source.querySelector('.r1362-home-title-text');
    const target=document.getElementById('home-negative-software-title');
    const targetText=target&&target.querySelector('.ah-negative-software-title-copy');
    if(!source||!sourceText||!target||!targetText) return;

    // Remove the historical standalone film; use a clone of the exact source film instead.
    target.querySelectorAll(':scope > .r488-extra-matte-film').forEach(el=>el.remove());
    let film=target.querySelector(':scope > .ah1637-title-film');
    if(!film){
      film=document.createElement('span');
      film.className='ah1637-title-film';
      film.setAttribute('aria-hidden','true');
      target.appendChild(film);
    }

    // Copy the actual live field and text appearance. Width is deliberately copied so this
    // field has the same physical field width as "Automated Hearts", not an approximation.
    copyComputed(source,target,new Set(['margin-top','margin-bottom','margin-left','margin-right','grid-area','grid-column','grid-row']));
    const r=source.getBoundingClientRect();
    important(target,'width',`${Math.round(r.width*100)/100}px`);
    important(target,'min-width',`${Math.round(r.width*100)/100}px`);
    important(target,'max-width',`${Math.round(r.width*100)/100}px`);
    important(target,'height',`${Math.round(r.height*100)/100}px`);
    important(target,'min-height',`${Math.round(r.height*100)/100}px`);
    important(target,'max-height',`${Math.round(r.height*100)/100}px`);
    important(target,'margin','0 auto');
    important(target,'position','relative');
    important(target,'isolation','isolate');
    important(target,'overflow','hidden');
    important(target,'border-radius','0px');
    important(target,'transform','none');

    copyComputed(sourceText,targetText,new Set(['width','min-width','max-width','height','min-height','max-height','margin-left','margin-right']));
    important(targetText,'position','relative');
    important(targetText,'z-index','10');
    important(targetText,'display','block');
    important(targetText,'width','auto');
    important(targetText,'max-width','calc(100% - 24px)');
    important(targetText,'margin','0');
    important(targetText,'white-space','nowrap');
    important(targetText,'text-align','center');
    // Keep the same source font treatment; only shrink if the longer phrase requires it.
    const available=Math.max(1,target.clientWidth-24);
    const natural=targetText.scrollWidth;
    if(natural>available){
      const fs=parseFloat(getComputedStyle(sourceText).fontSize)||21;
      const fitted=Math.max(14,fs*(available/natural)*.985);
      important(targetText,'font-size',`${fitted}px`);
    }

    copyPseudo(source,'::after',film);
    important(film,'content','');
    important(film,'position','absolute');
    important(film,'pointer-events','none');
    important(film,'display','block');
    important(film,'z-index','8');
    important(film,'inset','2px');
    target.dataset.ah1637ExactTitle='1';
  }

  function syncExplore(){
    if(!matchMedia(DESKTOP).matches) return;
    const grid=document.querySelector('#home-solution-framework .negative-software-grid-round344');
    if(!grid) return;
    const screens=[...grid.querySelectorAll('article.home-process-stage.negative-software-screen-round344.ah-home-process-box')]
      .filter(el=>el.id!=='negative-software-explore'&&!el.classList.contains('ah1600-explore-footer-cell'));
    const screen=screens[0];
    const article=grid.querySelector('article.ah1600-explore-footer-cell');
    const key=document.getElementById('negative-software-explore');
    if(!screen||!article||!key) return;
    const screenH=Math.round(screen.getBoundingClientRect().height*100)/100;
    if(!Number.isFinite(screenH)||screenH<120) return;
    const h=screenH+20;
    [article,key].forEach(el=>{
      important(el,'height',`${h}px`);
      important(el,'min-height',`${h}px`);
      important(el,'max-height',`${h}px`);
      important(el,'margin-top','0px');
      important(el,'margin-bottom','0px');
      important(el,'align-self','stretch');
      important(el,'box-sizing','border-box');
    });
    // Explicitly seat both bottoms on the same grid baseline.
    important(article,'position','relative');
    important(key,'position','relative');
    article.dataset.ah1637FlushHeight=String(h);
  }

  let raf=0;
  const sync=()=>{ cancelAnimationFrame(raf); raf=requestAnimationFrame(()=>{ syncExplore(); }); };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',sync,{once:true}); else sync();
  addEventListener('load',sync,{once:true});
  addEventListener('resize',sync,{passive:true});
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(sync).catch(()=>{});
  setTimeout(sync,100);
  setTimeout(sync,350);
  setTimeout(sync,900);
})();
