import type { Plugin } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss() as Plugin[]],
  define: {
    'import.meta.env.CLIENT_URL': 'http://localhost:6320',
  },
})
