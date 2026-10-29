const {chromium,webkit}=require('/Users/yujin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict'),{execFileSync}=require('child_process'); const gitFile=p=>execFileSync('git',['show','73651e0:src/components/TypeInteraction/'+p],{encoding:'utf8'})
const base='http://127.0.0.1:5180/Capstone_B'
const width=Number(process.argv[2]||1440),height=Number(process.argv[3]||900),viewport={width,height}
const only=process.argv[4],backends=only==='chrome'?{chrome:chromium}:only==='webkit'?{webkit}:{chrome:chromium,webkit}
const files=fs.readdirSync(path.join(process.cwd(),'src/assets/type'),{recursive:true}).filter(f=>f.endsWith('.svg'))
;(async()=>{for(const [name,type] of Object.entries(backends)){
 const tag=`${name}-${width}x${height}`
 const browser=await type.launch({headless:true,...(name==='chrome'?{channel:'chrome'}:{})})
 try {
 const page=await browser.newPage({viewport}),errors=[]
 page.on('pageerror',e=>errors.push(e.message))
 await page.route('**/__hero_test',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><html><body></body></html>'}))
 await page.route('**/type-engine.js',async r=>{const response=await r.fetch();await r.fulfill({response,body:(await response.text()).replace('var resizeTimer = null;','window.readHero=()=>({nodes,blobs,camera,syncEvent,draggingNode,draggingBlob,particles,syncPairImages,getSyncTypographyImage,letterImages,LETTER_VISUAL_ANGLES,t:(performance.now()-start)/1000}); var resizeTimer = null;')})})
 await page.goto(base+'/__hero_test')
 await page.evaluate(async({base,files,viewport})=>{
  document.body.style.margin='0'
  const globalStyle=document.createElement('style');globalStyle.textContent=(await import(base+'/src/components/TypeInteraction/TypeInteraction.css?inline')).default;document.head.append(globalStyle)
  const host=document.createElement('div');host.className='type-interaction';host.style.cssText='position:fixed;inset:0';document.body.append(host)
  const root=host.attachShadow({mode:'open'}),style=document.createElement('style');style.textContent=(await import(base+'/src/components/TypeInteraction/type-scene.css?inline')).default
  const scene=document.createElement('div');scene.className='type-scene';scene.innerHTML='<div class="stage-wrap"><canvas id="scene"></canvas></div><div class="vignette"></div>';root.append(style,scene)
  const canvas=root.getElementById('scene'),{default:start}=await import(base+'/src/components/TypeInteraction/type-engine.js')
  window.stopEngine=start({host,canvas,placementSeed:.42,assetMap:Object.fromEntries(files.map(f=>[f,base+'/src/assets/type/'+f]))})
 },{base,files,viewport})
 await page.waitForTimeout(700)
 const direct=await page.evaluate(async()=>{
  const s=readHero(),team=s.blobs[2],c=document.querySelector('.type-interaction').shadowRoot.querySelector('#scene');c.setPointerCapture=()=>{};c.releasePointerCapture=()=>{}
  const start={x:team.currentX,y:team.currentY},screen={x:start.x-s.camera.x,y:start.y-s.camera.y}
  const send=(type,x,y)=>c.dispatchEvent(new PointerEvent(type,{clientX:x,clientY:y,pointerId:97,pointerType:'mouse',button:0,bubbles:true}))
  send('pointerdown',screen.x,screen.y);const grabbed=readHero().draggingBlob===team
  send('pointermove',screen.x+60,screen.y+30);await new Promise(r=>setTimeout(r,180))
  const moved=Math.hypot(team.currentX-start.x,team.currentY-start.y),trackingError=Math.hypot(team.currentX-team.dragTargetX,team.currentY-team.dragTargetY)
  send('pointerup',screen.x+60,screen.y+30)
  return {grabbed,moved,trackingError,released:!readHero().draggingBlob,baseError:Math.hypot(team.baseX-team.currentX,team.baseY-team.currentY)}
 })
 assert.ok(direct.grabbed&&direct.released&&direct.moved>40&&direct.trackingError<3&&direct.baseError<.1)

 const drag=await page.evaluate(async()=>{
  const s=readHero(),c=document.querySelector('.type-interaction').shadowRoot.querySelector('#scene');c.setPointerCapture=()=>{};c.releasePointerCapture=()=>{}
  const candidates=s.nodes.filter(n=>n.team===2&&n.x-s.camera.x>40&&n.x-s.camera.x<innerWidth-40&&n.y-s.camera.y>40&&n.y-s.camera.y<innerHeight-40)
  const a=candidates.sort((a,b)=>Math.min(...s.nodes.filter(n=>n.team!==2).map(n=>Math.hypot(n.x-b.x,n.y-b.y)))-Math.min(...s.nodes.filter(n=>n.team!==2).map(n=>Math.hypot(n.x-a.x,n.y-a.y))))[0]
  const team=s.blobs[2],target=s.blobs[6],d=Math.hypot(target.currentX-team.currentX,target.currentY-team.currentY),dx=(target.currentX-team.currentX)/d,dy=(target.currentY-team.currentY)/d
  const start={x:team.currentX,y:team.currentY,cameraX:s.camera.x,cameraY:s.camera.y},screen={x:a.x-s.camera.x,y:a.y-s.camera.y}
  const send=(type,x,y)=>c.dispatchEvent(new PointerEvent(type,{clientX:x,clientY:y,pointerId:98,pointerType:'mouse',button:0,bubbles:true}))
  send('pointerdown',screen.x,screen.y);send('pointermove',screen.x+dx*85,screen.y+dy*85)
  await new Promise(r=>setTimeout(r,450))
  const current=readHero(),result={held:current.draggingNode===a,along:(team.currentX-start.x)*dx+(team.currentY-start.y)*dy,cameraMove:Math.hypot(current.camera.x-start.cameraX,current.camera.y-start.cameraY),unconnected:!current.syncEvent,coreDragTarget:team.dragTargetX}
  send('pointerup',screen.x+dx*85,screen.y+dy*85);return result
 })
 await page.evaluate(async base=>{
  const {paintedContact}=await import(base+'/src/components/TypeInteraction/sync-artwork.js');
  const s=readHero(),c=document.querySelector('.type-interaction').shadowRoot.querySelector('#scene'),ctx=c.getContext('2d'),draw=ctx.drawImage.bind(ctx)
  window.audit={lastEvent:null,wrongMapping:[],frames:[],recoils:{},secondary:{},particlesPeak:0,particleMasks:0,maxPenetration:0,firstReplacement:null,intervals:[]}
  ctx.drawImage=(img,...args)=>{
   const state=readHero(),e=state.syncEvent,m=ctx.getTransform()
   if(e&&img.src.includes('/type/')&&!img.src.includes('_default.svg')){
    const owner=state.blobs.find(b=>Math.hypot(b.currentX-state.camera.x-m.e/devicePixelRatio,b.currentY-state.camera.y-m.f/devicePixelRatio)<.1)
    if(!owner||img!==state.getSyncTypographyImage(owner.id,state.t))audit.wrongMapping.push(img.src)
    if(!audit.firstReplacement&&ctx.globalAlpha>.01)audit.firstReplacement={age:state.t-e.born,impactAt:e.impactAt,opacity:ctx.globalAlpha}
   }
   draw(img,...args)
  }
  const fx=document.querySelector('.type-interaction').shadowRoot.querySelector('.hero-particle-layer').getContext('2d'),fd=fx.drawImage.bind(fx)
  fx.drawImage=(...args)=>{if(fx.globalCompositeOperation==='destination-out')audit.particleMasks++;fd(...args)}
  window.connect=()=>{
   const s=readHero(),visible=n=>n.x-s.camera.x>15&&n.x-s.camera.x<innerWidth-15&&n.y-s.camera.y>15&&n.y-s.camera.y<innerHeight-15
   let a,b,d=Infinity
   for(const x of s.nodes.filter(n=>n.team===2&&visible(n)))for(const y of s.nodes.filter(n=>n.team===6&&visible(n))){const v=Math.hypot(x.x-y.x,x.y-y.y);if(v<d){a=x;b=y;d=v}}
   if(!a)throw new Error('No visible T/N controls')
   const send=(type,n)=>{const state=readHero();c.dispatchEvent(new PointerEvent(type,{clientX:n.x-state.camera.x,clientY:n.y-state.camera.y,pointerId:99,pointerType:'mouse',button:0,bubbles:true}))}
   send('pointerdown',a);send('pointermove',b)
   let frames=0;function follow(){send('pointermove',readHero().nodes[b.idx]);if(++frames<8)requestAnimationFrame(follow);else send('pointerup',b)}requestAnimationFrame(follow)
  }
  let last=performance.now()
  function monitor(now){
   const s=readHero(),e=s.syncEvent;audit.intervals.push(now-last);last=now
   audit.particlesPeak=Math.max(audit.particlesPeak,s.particles.count)
   if(e){
    audit.lastEvent=e;const p=e.physics
    if(p){
     if(audit.frames.length%4===0){for(let i=0;i<p.bodies.length;i++)for(let j=i+1;j<p.bodies.length;j++){if(!p.bodies[i].awake&&!p.bodies[j].awake)continue;const contact=paintedContact(p.bodies[i],p.bodies[j]);if(contact)audit.maxPenetration=Math.max(audit.maxPenetration,contact.depth)}}
     const pair=p.bodies.filter(b=>b.primary),phase=p.phase
     audit.frames.push({time:p.elapsed,phase,centres:pair.map(b=>({x:b.x,y:b.y,angle:b.angle,vx:b.vx,vy:b.vy,omega:b.omega})),camera:{...s.camera}})
     const r=p.recoil;if(r){const key=p.majorHits;const old=audit.recoils[key]||0;audit.recoils[key]=Math.max(old,r.peak-r.gap)}
     for(const b of p.bodies.filter(b=>!b.primary)){const v=p.visual(b.team);if(v.blend>0){const item=audit.secondary[b.id]??={full:0,matched:true};if(v.blend>.99)item.full++;item.matched&&=p.contacts.some(c=>c.ids.includes(b.id)&&c.ids.includes(v.otherId))}}
    }
   }
   if(!window.done)requestAnimationFrame(monitor)
  }
  requestAnimationFrame(monitor);connect()
 },base)
 await page.waitForFunction(()=>audit.lastEvent?.impactAt!==undefined,null,{timeout:15000})
 await page.waitForTimeout(250)
 await page.screenshot({path:'artifacts/sync-after-original/'+tag+'-impact.png'})
 await page.waitForFunction(()=>audit.lastEvent&&!readHero().syncEvent,null,{timeout:45000})
 const result=await page.evaluate(()=>{
  window.done=true;const e=audit.lastEvent,p=e.physics,frames=audit.frames,first=frames[0],end=frames.at(-1),intervals=audit.intervals.sort((a,b)=>a-b)
  return {maxPenetration:audit.maxPenetration,majorHits:p.majorHits,elapsed:p.elapsed,done:p.done,contacts:p.contacts,bursts:p.bursts,wrongMapping:audit.wrongMapping,firstReplacement:audit.firstReplacement,particlesPeak:audit.particlesPeak,particleMasks:audit.particleMasks,recoils:audit.recoils,secondary:audit.secondary,
   cameraTravel:Math.max(...frames.map(f=>Math.hypot(f.camera.x-first.camera.x,f.camera.y-first.camera.y))),maxDrift:Math.max(...frames.map(f=>Math.hypot((f.centres[0].x+f.centres[1].x-first.centres[0].x-first.centres[1].x)/2,(f.centres[0].y+f.centres[1].y-first.centres[0].y-first.centres[1].y)/2))),
   oppositeSpin:frames.filter(f=>f.centres[0].omega*f.centres[1].omega<-.01).length,fullStopDuringPlay:frames.filter(f=>f.phase==='play'&&f.centres.every(b=>Math.hypot(b.vx,b.vy)<5)).length,
   neighborReturn:Math.max(...p.bodies.filter(b=>!b.primary&&b.awake).map(b=>Math.hypot(b.team.currentX-b.homeX,b.team.currentY-b.homeY)),0),bodies:p.bodies.map(({field,geometry,response,nextResponse,team,...b})=>b),p95:intervals[Math.floor(intervals.length*.95)],lastFrame:end}
 })
 fs.writeFileSync('artifacts/sync-after-original/'+tag+'.json',JSON.stringify({name,viewport,direct,drag,...result,errors},null,2))
 console.log(JSON.stringify({name,direct,maxPenetration:result.maxPenetration,majorHits:result.majorHits,elapsed:result.elapsed,done:result.done,cameraTravel:result.cameraTravel,maxDrift:result.maxDrift,recoils:result.recoils,secondary:result.secondary,neighborReturn:result.neighborReturn,fullStopDuringPlay:result.fullStopDuringPlay,p95:result.p95,errors}))
 assert.ok(result.maxPenetration<4,`residual penetration ${result.maxPenetration}`);assert.ok(result.majorHits>=3&&result.majorHits<=5);assert.ok(result.done);assert.ok(result.contacts.every(c=>c.distance<=.1&&(c.ids.includes(2)||c.ids.includes(6))));assert.equal(result.bursts.length,result.contacts.length*2)
 assert.ok(result.firstReplacement.impactAt!==undefined&&result.firstReplacement.age>=result.firstReplacement.impactAt)
 assert.ok(result.cameraTravel>20&&result.maxDrift>80);assert.ok(result.oppositeSpin>0);assert.equal(result.fullStopDuringPlay,0)
 assert.ok(Object.values(result.recoils).filter(v=>v>100).length>=2);assert.ok(Object.values(result.secondary).every(v=>v.full>10&&v.matched));assert.ok(result.neighborReturn<.7)
 assert.ok(result.particlesPeak<=160&&result.particlesPeak>=48&&result.particleMasks>0);assert.deepEqual(result.wrongMapping,[]);assert.deepEqual(errors,[])
 await page.waitForTimeout(700)
 await page.evaluate(()=>{window.secondBefore=readHero().syncEvent;connect()})
 await page.waitForFunction(()=>readHero().syncEvent?.impactAt!==undefined,null,{timeout:15000})
 const second=await page.evaluate(()=>{window.secondEvent=readHero().syncEvent;return {ids:[secondEvent.teamA.id,secondEvent.teamB.id],firstImpact:secondEvent.impactAt}})
 if(width>=1400)await page.setViewportSize({width:1024,height:768})
 await page.waitForFunction(()=>!readHero().syncEvent,null,{timeout:45000})
 const repeated=await page.evaluate(()=>({majorHits:secondEvent.physics.majorHits,done:secondEvent.physics.done,reason:secondEvent.physics.completionReason,neighborReturn:Math.max(...secondEvent.physics.bodies.filter(b=>!b.primary&&b.awake).map(b=>Math.hypot(b.team.currentX-b.homeX,b.team.currentY-b.homeY)),0)}))
 assert.ok(repeated.done&&repeated.majorHits>=3&&repeated.majorHits<=5);assert.ok(repeated.neighborReturn<.7);assert.deepEqual(errors,[])
 fs.writeFileSync('artifacts/sync-after-original/'+tag+'-repeat.json',JSON.stringify({name,second,resized:width>=1400,...repeated,errors},null,2));console.log('repeat',JSON.stringify({name,second,...repeated,errors}))
 } finally {await browser.close()}
}})().catch(e=>{console.error(e);process.exitCode=1})
