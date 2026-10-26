import { useSyncExternalStore } from 'react'
import TypeInteraction from '../../components/TypeInteraction/TypeInteraction.jsx'
import heroTitle from '../../assets/heroTitle.svg'
import mobilePosterImage from '../../assets/mobileMain.svg'
import HomeSections from './HomeSections.jsx'
import RoundedStrokeText from './RoundedStrokeText.jsx'
import './Home.css'

const mobileHomeViewport = window.matchMedia('(max-width: 767px)')

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
        <img src={mobilePosterImage} alt="LET’S SYNC! 전시 포스터" width="440" height="623" />
      </div>
      <section className="home-mobile-exhibition" aria-label="전시 정보">
        <p className="home-mobile-degree-show">
          KAYWON UNIVERSITY OF ART &amp; DESIGN<br />
          33RD DEGREE SHOW
        </p>
        <p className="home-mobile-schedule">
          KAYWON DESIGN HALL 5F<br />
          NOV. 22 (FRI) - NOV. 24 (SUN)
        </p>
      </section>
    </main>
  )
}

function DesktopHome() {
  return (
    <main className="home-page" aria-label="Home">
      <section className="home-hero" aria-label="TYPE interaction">
        <TypeInteraction />
        <div className="home-hero-overlay">
          <p className="home-hero-hint">
            <RoundedStrokeText className="home-hero-hint-default">점 위에 마우스를 올려보세요!</RoundedStrokeText>
            <RoundedStrokeText className="home-hero-hint-active">점과 점을 연결해 SYNC를 경험해 보세요!</RoundedStrokeText>
          </p>
          <img
            className="home-hero-title"
            src={heroTitle}
            alt="LET’S SYNC!"
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
