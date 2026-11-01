import { useEffect, useRef } from 'react'
import { applyArtwork, prepareArtwork, sequence } from './artwork.js'
import { startRolling } from './rolling-engine.js'
import './RollingTypography.css'

export default function RollingTypography() {
  const rootRef = useRef(null)
  useEffect(() => {
    let disposed = false, stop, exitTimer, entranceObserver, exitObserver
    const root = rootRef.current
    prepareArtwork().then(artwork => {
      if (disposed) return
      root.querySelectorAll('.letter').forEach(letter => {
        const basic = artwork[letter.dataset.assetKey].basic
        letter.querySelectorAll('.artwork img').forEach(image => applyArtwork(image, basic))
      })
      root.dataset.ready = 'true'
      stop = startRolling(root, artwork, applyArtwork)
      // Start when the rolling lane is actually visible, not while only the
      // title above it has entered the viewport.
      entranceObserver = new IntersectionObserver(entries => {
        if (disposed) return
        if (entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= .15)) {
          clearTimeout(exitTimer)
          stop.setVisible(true)
        }
      }, { threshold: [0, .15] })
      entranceObserver.observe(root.querySelector('.track-viewport'))
      // A small exit margin and grace period prevent boundary jitter resets.
      exitObserver = new IntersectionObserver(([entry]) => {
        if (disposed) return
        clearTimeout(exitTimer)
        if (!entry.isIntersecting) exitTimer = setTimeout(() => { if (!disposed) stop.setVisible(false) }, 180)
      }, { rootMargin: '24px 0px 24px 0px' })
      exitObserver.observe(root)
    }).catch(error => console.error('Rolling Typography assets:', error))
    return () => {
      disposed = true
      clearTimeout(exitTimer)
      entranceObserver?.disconnect()
      exitObserver?.disconnect()
      stop?.()
    }
  }, [])

  return (
    <section ref={rootRef} className="rolling-typography scroll-story" aria-labelledby="rolling-story-title">
      <div className="stage">
        <div className="intro">
          <h2 id="rolling-story-title">당기고, 닿고,<span>스파크!</span></h2>
          <p>서로 다른 형태와 이야기를 담은 글자들이 열정에 이끌려 움직이고 서로에게 닿습니다. 마젠타에서 시작된 움직임은 서로 닿는 순간 다채로운 색으로 퍼지며 새로운 SYNC를 만듭니다.
          </p>
        </div>
        <div className="track-viewport" aria-label="LET’S SYNC! 타이포그래피 가로 스크롤">
          <div className="letter-track">
            {sequence.map(key => <div key={key} className="letter" data-asset-key={key} role="img" aria-label={key.startsWith('S') ? 'S' : key}>
              <div className="artwork base"><img alt="" draggable="false" /></div>
              <div className="artwork pink"><img alt="" draggable="false" /></div>
              <div className="artwork color"><img alt="" draggable="false" /></div>
            </div>)}
          </div>
        </div>
        <div className="progress" aria-hidden="true"><span id="progress-fill" /></div>
      </div>
    </section>
  )
}
