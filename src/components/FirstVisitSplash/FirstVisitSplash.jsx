import { useLayoutEffect, useRef, useState } from 'react'
import { createPortal, flushSync } from 'react-dom'
import { readHeroHandoff } from '../TypeInteraction/heroHandoff.js'
import title from '../../assets/heroTitle.svg'
import './FirstVisitSplash.css'

const DURATION = 6960
// A document navigation/reload creates a new opportunity; SPA navigation does
// not. Navigation Timing retains the original URL even after Router pushState.
const documentEntry = performance.getEntriesByType('navigation')[0]?.name || window.location.href
const entryPath = new URL(documentEntry).pathname.replace(/\/+$/, '')
const homePath = new URL(import.meta.env.BASE_URL, window.location.origin).pathname.replace(/\/+$/, '')
let documentEntryAvailable = entryPath === homePath
const assets = import.meta.glob('../../assets/type/*_default.svg', {
  eager: true, import: 'default', query: '?url',
})
// Positions and stagger follow the supplied 1280 × 720, 6.96-second reference.
const LETTERS = [
  { id: 'S1', x: 1, y: 69, width: 279, angle: -12, enter: 680, exit: 3250, end: 4000, from: [-32, 12] },
  { id: 'E', x: 29.5, y: 49, width: 244, angle: -24, enter: 760, exit: 2520, end: 2980, from: [-34, 0] },
  { id: 'L', x: 51.5, y: 24, width: 227, angle: 18, enter: 840, exit: 2260, end: 2720, from: [0, -48] },
  { id: 'S2', x: 56, y: 85, width: 279, angle: -24, enter: 920, exit: 2600, end: 3030, from: [0, 48] },
  { id: 'C', x: 80, y: 52, width: 301, angle: -16, enter: 1000, exit: 2700, end: 3150, from: [35, 0] },
  { id: 'T', x: 100, y: 68, width: 300, angle: 45, enter: 1080, exit: 3550, end: 4060, from: [35, 20] },
  { id: 'N', x: 4, y: 10, width: 290, angle: -20, enter: 1160, exit: 3120, end: 3670, from: [-25, -36] },
  { id: 'Y', x: 95, y: 12, width: 337, angle: 16, enter: 1240, exit: 3040, end: 3560, from: [25, -36] },
]

function lockPage(layer) {
  const root = document.getElementById('root')
  const previousInert = root?.inert
  const focused = document.activeElement
  const scroll = { x: window.scrollX, y: window.scrollY }
  const saved = []
  function set(element, property, value) {
    saved.push([element, property, element.style.getPropertyValue(property), element.style.getPropertyPriority(property)])
    element.style.setProperty(property, value)
  }
  if (root) root.inert = true
  // Navigation stays hidden until the geometry-matched handoff has finished.
  const header = root?.querySelector('.site-header')
  if (header) set(header, 'visibility', 'hidden')
  set(document.documentElement, 'overflow', 'hidden')
  set(document.documentElement, 'overscroll-behavior', 'none')
  set(document.body, 'position', 'fixed')
  set(document.body, 'top', `${-scroll.y}px`)
  set(document.body, 'left', `${-scroll.x}px`)
  set(document.body, 'width', '100%')
  set(document.body, 'overflow', 'hidden')
  const controller = new AbortController()
  const cancel = event => event.preventDefault()
  const options = { capture: true, passive: false, signal: controller.signal }
  window.addEventListener('wheel', cancel, options)
  window.addEventListener('touchmove', cancel, options)
  window.addEventListener('keydown', event => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown', 'Home', 'End', ' ', 'Tab'].includes(event.key)) event.preventDefault()
  }, options)
  layer.focus({ preventScroll: true })
  return () => {
    controller.abort()
    saved.reverse().forEach(([element, property, value, priority]) => {
      if (value) element.style.setProperty(property, value, priority)
      else element.style.removeProperty(property)
    })
    if (root) root.inert = previousInert
    window.scrollTo({ left: scroll.x, top: scroll.y, behavior: 'instant' })
    if (focused?.isConnected) focused.focus({ preventScroll: true })
  }
}

