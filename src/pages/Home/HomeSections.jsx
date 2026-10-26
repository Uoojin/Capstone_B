import { useEffect, useRef } from 'react'
import exhibitionFilm from '../../assets/sync_story.webm'
import DelightInsight from './DelightInsight.jsx'
import { SparkBanner, SyncVideoSection, PullPlaySyncopate, SyncFinale } from './NewHomeSections.jsx'
import InteractiveBalls from './InteractiveBalls.jsx'
import PuzzleSection from './PuzzleSection.jsx'
import './HomeSections.css'

export default function HomeSections() {
  const filmRef = useRef(null)

  useEffect(() => {
    const video = filmRef.current
    let inside = false
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        // Measure against the available height when the film is taller than the viewport.
        const visibleHeight = Math.min(entry.boundingClientRect.height, entry.rootBounds?.height ?? window.innerHeight)
        const visibility = visibleHeight > 0 ? entry.intersectionRect.height / visibleHeight : 0

        if (!entry.isIntersecting || visibility <= 0.15) {
          inside = false
          video.pause()
        } else if (!inside && visibility >= 0.6) {
          // Stay inside after playback ends, preserving its last frame until the next entry.
          inside = true
          video.currentTime = 0
          video.play().catch(() => {})
        }
      }
    }, { threshold: Array.from({ length: 21 }, (_, index) => index / 20) })

    observer.observe(video)
    return () => {
      observer.disconnect()
      video.pause()
    }
  }, [])

  return (
    <>
      <DelightInsight />
      <section className="home-film" aria-label="LET’S SYNC! 전시 영상">
        <video ref={filmRef} src={exhibitionFilm} muted playsInline preload="metadata" />
      </section>
      <SparkBanner />
      <PuzzleSection />
      <SyncVideoSection />
      <PullPlaySyncopate>
        <InteractiveBalls />
      </PullPlaySyncopate>
      <SyncFinale />
    </>
  )
}
