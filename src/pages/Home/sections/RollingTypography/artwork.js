const sources = import.meta.glob('../../../../assets/type/**/*.svg', { eager: true, query: '?url', import: 'default' })
export const sequence = ['L', 'E', 'T', "'", 'S1', 'S2', 'Y', 'N', 'C', '!']
let prepared

// Measure each actual SVG's painted pixels, including its own masks and strokes.
// Correct only the image inside the circle; the rolling element never changes.
async function measure(url, footprint) {
  const image = new Image()
  image.src = url
  await image.decode()
  const width = image.naturalWidth, height = image.naturalHeight
  const canvas = document.createElement('canvas')
  canvas.width = width * 2
  canvas.height = height * 2
  const context = canvas.getContext('2d', { willReadFrequently: true })
  context.drawImage(image, 0, 0, canvas.width, canvas.height)
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data
  let left = canvas.width, right = 0, top = canvas.height, bottom = 0
  for (let y = 0; y < canvas.height; y++) for (let x = 0; x < canvas.width; x++) {
    if (pixels[(y * canvas.width + x) * 4 + 3] < 8) continue
    left = Math.min(left, x); right = Math.max(right, x + 1)
    top = Math.min(top, y); bottom = Math.max(bottom, y + 1)
  }
  const scale = footprint / Math.max(1, right - left, bottom - top)
  return { url, width: canvas.width * scale, height: canvas.height * scale,
    left: 50 - (left + right) / 2 * scale, top: 50 - (top + bottom) / 2 * scale }
}

export function prepareArtwork() {
  prepared ??= Promise.all(Object.entries(sources).map(async ([path, url]) => {
    const relative = path.split('/type/')[1]
    const key = relative.includes('/') ? relative.split('/')[0] : relative.replace('_default.svg', '')
    // The punctuation occupies a smaller footprint in the supplied size reference.
    // Apply each character's footprint to both basic and decorated artwork.
    const footprint = key === "'" ? 32 : 60
    return [path, await measure(url, footprint)]
  }))
    .then(entries => Object.fromEntries(sequence.map(key => {
      const basic = entries.find(([path]) => path.endsWith(`/type/${key}_default.svg`))?.[1]
      const variants = entries.filter(([path]) => path.includes(`/type/${key}/`)).map(([, image]) => image)
      if (!basic || !variants.length) throw new Error(`Missing typography assets: ${key}`)
      return [key, { basic, variants }]
    })))
  return prepared
}

export function applyArtwork(image, artwork) {
  image.src = artwork.url
  Object.assign(image.style, { width: `${artwork.width}%`, height: `${artwork.height}%`,
    left: `${artwork.left}%`, top: `${artwork.top}%` })
}
