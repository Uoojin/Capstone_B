import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {execFileSync} from 'node:child_process'
import {alphaField,paintedContact} from '../src/components/TypeInteraction/sync-artwork.js'
import {createSyncBilliards,impactBlend} from '../src/components/TypeInteraction/sync-billiards.js'
import {createSyncParticles} from '../src/components/TypeInteraction/sync-particles.js'

function field(shape){
 const alpha=new Uint8Array(110*110)
 for(let y=0;y<110;y++)for(let x=0;x<110;x++)if(shape((x+.5-55)*2,(y+.5-55)*2))alpha[y*110+x]=255
 return alphaField(alpha,110,110)
}
const disc=field((x,y)=>Math.hypot(x,y)<25),bar=field((x,y)=>Math.abs(x)<90&&Math.abs(y)<10),ring=field((x,y)=>Math.hypot(x,y)>65&&Math.hypot(x,y)<100)
const pose=(field,x,y,angle=0)=>({field,x,y,angle,baseAngle:0})
function scene(xs=[350,950,1200,1260],orbitRadius=300){
 const teams=xs.map((x,id)=>({id,currentX:x,currentY:450,baseX:x,baseY:450})),event={teamA:teams[0],teamB:teams[1],born:0},bursts=[]
 const geometry=(team,other)=>({default:disc,sync:disc,union:disc,baseAngle:0,orbitRadius,image:{owner:team.id,other:other?.id}})
 const solver=createSyncBilliards(event,teams,geometry,p=>bursts.push(p),{width:1440,height:900})
 return {teams,event,solver,bursts}
}
test('painted geometry includes holes and rotation, never the orbit',()=>{
 assert.equal(paintedContact(pose(ring,0,0),pose(disc,0,0)),null)
 assert.equal(paintedContact(pose(bar,0,0),pose(disc,0,90)),null)
 assert.ok(paintedContact(pose(bar,0,0,Math.PI/2),pose(disc,0,90)))
 assert.equal(paintedContact(pose(disc,0,0),pose(disc,0,60)),null)
})
test('only actual contacts activate SVGs and the specified burst origins',()=>{
 const {solver,teams,event,bursts}=scene()
 solver.update(1/60,1/60,{},null,false)
 assert.equal(event.impactAt,undefined);assert.equal(bursts.length,0);assert.equal(solver.visual(teams[0]).blend,0)
 let armed=true,last=0
 for(let i=1;i<6000;i++){
  const [a,b]=solver.bodies
  if(!paintedContact(a,b,6))armed=true
  solver.update((i+1)/300,1/300,{},null,false)
  const main=solver.contacts.filter(c=>c.primary)
  if(main.length>last){assert.ok(armed);armed=false;last=main.length}
  for(const c of solver.contacts){assert.ok(c.distance<=.1&&c.closing<0);assert.ok(c.ids.includes(0)||c.ids.includes(1))}
  if(solver.done)break
 }
 assert.ok(solver.done);assert.equal(solver.majorHits,5);assert.equal(solver.completionReason,'contacts')
 assert.equal(bursts.length,solver.contacts.reduce((n,c)=>n+(c.primary?2:1),0))
})
test('orbit radius affects particle distance only',()=>{
 const run=radius=>{const {solver}=scene([350,950],radius);for(let i=0;i<180;i++)solver.update((i+1)/60,1/60,{},null,false);return solver.bodies.map(b=>({x:b.x,y:b.y,angle:b.angle}))}
 assert.deepEqual(run(2),run(3000))
})
test('fixed substeps give the same motion at 30, 60 and 120 FPS',()=>{
 const run=fps=>{const {solver}=scene();for(let i=0;i<fps*3;i++)solver.update((i+1)/fps,1/fps,{},null,false);return solver.bodies}
 const expected=run(60)
 for(const fps of [30,120])for(const [i,b] of run(fps).entries())assert.ok(Math.hypot(b.x-expected[i].x,b.y-expected[i].y)<1e-6&&Math.abs(b.angle-expected[i].angle)<1e-6)
})
test('ordinary bodies cannot propagate SYNC and return after recoil',()=>{
 const {solver,teams}=scene([350,950,550,3000])
 let reacted=false
 for(let i=0;i<1500;i++){
  solver.update((i+1)/60,1/60,{},null,false)
  for(const body of solver.bodies.filter(b=>!b.primary)){
   const v=solver.visual(body.team)
   if(v.blend>0){reacted=true;assert.ok(v.otherId===0||v.otherId===1)}
  }
  if(solver.done)break
 }
 assert.ok(reacted&&solver.done)
 solver.finish()
 for(const b of solver.bodies.filter(b=>!b.primary&&b.awake))assert.ok(Math.hypot(b.team.currentX-b.homeX,b.team.currentY-b.homeY)<.7)
 for(const b of solver.bodies.filter(b=>b.primary)){assert.ok(teams[b.id].syncSettled);assert.equal(teams[b.id].baseX,b.x);assert.equal(teams[b.id].syncRestAngle,b.angle)}
})
test('ordinary-to-ordinary physical contacts never emit or assign an ordinary SVG partner',()=>{
 const {solver}=scene([350,950,550,610])
 for(let i=0;i<1200;i++){
  solver.update((i+1)/60,1/60,{},null,false)
  for(const b of solver.bodies.filter(b=>!b.primary)){
   const v=solver.visual(b.team)
   if(v.blend>0)assert.ok(v.otherId===0||v.otherId===1)
  }
  assert.ok(solver.contacts.every(c=>c.ids.includes(0)||c.ids.includes(1)))
  assert.equal(solver.bursts.length,solver.contacts.reduce((n,c)=>n+(c.primary?2:1),0))
 }
 assert.ok(solver.physicalOnlyContacts>0)
})
test('impact SVG ramp keeps the ORIGINAL 0.35 / 0.45 timings',()=>{
 const r={born:1,until:2.5}
 assert.equal(impactBlend(r,.9),0);assert.equal(impactBlend(r,1),0)
 assert.ok(Math.abs(impactBlend(r,1.175)-.5)<1e-6);assert.equal(impactBlend(r,1.36),1)
 assert.ok(Math.abs(impactBlend(r,2.275)-.5)<1e-6);assert.equal(impactBlend(r,2.5),0)
})
test('a suspended tab pauses simulation instead of expiring the event',()=>{
 const {solver,event}=scene()
 solver.update(1/60,1/60,{},null,false)
 solver.update(50,1/60,{},null,false)
 assert.ok(event.born>49);assert.ok(solver.elapsed<.04)
 assert.equal(event.impactAt,undefined);assert.equal(solver.bursts.length,0)
})
test('resize keeps body identity and uses the existing responsive home positions',()=>{
 const {solver,teams}=scene()
 const before=solver.bodies.map(b=>({id:b.id,x:b.x,y:b.y}))
 teams[2].baseX=800;teams[2].baseY=350
 solver.resize({width:1024,height:768})
 for(const [i,b] of solver.bodies.entries()){
  assert.equal(b.id,before[i].id)
  if(b.primary){assert.ok(Math.abs(b.x-before[i].x*1024/1440)<1e-8);assert.ok(Math.abs(b.y-before[i].y*768/900)<1e-8)}
 }
 assert.equal(solver.bodies[2].homeX,800);assert.equal(solver.bodies[2].homeY,350)
})
test('ORIGINAL pointer handlers, camera, connection condition and layout remain byte-identical',()=>{
 const path='src/components/TypeInteraction/type-engine.js',actual=readFileSync(path,'utf8'),baseline=execFileSync('git',['show','a566a6c:'+path],{encoding:'utf8'})
 for(const [start,end] of [
  ["    listen(canvas, 'pointerdown'",'    function stopPointerExploration()'],
  ['    function getSyncArtworkBounds','    function syncDraggedObject()'],
  ['    function syncDraggedObject()','    function setNodeLocalPosition'],
  ['    function updateSyncInteraction','    function drawSyncLink'],
  ['    function layout()','    function getTeamMembers'],
 ])assert.equal(actual.slice(actual.indexOf(start),actual.indexOf(end)),baseline.slice(baseline.indexOf(start),baseline.indexOf(end)),start)
})

