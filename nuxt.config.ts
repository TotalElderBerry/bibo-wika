export default defineNuxtConfig({
  compatibilityDate: '2026-09-01',
  devtools: { enabled: true },

  modules: ['@pinia/nuxt', '@vite-pwa/nuxt'],

  css: ['~/assets/css/main.css'],

  // Nitro auto-detects the Vercel preset when deploying. Pinned so local
  // `nuxt build` produces the same output shape as CI.
  nitro: {
    preset: process.env.VERCEL ? 'vercel' : 'node-server',
  },

  runtimeConfig: {
    // Server-only. Set in Vercel project env (and .env locally).
    databaseUrl: '',
    adminToken: '',
    authPepper: '',
    r2: {
      accountId: '',
      bucket: '',
      accessKeyId: '',
      secretAccessKey: '',
    },
    public: {
      // Public base for audio + artwork. Cloudflare R2 behind the CF CDN.
      mediaBase: '',
      // Dev-only placeholder speech. MUST be false in every shipped build:
      // there is no usable TTS for ceb / ilo / hil, so this lies about
      // pronunciation. See spec section 08.
      devTts: false,
    },
  },

  routeRules: {
    // The landing page. The only screen written for an adult, and the only one
    // that has to be crawlable and shareable - so it is prerendered to a static
    // file at build time rather than rendered per request.
    '/': { prerender: true },

    // The child app. Static shell, no SSR, owned by the service worker.
    // Children playing generate zero function invocations.
    '/laro': { ssr: false },
    '/pumili': { ssr: false },
    '/wika': { ssr: false },
    '/salita': { ssr: false },
    '/laro/**': { ssr: false },

    // Parents and admins are the only SSR traffic.
    '/magulang/**': { ssr: true, headers: { 'cache-control': 'no-store' } },
    '/admin/**': { ssr: true, robots: false, headers: { 'cache-control': 'no-store' } },

    // Pack manifests are versioned and immutable.
    '/api/pack/**': {
      headers: { 'cache-control': 'public, max-age=31536000, immutable' },
    },
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Bibo Wika',
      short_name: 'Bibo',
      description: 'Matuto ng Tagalog, Cebuano, Ilocano at Hiligaynon.',
      lang: 'fil',
      theme_color: '#FFB020',
      background_color: '#6FCBE8',
      display: 'standalone',
      orientation: 'portrait',
      // The hub, not the landing page. An installed app belongs to the child,
      // and a child should never be handed marketing.
      start_url: '/laro',
      icons: [
        { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        { src: '/icons/icon-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,svg,woff2}'],
      runtimeCaching: [
        {
          // Language packs and audio live on R2. Cache-first, they are immutable.
          urlPattern: /^https:\/\/.*\/(audio|art|packs)\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'bibo-media',
            expiration: { maxEntries: 4000, maxAgeSeconds: 60 * 60 * 24 * 180 },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
      ],
    },
    devOptions: { enabled: false },
  },

  app: {
    head: {
      // Every screen's chrome is Filipino - the landing page copy, the app UI,
      // and the buttons a child reads. The taught word inside a lesson carries
      // its own `lang` where it differs.
      htmlAttrs: { lang: 'fil' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#FFB020' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:wght@600;700;800&display=swap',
        },
      ],
    },
  },
})
