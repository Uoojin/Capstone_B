export default function waitForImage(image, signal, src) {
  return new Promise(resolve => {
    if (signal.aborted) {
      resolve(false)
      return
    }

    let decoding = false
    const finish = ready => {
      image.removeEventListener('load', loaded)
      image.removeEventListener('error', failed)
      signal.removeEventListener('abort', failed)
      resolve(ready)
    }
    const failed = () => finish(false)
    const loaded = async () => {
      if (decoding) return
      decoding = true
      try {
        await image.decode?.()
      } catch {
        // Some browsers reject decode() for images they can still display after load.
      }
      finish(!signal.aborted && image.naturalWidth > 0)
    }

    image.addEventListener('load', loaded)
    image.addEventListener('error', failed)
    signal.addEventListener('abort', failed)
    if (src) image.src = src
    else if (image.complete) {
      if (image.naturalWidth > 0) loaded()
      else failed()
    }
  })
}
