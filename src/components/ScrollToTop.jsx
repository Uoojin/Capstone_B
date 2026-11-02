import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function ScrollToTop() {
  const { pathname, key } = useLocation()

  useLayoutEffect(() => {
    window.history.scrollRestoration = 'manual'
  }, [])

  useLayoutEffect(() => {
    const reset = () => {
      window.scrollTo({ left: 0, top: 0, behavior: 'instant' })
      ScrollTrigger.update()
    }
    reset()
    // Reassert after child layout effects and the first ScrollTrigger refresh.
    let frame = requestAnimationFrame(() => {
      reset()
      frame = requestAnimationFrame(reset)
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname, key])

  return null
}
