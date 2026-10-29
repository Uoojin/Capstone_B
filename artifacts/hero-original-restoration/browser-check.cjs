const {chromium,webkit}=require('/Users/yujin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict'),{execFileSync}=require('child_process'); const gitFile=p=>execFileSync('git',['show','73651e0:src/components/TypeInteraction/'+p],{encoding:'utf8'})
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
 await page.route('**/type-engine.js',async r=>{const response=await r.fetch();await r.fulfill({response,body:(await response.text()).replace('var resizeTimer = null;','window.readHero=()=>({nodes,blobs,camera,syncEvent,draggingNode,draggingBlob,getSyncTypographyImage,letterImages,LETTER_VISUAL_ANGLES,t:(performance.now()-start)/1000}); var resizeTimer = null;')})})
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
  const s=readHero(),c=document.querySelector('.type-interaction').shadowRoot.querySelector('#scene'),ctx=c.getContext('2d'),draw=ctx.drawImage.bind(ctx)
  window.audit={frames:[],firstReplacement:null,lastEvent:null}
  ctx.drawImage=(img,...args)=>{
   const state=readHero(),e=state.syncEvent
   if(e&&ctx.globalAlpha>.01&&img===state.getSyncTypographyImage(e.teamA.id,state.t)&&!audit.firstReplacement){
    audit.firstReplacement={age:state.t-e.born,alpha:ctx.globalAlpha,src:img.src}

   }
   draw(img,...args)
  }
  const visible=n=>n.x-s.camera.x>15&&n.x-s.camera.x<innerWidth-15&&n.y-s.camera.y>15&&n.y-s.camera.y<innerHeight-15
  let a,b,d=Infinity
  for(const x of s.nodes.filter(n=>n.team===2&&visible(n)))for(const y of s.nodes.filter(n=>n.team===6&&visible(n))){const v=Math.hypot(x.x-y.x,x.y-y.y);if(v<d){a=x;b=y;d=v}}
  if(!a)throw new Error('No visible T/N controls')
  const before={x:s.blobs[2].currentX,y:s.blobs[2].currentY,cameraX:s.camera.x,cameraY:s.camera.y}
  const send=(type,n)=>{const state=readHero();c.dispatchEvent(new PointerEvent(type,{clientX:n.x-state.camera.x,clientY:n.y-state.camera.y,pointerId:99,pointerType:'mouse',button:0,bubbles:true}))}
  send('pointerdown',a);send('pointermove',b)
  let frames=0;function follow(){send('pointermove',readHero().nodes[b.idx]);if(++frames<8)requestAnimationFrame(follow);else send('pointerup',b)}requestAnimationFrame(follow)
  function monitor(){const s=readHero(),e=s.syncEvent;if(e){audit.lastEvent={motion:e.motion,born:e.born,duration:e.duration};audit.frames.push({age:s.t-e.born,bodyMove:Math.hypot(e.teamA.currentX-before.x,e.teamA.currentY-before.y),cameraMove:Math.hypot(s.camera.x-before.cameraX,s.camera.y-before.cameraY)})}if(!window.done)requestAnimationFrame(monitor)}monitor()
 },base)
 await page.waitForTimeout(6500)
 const result=await page.evaluate(()=>{window.done=true;return {event:audit.lastEvent,firstReplacement:audit.firstReplacement,first:audit.frames[0],mid:audit.frames.find(f=>f.age>.8),maxBodyMove:Math.max(...audit.frames.map(f=>f.bodyMove)),maxCameraMove:Math.max(...audit.frames.map(f=>f.cameraMove)),finished:!readHero().syncEvent}})
 assert.equal(result.event?.motion,'ORIGINAL');assert.ok(result.maxBodyMove>10);assert.ok(result.firstReplacement);assert.ok(drag.held&&drag.unconnected);assert.equal(result.event.duration,5.15);assert.ok(result.firstReplacement.age>.28&&result.firstReplacement.age<.4);assert.ok(result.finished);assert.deepEqual(errors,[])
 fs.writeFileSync('artifacts/hero-original-restoration/'+name+'.json',JSON.stringify({name,direct,drag,...result,errors},null,2));console.log(JSON.stringify({name,direct,drag,...result,errors}))
 } finally {await browser.close()}
}})().catch(e=>{console.error(e);process.exitCode=1})
