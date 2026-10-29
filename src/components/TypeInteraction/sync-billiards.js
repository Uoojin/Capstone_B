import {paintedContact,artworkPose} from './sync-artwork.js'
const STEP=1/300,TAU=Math.PI*2
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v))
// Same 0.35s fade-in / 0.45s fade-out as ORIGINAL, anchored to a real impact.
export function impactBlend(response,time){
 if(!response)return 0
 return Math.min(clamp((time-response.born)/.35,0,1),clamp((response.until-time)/.45,0,1))
}

// This controller is created ONLY by the existing triggerTeamSync event.
// All positions remain in the ORIGINAL world; it never reads/writes the camera.
export function createSyncBilliards(event,teams,geometryFor,burst,world){
 const members=new Set([event.teamA.id,event.teamB.id])
 let time=0,accumulator=0,mode='approach',majorHits=0,recoil=null,charge=0,rest=0,fadeAt=null,done=false,completionReason=null,physicalOnlyContacts=0
 const contacts=[],touching=new Set(),bursts=[]
 const bodies=teams.map(team=>{
  const geometry=geometryFor(team),field=geometry.default,primary=members.has(team.id),mass=primary?1:1.5
  return {id:team.id,team,geometry,field,baseAngle:geometry.baseAngle,x:team.currentX,y:team.currentY,angle:team.syncRestAngle||0,
   vx:0,vy:0,omega:0,primary,awake:primary,pinned:false,homeX:team.currentX,homeY:team.currentY,homeAngle:team.syncRestAngle||0,
   hitAt:-Infinity,response:null,nextResponse:null,invMass:1/mass,invInertia:1/(mass*(primary?3:1)*((field.maxX-field.minX)**2+(field.maxY-field.minY)**2)/12)}
 })
 const pair=bodies.filter(b=>b.primary),[a,b]=pair
 const angle=Math.atan2(b.y-a.y,b.x-a.x)+.18,speed=820
 a.vx=Math.cos(angle)*speed;a.vy=Math.sin(angle)*speed
 b.vx=-Math.cos(angle-.10)*speed*.55;b.vy=-Math.sin(angle-.10)*speed*.55
 event.duration=5.15 // ORIGINAL window, extended only while post-SYNC physics runs.
 const mass=body=>body.pinned||!body.awake||(!body.primary&&mode==='fade')?0:body.invMass
 const inertia=body=>mass(body)?body.invInertia:0
 const exitBlend=()=>fadeAt===null?1:clamp(1-(time-fadeAt)/.45,0,1)
 const blend=body=>impactBlend(body.response,time)*(body.primary?exitBlend():1)
 function respond(body,other){
  if(body.primary){
   const current=impactBlend(body.response,time)
   body.response={born:time-.35*current,until:time+1.5,geometry:body.geometry,otherId:other.id}
  }else{
   body.hitAt=time
   const geometry=geometryFor(body.team,other.team)
   if(body.response&&body.response.otherId!==other.id){body.nextResponse={geometry,otherId:other.id};return}
   const current=impactBlend(body.response,time)
   body.response={born:time-.35*current,until:time+1.5,geometry,otherId:other.id}
  }
 }
 function impact(x,y){
  const key=x.id+'-'+y.id,c=paintedContact(x,y)
  if(!c)return 0
  const nx=c.nx,ny=c.ny,rx=c.x-x.x,ry=c.y-x.y,sx=c.x-y.x,sy=c.y-y.y
  const rvx=y.vx-y.omega*sy-x.vx+x.omega*ry,rvy=y.vy+y.omega*sx-x.vy-x.omega*rx,closing=rvx*nx+rvy*ny
  const fresh=!touching.has(key),primary=x.primary&&y.primary
  if(closing< -10&&mode!=='fade')for(const body of [x,y])if(!body.awake){
   body.awake=true;body.hitAt=time;body.homeX=body.x;body.homeY=body.y;body.homeAngle=body.angle
  }
  const mx=mass(x),my=mass(y),sum=mx+my
  if(!sum)return 0
  const depth=Math.min(8,c.depth+.2)
  x.x-=nx*depth*mx/sum;x.y-=ny*depth*mx/sum;y.x+=nx*depth*my/sum;y.y+=ny*depth*my/sum
  if(closing>=0)return depth
  const cx=rx*ny-ry*nx,cy=sx*ny-sy*nx,denom=sum+cx*cx*inertia(x)+cy*cy*inertia(y)
  const charged=primary&&fresh&&(mode==='approach'||recoil?.mode==='attract')
  const restitution=primary ? .96 : fresh ? .83 : 0
  const outgoing=charged?Math.max(-closing*restitution,Math.min(850,Math.sqrt(2*Math.max(charge,120000)))):-closing*restitution
  const impulse=(-closing+outgoing)/Math.max(.001,denom)
  const tangent=rvx*-ny+rvy*nx,tx=rx*nx+ry*ny,ty=sx*nx+sy*ny
  const friction=clamp(-tangent/(sum+tx*tx*inertia(x)+ty*ty*inertia(y)),-impulse*.12,impulse*.12)
  const ix=impulse*nx-friction*ny,iy=impulse*ny+friction*nx
  const before=[{vx:x.vx,vy:x.vy,omega:x.omega},{vx:y.vx,vy:y.vy,omega:y.omega}]
  x.vx-=ix*mx;x.vy-=iy*mx;y.vx+=ix*my;y.vy+=iy*my
  x.omega=clamp(x.omega-(rx*iy-ry*ix)*inertia(x),-7,7);y.omega=clamp(y.omega+(sx*iy-sy*ix)*inertia(y),-7,7)
  if(!fresh||closing> -25||x.pinned||y.pinned)return depth
  touching.add(key)
  if(!x.primary&&!y.primary)physicalOnlyContacts++
  if(mode==='fade'||(!x.primary&&!y.primary)||(!primary&&mode==='approach'))return depth
  if(primary){
   const gap=Math.hypot(x.x-y.x,x.y-y.y)
   if(mode==='approach'||recoil?.mode==='attract'){
    if(mode==='approach'||recoil.peak-recoil.gap>=100)majorHits++
    charge=0;mode=majorHits>=5?'release':'play'
    if(majorHits>=5)completionReason='contacts'
    recoil={mode:'recoil',gap,peak:gap,target:gap+210}
   }
   event.impactAt??=time
  }
  respond(x,y);respond(y,x)
  const record={time,ids:[x.id,y.id],primary,majorHits,x:c.x,y:c.y,distance:c.distance,closing,
   centres:[{x:x.x,y:x.y},{x:y.x,y:y.y}],before,after:[{vx:x.vx,vy:x.vy,omega:x.omega},{vx:y.vx,vy:y.vy,omega:y.omega}]}
  contacts.push(record)
  // Presentation only: two center bursts for the main pair, one shared painted
  // contact burst for a secondary impact. Never feed this data into the solver.
  const emissions=primary ? [x,y].map(body=>({time,team:body.id,x:body.x,y:body.y,radius:body.geometry.orbitRadius,strong:true})) : [{
   time,teams:[x.id,y.id],x:c.x,y:c.y,radius:(x.geometry.orbitRadius+y.geometry.orbitRadius)/2,strong:false,
   normal:{x:nx*(x.primary?1:-1),y:ny*(x.primary?1:-1)},impactSpeed:-closing
  }]
  for(const data of emissions){
   bursts.push(data);burst(data)
  }
  return depth
 }
 function tether(h){
  if(mode!=='approach'&&mode!=='play')return
  if(a.pinned||b.pinned)return
  const anchor=(body,sign)=>{
   const angle=body.baseAngle+body.angle,c=Math.cos(angle),s=Math.sin(angle)
   const x=(body.geometry.default.maxX-body.geometry.default.minX)*.14*sign,y=(body.geometry.default.maxY-body.geometry.default.minY)*.08
   return {x:x*c-y*s,y:x*s+y*c}
  }
  const ra=mode==='approach'?{x:0,y:0}:anchor(a,1),rb=mode==='approach'?{x:0,y:0}:anchor(b,-1),dx=b.x+rb.x-a.x-ra.x,dy=b.y+rb.y-a.y-ra.y,d=Math.hypot(dx,dy)||1,gap=Math.hypot(b.x-a.x,b.y-a.y)
  if(recoil?.mode==='recoil'){
   recoil.peak=Math.max(recoil.peak,gap)
   const radial=((b.vx-a.vx)*(b.x-a.x)+(b.vy-a.vy)*(b.y-a.y))/Math.max(1,gap)
   if(gap>=recoil.target||(recoil.peak-recoil.gap>130&&radial<0)||(Math.hypot(a.vx,a.vy)<45&&Math.hypot(b.vx,b.vy)<45)){
    recoil.mode='attract';rest=0
   }else return
  }
  rest ||= Math.max(8,Math.min(a.geometry.default.radius,b.geometry.default.radius)*.18)
  const nx=dx/d,ny=dy/d,relative=(b.vx-b.omega*rb.y-a.vx+a.omega*ra.y)*nx+(b.vy+b.omega*rb.x-a.vy-a.omega*ra.x)*ny,stretch=Math.max(0,d-rest)
  charge=Math.max(charge,.5*12*stretch*stretch)
  const force=clamp(stretch*12+relative*.6,0,3400),fx=nx*force,fy=ny*force
  a.vx+=fx*h;a.vy+=fy*h;b.vx-=fx*h;b.vy-=fy*h
  if(mode==='approach'){
   const tangent=(b.vx-a.vx)*-ny+(b.vy-a.vy)*nx,friction=tangent*Math.min(.5,h*1.5)
   a.vx-=ny*friction;a.vy+=nx*friction;b.vx+=ny*friction;b.vy-=nx*friction
  }
  a.omega=clamp(a.omega+(ra.x*fy-ra.y*fx)*a.invInertia*h,-7,7);b.omega=clamp(b.omega-(rb.x*fy-rb.y*fx)*b.invInertia*h,-7,7)
 }
 function steer(body,h){
  if(!body.primary||body.pinned)return
  const pose=artworkPose(body),zone=120
  const f=(d,v)=>{const q=Math.max(0,1-d/zone);return Math.min(6000,2500*q*q+Math.max(0,v)*6*Math.min(1,q))}
  const mx=Math.min(pose.rx+16,world.width*.16),my=Math.min(pose.ry+16,world.height*.16)
  body.vx+=(f(body.x-mx,-body.vx)-f(world.width-mx-body.x,body.vx))*h
  body.vy+=(f(body.y-my,-body.vy)-f(world.height-my-body.y,body.vy))*h
 }
 function returned(body){
  const home=body.homeAngle+Math.round((body.angle-body.homeAngle)/TAU)*TAU
  return !body.awake||(Math.hypot(body.x-body.homeX,body.y-body.homeY)<.6&&Math.hypot(body.vx,body.vy)<6&&Math.abs(body.angle-home)<.006&&Math.abs(body.omega)<.04&&blend(body)===0&&!body.nextResponse)
 }
 function step(h){
  time+=h
  if(time>20&&(mode==='approach'||mode==='play')){mode='release';completionReason='safety'}
  for(const body of bodies){
   if(body.response&&time>=body.response.until){
    body.response=body.nextResponse?{...body.nextResponse,born:time,until:time+1.5}:null;body.nextResponse=null
   }
   const geometry=body.primary?body.geometry:body.response?.geometry||body.geometry,opacity=blend(body)
   body.field=opacity>.02?(opacity>.98?geometry.sync:geometry.union):geometry.default
   if(!body.awake||body.pinned)continue
   if(!body.primary&&time-body.hitAt>.55){
    const home=body.homeAngle+Math.round((body.angle-body.homeAngle)/TAU)*TAU
    body.vx+=((body.homeX-body.x)*30-body.vx*8.5)*h;body.vy+=((body.homeY-body.y)*30-body.vy*8.5)*h
    body.omega+=((home-body.angle)*18-body.omega*7)*h
   }else{
    const roll=(body.vx*.85+body.vy*.65)/Math.max(60,body.field.radius*.5)
    body.omega+=(roll-body.omega)*Math.min(1,h*2.3)
    body.omega*=Math.exp(-h*.35)
    const drag=body.primary ? (mode==='fade' ? 5 : mode==='release' ? .45 : .1) : .9
    body.vx*=Math.exp(-h*drag);body.vy*=Math.exp(-h*drag)
    if(mode==='fade'&&body.primary)body.omega*=Math.exp(-h*5)
   }
   steer(body,h)
   const speed=Math.hypot(body.vx,body.vy);if(speed>1150){body.vx*=1150/speed;body.vy*=1150/speed}
   body.x+=body.vx*h;body.y+=body.vy*h;body.angle+=body.omega*h
  }
  tether(h)
  for(const key of touching){const [x,y]=key.split('-').map(Number);if(!paintedContact(bodies.find(b=>b.id===x),bodies.find(b=>b.id===y),6))touching.delete(key)}
  for(let pass=0;pass<18;pass++){
   let depth=0
   for(let i=0;i<bodies.length;i++)for(let j=i+1;j<bodies.length;j++)if(bodies[i].awake||bodies[j].awake)depth=Math.max(depth,impact(bodies[i],bodies[j]))
   if(depth<.4)break
  }
  if(mode==='release'&&(bodies.filter(b=>!b.primary).every(returned)||time>25)){mode='fade';fadeAt=time}
  if(mode==='fade'&&exitBlend()===0&&pair.every(b=>Math.hypot(b.vx,b.vy)<6&&Math.abs(b.omega)<.045)&&bodies.filter(b=>!b.primary).every(returned))done=true
 }
 return {
  update(age,dt,view,pinned,reduced){
   if(done)return
   const missed=age-(time+accumulator+dt);if(missed>.075){event.born+=missed;age-=missed}
   for(const body of bodies){
    body.pinned=body.team===pinned
    if(body.pinned||!body.awake){body.x=body.team.currentX;body.y=body.team.currentY;if(body.pinned){body.vx=body.vy=body.omega=0;body.homeX=body.x;body.homeY=body.y}}
   }
   accumulator+=dt*(reduced ? .6 : 1)
   while(accumulator+1e-10>=STEP){step(STEP);accumulator-=STEP}
   for(const body of bodies)if(body.awake){body.team.currentX=body.x;body.team.currentY=body.y}
   // Event lifetime follows completion, not a count-triggered stationary wait.
   event.duration=Math.max(5.15,time+1)
   if(done)event.duration=age-.001
  },
  owns(team){const b=bodies.find(b=>b.team===team);return !!b?.awake},
  rotation(team){return bodies.find(b=>b.team===team)?.angle||0},
  visual(team){const b=bodies.find(b=>b.team===team);return b?{blend:blend(b),otherId:b.primary?(b===a?event.teamB.id:event.teamA.id):b.response?.otherId}:null},
  finish(){
   for(const body of bodies){
    if(body.primary){body.team.syncSettled=true;body.team.baseX=body.x;body.team.baseY=body.y;body.team.velocityX=body.team.velocityY=0;body.team.syncRestAngle=body.angle}
    else if(body.awake){body.team.currentX=body.homeX;body.team.currentY=body.homeY;body.team.syncRestAngle=body.homeAngle}
   }
  },
  resize(next){
   const sx=next.width/world.width,sy=next.height/world.height
   for(const body of bodies){
    if(body.awake){body.x*=sx;body.y*=sy;body.vx*=sx;body.vy*=sy}
    else {body.x=body.team.currentX;body.y=body.team.currentY}
    if(!body.primary){body.homeX=body.team.baseX;body.homeY=body.team.baseY}
    body.team.currentX=body.x;body.team.currentY=body.y
   }
   if(recoil){const gap=Math.hypot(a.x-b.x,a.y-b.y),change=gap-recoil.gap;recoil.gap+=change;recoil.target+=change;recoil.peak=Math.max(recoil.peak,gap)}
   touching.clear();world=next
  },
  get done(){return done},get phase(){return mode},get elapsed(){return time},get majorHits(){return majorHits},get completionReason(){return completionReason},get recoil(){return recoil?{...recoil}:null},
  get contacts(){return contacts},get bursts(){return bursts},get bodies(){return bodies},get physicalOnlyContacts(){return physicalOnlyContacts}
 }
}
