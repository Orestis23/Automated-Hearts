/* Text drawn into model textures stays crisp; decorative canvas lighting is unchanged. */
(()=>{'use strict';
  for(const type of [window.CanvasRenderingContext2D,window.OffscreenCanvasRenderingContext2D]){
    if(!type)continue;
    for(const method of ['fillText','strokeText']){
      const draw=type.prototype[method];
      if(!draw||draw.ah1986NoGlow)continue;
      function crispText(...args){
        const blur=this.shadowBlur, color=this.shadowColor, x=this.shadowOffsetX, y=this.shadowOffsetY, filter=this.filter;
        this.shadowBlur=0;this.shadowColor='transparent';this.shadowOffsetX=0;this.shadowOffsetY=0;
        if(typeof filter==='string')this.filter=filter.replace(/(?:drop-shadow|blur)\((?:[^()]|\([^()]*\))*\)/g,'').trim()||'none';
        try{return draw.apply(this,args)}
        finally{this.shadowBlur=blur;this.shadowColor=color;this.shadowOffsetX=x;this.shadowOffsetY=y;if(typeof filter==='string')this.filter=filter;}
      }
      crispText.ah1986NoGlow=true;type.prototype[method]=crispText;
    }
  }
})();
