// Reuse Section01's original pointer tilt (HEAD: sections/Section01/Section01.jsx):
// 25-degree range, exponential .14-second response, .05-second frame clamp.
// Layout rotation lives on the heading; landing lives on the sticker wrapper.
export default function createTitleTilt(heading, image) {
  const events = new AbortController()
  const current = { x: 0, y: 0 }
  const target = { x: 0, y: 0 }
  let enabled = false
  let frame = 0
  let lastTime = 0

  const render = () => {
    image.style.transform = `perspective(1000px) rotateX(${current.x}deg) rotateY(${current.y}deg)`
  }
  const animate = time => {
    const dt = lastTime ? Math.min((time - lastTime) / 1000, .05) : 1 / 60
    lastTime = time
    const blend = 1 - Math.exp(-dt / .14)
    let moving = false
    for (const axis of ['x', 'y']) {
      current[axis] += (target[axis] - current[axis]) * blend
      if (Math.abs(target[axis] - current[axis]) > .01) moving = true
      else current[axis] = target[axis]
    }
    render()
    if (moving) frame = requestAnimationFrame(animate)
    else { frame = 0; lastTime = 0 }
  }
  const start = () => { if (!frame) frame = requestAnimationFrame(animate) }
  const returnToRest = () => {
    target.x = 0
    target.y = 0
    if (enabled) start()
  }
  heading.addEventListener('pointermove', event => {
    if (!enabled || event.pointerType !== 'mouse') return
    const rect = heading.getBoundingClientRect()
    const x = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1))
    const y = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1))
    target.x = y * 25
    target.y = -x * 25
    start()
  }, { signal: events.signal })
  heading.addEventListener('pointerleave', returnToRest, { signal: events.signal })
  window.addEventListener('blur', returnToRest, { signal: events.signal })

  const reset = () => {
    enabled = false
    cancelAnimationFrame(frame)
    frame = 0
    lastTime = 0
    current.x = current.y = target.x = target.y = 0
    heading.style.removeProperty('pointer-events')
    image.style.removeProperty('transform')
  }
  return {
    enable: () => {
      enabled = true
      heading.style.pointerEvents = 'auto'
    },
    reset,
    dispose: () => { events.abort(); reset() },
  }
}
