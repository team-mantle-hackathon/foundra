import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from "path"
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    allowedHosts: [
      'c680dc7fe48e.ngrok-free.app'
    ]
  },
  resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
})
