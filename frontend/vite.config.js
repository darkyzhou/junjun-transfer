import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';

export default defineConfig({
  plugins: [reactRefresh()],
  define: {
    'process.env.SERVER_URL': JSON.stringify(process.env.SERVER_URL) || '""'
  },
  build: { target: 'es2018' },
  server: {
    proxy: {
      '/signal': {
        target: 'ws://localhost:8080',
        changeOrigin: true,
        ws: true
      },
      '/ice': {
        target: 'http://localhost:8080'
      }
    }
  }
});
