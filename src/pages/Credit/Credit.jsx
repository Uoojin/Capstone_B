import { useEffect, useLayoutEffect, useRef } from 'react'
import { committee, DMD, professors } from './creditData'
import schoolLogo from '../../assets/credit/KW Logo.svg'
import './Credit.css'

// Set videoSrc to a 1920×1080 video URL when the background film is ready.
function CreditBackground({ videoSrc }) {
  return (
    <div className="credit-background" aria-hidden="true">
      {videoSrc && <video src={videoSrc} autoPlay muted loop playsInline />}
    </div>
  )
}

function CreditSection({ title, data }) {
  return (
    <section className="credit-section">
      <h2>{title}</h2>
      <ul className="credit-list">
        {data.map((group, index) => (
          <li className="credit-row" key={`${group.title}-${index}`}>
            <span className="credit-label">{group.title}</span>
            <ul className="credit-members">
              {group.members.map((member, memberIndex) => <li key={`${member}-${memberIndex}`}>{member}</li>)}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function Credit({ videoSrc }) {
  const viewportRef = useRef(null)

  useLayoutEffect(() => {
    const viewport = viewportRef.current
    const hero = viewport.querySelector('.credit-hero')
    viewport.scrollTop = 0
    const headerBottom = Math.max(...[...document.querySelectorAll('.site-header, .site-header .site-logo, .site-header-menu')]
      .map((element) => element.getBoundingClientRect().bottom))
    const firstLine = Math.min(...[...hero.querySelectorAll('.credit-wordmark, p')]
      .map((element) => element.getBoundingClientRect().top))
    // Only correct an actual opening overlap; the roll's height and travel stay unchanged.
    hero.style.setProperty('--credit-opening-offset', `${Math.max(0, headerBottom + 24 - firstLine)}px`)
    return () => hero.style.removeProperty('--credit-opening-offset')
  }, [])

  useEffect(() => {
    const viewport = viewportRef.current
    const speed = 40 // Preserve the existing constant credit speed (CSS pixels/second).
    let frame
    let previousTime
    let paused = true
    let entryReady = false
    let disposed = false
    let resumeTimer
    let expectedScrollTop = 0
    viewport.scrollTop = 0

    function advance(time) {
      if (paused || disposed) return
      if (previousTime !== undefined) {
        const end = viewport.scrollHeight - viewport.clientHeight
        expectedScrollTop = Math.min(end, expectedScrollTop + (time - previousTime) / 1000 * speed)
        viewport.scrollTop = expectedScrollTop
        if (expectedScrollTop >= end) return
      }
      previousTime = time
      frame = window.requestAnimationFrame(advance)
    }

    function startAutoScroll() {
      if (!entryReady || disposed) return
      paused = false
      previousTime = undefined
      expectedScrollTop = viewport.scrollTop
      window.cancelAnimationFrame(frame)
      if (expectedScrollTop < viewport.scrollHeight - viewport.clientHeight) {
        frame = window.requestAnimationFrame(advance)
      }
    }

    const timer = window.setTimeout(() => {
      entryReady = true
      if (resumeTimer === undefined) startAutoScroll()
    }, 2000)

    function pauseAutoScroll() {
      paused = true
      window.cancelAnimationFrame(frame)
      window.clearTimeout(resumeTimer)
      // Actual scroll events keep extending this delay through trackpad inertia.
      resumeTimer = window.setTimeout(() => {
        resumeTimer = undefined
        startAutoScroll()
      }, 500)
    }

    function handleKeyDown(event) {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) pauseAutoScroll()
    }

    function handleScroll() {
      // Ignore our own scroll writes; manual/inertial movement resets the idle timer.
      if (paused || Math.abs(viewport.scrollTop - expectedScrollTop) > 1) pauseAutoScroll()
    }

    viewport.addEventListener('wheel', pauseAutoScroll, { passive: true })
    viewport.addEventListener('touchmove', pauseAutoScroll, { passive: true })
    viewport.addEventListener('keydown', handleKeyDown)
    viewport.addEventListener('scroll', handleScroll)
    return () => {
      disposed = true
      window.clearTimeout(timer)
      window.clearTimeout(resumeTimer)
      window.cancelAnimationFrame(frame)
      viewport.removeEventListener('wheel', pauseAutoScroll)
      viewport.removeEventListener('touchmove', pauseAutoScroll)
      viewport.removeEventListener('keydown', handleKeyDown)
      viewport.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <main className="credit" aria-label="전시 크레딧">
      <CreditBackground videoSrc={videoSrc} />
      <div className="credit-viewport" ref={viewportRef} tabIndex={0} role="region" aria-label="크레딧 스크롤 영역">
        <div className="credit-roll">
          <section className="credit-hero" aria-label="DELIGHT INSIGHT 2026 LET’S SYNC!">
            <div className="credit-wordmark">
              <span>DELIGHT INSIGHT 2026</span>
              <strong>LET’S SYNC!</strong>
            </div>
            <p>계원예술대학교<br />디지털미디어디자인과 졸업전시회</p>
          </section>
          <CreditSection title="졸업준비위원회" data={committee} />
          <CreditSection title="디지털미디어디자인과" data={DMD} />
          <CreditSection title="교수진" data={professors} />
          <div className="credit-logo">
            <img src={schoolLogo} alt="계원예술대학교 KAYWON UNIVERSITY OF ART & DESIGN" />
          </div>
        </div>
        <div className="credit-scroll-tail" aria-hidden="true" />
      </div>
    </main>
  )
}
