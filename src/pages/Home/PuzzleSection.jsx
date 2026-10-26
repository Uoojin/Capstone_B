import { useEffect, useRef } from 'react'
import { mountPuzzle } from './puzzle-engine.js'
import './PuzzleSection.css'

export default function PuzzleSection() {
  const rootRef = useRef(null)
  useEffect(() => mountPuzzle(rootRef.current), [])

  return (
    <section className="home-puzzle" ref={rootRef} aria-label="공감, 몰입, 발견, 성장 스크롤 퍼즐">
      <div className="scene" data-puzzle="scene">
        <div className="sticky" data-puzzle="sticky">
          <div className="layer" data-puzzle="layer" aria-label="공감, 몰입, 발견, 성장 네 가지 심볼" />
          <div className="cue" data-puzzle="cue"><span>스크롤해서 모양을 맞춰보세요</span><i /></div>
        </div>
      </div>
      <div className="after" aria-hidden="true" />
      <div className="caption" data-puzzle="caption" aria-live="polite" />
    </section>
  )
}
