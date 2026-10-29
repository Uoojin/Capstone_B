const {chromium,webkit}=require(process.env.PLAYWRIGHT_MODULE||'playwright')
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict')
const base=process.env.HERO_TEST_URL||'http://127.0.0.1:5180/Capstone_B'
const files=fs.readdirSync(path.join(process.cwd(),'src/assets/type'),{recursive:true}).filter(f=>f.endsWith('.svg'))
;(async()=>{for(const [name,type] of Object.entries({chrome:chromium,webkit})){
 const browser=await type.launch({headless:true,...(name==='chrome'?{channel:'chrome'}:{})})
 const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[]
 page.on('pageerror',e=>errors.push(e.message))
 await page.route('**/__hero_test',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><html><body></body></html>'}))
 await page.route('**/type-engine.js',async r=>{const response=await r.fetch();await r.fulfill({response,body:(await response.text()).replace('var resizeTimer = null;', 'window.__readHero=()=>({nodes,blobs,camera,syncEvent,draggingNode,draggingBlob,getTypographyOrbitRadius,syncPairImages}); var resizeTimer = null;')})})
 await page.goto(base+'/__hero_test')
 await page.evaluate(async({base,files})=>{
  document.body.style.margin='0'
  const style=document.createElement('style');style.textContent='.type-cursor-layer{pointer-events:none;position:fixed;inset:0}.type-click-cursor{position:absolute;pointer-events:none}'
  document.head.append(style)
  const host=document.createElement('div');host.style.cssText='position:fixed;inset:0';document.body.append(host)
  const shadow=host.attachShadow({mode:'open'}),canvas=document.createElement('canvas');shadow.append(canvas)
  const {default:start}=await import(base+'/src/components/TypeInteraction/type-engine.js')
  window.stopEngine=start({host,canvas,placementSeed:.42,assetMap:Object.fromEntries(files.map(f=>[f,base+'/src/assets/type/'+f]))})
  window.metrics={maxOverlap:0,peakParticles:0,particleReach:0,maxNeighbourDisplacement:0,maxTurn:0,maxFrame:0,wrongMapping:[],invisibleActiveFrames:0}
  window.particleFrames=[];window.particleDraws=[];window.replacementFrames=0;window.draws=[]
  const ctx=canvas.getContext('2d'),draw=ctx.drawImage.bind(ctx),clear=ctx.clearRect.bind(ctx)
  ctx.clearRect=(...args)=>{window.draws=[];clear(...args)}
  ctx.drawImage=(img,...args)=>{
    const m=ctx.getTransform();window.draws.push({src:img.src,x:m.e/devicePixelRatio,y:m.f/devicePixelRatio})
    if(/\/type\/[^/]+\//.test(img.src)){
      window.replacementFrames++
      const s=window.__readHero(),e=s.syncEvent
      const owner=s.blobs.find(b=>Math.hypot(b.currentX-s.camera.x-m.e/devicePixelRatio,b.currentY-s.camera.y-m.f/devicePixelRatio)<.1)
      const ids=e?[e.teamA.id,e.teamB.id].sort((a,b)=>a-b):[]
      if(!owner || !ids.includes(owner.id) || img.src!==s.syncPairImages[ids.join('-')]?.[owner.id===ids[0]?0:1]?.src)window.metrics.wrongMapping.push(img.src)
    }
    draw(img,...args)
  }
  const layer=shadow.querySelector('.hero-particle-layer'),fx=layer.getContext('2d'),fxDraw=fx.drawImage.bind(fx),fxClear=fx.clearRect.bind(fx)
  fx.clearRect=(...args)=>{window.particleFrames.push(window.particleDraws);window.particleFrames=window.particleFrames.slice(-500);window.particleDraws=[];fxClear(...args)}
  fx.drawImage=(img,...args)=>{const m=fx.getTransform(),s=window.__readHero();window.particleDraws.push({x:m.e/devicePixelRatio+s.camera.x,y:m.f/devicePixelRatio+s.camera.y});fxDraw(img,...args)}
  let last=performance.now()
  function monitor(now){
   const s=window.__readHero(),m=window.metrics
   m.maxFrame=Math.max(m.maxFrame,now-last);last=now
   m.peakParticles=Math.max(m.peakParticles,window.particleDraws.length)
   if(s.syncEvent){
    window.lastEvent=s.syncEvent;window.syncStartTime??=now
    const bodies=s.syncEvent.physics.bodies
    for(let i=0;i<bodies.length;i++){
     const a=bodies[i];if(a.active && (a.x-s.camera.x < -283 || a.x-s.camera.x > 1723 || a.y-s.camera.y < -283 || a.y-s.camera.y > 1183))m.invisibleActiveFrames++;if(!a.active)m.maxNeighbourDisplacement=Math.max(m.maxNeighbourDisplacement,Math.hypot(a.x-a.homeX,a.y-a.homeY))
     m.maxTurn=Math.max(m.maxTurn,Math.abs(s.syncEvent.physics.rotation(s.blobs[i])))
     for(let j=i+1;j<bodies.length;j++)m.maxOverlap=Math.max(m.maxOverlap,a.radius+bodies[j].radius-Math.hypot(a.x-bodies[j].x,a.y-bodies[j].y))
    }
    const first=s.syncEvent.physics.contacts.find(c=>c.kind==='sync')
    if(first && (now-window.syncStartTime)/1000-first.time < .75 && window.particleDraws.length>=48){
     const radii=first.ids.map(id=>bodies.find(b=>b.id===id).radius)
     for(let i=0;i<48;i++){const p=window.particleDraws[i],index=i<24?0:1,c=first.centres[index];m.particleReach=Math.max(m.particleReach,Math.hypot(p.x-c.x,p.y-c.y)/radii[index])}
    }
   }
   requestAnimationFrame(monitor)
  }
  requestAnimationFrame(monitor)
 },{base,files})
 await page.waitForTimeout(600)
 const layer=await page.evaluate(()=>{const layer=document.querySelector('body>div').shadowRoot.querySelector('.hero-particle-layer');return{pointerEvents:getComputedStyle(layer).pointerEvents,position:getComputedStyle(layer).position}})
 await page.mouse.click(720,450);await page.waitForTimeout(120)
 const empty=await page.evaluate(()=>window.particleDraws.length)
 await page.waitForTimeout(1600)
 const expired=await page.evaluate(()=>window.particleDraws.length===0)
 const direct=await page.evaluate(()=>{const s=window.__readHero(),b=s.blobs[2];return{x:b.currentX-s.camera.x,y:b.currentY-s.camera.y}})
 await page.mouse.move(direct.x,direct.y);await page.mouse.down();await page.mouse.move(direct.x+80,direct.y+40,{steps:8});await page.mouse.up()
 await page.waitForTimeout(300)
 const directResult=await page.evaluate(()=>{const b=window.__readHero().blobs[2];return{elasticReturn:!!b.elasticReturn,particles:window.particleDraws.length,dragTarget:b.dragTargetX}})
 const connection=await page.evaluate(()=>{
  const s=window.__readHero(),c=document.querySelector('body>div').shadowRoot.querySelector('canvas')
  c.setPointerCapture=()=>{};c.releasePointerCapture=()=>{}
  const source=s.nodes.find(n=>n.team===2),target=s.nodes.find(n=>n.team===6)
  const point=n=>({x:n.x-s.camera.x,y:n.y-s.camera.y})
  const a=point(source),b=point(target)
  const send=(type,p)=>c.dispatchEvent(new PointerEvent(type,{clientX:p.x,clientY:p.y,pointerId:99,pointerType:'mouse',button:0,bubbles:true}))
  window.metrics.maxFrame=0;window.particleFrames=[]
  send('pointerdown',a);send('pointermove',b)
  requestAnimationFrame(()=>requestAnimationFrame(()=>send('pointerup',b)))
  return {source:source.team,target:target.team}
 })
 await page.waitForTimeout(1000)
 await page.screenshot({path:`artifacts/hero-billiards-review/${name}-chain.png`})
 await page.waitForFunction(()=>window.lastEvent && !window.__readHero().syncEvent,{timeout:18000})
 const result=await page.evaluate(()=>{
  const event=window.lastEvent,physics=event.physics
  const pair=physics.bodies.filter(b=>b.active)
  return {metrics:window.metrics,impactAt:event.impactAt,collisions:physics.collisions,contacts:physics.contacts,launch:physics.launch,replacementFrames:window.replacementFrames,
   finalPair:pair,returnError:Math.max(...physics.bodies.filter(b=>!b.active).map(b=>Math.hypot(b.x-b.homeX,b.y-b.homeY)))}
 })
 await page.waitForTimeout(500)
 const stays=await page.evaluate(pair=>pair.every(b=>{const current=window.__readHero().blobs[b.id];return current.resting&&Math.hypot(current.currentX-b.x,current.currentY-b.y)<.01}),result.finalPair)
 const report={name,layer,empty,expired,directResult,connection,...result,stays,errors}
 fs.writeFileSync(`artifacts/hero-billiards-review/${name}.json`,JSON.stringify(report,null,2))
 console.log(name,JSON.stringify({empty,expired,directResult,collisions:result.collisions,impact:result.impactAt,metrics:result.metrics,returnError:result.returnError,replacementFrames:result.replacementFrames,stays,errors}))
 assert.equal(empty,14);assert.ok(expired);assert.equal(directResult.particles,0);assert.equal(directResult.elasticReturn,false)
 assert.equal(layer.pointerEvents,'none');assert.ok(result.impactAt!==undefined);assert.ok(result.replacementFrames>0)
 assert.deepEqual(result.metrics.wrongMapping,[]);assert.equal(result.metrics.invisibleActiveFrames,0);assert.ok(result.metrics.maxOverlap<1);assert.ok(result.collisions>=3&&result.collisions<=5,`secondary hits: ${result.collisions}`)
 assert.ok(result.metrics.particleReach>=.95,`particle orbit reach: ${result.metrics.particleReach}`);assert.ok(result.returnError<1);assert.ok(stays);assert.deepEqual(errors,[])
 await browser.close()
}})().catch(e=>{console.error(e);process.exitCode=1})
