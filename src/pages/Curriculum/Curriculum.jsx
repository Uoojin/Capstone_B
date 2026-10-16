import { useRef, useState } from 'react'
import { tracks, foundation, advanced, careers, curriculumArtwork, convergenceEducation } from './curriculumData'
import ornament from '../../assets/icon/DrawingObject.svg'
import curriculumLogo from '../../assets/curriculum/logo.svg'
import './Curriculum.css'

function SectionTitle({ children, id }) {
  return <h2 className="curriculum-title" id={id}><span aria-hidden="true">✳</span> {children} <span aria-hidden="true">✳</span></h2>
}

function CurriculumHeroArtwork() {
  const { titleSrc } = curriculumArtwork
  const symbolsSrc = curriculumLogo
  return (
    <>
      <div className="curriculum-symbols" aria-hidden="true">
        {[0, 1, 2, 3].map((index) => <span key={index} style={{ '--curriculum-symbol': `url("${ornament}")`, visibility: symbolsSrc ? 'hidden' : undefined }} />)}
        {symbolsSrc && <img className="curriculum-artwork-asset" src={symbolsSrc} alt="" />}
      </div>
      <h1 id="curriculum-main-title" className="curriculum-main-title" aria-label="DIGITAL MEDIA DESIGN">
        {['DIGITAL', 'MEDIA', 'DESIGN'].map((line) => <span key={line} style={{ visibility: titleSrc ? 'hidden' : undefined }}>{line}</span>)}
        {titleSrc && <img className="curriculum-artwork-asset" src={titleSrc} alt="" />}
      </h1>
    </>
  )
}

// Split each circumference at its exact intersections with the other circles.
// Only arcs whose midpoint lies inside another circle receive a dash pattern.
function circleOutlineArcs(circle) {
  const radius = 145
  const tau = Math.PI * 2
  const angles = [0, tau]
  for (const other of convergenceEducation) {
    if (other.id === circle.id) continue
    const dx = other.cx - circle.cx
    const dy = other.cy - circle.cy
    const distance = Math.hypot(dx, dy)
    if (!distance || distance >= radius * 2) continue
    const direction = Math.atan2(dy, dx)
    const spread = Math.acos(distance / (radius * 2))
    for (const angle of [direction - spread, direction + spread]) angles.push((angle + tau) % tau)
  }
  angles.sort((a, b) => a - b)
  const arcs = []
  for (let i = 0; i < angles.length - 1; i++) {
    const start = angles[i], end = angles[i + 1]
    if (end - start < 1e-8) continue
    const middle = (start + end) / 2
    const x = circle.cx + radius * Math.cos(middle)
    const y = circle.cy + radius * Math.sin(middle)
    const dashed = convergenceEducation.some((other) => other.id !== circle.id && Math.hypot(x - other.cx, y - other.cy) < radius)
    const previous = arcs[arcs.length - 1]
    if (previous && previous.dashed === dashed) previous.end = end
    else arcs.push({ start, end, dashed })
  }
  if (arcs.length > 1 && arcs[0].dashed === arcs[arcs.length - 1].dashed) {
    arcs[arcs.length - 1].end = arcs.shift().end + tau
  }
  return arcs.map(({ start, end, dashed }) => ({
    dashed,
    path: `M ${circle.cx + radius * Math.cos(start)} ${circle.cy + radius * Math.sin(start)} A ${radius} ${radius} 0 ${end - start > Math.PI ? 1 : 0} 1 ${circle.cx + radius * Math.cos(end)} ${circle.cy + radius * Math.sin(end)}`,
  }))
}

