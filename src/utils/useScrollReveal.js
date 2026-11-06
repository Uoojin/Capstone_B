import { useLayoutEffect, useRef } from 'react'

const selector = '[data-scroll-reveal]'
const easing = 'cubic-bezier(.215,.61,.355,1)'
const visibleThreshold = 0.08
const staggerMs = 100
const batchGapMs = 80

export default function useScrollReveal(gridRef, ready, batchSize, { showVisibleImmediately = false } = {}) {
  const seen = useRef(new Set())

  useLayoutEffect(() => {
    const grid = gridRef.current
    if (!ready || !grid || !window.IntersectionObserver || !grid.animate ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const revealed = seen.current
    const tracked = new Map()
    const show = element => {
      observer.unobserve(element)
      tracked.get(element)?.cancel()
      tracked.delete(element)
      element.style.removeProperty('opacity')
    }
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(({ target, intersectionRatio }) =>
        intersectionRatio >= visibleThreshold && tracked.get(target) === null && !target.hidden && grid.contains(target))
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top ||
          a.boundingClientRect.left - b.boundingClientRect.left)
      if (!visible.length) return

      const columns = getComputedStyle(grid).gridTemplateColumns.split(' ').length
      const groupSize = batchSize ?? columns
      visible.forEach(({ target }, index) => {
        revealed.add(target.dataset.scrollReveal)
        observer.unobserve(target)
        const animation = target.animate([
          { opacity: 0, transform: 'translateY(24px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ], {
          duration: 750,
          delay: index * staggerMs + Math.floor(index / groupSize) * batchGapMs,
          easing,
          fill: 'both',
        })
        tracked.set(target, animation)
        animation.onfinish = () => {
          if (tracked.get(target) === animation) show(target)
        }
      })
    }, { threshold: visibleThreshold })

    const sync = () => {
      for (const element of tracked.keys()) {
        if (element.hidden || !grid.contains(element)) show(element)
      }
      for (const element of grid.querySelectorAll(selector)) {
        if (element.hidden) continue
        const id = element.dataset.scrollReveal
        if (showVisibleImmediately && (!revealed.has(id) || tracked.has(element))) {
          const rect = element.getBoundingClientRect()
          if (rect.bottom > 0 && rect.top < document.documentElement.clientHeight &&
              rect.right > 0 && rect.left < document.documentElement.clientWidth) {
            revealed.add(id)
            show(element)
            continue
          }
        }
        if (tracked.has(element) || revealed.has(id)) continue
        element.style.opacity = '0'
        tracked.set(element, null)
        observer.observe(element)
      }
    }
    const focus = event => {
      const element = event.target.closest(selector)
      if (!tracked.has(element)) return
      revealed.add(element.dataset.scrollReveal)
      show(element)
    }
    const changes = new MutationObserver(records => {
      if (!showVisibleImmediately || records.some(record => record.target === grid)) sync()
    })
    changes.observe(grid, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] })
    grid.addEventListener('focusin', focus)
    sync()
    return () => {
      changes.disconnect()
      grid.removeEventListener('focusin', focus)
      for (const element of tracked.keys()) show(element)
      observer.disconnect()
    }
  }, [gridRef, ready, batchSize, showVisibleImmediately])
}
