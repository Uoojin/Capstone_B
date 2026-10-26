// Glyphs measured from the former 380 × 380 artwork: local position, font size and rotation.
// Helvetica Neue Medium matches the source lettering; every fragment is actual text.
export const ballTypography = [
  [
    {text: "T", x: 255.05, y: 146.59, size: 165.11, angle: -56, weight: 500},
    {text: "L", x: 184.5, y: 205.78, size: 165.18, angle: -18, weight: 500}
  ],
  [
    {text: "Y", x: 294.78, y: 189.19, size: 163.72, angle: -56, weight: 500},
    {text: "S", x: 224.21, y: 293.0, size: 165.21, angle: -19, weight: 500}
  ],
  [
    {text: "N", x: 220.0, y: 134.0, size: 168.13, angle: -88, weight: 500},
    {text: "S", x: 79.21, y: 217.0, size: 165.21, angle: -19, weight: 500},
    {text: "Y", x: 299.95, y: 230.96, size: 164.1, angle: -136, weight: 500},
    {text: "’", x: 156.57, y: 207.5, size: 157.02, angle: 122, weight: 500},
    {text: "S", x: 183.0, y: 301.13, size: 164.32, angle: 64, weight: 500}
  ],
  [
    {text: "!", x: 193.5, y: 164.5, size: 162.68, angle: -153, weight: 500},
    {text: "T", x: 295.05, y: 192.04, size: 164.5, angle: -57, weight: 500},
    {text: "L", x: 84.5, y: 208.86, size: 165.18, angle: -19, weight: 500},
    {text: "E", x: 206.5, y: 290.5, size: 164.92, angle: 55, weight: 500}
  ],
  [
    {text: "!", x: 292.5, y: 121.0, size: 164.91, angle: -42, weight: 500},
    {text: "E", x: 99.5, y: 247.0, size: 164.22, angle: -57, weight: 500},
    {text: "S", x: 227.45, y: 298.14, size: 162.73, angle: 46, weight: 500}
  ],
  [
    {text: "L", x: 177.88, y: 213.0, size: 164.77, angle: -175, weight: 500},
    {text: "N", x: 99.5, y: 251.5, size: 165.48, angle: -57, weight: 500},
    {text: "C", x: 288.74, y: 248.19, size: 162.66, angle: 49, weight: 500}
  ],
  [
    {text: "S", x: 131.62, y: 97.0, size: 165.2, angle: -175, weight: 500},
    {text: "Y", x: 292.79, y: 200.45, size: 162.6, angle: 142, weight: 500},
    {text: "’", x: 230.0, y: 226.31, size: 144.93, angle: 5, weight: 700},
    {text: "N", x: 155.0, y: 290.0, size: 165.95, angle: -174, weight: 500}
  ],
  [
    {text: "C", x: 94.92, y: 152.96, size: 165.22, angle: -175, weight: 500},
    {text: "’", x: 307.48, y: 118.0, size: 159.31, angle: -36, weight: 500},
    {text: "N", x: 161.5, y: 290.0, size: 166.72, angle: -174, weight: 500}
  ],
  [
    {text: "S", x: 79.21, y: 217.0, size: 165.21, angle: -19, weight: 500},
    {text: "’", x: 156.07, y: 207.0, size: 157.02, angle: 123, weight: 500}
  ],
  [
    {text: "T", x: 295.05, y: 142.59, size: 165.11, angle: -56, weight: 500},
    {text: "L", x: 90.5, y: 205.78, size: 165.18, angle: -18, weight: 500},
    {text: "E", x: 214.0, y: 278.54, size: 164.24, angle: -56, weight: 500}
  ]
]

const glyphMetrics = new Map()

export function drawBallTypography(ctx, layout, radius, color) {
  ctx.save()
  ctx.scale(radius / 190, radius / 190)
  ctx.fillStyle = color
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  for (const glyph of layout) {
    ctx.save()
    ctx.translate(glyph.x - 190, glyph.y - 190)
    ctx.rotate(glyph.angle * Math.PI / 180)
    ctx.font = `${glyph.weight} ${glyph.size}px "Helvetica Neue", Arial, sans-serif`
    const key = `${ctx.font}:${glyph.text}`
    let metrics = glyphMetrics.get(key)
    if (!metrics) {
      metrics = ctx.measureText(glyph.text)
      glyphMetrics.set(key, metrics)
    }
    ctx.fillText(glyph.text,
      (metrics.actualBoundingBoxLeft - metrics.actualBoundingBoxRight) / 2,
      (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2)
    ctx.restore()
  }
  ctx.restore()
}
