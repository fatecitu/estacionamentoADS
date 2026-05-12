import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        novo: resolve(__dirname, 'novo.html'),
        modelos: resolve(__dirname, 'modelos.html'),
      },
    },
  },
})
