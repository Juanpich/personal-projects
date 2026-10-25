import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // host: true expone el server en la red local (ej. 192.168.x.x), así
    // podés abrir la app desde el celular sin necesidad de deployarla.
    host: true,
  },
})
