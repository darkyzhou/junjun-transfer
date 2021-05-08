import { defineConfig } from 'vite';
import svelte from '@sveltejs/vite-plugin-svelte';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  return {
    plugins: [svelte()],
    build: {
      minify: isProduction
    },
    server: {
      proxy: {
        '/signal': {
          target: 'ws://localhost:4500',
          changeOrigin: true,
          ws: true
        }
      }
    }
  };
});
