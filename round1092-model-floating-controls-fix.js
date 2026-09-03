(()=>{
  'use strict';
  if(window.__ahRound1092FloatingControls)return;
  window.__ahRound1092FloatingControls=1;

  const important=(el,name,value)=>el&&el.style.setProperty(name,value,'important');

  function styleReturn(stage){
    if(!stage)return;
    const button=stage.querySelector(':scope > button.learning-stage-return');
    if(!button)return;
    const mobile=matchMedia('(max-width:760px)').matches;
    const top=mobile?'12px':'22px';
    const right=mobile?'14px':'28px';
    const height=mobile?'40px':'44px';
    const maxWidth=mobile?'68vw':'min(46vw,360px)';
    const fontSize=mobile?'11px':'clamp(13px,1.05vw,17px)';
    const props={
      position:'absolute',zIndex:'2147483600',top,right,bottom:'auto',left:'auto',
      display:'inline-flex',visibility:'visible',opacity:'1',alignItems:'center',justifyContent:'center',
      alignSelf:'auto',justifySelf:'auto',boxSizing:'border-box',width:'max-content',minWidth:'0',maxWidth,
      height,minHeight:height,maxHeight:height,margin:'0',padding:mobile?'7px 10px':'8px 14px',
      transform:'none',webkitTransform:'none',translate:'none',flex:'0 0 auto',writingMode:'horizontal-tb',
      whiteSpace:'nowrap',overflow:'hidden',textAlign:'center',textOrientation:'mixed',pointerEvents:'auto'
    };
    for(const [k,v] of Object.entries(props)) important(button,k.replace(/[A-Z]/g,m=>'-'+m.toLowerCase()),v);
    important(button,'font-size',fontSize);
  }

  function styleInstructions(stage){
    if(!stage)return;
    const box=stage.querySelector(':scope > .r1091-model-instructions');
    if(!box)return;
    const mobile=matchMedia('(max-width:760px)').matches;
    const props={
      position:'absolute',zIndex:'2147483500',top:'25%',left:mobile?'12px':'26px',right:'auto',bottom:'auto',
      display:'flex',flexDirection:'column',alignItems:'flex-end',justifyContent:'center',gap:mobile?'5px':'7px',
      width:'max-content',minWidth:'0',maxWidth:mobile?'48vw':'min(28vw,290px)',height:'auto',minHeight:'0',maxHeight:'none',
      margin:'0',padding:mobile?'8px 9px 8px 6px':'10px 13px 10px 10px',transform:'translateY(-50%)',
      webkitTransform:'translateY(-50%)',border:'0',borderRight:'1px solid rgba(143,255,215,.72)',
      background:'linear-gradient(270deg,rgba(3,12,22,.52),rgba(3,12,22,.12) 84%,transparent)',
      textAlign:'right',pointerEvents:'none',userSelect:'none',fontSize:mobile?'10px':'clamp(12px,.92vw,15px)'
    };
    for(const [k,v] of Object.entries(props)) important(box,k.replace(/[A-Z]/g,m=>'-'+m.toLowerCase()),v);
    [...box.children].forEach((span,i)=>{
      important(span,'display','block');
      important(span,'width','100%');
      important(span,'text-align','right');
      important(span,'white-space',mobile?'normal':'nowrap');
      const mint=i%2===0;
      important(span,'color',mint?'#8fffd7':'#ff2daa');
      important(span,'-webkit-text-fill-color',mint?'#8fffd7':'#ff2daa');
      important(span,'text-shadow',mint?'0 0 7px rgba(143,255,215,.34)':'0 0 7px rgba(255,45,170,.34)');
    });
  }

  function apply(){
    styleReturn(document.getElementById('learning-model-stage'));
    styleReturn(document.getElementById('who-help-model-stage'));
    styleInstructions(document.getElementById('learning-model-stage'));
    styleInstructions(document.getElementById('who-help-model-stage'));
  }

  let raf=0;
  const queue=()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(apply)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
  addEventListener('resize',queue,{passive:true});
  addEventListener('pageshow',apply,{passive:true});
  document.addEventListener('click',queue,true);
  new MutationObserver(queue).observe(document.body||document.documentElement,{attributes:true,subtree:false,attributeFilter:['class']});
})();
