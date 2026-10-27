import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { createPortal, flushSync } from 'react-dom'
import { Routes, useLocation } from 'react-router-dom'
import { PageTransitionReadyContext } from './PageTransitionContext.js'
import './PageTransition.css'

// One sequential wave: preserve each hop, finish as soon as the fifth lands.
const HOP = 540
const STAGGER = 140
const LIFT = 54
const MARK_COUNT = 5
const WAVE_MS = STAGGER * (MARK_COUNT - 1) + HOP
const LOADING_DESTINATIONS = new Set(['/project', '/student', '/syncopate'])
const SHAPES = ['circle', 'triangle', 'sparkle', 'square']
const TURNS = { circle: 0, triangle: 120, sparkle: 90, square: 90 }
const pathOf = location => location.pathname.replace(/\/+$/, '') || '/'

function Shape({ kind }) {
  return <svg viewBox="0 0 26 26" aria-hidden="true">
    {kind === 'circle' && <circle cx="13" cy="13" r="13" fill="currentColor" />}
    {kind === 'triangle' && <path d="M13 4.5 L23.5 22.5 L2.5 22.5 Z" fill="currentColor" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />}
    {kind === 'sparkle' && <path d="M13 2 A13.5 13.5 0 0 0 24 13 A13.5 13.5 0 0 0 13 24 A13.5 13.5 0 0 0 2 13 A13.5 13.5 0 0 0 13 2 Z" fill="currentColor" stroke="currentColor" strokeWidth="2.6" strokeLinejoin="round" />}
    {kind === 'square' && <rect x="1" y="1" width="24" height="24" rx="3" fill="currentColor" />}
  </svg>
}

function lockTransition(layer) {
  const root = document.getElementById('root')
  const wasInert = root.inert
  const focus = document.activeElement
  const x = window.scrollX, y = window.scrollY
  const saved = []
  const set = (element, property, value) => {
    saved.push([element, property, element.style.getPropertyValue(property), element.style.getPropertyPriority(property)])
    element.style.setProperty(property, value)
  }
  root.inert = true
  set(document.documentElement, 'overflow', 'hidden')
  set(document.documentElement, 'overscroll-behavior', 'none')
  set(document.body, 'position', 'fixed')
  set(document.body, 'top', `${-y}px`)
  set(document.body, 'left', `${-x}px`)
  set(document.body, 'width', '100%')
  set(document.body, 'overflow', 'hidden')
  const events = new AbortController()
  const options = { capture: true, passive: false, signal: events.signal }
  const cancel = event => event.preventDefault()
  window.addEventListener('wheel', cancel, options)
  window.addEventListener('touchmove', cancel, options)
  window.addEventListener('keydown', event => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown', 'Home', 'End', ' ', 'Tab'].includes(event.key)) event.preventDefault()
  }, options)
  layer.focus({ preventScroll: true })
  return () => {
    events.abort()
    saved.reverse().forEach(([element, property, value, priority]) => {
      if (value) element.style.setProperty(property, value, priority)
      else element.style.removeProperty(property)
    })
    root.inert = wasInert
    window.scrollTo({ left: x, top: y, behavior: 'instant' })
    if (focus?.isConnected) focus.focus({ preventScroll: true })
  }
}

function LoadingScreen({ kind, dark, onFinish }) {
  const ref = useRef(null)
  useLayoutEffect(() => {
    const layer = ref.current
    const unlock = lockTransition(layer)
    const marks = Array.from(layer.querySelectorAll('.route-loading__mark'))
    const dots = layer.querySelector('.route-loading__dots')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const duration = WAVE_MS
    const start = performance.now()
    let raf
    let previousDots = 4
    const easeOut = t => 1 - Math.pow(1 - t, 2.4)
    const easeInOut = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
    const pose = (t, turnsDone) => {
      const turn = TURNS[kind]
      if (t <= 0 || t >= HOP) return `translateY(0) rotate(${turnsDone * turn}deg)`
      const p = t / HOP
      const y = -LIFT * Math.sin(Math.PI * easeOut(p))
      const r = turnsDone * turn + turn * easeInOut(p)
      return `translateY(${y.toFixed(2)}px) rotate(${r.toFixed(2)}deg) scale(1.000, 1.000)`
    }
    const tick = now => {
      const elapsed = now - start
      if (elapsed >= duration) {
        flushSync(onFinish)
        return
      }
      if (!reduce) {
        const wave = Math.floor(elapsed / WAVE_MS)
        const local = elapsed - wave * WAVE_MS
        marks.forEach((mark, i) => {
          const t = local - i * STAGGER
          mark.style.transform = pose(t, wave + (t >= HOP ? 1 : 0))
        })
      }
      const count = (4 + Math.floor(elapsed / 260)) % 5
      if (count !== previousDots) {
        dots.textContent = '.'.repeat(count)
        previousDots = count
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      unlock()
    }
  }, [kind, onFinish])

  return createPortal(
    <div className={`route-loading${dark ? ' route-loading--pink' : ''}`} data-shape={kind} ref={ref} tabIndex={-1}>
      <div className="route-loading__group" role="status" aria-live="polite" aria-label="Loading">
        <div className="route-loading__row" aria-hidden="true">
          {Array.from({ length: MARK_COUNT }, (_, i) => <div className="route-loading__mark" key={i}><Shape kind={kind} /></div>)}
        </div>
        <div className="route-loading__label"><span>Loading</span><span className="route-loading__dots" aria-hidden="true">....</span></div>
      </div>
    </div>, document.body,
  )
}

export default function PageTransitionRoutes({ children }) {
  const location = useLocation()
  const [displayed, setDisplayed] = useState(location)
  const [transition, setTransition] = useState(null)
  const destination = useRef(location)
  const running = useRef(false)
  const previous = useRef({ kind: null, dark: true })

  useLayoutEffect(() => {
    destination.current = location
    if (running.current) return // A history change retargets this same animation.
    if (pathOf(location) === pathOf(displayed) || !LOADING_DESTINATIONS.has(pathOf(location)) ||
      location.state?.skipPageTransition || document.querySelector('.first-splash')) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Synchronize Router's external location before paint; never flash the destination beneath an unfinished transition.
      setDisplayed(location)
      return
    }
    const pool = SHAPES.filter(kind => kind !== previous.current.kind)
    const next = { kind: pool[Math.floor(Math.random() * pool.length)], dark: !previous.current.dark }
    previous.current = next
    running.current = true
    setTransition(next)
  }, [location, displayed])

  const finish = useCallback(() => {
    running.current = false
    setDisplayed(destination.current)
    setTransition(null)
  }, [])

  return <>
    <PageTransitionReadyContext.Provider value={!transition && location.key === displayed.key}>
      <Routes location={displayed}>{children}</Routes>
    </PageTransitionReadyContext.Provider>
    {transition && <LoadingScreen kind={transition.kind} dark={transition.dark} onFinish={finish} />}
  </>
}
