import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  compressHTML: true,
  integrations: [sitemap()],
  redirects: {
    '/archives': '/archive',
    '/categories': '/tag',
  },
  site: 'https://tzynwang.github.io/',
  trailingSlash: 'never',
});
