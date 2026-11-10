import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.zambos.com',
  trailingSlash: 'always',
  integrations: [
    react(),
    tailwind({
      config: { path: './tailwind.config.js' },
      applyBaseStyles: true,
    }),
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: {
          es: 'es',
          us: 'en-US',
        },
      },
      filter: (page) => !/\/404\/?$/.test(page) && !page.includes('/api/'),
    }),
  ],
});