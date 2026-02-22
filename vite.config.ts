import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg', 'Gollazoom-icon-192x192.png', 'Gollazoom-icon-512x512.png'],
      manifest: {
        name: 'GollaZoom - 골라줌',
        short_name: 'GollaZoom',
        description: '나만의 스마트 옷장 및 코디 추천 앱',
        theme_color: '#2563EB',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'Gollazoom-icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'Gollazoom-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png', 
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
});