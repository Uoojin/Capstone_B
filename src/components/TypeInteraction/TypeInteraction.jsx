import { useLayoutEffect, useRef, useState } from 'react'
import startTypeEngine from './type-engine.js'
import sceneStyles from './type-scene.css?inline'
import './TypeInteraction.css'

const typeAssets = import.meta.glob('../../assets/type/**/*.svg', {
  eager: true,
  import: 'default',
  query: '?url',
})
const assetMap = Object.fromEntries(
  Object.entries(typeAssets).map(([path, url]) => [path.split('/assets/type/')[1], url]),
)
const introLetters = ['L', 'E', 'T', 'S1', 'S2', 'Y', 'N', 'C']

// -------------------- TYPE INTERACTION --------------------
export default function TypeInteraction({ playIntro, onIntroComplete }) {
  const hostRef = useRef(null)
  const [placementSeed] = useState(() => Math.random())
  const onIntroCompleteRef = useRef(onIntroComplete)

  useLayoutEffect(() => {
    onIntroCompleteRef.current = onIntroComplete
  }, [onIntroComplete])

  useLayoutEffect(() => {
    const host = hostRef.current
    // Keep the iframe's style isolation without a second document or script evaluation.
    const root = host.shadowRoot || host.attachShadow({ mode: 'open' })
    const style = document.createElement('style')
    style.textContent = sceneStyles
    const scene = document.createElement('div')
    scene.className = 'type-scene'
    scene.innerHTML = `
      <div class="stage-wrap"><canvas id="scene"></canvas></div>
      <div class="vignette"></div>
      <div id="intro" aria-label="LETS SYNC">
        <div class="intro-title">${[0, 4].map(offset => `
          <div class="intro-line">${introLetters.slice(offset, offset + 4).map(letter =>
            `<img src="${assetMap[`${letter}_default.svg`]}" alt="${letter.replace(/[12]/, '')}">`,
          ).join('')}</div>`).join('')}
        </div>
      </div>`
    host.toggleAttribute('data-hero-ready', !playIntro)
    host.toggleAttribute('data-skip-intro', !playIntro)
    root.replaceChildren(style, scene)
    const stop = startTypeEngine({
      host,
      canvas: root.getElementById('scene'),
      intro: root.getElementById('intro'),
      assetMap,
      placementSeed,
      playIntro,
      onIntroComplete: () => onIntroCompleteRef.current?.(),
    })
    return () => {
      stop()
      root.replaceChildren()
    }
  }, [playIntro, placementSeed])

  return <div className="type-interaction" ref={hostRef} role="group" aria-label="TYPE interaction" />
}
