import React, { useEffect, useRef } from 'react';

/**
 * CSS 3D Globe — faithful port of Edan Kwan's codepen.
 * Uses the original PerspectiveTransform library inline.
 */

// Original PerspectiveTransform.js (minified, self-contained)
const PT = (function(){
  function B(el,w,h){
    this.element=el;this.style=el.style;
    this.computedStyle=window.getComputedStyle(el);
    this.width=w;this.height=h;
    this.topLeft={x:0,y:0};this.topRight={x:w,y:0};
    this.bottomLeft={x:0,y:h};this.bottomRight={x:w,y:h};
    this._css='';
  }
  var tf='transform';
  var to='transform-origin';
  B.prototype.calc=function(){
    var w=this.width,h=this.height,E=0,D=0;
    var t=this.computedStyle.getPropertyValue(to);
    if(t&&t.indexOf('px')>-1){var p=t.split('px');E=-parseFloat(p[0])||0;D=-parseFloat(p[1])||0;}
    var G=[this.topLeft,this.topRight,this.bottomLeft,this.bottomRight];
    var m=[[0,0,1,0,0,0,0,0],[0,0,1,0,0,0,0,0],[0,0,1,0,0,0,0,0],[0,0,1,0,0,0,0,0],
           [0,0,0,0,0,1,0,0],[0,0,0,0,0,1,0,0],[0,0,0,0,0,1,0,0],[0,0,0,0,0,1,0,0]];
    var iv=[0,0,0,0,0,0,0,0];
    var q=[0,1,2,3,4,5,6,7];
    for(var b=0;b<4;b++){
      m[b][0]=m[b+4][3]=(b&1)?w+E:E;
      m[b][1]=m[b+4][4]=(b>1)?h+D:D;
      m[b][6]=((b&1)?-E-w:-E)*(G[b].x+E);
      m[b][7]=((b>1)?-D-h:-D)*(G[b].x+E);
      m[b+4][6]=((b&1)?-E-w:-E)*(G[b].y+D);
      m[b+4][7]=((b>1)?-D-h:-D)*(G[b].y+D);
      iv[b]=G[b].x+E;iv[b+4]=G[b].y+D;
      m[b][2]=m[b+4][5]=1;
      m[b][3]=m[b][4]=m[b][5]=m[b+4][0]=m[b+4][1]=m[b+4][2]=0;
    }
    var s=[];
    for(var A=0;A<8;A++){
      for(var j=0;j<8;j++)s[j]=m[j][A];
      for(j=0;j<8;j++){var u=m[j],y=j<A?j:A,r=0;for(var z=0;z<y;z++)r+=u[z]*s[z];u[A]=s[j]-=r;}
      var ww=A;for(j=A+1;j<8;j++){if(Math.abs(s[j])>Math.abs(s[ww]))ww=j;}
      if(ww!==A){for(z=0;z<8;z++){var F=m[ww][z];m[ww][z]=m[A][z];m[A][z]=F;}F=q[ww];q[ww]=q[A];q[A]=F;}
      if(m[A][A]!==0)for(j=A+1;j<8;j++)m[j][A]/=m[A][A];
    }
    for(j=0;j<8;j++)q[j]=iv[q[j]];
    for(z=0;z<8;z++)for(j=z+1;j<8;j++)q[j]-=q[z]*m[j][z];
    for(z=7;z>-1;z--){q[z]/=m[z][z];for(j=0;j<z;j++)q[j]-=q[z]*m[j][z];}
    this._css='matrix3d('+q[0].toFixed(9)+','+q[3].toFixed(9)+',0,'+q[6].toFixed(9)+','+q[1].toFixed(9)+','+q[4].toFixed(9)+',0,'+q[7].toFixed(9)+',0,0,1,0,'+q[2].toFixed(9)+','+q[5].toFixed(9)+',0,1)';
  };
  B.prototype.update=function(){this.style[tf]=this._css;};
  B.prototype.hide=function(){this.style[tf]='translate3d(-9999px,0,0)';};
  return B;
})();

/* Expand two projected vertices outward by `off` pixels along their joining line.
   Each segment gets its OWN expanded copies so shared vertices don't clobber each other. */
function expandPair(v1, v2, off) {
  const dx = v2.px - v1.px;
  const dy = v2.py - v1.py;
  const d = dx * dx + dy * dy;
  if (d === 0) return { t1x: v1.px, t1y: v1.py, t2x: v2.px, t2y: v2.py };
  const id = off / Math.sqrt(d);
  return {
    t1x: v1.px - dx * id,
    t1y: v1.py - dy * id,
    t2x: v2.px + dx * id,
    t2y: v2.py + dy * id,
  };
}

