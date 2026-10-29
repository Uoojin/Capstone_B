const {chromium,webkit}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs=require('fs'),path=require('path');
const base=process.env.HERO_TEST_URL || 'http://127.0.0.1:5180/Capstone_B';
const assetDir=path.join(process.cwd(),'src/assets/type');
const files=fs.readdirSync(assetDir,{recursive:true}).filter(f=>f.endsWith('.svg'));
(async()=>{for(const [name,type] of Object.entries({chromium,webkit})){
 const browser=await type.launch({headless:true,...(name==='chromium'?{channel:'chrome'}:{})});
 const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/__hero_test',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><html><body></body></html>'}));
 await page.route('**/type-engine.js',async route=>{const response=await route.fetch();const source=await response.text();await route.fulfill({response,body:source.replace('var resizeTimer = null;', 'window.__readHero=()=>({nodes,blobs,camera,syncEvent,draggingNode,draggingBlob}); var resizeTimer = null;')})});
 await page.goto(base+'/__hero_test');
 await page.evaluate(async({base,files})=>{
  document.body.innerHTML=''; document.body.style.margin='0';const style=document.createElement('style');style.textContent='.type-cursor-layer{pointer-events:none;position:fixed;inset:0}.type-click-cursor{position:absolute;pointer-events:none}';document.head.append(style);
  const host=document.createElement('div'); host.style.cssText='position:fixed;inset:0'; document.body.append(host);
  const shadow=host.attachShadow({mode:'open'}),canvas=document.createElement('canvas'); shadow.append(canvas);
  const ctx=canvas.getContext('2d'),draw=ctx.drawImage.bind(ctx),arc=ctx.arc.bind(ctx),clear=ctx.clearRect.bind(ctx);
  window.draws=[];window.dots=[];window.frames=[];
  ctx.clearRect=(...args)=>{window.frames.push(window.draws);window.frames=window.frames.slice(-350);window.draws=[];window.dots=[];clear(...args)};
  ctx.drawImage=(img,...args)=>{const m=ctx.getTransform();window.draws.push({src:img.src||'',x:m.e/devicePixelRatio,y:m.f/devicePixelRatio,w:args[2],h:args[3]});draw(img,...args)};
  ctx.arc=(x,y,r,...args)=>{if(r===6)window.dots.push({x,y});arc(x,y,r,...args)};
  const {default:start}=await import(base+'/src/components/TypeInteraction/type-engine.js');
  window.stopEngine=start({host,canvas,placementSeed:.42,assetMap:Object.fromEntries(files.map(f=>[f,base+'/src/assets/type/'+f]))});
 },{base,files});
 await page.waitForTimeout(700);
 const read=()=>page.evaluate(()=>({letters:window.draws.filter(d=>d.src.includes('_default.svg')),particles:window.draws.filter(d=>d.src.includes('data:')||d.src.includes('/symbol/')),dots:window.dots}));
 const initial=await read();
 // Choose genuinely empty space clear of the painted artwork and dot neighbourhoods.
 const empty={x:720,y:450};
 await page.mouse.click(empty.x,empty.y); await page.waitForTimeout(120);
 const burst=await read();
 await page.waitForTimeout(1700);
 const settled=await read();
 const visible=settled.letters.find(l=>l.x>250&&l.x<1190&&l.y>220&&l.y<680);
 let dragResult=null;
 if(visible){
  const hit=await page.evaluate(async letter=>{
   const img=new Image();img.src=letter.src;await img.decode();const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;const ctx=c.getContext('2d');ctx.drawImage(img,0,0);
   const pixels=ctx.getImageData(0,0,c.width,c.height).data;
   for(let y=Math.floor(c.height*.3);y<c.height*.7;y++)for(let x=Math.floor(c.width*.3);x<c.width*.7;x++)if(pixels[(y*c.width+x)*4+3]>200 && [-3,0,3].every(dx=>[-3,0,3].every(dy=>pixels[((y+dy)*c.width+x+dx)*4+3]>200))){
    const id=['L','E','T','S1','S2','Y','N','C'].indexOf(letter.src.split('/').pop().replace('_default.svg',''));const angle=[-11,8,-6,14,-18,5,12,-9][id]*Math.PI/180;
    const scale=400/Math.max(c.width,c.height),dx=(x-c.width/2)*scale,dy=(y-c.height/2)*scale;
    return {x:letter.x+dx*Math.cos(angle)-dy*Math.sin(angle),y:letter.y+dx*Math.sin(angle)+dy*Math.cos(angle)};
   }
  },visible);
  await page.evaluate(()=>{window.frames=[]});
  await page.mouse.move(hit.x,hit.y);await page.mouse.down();await page.mouse.move(hit.x+95,hit.y+55,{steps:12});await page.mouse.up();
  await page.waitForTimeout(1700);
  const after=await read();dragResult={before:visible,after:after.letters.find(l=>l.src===visible.src),relativeShiftIncludingIdleMotion:(()=>{const own=after.letters.find(l=>l.src===visible.src),ref=settled.letters.find(l=>l.src!==visible.src),refAfter=after.letters.find(l=>l.src===ref.src);return Math.hypot((own.x-refAfter.x)-(visible.x-ref.x),(own.y-refAfter.y)-(visible.y-ref.y))})(),maxReturnParticles:await page.evaluate(()=>Math.max(...window.frames.map(frame=>frame.filter(d=>d.src.includes('data:')||d.src.includes('/symbol/')).length)))};
 }
 await page.evaluate(()=>{window.frames=[]});
 const pair=await page.evaluate(()=>{
  const state=window.__readHero();
  const dots=state.nodes.map(n=>({x:n.x-state.camera.x,y:n.y-state.camera.y,team:n.team})).filter(d=>d.x>30&&d.x<1410&&d.y>30&&d.y<870);
  let best=null,distance=Infinity;
  for(const a of dots)for(const b of dots)if(a.team!==b.team){const d=Math.hypot(a.x-b.x,a.y-b.y);if(d>45&&d<distance){distance=d;best={a,b,distance:d}}}
  return best;
 });
 if(pair){
  await page.evaluate(pair=>{
   const c=document.querySelector('body>div').shadowRoot.querySelector('canvas');
   c.setPointerCapture=()=>{};c.releasePointerCapture=()=>{};
   const send=(type,p)=>c.dispatchEvent(new PointerEvent(type,{clientX:p.x,clientY:p.y,pointerId:99,pointerType:'mouse',button:0,bubbles:true}));
   send('pointerdown',pair.a);send('pointermove',pair.b);
   requestAnimationFrame(()=>requestAnimationFrame(()=>send('pointerup',pair.b)));
  },pair);
  await page.waitForTimeout(2600);
 }
 const syncGesture=await page.evaluate(()=>({activeEvent:!!window.__readHero().syncEvent,impactAt:window.__readHero().syncEvent?.impactAt,replacementFrames:window.frames.filter(frame=>frame.some(d=>/\/type\/[^/]+\//.test(d.src))).length,peakParticles:Math.max(0,...window.frames.map(frame=>frame.filter(d=>d.src.includes('data:')||d.src.includes('/symbol/')).length))}));
 const pairIds=await page.evaluate(()=>{const event=window.__readHero().syncEvent;return event?[event.teamA.id,event.teamB.id]:[]});
 await page.waitForTimeout(3000);
 const final=await page.evaluate(ids=>ids.map(id=>{const b=window.__readHero().blobs[id];return {x:b.currentX,y:b.currentY,resting:b.resting}}),pairIds);
 await page.waitForTimeout(500);
 const stays=await page.evaluate(({ids,final})=>ids.length===2&&ids.every((id,i)=>{const b=window.__readHero().blobs[id];return b.resting&&Math.hypot(b.currentX-final[i].x,b.currentY-final[i].y)<.01}),{ids:pairIds,final});
 if(burst.particles.length!==14 || !dragResult?.maxReturnParticles || !syncGesture.activeEvent || !syncGesture.replacementFrames || !stays || errors.length) throw new Error(name+' interaction verification failed');
 const data={finalPairStays:stays,initialLetters:initial.letters.length,emptyClickParticles:burst.particles.length,particlesExpired:settled.particles.length===0,dragResult,syncGesture,errors};
 fs.mkdirSync('artifacts/hero-particle-review',{recursive:true});fs.writeFileSync(`artifacts/hero-particle-review/${name}.json`,JSON.stringify(data,null,2));
 await page.screenshot({path:`artifacts/hero-particle-review/${name}.png`});
 console.log(name,JSON.stringify(data));await browser.close();
}})();
