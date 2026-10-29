// Read-only raster geometry of the existing SVGs. Nothing is written to an asset.
export function alphaField(alpha,w,h,cell=2) {
 const occupied=Uint8Array.from(alpha,a=>a>40?1:0),n=w*h
 function transform(value){
  const d=Float32Array.from(occupied,a=>a===value?0:1e6),diagonal=Math.SQRT2
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
   const i=y*w+x
   if(x)d[i]=Math.min(d[i],d[i-1]+1)
   if(y)d[i]=Math.min(d[i],d[i-w]+1)
   if(x&&y)d[i]=Math.min(d[i],d[i-w-1]+diagonal)
   if(x<w-1&&y)d[i]=Math.min(d[i],d[i-w+1]+diagonal)
  }
  for(let y=h-1;y>=0;y--)for(let x=w-1;x>=0;x--){
   const i=y*w+x
   if(x<w-1)d[i]=Math.min(d[i],d[i+1]+1)
   if(y<h-1)d[i]=Math.min(d[i],d[i+w]+1)
   if(x<w-1&&y<h-1)d[i]=Math.min(d[i],d[i+w+1]+diagonal)
   if(x&&y<h-1)d[i]=Math.min(d[i],d[i+w-1]+diagonal)
  }
  return d
 }
 const toInside=transform(1),toOutside=transform(0),sdf=new Float32Array(n),edge=[]
 let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const i=y*w+x;sdf[i]=(occupied[i]?-toOutside[i]+.5:toInside[i]-.5)*cell
  if(!occupied[i])continue
  const px=(x+.5-w/2)*cell,py=(y+.5-h/2)*cell
  minX=Math.min(minX,px);maxX=Math.max(maxX,px);minY=Math.min(minY,py);maxY=Math.max(maxY,py)
  if(!x||!y||x===w-1||y===h-1||!occupied[i-1]||!occupied[i+1]||!occupied[i-w]||!occupied[i+w])edge.push({x:px,y:py})
 }
 const distance=(x,y)=>{
  const fx=x/cell+w/2-.5,fy=y/cell+h/2-.5
  if(fx<0||fy<0||fx>w-1||fy>h-1)return Math.hypot(Math.max(0,minX-x,x-maxX),Math.max(0,minY-y,y-maxY))+cell
  const ix=Math.floor(fx),iy=Math.floor(fy),jx=Math.min(w-1,ix+1),jy=Math.min(h-1,iy+1),u=fx-ix,v=fy-iy
  return (sdf[iy*w+ix]*(1-u)+sdf[iy*w+jx]*u)*(1-v)+(sdf[jy*w+ix]*(1-u)+sdf[jy*w+jx]*u)*v
 }
 return {edge,distance,minX,maxX,minY,maxY,radius:Math.max(1,...edge.map(p=>Math.hypot(p.x,p.y)))}
}

export function createArtworkReader(images,angles,size) {
 const cache=new WeakMap()
 function read(image){
  if(!image?.complete||!image.naturalWidth)return null
  if(cache.has(image))return cache.get(image)
  const side=Math.ceil(size/2)+6,canvas=document.createElement('canvas');canvas.width=canvas.height=side
  const ctx=canvas.getContext('2d',{willReadFrequently:true}),scale=(size/2)/Math.max(image.naturalWidth,image.naturalHeight)
  ctx.drawImage(image,(side-image.naturalWidth*scale)/2,(side-image.naturalHeight*scale)/2,image.naturalWidth*scale,image.naturalHeight*scale)
  const rgba=ctx.getImageData(0,0,side,side).data,alpha=new Uint8Array(side*side)
  for(let i=0;i<alpha.length;i++)alpha[i]=rgba[i*4+3]
  const field=alphaField(alpha,side,side);cache.set(image,field);return field
 }
 const unions=new WeakMap()
 return (team,replacement=null)=>{
  const base=read(images[team.id]),sync=read(replacement)||base
  if(!base)return null
  let union=base
  if(sync!==base){
   let map=unions.get(base);if(!map){map=new WeakMap();unions.set(base,map)}
   if(!map.has(sync))map.set(sync,{
    minX:Math.min(base.minX,sync.minX),maxX:Math.max(base.maxX,sync.maxX),minY:Math.min(base.minY,sync.minY),maxY:Math.max(base.maxY,sync.maxY),radius:Math.max(base.radius,sync.radius),
    edge:[...base.edge.filter(p=>sync.distance(p.x,p.y)>=-1),...sync.edge.filter(p=>base.distance(p.x,p.y)>=-1)],distance:(x,y)=>Math.min(base.distance(x,y),sync.distance(x,y))
   })
   union=map.get(sync)
  }
  return {default:base,sync,union,image:replacement,baseAngle:angles[team.id]*Math.PI/180}
 }
}

export function artworkPose(b){
 const angle=b.baseAngle+b.angle,c=Math.cos(angle),s=Math.sin(angle),f=b.field
 return {c,s,rx:Math.max(-f.minX,f.maxX)*Math.abs(c)+Math.max(-f.minY,f.maxY)*Math.abs(s),ry:Math.max(-f.minX,f.maxX)*Math.abs(s)+Math.max(-f.minY,f.maxY)*Math.abs(c)}
}
export function paintedContact(a,b,tolerance=.1){
 const ap=artworkPose(a),bp=artworkPose(b)
 if(Math.abs(a.x-b.x)>ap.rx+bp.rx+tolerance+1||Math.abs(a.y-b.y)>ap.ry+bp.ry+tolerance+1)return null
 let best=null
 for(const [source,target,sp,tp,sign] of [[a,b,ap,bp,-1],[b,a,bp,ap,1]]){
  const dc=sp.c*tp.c+sp.s*tp.s,ds=sp.s*tp.c-sp.c*tp.s,ox=(source.x-target.x)*tp.c+(source.y-target.y)*tp.s,oy=-(source.x-target.x)*tp.s+(source.y-target.y)*tp.c
  for(const p of source.field.edge){
   const lx=p.x*dc-p.y*ds+ox,ly=p.x*ds+p.y*dc+oy
   if(lx<target.field.minX-tolerance-2||lx>target.field.maxX+tolerance+2||ly<target.field.minY-tolerance-2||ly>target.field.maxY+tolerance+2)continue
   const d=target.field.distance(lx,ly)
   if(d>tolerance||(best&&d>=best.distance))continue
   best={x:source.x+p.x*sp.c-p.y*sp.s,y:source.y+p.x*sp.s+p.y*sp.c,lx,ly,target,tp,sign,distance:d,depth:Math.max(.1,1-d)}
  }
 }
 if(!best)return null
 const {target,tp,lx,ly,sign}=best,gx=target.field.distance(lx+2,ly)-target.field.distance(lx-2,ly),gy=target.field.distance(lx,ly+2)-target.field.distance(lx,ly-2)
 let nx=(gx*tp.c-gy*tp.s)*sign,ny=(gx*tp.s+gy*tp.c)*sign,length=Math.hypot(nx,ny)
 if(length<.01){nx=b.x-a.x;ny=b.y-a.y;length=Math.hypot(nx,ny)||1}
 return {x:best.x,y:best.y,nx:nx/length,ny:ny/length,distance:best.distance,depth:best.depth}
}
