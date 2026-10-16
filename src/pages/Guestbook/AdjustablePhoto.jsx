import { useRef, useState } from 'react'

export default function AdjustablePhoto({ src }) {
  const areaRef = useRef(null)
  const imageRef = useRef(null)
  const dragRef = useRef(null)
  const [position, setPosition] = useState({ x: 0.5, y: 0.5 })

  function startDrag(event) {
    if (event.button !== 0 || dragRef.current) return
    const area = areaRef.current.getBoundingClientRect()
    const image = imageRef.current
    if (!image.naturalWidth || !area.width || !area.height) return
    const cover = Math.max(area.width / image.naturalWidth, area.height / image.naturalHeight)
    event.preventDefault()
    dragRef.current = {
      id: event.pointerId, clientX: event.clientX, clientY: event.clientY, ...position,
      overflowX: Math.max(0, image.naturalWidth * cover - area.width),
      overflowY: Math.max(0, image.naturalHeight * cover - area.height),
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function movePhoto(event) {
    const drag = dragRef.current
    if (!drag || drag.id !== event.pointerId) return
    setPosition({
      x: drag.overflowX > 0.01 ? Math.max(0, Math.min(1, drag.x - (event.clientX - drag.clientX) / drag.overflowX)) : 0.5,
      y: drag.overflowY > 0.01 ? Math.max(0, Math.min(1, drag.y - (event.clientY - drag.clientY) / drag.overflowY)) : 0.5,
    })
  }

  function endDrag(event) {
    if (dragRef.current?.id !== event.pointerId) return
    dragRef.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }

  return (
    <div className="gb-adjustable-photo" ref={areaRef}>
      <div className="gb-adjustable-photo__surface" aria-label="사진을 드래그하여 표시 위치 조절"
        onPointerDown={startDrag} onPointerMove={movePhoto} onPointerUp={endDrag}
        onPointerCancel={endDrag} onLostPointerCapture={() => { dragRef.current = null }}>
        <img ref={imageRef} src={src} alt="" draggable={false} className="gb-adjustable-photo__image"
          style={{ objectPosition: `${position.x * 100}% ${position.y * 100}%` }} />
      </div>
    </div>
  )
}
