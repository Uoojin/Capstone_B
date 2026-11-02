import { useRef, useState } from 'react'
import { symbols } from './symbols.js'
import { categories, categoryOf } from './categories.js'
import { assetMap } from './assetMap.js'
import './SymbolGrid.css'

const assets = import.meta.glob('../../../../assets/type/**/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
})

function sourceFor(part) {
  const path = assetMap[part.src]
  return path ? assets[`../../../../assets/type/${path}`] : undefined
}

function missingDescription(item) {
  const missing = item.parts.filter(part => !sourceFor(part))
  return missing.length ? `대응 SVG 없음: ${missing.map(part => part.src.split('/').pop()).join(', ')}` : undefined
}

function SymbolImage({ item, preview = false }) {
  return (
    <div className="home-symbols__symbol-image" role={preview ? 'img' : undefined} aria-label={preview ? item.name : undefined}>
      <div className="home-symbols__symbol-art">
        {item.parts.map((part, index) => {
          const src = sourceFor(part)
          const style = { left: `${part.x}%`, top: `${part.y}%`, width: `${part.width}%`, height: `${part.height}%` }
          // Keep absent layers in their original stacking position without substituting artwork.
          return src
            ? <img key={index} src={src} alt="" loading="lazy" style={style} />
            : <span key={index} data-missing-layer={part.src} aria-hidden="true" style={{ ...style, position: 'absolute' }} />
        })}
      </div>
    </div>
  )
}

export default function SymbolGrid() {
  const [activeCategory, setActiveCategory] = useState('L')
  const [selectedId, setSelectedId] = useState(() => symbols.find(item => categoryOf(item) === 'L').id)
  const [previewVersion, setPreviewVersion] = useState(0)
  const gridRef = useRef(null)
  const items = activeCategory === 'ALL' ? symbols : symbols.filter(item => categoryOf(item) === activeCategory)
  const selected = symbols.find(item => item.id === selectedId)

  function selectItem(item) {
    setSelectedId(item.id)
    // The original replaces the preview even when selecting the same item again.
    setPreviewVersion(version => version + 1)
  }

  function selectCategory(category) {
    const nextItems = category === 'ALL' ? symbols : symbols.filter(item => categoryOf(item) === category)
    setActiveCategory(category)
    if (nextItems.length) selectItem(nextItems[0])
    if (gridRef.current) gridRef.current.scrollTop = 0
  }

  return (
    <section className="home-symbols__symbol-section" aria-label="심볼 목록">
      <div className="home-symbols__symbol-content">
        <div className="home-symbols__preview-column">
          <div className="home-symbols__section-heading" aria-hidden="true" />
          <section className="home-symbols__preview" aria-label="선택한 심볼" aria-live="polite" title={selected && missingDescription(selected)}>
            {selected && <SymbolImage key={previewVersion} item={selected} preview />}
          </section>
        </div>
        <div className="home-symbols__symbol-list">
          <nav className="home-symbols__filters" aria-label="심볼 분류">
            {categories.map(([value, label]) => (
              <button key={value} type="button" className="home-symbols__filter-chip" aria-pressed={value === activeCategory} onClick={() => selectCategory(value)}>{label}</button>
            ))}
          </nav>
          <div ref={gridRef} className="home-symbols__symbol-grid" aria-label="심볼 목록">
            {items.map(item => (
              <button key={item.id} type="button" className="home-symbols__symbol-option" data-figma-id={item.id} aria-label={item.name} aria-description={missingDescription(item)} title={missingDescription(item)} aria-pressed={item.id === selectedId} onClick={() => selectItem(item)}>
                <SymbolImage item={item} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
