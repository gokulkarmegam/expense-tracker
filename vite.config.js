import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/expense-tracker/', // Must match your repo name exactly
  build: {
    outDir: 'dist',
    assetsDir: 'assets', // Organizes assets in a dedicated folder
    emptyOutDir: true
  }
})