export default function Globe3D(){
  const wrapRef=useRef(null);
  const domsRef=useRef(null);
  const haloRef=useRef(null);
  const poleRef=useRef(null);
  const animRef=useRef(null);

  useEffect(()=>{
    const SX=14,SY=12,R=268,PX=2.5;
    const DIFF='https://s3-us-west-2.amazonaws.com/s.cdpn.io/6043/css_globe_diffuse.jpg';
    const HALO='https://s3-us-west-2.amazonaws.com/s.cdpn.io/6043/css_globe_halo.png';
    const BG='https://s3-us-west-2.amazonaws.com/s.cdpn.io/6043/css_globe_bg.jpg';

    if(wrapRef.current) wrapRef.current.style.backgroundImage='url('+BG+')';
    if(haloRef.current) haloRef.current.style.backgroundImage='url('+HALO+')';

    let lng=0;const lat=0;

    // Build vertices
    const verts=[];
    for(let y=0;y<=SY;y++){
      const row=[];
      for(let x=0;x<=SX;x++){
        const u=x/SX, v=0.05+(y/SY)*0.9;
        row.push({
          x:-R*Math.cos(u*Math.PI*2)*Math.sin(v*Math.PI),
          y:-R*Math.cos(v*Math.PI),
          z: R*Math.sin(u*Math.PI*2)*Math.sin(v*Math.PI),
          px:0,py:0
        });
      }
      verts.push(row);
    }

    // Build DOM segments
    const con=domsRef.current;if(!con)return;
    const sw=Math.floor(1600/SX), sh=Math.floor(800/SY);
    const segs=[];

    for(let y=0;y<SY;y++){
      for(let x=0;x<SX;x++){
        const d=document.createElement('div');
        d.style.cssText='position:absolute;width:'+sw+'px;height:'+sh+'px;overflow:hidden;transform-origin:0 0;background-image:url('+DIFF+');background-position:'+(-sw*x)+'px '+(-sh*y)+'px;backface-visibility:hidden;will-change:transform;direction:ltr;';
        const pt=new PT(d,sw,sh);
        con.appendChild(d);
        segs.push({pt,el:d,v1:verts[y][x],v2:verts[y][x+1],v3:verts[y+1][x],v4:verts[y+1][x+1]});
      }
    }

    function rot(v,cY,sY,cX,sX){
      const x0=v.x*cY-v.z*sY;
      let z0=v.z*cY+v.x*sY;
      const y0=v.y*cX-z0*sX;
      z0=z0*cX+v.y*sX;
      const o=1+z0/4000;
      v.px=x0*o; v.py=y0*o;
    }

    function render(){
      lng-=0.15;
      const rX=(lat/180)*Math.PI;
      const rY=(((lng%360)-270)/180)*Math.PI;

      // Rotate all vertices
      const sY=Math.sin(rY),cY=Math.cos(rY),sX=Math.sin(-rX),cX=Math.cos(-rX);
      for(let y=0;y<=SY;y++) for(let x=0;x<=SX;x++) rot(verts[y][x],cY,sY,cX,sX);

      // Calculate and apply transforms in the same frame
      for(const s of segs){
        // Backface culling via cross-product z-component
        const ax = s.v2.px - s.v1.px;
        const ay = s.v2.py - s.v1.py;
        const bx = s.v3.px - s.v1.px;
        const by = s.v3.py - s.v1.py;
        if (ax * by - ay * bx <= 0) {
          s.el.style.visibility = 'hidden';
          continue;
        }
        s.el.style.visibility = 'visible';

        // Expand edges outward — per-segment copies, no shared mutation
        const e1 = expandPair(s.v1, s.v2, PX); // top edge
        const e2 = expandPair(s.v3, s.v4, PX); // bottom edge
        const e3 = expandPair(s.v1, s.v3, PX); // left edge
        const e4 = expandPair(s.v2, s.v4, PX); // right edge

        // Corner positions: average of two edge expansions meeting at that corner
        s.pt.topLeft.x     = (e1.t1x + e3.t1x) * 0.5;
        s.pt.topLeft.y     = (e1.t1y + e3.t1y) * 0.5;
        s.pt.topRight.x    = (e1.t2x + e4.t1x) * 0.5;
        s.pt.topRight.y    = (e1.t2y + e4.t1y) * 0.5;
        s.pt.bottomLeft.x  = (e2.t1x + e3.t2x) * 0.5;
        s.pt.bottomLeft.y  = (e2.t1y + e3.t2y) * 0.5;
        s.pt.bottomRight.x = (e2.t2x + e4.t2x) * 0.5;
        s.pt.bottomRight.y = (e2.t2y + e4.t2y) * 0.5;

        s.pt.calc();
        s.pt.update();
      }

      animRef.current=requestAnimationFrame(render);
    }
    animRef.current=requestAnimationFrame(render);

    return()=>{
      if(animRef.current)cancelAnimationFrame(animRef.current);
      while(con.firstChild)con.removeChild(con.firstChild);
    };
  },[]);

  return(
    <div className="globe-scene" ref={wrapRef}>
      <div className="globe-anchor">
        <div className="globe-pole" ref={poleRef}/>
        <div className="globe-doms" ref={domsRef}/>
        <div className="globe-halo" ref={haloRef}/>
      </div>
    </div>
  );
}
