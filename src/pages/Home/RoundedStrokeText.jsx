import { useLayoutEffect, useRef } from 'react'
import './RoundedStrokeText.css'

// Keep HTML text as the layout/accessible foreground; mirror only its outline.
export default function RoundedStrokeText({ outline = 'svg', as: Element = 'span', className, children, ...props }) {
  if (outline === 'css') {
    return <Element {...props} className={['home-rounded-stroke-css', className].filter(Boolean).join(' ')}>{children}</Element>
  }
  return <SvgStrokeText {...props} as={Element} className={className}>{children}</SvgStrokeText>
}

// Retain the hero's existing outline unchanged; Insight opts into HTML/CSS above.
function SvgStrokeText({ as: Element = 'span', children, ...props }) {
  const ref = useRef(null)
  useLayoutEffect(() => {
    const host = ref.current
    const ns = 'http://www.w3.org/2000/svg'
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    let disposed = false
    let layer
    const render = () => {
      if (disposed) return
      layer?.remove()
      const box = host.getBoundingClientRect()
      if (!box.width || !box.height) return
      const svg = document.createElementNS(ns, 'svg')
      svg.classList.add('home-rounded-stroke-layer')
      svg.setAttribute('aria-hidden', 'true')
      svg.setAttribute('focusable', 'false')
      const walker = document.createTreeWalker(host, NodeFilter.SHOW_TEXT)
      const range = document.createRange()
      while (walker.nextNode()) {
        const node = walker.currentNode
        const style = getComputedStyle(node.parentElement)
        const width = style.getPropertyValue('--home-text-outline-width').trim()
        const color = style.getPropertyValue('--home-text-outline-color').trim()
        ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
        const ascent = ctx.measureText('Hg한').fontBoundingBoxAscent
        let line = null
        const lines = []
        for (let i = 0; i < node.length; i++) {
          range.setStart(node, i)
          range.setEnd(node, i + 1)
          const rect = range.getBoundingClientRect()
          if (!rect.height) continue
          if (!line || Math.abs(rect.top - line.top) > 1) {
            line = { text: '', left: rect.left, top: rect.top }
            lines.push(line)
          }
          line.text += node.textContent[i]
        }
        for (const line of lines) {
          const text = document.createElementNS(ns, 'text')
          text.textContent = line.text
          text.setAttribute('x', line.left - box.left)
          text.setAttribute('y', line.top - box.top + (ascent ?? 0))
          if (ascent === undefined) text.setAttribute('dominant-baseline', 'text-before-edge')
          text.setAttribute('fill', 'none')
          text.setAttribute('stroke', color)
          text.setAttribute('stroke-width', width)
          text.setAttribute('stroke-linejoin', 'round')
          text.setAttribute('stroke-linecap', 'round')
          Object.assign(text.style, {
            fontFamily: style.fontFamily, fontSize: style.fontSize,
            fontWeight: style.fontWeight, fontStyle: style.fontStyle,
            fontStretch: style.fontStretch, letterSpacing: style.letterSpacing,
            wordSpacing: style.wordSpacing, fontKerning: style.fontKerning,
            whiteSpace: 'pre',
          })
          svg.appendChild(text)
        }
      }
      host.prepend(svg)
      layer = svg
    }
    render()
    const observer = new ResizeObserver(render)
    observer.observe(host)
    window.addEventListener('resize', render)
    document.fonts.addEventListener('loadingdone', render)
    document.fonts.ready.then(render)
    return () => {
      disposed = true
      observer.disconnect()
      window.removeEventListener('resize', render)
      document.fonts.removeEventListener('loadingdone', render)
      layer?.remove()
    }
  }, [children])
  return <Element {...props} ref={ref}>{children}</Element>
}
