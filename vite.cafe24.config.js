import { posix, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { mergeConfig, normalizePath } from 'vite'
import sharedConfig from './vite.config.js'

const projectRoot = fileURLToPath(new URL('.', import.meta.url))

function assetFileNames({ names, originalFileNames }) {
  const fileName = '[name]-[hash].[ext]'

  if (names.some(name => name.endsWith('.css'))) return `assets/styles/${fileName}`

  for (const originalFile of originalFileNames) {
    const source = normalizePath(relative(projectRoot, resolve(projectRoot, originalFile)))
    if (!source.startsWith('src/')) continue
    if (/\.(mp4|webm|mov|m4v|ogv)$/i.test(source)) return `assets/media/${fileName}`

    if (source.startsWith('src/assets/')) {
      return posix.join(posix.dirname(source.slice('src/'.length)), fileName)
    }

    // Component-local artwork retains its page and section hierarchy.
    const pageAsset = source.match(/^src\/pages\/(.+)\/assets\/(.+)$/)
    if (pageAsset) return posix.join('assets', pageAsset[1], posix.dirname(pageAsset[2]), fileName)
  }

  return `assets/${fileName}`
}

export default mergeConfig(sharedConfig, {
  base: '/degreeshow/2026/',
  build: {
    outDir: 'dist-cafe24',
    rolldownOptions: {
      output: {
        assetFileNames,
        chunkFileNames: 'assets/scripts/[name]-[hash].js',
        entryFileNames: 'assets/scripts/[name]-[hash].js',
      },
    },
  },
})
