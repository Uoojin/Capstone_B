import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePageTransitionReady } from '../../components/PageTransition/PageTransitionContext.js'
import { curriculumByYear, careers, curriculumArtwork } from './curriculumData'
import unitStar from '../../assets/curriculum/unit-star.svg'
import unitTriangle from '../../assets/curriculum/unit-triangle.svg'
import unitCircle from '../../assets/curriculum/unit-circle.svg'
import ConvergenceDiagram from './ConvergenceDiagram.jsx'
import './Curriculum.css'

gsap.registerPlugin(ScrollTrigger)

const revealSections = [
  ['.curriculum-convergence', '.curriculum-diagram'],
  ['.curriculum-program', '.curriculum-year-selector, .curriculum-chart'],
  ['.curriculum-career', '.curriculum-career-grid'],
]

function SectionTitle({ children, id, symbol }) {
  return <h2 className="curriculum-title" id={id}><span aria-hidden="true"><img src={symbol} alt="" /></span>{children}<span aria-hidden="true"><img src={symbol} alt="" /></span></h2>
}

function CurriculumHeroArtwork() {
  const { titleSrc } = curriculumArtwork
  return (
    <>
      <h1 id="curriculum-main-title" className="curriculum-main-title" aria-label="DIGITAL MEDIA DESIGN">
        {['DIGITAL', 'MEDIA', 'DESIGN'].map((line) => <span key={line} style={{ visibility: titleSrc ? 'hidden' : undefined }}>{line}</span>)}
        {titleSrc && <img className="curriculum-artwork-asset" src={titleSrc} alt="" />}
      </h1>
    </>
  )
}


function ScrollCue({ nextSectionRef }) {
  function scrollToNextSection() {
    const headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--site-header-height')) || 80
    window.scrollTo({ top: window.scrollY + nextSectionRef.current.getBoundingClientRect().top - headerHeight - 24, behavior: 'smooth' })
  }

  return (
    <div className="curriculum-scroll-cue">
      <button className="curriculum-scroll-button scroll-indicator" type="button" onClick={scrollToNextSection} aria-label="CONVERGENCE EDUCATION으로 스크롤" />
    </div>
  )
}

function SemesterRows({ rows, tracks }) {
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

function CurriculumChart({ data, year }) {
  // Keep the existing chart's space while a year's course data is pending.
  const { tracks, foundation, advanced } = data || curriculumByYear[2026]
  return (
    <div className="curriculum-chart" data-year={year} aria-label="학년별 커리큘럼">
      <div style={{ visibility: data ? undefined : 'hidden' }} aria-hidden={!data || undefined}>
        <div className="curriculum-foundation">
          <div className="curriculum-track-headings">
            {tracks.map((track) => <h3 className="curriculum-pill curriculum-pill--pink" key={track}>{track}</h3>)}
          </div>
          <div className="curriculum-foundation-lines" aria-hidden="true">
            {tracks.map((track) => <i key={track} />)}
          </div>
          <SemesterRows rows={foundation} tracks={tracks} />
        </div>
        <div className="curriculum-advanced">
          <div className="curriculum-track-headings curriculum-advanced-headings">
            <h3 className="curriculum-pill curriculum-pill--pink">전공 교양</h3>
            <h3 className="curriculum-pill curriculum-pill--pink">전공</h3>
          </div>
          <svg className="curriculum-advanced-lines" viewBox="0 0 1000 480" preserveAspectRatio="none" aria-hidden="true">
            <g fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke">
              <path d={`M90 0 V455 M500 0 V455 M295 125 V455 M705 125 V190 M295 125 H705 M910 ${year === 2027 ? 190 : 0} V455`} />
            </g>
          </svg>
          <SemesterRows rows={advanced} tracks={tracks} />
        </div>
      </div>
      {!data && <p className="curriculum-pending" role="status">{year} 커리큘럼 준비 중</p>}
    </div>
  )
}

export default function Curriculum() {
  const pageRef = useRef(null)
  const nextSectionRef = useRef(null)
  const [selectedYear, setSelectedYear] = useState(2026)
  const ready = usePageTransitionReady()

  useLayoutEffect(() => {
    if (!ready) return

    const page = pageRef.current
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const cleanupFocus = revealSections.map(([sectionSelector, contentSelector]) => {
        const section = page.querySelector(sectionSelector)
        const title = section.querySelector('.curriculum-title')
        const content = section.querySelectorAll(contentSelector)
        const initial = { opacity: 0, y: 30 }
        const timeline = gsap.timeline({
          paused: true,
          defaults: { duration: 0.95, ease: 'power3.out' },
        })
          .from(title, { ...initial, immediateRender: true }, 0)
          .from(content, { ...initial, immediateRender: true }, 0.15)

        const trigger = ScrollTrigger.create({
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          onEnter: () => timeline.play(),
          onLeaveBack: () => timeline.pause(0),
        })
        if (trigger.isActive) timeline.play()

        // Keep keyboard focus visible even when it moves ahead of the reveal.
        const showOnFocus = () => timeline.progress(1).pause()
        section.addEventListener('focusin', showOnFocus)
        return () => section.removeEventListener('focusin', showOnFocus)
      })
      return () => cleanupFocus.forEach(remove => remove())
    })
    return () => media.revert()
  }, [ready])

  return (
    <main className="curriculum" ref={pageRef}>
      <section className="curriculum-hero" aria-labelledby="curriculum-main-title">
        <CurriculumHeroArtwork />
        <div className="curriculum-introduction">
          <h2>WE ARE</h2>
          <p>디지털미디어디자인과는 디자인과 과학기술, 그리고 미디어의 융합 교육과 산업 수요를 반영한 스튜디오 중심의 교육을 통해 디지털 미디어 산업의 창조적인 문화콘텐츠를 생산할 수 있는 융합형 인재를 양성한다.</p>
        </div>
        <ScrollCue nextSectionRef={nextSectionRef} />
      </section>
      <section className="curriculum-convergence" ref={nextSectionRef} aria-labelledby="curriculum-convergence-title">
        <SectionTitle id="curriculum-convergence-title" symbol={unitStar}>CONVERGENCE EDUCATION</SectionTitle>
        <ConvergenceDiagram />
      </section>
      <section className="curriculum-program" aria-labelledby="curriculum-program-title">
        <div className="curriculum-program-heading">
          <SectionTitle id="curriculum-program-title" symbol={unitTriangle}>CURRICULUM</SectionTitle>
          <div className="curriculum-year-selector" role="group" aria-label="커리큘럼 연도 선택">
            {Object.keys(curriculumByYear).map((year) => (
              <button key={year} type="button" aria-pressed={selectedYear === Number(year)} onClick={() => setSelectedYear(Number(year))}>{year}</button>
            ))}
          </div>
        </div>
        <CurriculumChart data={curriculumByYear[selectedYear]} year={selectedYear} />
      </section>
      <section className="curriculum-career" aria-labelledby="curriculum-career-title">
        <SectionTitle id="curriculum-career-title" symbol={unitCircle}>CAREER</SectionTitle>
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
