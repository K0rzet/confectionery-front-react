import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
	plugins: [react(), tsconfigPaths()],
	optimizeDeps: {
		include: ['chart.js', 'react-chartjs-2']
	},
	server: {
		port: 3000,
		watch: {
			usePolling: true
		}
	}
})
