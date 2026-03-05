---
title: 如何指南：在 remix 專案使用 @mui/material
date: 2024-10-20 17:56:45
tag:
  - [MaterialUI]
  - [Remix]
banner: /2024/remix-how-to-work-with-mui/jakub-chlouba-LVRgFVLgbK4-unsplash.jpg
summary: 在 remix 使用 @mui/material 主要得克服 SSR 與 CSR 結果不同步的問題。本篇筆記會分享我在參考各路範例後拼出來的解法 🫠
draft:
---

在 remix 使用 @mui/material 主要得克服 SSR 與 CSR 結果不同步的問題，也要確保專案打包後能正常運作。這篇筆記是在參考 @mui 和 remix 的幾個官方範例後兜出來的解法。畢竟 @mui 的 Menu 跟 Dialog 用起來最順手最香 ⋯⋯🫠

## 流程

1. 建立 remix 專案：執行 `npx create-remix@latest`，如果沒有專案內沒有 `app/entry.client.tsx` 和 `app/entry.server.tsx` 就追加執行 `npx remix reveal`
2. 安裝 @mui 相關內容：執行 `npm i @mui/material @emotion/react @emotion/styled`
3. 新增 `app/mui/createEmotionCache.ts` 與 `app/mui/theme.ts`
4. 更新 `app/entry.client.tsx` / `app/entry.server.tsx` / `vite.config.ts`

## 原始碼與相關注意事項

完整的示範 repo 可參考 [tzynwang/remix-mui](https://github.com/tzynwang/remix-mui)。

### `app/mui/createEmotionCache.ts`

```ts
import createCache from "@emotion/cache";

const cache = createCache({ key: "css" });

export default cache;
```

注意 `createCache` 的參數 `key` 如果設定成 `'css'` 以外的值會造成 @mui 樣式問題，推測是因為這個 `key` 也會用於 `renderStylesToString` 和 `renderStylesToNodeStream`：

> [@emotion/cache](https://emotion.sh/docs/@emotion/cache#key): It will also be set as the value of the `data-emotion` attribute on the style tags that emotion inserts and **it's used in the attribute name that marks style elements in `renderStylesToString` and `renderStylesToNodeStream`**.

但從[文件](https://emotion.sh/docs/ssr#api-reference)上看不出來要怎麼調整這兩個功能的 `key` 的值。總之，為了讓 @mui 的樣式能正常運作，請將 `key` 的值固定為 `'css'`。

### `app/mui/theme.ts`

在這裡根據需求設定 @mui 的預設樣式。如果預計用其他套件（比如 tailwind）管理樣式的話，這裡直接呼叫 `createTheme()` 取得 @mui 預設的 `theme` 物件即可。

```ts
import { createTheme } from "@mui/material/styles";

const theme = createTheme();

export default theme;
```

### `app/entry.client.tsx`

重點：對 `RemixBrowser` 包覆 @emotion 的 `CacheProvider` 與 @mui 的 `ThemeProvider`。

```tsx
import { CacheProvider } from "@emotion/react";
import { ThemeProvider } from "@mui/material/styles";
import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import emotionCache from "./mui/createEmotionCache";
import theme from "./mui/theme";

startTransition(() => {
  hydrateRoot(
    document,
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <StrictMode>
          <RemixBrowser />
        </StrictMode>
      </ThemeProvider>
    </CacheProvider>,
  );
});
```

### `app/entry.server.tsx`

重點：類似在 `app/entry.client.tsx` 的改動，要對 `RemixBrowser` 包覆 `CacheProvider` 與 `ThemeProvider`

```tsx
import { PassThrough } from "node:stream";
import { CacheProvider } from "@emotion/react";
import createEmotionServer from "@emotion/server/create-instance";
import { ThemeProvider } from "@mui/material/styles";
import type { EntryContext } from "@remix-run/node";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import emotionCache from "./mui/createEmotionCache";
import theme from "./mui/theme";

const ABORT_DELAY = 5_000;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  return isbot(request.headers.get("user-agent") || "")
    ? handleBotRequest(
        request,
        responseStatusCode,
        responseHeaders,
        remixContext,
      )
    : handleBrowserRequest(
        request,
        responseStatusCode,
        responseHeaders,
        remixContext,
      );
}

function handleBotRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      // wrap emotion/mui provider here
      <CacheProvider value={emotionCache}>
        <ThemeProvider theme={theme}>
          <RemixServer context={remixContext} url={request.url} />
        </ThemeProvider>
      </CacheProvider>,
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          );
          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        },
      },
    );
    setTimeout(abort, ABORT_DELAY);
  });
}

function handleBrowserRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      // wrap emotion/mui provider here
      <CacheProvider value={emotionCache}>
        <ThemeProvider theme={theme}>
          <RemixServer context={remixContext} url={request.url} />
        </ThemeProvider>
      </CacheProvider>,
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          );
          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        },
      },
    );

    setTimeout(abort, ABORT_DELAY);
  });
}
```

### `vite.config.ts`

重點：在執行 `isSsrBuild`（即執行預設 `npm run build`）時，**不要排除 @mui 相關內容**；但在一般開發（`npm run dev`）時不做任何處理

```ts
import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ isSsrBuild }) => ({
  ssr: {
    noExternal: isSsrBuild ? [/^@mui\/*/] : undefined,
  },
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
    }),
    tsconfigPaths(),
  ],
}));
```

## 備註

在 [@mui 提供的 remix 範例](https://github.com/mui/material-ui/tree/master/examples/material-ui-remix-ts)中，專案的根目錄有一個 `remix.config.js` 檔，並設定 `serverModuleFormat: 'cjs'`，但我在測試時發現這個設定不會讓「執行 `npm run start` 時的噴錯」消失 🤷

## 參考文件

- [remix-run/chakra-ui/app/entry.server.tsx](https://github.com/remix-run/examples/blob/main/chakra-ui/app/entry.server.tsx)
- [[system] Import error when using Material UI styles with Remix v2](https://github.com/mui/material-ui/issues/42544#issuecomment-2289725618)
- [Material UI: Example projects](https://mui.com/material-ui/getting-started/example-projects/)
