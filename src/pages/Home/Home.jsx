import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import TypeInteraction from '../../components/TypeInteraction/TypeInteraction.jsx'
import './Home.css'

// Module lifetime follows the document, so internal navigation never replays the intro.
const enteredOnHome = window.location.pathname.replace(/\/+$/, '') === import.meta.env.BASE_URL.replace(/\/+$/, '')
let introStarted = false

export default function Home() {
  const [playIntro] = useState(() => enteredOnHome && !introStarted)
  const restoreHeaderRef = useRef(null)
  useLayoutEffect(() => {
    if (!playIntro) return
    introStarted = true
    const header = document.querySelector('.site-header')
    if (!header) return
    const visibility = header.style.visibility
    const priority = header.style.getPropertyPriority('visibility')
    const inert = header.inert
    const ariaHidden = header.getAttribute('aria-hidden')
    header.style.visibility = 'hidden'
    header.inert = true
    header.setAttribute('aria-hidden', 'true')
    const restore = () => {
      if (visibility) header.style.setProperty('visibility', visibility, priority)
      else header.style.removeProperty('visibility')
      header.inert = inert
      if (ariaHidden === null) header.removeAttribute('aria-hidden')
      else header.setAttribute('aria-hidden', ariaHidden)
    }
    restoreHeaderRef.current = restore
    return () => {
      restore()
      restoreHeaderRef.current = null
    }
  }, [playIntro])
  const handleIntroComplete = useCallback(() => restoreHeaderRef.current?.(), [])
  return (
    <main className="home-page" aria-label="Home">
      <section className="home-hero" aria-label="TYPE interaction">
        <TypeInteraction playIntro={playIntro} onIntroComplete={handleIntroComplete} />
      </section>
    </main>
  )
}
