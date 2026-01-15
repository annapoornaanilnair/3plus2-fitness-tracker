import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.png', 'favicon-32x32.png', 'favicon-16x16.png', 'apple-touch-icon.png', 'logo.png'],
            manifest: {
                name: '3+2 Fitness Tracker',
                short_name: '3+2 Fitness',
                description: 'Your personal fitness companion with 3 days strength + 2 days cardio',
                theme_color: '#A3C9A8',
                background_color: '#F5F3EE',
                display: 'standalone',
                orientation: 'portrait',
                scope: '/',
                start_url: '/',
                icons: [
                    {
                        src: 'pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    },
                    {
                        src: 'pwa-maskable-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable'
                    }
                ]
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
                runtimeCaching: [
                    // Google Fonts CSS
                    {
                        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'google-fonts-cache',
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    },
                    // Google Fonts files
                    {
                        urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'gstatic-fonts-cache',
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    },
                    // Supabase API - Network first for fresh data
                    {
                        urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'supabase-api-cache',
                            expiration: {
                                maxEntries: 50,
                                maxAgeSeconds: 60 * 5 // 5 minutes
                            },
                            networkTimeoutSeconds: 10,
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    },
                    // YouTube embeds and thumbnails
                    {
                        urlPattern: /^https:\/\/(www\.)?youtube\.com\/.*/i,
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'youtube-cache',
                            expiration: {
                                maxEntries: 30,
                                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
                            },
                            networkTimeoutSeconds: 5
                        }
                    },
                    {
                        urlPattern: /^https:\/\/i\.ytimg\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'youtube-thumbnails-cache',
                            expiration: {
                                maxEntries: 50,
                                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                            }
                        }
                    },
                    // Images and media
                    {
                        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'images-cache',
                            expiration: {
                                maxEntries: 60,
                                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                            }
                        }
                    },
                    // Any other external resources
                    {
                        urlPattern: /^https?:\/\/.*/i,
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'external-resources-cache',
                            expiration: {
                                maxEntries: 50,
                                maxAgeSeconds: 60 * 60 * 24 // 24 hours
                            },
                            networkTimeoutSeconds: 10
                        }
                    }
                ]
            },
            devOptions: {
                enabled: true
            }
        })
    ],
    resolve: {
        alias: {
            '@': '/src',
        },
    },
    server: {
        port: 5173,
        open: true
    }
})
