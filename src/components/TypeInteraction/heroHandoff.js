// Read-only bridge: onboarding follows the live canvas, never changes its state.
const readers = new WeakMap()

export function registerHeroHandoff(canvas, read) {
  readers.set(canvas, read)
  return () => readers.delete(canvas)
}

export function readHeroHandoff() {
  const canvas = document.querySelector('.type-interaction')?.shadowRoot?.querySelector('#scene')
  return readers.get(canvas)?.() ?? null
}
