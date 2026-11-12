import { useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { symbolItems as symbols } from './symbolAssets.js'
import { categories } from './categories.js'
import { previewOffsets } from './previewOffsets.js'
import './SymbolGrid.css'

const assets = import.meta.glob('../../../../assets/type/**/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
})

function sourceFor(part) {
  return assets[`../../../../assets/type/${part.src}`]
}

function missingDescription(item) {
  const missing = item.parts.filter(part => !sourceFor(part))
  return missing.length ? `대응 SVG 없음: ${missing.map(part => part.src.split('/').pop()).join(', ')}` : undefined
}

function SymbolImage({ item, preview = false, version = 0, reducedMotion = false, background = item.background, onExitComplete }) {
  const [offsetX, offsetY] = previewOffsets[item.id] ?? [0, 0]
  const alignment = preview ? { '--symbol-center-x': `${offsetX}%`, '--symbol-center-y': `${offsetY}%` } : undefined
  const artwork = (
    <div className="home-symbols__symbol-art" style={alignment}>
      {item.parts.map((part, index) => {
        const src = sourceFor(part)
        const style = { left: `${part.x}%`, top: `${part.y}%`, width: `${part.width}%`, height: `${part.height}%` }
        // Keep absent layers in their original stacking position without substituting artwork.
        return src
          ? <img key={index} src={src} alt="" loading={preview ? 'eager' : 'lazy'} style={style} />
          : <span key={index} data-missing-layer={part.src} aria-hidden="true" style={{ ...style, position: 'absolute' }} />
      })}
    </div>
  )

  return (
    <div className="home-symbols__symbol-image" style={preview ? { backgroundColor: background } : undefined} role={preview ? 'img' : undefined} aria-label={preview ? item.name : undefined}>
      {preview ? (
        <AnimatePresence mode="sync" initial={false} onExitComplete={onExitComplete}>
          <motion.div
            key={version}
            className="home-symbols__preview-motion"
            initial={{ x: reducedMotion ? 0 : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: reducedMotion ? 0 : '-100%' }}
            transition={{ duration: reducedMotion ? 0 : .6, ease: [.65, 0, .35, 1] }}
          >
            {artwork}
          </motion.div>
        </AnimatePresence>
      ) : artwork}
    </div>
  )
}

export default function SymbolGrid() {
  const [activeCategory, setActiveCategory] = useState('L')
  const [selectedId, setSelectedId] = useState(() => symbols[0].id)
  const [previewState, setPreviewState] = useState(() => ({ item: symbols[0], version: 0 }))
  const slidingRef = useRef(false)
  const pendingPreviewRef = useRef(null)
  const gridRef = useRef(null)
  const reducedMotion = useReducedMotion()
  const items = symbols.filter(item => item.category === activeCategory)
  const selected = symbols.find(item => item.id === selectedId)

  function slidePreview(item) {
    if (slidingRef.current) {
      pendingPreviewRef.current = item
      return
    }
    slidingRef.current = true
    setPreviewState(current => ({ item, version: current.version + 1 }))
  }

  function finishSlide() {
    slidingRef.current = false
    const pending = pendingPreviewRef.current
    pendingPreviewRef.current = null
    if (pending) slidePreview(pending)
  }

  function selectItem(item) {
    setSelectedId(item.id)
    // Keep only the latest queued selection while the current pair slides.
    slidePreview(item)
  }

  function selectCategory(category) {
    const nextItems = symbols.filter(item => item.category === category)
    setActiveCategory(category)
    if (nextItems.length) selectItem(nextItems[0])
    if (gridRef.current) gridRef.current.scrollTop = 0
  }

  return (
    <section className="home-symbols__symbol-section" aria-label="심볼 목록">
      <div className="home-symbols__panel">
        <header className="home-symbols__heading">
          <h2 className="home-symbols__title" data-font="display"><span>Key Visual</span><span>Typography</span></h2>
          <p className="home-symbols__description">
            <span>저마다의 개성이 모여 LET’S SYNC!에 새로운 색을 더합니다.</span>
            <span>각자의 감각으로 글자를 조합하며 나만의 방식으로 연결의 의미를 발견해 보세요.</span>
          </p>
        </header>
        <div className="home-symbols__symbol-content">
          <div className="home-symbols__preview-column">
            <section className="home-symbols__preview" aria-label="선택한 심볼" aria-live="polite" title={selected && missingDescription(selected)}>
              {selected && <SymbolImage item={previewState.item} preview version={previewState.version} reducedMotion={reducedMotion} background={selected.background} onExitComplete={finishSlide} />}
            </section>
          </div>
          <nav className="home-symbols__filters" aria-label="심볼 분류">
            {categories.map(([value, label]) => (
              <button key={value} type="button" className="home-symbols__filter-chip" aria-pressed={value === activeCategory} onClick={() => selectCategory(value)}>{value === 'APOSTROPHE' ? ',' : label}</button>
            ))}
          </nav>
          <div className="home-symbols__symbol-list">
            <div ref={gridRef} className="home-symbols__symbol-grid" aria-label="심볼 목록">
              {items.map(item => (
                <button key={item.id} type="button" className="home-symbols__symbol-option" aria-label={item.name} aria-description={missingDescription(item)} title={missingDescription(item)} aria-pressed={item.id === selectedId} onClick={() => selectItem(item)}>
                  <SymbolImage item={item} />
                </button>
              ))}
              {Array.from({ length: Math.max(0, 9 - items.length) }, (_, index) => (
                <div key={`empty-${index}`} className="home-symbols__empty-cell" aria-hidden="true" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
