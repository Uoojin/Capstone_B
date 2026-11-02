import TypeInteraction from './TypeInteraction.jsx'
import heroTitle from '../../../../assets/heroTitle.svg'
import RoundedStrokeText from '../../../../components/RoundedStrokeText/RoundedStrokeText.jsx'

export default function Hero() {
  return (
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
              <p className="home-hero-info-heading"><span>LET’S EXHIBIT!</span></p>
              <p><span>11. 20. ( FRI ) - 22. ( SUN )</span></p>
              <p className="home-hero-info-korean"><span>계원예술대학교 디자인관 5층</span></p>
            </div>
            <div className="home-hero-schedule">
              <p className="home-hero-info-heading"><span>LET’S OPEN!</span></p>
              <p><span>11. 20. ( FRI ) PM 4:00</span></p>
              <p className="home-hero-info-korean"><span>계원예술대학교 디자인관 5층</span></p>
            </div>
          </div>
        </div>
      </section>
  )
}
