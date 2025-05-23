import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // No base path needed for Render
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      }
    }
  }
});
