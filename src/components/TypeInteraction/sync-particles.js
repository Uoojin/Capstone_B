// Exact existing Shape geometries from PageTransition.jsx, without changing it.
const shapes=[
 '<circle cx="13" cy="13" r="13" fill="currentColor"/>',
 '<path d="M13 4.5 L23.5 22.5 L2.5 22.5 Z" fill="currentColor" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>',
 '<path d="M13 2 A13.5 13.5 0 0 0 24 13 A13.5 13.5 0 0 0 13 24 A13.5 13.5 0 0 0 2 13 A13.5 13.5 0 0 0 13 2 Z" fill="currentColor" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"/>',
 '<rect x="1" y="1" width="24" height="24" rx="3" fill="currentColor"/>'
]
export function createSyncParticles(symbols){
 const colors=['#FD00A0','#5F50D8','#00BFA3','#009DEB']
 const images=[...shapes.map((s,i)=>'data:image/svg+xml,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26" color="${colors[i]}">${s}</svg>`)),...symbols].map(src=>{const image=new Image();image.src=src;return image})
 let particles=[]
 return {
  burst(x,y,radius,strong=true,reduced=false,contact={}){
   const directed=!!contact.normal
   // Consolidating two secondary origins into one preserves the total quantity.
   const count=reduced?(directed?12:6):strong?24:directed?20:10,offset=Math.random()*Math.PI*2
   const energy=Math.max(0,Math.min(1,(contact.impactSpeed||0)/1000))
   for(let i=0;i<count;i++){
    const angle=offset+(i+Math.random()*.65)*Math.PI*2/count,distance=radius*(.85+Math.random()*.55)
    let dx=Math.cos(angle)*distance,dy=Math.sin(angle)*distance
    if(directed){
     // A full radial burst, elongated along the actual impulse normal with a
     // small bias toward the struck body. Stronger impacts spread farther.
     const nx=contact.normal.x,ny=contact.normal.y
     const normal=(Math.cos(angle)*(1+energy*.35)+energy*.12)*distance
     const tangent=Math.sin(angle)*(.8+energy*.2)*distance
     dx=normal*nx-tangent*ny;dy=normal*ny+tangent*nx
    }
    particles.push({x,y,dx,dy,age:0,life:.8+Math.random()*.45,size:10+Math.random()*15,rotation:Math.random()*6.28,spin:(Math.random()-.5)*9,image:images[Math.floor(Math.random()*8)]})
   }
   if(particles.length>160)particles=particles.slice(-160)
  },
  draw(ctx,dt,camera){
   particles=particles.filter(p=>p.age<p.life)
   for(const p of particles){
    p.age+=dt;const t=Math.min(1,p.age/p.life),travel=1-(1-t)**3
    if(!p.image.complete||!p.image.naturalWidth)continue
    ctx.save();ctx.translate(p.x-camera.x+p.dx*travel,p.y-camera.y+p.dy*travel)
    ctx.rotate(p.rotation+p.spin*t);ctx.globalAlpha=Math.min(1,(1-t)*3)
    ctx.drawImage(p.image,-p.size/2,-p.size/2,p.size,p.size);ctx.restore()
   }
  },
  clear(){particles=[]},get count(){return particles.length}
 }
}
