const {chromium,webkit}=require('/Users/yujin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict')
const base='http://127.0.0.1:5180/Capstone_B'
const files=fs.readdirSync(path.join(process.cwd(),'src/assets/type'),{recursive:true}).filter(f=>f.endsWith('.svg'))
;(async()=>{for(const [name,type] of Object.entries({chrome:chromium,webkit})){
 const browser=await type.launch({headless:true,...(name==='chrome'?{channel:'chrome'}:{})})
 try {
 const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[]
 page.on('pageerror',e=>errors.push(e.message))
 await page.route('**/__hero_test',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><html><body></body></html>'}))
 await page.route('**/type-engine.js',async r=>{const response=await r.fetch();await r.fulfill({response,body:(await response.text()).replace('var resizeTimer = null;', 'window.readHero=()=>({nodes,blobs,camera,syncEvent,artworkGeometry,syncPairImages,draggingBlob}); var resizeTimer = null;')})})
 await page.goto(base+'/__hero_test')
 await page.evaluate(async({base,files})=>{
  document.body.style.margin='0'
  const globalStyle=document.createElement('style');globalStyle.textContent=(await import(base+'/src/components/TypeInteraction/TypeInteraction.css?inline')).default;document.head.append(globalStyle)
  const host=document.createElement('div');host.className='type-interaction';host.style.cssText='position:fixed;inset:0';document.body.append(host)
  const root=host.attachShadow({mode:'open'}),style=document.createElement('style');style.textContent=(await import(base+'/src/components/TypeInteraction/type-scene.css?inline')).default
  const scene=document.createElement('div');scene.className='type-scene';scene.innerHTML='<div class="stage-wrap"><canvas id="scene"></canvas></div><div class="vignette"></div>';root.append(style,scene)
  const canvas=root.getElementById('scene'),{default:start}=await import(base+'/src/components/TypeInteraction/type-engine.js')
  window.stopEngine=start({host,canvas,placementSeed:.42,assetMap:Object.fromEntries(files.map(f=>[f,base+'/src/assets/type/'+f]))})
  const {artworkContact}=await import(base+'/src/components/TypeInteraction/hero-artwork.js')
  window.metrics={peakParticles:0,particleReach:0,maxResidualDepth:0,maxFrame:0,maxRotation:{},maxNeighbourDisplacement:0,offscreenNeighbourFrames:0,wrongMapping:[],distortedDraws:0,planningWait:0,maskDraws:0,deepContacts:[]}
  window.particleDraws=[];window.replacementFrames=0;window.frameIntervals=[];window.monitorRunning=true
  const ctx=canvas.getContext('2d'),draw=ctx.drawImage.bind(ctx)
  ctx.drawImage=(img,...args)=>{
   const matrix=ctx.getTransform(),s=window.readHero(),e=s.syncEvent
   if(Math.abs(Math.hypot(matrix.a,matrix.b)-Math.hypot(matrix.c,matrix.d))>.0001)window.metrics.distortedDraws++
   if(/\/type\/[^/]+\//.test(img.src)){
    window.replacementFrames++
    const owner=s.blobs.find(b=>Math.hypot(b.currentX-s.camera.x-matrix.e/devicePixelRatio,b.currentY-s.camera.y-matrix.f/devicePixelRatio)<.1)
    const ids=e?[e.teamA.id,e.teamB.id].sort((a,b)=>a-b):[]
    if(!owner || !ids.includes(owner.id) || img.src!==s.syncPairImages[ids.join('-')]?.[owner.id===ids[0]?0:1]?.src)window.metrics.wrongMapping.push(img.src)
   }
   draw(img,...args)
  }
  const layer=root.querySelector('.hero-particle-layer'),fx=layer.getContext('2d'),fxDraw=fx.drawImage.bind(fx),fxClear=fx.clearRect.bind(fx)
  fx.clearRect=(...args)=>{window.particleDraws=[];fxClear(...args)}
  fx.drawImage=(img,...args)=>{if(fx.globalCompositeOperation==='destination-out'){window.metrics.maskDraws++;fxDraw(img,...args);return}const matrix=fx.getTransform(),s=window.readHero();window.particleDraws.push({x:matrix.e/devicePixelRatio+s.camera.x,y:matrix.f/devicePixelRatio+s.camera.y});fxDraw(img,...args)}
  let last=performance.now(),frame=0,planningStart=null
  function monitor(now){
   if(!window.monitorRunning)return
   const s=window.readHero(),m=window.metrics,interval=now-last;last=now
   window.frameIntervals.push(interval);m.maxFrame=Math.max(m.maxFrame,interval)
   m.peakParticles=Math.max(m.peakParticles,window.particleDraws.length)
   if(s.syncEvent){
    const e=s.syncEvent;window.lastEvent=e
    if(e.physics.planning)planningStart??=now
    else if(planningStart!==null){m.planningWait=now-planningStart;planningStart=null}
    const bodies=e.physics.bodies
    for(const b of bodies){
     m.maxRotation[b.id]=Math.max(m.maxRotation[b.id]||0,Math.abs(b.angle-b.homeAngle))
     if(!b.active){m.maxNeighbourDisplacement=Math.max(m.maxNeighbourDisplacement,Math.hypot(b.x-b.homeX,b.y-b.homeY));if(b.hitAt!==null&&(b.x-s.camera.x<0||b.x-s.camera.x>1440||b.y-s.camera.y<0||b.y-s.camera.y>900))m.offscreenNeighbourFrames++}
    }
    if(++frame%4===0)for(let i=0;i<bodies.length;i++)for(let j=i+1;j<bodies.length;j++){const c=artworkContact(bodies[i],bodies[j]);if(c){if(c.depth>4&&c.depth>m.maxResidualDepth)m.deepContacts.push({time:e.physics.elapsed,ids:[bodies[i].id,bodies[j].id],depth:c.depth,fade:e.svgFadeOut,angles:[bodies[i].angle,bodies[j].angle]});m.maxResidualDepth=Math.max(m.maxResidualDepth,c.depth)}}
    const first=e.physics.contacts.find(c=>c.kind==='sync')
    if(first && e.physics.particleEvents.length>=2 && window.particleDraws.length>=48 && e.physics.elapsed-e.physics.particleEvents[0].time<.7){
     const events=e.physics.particleEvents
     for(let i=0;i<48;i++){const p=window.particleDraws[i],origin=events[i<24?0:1];m.particleReach=Math.max(m.particleReach,Math.hypot(p.x-origin.x,p.y-origin.y)/origin.radius)}
    }
   }
   requestAnimationFrame(monitor)
  }
  requestAnimationFrame(monitor)
 },{base,files})
 await page.waitForTimeout(650)
 const layer=await page.evaluate(()=>{const root=document.querySelector('.type-interaction').shadowRoot,p=root.querySelector('.hero-particle-layer'),c=root.querySelector('#scene');return {particlesZ:+getComputedStyle(p).zIndex,typoZ:+getComputedStyle(c).zIndex,pointerEvents:getComputedStyle(p).pointerEvents,first:p.compareDocumentPosition(c)===Node.DOCUMENT_POSITION_FOLLOWING}})
 await page.mouse.click(720,450);await page.waitForTimeout(120);const empty=await page.evaluate(()=>window.particleDraws.length)
 await page.waitForTimeout(1600);const expired=await page.evaluate(()=>window.particleDraws.length===0)
 const direct=await page.evaluate(()=>{const s=window.readHero(),b=s.blobs[2];return {x:b.currentX-s.camera.x,y:b.currentY-s.camera.y}})
 await page.mouse.move(direct.x,direct.y);await page.mouse.down();await page.mouse.move(direct.x+70,direct.y+35,{steps:8});await page.mouse.up();await page.waitForTimeout(350)
 const directResult=await page.evaluate(()=>({particles:window.particleDraws.length,elasticReturn:!!window.readHero().blobs[2].elasticReturn,dragTarget:window.readHero().blobs[2].dragTargetX}))
 const connection=await page.evaluate(()=>{
  const s=window.readHero(),c=document.querySelector('.type-interaction').shadowRoot.querySelector('#scene');c.setPointerCapture=()=>{};c.releasePointerCapture=()=>{}
  const visible=n=>n.x-s.camera.x>15&&n.x-s.camera.x<1425&&n.y-s.camera.y>15&&n.y-s.camera.y<885
  let a,b,d=Infinity
  for(const x of s.nodes.filter(n=>n.team===2&&visible(n)))for(const y of s.nodes.filter(n=>n.team===6&&visible(n))){const v=Math.hypot(x.x-y.x,x.y-y.y);if(v<d){a=x;b=y;d=v}}
  if(!a)throw new Error('No visible T/N controls')
  const send=(type,node)=>{const state=window.readHero();c.dispatchEvent(new PointerEvent(type,{clientX:node.x-state.camera.x,clientY:node.y-state.camera.y,pointerId:99,pointerType:'mouse',button:0,bubbles:true}))}
  window.metrics.maxFrame=0;window.frameIntervals=[]
  send('pointerdown',a);send('pointermove',b)
  let frames=0
  function follow(){send('pointermove',window.readHero().nodes[b.idx]);if(++frames<8)requestAnimationFrame(follow);else send('pointerup',b)}requestAnimationFrame(follow)
  return {source:a.team,target:b.team,visible:true}
 })
 await page.waitForFunction(()=>window.lastEvent?.impactAt!==undefined,null,{timeout:15000})
 await page.waitForTimeout(180);await page.screenshot({path:`artifacts/hero-silhouette-review/${name}-burst.png`})
 await page.waitForTimeout(1000);await page.screenshot({path:`artifacts/hero-silhouette-review/${name}-rolling.png`})
 await page.waitForFunction(()=>window.lastEvent && !window.readHero().syncEvent,null,{timeout:25000})
 const result=await page.evaluate(()=>{
  const event=window.lastEvent,p=event.physics,intervals=window.frameIntervals.slice().sort((a,b)=>a-b)
  window.monitorRunning=false
  return {metrics:window.metrics,impactAt:event.impactAt,collisions:p.collisions,contacts:p.contacts,launch:p.launch,particleEvents:p.particleEvents,replacementFrames:window.replacementFrames,
   finalBodies:p.bodies.map(({field,...b})=>b),returnError:Math.max(...p.bodies.filter(b=>!b.active).map(b=>Math.hypot(b.x-b.homeX,b.y-b.homeY))),returnAngleError:Math.max(...p.bodies.filter(b=>!b.active).map(b=>Math.abs(Math.atan2(Math.sin(b.angle-b.homeAngle),Math.cos(b.angle-b.homeAngle))))),p95Frame:intervals[Math.floor(intervals.length*.95)]}
 })
 await page.waitForTimeout(500)
 const stays=await page.evaluate(bodies=>bodies.filter(b=>b.active).every(b=>{const current=window.readHero().blobs[b.id];return current.resting&&Math.hypot(current.currentX-b.x,current.currentY-b.y)<.01&&Math.abs(current.restRotation-b.angle)<.001}),result.finalBodies)
 const report={name,layer,empty,expired,directResult,connection,...result,stays,errors}
 fs.writeFileSync(`artifacts/hero-silhouette-review/${name}.json`,JSON.stringify(report,null,2))
 console.log(name,JSON.stringify({layer,empty,expired,directResult,collisions:result.collisions,metrics:result.metrics,returnError:result.returnError,returnAngleError:result.returnAngleError,p95Frame:result.p95Frame,planningCPU:result.launch.planningMilliseconds,stays,errors}))
 assert.ok(layer.particlesZ<layer.typoZ&&layer.first);assert.equal(layer.pointerEvents,'none');assert.equal(empty,14);assert.ok(expired)
 assert.equal(directResult.particles,0);assert.equal(directResult.elasticReturn,false);assert.ok(result.replacementFrames>0)
 assert.ok(result.contacts.every(c=>c.paintDistance<=.1&&c.kind!=='wall'))
 assert.ok(result.collisions>=3&&result.collisions<=5,`secondary neighbour hits: ${result.collisions}`)
 assert.ok(result.metrics.maxRotation[2]>.35&&result.metrics.maxRotation[6]>.35)
 assert.ok(result.metrics.particleReach>=.95,`orbit particle reach: ${result.metrics.particleReach}`);assert.ok(result.metrics.maxResidualDepth<4,`paint penetration: ${result.metrics.maxResidualDepth}`)
 assert.ok(result.metrics.maskDraws>0);assert.equal(result.metrics.distortedDraws,0);assert.deepEqual(result.metrics.wrongMapping,[])
 assert.ok(result.returnError<.7&&result.returnAngleError<.01);assert.ok(stays);assert.deepEqual(errors,[])
 } finally { await browser.close() }
}})().catch(e=>{console.error(e);process.exitCode=1})
