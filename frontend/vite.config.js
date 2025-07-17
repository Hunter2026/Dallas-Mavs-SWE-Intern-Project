import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    base: '/', // Ensures relative paths for static assets
    plugins: [react()],
    server: {
        proxy: {
            '/summary': {
                target: 'http://localhost:5000', // Only used in development
                changeOrigin: true,
                secure: false,
            },
        },
    },
})
