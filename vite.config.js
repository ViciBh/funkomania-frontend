import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/auth': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/productos': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/categorias': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/usuario': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/metodos-pago': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/carrito': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})