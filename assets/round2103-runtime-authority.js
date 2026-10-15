/* Automated Hearts Round 2109 — lean shared runtime authority.
   CSS owns geometry. Canonical router owns scroll progress. JS only supplies content,
   ticker measurement, and one-time text/button normalization. */
(()=>{'use strict';
  window.__AH1994_RESPONSIVE_FIT__=true;
  window.__AH2084_BUTTON_LABEL_AUTHORITY__=true;
  document.documentElement.dataset.ah1994Responsive='css-first';
  document.documentElement.dataset.ah2086Responsive='1';
  document.documentElement.dataset.ah2106Responsive='1';
})();

/* Home content guard. Source normally contains these nodes already. */
(()=>{'use strict';
  const DEF=`<div aria-label="Automation definition from Merriam-Webster" class="ah1759-definition-band" data-ah-definition-band="1759"><div class="ah1759-definition-band__shell"><p class="ah1759-definition-band__text"><span class="ah1759-definition-band__label">Automation:</span> the technique of making an apparatus, a process, or a system operate automatically. <span class="ah1759-definition-band__source">— Merriam-Webster</span></p></div></div>`;
  const GRID=`<div class="ah1759-insight-grid" data-ah-insight-grid="1759" aria-label="Operational and exploratory automation benefits"><article class="ah1759-insight-card"><div class="ah1759-insight-card__screen"><h3 class="ah1759-insight-card__title">Operational</h3><ul class="ah1759-insight-card__body ah1759-insight-card__points"><li>Use AI to automate scheduling, routing, follow-up, reporting, and repetitive workflows.</li><li>Reduce manual work, duplicate entry, and disconnected handoffs.</li><li>Improve operational visibility, consistency, speed, and accuracy.</li></ul></div></article><article class="ah1759-insight-card"><div class="ah1759-insight-card__screen"><h3 class="ah1759-insight-card__title">Exploratory</h3><ul class="ah1759-insight-card__body ah1759-insight-card__points"><li>Use AI to connect SEO, search, website, customer, and operational data.</li><li>Reveal hidden demand, pain points, content gaps, and emerging trends.</li><li>Turn overlooked information into new opportunities and better decisions.</li></ul></div></article></div>`;
  function ensure(){
    const b=document.body;if(!b||(b.dataset.page!=='home'&&b.dataset.ahMobileSurface!=='home'))return;
    if(!document.querySelector('.ah1759-definition-band')){
      const route=document.querySelector('#home-route-buttons,section[aria-label="Explore Automated Hearts"]');
      const hero=route?.previousElementSibling?.tagName==='SECTION'?route.previousElementSibling:document.querySelector('main#main-content>section:first-of-type');
      hero?.insertAdjacentHTML('beforeend',DEF);
    }
    if(!document.querySelector('.ah1759-insight-grid')){
      const route=document.querySelector('#home-route-buttons,section[aria-label="Explore Automated Hearts"]');
      if(route){const anchor=[...route.children].find(el=>el.matches('.shell,.route-grid,.home-explore-grid,.premium-route-grid'));(anchor||route).insertAdjacentHTML(anchor?'beforebegin':'afterbegin',GRID)}
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ensure,{once:true});else ensure();
  document.addEventListener('ah:persistent-route-complete',ensure);
})();

/* Ticker motion is owned by smooth-ticker-2388.js. */

/* Round 2109: button/text decoration is owned by round2109-state-digital-stabilizer.js. */


