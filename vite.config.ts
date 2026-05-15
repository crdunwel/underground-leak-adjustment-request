/* vite.config.ts */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const isGithubPages =
    process.env.NODE_ENV === 'production'

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  base: isGithubPages
      ? '/underground-leak-adjustment-request/'
      : '/',
})