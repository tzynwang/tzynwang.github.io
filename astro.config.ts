import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE } from './src/models/GeneralModels';

// https://astro.build/config
export default defineConfig({
  compressHTML: true,
  integrations: [sitemap()],
  redirects: {
    '/archives': '/archive',
    '/categories': '/tag',
  },
  site: SITE,
  trailingSlash: 'never',
});
