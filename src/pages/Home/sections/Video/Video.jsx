import { useEffect, useId, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import RoundedStrokeText from '../../../../components/RoundedStrokeText/RoundedStrokeText.jsx'
import exhibitionFilm from '../../../../assets/sync_story.webm'

gsap.registerPlugin(ScrollTrigger)

// A single, restrained wave trails each edge at a different phase. Only the
// reveal boundary bends; the video retains its own rectangular coordinates.
function filmBoundary(w, h, radius, progress) {
  const pulse = (delay, span) => Math.sin(Math.PI * Math.max(0, Math.min(1, (progress - delay) / span))) ** 2
  const top = pulse(.02, .92) * Math.min(h * .035, 28)
  const bottom = pulse(.1, .9) * Math.min(h * .04, 32)
  const side = pulse(0, .88) * Math.min(w * .025, 28)
  const r = Math.min(radius, w / 2, h / 2)
  const n = x => Number(x.toFixed(3))
  return [
    `M ${n(side * .4 + r)} ${n(top * .25)}`,
    `C ${n(w * .28)} ${n(top)} ${n(w * .62)} ${n(top)} ${n(w - side - r)} ${n(top * .55)}`,
    `A ${n(r)} ${n(r)} 0 0 1 ${n(w - side)} ${n(top * .55 + r)}`,
    `C ${n(w)} ${n(h * .28)} ${n(w)} ${n(h * .67)} ${n(w - side * .55)} ${n(h - bottom * .25 - r)}`,
    `A ${n(r)} ${n(r)} 0 0 1 ${n(w - side * .55 - r)} ${n(h - bottom * .25)}`,
    `C ${n(w * .67)} ${n(h)} ${n(w * .32)} ${n(h)} ${n(side * .7 + r)} ${n(h - bottom * .65)}`,
    `A ${n(r)} ${n(r)} 0 0 1 ${n(side * .7)} ${n(h - bottom * .65 - r)}`,
    `C 0 ${n(h * .68)} 0 ${n(h * .3)} ${n(side * .4)} ${n(top * .25 + r)}`,
    `A ${n(r)} ${n(r)} 0 0 1 ${n(side * .4 + r)} ${n(top * .25)} Z`,
  ].join(' ')
}

export default function Video({ filmRef }) {
  const section = useRef(null)
  const media = useRef(null)
  const left = useRef(null)
  const right = useRef(null)
  const mask = useRef(null)
  const maskId = `film-mask-${useId().replace(/:/g, '')}`

  useEffect(() => {
    const root = section.current
    const video = filmRef.current
    const surface = media.current
    const boundary = mask.current
    let disposed = false
    const updateBoundary = progress => {
      if (disposed) return
      const w = parseFloat(surface.style.width)
      const h = parseFloat(surface.style.height)
      if (!(w > 0 && h > 0)) return
      const radius = parseFloat(surface.style.borderRadius) || 0
      boundary.setAttribute('d', filmBoundary(w, h, radius, progress))
      surface.style.clipPath = progress === 0 || progress === 1 ? 'none' : `url(#${maskId})`
    }
    const queries = gsap.matchMedia()
    queries.add({ reduced: '(prefers-reduced-motion: reduce)', animated: '(prefers-reduced-motion: no-preference)' }, context => {
      if (context.conditions.reduced) {
        gsap.set(media.current, { width: '100%', height: '100%', top: '50%', borderRadius: 0 })
        gsap.set([left.current, right.current], { opacity: 0 })
        gsap.set(video, { filter: 'brightness(1)' })
        media.current.style.clipPath = 'none'
        return
      }
      // Sticky reserves the viewport in this section's own scroll track.
      // Only this timeline controls expansion; playback remains with filmRef.
      gsap.timeline({
        onUpdate() { updateBoundary(Math.max(0, Math.min(1, this.time() - .1))) },
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: () => `+=${window.innerHeight * 1.2}`,
          scrub: 1.4,
          invalidateOnRefresh: true,
        },
      })
        .fromTo(media.current, {
          width: () => root.clientWidth * .327,
          height: () => root.clientWidth * .327 / 1.85,
          top: '51.1%',
          borderRadius: () => root.clientWidth * .008,
        }, {
          width: () => root.clientWidth,
          height: () => window.innerHeight,
          top: '50%',
          borderRadius: 0,
          duration: 1,
          ease: 'power2.inOut',
        }, .1)
        .to(left.current, { opacity: 0, x: () => -root.clientWidth * .06, duration: .42, ease: 'power2.in' }, .1)
        .to(right.current, { opacity: 0, x: () => root.clientWidth * .06, duration: .42, ease: 'power2.in' }, .1)
      
    }, root)
    // Recalculate this and subsequent section triggers once font metrics settle.
    document.fonts.ready.then(() => { if (!disposed) ScrollTrigger.refresh() })
    return () => { disposed = true; queries.revert() }
  }, [filmRef, maskId])

  return (
    <section ref={section} className="home-film" aria-label="LET’S SYNC! 전시 영상">
      <svg width="0" height="0" className="home-film-mask" aria-hidden="true">
        <defs><clipPath id={maskId} clipPathUnits="userSpaceOnUse"><path ref={mask} /></clipPath></defs>
      </svg>
      <div className="home-film-stage">
        <div ref={left} className="home-film-copy home-film-copy--left">
          <p className="home-film-eyebrow">This is how we SYNC</p>
          <RoundedStrokeText as="h2" className="home-film-title">Every moments</RoundedStrokeText>
        </div>
        <div ref={right} className="home-film-copy home-film-copy--right">
          <RoundedStrokeText as="p" className="home-film-title"><span>Makes a</span><span>new possibility</span></RoundedStrokeText>
        </div>
        <div ref={media} className="home-film-media">
          <video ref={filmRef} src={exhibitionFilm} autoPlay muted loop playsInline preload="auto" />
        </div>
      </div>
    </section>
  )
}
