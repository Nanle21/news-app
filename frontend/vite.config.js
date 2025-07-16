import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: ['nanle.local', 'nanle.local.api'],
    watch: {
      usePolling: true,
    },
    proxy: {
      '/api': {
        target: 'http://nanle.local.api:8000',
        changeOrigin: true,
      },
    },
  },
});
