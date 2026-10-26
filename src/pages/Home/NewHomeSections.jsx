import { useEffect, useRef } from 'react'
import syncopateFilm from '../../assets/sync_opate.webm'
import letsSync from "../../assets/LET'SSYNC!.svg"

const decorations = [
  [6, 16, 'triangle'], [15, 15, 'square'], [50, 24, 'square'], [67, 13, 'triangle'],
  [72, 13, 'square'], [74.5, 19.5, 'square'], [86, 22, 'star'], [96, 6.5, 'star'],
  [8.5, 47, 'triangle'], [11, 53, 'star'], [22, 63, 'square'], [41, 74, 'square'],
  [58, 40, 'star'], [65, 49, 'circle'], [82.5, 35, 'square'], [96.5, 43, 'star'],
  [92, 52, 'circle'], [6.7, 84, 'circle'], [37, 82, 'star'], [60.5, 89, 'triangle'],
  [86, 82, 'star'], [89, 89, 'circle'],
]

export function SparkBanner() {
  const sectionRef = useRef(null)
  const decorationRef = useRef(null)
  const cursorRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const shapes = [...decorationRef.current.children]
    const layer = cursorRef.current
    const events = new AbortController()
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const particles = new Set()
    let frame = null
    let elapsed = 0
    let lastTime = 0
    let visible = false
    let previous = null
    let travel = 0
    let lastEmission = 0
    let serial = 0
    const clearParticles = () => {
      for (const particle of particles) particle.remove()
      particles.clear()
      previous = null
      travel = 0
    }
    const animate = time => {
      elapsed += lastTime ? Math.min((time - lastTime) / 1000, .05) : 0
      lastTime = time
      const width = section.clientWidth
      const height = section.clientHeight
      const size = shapes[0]?.offsetWidth || 10
      const contain = (value, before, after) => value < 0
        ? -before * Math.tanh(-value / before)
        : after * Math.tanh(value / after)
      shapes.forEach((shape, i) => {
        const phase = i * 2.39996
        const speed = .32 + (i * 7 % 13) * .018
        const x = (Math.sin(elapsed * speed + phase) - Math.sin(phase)) * (65 + i % 5 * 12.5)
          + (Math.sin(elapsed * speed * .63 + phase * 2) - Math.sin(phase * 2)) * 22.5
        const y = (Math.cos(elapsed * speed * .81 + phase) - Math.cos(phase)) * (55 + i % 4 * 12.5)
          + (Math.sin(elapsed * speed * 1.17 + phase) - Math.sin(phase)) * 20
        // Ease toward the edges instead of clipping the original decorations.
        const anchorX = decorations[i][0] / 100 * width
        const anchorY = decorations[i][1] / 100 * height
        const boundedX = contain(x, Math.max(1, anchorX - 4), Math.max(1, width - anchorX - size - 4))
        const boundedY = contain(y, Math.max(1, anchorY - 4), Math.max(1, height - anchorY - size - 4))
        shape.style.transform = `translate3d(${boundedX}px, ${boundedY}px, 0)`
      })
      frame = requestAnimationFrame(animate)
    }
    const syncAnimation = () => {
      const running = visible && !document.hidden && !reducedMotion.matches
      if (running && frame === null) frame = requestAnimationFrame(animate)
      if (!running) {
        cancelAnimationFrame(frame)
        frame = null
        lastTime = 0
        clearParticles()
        if (reducedMotion.matches) shapes.forEach(shape => { shape.style.transform = '' })
      }
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      syncAnimation()
    })
    observer.observe(section)
    document.addEventListener('visibilitychange', syncAnimation, { signal: events.signal })
    reducedMotion.addEventListener('change', syncAnimation, { signal: events.signal })
    section.addEventListener('pointermove', event => {
      if (event.pointerType !== 'mouse' || !visible || document.hidden || reducedMotion.matches) return
      const rect = section.getBoundingClientRect()
      const point = { x: event.clientX - rect.left, y: event.clientY - rect.top }
      if (point.x < 0 || point.y < 0 || point.x > rect.width || point.y > rect.height) return
      const from = previous
      const distance = from ? Math.hypot(point.x - from.x, point.y - from.y) : 0
      travel += distance
      previous = point
      const now = performance.now()
      if (!distance || travel < 3 || now - lastEmission < 40) return
      // Small, bounded bursts fill the path even when pointer events are sparse.
      const count = Math.min(5, 2 + Math.floor(travel / 20))
      travel = 0
      lastEmission = now
      for (let index = 0; index < count; index += 1) {
        if (particles.size >= 64) {
          const oldest = particles.values().next().value
          oldest.remove()
          particles.delete(oldest)
        }
        const particle = document.createElement('i')
        const shape = decorations[serial++ % decorations.length][2]
        particle.className = `home-spark-shape home-spark-shape--${shape} home-spark-cursor-particle`
        const directionX = (point.x - from.x) / distance
        const directionY = (point.y - from.y) / distance
        const behind = (count - index - .5) * Math.min(14, distance / count)
        const spread = (index % 2 ? -1 : 1) * (4 + Math.random() * 5)
        particle.style.left = `${point.x - directionX * behind - directionY * spread}px`
        particle.style.top = `${point.y - directionY * behind + directionX * spread}px`
        particle.style.backgroundColor = ['#ffffff', '#fff3fb', '#ffe0f4'][serial % 3]
        const trailing = 18 + Math.random() * 24
        const sideways = (Math.random() - .5) * 44
        particle.style.setProperty('--drift-x', `${-directionX * trailing - directionY * sideways}px`)
        particle.style.setProperty('--drift-y', `${-directionY * trailing + directionX * sideways}px`)
        particle.style.setProperty('--life', `${800 + Math.random() * 700}ms`)
        particle.onanimationend = () => { particles.delete(particle); particle.remove() }
        particles.add(particle)
        layer.appendChild(particle)
      }
    }, { signal: events.signal })
    section.addEventListener('pointerleave', () => { previous = null; travel = 0 }, { signal: events.signal })
    return () => {
      events.abort()
      observer.disconnect()
      cancelAnimationFrame(frame)
      clearParticles()
    }
  }, [])

  return <section ref={sectionRef} className="home-spark" aria-labelledby="home-spark-title">
    <div ref={decorationRef} className="home-spark-decoration" aria-hidden="true">{decorations.map(([x, y, shape], i) =>
      <i key={i} className={`home-spark-shape home-spark-shape--${shape}`} style={{ left: `${x}%`, top: `${y}%` }} />
    )}</div>
    <div ref={cursorRef} className="home-spark-cursor-particles" aria-hidden="true" />
    <h2 id="home-spark-title">당기고, 닿고,<span>스파크!</span></h2>
    <p><span>함께한 시간 속에서 우리는 서로를 이해하고, 각자의 작업에 몰입하며, 새로운 <br />가능성을 발견하고 성장해 왔습니다. 그 시간들이 모여 지금의 우리를 만들었습니다
    </span></p>
  </section>
}

