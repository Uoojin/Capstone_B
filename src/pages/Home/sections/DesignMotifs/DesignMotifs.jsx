import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import useMotifPin from './useMotifPin.js'
import MotifArtwork from './MotifArtwork.jsx'
import { circle, particles, pathData, S, createParticles } from './particles.js'
import './motifs.css'
import './DesignMotifs.css'

const items = [
  { name: 'EMPATHY', ko: '공감', motif: 1, description: '서로 다른 생각과 감정이 만나고, 각자의 다름을 받아들이는 과정에서 이해의 폭이 넓어지며 새로운 가능성이 만들어집니다.' },
  { name: 'IMMERSION', ko: '몰입', motif: 0, description: '서로의 경험을 나누며 하나의 문제와 과정에 깊이 집중하게 됩니다. 익숙한 방식을 벗어나 함께 새로운 방향으로 나아갑니다.' },
  { name: 'DISCOVERY', ko: '발견', motif: 2, description: '서로 다른 시선으로 바라보면 각자의 관점도 넓어집니다. 그 과정에서 혼자서는 보지 못했던 관점과 가능성을 발견합니다.' },
  { name: 'GROWTH', ko: '성장', motif: 3, description: '서로의 시도와 변화는 또 다른 도전을 시작하는 자극이 됩니다. 서로 영향을 주고받으며 새로운 시도를 이어갑니다.' },
]

export default function DesignMotifs() {
  const rootRef = useRef(null)
  const particleRef = useRef(null)
  const changeShapes = useRef(null)
  const previousMixed = useRef(false)
  const [active, setActive] = useState(0)
  const [pink, setPink] = useState(false)
  const [mixed, setMixed] = useState(false)
  const { selectMotif, entryKey } = useMotifPin(rootRef, setActive, items.length)

  useEffect(() => {
    const change = createParticles(particleRef.current)
    changeShapes.current = change
    return () => { change.dispose(); changeShapes.current = null }
  }, [])

  useEffect(() => {
    // Source select() changes particles unless mixed mode is enabled.
    if (!mixed || mixed !== previousMixed.current) changeShapes.current?.(active, mixed)
    previousMixed.current = mixed
  }, [active, mixed, entryKey])

  useLayoutEffect(() => {
    const holder = rootRef.current.querySelector('.object-holder')
    const scaleObject = () => {
      const art = holder.querySelector('.object-art')
      if (art) art.style.transform = `scale(${holder.clientWidth / 435})`
    }
    const observer = new ResizeObserver(scaleObject)
    observer.observe(holder)
    scaleObject()
    return () => observer.disconnect()
  }, [active, entryKey])

  const item = items[active]
  return (
    <div className="design-motifs-scroll" style={{ height: '200svh' }}>
      <section data-mixed={mixed} data-active={active} ref={rootRef} className={`design-motifs${pink ? ' page--pink' : ''}`} aria-label="Design Motifs">
        <div ref={particleRef} className="particles" aria-hidden="true">
          {particles.map((particle, index) => (
            <span key={index} className="particle" style={{ '--angle': `${particle.rotate}deg` }}>
              <svg viewBox={`-4 -4 ${S + 8} ${S + 8}`}><path d={pathData(circle)} /></svg>
            </span>
          ))}
        </div>
        <div className="side-label">DESIGN MOTIF</div>
        <div className="object-holder"><div key={`${active}-${entryKey}`} className="object-art"><MotifArtwork index={item.motif} /></div></div>
        <nav className="motif-nav" aria-label="디자인 모티프">
          <div className="nav-track" style={{ transform: `translateY(calc(${-active} * var(--step)))` }}>
            {items.map((entry, index) => <button key={entry.name} type="button" className={index === active ? 'active' : undefined} aria-current={index === active ? 'true' : undefined} onClick={() => selectMotif(index)}>{entry.name}</button>)}
          </div>
        </nav>
        <div key={`description-${active}-${entryKey}`} className="description"><span className="sr-only">{item.ko}. </span>{item.description}</div>
        <div className="display-toggles">
          <button className="color-toggle" type="button" aria-pressed={pink} onClick={() => setPink(value => !value)}><span className="color-toggle__swatch" aria-hidden="true" /> COLOR VERSION</button>
          <button className="particle-toggle" type="button" aria-pressed={mixed} onClick={() => setMixed(value => !value)}>PARTICLES: {mixed ? 'MIXED' : 'BY SECTION'}</button>
        </div>
      </section>
    </div>
  )
}
