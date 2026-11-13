import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    angular(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
    host: true,
    cors: true,
    proxy: {
      '/api': {
        target: process.env.VITE_API_PROXY_TARGET || 'https://misincol-api.servidor.blog',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 800,
  },
  optimizeDeps: {
    include: ['@angular/compiler'],
  },
});