export function EmptyContent() {
  return <section className="home-empty-content" aria-label="추후 콘텐츠 영역" />
}

export function SyncVideoSection() {
  return <section className="home-sync-video" aria-label="LET’S SYNC! 모션 영상">
    <video src={syncopateFilm} autoPlay muted loop playsInline preload="auto" aria-label="LET’S SYNC! 모션 그래픽" />
    <p className="home-sync-video-description">
      <span>서로를 향한 당김은 작은 움직임에서 시작됩니다. 서로 다른 개성이 닿아</span>
      <span>반응이 일어나고, 그 반응은 또 다른 만남으로 번져갑니다.</span>
    </p>
  </section>
}

export function PullPlaySyncopate({ children }) {
  return <section className="home-pull-play" aria-labelledby="home-pull-play-title">
    <div className="home-pull-play-header">
      <h2 className="home-pull-play-title" id="home-pull-play-title">Pull. Play.<span>Syncopate</span></h2>
      <p className="home-pull-play-description">
        <span>정해진 방식 없이 저마다의 움직임이 자유롭게 펼쳐집니다.</span>
        <span>커서를 따라 당겨지고 흩어지는 변화 속에서 나만의 리듬을 표현해 보세요.</span>
      </p>
    </div>
    {children}
  </section>
}

export function SyncFinale() {
  return <section className="home-sync-finale" aria-label="LET’S SYNC!">
    <div className="home-sync-finale-content">
      <img src={letsSync} alt="LET’S SYNC!" width="1267" height="322" draggable="false" />
      <p className="home-sync-finale-description">
        <span>서로 다른 우리는 함께 배우고 시도하며 서로의 가능성을 넓혀왔습니다.</span>
        <span>함께 나눈 생각과 경험은 각자의 다음으로 이어집니다.</span>
        <span>앞으로도 우리는 새로운 만남과 연결 속에서 또 다른 가능성을 만들어갈 것입니다.</span>
      </p>
    </div>
  </section>
}
