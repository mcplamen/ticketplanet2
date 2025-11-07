import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    port: 5173,
    proxy: {
      '/auth': {
        target: 'http://localhost:3000', // backend port
        changeOrigin: true,
        secure: false
      },
      '/me': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      },
      // ако имаш други backend пътища, добави ги тук, напр. /api, /upload...
    }
  }
});
