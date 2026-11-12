// Move the document itself so sticky positioning and ScrollTrigger share one scroll position.
export default function createWheelMotion(root, getEntryLimit) {
  const scroller = document.scrollingElement
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  let frame = 0
  let target, position, velocity, lastY, lastTime

  const stop = () => {
    cancelAnimationFrame(frame)
    frame = 0
  }
  const canMove = () => !reducedMotion.matches && !root.closest('[inert]')
  const tick = now => {
    if (!canMove() || window.scrollY !== lastY) {
      stop()
      return
    }
    const elapsed = Math.max(0, Math.min(now - lastTime, 32))
    lastTime = now
    // A critically damped spring eases in and settles without overshooting.
    const distance = position - target
    const decay = 1 / 38
    const slope = velocity + distance * decay
    const falloff = Math.exp(-elapsed * decay)
    position = target + (distance + slope * elapsed) * falloff
    velocity = (velocity - slope * elapsed * decay) * falloff
    const arrived = Math.abs(target - position) < .5 && Math.abs(velocity) < .02
    window.scrollTo({ top: arrived ? target : position, behavior: 'instant' })
    lastY = window.scrollY
    frame = arrived ? 0 : requestAnimationFrame(tick)
  }

  const wheel = event => {
    if (!event.cancelable || !canMove()) return

    const y = window.scrollY
    const max = scroller.scrollHeight - scroller.clientHeight
    // Safari can report positions outside the document during rubber-banding.
    if (y < 0 || y > max) {
      stop()
      return
    }

    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1
    const delta = event.deltaY * unit
    if (y !== lastY || (target - y) * delta < 0) stop()
    if (!frame) {
      target = position = lastY = y
      velocity = 0
      lastTime = performance.now()
    }
    const limit = getEntryLimit(y, Math.sign(delta))
    target = Math.max(0, Math.min(max, target + delta))
    if (limit !== null) target = delta > 0 ? Math.min(target, limit) : Math.max(target, limit)

    event.preventDefault()
    if (!frame && target !== y) frame = requestAnimationFrame(tick)
  }

  return { wheel, stop }
}
