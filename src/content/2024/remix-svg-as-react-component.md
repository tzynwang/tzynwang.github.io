---
title: 如何在 TypeScript remix 專案中把 .svg 引用成 React 元件
date: 2024-08-03 19:23:07
tag:
  - [Remix]
banner: /2024/remix-svg-as-react-component/dan-asaki-aI3jlXTqrdI-unsplash.jpg
summary: 我感覺 SVGR 官方提供的 remix 設定有點太複雜，其實可以直接上 vite-plugin-svgr 就好。如果你也在用 remix 並且需要把 .svg 引用成 React 元件，歡迎參考此篇筆記。
draft:
---

搜尋 remix SVG as react component 會找到[SVGR 官方提供的 remix 設定](https://react-svgr.com/docs/remix/)，但感覺太複雜了。其實可以直接用 [vite-plugin-svgr](https://www.npmjs.com/package/vite-plugin-svgr) 來處理就好。

## 步驟

先安裝套件：

```bash
npm i --D vite-plugin-svgr @svgr/plugin-jsx @svgr/plugin-prettier @svgr/plugin-svgo
yarn add --D vite-plugin-svgr @svgr/plugin-jsx @svgr/plugin-prettier @svgr/plugin-svgo
```

然後在專案根目錄新增 `svgr.config.cjs` 與 `svgo.config.cjs`。使用 `.cjs` 是因為用 `.js` 設定檔沒辦法讓 `npm run remix vite:dev` 啟動專案。錯誤訊息如下：

```bash
[vite] Internal server error: require() of ES Module (略)/svgo.config.js from (略)/node_modules/cosmiconfig/dist/loaders.js not supported.
Instead change the require of svgo.config.js in (略)/node_modules/cosmiconfig/dist/loaders.js to a dynamic import() which is available in all CommonJS modules.
```

---

接著在 `svgr.config.cjs` 中設定要引用的外掛（plugin）：

```js
module.exports = {
  plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx", "@svgr/plugin-prettier"],
};
```

不需要加上 `typescript: true`，因為轉成 `.tsx` 反而會讓 vite 無法順利解析。錯誤訊息大概長這樣：

```bash
7:34:05 PM [vite] Internal server error: Transform failed with 1 error:
(略)/app/assets/icons/arrow_back.svg?react:2:12: ERROR: Expected "from" but found "{"

  Expected "from" but found "{"
  1  |  import * as React from 'react';
  2  |  import type { SVGProps } from 'react';
     |              ^
  3  |  const SvgArrowBack = (props: SVGProps<SVGSVGElement>) => (
  4  |    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}>
```

然後在 `svgo.config.cjs` 設定 .svg 的加工需求：

```js
module.exports = {
  plugins: [
    {
      name: "removeAttrs",
      params: {
        attrs: "(fill|fill-rule|style)",
      },
    },
  ],
};
```

選擇移除 `fill` 和 `style` 是因為我會透過 tailwind css 來控制 .svg （圖示）的顏色。

再把設定檔與 `vite-plugin-svgr` 加進 `vite.config.js`：

```js
import svgr from "vite-plugin-svgr";
import svgrOptions from "./svgr.config.cjs";

export default {
  // ...
  plugins: [svgr({ svgrOptions })],
};
```

---

快完成了。在 `./app` 資料夾內建立 `custom.d.ts`。檔名中的 `custom` 可以換成其他名稱。在 `custom.d.ts` 加入以下內容：

```ts
declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.svg?react" {
  import * as React from "react";
  export const ReactComponent: React.FunctionComponent<
    React.ComponentProps<"svg">
  >;
  export default ReactComponent;
}
```

這代表這個專案的 .svg 檔有兩種用法。一個是在路徑尾巴加上 `?react` 把 .svg 當成 React 元件用。一個是不加上 `?react` 來載入 .svg 的檔案路徑。參考以下範例：

```tsx
import arrowBackSrc from "~/assets/icons/arrow_back.svg";
import ArrowBack from "~/assets/icons/arrow_back.svg?react";

function IconButton() {
  return (
    <button>
      <ArrowBack className="block h-6 w-6" />
      <img src={arrowBackSrc} alt="" />
    </button>
  );
}
```

---

最後，把 `custom.d.ts` 加進 `tsconfig.json` 的 `compilerOptions.types` 中：

```json
{
  "compilerOptions": {
    "types": ["@remix-run/node", "vite/client", "./app/custom.d.ts"]
  }
}
```

完成 👏

## 參考文件

- [SVGR Usage: Remix](https://react-svgr.com/docs/remix/)
- [vite-plugin-svgr #README](https://github.com/pd4d10/vite-plugin-svgr?tab=readme-ov-file#vite-plugin-svgr)
