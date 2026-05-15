/* vite.config.ts */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const isGithubPages =
    process.env.NODE_ENV === 'production'

export default defineConfig({
  plugins: [react()],

  base: isGithubPages
      ? '/underground-leak-adjustment-request/'
      : '/',
})