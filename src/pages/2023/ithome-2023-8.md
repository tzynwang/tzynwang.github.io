---
layout: '@Components/pages/SinglePostLayout.astro'
title: 鐵人賽 Modern Web 組「捨棄 create-react-app 之餘還架了個 astro blog 昭告天下」第 8 天
date: 2023-08-28 08:58:41
tag:
	- [2023鐵人賽]
banner: /2023/ithome-2023-8/victor-charlie-QG9xUOQTYCY-unsplash.jpg
summary: 瀏覽器環境是認不得 TypeScript 內容的，今天會分享個人平常如何透過 webpack 將 .ts/.tsx 處理成 JavaScript 檔案。
draft: true
---

在[第 4 天](/2023/ithome-2023-4)個人曾經推薦在 tsconfig.json 中透過 `paths` 設定短路徑、省去在檔案間互相 import 時計算路徑的麻煩。而今天就會來詳細解釋如何為 webpack 加上 `alias` 設定，以及要安裝哪些 loader 來讓 webpack 能夠將 TypeScript 轉為瀏覽器能夠理解的 JavaScript 內容。

## 本文

### 流程說明

先來順一下今天預計要做的事情：

1. 從 `tsconfig.json` 讀取 `paths` 資料，並把這些內容轉為 webpack alias 能夠使用的格式
2. 將 alias 灌進 webpack 開發環境設定中。注意：沒有提供 alias 的話，`webpack-dev-server` 拉起來之後，是無法正確解析我們在 tsconfig.json 中自訂的 `@Asset/*` 這類路徑的
3. 為 webpack 加上 [esbuild-loader](https://github.com/esbuild-kit/esbuild-loader) 來將 `.ts/.tsx/.js` 處理成瀏覽器環境能夠讀懂的格式。選擇 esbuild-loader 是因為此套件是用 Go 寫的，編譯速度較快

完成以上步驟後，你的本機伺服器就能正常顯示專案中的 TypeScript 內容了 (・∀・)

### 處理 alias

首先在專案根目錄的 `./tool` 資料夾中新增 `resolvePath.ts`：

```ts
/* Packages */
import fs from 'fs';
import path from 'path';

/* Data */
const APP_ROOT = fs.realpathSync(process.cwd());

/* Functions */
export function resolvePath(file: string) {
  return path.resolve(APP_ROOT, file);
}
```

這個工具會負責回傳「傳入的參數相對於專案根目錄的絕對路徑」。比如當我呼叫 `resolvePath('src/index')` 時，我會得到（以 mac 環境為例）`/Users/<user name>/ithome-2023/src/index` 這樣的路徑資訊。

接著新增 `./config/data/alias.ts` 並撰寫以下內容：

```ts
/* Tools */
import { resolvePath } from '@/tool/resolvePath';

/* Data */
import tsConfig from '@/tsconfig.json';

type PathPair = [string, string];

/* Main */
const paths: PathPair[] = Object.entries(tsConfig.compilerOptions.paths).map(
  (pathPair) => {
    const [pathKey, pathValue] = pathPair;
    return [pathKey.replace('/*', ''), pathValue.join().replace('/*', '')];
  }
);
const alias = paths.reduce((reducedValue, currentValue) => {
  const [key, pathToResolve] = currentValue;
  return {
    ...reducedValue,
    [key]: resolvePath(pathToResolve),
  };
}, {});

export default alias;
```

首先透過 `Object.entries(tsConfig.compilerOptions.paths)` 將 tsconfig.json 中的 paths 物件轉為 `[key, value]` 陣列，再將 key 部分的 `@Asset/*` 轉為 `@Asset`、將 value 部分的 `["src/asset/*"]` 轉為 `src/asset`。印出來看會長這樣：

```bash
[
  [ '@', '.' ],
  [ '@Api', './src/api' ],
  [ '@Asset', './src/asset' ],
  [ '@Component', './src/component' ],
  [ '@Hook', './src/hook' ],
  [ '@Model', './src/model' ],
  [ '@Reducer', './src/reducer' ],
  [ '@Style', './src/style' ],
  [ '@Tool', './src/tool' ]
]
```

然後使用 `Array..prototype.reduce()` 並搭配一開始寫好的 `resolvePath` 工具，將 `paths` 加工為以下格式：

```bash
{
  '@': '/Users/<user name>/ithome-2023/',
  '@Api': '/Users/<user name>/ithome-2023/src/api',
  '@Asset': '/Users/<user name>/ithome-2023/src/asset',
  '@Component': '/Users/<user name>/ithome-2023/src/component',
  '@Hook': '/Users/<user name>/ithome-2023/src/hook',
  '@Model': '/Users/<user name>/ithome-2023/src/model',
  '@Reducer': '/Users/<user name>/ithome-2023/src/reducer',
  '@Style': '/Users/<user name>/ithome-2023/src/style',
  '@Tool': '/Users/<user name>/ithome-2023/src/tool'
}
```

接下來把這個 `alias` 變數餵進 webpack 設定中的 [resolve.alias](https://webpack.js.org/configuration/resolve/#resolvealias) 就大功告成了：

```ts
const webpackDevelopmentConfig: WebpackConfiguration = {
  resolve: {
    alias,
  },
};
```

現在 webpack 知道如何解析 tsconfig.json 中的自訂 paths 了。

### 處理 TypeScript

## 總結
