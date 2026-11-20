/* Latar dinamis. Mode: off | dots (titik jatuh) | light (cahaya mouse) | both */
(()=>{
const cv=$('#bg'),g=cv.getContext('2d'),sel=$('#fxm'),still=matchMedia('(prefers-reduced-motion:reduce)').matches;
let W,H,P=[],raf,mode=localStorage.getItem('bk_fx')||(still?'off':'both'),m={x:-999,y:-999,sx:-999,sy:-999};
const mk=r=>({x:Math.random()*W,y:r?Math.random()*H:-8,r:Math.random()*2.4+.7,v:Math.random()*.6+.25,a:Math.random()*.5+.25,p:Math.random()*6.28});
const glow=()=>getComputedStyle(document.documentElement).getPropertyValue('--glow').trim()||'47,107,79';
function size(){const d=devicePixelRatio||1;W=innerWidth;H=innerHeight;cv.width=W*d;cv.height=H*d;g.setTransform(d,0,0,d,0,0);P=Array.from({length:Math.min(110,W/12|0)},()=>mk(1))}
function frame(){
  g.clearRect(0,0,W,H);const c=glow(),dots=mode=='dots'||mode=='both',lit=mode=='light'||mode=='both';
  m.sx+=(m.x-m.sx)*.12;m.sy+=(m.y-m.sy)*.12;
  if(lit&&m.x>-900){const r=g.createRadialGradient(m.sx,m.sy,0,m.sx,m.sy,300);r.addColorStop(0,`rgba(${c},.28)`);r.addColorStop(.45,`rgba(${c},.10)`);r.addColorStop(1,`rgba(${c},0)`);g.fillStyle=r;g.fillRect(0,0,W,H)}
  if(dots)for(const p of P){p.y+=p.v;p.p+=.015;p.x+=Math.sin(p.p)*.25;if(p.y>H+8)Object.assign(p,mk(0));
    const near=lit?Math.max(0,1-Math.hypot(p.x-m.sx,p.y-m.sy)/220):0,r=p.r*(1+near*1.6);
    g.beginPath();g.fillStyle=`rgba(${c},${Math.min(1,p.a+near*.6)})`;g.shadowColor=`rgba(${c},.9)`;g.shadowBlur=6+near*14;g.arc(p.x,p.y,r,0,6.28);g.fill()}
  g.shadowBlur=0;raf=requestAnimationFrame(frame)}
function set(v){mode=v;localStorage.setItem('bk_fx',v);cancelAnimationFrame(raf);g.clearRect(0,0,W,H);cv.hidden=v=='off';if(v!='off')frame()}
addEventListener('pointermove',e=>{if(m.x<-900){m.sx=e.clientX;m.sy=e.clientY}m.x=e.clientX;m.y=e.clientY});
document.addEventListener('pointerleave',()=>m.x=-999);
addEventListener('resize',size);sel.value=mode;sel.onchange=()=>set(sel.value);size();set(mode);
})();
