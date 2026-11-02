import { useEffect, useRef } from 'react'
import startInsightNetwork from './insight-network.js'
import titleArtwork from './assets/lets-sync-title.svg'
import './DelightInsight.css'

export default function DelightInsight() {
  const canvasRef = useRef(null)

  useEffect(() => startInsightNetwork(canvasRef.current), [])

  return (
    <section className="home-insight" aria-labelledby="home-insight-title">
      <div className="home-insight-panel">
        <canvas ref={canvasRef} className="home-insight-network" aria-hidden="true" />
        <h2 id="home-insight-title" className="home-insight-title">
          <img src={titleArtwork} alt="LET’S SYNC!" width="487" height="91" draggable="false" />
        </h2>
        <div className="home-insight-info">
          <p className="home-insight-project">
            <span>2026</span>
            <span>DELIGHT</span>
            <span>INSIGHT</span>
          </p>
          <p className="home-insight-description">
            <span>2026년도 계원예술대학교 디지털미디어디자인과 졸업 전시 Delight Insight는</span>{' '}
            <span>이번 주제 LET’S SYNC!를 통하여, 서로 다른 개성이 관계를 맺고 영향을 주고받으며,</span>{' '}
            <span>이전에는 없던 가능성을 만들어 가는 생성적 연결을 표현합니다.</span>
          </p>
        </div>
      </div>
    </section>
  )
}