function SplashPlayback({ onComplete }) {
  const ref = useRef(null)
  useLayoutEffect(() => {
    const layer = ref.current
    const unlock = lockPage(layer)
    const animations = []
    let disposed = false
    let finishTimer
    let handoffFrame
    let timelineStart
    const hasHero = !!document.querySelector('.type-interaction')
    const letterAnimations = new Map()
    let handoffStarted = false
    function animate(element, frames, id) {
      const animation = element.animate(frames, { duration: DURATION, fill: 'both' })
      animation.id = `sync-splash-${id}`
      animations.push(animation)
      if (LETTERS.some(letter => letter.id === id)) letterAnimations.set(id, animation)
      return animation
    }
    const point = (time, properties) => ({ offset: time / DURATION, ...properties })
    function resize() {
      layer.style.setProperty('--splash-scale', Math.min(window.innerWidth / 1280, window.innerHeight / 720))
    }
    resize()
    window.addEventListener('resize', resize)
    // Wait for the actual SVGs before starting; until then the layer is pure white.
    Promise.allSettled(Array.from(layer.querySelectorAll('img'), image => image.decode())).then(() => {
      if (disposed) return
      timelineStart = performance.now()
      LETTERS.forEach(letter => {
        const image = layer.querySelector(`[data-splash-letter="${letter.id}"]`)
        const transform = (x, y, size) => `translate(${x}vw, ${y}vh) rotate(${letter.angle}deg) scale(${size})`
        const full = transform(0, 0, 1)
        const small = transform((50 - letter.x) * .85, (50 - letter.y) * .85, .015)
        animate(image, [
          point(0, { opacity: 0, transform: transform(...letter.from, 1), easing: 'ease-out' }),
          point(letter.enter, { opacity: 0, transform: transform(...letter.from, 1), easing: 'cubic-bezier(.16,1,.3,1)' }),
          point(letter.enter + 300, { opacity: 1, transform: full }),
          point(letter.exit, { opacity: 1, transform: full, easing: 'cubic-bezier(.65,0,.35,1)' }),
          point(letter.end, { opacity: 0, transform: small }),
          point(5050, { opacity: 0, transform: small, easing: 'cubic-bezier(.16,1,.3,1)' }),
          ...(hasHero ? [point(DURATION, { opacity: 0, transform: small })] : [
            point(5650, { opacity: 1, transform: transform((50 - letter.x) * .16, (50 - letter.y) * .16, 1) }),
            point(6040, { opacity: 1, transform: full }),
            point(DURATION, { opacity: 1, transform: full }),
          ]),
        ], letter.id)
      })
      animate(layer.querySelector('.first-splash__dot'), [
        point(0, { opacity: 0, transform: 'scale(0)' }),
        point(3890, { opacity: 0, transform: 'scale(0)' }),
        point(4020, { opacity: 1, transform: 'scale(1)' }),
        point(4180, { opacity: 1, transform: 'scale(1)' }),
        point(4340, { opacity: 0, transform: 'scale(0)' }),
        point(DURATION, { opacity: 0, transform: 'scale(0)' }),
      ], 'dot')
      animate(layer.querySelector('.first-splash__title'), [
        point(0, { opacity: 0, transform: 'scale(.94)' }),
        point(4210, { opacity: 0, transform: 'scale(.94)', easing: 'ease-out' }),
        point(4490, { opacity: 1, transform: 'scale(1)' }),
        point(DURATION, { opacity: 1, transform: 'scale(1)' }),
      ], 'title')
      animate(layer.querySelector('.first-splash__particles'), [
        point(0, { opacity: 0, transform: 'scale(.1)' }),
        point(5070, { opacity: 0, transform: 'scale(.1)', easing: 'ease-out' }),
        point(6140, { opacity: 1, transform: 'scale(1)' }),
        point(DURATION, { opacity: 1, transform: 'scale(1)' }),
      ], 'particles')
      if (hasHero) {
        // Keep the white backing opaque. Live hero letters are never exposed
        // underneath a moving second set, and no screen crossfade is needed.
        function followHero(now) {
          if (disposed) return
          const elapsed = now - timelineStart
          // Crossing into the existing mobile poster unmounts the hero canvas.
          // Do not leave its now-unavailable handoff holding the page locked.
          if (elapsed >= DURATION && !document.querySelector('.type-interaction')) {
            flushSync(onComplete)
            return
          }
          const targets = elapsed >= 5050 ? readHeroHandoff() : null
          if (targets?.length === LETTERS.length) {
            const progress = Math.max(0, Math.min(1, (elapsed - 5050) / (DURATION - 5050)))
            const eased = 1 - Math.pow(1 - progress, 3)
            const scale = Math.min(window.innerWidth / 1280, window.innerHeight / 720)
            LETTERS.forEach(letter => {
              const target = targets.find(item => item.id === letter.id)
              const image = layer.querySelector(`[data-splash-letter="${letter.id}"]`)
              const holder = image.parentElement
              if (!handoffStarted) letterAnimations.get(letter.id).cancel()
              const startX = (50 + (letter.x - 50) * .15) * window.innerWidth / 100
              const startY = (50 + (letter.y - 50) * .15) * window.innerHeight / 100
              const startWidth = letter.width * scale * .015
              const mix = (a, b) => a + (b - a) * eased
              holder.style.left = `${mix(startX, target.x)}px`
              holder.style.top = `${mix(startY, target.y)}px`
              holder.style.width = `${mix(startWidth, target.width)}px`
              image.style.transform = `rotate(${mix(letter.angle, target.angle)}deg)`
              image.style.opacity = Math.min(1, progress * 10)
            })
            const heroTitle = document.querySelector('.home-hero-title')
            const titleHolder = layer.querySelector('.first-splash__title-anchor')
            if (heroTitle) {
              const rect = heroTitle.getBoundingClientRect()
              titleHolder.style.left = `${window.innerWidth / 2 + (rect.left + rect.width / 2 - window.innerWidth / 2) * eased}px`
              titleHolder.style.top = `${window.innerHeight / 2 + (rect.top + rect.height / 2 - window.innerHeight / 2) * eased}px`
              titleHolder.style.width = `${330 * scale + (rect.width - 330 * scale) * eased}px`
            }
            handoffStarted = true
            if (progress === 1) {
              // Canvas and overlay share this frame's exact geometry. Commit
              // removal before the next paint, then unlock the existing hero.
              flushSync(onComplete)
              return
            }
          }
          handoffFrame = requestAnimationFrame(followHero)
        }
        handoffFrame = requestAnimationFrame(followHero)
      } else {
        // Mobile retains its existing poster transition; it has no hero canvas.
        animate(layer, [
          point(0, { opacity: 1 }),
          point(6360, { opacity: 1, easing: 'ease-in-out' }),
          point(DURATION, { opacity: 0 }),
        ], 'reveal')
        finishTimer = window.setTimeout(onComplete, DURATION)
      }
    })
    return () => {
      disposed = true
      window.clearTimeout(finishTimer)
      cancelAnimationFrame(handoffFrame)
      animations.forEach(animation => animation.cancel())
      window.removeEventListener('resize', resize)
      unlock()
    }
  }, [onComplete])

  return createPortal(
    <div className="first-splash" ref={ref} tabIndex={-1} role="status" aria-label="LET’S SYNC! 시작 애니메이션">
      <div className="first-splash__particles" aria-hidden="true">
        {LETTERS.flatMap((letter, index) => Array.from({ length: 7 }, (_, i) => {
          const angle = (i / 7) * Math.PI * 2 + index * .7
          return <i key={`${letter.id}-${i}`} style={{ left: `${letter.x + Math.cos(angle) * 13}%`, top: `${letter.y + Math.sin(angle) * 22}%` }} />
        }))}
      </div>
      {LETTERS.map(letter => (
        <div className="first-splash__letter" key={letter.id} style={{ left: `${letter.x}%`, top: `${letter.y}%`, width: `calc(var(--splash-scale) * ${letter.width}px)` }} aria-hidden="true">
          <img data-splash-letter={letter.id} src={assets[`../../assets/type/${letter.id}_default.svg`]} alt="" draggable="false" />
        </div>
      ))}
      <span className="first-splash__dot" aria-hidden="true" />
      <div className="first-splash__title-anchor" aria-hidden="true"><img className="first-splash__title" src={title} alt="" draggable="false" /></div>
    </div>, document.body,
  )
}

export default function FirstVisitSplash() {
  const [visible, setVisible] = useState(() => documentEntryAvailable)
  useLayoutEffect(() => {
    if (visible) documentEntryAvailable = false
  }, [visible])
  // Stable callback keeps playback independent of parent viewport updates.
  const [finish] = useState(() => () => setVisible(false))
  return visible ? <SplashPlayback onComplete={finish} /> : null
}
