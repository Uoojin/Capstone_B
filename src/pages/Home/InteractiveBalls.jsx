import { useEffect, useRef } from 'react'
import startBalls from './balls/balls-engine.js'
import './InteractiveBalls.css'

function ModeLabel({ children }) {
  return <svg className="home-balls-mode-label" viewBox="0 0 76 38" aria-hidden="true" focusable="false">
    <text x="5" y="28" fill="#fff" stroke="#FD00A0" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" paintOrder="stroke fill">{children}</text>
  </svg>
}

export default function InteractiveBalls() {
  const section = useRef(null)
  const canvas = useRef(null)
  const pull = useRef(null)
  const play = useRef(null)
  useEffect(() => startBalls({
    section: section.current, cv: canvas.current,
    pullButton: pull.current, playButton: play.current,
  }), [])
  return <section className="home-balls" ref={section} aria-label="Interactive Balls">
    <canvas ref={canvas} aria-label="PULL 모드에서는 커서로 끌어당기고, PLAY 모드에서는 공을 잡아 던져보세요. 빈 곳을 더블클릭하면 공이 추가됩니다." />
    <div className="home-balls-top">
      <div className="home-balls-prompt">
        <h2>커서로 공을 끌어 당겨보세요!</h2>
        <p>가까이 가면 붙고, 세게 흔들면 떨어져요</p>
      </div>
      <div className="home-balls-modes" aria-label="공 인터랙션 모드">
        <button type="button" ref={pull} aria-pressed="true" aria-label="PULL"><ModeLabel>PULL</ModeLabel></button>
        <button type="button" ref={play} aria-pressed="false" aria-label="PLAY"><ModeLabel>PLAY</ModeLabel></button>
      </div>
    </div>
  </section>
}
