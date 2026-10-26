import { useEffect, useRef } from 'react'
import RoundedStrokeText from './RoundedStrokeText.jsx'

export default function DelightInsight() {
  const panelRef = useRef(null)
  const typeRef = useRef(null)
  useEffect(() => {
    const panel = panelRef.current
    const typography = typeRef.current
    const events = new AbortController()
    const current = { x: 0, y: 0 }
    const target = { x: 0, y: 0 }
    let frame = 0
    let lastTime = 0
    const animate = time => {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, .05) : 1 / 60
      lastTime = time
      const blend = 1 - Math.exp(-dt / .14)
      let moving = false
      for (const axis of ['x', 'y']) {
        current[axis] += (target[axis] - current[axis]) * blend
        if (Math.abs(target[axis] - current[axis]) > .01) moving = true
        else current[axis] = target[axis]
      }
      // Only viewpoint changes: the SVG remains centered at its original anchor.
      typography.style.transform = `translate(-50%, -50%) perspective(1000px) rotateX(${current.x}deg) rotateY(${current.y}deg) rotateZ(-15deg)`
      if (moving) frame = requestAnimationFrame(animate)
      else { frame = 0; lastTime = 0 }
    }
    const start = () => { if (!frame) frame = requestAnimationFrame(animate) }
    const section = panel.parentElement
    section.addEventListener('pointermove', event => {
      const rect = section.getBoundingClientRect()
      const x = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1))
      const y = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1))
      target.x = y * 25
      target.y = -x * 25
      start()
    }, { signal: events.signal })
    section.addEventListener('pointerleave', () => {
      target.x = 0; target.y = 0
      start()
    }, { signal: events.signal })
    return () => { events.abort(); cancelAnimationFrame(frame) }
  }, [])
  return (
    <section className="home-insight" aria-labelledby="home-insight-title">
      <div className="home-insight-panel" ref={panelRef}>
        <svg className="home-insight-type" aria-hidden="true" focusable="false" ref={typeRef}
          viewBox="0 0 1134.6 688" overflow="visible">
          <g textAnchor="middle" strokeLinejoin="round" strokeLinecap="round" paintOrder="stroke fill">
            <text x="567.3" y="315">LET’S</text>
            <text x="567.3" y="659">SYNC!</text>
          </g>
        </svg>
        <RoundedStrokeText outline="css" as="h2" id="home-insight-title">Delight Insight<span>2026</span></RoundedStrokeText>
        <RoundedStrokeText outline="css" as="p" className="home-insight-description">
          <span>Delight Insight는 계원예술대학교 디지털미디어디자인과 졸업 전시의 대주제입니다.</span>
          <span>이번 주제 LET’S SYNC!는 서로 다른 개성들이 관계를 맺고 영향을 주고받으며,</span>
          <span>이전에는 없던 새로운 것을 만들어가는 생성적 연결을 의미합니다.</span>
        </RoundedStrokeText>
      </div>
    </section>
  )
}
