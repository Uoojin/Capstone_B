import { useEffect, useRef } from 'react'

// Keep the observer effect in the page parent, after all child interaction effects.
export default function useExhibitionFilm() {
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


  return filmRef
}
