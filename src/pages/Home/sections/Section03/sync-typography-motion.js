import { startSyncopate } from './syncopateEngine.js'

// Uses the motion engine from syncopate-react(1), rather than the former .bin SVG frames.
export function startSyncTypographyMotion(canvas) {
  if (!canvas) return () => {}
  return startSyncopate(canvas)
}
