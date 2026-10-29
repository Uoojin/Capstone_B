const {chromium,webkit}=require('/Users/yujin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict')
const base='http://127.0.0.1:5180/Capstone_B'
const width=Number(process.argv[2]||1440),height=Number(process.argv[3]||900),viewport={width,height}
const only=process.argv[4],backends=only==='chrome'?{chrome:chromium}:only==='webkit'?{webkit}:{chrome:chromium,webkit}
const files=fs.readdirSync(path.join(process.cwd(),'src/assets/type'),{recursive:true}).filter(f=>f.endsWith('.svg'))
;(async()=>{for(const [name,type] of Object.entries(backends)){
 const tag=process.argv[2]?`${name}-${width}x${height}`:name
 const browser=await type.launch({headless:true,...(name==='chrome'?{channel:'chrome'}:{})})
 try {
 const page=await browser.newPage({viewport}),errors=[]
 page.on('pageerror',e=>errors.push(e.message))
 await page.route('**/__hero_test',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><html><body></body></html>'}))
 await page.route('**/type-engine.js',async r=>{const response=await r.fetch();await r.fulfill({response,body:(await response.text()).replace('var resizeTimer = null;', 'window.readHero=()=>({nodes,blobs,camera,syncEvent,artworkGeometry,syncPairImages,draggingBlob,getPairArtworkBounds}); var resizeTimer = null;')})})
 await page.goto(base+'/__hero_test')
 await page.evaluate(async({base,files,viewport})=>{
  document.body.style.margin='0'
  const globalStyle=document.createElement('style');globalStyle.textContent=(await import(base+'/src/components/TypeInteraction/TypeInteraction.css?inline')).default;document.head.append(globalStyle)
  const host=document.createElement('div');host.className='type-interaction';host.style.cssText='position:fixed;inset:0';document.body.append(host)
  const root=host.attachShadow({mode:'open'}),style=document.createElement('style');style.textContent=(await import(base+'/src/components/TypeInteraction/type-scene.css?inline')).default
  const scene=document.createElement('div');scene.className='type-scene';scene.innerHTML='<div class="stage-wrap"><canvas id="scene"></canvas></div><div class="vignette"></div>';root.append(style,scene)
  const canvas=root.getElementById('scene'),{default:start}=await import(base+'/src/components/TypeInteraction/type-engine.js')
  window.stopEngine=start({host,canvas,placementSeed:.42,assetMap:Object.fromEntries(files.map(f=>[f,base+'/src/assets/type/'+f]))})
  const {artworkContact,artworkPose}=await import(base+'/src/components/TypeInteraction/hero-artwork.js')
  window.initialCamera={...window.readHero().camera};
  window.metrics={cameraChangedFrames:0,fullyHiddenFrames:0,minInkVisibleFraction:1,recoils:{},primaryPulseStarts:0,peakParticles:0,particleReach:0,maxResidualDepth:0,maxFrame:0,maxRotation:{},maxNeighbourDisplacement:0,offscreenNeighbourFrames:0,wrongMapping:[],distortedDraws:0,planningWait:0,maskDraws:0,deepContacts:[],secondary:{},visibleViolationFrames:0,returnClipFrames:0,minZoom:1,maxPairDrift:0,reapproaches:0,differentVelocityFrames:0,oppositeSpinFrames:0}
  window.particleDraws=[];window.replacementFrames=0;window.frameIntervals=[];window.monitorRunning=true
  const ctx=canvas.getContext('2d'),draw=ctx.drawImage.bind(ctx)
  ctx.drawImage=(img,...args)=>{
   const matrix=ctx.getTransform(),s=window.readHero(),e=s.syncEvent
   if(Math.abs(Math.hypot(matrix.a,matrix.b)-Math.hypot(matrix.c,matrix.d))>.0001)window.metrics.distortedDraws++
   if(/\/type\/[^/]+\//.test(img.src)){
    window.replacementFrames++
    const owner=s.blobs.find(b=>Math.hypot(b.currentX-s.camera.x-matrix.e/(devicePixelRatio*s.camera.zoom),b.currentY-s.camera.y-matrix.f/(devicePixelRatio*s.camera.zoom))<.1)
    const visual=owner&&e?.physics.visualState(owner)
    const ids=owner&&visual?.otherId!==undefined?[owner.id,visual.otherId].sort((a,b)=>a-b):[]
    if(!owner || !ids.length || img.src!==s.syncPairImages[ids.join('-')]?.[owner.id===ids[0]?0:1]?.src)window.metrics.wrongMapping.push(img.src)

   }
   draw(img,...args)
  }
  const layer=root.querySelector('.hero-particle-layer'),fx=layer.getContext('2d'),fxDraw=fx.drawImage.bind(fx),fxClear=fx.clearRect.bind(fx)
  fx.clearRect=(...args)=>{window.particleDraws=[];fxClear(...args)}
  fx.drawImage=(img,...args)=>{if(fx.globalCompositeOperation==='destination-out'){window.metrics.maskDraws++;fxDraw(img,...args);return}const matrix=fx.getTransform(),s=window.readHero();window.particleDraws.push({x:matrix.e/(devicePixelRatio*s.camera.zoom)+s.camera.x,y:matrix.f/(devicePixelRatio*s.camera.zoom)+s.camera.y});fxDraw(img,...args)}
  let last=performance.now(),frame=0,planningStart=null,firstMid=null,previousDistance=0,previousTrend=0,lastPrimaryBlend=0
  function monitor(now){
   if(!window.monitorRunning)return
   const s=window.readHero(),m=window.metrics,interval=now-last;last=now
   if(s.camera.x!==window.initialCamera.x||s.camera.y!==window.initialCamera.y||s.camera.zoom!==1)m.cameraChangedFrames++
   window.frameIntervals.push(interval);m.maxFrame=Math.max(m.maxFrame,interval)
   m.peakParticles=Math.max(m.peakParticles,window.particleDraws.length)
   if(s.syncEvent){
    const e=s.syncEvent;window.lastEvent=e
    if(e.physics.planning)planningStart??=now
    else if(planningStart!==null){m.planningWait=now-planningStart;planningStart=null}
    const bodies=e.physics.bodies
    m.minZoom=Math.min(m.minZoom,s.camera.zoom)
    const pair=bodies.filter(b=>b.active)
    if(e.impactAt!==undefined){
     for(const b of pair){
      const pose=artworkPose(b);let visible=0,total=0
      for(let i=0;i<b.field.edge.length;i+=8){const p=b.field.edge[i],x=b.x+p.x*pose.c-p.y*pose.s-s.camera.x,y=b.y+p.x*pose.s+p.y*pose.c-s.camera.y;total++;if(x>=0&&x<=viewport.width&&y>=0&&y<=viewport.height)visible++}
      const fraction=total?visible/total:0;m.minInkVisibleFraction=Math.min(m.minInkVisibleFraction,fraction);if(visible===0)m.fullyHiddenFrames++
     }
    }
    const cycle=e.physics.cycle
    if(cycle){const recoil=m.recoils[cycle.id]??={extension:0,returned:false};recoil.extension=Math.max(recoil.extension,cycle.peak-cycle.contactGap);if(cycle.mode==='attract')recoil.returned=true}
    const primaryBlend=e.physics.visualState(e.teamA).blend
    if(primaryBlend>0&&lastPrimaryBlend===0)m.primaryPulseStarts++
    lastPrimaryBlend=primaryBlend
    const mid={x:(pair[0].x+pair[1].x)/2,y:(pair[0].y+pair[1].y)/2};firstMid??=mid
    if(e.physics.phase==='elastic'){
     m.maxPairDrift=Math.max(m.maxPairDrift,Math.hypot(mid.x-firstMid.x,mid.y-firstMid.y))
     const distance=Math.hypot(pair[0].x-pair[1].x,pair[0].y-pair[1].y),delta=distance-previousDistance
     const trend=Math.abs(delta)>.5?Math.sign(delta):previousTrend
     if(previousTrend===1&&trend===-1)m.reapproaches++
     previousTrend=trend;previousDistance=distance
     const speeds=Math.hypot(pair[0].vx,pair[0].vy)*Math.hypot(pair[1].vx,pair[1].vy)
     if(speeds>100&&(pair[0].vx*pair[1].vx+pair[0].vy*pair[1].vy)/speeds<.7)m.differentVelocityFrames++
     if(pair[0].omega*pair[1].omega<-.01)m.oppositeSpinFrames++
    }
    for(const b of bodies.filter(b=>!b.active)){
     const visual=e.physics.visualState(s.blobs[b.id])
     if(visual.blend>0){const item=m.secondary[b.id]??={maxBlend:0,fullFrames:0,partners:{},matchedContact:true};item.maxBlend=Math.max(item.maxBlend,visual.blend);if(visual.blend>.99)item.fullFrames++;item.partners[visual.otherId]=true;item.matchedContact&&=e.physics.contacts.some(c=>c.ids.includes(b.id)&&c.ids.includes(visual.otherId))}
    }

    for(const b of bodies){
     m.maxRotation[b.id]=Math.max(m.maxRotation[b.id]||0,Math.abs(b.angle-b.homeAngle))
     if(!b.active){m.maxNeighbourDisplacement=Math.max(m.maxNeighbourDisplacement,Math.hypot(b.x-b.homeX,b.y-b.homeY));if(b.hitAt!==null&&(b.x-s.camera.x<0||b.x-s.camera.x>viewport.width||b.y-s.camera.y<0||b.y-s.camera.y>viewport.height))m.offscreenNeighbourFrames++}
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
 },{base,files,viewport})
 await page.waitForTimeout(650)
 const layer=await page.evaluate(()=>{const root=document.querySelector('.type-interaction').shadowRoot,p=root.querySelector('.hero-particle-layer'),c=root.querySelector('#scene');return {particlesZ:+getComputedStyle(p).zIndex,typoZ:+getComputedStyle(c).zIndex,pointerEvents:getComputedStyle(p).pointerEvents,first:p.compareDocumentPosition(c)===Node.DOCUMENT_POSITION_FOLLOWING}})
 const emptyPoint=await page.evaluate(()=>{
  const s=window.readHero(),w=innerWidth,h=innerHeight
  let best={score:-1,x:w/2,y:h/2}
  for(let x=w*.25;x<w*.85;x+=50)for(let y=h*.25;y<h*.85;y+=50){
   const world={x:x/s.camera.zoom+s.camera.x,y:y/s.camera.zoom+s.camera.y}
   const score=Math.min(...s.blobs.map(b=>Math.hypot(b.currentX-world.x,b.currentY-world.y)-b.renderRadius),...s.nodes.map(n=>Math.hypot(n.x-world.x,n.y-world.y)*8))
   if(score>best.score)best={x,y,score}
  }
  return best
 })
 await page.mouse.click(emptyPoint.x,emptyPoint.y);await page.waitForTimeout(120);const empty=await page.evaluate(()=>window.particleDraws.length)
 await page.waitForTimeout(1600);const expired=await page.evaluate(()=>window.particleDraws.length===0)
 const direct=await page.evaluate(()=>{const s=window.readHero(),b=s.blobs[2];return {x:b.currentX-s.camera.x,y:b.currentY-s.camera.y}})
 await page.mouse.move(direct.x,direct.y);await page.mouse.down();await page.mouse.move(direct.x+70,direct.y+35,{steps:8});await page.mouse.up();await page.waitForTimeout(350)
 const directResult=await page.evaluate(()=>({particles:window.particleDraws.length,elasticReturn:!!window.readHero().blobs[2].elasticReturn,dragTarget:window.readHero().blobs[2].dragTargetX}))
 const connection=await page.evaluate(()=>{
  const s=window.readHero(),c=document.querySelector('.type-interaction').shadowRoot.querySelector('#scene');c.setPointerCapture=()=>{};c.releasePointerCapture=()=>{}
  const visible=n=>(n.x-s.camera.x)*s.camera.zoom>15&&(n.x-s.camera.x)*s.camera.zoom<innerWidth-15&&(n.y-s.camera.y)*s.camera.zoom>15&&(n.y-s.camera.y)*s.camera.zoom<innerHeight-15
  let a,b,d=Infinity
  for(const x of s.nodes.filter(n=>n.team===2&&visible(n)))for(const y of s.nodes.filter(n=>n.team===6&&visible(n))){const v=Math.hypot(x.x-y.x,x.y-y.y);if(v<d){a=x;b=y;d=v}}
  if(!a)throw new Error('No visible T/N controls')
  const send=(type,node)=>{const state=window.readHero();c.dispatchEvent(new PointerEvent(type,{clientX:(node.x-state.camera.x)*state.camera.zoom,clientY:(node.y-state.camera.y)*state.camera.zoom,pointerId:99,pointerType:'mouse',button:0,bubbles:true}))}
  window.metrics.maxFrame=0;window.frameIntervals=[]
  send('pointerdown',a);send('pointermove',b)
  let frames=0
  function follow(){send('pointermove',window.readHero().nodes[b.idx]);if(++frames<8)requestAnimationFrame(follow);else send('pointerup',b)}requestAnimationFrame(follow)
  return {source:a.team,target:b.team,visible:true}
 })
 await page.waitForFunction(()=>window.lastEvent?.impactAt!==undefined,null,{timeout:15000})
 await page.waitForTimeout(180);await page.screenshot({path:`artifacts/hero-fixed-review/${tag}-burst.png`})
 await page.waitForTimeout(1000);await page.screenshot({path:`artifacts/hero-fixed-review/${tag}-rolling.png`})
 await page.waitForFunction(()=>{const s=window.readHero(),e=s.syncEvent;return e&&s.blobs.some(b=>b!==e.teamA&&b!==e.teamB&&e.physics.visualState(b).blend>.99)},null,{timeout:18000})
 await page.screenshot({path:`artifacts/hero-fixed-review/${tag}-secondary-sync.png`})
 await page.waitForFunction(()=>window.lastEvent && !window.readHero().syncEvent,null,{timeout:35000})
 const result=await page.evaluate(()=>{
  const event=window.lastEvent,p=event.physics,intervals=window.frameIntervals.slice().sort((a,b)=>a-b)
  window.monitorRunning=false
  return {metrics:window.metrics,impactAt:event.impactAt,collisions:p.collisions,pairCollisions:p.pairCollisions,elasticCycles:p.elasticCycles,contacts:p.contacts,homeView:event.homeView,finalCamera:{...window.readHero().camera},finalVisuals:window.readHero().blobs.map(b=>({id:b.id,blend:p.visualState(b).blend})),launch:p.launch,particleEvents:p.particleEvents,replacementFrames:window.replacementFrames,
   finalBodies:p.bodies.map(({field,...b})=>b),returnError:Math.max(...p.bodies.filter(b=>!b.active).map(b=>Math.hypot(b.x-b.homeX,b.y-b.homeY))),returnAngleError:Math.max(...p.bodies.filter(b=>!b.active).map(b=>Math.abs(Math.atan2(Math.sin(b.angle-b.homeAngle),Math.cos(b.angle-b.homeAngle))))),p95Frame:intervals[Math.floor(intervals.length*.95)]}
 })
 await page.waitForTimeout(500)
 const stays=await page.evaluate(bodies=>bodies.filter(b=>b.active).every(b=>{const current=window.readHero().blobs[b.id];return current.resting&&Math.hypot(current.currentX-b.x,current.currentY-b.y)<.01&&Math.abs(current.restRotation-b.angle)<.001}),result.finalBodies)
 const report={name,layer,empty,expired,directResult,connection,...result,stays,errors}
 fs.writeFileSync(`artifacts/hero-fixed-review/${tag}.json`,JSON.stringify(report,null,2))
 console.log(name,JSON.stringify({layer,empty,expired,directResult,collisions:result.collisions,pairCollisions:result.pairCollisions,elasticCycles:result.elasticCycles,finalCamera:result.finalCamera,homeView:result.homeView,metrics:result.metrics,returnError:result.returnError,returnAngleError:result.returnAngleError,p95Frame:result.p95Frame,planningCPU:result.launch.planningMilliseconds,stays,errors}))
 assert.ok(layer.particlesZ<layer.typoZ&&layer.first);assert.equal(layer.pointerEvents,'none');assert.equal(empty,14);assert.ok(expired)
 assert.equal(directResult.particles,0);assert.equal(directResult.elasticReturn,false);assert.ok(result.replacementFrames>0)
 assert.ok(result.contacts.every(c=>c.paintDistance<=.1&&c.kind!=='wall'))
 assert.ok(result.elasticCycles>=2,`wide elastic cycles: ${result.elasticCycles}`);assert.ok(result.pairCollisions>=3,`pair collisions: ${result.pairCollisions}`)
 assert.equal(result.metrics.cameraChangedFrames,0);assert.equal(result.metrics.fullyHiddenFrames,0)
 assert.equal(result.finalCamera.zoom,1)
 assert.ok(result.metrics.minInkVisibleFraction>.1)
 assert.ok(Object.values(result.metrics.recoils).filter(r=>r.extension>=100&&r.returned).length>=2)
 assert.ok(Math.max(...Object.values(result.metrics.recoils).map(r=>r.extension))>=Math.min(180,width*.14))
 assert.ok(result.metrics.reapproaches>=2&&result.metrics.maxPairDrift>90)
 assert.ok(result.metrics.differentVelocityFrames>20&&result.metrics.oppositeSpinFrames>0)
 assert.ok(Object.keys(result.metrics.secondary).length>0)
 assert.ok(Object.values(result.metrics.secondary).every(s=>s.maxBlend>.99&&s.fullFrames>=5&&s.matchedContact))
 assert.ok(result.finalVisuals.every(v=>v.blend===0))
 const activeIds=new Set(result.finalBodies.filter(b=>b.active).map(b=>b.id))
 const firstSecondary=result.contacts.find(c=>c.ids.filter(id=>activeIds.has(id)).length===1)
 assert.ok(firstSecondary&&result.contacts.some(c=>c.ids.every(id=>activeIds.has(id))&&c.time>firstSecondary.time+.1))
 const cx=result.finalCamera.x+width/(2*result.finalCamera.zoom),cy=result.finalCamera.y+height/(2*result.finalCamera.zoom)
 assert.equal(result.finalCamera.x,result.homeView.x);assert.equal(result.finalCamera.y,result.homeView.y)
 assert.ok(result.metrics.maxRotation[2]>.35&&result.metrics.maxRotation[6]>.35)
 assert.ok(result.metrics.particleReach>=.95,`orbit particle reach: ${result.metrics.particleReach}`);assert.ok(result.metrics.maxResidualDepth<4,`paint penetration: ${result.metrics.maxResidualDepth}`)
 assert.ok(result.metrics.maskDraws>0);assert.equal(result.metrics.distortedDraws,0);assert.deepEqual(result.metrics.wrongMapping,[])
 assert.ok(result.returnError<.7&&result.returnAngleError<.01);assert.ok(stays);assert.deepEqual(errors,[])
 } finally { await browser.close() }
}})().catch(e=>{console.error(e);process.exitCode=1})
