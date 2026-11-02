import { useId, useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LastSecArtwork from './LastSecArtwork.jsx'
import createFinaleInteraction from './finaleInteraction.js'
import './LastSec.css'

gsap.registerPlugin(ScrollTrigger)

export default function LastSec() {
  const section = useRef(null)
  const svg = useRef(null)
  const idPrefix = `lastsec-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`

  useLayoutEffect(() => {
    const interaction = createFinaleInteraction(svg.current)
    const entry = ScrollTrigger.create({
      trigger: section.current,
      start: 'top top',
      end: 'bottom bottom',
      onEnter: () => interaction.activate(),
      onEnterBack: () => interaction.activate(),
    })
    const visibility = ScrollTrigger.create({
      trigger: section.current,
      start: 'top bottom',
      end: 'bottom top',
      onLeave: () => interaction.deactivate(),
      onLeaveBack: () => interaction.deactivate(),
    })
    if (entry.isActive) interaction.activate()
    return () => {
      entry.kill()
      visibility.kill()
      interaction.dispose()
    }
  }, [])

  return <section ref={section} className="home-sync-finale" aria-label="LET’S SYNC!">
    <div className="home-sync-finale-stage">
      <LastSecArtwork svgRef={svg} idPrefix={idPrefix} />
    </div>
  </section>
}
