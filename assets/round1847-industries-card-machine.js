/* Round 1997 — all Industries image shutters use 1.5s travel and reliable automatic card scrolling. */
(()=>{
'use strict';
if(window.__AH1846IndustriesCardMachine)return;window.__AH1846IndustriesCardMachine=1;
const INDUSTRIES=[["Professional Services", [["Information Access", "Bring scattered information into one reliable, searchable place."], ["Client Follow-Up", "Keep commitments and client communication moving."], ["Document Workflows", "Reduce repetitive document handling and manual re-entry."], ["Administrative Automation", "Route routine work toward the right next action."], ["Knowledge Continuity", "Keep procedures and context available to the team."], ["Client Intake Automation", "Capture new client information once and route it consistently."], ["Proposal Generation", "Assemble accurate proposals faster from approved reusable content."], ["Contract Management", "Track agreements, revisions, approvals, and renewal dates clearly."], ["Compliance Tracking", "Organize recurring requirements, evidence, deadlines, and follow-up."], ["Executive Reporting", "Turn operating information into concise leadership-ready updates."]]], ["Construction & Trades", [["Work Orders", "Organize requests, assignments, changes, and completion updates."], ["Field Communication", "Keep office and field information synchronized."], ["Site Documentation", "Capture details once and reuse them consistently."], ["Vendor Coordination", "Track materials, vendors, commitments, and next actions."], ["Schedule Visibility", "Make timing, ownership, and priorities easier to see."], ["Safety Documentation", "Organize inspections, training records, incidents, and corrective actions."], ["Equipment Scheduling", "Coordinate equipment availability, assignments, service, and maintenance."], ["Change Order Management", "Track scope changes, approvals, costs, and schedule impacts."], ["Inspection Tracking", "Schedule inspections and capture results, issues, and follow-up."], ["Crew Coordination", "Keep assignments, availability, locations, and priorities aligned."]]], ["Logistics & Supply Chain", [["Dispatching", "Coordinate assignments with less manual back-and-forth."], ["Route Coordination", "Improve movement visibility and respond faster to exceptions."], ["Inventory Visibility", "Keep critical availability information current and findable."], ["Exception Handling", "Surface delays, missing information, and follow-up needs earlier."], ["Status Synchronization", "Keep teams and customers aligned as conditions change."], ["Shipment Visibility", "Consolidate shipment milestones, delays, exceptions, and customer updates."], ["Warehouse Operations", "Coordinate receiving, storage, picking, staging, and outbound work."], ["Demand Forecasting", "Use operating patterns to anticipate volume and capacity needs."], ["Supplier Management", "Track supplier commitments, performance, changes, and open issues."], ["Delivery Performance", "Measure completion, timeliness, exceptions, and service reliability."]]], ["Retail & Hospitality", [["Customer Follow-Up", "Trigger timely responses without relying on memory alone."], ["Scheduling", "Coordinate coverage, changes, and recurring responsibilities."], ["Inventory Updates", "Reduce duplicate entry and keep information consistent."], ["Service Consistency", "Support repeatable experiences during busy periods."], ["Guest Communication", "Keep confirmations, requests, and service updates organized."], ["Reservation Management", "Coordinate bookings, changes, confirmations, and special requests."], ["Customer Loyalty", "Organize preferences, follow-up, recognition, and retention activity."], ["Staffing Optimization", "Align staffing coverage with demand, availability, and service needs."], ["Point-of-Sale Reporting", "Turn transaction data into clear operating and performance summaries."], ["Service Recovery", "Route problems quickly and track resolution and customer follow-up."]]]];
const cardFont=document.createElement('style');cardFont.textContent='@font-face{font-family:Rajdhani;src:url("assets/fonts/rajdhani-600-round1877.woff2") format("woff2");font-style:normal;font-weight:600;font-display:swap}';document.head.appendChild(cardFont);
function enforceCardText(){for(const p of document.querySelectorAll('.ah1846-info-detail'))for(const e of [p,...p.querySelectorAll('*')]){e.style.setProperty('font-family','Rajdhani, sans-serif','important');e.style.setProperty('color','#eaf4f2','important');e.style.setProperty('-webkit-text-fill-color','#eaf4f2','important')}for(const h of document.querySelectorAll('.ah1846-info-title')){const c=h.closest('.ah1846-info-card'),i=Array.from(c.parentElement.children).indexOf(c),color=i%2?'#8fffd7':'#ff77bd';for(const e of [h,...h.querySelectorAll('*')]){e.style.setProperty('color',color,'important');e.style.setProperty('-webkit-text-fill-color',color,'important')}}}
new MutationObserver(enforceCardText).observe(document.documentElement,{childList:true,subtree:true});
const states=new WeakMap();let activeCard=null;
const reduced=()=>matchMedia('(prefers-reduced-motion:reduce)').matches;
const cards=()=>Array.from(document.querySelectorAll('.who-help-route-card, body[data-ah-mobile-surface="industries"] .route-card')).filter(c=>c.querySelector('[data-ah1846-industry]'));
const indexOf=card=>Number(card.querySelector('[data-ah1846-industry]')?.dataset.ah1846Industry||0);
function esc(v){return String(v).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function ensureDeck(card){
  const index=indexOf(card),stage=card.querySelector('.ah1846-industry-stage'),deck=card.querySelector('.ah1846-card-deck'),track=card.querySelector('.ah1846-card-track');
  if(!stage||!deck||!track)return null;
  let state=states.get(card);if(state)return state;
  const [title,items]=INDUSTRIES[index]||INDUSTRIES[0];
  const one=items.map(([h,d],i)=>`<article class="ah1846-info-card"><div class="ah1846-info-screen"><h3 class="ah1846-info-title" style="color:${i%2?'#8fffd7':'#ff77bd'}!important;-webkit-text-fill-color:${i%2?'#8fffd7':'#ff77bd'}!important">${esc(h)}</h3><p class="ah1846-info-detail" style="font-family:Rajdhani, sans-serif!important;color:#eaf4f2!important;-webkit-text-fill-color:#eaf4f2!important">${esc(d)}</p></div></article>`).join('');
  track.innerHTML=`<span class="ah1846-card-copy">${one}</span><span class="ah1846-card-copy" aria-hidden="true">${one}</span>`;
  state={card,stage,deck,track,index,title,offset:0,cycle:0,drag:false,startY:0,startOffset:0,pauseUntil:0,last:performance.now(),raf:0};states.set(card,state);
  const measure=()=>{const first=track.querySelector('.ah1846-card-copy');state.cycle=Math.max(1,first?.offsetHeight||1)};
  requestAnimationFrame(()=>requestAnimationFrame(measure));
  const pause=ms=>{state.pauseUntil=performance.now()+ms};
  deck.addEventListener('pointerdown',e=>{state.drag=true;state.startY=e.clientY;state.startOffset=state.offset;pause(1800);try{deck.setPointerCapture(e.pointerId)}catch(_){}});
  deck.addEventListener('pointermove',e=>{if(!state.drag)return;state.offset=state.startOffset-(e.clientY-state.startY);normalize(state);render(state)});
  const end=e=>{state.drag=false;pause(700);try{deck.releasePointerCapture(e.pointerId)}catch(_){}};
  deck.addEventListener('pointerup',end);deck.addEventListener('pointercancel',end);
  deck.addEventListener('wheel',e=>{e.preventDefault();state.offset+=e.deltaY;normalize(state);render(state);pause(800)},{passive:false});
  deck.addEventListener('keydown',e=>{const step={ArrowDown:48,ArrowUp:-48,PageDown:deck.clientHeight*.8,PageUp:-deck.clientHeight*.8}[e.key];if(step===undefined)return;e.preventDefault();state.offset+=step;normalize(state);render(state);pause(1800)});
  return state;
}
function normalize(s){if(!s.cycle)return;while(s.offset>=s.cycle)s.offset-=s.cycle;while(s.offset<0)s.offset+=s.cycle}
function render(s){s.track.style.transform=`translate3d(0,${(-s.offset).toFixed(2)}px,0)`}
function animate(s,now){
  if(!s.card.isConnected)return;
  const dt=Math.min(.05,(now-s.last)/1000);s.last=now;
  if(s.card.classList.contains('ah1846-open')&&!s.drag&&now>=s.pauseUntil&&!reduced()){
    /* Slow, continuous motion: roughly one card every 8–11 seconds. */
    s.offset+=dt*(innerWidth<=900?11.0:14.0);normalize(s);render(s);
  }
  s.raf=requestAnimationFrame(t=>animate(s,t));
}
function startLoop(s){if(s.raf)return;s.last=performance.now();s.raf=requestAnimationFrame(t=>animate(s,t))}
function setButton(card,open){const b=card.querySelector('[data-ah1846-industry]');if(!b)return;b.setAttribute('aria-expanded',String(open));const title=INDUSTRIES[indexOf(card)]?.[0]||'Industry';b.setAttribute('aria-label',`${open?'Close':'Open'} ${title} automation cards`)}
function closeCard(card,fast=false){
  if(!card)return Promise.resolve();
  clearTimeout(Number(card.dataset.ah1846OpenTimer)||0);clearTimeout(Number(card.dataset.ah1846ReadyTimer)||0);clearTimeout(Number(card.dataset.ah1846ReturnTimer)||0);
  const s=states.get(card);if(s){s.pauseUntil=Infinity;}
  card.classList.remove('ah1846-opening');card.classList.add('ah1846-closing');setButton(card,false);
  /* Keep the deck underneath the shutter throughout its return. */
  const returnDelay=10;
  return new Promise(resolve=>{
    const rt=setTimeout(()=>{
      card.classList.remove('ah1846-image-away');
      const finish=reduced()?20:1520;
      setTimeout(()=>{
        card.classList.remove('ah1846-closing','ah1846-cards-ready','ah1846-open');
        card.querySelector('.ah1846-industry-stage')?.setAttribute('aria-hidden','true');
        if(activeCard===card)activeCard=null;
        if(s){s.offset=0;s.pauseUntil=0;render(s);}
        resolve();
      },finish);
    },returnDelay);
    card.dataset.ah1846ReturnTimer=String(rt);
  });
}
function openCard(card){
  const s=ensureDeck(card);if(!s)return;startLoop(s);
  s.offset=0;s.pauseUntil=Infinity;render(s);
  card.classList.remove('ah1846-closing','ah1846-open');card.classList.add('ah1846-opening','ah1846-image-away','ah1846-cards-ready');setButton(card,true);activeCard=card;
  s.stage.setAttribute('aria-hidden','false');
  /* Cards are already in place as the shutter starts its one-second rise. */
  const readyDelay=0,finishDelay=reduced()?20:1500;
  const ready=setTimeout(()=>{if(activeCard!==card)return;card.classList.add('ah1846-cards-ready');s.deck.focus({preventScroll:true})},readyDelay);
  const finish=setTimeout(()=>{if(activeCard!==card)return;card.classList.remove('ah1846-opening');card.classList.add('ah1846-open');s.pauseUntil=performance.now()+220},finishDelay);
  card.dataset.ah1846ReadyTimer=String(ready);card.dataset.ah1846OpenTimer=String(finish);
}
async function toggle(card){
  if(activeCard===card){await closeCard(card);return}
  const previous=activeCard;if(previous)await closeCard(previous,true);openCard(card);
}
function intercept(event){
  if(!(event.target instanceof Element))return;
  const button=event.target.closest('button[data-ah1846-industry]');if(!button)return;
  const card=button.closest('.who-help-route-card,.route-card');if(!card)return;
  event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();toggle(card);
}
window.addEventListener('click',intercept,true);
window.addEventListener('keydown',e=>{if(!(e.target instanceof Element))return;const b=e.target.closest('button[data-ah1846-industry]');if(!b||!['Enter',' ','Spacebar'].includes(e.key))return;e.preventDefault();e.stopImmediatePropagation();b.click()},true);
function init(){cards().forEach(c=>{const s=ensureDeck(c);if(s)render(s);setButton(c,false);c.querySelector('.ah1846-industry-stage')?.setAttribute('aria-hidden','true')})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

(()=>{function size(){if(!document.body.matches('[data-ah-mobile-surface="industries"]'))return;for(const e of document.querySelectorAll('.route-card .route-media')){e.style.setProperty('height','300px','important');e.style.setProperty('min-height','300px','important');e.style.setProperty('max-height','300px','important');e.style.setProperty('aspect-ratio','auto','important');e.style.setProperty('border-radius','0','important')}}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',size);else size();window.addEventListener('resize',size)})();


(()=>{function rims(){for(const img of document.querySelectorAll('.ah1846-image-shutter img')){for(const [k,v] of Object.entries({position:'absolute',inset:'0',width:'100%',height:'100%','min-width':'100%','min-height':'100%','max-width':'none','max-height':'none',margin:'0',padding:'0',transform:'none','object-fit':'cover'})){img.style.setProperty(k,v,'important');if(img.parentElement&&!img.parentElement.matches('.ah1846-image-shutter'))img.parentElement.style.setProperty(k,v,'important');}}const s=getComputedStyle(document.body,'::after');const widths=[s.borderTopWidth,s.borderRightWidth,s.borderBottomWidth,s.borderLeftWidth];const border=widths.some(x=>parseFloat(x)>0)?widths.join(' '):'3px';for(const e of document.querySelectorAll('.who-help-route-card .premium-route-card__image-button,.route-card:has([data-ah1846-industry]) .route-media')){e.style.setProperty('border-style','solid','important');e.style.setProperty('border-color','#d5ac46','important');e.style.setProperty('border-width',border,'important');e.style.setProperty('padding','0','important');e.style.setProperty('overflow','hidden','important');}}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',rims);else rims();addEventListener('resize',rims)})();
