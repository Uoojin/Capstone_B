import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import TypeInteraction from '../../components/TypeInteraction/TypeInteraction.jsx'
import heroTitle from '../../assets/heroTitle.svg'
import HomeSections from './HomeSections.jsx'
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
        <div className="home-hero-overlay">
          <img
            className="home-hero-title"
            src={heroTitle}
            alt="LET’S SYNC! LET’S SPARK!"
            width="530"
            height="202"
            draggable="false"
          />
          <div className="home-hero-info">
            <div className="home-hero-summary">
              <p className="home-hero-info-heading"><span>제33회 계원조형예술제</span></p>
              <p><span>2026 Delight Insight : LET’S SYNC!</span></p>
              <p><span>계원예술대학교 디지털미디어디자인과 졸업전시회</span></p>
            </div>
            <div className="home-hero-schedule">
              <p className="home-hero-info-heading"><span>Let’s Exhibit!</span></p>
              <p><span>11. 20. ( FRI ) - 22. ( SUN )</span></p>
              <p><span>계원예술대학교 디자인관 5층</span></p>
            </div>
            <div className="home-hero-schedule">
              <p className="home-hero-info-heading"><span>Let’s Open!</span></p>
              <p><span>11. 20. ( FRI ) PM 4:00</span></p>
              <p><span>계원예술대학교 디자인관 5층</span></p>
            </div>
          </div>
        </div>
      </section>
      <HomeSections />
    </main>
  )
}
