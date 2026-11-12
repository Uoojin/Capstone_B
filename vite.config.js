import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { copyFile, mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'

// Directory indexes let static hosts serve direct visits and reloads.
function staticRouteIndexes() {
  const routes = ['project', 'student', 'credit', 'curriculum', 'syncopate', 'guestbook']

  return {
    name: 'static-route-indexes',
    apply: 'build',
    async writeBundle(options) {
      const outputDir = resolve(options.dir)
      for (const route of routes) {
        const routeDir = resolve(outputDir, route)
        await mkdir(routeDir, { recursive: true })
        await copyFile(resolve(outputDir, 'index.html'), resolve(routeDir, 'index.html'))
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: "/Capstone_B/",
  plugins: [react(), staticRouteIndexes()],
})
