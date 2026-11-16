import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Relative base so the build works on GitHub Pages (/<repo>/), a custom
  // domain, or any other static host without changes.
  base: './',
  build: {
    // The game chunk embeds Rapier's physics WASM (~2 MB); it is lazy-loaded
    // only when the 3D world opens, so the classic view stays small.
    chunkSizeWarningLimit: 4000,
  },
})
