/* Round 1958 — Solution window controller.
   The actual machine iframe is eagerly created/hydrated so its first rendered
   frame is visible behind the closed Home-style glass before the window opens. */
(()=>{'use strict';window.__AH1940_SOLUTION_WINDOW__=true;
 const COVER='#solution-process-cover,#solution-mobile-cover', CONTROL='.ah-solution-open-sign';
 const DESKTOP_URL='./solution-machine-pipeline-round1865.html?v=1958r';
 const MOBILE_URL='./solution-machine-pipeline-round1865.html?preview=1&v=1968r';
 const MOBILE_PERF=matchMedia('(max-width:900px)').matches;
 const cover=()=>document.querySelector(COVER), control=()=>document.querySelector(CONTROL);

 function ensureFrame(){
   let f=document.querySelector('#solution-engine-model,#lite-model-shell>iframe');
   if(f)return f;
   const shell=document.querySelector('#lite-model-shell.solution-mobile-model-shell');
   if(!shell)return null;
   f=document.createElement('iframe');
   f.title='Interactive Automated Hearts machine; select an overhead sign to explore its section';
   f.loading='eager';
   f.setAttribute('fetchpriority','high');
   f.setAttribute('allow','webgl');
   f.setAttribute('allowtransparency','true');
   f.dataset.src=MOBILE_URL;
   shell.appendChild(f);
   return f;
 }
 const frame=()=>ensureFrame();
 const isOpen=()=>{const c=cover();return !!c&&(c.classList.contains('is-open')||c.getAttribute('aria-expanded')==='true');};

 function sync(){
   const c=cover(),b=control();if(!c||!b)return;
   const open=isOpen(),txt=open?'Close window.':'Open the window.';
   const l=b.querySelector('.ah-solution-open-sign__text');
   if(l)l.textContent=txt;
   b.setAttribute('aria-label',txt);
   b.setAttribute('aria-expanded',open?'true':'false');
   b.dataset.windowState=open?'open':'closed';
 }

 function hydrate(){
   const f=frame();if(!f)return null;
   if(f.id==='solution-engine-model'&&!f.dataset.src&&!f.getAttribute('src'))f.dataset.src=DESKTOP_URL;
   const d=f.dataset?.src||DESKTOP_URL;
   if(!f.getAttribute('src')){
     f.setAttribute('loading','eager');
     f.setAttribute('fetchpriority','high');
     f.setAttribute('src',d);
   }
   return f;
 }

 function set(open){
   const c=cover(),f=(open||!MOBILE_PERF)?hydrate():frame();if(!c)return;
   c.classList.toggle('is-open',!!open);
   c.setAttribute('aria-expanded',open?'true':'false');
   c.setAttribute('aria-label',open?'Machine window open':'Reveal the machine');
   if(f)f.style.pointerEvents=open?'auto':'none';
   try{f?.contentWindow?.postMessage({type:'engine-visibility',visible:!!open},'*');}catch(_){}
   sync();
 }

 function toggle(e){
   e?.preventDefault?.();e?.stopPropagation?.();e?.stopImmediatePropagation?.();
   set(!isOpen());return false;
 }

 function bind(){
   hydrate();
   const c=cover(),b=control();if(!c||!b)return;
   if(b.dataset.ah1940Bound!=='1'){
     b.dataset.ah1940Bound='1';
     b.addEventListener('click',toggle,true);
     b.addEventListener('keydown',e=>{
       if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle(e);}
     },true);
   }
   set(false);sync();
 }

 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});else bind();
 document.addEventListener('ah:persistent-route-complete',()=>setTimeout(bind,0));
 addEventListener('pageshow',()=>{hydrate();sync();},{passive:true});
})();
