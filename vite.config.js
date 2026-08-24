import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ─── Install these plugins before building: ────────────────────────────────
//   npm install -D vite-plugin-sitemap vite-plugin-prerender
// ────────────────────────────────────────────────────────────────────────────

import sitemap from 'vite-plugin-sitemap';

// All routes on your site — update this list as you add pages
const SITE_ROUTES = [
  '/',
  '/puja',
  '/chadhava',
  '/astrology',
  '/darshan',
  '/horoscope',
  '/panchang',
  '/about',
  '/contact',
];

export default defineConfig({
  plugins: [
    // ── React with Babel (dev-only locator removed from prod) ──────────────
    react({
      babel: {
        plugins: [
          ...(process.env.NODE_ENV === 'development'
            ? [['@locator/babel-jsx/dist', { env: 'development' }]]
            : []),
        ],
      },
    }),

    // ── Sitemap — auto-generates /sitemap.xml on build ────────────────────
    sitemap({
      hostname: 'https://vaidikguru.com',
      dynamicRoutes: SITE_ROUTES,
      // Priority and changefreq per route type
      generateRobotsTxt: true,  // also generates robots.txt
      robots: [
        {
          userAgent: '*',
          allow: '/',
          disallow: ['/admin', '/api', '/private'],
        },
        {
          userAgent: '*',
          sitemap: 'https://vaidikguru.com/sitemap.xml',
        },
      ],
      // Customize per-URL settings
      outDir: 'dist',
    }),
  ],

  build: {
    // Better chunk splitting for performance (also good for Core Web Vitals)
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['framer-motion', 'swiper'],
        },
      },
    },
  },

  // ── Dev server config ────────────────────────────────────────────────────
  server: {
    port: 3000,
    proxy: {
      '/user_api': {
        target: 'https://admin.vaidikguru.com',
        changeOrigin: true,
        secure: false,
        bypass: (req) => {
          if (req.headers.accept && req.headers.accept.includes('html')) {
            return '/index.html';
          }
        },
        headers: {
          Origin: 'https://admin.vaidikguru.com',
          Referer: 'https://admin.vaidikguru.com/',
        },
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('origin', 'https://admin.vaidikguru.com');
            proxyReq.setHeader('referer', 'https://admin.vaidikguru.com/');
          });
        },
      },
      '/web': {
        target: 'https://admin.vaidikguru.com',
        changeOrigin: true,
        secure: false,
        bypass: (req) => {
          if (req.headers.accept && req.headers.accept.includes('html')) {
            return '/index.html';
          }
        },
        headers: {
          Origin: 'https://admin.vaidikguru.com',
          Referer: 'https://admin.vaidikguru.com/',
        },
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('origin', 'https://admin.vaidikguru.com');
            proxyReq.setHeader('referer', 'https://admin.vaidikguru.com/');
          });
        },
      },
      '/puja': {
        target: 'https://admin.vaidikguru.com',
        changeOrigin: true,
        secure: false,
        bypass: (req) => {
          if (req.headers.accept && req.headers.accept.includes('html')) {
            return '/index.html';
          }
        },
        headers: {
          Origin: 'https://admin.vaidikguru.com',
          Referer: 'https://admin.vaidikguru.com/',
        },
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('origin', 'https://admin.vaidikguru.com');
            proxyReq.setHeader('referer', 'https://admin.vaidikguru.com/');
          });
        },
      },
      '/astrologer_api': {
        target: 'https://admin.vaidikguru.com',
        changeOrigin: true,
        secure: false,
        bypass: (req) => {
          if (req.headers.accept && req.headers.accept.includes('html')) {
            return '/index.html';
          }
        },
        headers: {
          Origin: 'https://admin.vaidikguru.com',
          Referer: 'https://admin.vaidikguru.com/',
        },
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('origin', 'https://admin.vaidikguru.com');
            proxyReq.setHeader('referer', 'https://admin.vaidikguru.com/');
          });
        },
      },
    },
  },
});