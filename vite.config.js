import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import sitemap from 'vite-plugin-sitemap';

// All routes on your site — update this list as you add pages.
// Only STATIC routes belong here.
const SITE_ROUTES = [
  '/',
  '/about_us',
  '/puja',
  '/chadhava',
  '/astrologer',
  '/live-astrologer',
  '/panchang',
  '/horoscope',
  '/astrology_calculator_hub',
  '/nakshatra_finder',
  '/janm_rashi_finder',
  '/mangal_dosh_calculator',
  '/love_calculator',
  '/friendship_calculator',
  '/destiny_number_calculator',
  '/mobile_numerology_calculator',
  '/contact_us',
  '/faqs',
  '/blog',
  '/help',
  '/astrologer_registration',
  '/privacy_policy',
  '/terms_of_use',
  '/cancellation_refund_policy',
  '/careers',
  '/security',
];

// Common proxy configuration
const adminProxy = {
  target: 'https://admin.vaidikguru.com',
  changeOrigin: true,
  secure: false,

  bypass: (req) => {
    if (
      req.headers.accept &&
      req.headers.accept.includes('html')
    ) {
      return '/index.html';
    }
  },

  headers: {
    Origin: 'https://admin.vaidikguru.com',
    Referer: 'https://admin.vaidikguru.com/',
  },

  configure: (proxy) => {
    proxy.on('proxyReq', (proxyReq) => {
      proxyReq.setHeader(
        'origin',
        'https://admin.vaidikguru.com'
      );

      proxyReq.setHeader(
        'referer',
        'https://admin.vaidikguru.com/'
      );
    });
  },
};

export default defineConfig(({ command }) => ({
  plugins: [
    // React
    react({
      babel: {
        plugins: [
          ...(process.env.NODE_ENV === 'development'
            ? [
                [
                  '@locator/babel-jsx/dist',
                  { env: 'development' },
                ],
              ]
            : []),
        ],
      },
    }),

    // Sitemap + robots.txt
    sitemap({
      hostname: 'https://vaidikguru.com',
      dynamicRoutes: SITE_ROUTES,
      generateRobotsTxt: true,

      robots: [
        {
          userAgent: '*',
          allow: '/',
          disallow: ['/admin', '/api', '/private'],
        },
      ],

      outDir: 'dist',
    }),

    // Prerender is intentionally disabled.
    // This prevents build failure caused by API/navigation timeout.
  ],

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            'react',
            'react-dom',
            'react-router-dom',
          ],
          ui: [
            'framer-motion',
            'swiper',
          ],
        },
      },
    },
  },

  server: {
    port: 3000,

    proxy: {
      '/user_api': adminProxy,
      '/web': adminProxy,
      '/puja': adminProxy,
      '/astrologer_api': adminProxy,
    },
  },
}));