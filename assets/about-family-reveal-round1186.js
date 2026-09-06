(function(){
  'use strict';
  function init(){
    document.querySelectorAll('.ah-about-family-reveal').forEach(function(stage){
      if(stage.dataset.ahFamilyRevealBound === '1') return;
      stage.dataset.ahFamilyRevealBound = '1';
      var shield = stage.querySelector('.ah-about-family-reveal__shield');
      if(!shield) return;
      var reveal = function(){
        if(stage.classList.contains('is-revealing') || stage.classList.contains('is-revealed')) return;
        stage.classList.add('is-revealing');
        shield.setAttribute('aria-expanded','true');
        var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.setTimeout(function(){
          stage.classList.remove('is-revealing');
          stage.classList.add('is-revealed');
          shield.hidden = true;
        }, reduced ? 0 : 2180);
      };
      shield.addEventListener('click', reveal, {passive:true});
    });
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
