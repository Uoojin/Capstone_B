/* eslint-disable no-unused-vars -- Original HTML physics, including its dormant bond helpers. */
import { ballTypography, drawBallTypography } from './ball-typography.js'

// Interaction ported from lets-sync-balls (1).html; retain the existing section and ball artwork.
export default function startBalls({section,cv,pullButton,playButton}){

const ctx=cv.getContext('2d');
const events=new AbortController();
let animationFrame=0,active=false;
const capturedPointers=new Set();
function releaseCaptures(){for(const id of capturedPointers){if(cv.hasPointerCapture(id))cv.releasePointerCapture(id)}capturedPointers.clear()}
function listen(el,type,fn){el.addEventListener(type,fn,{signal:events.signal})}
let W=0,H=0,DPR=1;
const PINK='#FD00A0',BG='#FAFAFA',BALL='#FFFFFF',HAIR='#BDBDBD',INK='#141414',LABEL='#5c5c5c',START=5;
const LABELS=['Right Thumb','Right Index','Right Middle','Left Ring','Left Pinky','Left Thumb','Right Ring','Left Index','Left Middle','Right Pinky'];
// Preserve the original viewport-sized balls inside the new inset container.
const R=()=>Math.max(31,Math.min(52,Math.min(window.innerWidth,window.innerHeight)*0.065));
const topBar=section.querySelector('.home-balls-top');
let topInset=80;
const TOP=()=>topInset;
let balls=[],target=null,mode='play',grab=null,magnet=false,contacts=new Set();

function resize(){
  const oldW=W,oldH=H;
  DPR=Math.min(2,window.devicePixelRatio||1);W=section.clientWidth;H=section.clientHeight;
  topInset=Math.max(W<=520?120:80,topBar?topBar.getBoundingClientRect().bottom-section.getBoundingClientRect().top+24:0);
  cv.width=W*DPR;cv.height=H*DPR;ctx.setTransform(DPR,0,0,DPR,0,0);
  balls.forEach(b=>{b.r=R();if(oldW&&oldH){b.x*=W/oldW;b.hx*=W/oldW;b.y*=H/oldH;b.hy*=H/oldH}
    b.x=Math.max(b.r+8,Math.min(W-b.r-8,b.x));b.y=Math.max(b.r+TOP(),Math.min(H-b.r-8,b.y))});
  target=null;grab=null;rope=null;lastTap=null;releaseCaptures();draw();
}

function makeBall(i,x,y){return{id:i,x,y,vx:0,vy:0,r:R(),ang:0,spin:0,fill:0,hold:0,hx:x,hy:y,seed:Math.random()*100,typography:ballTypography[i%ballTypography.length],label:LABELS[i%LABELS.length]}}
const MAX=10;let rope=null,lastTap=null,bonds=[],thread=null;
function addBall(x,y){
  if(balls.length>=MAX)return;
  const nb=makeBall(balls.length,x,y);nb.s=0;balls.push(nb);
}
function setMode(m){releaseCaptures();mode=m;grab=null;rope=null;magnet=false;thread=null;bonds=[];lastTap=null;cv.className='';
  balls.forEach(b=>{b.hx=b.x;b.hy=b.y;b.stuck=false;b.cool=0});
  // internal 'play' = follow the cursor (shown as Pull); internal 'pull' = grab and throw (shown as Play)
  pullButton.setAttribute('aria-pressed',m==='play');
  playButton.setAttribute('aria-pressed',m==='pull');
}
listen(pullButton,'click',()=>setMode('play'));
listen(playButton,'click',()=>setMode('pull'));

function pt(e){const r=cv.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}
function ballAt(p){let best=null,bd=1e9;for(const b of balls){const d=Math.hypot(b.x-p.x,b.y-p.y);if(d<b.r*1.15&&d<bd){bd=d;best=b}}return best}
listen(cv,'pointermove',e=>{if(!active)return;const p=pt(e);
  if(target){target.px=target.x;target.py=target.y;target.x=p.x;target.y=p.y}else target={x:p.x,y:p.y,px:p.x,py:p.y};
  if(!grab&&!rope)cv.className=ballAt(p)?'over':''});
listen(cv,'pointerdown',e=>{if(!active)return;cv.setPointerCapture(e.pointerId);capturedPointers.add(e.pointerId);const p=pt(e);target={x:p.x,y:p.y,px:p.x,py:p.y};
  const hit=ballAt(p);
  // PULL holds the selected ball on the reference's short elastic rope.
  if(mode==='play'&&hit){rope={b:hit};cv.className='grabbing';lastTap=null;return}
  const b=mode==='pull'?hit:null;
  if(b){grab={b,ox:b.x-p.x,oy:b.y-p.y};cv.className='grabbing';lastTap=null;return}
  // double-click (or double-tap) adds a ball
  const t=performance.now();
  if(lastTap&&t-lastTap.t<350&&Math.hypot(p.x-lastTap.x,p.y-lastTap.y)<30){addBall(p.x,p.y);lastTap=null}else lastTap={t,x:p.x,y:p.y}});
function release(e){
  rope=null;
  capturedPointers.delete(e.pointerId);if(cv.hasPointerCapture(e.pointerId))cv.releasePointerCapture(e.pointerId);
  if(thread&&target){const to=ballAt(target);
    if(to&&to!==thread.from&&!bonds.some(([a,c])=>(a===to&&c===thread.from)||(a===thread.from&&c===to)))bonds.push([thread.from,to]);
    thread=null}
  if(grab&&target){const b=grab.b;b.vx=(target.x-target.px)*1.1;b.vy=(target.y-target.py)*1.1;grab=null}
  if(magnet&&target){for(const b of balls){const dx=b.x-target.x,dy=b.y-target.y,d=Math.hypot(dx,dy)||1;b.vx+=dx/d*3.2;b.vy+=dy/d*3.2}magnet=false}
  cv.className='';if(e.pointerType!=='mouse')target=null}
listen(cv,'pointerup',release);listen(cv,'pointercancel',release);
listen(cv,'pointerleave',e=>{if(e.pointerType==='mouse'&&!grab&&!rope&&!magnet)target=null});

resize();
balls=Array.from({length:START},(_,i)=>{const a=i/START*Math.PI*2-Math.PI/2;return makeBall(i,W/2+Math.cos(a)*R()*3,H*.6+Math.sin(a)*R()*3)});
setMode('play');

// Pull: the balls are tied into a ring of elastic threads, so pulling one drags the rest
// Pull: drag a thread from one ball to another; tied balls ease toward each other and stay pink
const linked=b=>bonds.some(([a,c])=>a===b||c===b);


function step(){
  const n=balls.length,now=performance.now(),top=TOP();
  balls.forEach((b,i)=>{
    if(grab&&grab.b===b&&target){const nx=target.x+grab.ox,ny=target.y+grab.oy;b.vx=nx-b.x;b.vy=ny-b.y;b.x=nx;b.y=ny}
    else if(mode==='pull'){
      // the first grab mode: gravity, bounce off the floor and walls
      b.vy+=.35;b.vx*=.995;b.vy*=.995;b.x+=b.vx;b.y+=b.vy;
      if(b.y>H-b.r-8){b.y=H-b.r-8;b.vy=-Math.abs(b.vy)*.68;b.vx*=.97}
    }else{
      // Reference PULL: a heavy ball trails a short rope and retains momentum on release.
      if(rope&&rope.b===b&&target){const dx=target.x-b.x,dy=target.y-b.y,d=Math.hypot(dx,dy)||1,L=ropeLen(b);
        if(d>L){const f=(d-L)*.045;b.vx+=dx/d*f;b.vy+=dy/d*f}
        b.vx*=.965;b.vy*=.965}
      else{b.vx*=.975;b.vy*=.975}
      b.x+=b.vx;b.y+=b.vy;
    }
    if(b.x<b.r+8){b.x=b.r+8;b.vx=Math.abs(b.vx)*.8}
    if(b.x>W-b.r-8){b.x=W-b.r-8;b.vx=-Math.abs(b.vx)*.8}
    if(b.y<b.r+top){b.y=b.r+top;b.vy=Math.abs(b.vy)*.8}
    if(b.y>H-b.r-8){b.y=H-b.r-8;b.vy=-Math.abs(b.vy)*.8}
    b.spin+=(-b.ang)*.02;b.spin*=.88;b.ang+=b.spin;
    if(b.hold>0)b.hold--;
  });
  if(mode==='play')for(const[A,B]of bonds){const dx=B.x-A.x,dy=B.y-A.y,d=Math.hypot(dx,dy)||1,rest=(A.r+B.r)*1.5,f=(d-rest)*.006;
    A.vx+=dx/d*f;A.vy+=dy/d*f;B.vx-=dx/d*f;B.vy-=dy/d*f}
  for(let a=0;a<n;a++)for(let c=a+1;c<n;c++){const A=balls[a],B=balls[c];
    const dx=B.x-A.x,dy=B.y-A.y,d=Math.hypot(dx,dy)||.01,m=A.r+B.r;
    if(d<m*1.01){A.hold=B.hold=50}
    if(d<m){const nx=dx/d,ny=dy/d,o=(m-d)/2,ag=grab&&grab.b===A,bg=grab&&grab.b===B;
      if(!ag){A.x-=nx*o*(bg?2:1);A.y-=ny*o*(bg?2:1)}if(!bg){B.x+=nx*o*(ag?2:1);B.y+=ny*o*(ag?2:1)}
      const rv=(B.vx-A.vx)*nx+(B.vy-A.vy)*ny;if(rv<0){const j=-rv*.92,ar=rope&&rope.b===A,br=rope&&rope.b===B,wa=ar?.35:br?1.65:1,wb=br?.35:ar?1.65:1;
        if(!ag){A.vx-=nx*j*wa;A.vy-=ny*j*wa}if(!bg){B.vx+=nx*j*wb;B.vy+=ny*j*wb}}
      const tv=Math.max(-6,Math.min(6,(B.vx-A.vx)*-ny+(B.vy-A.vy)*nx));A.spin+=tv*.004;B.spin-=tv*.004}}
  // Collision separation can push a ball past a wall; keep the entire ball in this section.
  for(const b of balls){b.x=Math.max(b.r+8,Math.min(W-b.r-8,b.x));b.y=Math.max(b.r+top,Math.min(H-b.r-8,b.y))}
  for(const b of balls){const goal=(b.hold>0||linked(b))?1:0;b.fill+=(goal-b.fill)*.3;if(Math.abs(goal-b.fill)<.01)b.fill=goal}
}

let lastAnchor=null;
function anchor(){if(target)lastAnchor={x:target.x,y:target.y};return lastAnchor||{x:W/2,y:H*.42}}
function ropeLen(b){return b.r*1.7}
function mix(t){const g=[0xBD,0xBD,0xBD],p=[0xFD,0x00,0xA0];return`rgb(${g.map((v,i)=>Math.round(v+(p[i]-v)*t)).join(',')})`}
function draw(){
  ctx.fillStyle=BG;ctx.fillRect(0,0,W,H);ctx.lineCap='round';
  if(mode==='pull'){
    if(target){ctx.strokeStyle=HAIR;ctx.lineWidth=1;ctx.beginPath();
      for(const b of balls){ctx.moveTo(target.x,target.y);ctx.lineTo(b.x,b.y)}ctx.stroke();ctx.globalAlpha=1}
  }else{
    // faint threads from the cursor, solid pink for made connections, dashed while pulling one out
    // each thread shows its tension: grey when slack, deeper pink and thicker the harder it pulls
    if(target&&!rope){ctx.strokeStyle=HAIR;ctx.lineWidth=1;ctx.beginPath();for(const b of balls){ctx.moveTo(target.x,target.y);ctx.lineTo(b.x,b.y)}ctx.stroke()}
    if(rope&&target){const b=rope.b,d=Math.hypot(b.x-target.x,b.y-target.y),t=Math.max(.35,Math.min(1,.35+(d-ropeLen(b))/(b.r*3)));
      ctx.strokeStyle=mix(t);ctx.lineWidth=1.2+t*1.8;ctx.beginPath();ctx.moveTo(target.x,target.y);ctx.lineTo(b.x,b.y);ctx.stroke()}
    if(target){ctx.fillStyle=INK;ctx.beginPath();ctx.arc(target.x,target.y,3,0,7);ctx.fill()}
  }
  if(target&&mode==='pull'){ctx.fillStyle=INK;ctx.beginPath();ctx.arc(target.x,target.y,3,0,7);ctx.fill()}
  const hovered=target?ballAt(target):null;
  for(const b of balls){
    if(b.s===undefined)b.s=1;b.s+=(1-b.s)*.2;const r=Math.max(1,b.r*b.s);
    // Retain the existing two solid ball designs for hover, handling and contact.
    const interacting=hovered===b||(grab&&grab.b===b)||(rope&&rope.b===b)||b.hold>0||linked(b);
    ctx.save();ctx.translate(b.x,b.y);
    ctx.fillStyle=interacting?PINK:BALL;ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fill();
    ctx.save();ctx.beginPath();ctx.arc(0,0,Math.max(0,r-(interacting?0:1)),0,Math.PI*2);ctx.clip();
    ctx.rotate(b.ang);
    drawBallTypography(ctx,b.typography,r,interacting?BALL:PINK);
    ctx.restore();
    if(!interacting){ctx.strokeStyle=PINK;ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,Math.max(0,r-1),0,Math.PI*2);ctx.stroke()}
    ctx.restore();
  }
  ctx.font='10px "JetBrains Mono", ui-monospace, monospace';ctx.fillStyle=LABEL;ctx.textBaseline='middle';
  for(const b of balls)ctx.fillText('['+b.label+']',b.x+b.r+8,b.y-b.r*.55);
}
function loop(){if(!active)return;step();draw();animationFrame=requestAnimationFrame(loop)}
const resizer=new ResizeObserver(resize);resizer.observe(section);if(topBar)resizer.observe(topBar);
const visibility=new IntersectionObserver(([entry])=>{
  const next=entry.isIntersecting&&!document.hidden;
  if(next===active)return;active=next;
  if(active){loop()}else{cancelAnimationFrame(animationFrame);releaseCaptures();target=null;grab=null;rope=null;magnet=false;lastTap=null;cv.className='';}
});
visibility.observe(section);
listen(document,'visibilitychange',()=>{
  if(document.hidden){active=false;cancelAnimationFrame(animationFrame);releaseCaptures();target=null;grab=null;rope=null;magnet=false;lastTap=null;cv.className='';}
  else{const r=section.getBoundingClientRect();if(r.bottom>0&&r.top<window.innerHeight&&!active){active=true;loop()}}
});
return ()=>{active=false;releaseCaptures();events.abort();resizer.disconnect();visibility.disconnect();cancelAnimationFrame(animationFrame)};

}
