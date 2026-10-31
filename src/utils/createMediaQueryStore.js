// Each caller keeps its own MediaQueryList and existing subscription lifecycle.
export default function createMediaQueryStore(query) {
  const viewport = window.matchMedia(query)

  function subscribe(onChange) {
    viewport.addEventListener('change', onChange)
    return () => viewport.removeEventListener('change', onChange)
  }

  function getSnapshot() {
    return viewport.matches
  }

  return { subscribe, getSnapshot, mediaQuery: viewport }
}
