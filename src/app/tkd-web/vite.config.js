import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host:'localhost',
    port: 3000,
  },
  build: {
    rollupOptions: {
      output: {
        // Separa automáticamente las librerías grandes de terceros en chunks independientes
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  }
})