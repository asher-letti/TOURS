import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// The app is served by Flask under /app/ in production, so assets and routes
// live under that prefix. In dev, /api calls are proxied to Flask so the
// browser sees a single origin (no CORS needed).
export default defineConfig({
  base: '/app/',
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:5000',
    },
  },
})
