import fs from 'node:fs'
import vm from 'node:vm'
import assert from 'node:assert/strict'
const html=fs.readFileSync('/Users/yujin/Downloads/lets-sync-balls.html','utf8')
const original=html.match(/<script>([\s\S]*?)<\/script>/)[1]
const snapshot=`()=>balls.map(({x,y,vx,vy,r,ang,spin,fill,hold,hx,hy,seed,label,stuck,cool,s})=>({x,y,vx,vy,r,ang,spin,fill,hold,hx,hy,seed,label,stuck,cool,s}))`
let port=fs.readFileSync('src/pages/Home/balls/balls-engine.js','utf8').replace(/^import .*$/gm,'').replace('export default function startBalls','function startBalls').replace('const resizer=new ResizeObserver',`globalThis.readState=${snapshot};\nconst resizer=new ResizeObserver`)
function harness(source,isPort){
 let now=0,seed=42,id=0,raf=new Map(),timers=new Map(),io,ro
 const context=new Proxy({},{get:(o,k)=>o[k]??(()=>{}) ,set:(o,k,v)=>(o[k]=v,true)})
 function element(){const ev=new Map(),attrs={},classes=new Set(),captured=new Set();return {style:{},width:1530,height:900,clientWidth:1530,clientHeight:900,className:'',textContent:'',getContext:()=>context,getBoundingClientRect:()=>({left:0,top:0,right:1530,bottom:900}),addEventListener(type,fn,opt){if(!ev.has(type))ev.set(type,[]);ev.get(type).push({fn,signal:opt?.signal})},dispatch(type,e={}){this['on'+type]?.(e);for(const l of ev.get(type)||[])if(!l.signal?.aborted)l.fn(e)},setAttribute:(k,v)=>attrs[k]=String(v),getAttribute:k=>attrs[k],classList:{add:k=>classes.add(k),remove:k=>classes.delete(k)},setPointerCapture:k=>captured.add(k),releasePointerCapture:k=>captured.delete(k),hasPointerCapture:k=>captured.has(k)}}
 const cv=element(),section=element(),prompt=element(),headline=element(),hint=element(),pullButton=element(),playButton=element(),doc=element(),win=element()
 const ids={stage:cv,headline,hint,mPull:pullButton,mPlay:playButton}
 Object.assign(doc,{hidden:false,createElement:element,getElementById:id=>ids[id],querySelector:()=>prompt})
 const math=Object.create(Math);math.random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296)
 const sandbox={console,Math:math,AbortController,Image:class {naturalWidth=380;naturalHeight=380;set src(v){this.onload?.()}},document:doc,window:win,innerWidth:1530,innerHeight:900,devicePixelRatio:1,performance:{now:()=>now},addEventListener:win.addEventListener.bind(win),setTimeout:(fn,delay)=>{timers.set(++id,{fn,due:now+delay});return id},clearTimeout:id=>timers.delete(id),requestAnimationFrame:fn=>{raf.set(++id,fn);return id},cancelAnimationFrame:id=>raf.delete(id),ResizeObserver:class {constructor(fn){ro=fn}observe(){}disconnect(){}},IntersectionObserver:class {constructor(fn){io=fn}observe(){io([{isIntersecting:true}])}disconnect(){}},section,cv,prompt,headline,hint,pullButton,playButton}
 for(let i=0;i<10;i++)sandbox['ball'+i]='sprite-'+i
 const c=vm.createContext(sandbox)
 vm.runInContext(source+(isPort?'\nglobalThis.cleanup=startBalls({section,cv,prompt,headline,hint,pullButton,playButton})':`\nglobalThis.readState=${snapshot}`),c)
 return {c,cv,section,headline,hint,pullButton,playButton,frame(){now+=1000/60;const q=[...raf.values()];raf.clear();q.forEach(fn=>fn(now));for(const [key,t]of timers)if(t.due<=now){timers.delete(key);t.fn()}},get state(){return JSON.parse(JSON.stringify(c.readState()))},event(type,x,y){cv.dispatch(type,{clientX:x,clientY:y,pointerId:1,pointerType:'mouse'})},visibility(v){io([{isIntersecting:v}])},resize(w,h){section.clientWidth=w;section.clientHeight=h;ro()},get pending(){return raf.size},get timerCount(){return timers.size}}
}
const a=harness(original,false),b=harness(port,true)
function same(name,frames=0){for(let i=0;i<frames;i++){a.frame();b.frame()}assert.deepEqual(b.state,a.state,name);console.log('PASS',name)}
same('initial five positions, radii, labels and rotation')
same('180 frames of floating physics',180)
for(const h of[a,b])h.event('pointermove',760,480)
same('cursor attraction, sticking and collisions',120)
for(const h of[a,b])h.event('pointermove',1300,200)
same('hard shake detachment and inertia',90)
for(const h of[a,b])h.playButton.dispatch('click')
same('PLAY gravity and floor bounce',180)
for(const h of[a,b]){const p=h.state[0];h.event('pointerdown',p.x,p.y);h.event('pointermove',800,350)}
same('grabbed ball follows drag',10)
for(const h of[a,b])h.event('pointerup',800,350)
same('throw velocity, rotation, wall bounce',180)
for(const h of[a,b])h.pullButton.dispatch('click')
for(let i=0;i<6;i++){for(const h of[a,b]){h.event('pointerdown',600,500);h.event('pointerup',600,500);h.event('pointerdown',600,500);h.event('pointerup',600,500)}same('double-click addition '+(i+1),25)}
assert.equal(b.state.length,10)
assert.equal(b.headline.textContent,'오늘의 연결은 여기까지!')
console.log('PASS ten-ball cap and prompt')
b.visibility(false);assert.equal(b.pending,0);const frozen=b.state;for(let i=0;i<60;i++)b.frame();assert.deepEqual(b.state,frozen)
console.log('PASS offscreen animation suspension')
b.visibility(true);assert.equal(b.pending,1);b.frame();assert.equal(b.pending,1)
console.log('PASS re-entry resumes one animation loop')
b.resize(390,844);b.frame();for(const ball of b.state)for(const key of ['x','y','vx','vy','r'])assert(Number.isFinite(ball[key]))
console.log('PASS responsive coordinates remain finite')
b.c.cleanup();assert.equal(b.pending,0);assert.equal(b.timerCount,0);const cleaned=b.state;b.event('pointerdown',100,100);b.frame();assert.deepEqual(b.state,cleaned)
console.log('PASS cleanup cancels frames, timers and event listeners')