test('main contacts burst at both centers; secondary contacts burst once at their painted contact',()=>{
 const {solver}=scene([350,950,550,3000])
 for(let i=0;i<1500;i++){solver.update((i+1)/60,1/60,{},null,false);if(solver.done)break}
 let offset=0,secondary=0
 for(const contact of solver.contacts){
  const events=solver.bursts.slice(offset,offset+(contact.primary?2:1));offset+=events.length
  if(contact.primary){
   assert.equal(events.length,2)
   for(const [i,event] of events.entries()){
    assert.equal(event.team,contact.ids[i]);assert.equal(event.x,contact.centres[i].x);assert.equal(event.y,contact.centres[i].y)
    assert.equal(event.time,contact.time);assert.equal(event.strong,true);assert.equal(event.normal,undefined)
   }
  }else{
   secondary++
   const [event]=events
   assert.equal(event.x,contact.x);assert.equal(event.y,contact.y);assert.equal(event.time,contact.time)
   assert.deepEqual(event.teams,contact.ids);assert.equal(event.strong,false);assert.ok(event.impactSpeed>0)
   assert.ok(Math.abs(Math.hypot(event.normal.x,event.normal.y)-1)<1e-8)
  }
 }
 assert.ok(secondary>0);assert.equal(offset,solver.bursts.length)
})

