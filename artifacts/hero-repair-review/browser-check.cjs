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
 await page.route('**/type-engine.js',async r=>{const response=await r.fetch();await r.fulfill({response,body:(await response.text()).replace('var resizeTimer = null;', 'window.readHero=()=>({nodes,blobs,camera,syncEvent,artworkGeometry,syncPairImages,draggingBlob,draggingNode,getPairArtworkBounds}); var resizeTimer = null;')})})
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
 await page.waitForTimeout(650)
 const before=await page.evaluate(()=>({...readHero().camera}))
 await page.mouse.move(1320,780)
 await page.waitForTimeout(800)
 const moved=await page.evaluate(()=>({...readHero().camera}))
 assert.ok(Math.hypot(moved.x-before.x,moved.y-before.y)>20)
 assert.equal(moved.zoom,1)
 await page.mouse.move(720,450);await page.waitForTimeout(1800)
 const dragResult=await page.evaluate(async()=>{
  const s=readHero(),c=document.querySelector('.type-interaction').shadowRoot.querySelector('#scene');c.setPointerCapture=()=>{};c.releasePointerCapture=()=>{}
  const candidates=s.nodes.filter(n=>n.team===2&&n.x-s.camera.x>40&&n.x-s.camera.x<innerWidth-40&&n.y-s.camera.y>40&&n.y-s.camera.y<innerHeight-40)
  const a=candidates.sort((a,b)=>Math.min(...s.nodes.filter(n=>n.team!==2).map(n=>Math.hypot(n.x-b.x,n.y-b.y)))-Math.min(...s.nodes.filter(n=>n.team!==2).map(n=>Math.hypot(n.x-a.x,n.y-a.y))))[0]
  if(!a)throw new Error('No visible drag control')
  const team=s.blobs[2],target=s.blobs[6],d=Math.hypot(target.currentX-team.currentX,target.currentY-team.currentY),dx=(target.currentX-team.currentX)/d,dy=(target.currentY-team.currentY)/d
  const start={x:team.currentX,y:team.currentY,cameraX:s.camera.x,cameraY:s.camera.y},screen={x:a.x-s.camera.x,y:a.y-s.camera.y}
  const send=(type,x,y)=>c.dispatchEvent(new PointerEvent(type,{clientX:x,clientY:y,pointerId:98,pointerType:'mouse',button:0,bubbles:true}))
  send('pointerdown',screen.x,screen.y);send('pointermove',screen.x+dx*85,screen.y+dy*85)
  await new Promise(r=>setTimeout(r,450))
  const current=readHero(),held=current.draggingNode===a,along=(team.currentX-start.x)*dx+(team.currentY-start.y)*dy,cameraMove=Math.hypot(current.camera.x-start.cameraX,current.camera.y-start.cameraY)
  const unconnected=!current.syncEvent
  const atRelease={x:team.currentX,y:team.currentY}
  send('pointerup',screen.x+dx*85,screen.y+dy*85)
  await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))
  return {held,along,cameraMove,unconnected,releaseStep:Math.hypot(team.currentX-atRelease.x,team.currentY-atRelease.y)}
 })
 assert.ok(dragResult.held&&dragResult.unconnected);assert.ok(dragResult.along>20);assert.ok(dragResult.cameraMove>1);assert.ok(dragResult.releaseStep<15)
 await page.evaluate(()=>{
  const s=readHero(),c=document.querySelector('.type-interaction').shadowRoot.querySelector('#scene');c.setPointerCapture=()=>{};c.releasePointerCapture=()=>{}
  const visible=n=>n.x-s.camera.x>15&&n.x-s.camera.x<innerWidth-15&&n.y-s.camera.y>15&&n.y-s.camera.y<innerHeight-15
  let a,b,d=Infinity
  for(const x of s.nodes.filter(n=>n.team===2&&visible(n)))for(const y of s.nodes.filter(n=>n.team===6&&visible(n))){const v=Math.hypot(x.x-y.x,x.y-y.y);if(v<d){a=x;b=y;d=v}}
  if(!a)throw new Error('No visible T/N controls')
  const send=(type,n)=>{const state=readHero();c.dispatchEvent(new PointerEvent(type,{clientX:n.x-state.camera.x,clientY:n.y-state.camera.y,pointerId:99,pointerType:'mouse',button:0,bubbles:true}))}
  send('pointerdown',a);send('pointermove',b)
  let frames=0
  function follow(){send('pointermove',readHero().nodes[b.idx]);if(++frames<8)requestAnimationFrame(follow);else send('pointerup',b)}requestAnimationFrame(follow)
  window.sample=[];window.lastEvent=null
  function monitor(){const s=readHero();if(s.syncEvent)lastEvent=s.syncEvent;sample.push({x:s.camera.x,y:s.camera.y,zoom:s.camera.zoom,speed:s.syncEvent?.physics.bodies.filter(b=>b.active).map(b=>Math.hypot(b.vx,b.vy))||[],spin:s.syncEvent?.physics.bodies.filter(b=>b.active).map(b=>b.omega)||[],phase:s.syncEvent?.physics.phase});if(!window.done)requestAnimationFrame(monitor)}monitor()
 })
 await page.waitForFunction(()=>window.lastEvent?.impactAt!==undefined,null,{timeout:15000})
 await page.waitForFunction(()=>window.lastEvent&&!readHero().syncEvent,null,{timeout:35000})
 const result=await page.evaluate(()=>{
  window.done=true;const p=lastEvent.physics
  return {pairCollisions:p.pairCollisions,elasticCycles:p.elasticCycles,secondaryCollisions:p.collisions,changedFrames:sample.filter((s,i)=>i&&(s.x!==sample[i-1].x||s.y!==sample[i-1].y)).length,zoomValues:[...new Set(sample.map(s=>s.zoom))],realContacts:p.contacts.every(c=>c.paintDistance<=.1),particleEvents:p.particleEvents.length,contacts:p.contacts.length,elapsed:p.elapsed,done:p.done,lastActiveSamples:sample.filter(s=>s.speed.length).slice(-30),eligibleContacts:p.contacts.every(c=>c.ids.includes(lastEvent.teamA.id)||c.ids.includes(lastEvent.teamB.id)),neighborReturn:Math.max(...p.bodies.filter(b=>!b.active).map(b=>Math.hypot(b.x-b.homeX,b.y-b.homeY)))}
 })
 assert.ok(result.lastActiveSamples.every(s=>s.speed.some(v=>v>20)));assert.ok(result.done);assert.ok(result.eligibleContacts);assert.ok(result.changedFrames>10);assert.deepEqual(result.zoomValues,[1]);assert.ok(result.pairCollisions>=3&&result.elasticCycles>=2);assert.ok(result.realContacts);assert.equal(result.particleEvents,result.contacts*2);assert.ok(result.neighborReturn<.7);assert.deepEqual(errors,[])
 fs.writeFileSync('artifacts/hero-repair-review/'+name+'.json',JSON.stringify({name,dragResult,before,moved,...result,errors},null,2));console.log(JSON.stringify({name,dragResult,pairCollisions:result.pairCollisions,elasticCycles:result.elasticCycles,elapsed:result.elapsed,done:result.done,changedFrames:result.changedFrames,neighborReturn:result.neighborReturn,errors}))
 } finally {await browser.close()}
}})().catch(e=>{console.error(e);process.exitCode=1})
