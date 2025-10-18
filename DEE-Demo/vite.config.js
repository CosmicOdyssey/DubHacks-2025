import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  root: resolve(__dirname, 'ui'),
  base: '', // relative asset paths for Forge static serving
  plugins: [react()],
  build: {
    outDir: resolve(__dirname, 'static/ui'),
    emptyOutDir: true,
  },
})
