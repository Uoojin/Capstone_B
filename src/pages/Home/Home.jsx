import { useCallback, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react'
import TypeInteraction from '../../components/TypeInteraction/TypeInteraction.jsx'
import heroTitle from '../../assets/heroTitle.svg'
import HomeSections from './HomeSections.jsx'
import './Home.css'

// Module lifetime follows the document, so internal navigation never replays the intro.
const enteredOnHome = window.location.pathname.replace(/\/+$/, '') === import.meta.env.BASE_URL.replace(/\/+$/, '')
let introStarted = false

const mobileHomeViewport = window.matchMedia('(max-width: 767px)')
// Replace null with an imported poster URL when the final image is ready.
const mobilePosterImage = null

function subscribeToMobileViewport(onChange) {
  mobileHomeViewport.addEventListener('change', onChange)
  return () => mobileHomeViewport.removeEventListener('change', onChange)
}

function getMobileViewport() {
  return mobileHomeViewport.matches
}

export default function Home() {
  const isMobile = useSyncExternalStore(subscribeToMobileViewport, getMobileViewport)
  // Unmount desktop effects on mobile, rather than hiding running interactions.
  return isMobile ? <MobileHome /> : <DesktopHome />
}

function MobileHome() {
  return (
    <main className="home-page home-mobile-page" aria-label="Home">
      <div className="home-mobile-poster">
        {mobilePosterImage && <img src={mobilePosterImage} alt="LET’S SYNC! 전시 포스터" />}
      </div>
      <section className="home-mobile-exhibition" aria-labelledby="home-mobile-title">
        <h1 id="home-mobile-title">LET’S SYNC!</h1>
        <p className="home-mobile-degree-show">
          KAYWON UNIVERSITY OF ART &amp; DESIGN<br />
          33RD DEGREE SHOW
        </p>
        <p className="home-mobile-slogan">당기고, 당고, 스파크!</p>
        <p className="home-mobile-schedule">
          KAYWON DESIGN HALL 5F<br />
          NOV. 22 (FRI) - NOV. 24 (SUN)
        </p>
      </section>
    </main>
  )
}

function DesktopHome() {
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
              <p className="home-hero-info-korean"><span>계원예술대학교 디지털미디어디자인과 졸업전시회</span></p>
            </div>
            <div className="home-hero-schedule">
              <p className="home-hero-info-heading"><span>Let’s Exhibit!</span></p>
              <p><span>11. 20. ( FRI ) - 22. ( SUN )</span></p>
              <p className="home-hero-info-korean"><span>계원예술대학교 디자인관 5층</span></p>
            </div>
            <div className="home-hero-schedule">
              <p className="home-hero-info-heading"><span>Let’s Open!</span></p>
              <p><span>11. 20. ( FRI ) PM 4:00</span></p>
              <p className="home-hero-info-korean"><span>계원예술대학교 디자인관 5층</span></p>
            </div>
          </div>
        </div>
      </section>
      <HomeSections />
    </main>
  )
}
