import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import RoundedStrokeText from '../../../../components/RoundedStrokeText/RoundedStrokeText.jsx'

gsap.registerPlugin(ScrollTrigger, SplitText)

// Eager raw imports retain all original paths, fills, strokes and viewBoxes.
// All four sets are in the DOM before playback: no network request at a handoff.
const artwork = import.meta.glob('../../../../assets/DelightInsight/*.svg', {
  query: '?raw', import: 'default', eager: true,
})
const sets = ['', 'a', 'b', 'c'].map(prefix => Array.from({ length: 10 }, (_, i) =>
  artwork[`../../../../assets/DelightInsight/${prefix}${i + 1}.svg`],
))
// Painted letter slots measured against reference #2, in a 994 × 249 frame.
// The irregular baseline/overlaps belong to the supplied artwork composition.
const slots = [
  [0, 88, 163, 161], [83, 13, 125, 155], [206, 35, 153, 169],
  [359, 16, 37, 49], [331, 71, 138, 171], [501, 71, 138, 171],
  [604, 0, 161, 174], [674, 73, 174, 172], [807, 45, 142, 155],
  [921, 113, 73, 136],
]

// Normalize actual painted bounds rather than assuming the viewBox is tight.
// Only the SVG element's CSS box changes; source geometry remains untouched.
function alignArtwork(layer) {
  layer.querySelectorAll('.home-insight-letter').forEach(letter => {
    const svg = letter.querySelector('svg')
    const bounds = svg.getBBox()
    const stroke = Math.max(0, ...Array.from(svg.querySelectorAll('[stroke-width]'),
      path => Number(path.getAttribute('stroke-width')) || 0)) / 2
    const width = bounds.width + stroke * 2
    const height = bounds.height + stroke * 2
    const box = svg.viewBox.baseVal
    const ratio = Math.min(1 / width, Number(letter.dataset.ratio) / height)
    Object.assign(svg.style, {
      width: `${box.width * ratio * 100}%`,
      height: `${box.height * ratio / Number(letter.dataset.ratio) * 100}%`,
      left: `${((1 - width * ratio) / 2 - (bounds.x - stroke - box.x) * ratio) * 100}%`,
      top: `${((Number(letter.dataset.ratio) - height * ratio) / 2 - (bounds.y - stroke - box.y) * ratio) / Number(letter.dataset.ratio) * 100}%`,
    })
  })
}

