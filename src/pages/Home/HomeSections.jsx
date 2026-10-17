import { useEffect, useRef, useState } from 'react'
import letsSync from "../../assets/let'ssync.svg"
import exhibitionFilm from '../../assets/sync_story.webm'
import empathy from '../../assets/symbol/symbol_1.svg'
import immersion from '../../assets/symbol/symbol_2.svg'
import discovery from '../../assets/symbol/symbol_3.svg'
import growth from '../../assets/symbol/symbol_4.svg'
import letterS from '../../assets/type/S2_default.svg'
import letterY from '../../assets/type/Y_default.svg'
import letterN from '../../assets/type/N_default.svg'
import './HomeSections.css'

const themes = [
  { id: 'empathy', title: '공감', asset: empathy, text: '서로 다른 생각과 감정이 만나고, 각자의 다름을 받아들이는 과정에서 이해의 폭이 넓어지며 새로운 가능성이 만들어집니다.' },
  { id: 'immersion', title: '몰입', asset: immersion, text: '서로의 경험을 나누며 하나의 존재와 과정에 깊이 집중하게 됩니다. 익숙한 방식을 벗어나 함께 새로운 방향으로 나아갑니다.' },
  { id: 'discovery', title: '발견', asset: discovery, text: '서로 다른 시선으로 바라보면 각자의 관점도 넓어집니다. 그 과정에서 혼자서는 보지 못했던 관점과 가능성을 발견합니다.' },
  { id: 'growth', title: '성장', asset: growth, text: '서로의 시도와 변화는 또 다른 도전을 시작하는 자극이 됩니다. 서로 영향을 주고받으며 새로운 시도를 이어갑니다.' },
]

// A mask recolors the supplied SVG's alpha silhouette without editing its paths.
function Symbol({ asset, className = '' }) {
  return <span aria-hidden="true" className={`home-symbol ${className}`} style={{ '--symbol-url': `url("${asset}")` }} />
}

export default function HomeSections() {
  const [activeTheme, setActiveTheme] = useState(null)
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

  return (
    <>
      <section className="home-insight" aria-labelledby="home-insight-title">
        <div className="home-insight-decoration" aria-hidden="true">
          {themes.map(theme => <Symbol key={theme.id} asset={theme.asset} className={`home-insight-symbol home-insight-symbol--${theme.id}`} />)}
        </div>
        <div className="home-insight-content">
          <h2 id="home-insight-title">2026 Delight Insight</h2>
          <img className="home-insight-wordmark" src={letsSync} alt="LET’S SYNC!" width="1306" height="165" draggable="false" />
          <p className="home-insight-description">
            <span>Delight Insight는 계원예술대학교 디지털미디어디자인과 졸업 전시의 대주제입니다.</span>
            <span>이번 주제 LET’S SYNC!는 서로 다른 개성들이 관계를 맺고 영향을 주고받으며,</span>
            <span>이전에는 없던 새로운 것을 만들어가는 생성적 연결을 의미합니다.</span>
          </p>
        </div>
      </section>

      <section className="home-film" aria-label="LET’S SYNC! 전시 영상">
        <video ref={filmRef} src={exhibitionFilm} muted playsInline preload="metadata" />
      </section>

      <section className="home-themes" aria-label="생성적 연결: 공감, 몰입, 발견, 성장">
        <div className="home-themes-grid">
          {themes.map(theme => {
            const active = activeTheme === theme.id
            return (
              <div className={`home-theme-pair home-theme-pair--${theme.id}`} key={theme.id}>
                <button
                  type="button"
                  className={`home-theme-symbol-card${active ? ' is-active' : ''}`}
                  aria-label={`${theme.title} 소개`}
                  aria-expanded={active}
                  aria-controls={`home-theme-${theme.id}`}
                  onMouseEnter={() => setActiveTheme(theme.id)}
                  onMouseLeave={() => setActiveTheme(null)}
                  onFocus={() => setActiveTheme(theme.id)}
                  onBlur={() => setActiveTheme(null)}
                  onClick={() => setActiveTheme(theme.id)}
                >
                  <Symbol asset={theme.asset} />
                </button>
                <div id={`home-theme-${theme.id}`} className={`home-theme-description${active ? ' is-active' : ''}`} aria-hidden={!active}>
                  <div className="home-theme-copy">
                    <h3>{theme.title}</h3>
                    <p>{theme.text}</p>
                  </div>
                </div>
              </div>
            )
          })}
          <div className="home-theme-blank home-theme-blank--top" aria-hidden="true" />
          <div className="home-theme-blank home-theme-blank--middle" aria-hidden="true" />
          <div className="home-theme-blank home-theme-blank--left" aria-hidden="true" />
          <div className="home-theme-blank home-theme-blank--bottom" aria-hidden="true" />
          <Symbol asset={letterS} className="home-theme-letter home-theme-letter--s" />
          <Symbol asset={letterY} className="home-theme-letter home-theme-letter--y" />
          <Symbol asset={letterN} className="home-theme-letter home-theme-letter--n" />
        </div>
      </section>

      <section className="home-closing" aria-labelledby="home-closing-title">
        <h2 id="home-closing-title"><span>LET’S SYNC!</span><span>LET’S SPARK!</span></h2>
        <p className="home-closing-description">서로 다른 우리는 함께 배우고 시도하며 서로의 가능성을 넓혀왔습니다. 함께 나눈 생각과 경험은 각자의 다음으로 이어집니다. 앞으로도 우리는 새로운 만남과 연결 속에서 또 다른 가능성을 만들어갈 것입니다.</p>
        <div className="home-closing-symbols" aria-hidden="true">
          {[immersion, empathy, growth, discovery].map(asset => <Symbol key={asset} asset={asset} />)}
        </div>
      </section>
    </>
  )
}
