import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/places': {
        target: 'https://maps.googleapis.com/maps/api/place',
        changeOrigin: true,
        rewrite: (path) => {
          const url = new URL(path, 'http://localhost');
          const endpoint = url.searchParams.get('endpoint');
          const params = new URLSearchParams(url.search);
          params.delete('endpoint');
          params.set('key', process.env.VITE_GOOGLE_PLACES_KEY || 'YOUR_API_KEY_HERE');
          return `/${endpoint}/json?${params.toString()}`;
        },
      },
    },
  },
})
