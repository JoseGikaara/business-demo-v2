import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/places': {
          target: 'https://maps.googleapis.com',
          changeOrigin: true,
          rewrite: (path) => {
            const u = new URL('http://x' + path)
            const endpoint = u.searchParams.get('endpoint') || 'textsearch'
            u.searchParams.delete('endpoint')
            u.searchParams.set('key', env.GOOGLE_PLACES_KEY || '')
            return `/maps/api/place/${endpoint}/json${u.search}`
          },
        },
      },
    },
  }
})