function ConvergenceDiagram() {
  const [activeId, setActiveId] = useState(null)
  // Paint the active circle last, including its overlap with the other circles.
  const circles = [...convergenceEducation].sort((a, b) => Number(a.id === activeId) - Number(b.id === activeId))
  return (
    <svg className="curriculum-diagram" viewBox="0 0 600 600" preserveAspectRatio="xMidYMid meet" aria-labelledby="convergence-description" onPointerLeave={() => setActiveId(null)}>
      <title id="convergence-description">DESIGN, MEDIA, TECHNOLOGY의 융합 교육</title>
      <g className="curriculum-diagram-orbit" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
        <circle cx="300" cy="300" r="285" strokeDasharray="2 4" />
        {[210, 330, 90].map((angle) => (
          <g key={angle} transform={`translate(${300 + 285 * Math.cos(angle * Math.PI / 180)} ${300 + 285 * Math.sin(angle * Math.PI / 180)}) rotate(${angle + 90})`}>
            <path d="M -7 -5 L 0 0 L -7 5" />
          </g>
        ))}
      </g>
      {circles.map(({ id, label, cx, cy, heading, description }) => {
        const active = id === activeId
        const top = cy - (heading.length * 26 + description.length * 23 + 12 - 23) / 2
        return (
          <g key={id} className={`curriculum-diagram-circle${active ? ' is-active' : ''}`} role="button" tabIndex={0} aria-label={`${label}: ${[...heading, ...description].join(', ')}`} aria-pressed={active}
            onPointerEnter={() => setActiveId(id)} onPointerLeave={() => setActiveId((current) => current === id ? null : current)}
            onFocus={() => setActiveId(id)} onBlur={() => setActiveId((current) => current === id ? null : current)}
            onClick={() => setActiveId(id)} onKeyDown={(event) => { if (event.key === 'Escape') setActiveId(null) }}>
            <circle cx={cx} cy={cy} r="145" />
            <g className="curriculum-diagram-outline" aria-hidden="true">
              {circleOutlineArcs({ id, cx, cy }).map((arc, index) => <path key={index} d={arc.path} strokeDasharray={arc.dashed ? '3 3' : undefined} />)}
            </g>
            <text className="curriculum-diagram-label" x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">{label}</text>
            <text className="curriculum-diagram-detail" textAnchor="middle" dominantBaseline="middle">
              {heading.map((line, index) => <tspan className="curriculum-diagram-detail-heading" key={line} x={cx} y={top + index * 26}>{line}</tspan>)}
              {description.map((line, index) => <tspan key={line} x={cx} y={top + heading.length * 26 + 12 + index * 23}>{line}</tspan>)}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function ScrollCue({ nextSectionRef }) {
  function scrollToNextSection() {
    const headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--site-header-height')) || 80
    window.scrollTo({ top: window.scrollY + nextSectionRef.current.getBoundingClientRect().top - headerHeight - 24, behavior: 'smooth' })
  }

  return (
    <div className="curriculum-scroll-cue">
      <button className="curriculum-scroll-button" type="button" onClick={scrollToNextSection} aria-label="CONVERGENCE EDUCATION으로 스크롤">
        <span>SCROLL DOWN</span>
        <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden="true">
          <path d="m1 1 7 7 7-7" pathLength="1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  )
}

function SemesterRows({ rows }) {
  return rows.map(({ semester, courses }) => (
    <div className={`curriculum-semester curriculum-semester--${semester}`} key={semester} role="group" aria-label={`${semester[0]}학년 ${semester[2]}학기`}>
      <span className="curriculum-semester-label">{semester}</span>
      {courses.map((subjects, trackIndex) => (
        <ul className="curriculum-course-cell" key={trackIndex} aria-label={`${semester} ${tracks[trackIndex]}`}>
          {subjects.map((subject) => <li className="curriculum-pill" key={subject}>{subject}</li>)}
        </ul>
      ))}
    </div>
  ))
}

function CurriculumChart() {
  return (
    <div className="curriculum-chart" aria-label="학년별 커리큘럼">
      <div className="curriculum-foundation">
        <div className="curriculum-track-headings">
          {tracks.map((track) => <h3 className="curriculum-pill curriculum-pill--pink" key={track}>{track}</h3>)}
        </div>
        <div className="curriculum-foundation-lines" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((track) => <i key={track} />)}
        </div>
        <SemesterRows rows={foundation} />
      </div>
      <div className="curriculum-advanced">
        <div className="curriculum-track-headings curriculum-advanced-headings">
          <h3 className="curriculum-pill curriculum-pill--pink">전공 교양</h3>
          <h3 className="curriculum-pill curriculum-pill--pink">전공</h3>
        </div>
        <svg className="curriculum-advanced-lines" viewBox="0 0 1000 480" preserveAspectRatio="none" aria-hidden="true">
          <g fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke">
            <path d="M90 0 V455 M500 0 V455 M295 125 V455 M705 125 V190 M295 125 H705 M910 0 V455" />
          </g>
        </svg>
        <SemesterRows rows={advanced} />
      </div>
    </div>
  )
}

export default function Curriculum() {
  const nextSectionRef = useRef(null)
  return (
    <main className="curriculum">
      <section className="curriculum-hero" aria-labelledby="curriculum-main-title">
        <CurriculumHeroArtwork />
        <div className="curriculum-introduction">
          <h2>WE ARE</h2>
          <p>디지털미디어디자인과는 디자인과 과학기술, 그리고 미디어의 융합 교육과 산업 수요를 반영한 스튜디오 중심의 교육을 통해 디지털 미디어 산업의 창조적인 문화콘텐츠를 생산할 수 있는 융합형 인재를 양성한다.</p>
        </div>
        <ScrollCue nextSectionRef={nextSectionRef} />
      </section>
      <section className="curriculum-convergence" ref={nextSectionRef} aria-labelledby="curriculum-convergence-title">
        <SectionTitle id="curriculum-convergence-title">CONVERGENCE EDUCATION</SectionTitle>
        <ConvergenceDiagram />
      </section>
      <section className="curriculum-program" aria-labelledby="curriculum-program-title">
        <SectionTitle id="curriculum-program-title">CURRICULUM</SectionTitle>
        <CurriculumChart />
      </section>
      <section className="curriculum-career" aria-labelledby="curriculum-career-title">
        <SectionTitle id="curriculum-career-title">CAREER</SectionTitle>
        <div className="curriculum-career-grid">
          {careers.map(({ title, jobs }) => (
            <section className="curriculum-career-column" key={title}>
              <h3 className="curriculum-pill curriculum-pill--pink">{title}</h3>
              <ul>{jobs.map((job) => <li className="curriculum-pill" key={job}>{job}</li>)}</ul>
            </section>
          ))}
        </div>
      </section>
    </main>
  )
}
