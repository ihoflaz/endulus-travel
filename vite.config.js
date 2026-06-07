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
        }
        // Note: public/data is intentionally NOT copied — content is served
        // dynamically by the backend at /data/*.json (see server/src/routes/legacyData.js)
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
  // Strip console.* (except .error/.warn) in production builds so leftover
  // debug logs don't ship to end users.
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['debugger'] : [],
    pure: process.env.NODE_ENV === 'production'
      ? ['console.log', 'console.info', 'console.debug', 'console.trace']
      : [],
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'i18n': ['react-i18next', 'i18next'],
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: true,
  },
  // Geliştirme sunucusu ayarları
  server: {
    port: 3000,
    open: true,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    proxy: {
      '/api': {
        target: process.env.VITE_PROXY_TARGET || 'http://localhost:4000',
        changeOrigin: true,
      },
      '/uploads': {
        target: process.env.VITE_PROXY_TARGET || 'http://localhost:4000',
        changeOrigin: true,
      },
      '/data': {
        target: process.env.VITE_PROXY_TARGET || 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  }
});
