import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo16.png', 'logo32.png', 'logo192.png', 'logo512.png', 'apple-touch-icon.png', 'GuitarLearning.ico'],
      manifest: {
        name: 'Guitar Learning - Accordeur de Guitare',
        short_name: 'Guitar Learning',
        description: 'Application d\'apprentissage de la guitare avec accordeur intégré, accords, gammes et exercices animés',
        theme_color: '#003d82',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/logo16.png',
            sizes: '16x16',
            type: 'image/png'
          },
          {
            src: '/logo32.png',
            sizes: '32x32',
            type: 'image/png'
          },
          {
            src: '/logo48.png',
            sizes: '48x48',
            type: 'image/png'
          },
          {
            src: '/logo96.png',
            sizes: '96x96',
            type: 'image/png'
          },
          {
            src: '/logo128.png',
            sizes: '128x128',
            type: 'image/png'
          },
          {
            src: '/logo192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/logo256.png',
            sizes: '256x256',
            type: 'image/png'
          },
          {
            src: '/logo384.png',
            sizes: '384x384',
            type: 'image/png'
          },
          {
            src: '/logo512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      devOptions: {
        enabled: false
      }
    })
  ],
  server: {
    port: 3005,
    host: true,
    force: true // Force la reconstruction
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})
