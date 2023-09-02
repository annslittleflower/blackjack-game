import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// { command }
export default defineConfig(() => {
  const config = {
    plugins: [react()],
    base: '/',
  }

  // if (command !== 'serve') {
    config.base = '/blackjack-game'
  // }

  return config
})
