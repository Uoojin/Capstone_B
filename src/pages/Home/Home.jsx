import createMediaQueryStore from '../../utils/createMediaQueryStore.js'
import { useSyncExternalStore } from 'react'
import useExhibitionFilm from './sections/Video/useExhibitionFilm.js'
import mobilePosterImage from '../../assets/mobileMain.svg'
import Hero from './sections/Hero/Hero.jsx'
import DelightInsight from './sections/DelightInsight/DelightInsight.jsx'
import Video from './sections/Video/Video.jsx'
import DesignMotifs from './sections/DesignMotifs/DesignMotifs.jsx'
import SymbolGrid from './sections/SymbolGrid/SymbolGrid.jsx'

import LastSec from './sections/LastSec/LastSec.jsx'
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
      <DelightInsight />
      <Video filmRef={filmRef} />
      <DesignMotifs />
      <SymbolGrid />
      <LastSec />
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
          계원예술대학교 <br />
          디지털미디어디자인과 졸업전시회
        </p>
        <p className="home-mobile-schedule">
          2026 Delight Insight <br />
          11.20 FRI - 11.22 SUN
        </p>
      </section>
    </main>
  )
}
