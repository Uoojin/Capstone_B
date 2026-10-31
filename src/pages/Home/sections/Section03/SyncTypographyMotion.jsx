import { useEffect, useRef } from 'react'
import { startSyncTypographyMotion } from './sync-typography-motion.js'

export default function SyncTypographyMotion() {
  const canvasRef = useRef(null)
  useEffect(() => startSyncTypographyMotion(canvasRef.current), [])
  return (
    <div className="home-sync-typography" style={{ width: '100%', aspectRatio: '6 / 1'}}>
      <canvas ref={canvasRef} role="img" aria-label="LET’S SYNC · PULL SYNCOPATE · PLAY SYNCOPATE 모션 그래픽"
        style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  )
}
