import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import compatibleFilm from '../../../../assets/sync_story.mp4'

gsap.registerPlugin(ScrollTrigger)

const firstFrameTimeout = 3000

export default function useExhibitionFilm() {
  const filmRef = useRef(null)

  useEffect(() => {
    const video = filmRef.current
    let inside = false
    let requested = false
    let playAttempt = 0
    let disposed = false
    let usingFallback = false
    let firstFrameTimer
    const clearFirstFrameTimer = () => {
      clearTimeout(firstFrameTimer)
      firstFrameTimer = undefined
    }
    const resetToStart = () => {
      if (video.readyState >= 1 && video.currentTime !== 0) video.currentTime = 0
    }

    const switchToFallback = () => {
      if (disposed || usingFallback) return
      usingFallback = true
      clearFirstFrameTimer()
      playAttempt++
      requested = false
      delete video.dataset.frameReady
      video.src = compatibleFilm
      syncPlayback()
    }

    const syncPlayback = () => {
      if (disposed) return
      if (!inside) {
        clearFirstFrameTimer()
        playAttempt++
        requested = false
        video.pause()
        resetToStart()
        return
      }
      // Safari can report AV1 support and load metadata without decoding a frame.
      if (navigator.vendor === 'Apple Computer, Inc.' && !usingFallback &&
          firstFrameTimer === undefined && video.readyState === video.HAVE_METADATA) {
        firstFrameTimer = setTimeout(() => {
          firstFrameTimer = undefined
          if (!video.paused && video.readyState < video.HAVE_CURRENT_DATA) switchToFallback()
        }, firstFrameTimeout)
      }
      // Preload is a hint. Some browsers wait for play() before decoding a frame.
      if (requested) return
      requested = true
      const attempt = ++playAttempt
      video.play().catch(error => {
        if (attempt !== playAttempt) return
        requested = false
        if (error.name === 'NotSupportedError') switchToFallback()
      })
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
      if (video.readyState >= video.HAVE_CURRENT_DATA) {
        clearFirstFrameTimer()
        video.dataset.frameReady = 'true'
      }
      syncPlayback()
    }
    const handleMediaError = () => {
      if (video.error?.code === MediaError.MEDIA_ERR_DECODE ||
          video.error?.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) switchToFallback()
    }
    const guardAutoplay = () => {
      if (!inside) syncPlayback()
      else requested = true
    }
    video.addEventListener('play', guardAutoplay)
    video.addEventListener('loadedmetadata', syncPlayback)
    video.addEventListener('loadeddata', frameReady)
    video.addEventListener('canplay', frameReady)
    video.addEventListener('playing', frameReady)
    video.addEventListener('error', handleMediaError)
    handleMediaError()
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
      clearFirstFrameTimer()
      playback.kill()
      video.removeEventListener('play', guardAutoplay)
      video.removeEventListener('loadedmetadata', syncPlayback)
      video.removeEventListener('loadeddata', frameReady)
      video.removeEventListener('canplay', frameReady)
      video.removeEventListener('playing', frameReady)
      video.removeEventListener('error', handleMediaError)
      video.pause()
      resetToStart()
    }
  }, [])

  return filmRef
}
