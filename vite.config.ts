import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  root: 'catalog',
  resolve: {
    alias: {
      '@ground/ui': path.resolve(__dirname, 'src/index.ts'),
      '@ground/ui/theme': path.resolve(__dirname, 'src/theme/index.ts'),
      '@ground/ui/interactions': path.resolve(__dirname, 'src/interactions/index.ts'),
    },
  },
})