export default function DelightInsight() {
  const section = useRef(null)

  useLayoutEffect(() => {
    const root = section.current
    const layers = Array.from(root.querySelectorAll('.home-insight-type-set'))
    layers.forEach(alignArtwork)
    const queries = gsap.matchMedia()
    queries.add({ reduced: '(prefers-reduced-motion: reduce)', animated: '(prefers-reduced-motion: no-preference)' }, context => {
      const letters = layers.map(layer => Array.from(layer.children))
      const description = root.querySelector('.home-insight-description')
      // xPercent is relative to each fixed slot, so resizing needs no reflow or
      // timeline rebuild. Every glyph shares the same spatial contraction.
      const contracted = index => (497 - (slots[index][0] + slots[index][2] / 2)) * .78 / slots[index][2] * 100
      const resetLetters = () => {
        gsap.set(layers, { visibility: index => index === 0 ? 'visible' : 'hidden' })
        letters.forEach(group => gsap.set(group, {
          xPercent: contracted, opacity: 0, scaleX: 1, scaleY: 1,
        }))
      }
      resetLetters()
      if (context.conditions.reduced) {
        gsap.set(letters[0], { xPercent: 0, opacity: 1 })
        return
      }

      let active = false
      let reveal
      const split = SplitText.create(description, {
        type: 'lines', autoSplit: true,
        onSplit: ({ lines }) => {
          // Same on-screen timing/eases as LastSec, without its parent timeScale.
          const motion = gsap.timeline({ paused: !active, delay: .2 })
            .fromTo(lines, { y: 22 }, { y: 0, duration: 1.1, stagger: .15, ease: 'power3.out' }, 0)
            .fromTo(lines, { opacity: 0 }, { opacity: 1, duration: 1.1, stagger: .15, ease: 'sine.inOut' }, 0)
          reveal = motion
          return motion
        },
      })
      const expand = (timeline, group, at, duration, initialOpacity = 0) => {
        timeline.fromTo(group, { xPercent: contracted }, {
          xPercent: 0, duration, ease: 'back.out(1.08)', immediateRender: false,
        }, at).fromTo(group, { opacity: initialOpacity }, {
          opacity: 1, duration: duration * .8, ease: 'sine.out', immediateRender: false,
        }, at)
      }
      const entrance = gsap.timeline({ paused: true })
      expand(entrance, letters[0], 0, 1.4)
      const loop = gsap.timeline({ paused: true, repeat: -1 })
      loop.set(layers, { visibility: index => index === 0 ? 'visible' : 'hidden' }, 0)
      loop.set(letters[0], { xPercent: 0, opacity: 1 }, 0)
      letters.slice(1).forEach(group => loop.set(group, { xPercent: contracted, opacity: 0 }, 0))
      let at = 1.8
      for (let i = 0; i < 4; i++) {
        const current = letters[i]
        const next = letters[(i + 1) % 4]
        const release = at + .84
        // A very small centre-to-edge lag bends the connected word without
        // turning the contraction into a sequential letter animation. All
        // letters reach compression together; opacity stays intact throughout.
        current.forEach((letter, index) => {
          const lag = Math.abs((slots[index][0] + slots[index][2] / 2 - 497) / 497) * .028
          loop.to(letter, {
            xPercent: contracted(index), scaleX: .94, scaleY: 1.02,
            duration: .94 - lag, ease: 'power3.inOut',
          }, at + lag)
        })
        // At maximum compression, switch the entire visible set in one tick.
        // Hidden layers keep their existing transforms, with no crossfade.
        loop.set(layers, {
          visibility: index => index === (i + 1) % 4 ? 'visible' : 'hidden',
        }, release)
        loop.to(current, {
          xPercent: 0, scaleX: 1, scaleY: 1,
          duration: 1.4, ease: 'back.out(1.08)',
        }, release)
          .fromTo(next, { scaleX: .94, scaleY: 1.02 }, {
            scaleX: 1, scaleY: 1, duration: 1.4,
            ease: 'back.out(1.08)', immediateRender: false,
          }, release)
        // Preserve the exact expansion motion. Only repeat swaps are opaque;
        // the initial entrance retains its original opacity reveal.
        expand(loop, next, release, 1.4, 1)
        at = release + 1 + 1.3
      }
      // Repeat starts with DEFAULT already settled, followed by its hold.
      loop.to({}, { duration: 0 }, at - 1.8)
      entrance.eventCallback('onComplete', () => { if (active) loop.restart() })
      const reset = () => {
        active = false
        entrance.pause(0, true)
        loop.pause(0, true)
        reveal?.pause(0, true)
        resetLetters()
      }
      const play = () => {
        if (active) return
        active = true
        resetLetters()
        loop.pause(0, true)
        entrance.restart(true)
        reveal?.restart(true)
      }
      const trigger = ScrollTrigger.create({
        trigger: root.querySelector('.home-insight-panel'),
        start: 'top bottom', end: 'bottom top',
        onEnter: play, onEnterBack: play, onLeave: reset, onLeaveBack: reset,
      })
      if (trigger.isActive) play()
      return () => {
        trigger.kill()
        entrance.kill()
        loop.kill()
        reveal?.kill()
        split.revert()
      }
    }, root)
    return () => queries.revert()
  }, [])

  return (
    <section ref={section} className="home-insight" aria-labelledby="home-insight-title">
      <div className="home-insight-panel">
        <RoundedStrokeText outline="css" as="h2" id="home-insight-title">2026 Delight<span>Insight</span></RoundedStrokeText>
        <div className="home-insight-type" role="img" aria-label="LET’S SYNC!">
          {sets.map((set, setIndex) => <div className="home-insight-type-set" key={setIndex} aria-hidden="true" data-set={['DEFAULT', 'A', 'B', 'C'][setIndex]}>
            {set.map((svg, index) => {
              const [x, y, width, height] = slots[index]
              return <div key={index} className="home-insight-letter" data-ratio={height / width} style={{
                left: `${x / 994 * 100}%`, top: `${y / 249 * 100}%`,
                width: `${width / 994 * 100}%`, height: `${height / 249 * 100}%`,
              }} dangerouslySetInnerHTML={{ __html: svg }} />
            })}
          </div>)}
        </div>
        <RoundedStrokeText outline="css" as="p" className="home-insight-description">
          <span>Delight Insight는 계원예술대학교 디지털미디어디자인과 졸업 전시의 대주제입니다.</span>
          <span>이번 주제 LET’S SYNC!는 서로 다른 개성들이 관계를 맺고 영향을 주고받으며,</span>
          <span>이전에는 없던 새로운 것을 만들어가는 생성적 연결을 의미합니다.</span>
        </RoundedStrokeText>
      </div>
    </section>
  )
}
