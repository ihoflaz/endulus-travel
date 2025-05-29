import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  base: './', // Relative path - works for both development and production
  plugins: [
    react(), 
    tailwindcss(),
    viteStaticCopy({
      targets: [
        {
          src: 'public/locales/*',
          dest: 'locales'
        },
        {
          src: 'public/data/*',
          dest: 'data'
        }
      ]
    })
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  // Public klasörü yapılandırması
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          // React chunk
          'react-vendor': ['react', 'react-dom'],
          // Router chunk
          'router': ['react-router-dom'],
          // i18n chunk
          'i18n': ['react-i18next', 'i18next'],
          // Utils chunk (eğer büyük utility kütüphaneleri varsa)
          // 'utils': ['lodash', 'date-fns', 'axios']
        }
      }
    },
    // Chunk size warning limitini artır (geçici çözüm)
    chunkSizeWarningLimit: 1000,
    // Gzip sıkıştırma
    reportCompressedSize: true
  },
  // Geliştirme sunucusu ayarları
  server: {
    port: 3000,
    open: true,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  }
});
