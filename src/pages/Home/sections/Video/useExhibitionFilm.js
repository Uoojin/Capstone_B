import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function useExhibitionFilm() {
  const filmRef = useRef(null)

  useEffect(() => {
    const video = filmRef.current
    let inside = false
    let requested = false
    let playAttempt = 0
    let disposed = false
    const resetToStart = () => {
      if (video.readyState >= 1 && video.currentTime !== 0) video.currentTime = 0
    }

    const syncPlayback = () => {
      if (disposed) return
      if (!inside) {
        playAttempt++
        requested = false
        video.pause()
        resetToStart()
        return
      }
      if (video.readyState < 2 || requested) return
      requested = true
      const attempt = ++playAttempt
      video.play().catch(() => { if (attempt === playAttempt) requested = false })
    }
    const setInside = active => {
      if (disposed || inside === active) return
      inside = active
      if (active) {
        requested = false
        resetToStart()
      }
      syncPlayback()
    }
    const frameReady = () => {
      if (video.readyState >= 2) video.dataset.frameReady = 'true'
      syncPlayback()
    }
    const guardAutoplay = () => {
      if (!inside) syncPlayback()
      else requested = true
    }
    video.addEventListener('play', guardAutoplay)
    video.addEventListener('loadedmetadata', syncPlayback)
    video.addEventListener('loadeddata', frameReady)
    video.addEventListener('canplay', frameReady)
    frameReady()
    // Play only while the section fills the viewport, excluding partial entry
    // and exit. This trigger never pins or animates layout.
    const playback = ScrollTrigger.create({
      id: 'home-film-playback',
      trigger: video.closest('.home-film'),
      start: 'top top',
      end: 'bottom bottom',
      onEnter: () => setInside(true),
      onEnterBack: () => setInside(true),
      onLeave: () => setInside(false),
      onLeaveBack: () => setInside(false),
      onRefresh: self => setInside(self.isActive),
    })
    setInside(playback.isActive)
    return () => {
      disposed = true
      playAttempt++
      playback.kill()
      video.removeEventListener('play', guardAutoplay)
      video.removeEventListener('loadedmetadata', syncPlayback)
      video.removeEventListener('loadeddata', frameReady)
      video.removeEventListener('canplay', frameReady)
      video.pause()
      resetToStart()
    }
  }, [])

  return filmRef
}
