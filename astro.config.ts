import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import { SITE } from "./src/models/GeneralModels";

// https://astro.build/config
export default defineConfig({
  compressHTML: true,
  integrations: [sitemap()],
  markdown: {
    remarkRehype: { footnoteLabel: "註解" },
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    },
  },
  redirects: {
    "/archives": "/archive",
    "/categories": "/tag",
  },
  site: SITE,
  trailingSlash: "never",
});
