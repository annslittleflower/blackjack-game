import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'

export default defineConfig(() => {
	const config = {
		plugins: [react()],
		base: '/blackjack-game',
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src'),
			},
		},
	}

	return config
})
