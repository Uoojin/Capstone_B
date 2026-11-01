import createMediaQueryStore from '../../utils/createMediaQueryStore.js'
import { useSyncExternalStore } from 'react'
import useExhibitionFilm from './sections/Video/useExhibitionFilm.js'
import mobilePosterImage from '../../assets/mobileMain.svg'
import Hero from './sections/Hero/Hero.jsx'
import Section01 from './sections/Section01/Section01.jsx'
import Video from './sections/Video/Video.jsx'
import DesignMotifs from './sections/DesignMotifs/DesignMotifs.jsx'
import RollingTypography from './sections/RollingTypography/RollingTypography.jsx'
import Section03 from './sections/Section03/Section03.jsx'
import Section05 from './sections/Section05/Section05.jsx'
import './Home.css'

const { subscribe: subscribeToMobileViewport, getSnapshot: getMobileViewport } = createMediaQueryStore('(max-width: 767px)')

export default function Home() {
  const isMobile = useSyncExternalStore(subscribeToMobileViewport, getMobileViewport)
  // Unmount desktop effects on mobile, rather than hiding running interactions.
  return <>{isMobile ? <MobileHome /> : <DesktopHome />}</>
}

function DesktopHome() {
  const filmRef = useExhibitionFilm()

  return (
    <main className="home-page" aria-label="Home">
      <Hero />
      <Section01 />
      <Video filmRef={filmRef} />
      <DesignMotifs />
      <RollingTypography />
      <Section03 />
      <Section05 />
    </main>
  )
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
