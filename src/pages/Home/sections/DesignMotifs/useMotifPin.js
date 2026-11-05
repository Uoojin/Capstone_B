import { useEffect, useRef, useState } from 'react'
import createWheelMotion from './createWheelMotion.js'

// Keep source select()/step() semantics. Only input eligibility and the two
// outward boundaries are specific to integration in the scrolling React page.
export default function useMotifPin(rootRef, count) {
  const selectRef = useRef(null)
  const [selection, setSelection] = useState({ current: { index: 0, key: 0 }, outgoing: null })
  useEffect(() => {
    const root = rootRef.current
    const range = root.parentElement
    let active = Number(root.dataset.active), locked = false, timer
    let inside = false, previousY = window.scrollY, touchStart = null, exitReadyAt = 0
    let releaseTimer, ownsScrollLock = false
    const scrollStyle = document.documentElement.style
    let savedOverflow = '', savedPriority = ''
    const wheelMotion = createWheelMotion(root, (y, direction) => {
      const rect = range.getBoundingClientRect()
      const start = y + rect.top
      const end = y + rect.bottom - root.getBoundingClientRect().height
      // A large wheel delta should land inside the input range from either side.
      if (direction > 0 && y < start) return Math.ceil(start)
      if (direction < 0 && y > end) return Math.floor(end)
      return null
    })
    const scrollLock = enabled => {
      if (enabled && !ownsScrollLock) {
        savedOverflow = scrollStyle.getPropertyValue('overflow-y')
        savedPriority = scrollStyle.getPropertyPriority('overflow-y')
        scrollStyle.setProperty('overflow-y', 'hidden')
        ownsScrollLock = true
      } else if (!enabled && ownsScrollLock) {
        if (savedOverflow) scrollStyle.setProperty('overflow-y', savedOverflow, savedPriority)
        else scrollStyle.removeProperty('overflow-y')
        ownsScrollLock = false
      }
    }
    const fullyPinned = () => {
      const rect = root.getBoundingClientRect()
      return Math.abs(rect.top) <= 1 && rect.bottom >= Math.min(rect.height, window.innerHeight) - 1
    }
    const select = (index, restart = false) => {
      const next = Math.max(0, Math.min(count - 1, index))
      if (next === active && !restart) return
      active = next
      setSelection(({ current }) => ({
        current: { index: next, key: current.key + 1 },
        outgoing: restart ? null : current,
      }))
      exitReadyAt = performance.now() + 850
    }
    const lock = () => {
      locked = true
      clearTimeout(timer)
      timer = setTimeout(() => { locked = false }, 850)
    }
    // Source lock duration, clamping and one-step-per-input are unchanged.
    const step = direction => {
      if (locked) return
      lock()
      select(active + direction)
    }
    const endpointReady = () => !locked && performance.now() >= exitReadyAt && (active === 0 || active === count - 1)
    const refreshScrollLock = () => scrollLock(fullyPinned() && !endpointReady())
    const queueBoundaryRelease = () => {
      clearTimeout(releaseTimer)
      refreshScrollLock()
      if (fullyPinned() && (active === 0 || active === count - 1)) {
        // Restore native scrollability before the next outward wheel arrives.
        // Changing overflow during that wheel can otherwise swallow its default
        // scroll because its scrolling target was resolved while still locked.
        releaseTimer = setTimeout(refreshScrollLock, Math.max(0, exitReadyAt - performance.now()) + 1)
      }
    }
    const boundary = () => {
      const y = window.scrollY
      const full = fullyPinned()
      if (full && !inside) {
        const fromBelow = y < previousY
        select(fromBelow ? count - 1 : 0, true)
        // The event that brought the section in must not also skip EMPATHY
        // (or GROWTH when entering from below).
        lock()
        queueBoundaryRelease()
      }
      refreshScrollLock()
      inside = full
      previousY = y
    }
    const outward = direction => direction < 0 ? active === 0 : active === count - 1
    const input = (event, direction, advance = true) => {
      if (!fullyPinned()) return
      boundary()
      if (locked) { event.preventDefault(); return }
      if (outward(direction)) {
        if (performance.now() < exitReadyAt) event.preventDefault()
        else scrollLock(false)
        return
      }
      event.preventDefault()
      if (advance) {
        scrollLock(true)
        step(direction)
        queueBoundaryRelease()
      }
    }
    const wheel = event => {
      if (!event.deltaY || event.defaultPrevented || event.ctrlKey || event.shiftKey ||
          Math.abs(event.deltaX) > Math.abs(event.deltaY) || root.closest('[inert]')) return
      // Small trackpad deltas must still be consumed while pinned. The source
      // threshold belongs to step(), not to the page's scroll lock.
      input(event, event.deltaY > 0 ? 1 : -1, Math.abs(event.deltaY) >= 8)
      if (event.defaultPrevented) wheelMotion.stop()
      else wheelMotion.wheel(event)
    }
    const keydown = event => {
      wheelMotion.stop()
      if (['ArrowDown', 'PageDown'].includes(event.key)) input(event, 1)
      if (['ArrowUp', 'PageUp'].includes(event.key)) input(event, -1)
      if ([' ', 'Home', 'End'].includes(event.key) && !event.target.closest('button, input, textarea, select, [contenteditable]')) {
        input(event, event.key === 'Home' || (event.key === ' ' && event.shiftKey) ? -1 : 1, false)
      }
    }
    const touchstart = event => {
      wheelMotion.stop()
      touchStart = event.touches[0].clientY
      boundary()
    }
    const touchmove = event => {
      if (touchStart === null || !fullyPinned()) return
      const delta = touchStart - event.touches[0].clientY
      if (delta) input(event, delta > 0 ? 1 : -1, false)
    }
    const touchend = event => {
      if (touchStart === null) return
      const delta = touchStart - event.changedTouches[0].clientY
      if (fullyPinned() && Math.abs(delta) > 45 && !outward(delta > 0 ? 1 : -1)) {
        step(delta > 0 ? 1 : -1)
        queueBoundaryRelease()
      }
      touchStart = null
    }
    const touchcancel = () => { touchStart = null }
    selectRef.current = index => {
      select(index)
      queueBoundaryRelease()
    }
    const resize = () => {
      wheelMotion.stop()
      boundary()
    }
    window.addEventListener('scroll', boundary, { passive: true })
    window.addEventListener('resize', resize)
    window.addEventListener('pointerdown', wheelMotion.stop, { passive: true })
    window.addEventListener('wheel', wheel, { passive: false, capture: true })
    window.addEventListener('keydown', keydown)
    window.addEventListener('touchstart', touchstart, { passive: true })
    window.addEventListener('touchmove', touchmove, { passive: false })
    window.addEventListener('touchend', touchend, { passive: true })
    window.addEventListener('touchcancel', touchcancel, { passive: true })
    boundary()
    return () => {
      clearTimeout(timer)
      clearTimeout(releaseTimer)
      wheelMotion.stop()
      scrollLock(false)
      window.removeEventListener('scroll', boundary)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointerdown', wheelMotion.stop)
      window.removeEventListener('wheel', wheel, true)
      window.removeEventListener('keydown', keydown)
      window.removeEventListener('touchstart', touchstart)
      window.removeEventListener('touchmove', touchmove)
      window.removeEventListener('touchend', touchend)
      window.removeEventListener('touchcancel', touchcancel)
      selectRef.current = null
    }
  }, [rootRef, count])
  return {
    ...selection,
    selectMotif: index => selectRef.current?.(index),
    finishTransition: key => setSelection(selection => selection.outgoing?.key === key
      ? { ...selection, outgoing: null }
      : selection),
  }
}
