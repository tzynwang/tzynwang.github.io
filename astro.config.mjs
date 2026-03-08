import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import expressiveCode from "astro-expressive-code";
import { defineConfig } from "astro/config";
import {
  rehypeModifyWikiLinks,
  remarkCustomWikiLinkResolver,
} from "./plugin.mjs";
import { SITE } from "./src/models/GeneralModels";

// https://astro.build/config
export default defineConfig({
  compressHTML: true,
  integrations: [
    sitemap(),
    expressiveCode({
      themes: ["material-theme-darker", "material-theme-lighter"],
    }),
  ],
  markdown: {
    remarkPlugins: [remarkCustomWikiLinkResolver],
    rehypePlugins: [rehypeModifyWikiLinks],
    remarkRehype: { footnoteLabel: "註解" },
  },
  redirects: {
    "/archives": "/archive",
    "/categories": "/tag",
  },
  site: SITE,
  trailingSlash: "never",
  vite: {
    plugins: [tailwindcss()],
  },
});
