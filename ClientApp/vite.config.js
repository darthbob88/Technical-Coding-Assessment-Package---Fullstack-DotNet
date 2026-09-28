import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5125',
    },
  },
  build: {
    outDir: resolve(import.meta.dirname, '../wwwroot'),
    emptyOutDir: true,
  },
});