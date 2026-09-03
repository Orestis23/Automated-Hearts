(function(){
  function init(){
    const buttons=document.querySelectorAll('.r973-pink-edge');
    buttons.forEach((button)=>{
      if(button.dataset.r973PressReady==='1') return;
      button.dataset.r973PressReady='1';
      const press=()=>{
        button.style.setProperty('border-right-width','0px','important');
        button.style.setProperty('border-bottom-width','0px','important');
      };
      const release=()=>{
        button.style.setProperty('border-right-width','0px','important');
        button.style.setProperty('border-bottom-width','0px','important');
      };
      release();
      button.addEventListener('pointerdown',press,{passive:true});
      button.addEventListener('pointerup',release,{passive:true});
      button.addEventListener('pointercancel',release,{passive:true});
      button.addEventListener('pointerleave',release,{passive:true});
      button.addEventListener('blur',release,true);
    });
    const message=document.getElementById('header-send-message');
    const envelope=message&&message.querySelector(':scope > .r966-message-envelope-center');
    if(envelope){
      envelope.style.setProperty('left','50%','important');
      envelope.style.setProperty('top','50%','important');
      envelope.style.setProperty('transform','translate(-50%,-50%)','important');
    }
    document.querySelectorAll('#site-footer .footer-nav-label').forEach((label)=>{
      if(window.matchMedia('(min-width:1101px)').matches){
        label.style.setProperty('font-size','12.5pt','important');
      }
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true}); else init();
  window.addEventListener('load',init,{once:true});
  window.addEventListener('pageshow',init);
})();