test('particle origins stay exact, full radial coverage is retained, contact spread follows normal and impact',()=>{
 const previousImage=globalThis.Image,random=Math.random
 globalThis.Image=class {complete=true;naturalWidth=26}
 Math.random=()=>.5
 try{
  function sample(contact){
   const p=createSyncParticles(['one','two','three','four']),points=[]
   const ctx={save(){},restore(){},rotate(){},drawImage(){},translate(x,y){points.push({x:x-50,y:y-70})}}
   p.burst(50,70,300,!contact,false,contact)
   const count=p.count;p.draw(ctx,0,{x:0,y:0})
   assert.ok(points.every(v=>v.x===0&&v.y===0));points.length=0
   p.draw(ctx,1,{x:0,y:0});return {count,points}
  }
  const radial=sample(undefined)
  assert.equal(radial.count,24)
  for(const sx of [-1,1])for(const sy of [-1,1])assert.ok(radial.points.filter(p=>p.x*sx>0&&p.y*sy>0).length>=4)
  assert.ok(radial.points.every(p=>Math.hypot(p.x,p.y)>250))
  const horizontal=sample({normal:{x:1,y:0},impactSpeed:1000}),vertical=sample({normal:{x:0,y:1},impactSpeed:1000})
  assert.equal(horizontal.count,20)
  for(const [i,p] of horizontal.points.entries()){
   assert.ok(Math.abs(vertical.points[i].x+p.y)<1e-8)
   assert.ok(Math.abs(vertical.points[i].y-p.x)<1e-8)
  }
  assert.ok(horizontal.points.reduce((sum,p)=>sum+p.x,0)>0)
  assert.ok(horizontal.points.reduce((sum,p)=>sum+p.x*p.x,0)>horizontal.points.reduce((sum,p)=>sum+p.y*p.y,0)*1.5)
  const weak=sample({normal:{x:1,y:0},impactSpeed:100})
  assert.ok(Math.max(...horizontal.points.map(p=>p.x))>Math.max(...weak.points.map(p=>p.x)))
 }finally{Math.random=random;if(previousImage===undefined)delete globalThis.Image;else globalThis.Image=previousImage}
})
