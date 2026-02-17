/// <reference types="astro/client.d.ts" />

// ref. https://docs.astro.build/en/guides/environment-variables/#intellisense-for-typescript
interface ImportMetaEnv {
  readonly PUBLIC_GA4_ID: string;
  readonly PUBLIC_GTAG_ID: string;
  readonly PUBLIC_GISCUS_REPO_ID: string;
  readonly PUBLIC_GISCUS_CATEGORY_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
