import { defineConfig } from 'vite';
import svelte from '@sveltejs/vite-plugin-svelte';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  server: {
    proxy: {
      '/signal': {
        target: 'http://127.0.0.1:4500/signal',
        changeOrigin: true,
        ws: true
      }
    }
  }
});
