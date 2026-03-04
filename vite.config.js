import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                about: resolve(__dirname, 'about.html'),
                branding: resolve(__dirname, 'branding-social-media.html'),
                ads: resolve(__dirname, 'google-meta-ads.html'),
                seo: resolve(__dirname, 'seo.html'),
                webdev: resolve(__dirname, 'web-development.html'),
            },
        },
    },
})
