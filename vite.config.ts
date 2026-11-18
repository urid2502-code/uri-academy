import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  // Relative asset paths so the build works from any sub-path (e.g. GitHub Pages /<repo>/).
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    // The curriculum is bundled with the app so it works fully offline.
    chunkSizeWarningLimit: 1200,
  },
})
