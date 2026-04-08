import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: '.',
  server: {
    port: 5173,
    open: true,
    strictPort: false,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    minify: 'terser',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        dashboard: resolve(__dirname, 'dashboard.html'),
        seo: resolve(__dirname, 'seo.html'),
        social: resolve(__dirname, 'social-media.html'),
        ads: resolve(__dirname, 'paid-ads.html'),
        website: resolve(__dirname, 'website-design.html'),
        ecommerce: resolve(__dirname, 'ecommerce.html'),
        email: resolve(__dirname, 'email-marketing.html'),
        video: resolve(__dirname, 'video-marketing.html'),
        realestate: resolve(__dirname, 'real-estate.html'),
        healthcare: resolve(__dirname, 'healthcare.html'),
        education: resolve(__dirname, 'education.html'),
        privacy: resolve(__dirname, 'privacy-policy.html'),
        terms: resolve(__dirname, 'terms-of-service.html'),
        cookie: resolve(__dirname, 'cookie-policy.html'),
        disclaimer: resolve(__dirname, 'disclaimer.html'),
        basic: resolve(__dirname, 'basic.html'),
        growth: resolve(__dirname, 'growth.html'),
        enterprise: resolve(__dirname, 'enterprise.html')
      }
    }
  },
  define: {
    'import.meta.env.VITE_HUGGING_FACE_API': JSON.stringify(process.env.VITE_HUGGING_FACE_API || ''),
    'import.meta.env.VITE_API_KEY': JSON.stringify(process.env.VITE_API_KEY || '')
  }
})


