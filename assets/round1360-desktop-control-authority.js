/* Round 1360 — desktop control authority. Preserves Round 1358 footer behavior,
   but the entire Messages hardware face submerges; the envelope stays centered. */
(function(){
  'use strict';
  var MQ='(min-width:801px)';
  var FOOT_REST='./assets/footer-button-message-border-match-round1095.svg?v=1451r';
  var FOOT_DOWN=FOOT_REST;
  var MSG_REST='./assets/message-button-carbon-red-round1586.svg?v=1639r';
  var MSG_DOWN='./assets/message-button-carbon-red-pressed-round1586.svg?v=1639r';
  var MSG_BG_SIZE='100% 100%, 100% 100%, 100% 100%, auto, auto, auto';
  var MSG_BG_POS='center, center, center, 0 0, 0 0, center';
  var MSG_BG_REPEAT='no-repeat, no-repeat, no-repeat, repeat, repeat, no-repeat';
  function carbonFace(overlay,down){return 'url(\"'+overlay+'\"), linear-gradient(160deg,rgba(255,255,255,'+(down?'.075':'.12')+') 0%,rgba(255,255,255,'+(down?'.028':'.045')+') 9%,rgba(210,220,225,.025) 18%,transparent 38% 69%,rgba(255,255,255,.018) 84%,rgba(0,0,0,'+(down?'.24':'.16')+') 100%), radial-gradient(at 30% -20%,rgba(220,230,235,.08),transparent 65%), repeating-linear-gradient(135deg,rgba(185,185,185,.075) 0 3px,rgba(0,0,0,.08) 3px 6px), repeating-linear-gradient(45deg,rgba(145,145,145,.05) 0 3px,rgba(0,0,0,.07) 3px 6px), linear-gradient(#111315 0%,#08090a 48%,#030405 100%)';}
  function ensureMessagePulse(a){
    if(!a)return;var n=a.querySelector(':scope > .ah1586-accent-pulse');if(n)return n;
    n=document.createElement('span');n.className='ah1586-accent-pulse';n.setAttribute('aria-hidden','true');n.style.setProperty('--ah1586-pulse-rgb','255,48,48');
    n.innerHTML='<svg viewBox="0 0 160 160" preserveAspectRatio="none" focusable="false" aria-hidden="true"><path pathLength="100" d="M14 78V20Q14 14 20 14H136"/><path pathLength="100" d="M146 76V133Q146 139 140 139H42"/></svg>';
    a.appendChild(n);return n;
  }
  var timers=new WeakMap();
  function imp(el,p,v){if(el)el.style.setProperty(p,v,'important');}
  function messageOpen(a){return !!(a&&(a.getAttribute('aria-expanded')==='true'||a.classList.contains('is-contact-latched')||document.documentElement.classList.contains('ah-message-persist-open')));}
  function setFooter(a,down){
    if(!a)return;
    /* Round 1559: desktop footer is owned by the final footer authority. */
    if(a.closest && a.closest('footer#site-footer')) return;
    imp(a,'background-color','transparent');imp(a,'background-image','url("'+(down?FOOT_DOWN:FOOT_REST)+'")');imp(a,'background-position','center');imp(a,'background-size','100% 100%');imp(a,'background-repeat','no-repeat');imp(a,'border','0');imp(a,'outline','0');imp(a,'transform','translate3d(0,0,0)');a.setAttribute('data-ah-key-down',down?'1':'0');imp(a,'box-shadow',down?'inset 0 4px 7px rgba(0,0,0,.30), inset 0 1px 0 rgba(255,255,255,.035), 0 1px 2px rgba(0,0,0,.28)':'0 5px 7px rgba(255,46,168,.13)');
    var copy=a.querySelector('.send-control-copy');if(copy){copy.style.removeProperty('transform');}
    var ind=a.querySelector('.send-control-indicator');if(ind){imp(ind,'display','none');imp(ind,'opacity','0');imp(ind,'height','0');}
  }
  function setMessage(a,down){
    if(!a)return;
    imp(a,'position','fixed');imp(a,'z-index','2147483646');imp(a,'top','16px');imp(a,'right','6px');imp(a,'bottom','auto');imp(a,'left','auto');imp(a,'display','block');imp(a,'visibility','visible');imp(a,'opacity','1');imp(a,'width','84px');imp(a,'min-width','84px');imp(a,'max-width','84px');imp(a,'height','84px');imp(a,'min-height','84px');imp(a,'max-height','84px');imp(a,'margin','0');imp(a,'padding','0');imp(a,'overflow','visible');
    ensureMessagePulse(a);imp(a,'background-color','#050607');imp(a,'background-image',carbonFace(down?MSG_DOWN:MSG_REST,down));imp(a,'background-position',MSG_BG_POS);imp(a,'background-size',MSG_BG_SIZE);imp(a,'background-repeat',MSG_BG_REPEAT);imp(a,'background-blend-mode','normal');imp(a,'border','0');imp(a,'outline','0');imp(a,'clip-path','none');imp(a,'-webkit-clip-path','none');imp(a,'mask','none');imp(a,'-webkit-mask','none');imp(a,'filter','none');
    imp(a,'transform',down?'translate3d(0,3px,0) scale(.97)':'translate3d(0,0,0) scale(1)');imp(a,'transform-origin','50% 50%');a.setAttribute('data-ah-key-down',down?'1':'0');
    imp(a,'box-shadow',down?'inset 0 4px 7px rgba(0,0,0,.30), inset 0 1px 0 rgba(255,255,255,.035), 0 8px 10px -9px rgba(255,59,79,.50), 0 10px 14px -11px rgba(255,46,168,.28)':'0 5px 7px rgba(0,0,0,.30), 0 8px 10px -9px rgba(255,59,79,.50), 0 10px 14px -11px rgba(255,46,168,.28)');
    imp(a,'pointer-events','auto');imp(a,'transition','transform 90ms ease,box-shadow 90ms ease,filter 90ms ease');
    var env=a.querySelector('.r1005-message-envelope');if(env){imp(env,'position','absolute');imp(env,'z-index','20');imp(env,'inset','0');imp(env,'display','grid');imp(env,'visibility','visible');imp(env,'opacity','1');imp(env,'place-items','center');imp(env,'width','100%');imp(env,'height','100%');imp(env,'margin','0');imp(env,'padding','0');imp(env,'color','#ff3b4f');imp(env,'transform','translate3d(0,0,0)');var open=messageOpen(a);imp(env,'transition','filter 180ms ease');imp(env,'filter',open?'brightness(1.30) saturate(1.18) drop-shadow(0 0 3px rgba(255,59,79,1)) drop-shadow(0 0 9px rgba(255,59,79,.98)) drop-shadow(0 0 17px rgba(255,46,168,.74))':'brightness(1) saturate(1) drop-shadow(0 0 1px rgba(255,59,79,.18))');var svg=env.querySelector('svg');if(svg){imp(svg,'position','static');imp(svg,'inset','auto');imp(svg,'display','block');imp(svg,'width','42%');imp(svg,'max-width','42%');imp(svg,'height','auto');}env.querySelectorAll('path').forEach(function(p){imp(p,'fill','none');imp(p,'stroke','#ff3b4f');imp(p,'stroke-width','1.6');});}
  }
  function momentary(el,setter,down){var old=timers.get(el);if(old)clearTimeout(old);setter(el,down);if(down)timers.set(el,setTimeout(function(){setter(el,false);timers.delete(el);},150));}
  function bindFooter(el){if(!el||el.dataset.ahR1360Footer==='1')return;el.dataset.ahR1360Footer='1';el.addEventListener('pointerdown',function(){if(matchMedia(MQ).matches)momentary(el,setFooter,true);},{passive:true});el.addEventListener('pointerup',function(){if(matchMedia(MQ).matches)setTimeout(function(){setFooter(el,false);},80);},{passive:true});el.addEventListener('pointercancel',function(){if(matchMedia(MQ).matches)setFooter(el,false);},{passive:true});}
  function bindMessage(el){if(!el||el.dataset.ahR1360Message==='1')return;el.dataset.ahR1360Message='1';el.addEventListener('pointerdown',function(){if(matchMedia(MQ).matches)setMessage(el,true);},{passive:true});el.addEventListener('pointerup',function(){if(matchMedia(MQ).matches)setTimeout(function(){setMessage(el,false);},120);},{passive:true});el.addEventListener('pointercancel',function(){if(matchMedia(MQ).matches)setMessage(el,false);},{passive:true});el.addEventListener('keydown',function(e){if(matchMedia(MQ).matches&&(e.key==='Enter'||e.key===' '))setMessage(el,true);});el.addEventListener('keyup',function(){if(matchMedia(MQ).matches)setTimeout(function(){setMessage(el,false);},80);});try{new MutationObserver(function(){if(matchMedia(MQ).matches)setMessage(el,false);}).observe(el,{attributes:true,attributeFilter:['aria-expanded','class']});new MutationObserver(function(){if(matchMedia(MQ).matches)setMessage(el,false);}).observe(document.documentElement,{attributes:true,attributeFilter:['class']});}catch(_e){}
  }
  function apply(){if(!matchMedia(MQ).matches)return;document.querySelectorAll('footer#site-footer nav#primary-nav a.footer-structure-control.mechanical-send-control[data-nav]').forEach(function(a){setFooter(a,false);bindFooter(a);});var msg=document.getElementById('header-send-message');if(msg){setMessage(msg,false);bindMessage(msg);}}
  function ready(){apply();requestAnimationFrame(apply);setTimeout(apply,100);setTimeout(apply,500);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();window.addEventListener('pageshow',ready);try{matchMedia(MQ).addEventListener('change',function(e){if(e.matches)ready();});}catch(_e){}
})();
