// Interpolate the silhouettes of the two existing SVG states, including holes.
// Source files/paths are never edited. Signed-distance interpolation changes
// geometry rather than fading one image over another or warping a third shape.
const SIZE = 256
const PAD = 2
const fields = new WeakMap()

function distance(mask, foreground) {
    const n = SIZE, inf = 1e12
    const intermediate = new Float64Array(n * n)
    const horizontal = new Int32Array(n * n)
    const result = new Float64Array(n * n)
    const nearest = new Int32Array(n * n)
    const f = new Float64Array(n), d = new Float64Array(n)
    const indices = new Int32Array(n), v = new Int32Array(n)
    const z = new Float64Array(n + 1)
    function transform() {
        let k = 0
        v[0] = 0; z[0] = -Infinity; z[1] = Infinity
        for (let q = 1; q < n; q++) {
            let s = ((f[q] + q * q) - (f[v[k]] + v[k] * v[k])) / (2 * (q - v[k]))
            while (s <= z[k]) {
                k--
                s = ((f[q] + q * q) - (f[v[k]] + v[k] * v[k])) / (2 * (q - v[k]))
            }
            v[++k] = q; z[k] = s; z[k + 1] = Infinity
        }
        k = 0
        for (let q = 0; q < n; q++) {
            while (z[k + 1] < q) k++
            indices[q] = v[k]
            d[q] = (q - v[k]) ** 2 + f[v[k]]
        }
    }
    for (let y = 0; y < n; y++) {
        for (let x = 0; x < n; x++) f[x] = Boolean(mask[y * n + x]) === foreground ? 0 : inf
        transform()
        for (let x = 0; x < n; x++) { intermediate[y * n + x] = d[x]; horizontal[y * n + x] = indices[x] }
    }
    for (let x = 0; x < n; x++) {
        for (let y = 0; y < n; y++) f[y] = intermediate[y * n + x]
        transform()
        for (let y = 0; y < n; y++) {
            result[y * n + x] = d[y]
            nearest[y * n + x] = indices[y] * n + horizontal[indices[y] * n + x]
        }
    }
    return { result, nearest }
}

function fieldFor(image) {
    if (fields.has(image)) return fields.get(image)
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = SIZE
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    const scale = (SIZE - PAD * 2) / Math.max(image.naturalWidth, image.naturalHeight)
    const w = image.naturalWidth * scale, h = image.naturalHeight * scale
    ctx.drawImage(image, (SIZE - w) / 2, (SIZE - h) / 2, w, h)
    const rgba = ctx.getImageData(0, 0, SIZE, SIZE).data
    const mask = new Uint8Array(SIZE * SIZE)
    for (let i = 0; i < mask.length; i++) mask[i] = rgba[i * 4 + 3] >= 128 ? 1 : 0
    const inside = distance(mask, true), outside = distance(mask, false)
    const sdf = new Float32Array(mask.length)
    for (let i = 0; i < mask.length; i++) sdf[i] = Math.sqrt(outside.result[i]) - Math.sqrt(inside.result[i])
    const field = { rgba, sdf, nearest: inside.nearest }
    fields.set(image, field)
    canvas.width = canvas.height = 0
    return field
}

export function createSvgStateMorph() {
    let canvas, context, pixels
    function draw(ctx, from, to, amount, maxSide) {
        function original(image) {
            const scale = maxSide / Math.max(image.naturalWidth, image.naturalHeight)
            const w = image.naturalWidth * scale, h = image.naturalHeight * scale
            ctx.drawImage(image, -w / 2, -h / 2, w, h)
        }
        if (!to || amount <= .001) { original(from); return }
        if (amount >= .999) { original(to); return }
        if (!canvas) {
            canvas = document.createElement('canvas')
            canvas.width = canvas.height = SIZE
            context = canvas.getContext('2d')
            pixels = context.createImageData(SIZE, SIZE)
        }
        const a = fieldFor(from), b = fieldFor(to)
        const output = pixels.data
        for (let i = 0; i < a.sdf.length; i++) {
            const value = a.sdf[i] + (b.sdf[i] - a.sdf[i]) * amount
            const alpha = Math.max(0, Math.min(1, (value + .75) / 1.5))
            const p = i * 4
            if (!alpha) { output[p + 3] = 0; continue }
            const ca = a.nearest[i] * 4, cb = b.nearest[i] * 4
            for (let c = 0; c < 3; c++) output[p + c] = a.rgba[ca + c] + (b.rgba[cb + c] - a.rgba[ca + c]) * amount
            output[p + 3] = Math.round(alpha * 255)
        }
        context.putImageData(pixels, 0, 0)
        const side = maxSide * SIZE / (SIZE - PAD * 2)
        ctx.drawImage(canvas, -side / 2, -side / 2, side, side)
    }
    function dispose() {
        if (canvas) canvas.width = canvas.height = 0
        canvas = context = pixels = null
    }
    return { draw, dispose }
}
