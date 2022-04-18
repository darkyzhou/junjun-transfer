import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  build: { target: 'es2018' },
  server: {
    proxy: {
      '/signal': {
        target: 'ws://localhost:4500',
        changeOrigin: true,
        ws: true
      },
      '/ice': {
        target: 'http://localhost:4600'
      }
    }
  }
});
