import { useMemo } from 'react'
import typeSource from './type-source.html?raw'
import './TypeInteraction.css'

const typeAssets = import.meta.glob('../../assets/type/**/*.svg', {
  eager: true,
  import: 'default',
  query: '?url',
})

function buildAssetMap() {
  return Object.fromEntries(
    Object.entries(typeAssets).map(([path, url]) => {
      const [, assetPath] = path.split('/assets/type/')
      return [assetPath, url]
    }),
  )
}

function buildSourceDoc(assetMap) {
  const sourceWithResolvedStaticAssets = typeSource.replace(
    /src="assets\/([^"]+)"/g,
    (_, assetPath) => `src="${assetMap[assetPath] || ''}"`,
  )

  const sourceWithResolvedRuntimeAssets = sourceWithResolvedStaticAssets
    .replace(
      "img.src = 'assets/' + file; return img;",
      "img.src = window.__TYPE_ASSET_URLS__[file] || ''; return img;",
    )
    .replace(
      "img.src = 'assets/' + file.slice(file.lastIndexOf('_') + 1, -4) + '/' + file;\n                    return img;",
      "var pairPath = file.slice(file.lastIndexOf('_') + 1, -4) + '/' + file;\n                    img.src = window.__TYPE_ASSET_URLS__[pairPath] || '';\n                    return img;",
    )

  return sourceWithResolvedRuntimeAssets.replace(
    '<script>',
    `<script>window.__TYPE_ASSET_URLS__ = ${JSON.stringify(assetMap)};</script>\n    <script>`,
  )
}

const assetMap = buildAssetMap()

export default function TypeInteraction() {
  const sourceDoc = useMemo(() => buildSourceDoc(assetMap), [])

  return (
    <iframe
      className="type-interaction"
      srcDoc={sourceDoc}
      title="TYPE interaction"
      aria-label="TYPE interaction"
    />
  )
}
