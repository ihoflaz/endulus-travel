import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  // Absolute base — REQUIRED for an SPA with client-side routing served from
  // the domain root. With './' (relative), a hard load of a deep link like
  // /turlar/misir-turu-ozel resolves "./assets/index.js" to
  // "/turlar/assets/index.js" → nginx SPA fallback returns index.html → the
  // module script gets a text/html MIME type and the app never boots.
  base: '/',
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
