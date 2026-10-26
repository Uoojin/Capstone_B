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

// -------------------- TYPE INTERACTION --------------------
export default function TypeInteraction() {
  const hostRef = useRef(null)
  const [placementSeed] = useState(() => Math.random())

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
      <div class="vignette"></div>`
    root.replaceChildren(style, scene)
    const stop = startTypeEngine({
      host,
      canvas: root.getElementById('scene'),
      assetMap,
      placementSeed,
    })
    return () => {
      stop()
      root.replaceChildren()
    }
  }, [placementSeed])

  return <div className="type-interaction" ref={hostRef} role="group" aria-label="TYPE interaction" />
}
