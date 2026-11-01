import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { marks, titleImage, unitPaths } from './artwork.js'
import createTitleTilt from './titleTilt.js'

gsap.registerPlugin(ScrollTrigger, SplitText)

export default function LastSec() {
  const section = useRef(null)

  useLayoutEffect(() => {
    const root = section.current
    const queries = gsap.matchMedia()
    queries.add({ reduced: '(prefers-reduced-motion: reduce)', animated: '(prefers-reduced-motion: no-preference)' }, context => {
      const title = root.querySelector('.home-sync-finale-sticker')
      const description = root.querySelector('.home-sync-finale-description')
      const units = root.querySelectorAll('.home-sync-finale-unit')
      const entries = root.querySelectorAll('.home-sync-finale-unit-entry')
      const letters = root.querySelectorAll('.home-sync-finale-letter')

      if (context.conditions.reduced) {
        gsap.set([title, description, ...letters], { opacity: 1 })
        gsap.set(units, { opacity: 0 })
        gsap.set(entries, { opacity: 1, scale: 1 })
        return
      }

      gsap.set(title, { opacity: 0, scale: .87, rotation: -3, y: 10 })
      gsap.set(description, { opacity: 1 })
      gsap.set(letters, { opacity: 0, scaleX: .55, scaleY: .7 })
      gsap.set(entries, { opacity: 0, scale: .94 })
      const tilt = createTitleTilt(
        root.querySelector('.home-sync-finale-title'),
        root.querySelector('.home-sync-finale-tilt'),
      )
      const motion = gsap.timeline()

      // A short press and a restrained rebound; the complete title is one sticker.
      motion.to(title, { opacity: 1, duration: .045, ease: 'power1.out' }, .15)
        .to(title, { scale: 1.025, rotation: .45, y: 0, duration: .12, ease: 'power3.out' }, .15)
        .to(title, { scale: .995, rotation: -.15, duration: .055, ease: 'sine.inOut' }, .27)
        .to(title, { scale: 1, rotation: 0, duration: .075, ease: 'sine.out' }, .325)

      // A fixed, spatially dispersed permutation. Unequal gaps avoid a row sweep
      // and preserve exactly the same sequence on each automatic replay.
      const order = Array.from({ length: marks.length }, (_, index) => (index * 17) % marks.length)
      const weights = order.map((_, rank) => [1, .8, 1.2, .9, 1.1][rank % 5])
      const total = weights.slice(0, -1).reduce((sum, weight) => sum + weight, 0)
      let elapsed = 0
      order.forEach((index, rank) => {
        const at = .2 + elapsed / total * .6
        motion.to(units[index], { scaleX: 1.25, scaleY: .7, duration: .025, ease: 'sine.inOut' }, at)
          .to(units[index], { opacity: 0, scaleX: .6, scaleY: 1.15, duration: .045, ease: 'power1.inOut' }, at + .025)
          .to(letters[index], { opacity: 1, scaleX: 1.08, scaleY: .96, duration: .055, ease: 'power2.out' }, at + .025)
          .to(letters[index], { scaleX: 1, scaleY: 1, duration: .02, ease: 'sine.out' }, at + .08)
        elapsed += weights[rank]
      })
      // Preserve the original settling interval and all existing tween timing.
      motion.to({}, { duration: .1 }, .9)
      motion.call(tilt.enable, [], .4)

      // Split rendered lines, not sentence spans: keep the existing wrapping and
      // remeasure after font loading / resizing without restarting the reveal.
      SplitText.create(description, {
        type: 'lines',
        autoSplit: true,
        onSplit: ({ lines }) => {
          // Compensate only this reveal for the unchanged parent timeScale:
          // 1.1 seconds per line, with overlapping .15-second starts on screen.
          const timing = { duration: 1.1 / 1.18, stagger: .15 / 1.18 }
          const reveal = gsap.timeline()
            .fromTo(lines, { y: 22 }, { y: 0, ...timing, ease: 'power3.out' }, 0)
            .fromTo(lines, { opacity: 0 }, { opacity: 1, ...timing, ease: 'sine.inOut' }, 0)
          motion.add(reveal, .25)
          return reveal
        },
      })

      // Reveal on a separate layer so the unit-to-type transforms stay intact.
      // Keep every existing overlap and ease, stretching playback time by 18%.
      const timeline = gsap.timeline({ paused: true }).timeScale(1 / 1.18)
        .to(order.map(index => entries[index]), {
          opacity: 1,
          scale: 1,
          duration: .28,
          stagger: { amount: .18 },
          ease: 'power2.out',
        }, 0)
        .add(motion, .6)

      let started = false
      const play = () => {
        if (started) return
        started = true
        timeline.play(0)
      }
      const reset = () => {
        timeline.pause(0, true)
        tilt.reset()
        started = false
      }
      // Entry requires a full stage in view. Scrolling within / partly out of
      // the section never scrubs, reverses, or restarts the running timeline.
      ScrollTrigger.create({
        trigger: root,
        start: 'top top',
        end: 'bottom bottom',
        onEnter: play,
        onEnterBack: play,
      })
      // Reset only after the entire section has left the viewport in either
      // direction, so a direction change alone cannot interrupt playback.
      ScrollTrigger.create({
        trigger: root,
        start: 'top bottom',
        end: 'bottom top',
        onLeave: reset,
        onLeaveBack: reset,
      })
      return () => tilt.dispose()
    }, root)
    return () => queries.revert()
  }, [])

  return <section ref={section} className="home-sync-finale" aria-label="LET’S SYNC!">
    <div className="home-sync-finale-stage">
      <div className="home-sync-finale-pattern" aria-hidden="true">
        {marks.map((mark, index) => <div className="home-sync-finale-mark" key={index} style={{ left: `${mark.x}%`, top: `${mark.y}%` }}>
          <div className="home-sync-finale-unit-entry">
            <svg className="home-sync-finale-unit" viewBox="0 0 26 26">
              <path d={unitPaths[mark.shape]} fill="currentColor" stroke="currentColor" strokeWidth={mark.shape === 3 ? 3 : mark.shape === 0 ? 2.6 : 0} strokeLinejoin="round" />
            </svg>
          </div>
          <div className="home-sync-finale-letter">
            <img src={mark.src} alt="" style={{ transform: `rotate(${mark.rotation}deg)` }} draggable="false" />
          </div>
        </div>)}
      </div>
      <h2 className="home-sync-finale-title">
        <span className="home-sync-finale-sticker">
          <img className="home-sync-finale-tilt" src={titleImage} alt="LET’S SYNC!" width="487" height="95" draggable="false" />
        </span>
      </h2>
      <p className="home-sync-finale-description">
        <span>서로 다른 우리는 함께 배우고 시도하며 서로의 가능성을 넓혀왔습니다.</span>{' '}
        <span>함께 나눈 생각과 경험은 각자의 다음으로 이어집니다.</span>{' '}
        <span>앞으로도 우리는 새로운 만남과 연결 속에서 또 다른 가능성을 만들어갈 것입니다.</span>
      </p>
    </div>
  </section>
}
