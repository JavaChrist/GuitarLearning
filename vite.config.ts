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
      includeAssets: ['*.png', '*.ico', '*.svg'],
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
            src: '/logo192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/logo512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              },
              cacheKeyWillBeUsed: async ({ request }) => {
                return `${request.url}`
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: false // Désactiver PWA en développement pour éviter les conflits
      }
    })
  ],
  server: {
    port: 3000,
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
