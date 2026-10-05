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

/* Home ticker content + constant-speed motion. One shared ResizeObserver is used through AHResponsive. */
(()=>{'use strict';
  const quotes=[
    {text:'“With the right information, you can predict the future.”',tone:'pink'},
    {text:'“Open 24/7.”',tone:'green'},
    {text:'“Get rid of software costs.”',tone:'pink'}
  ];
  let unwatch=null;
  function build(){
    const marquee=document.querySelector('#home-charity-ticker .charity-marquee,.charity-marquee#home-charity-ticker,#home-charity-ticker');
    if(!marquee)return;
    let track=marquee.querySelector('.charity-marquee__track');
    if(!track){track=document.createElement('span');track.className='charity-marquee__track';marquee.replaceChildren(track)}
    const makeLoop=()=>{const loop=document.createElement('span');loop.className='charity-marquee__loop';for(const [i,q] of [...quotes,...quotes].entries()){const copy=document.createElement('span');copy.className='charity-marquee__copy';const text=document.createElement('span');text.className='charity-marquee__segment charity-marquee__segment--'+(i%2?'green':'pink');text.textContent=q.text;copy.append(text);loop.append(copy);const sep=document.createElement('span');sep.className='charity-marquee__separator';sep.setAttribute('aria-hidden','true');loop.append(sep)}return loop};
    track.replaceChildren(makeLoop(),makeLoop());
    marquee.querySelectorAll('.charity-marquee__person,svg.charity-marquee__person').forEach(n=>n.remove());
    const label=quotes.map(q=>q.text).join(' ');marquee.setAttribute('aria-label',label);marquee.dataset.text=label;
    const apply=()=>{
      const first=track.querySelector('.charity-marquee__loop');if(!first)return;
      const gap=Math.max(1,Math.ceil(marquee.clientWidth));marquee.style.setProperty('--ah2038-ticker-gap',gap+'px');
      const width=first.getBoundingClientRect().width;if(!(width>0))return;
      track.style.setProperty('animation-name','ah1602-ticker-compositor','important');
      track.style.setProperty('animation-duration',Math.max(48,width/27).toFixed(3)+'s','important');
      track.style.setProperty('animation-timing-function','linear','important');
      track.style.setProperty('animation-iteration-count','infinite','important');
      track.style.setProperty('will-change','transform','important');
    };
    requestAnimationFrame(()=>requestAnimationFrame(apply));
    if(unwatch){unwatch();unwatch=null}
    if(window.AHResponsive?.watchElement)unwatch=window.AHResponsive.watchElement(marquee,apply);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build,{once:true});else build();
  document.addEventListener('ah:persistent-route-complete',build);
})();

/* Round 2109: button/text decoration is owned by round2109-state-digital-stabilizer.js. */


