---
layout: '@Components/pages/SinglePostLayout.astro'
title: 捨棄 create-react-app 之餘還架了個 astro blog 昭告天下：webpack 5 與 TypeScript
date: 2023-09-23 08:58:41
tag:
  - [2023鐵人賽]
  - [Frontend Infrastructure]
  - [webpack]
banner: /2023/ithome-2023-8/victor-charlie-QG9xUOQTYCY-unsplash.jpg
summary: 瀏覽器環境是認不得 TypeScript 內容的，今天會分享個人平常如何透過 webpack 將 .ts/.tsx 處理成 JavaScript 檔案。
draft:
---

在[第 4 天](/2023/ithome-2023-4)個人曾經推薦在 tsconfig.json 中透過 `paths` 設定短路徑、省去在檔案間互相 import 時計算路徑的麻煩。而今天就會來詳細解釋如何為 webpack 加上 `alias` 設定，以及要安裝哪些 loader 來讓 webpack 能夠將 TypeScript 轉為瀏覽器能夠理解的 JavaScript 內容。

## 流程說明

先來順一下今天預計要做的事情：

1. 從 `tsconfig.json` 讀取 `paths` 資料，並把這些內容轉為 webpack alias 能夠使用的格式
2. 將 alias 灌進 webpack 開發環境設定中。注意：沒有提供 alias 的話，`webpack-dev-server` 拉起來之後，是無法正確解析我們在 tsconfig.json 中自訂的 `@Asset/*` 這類路徑的
3. 為 webpack 加上 [esbuild-loader](https://github.com/esbuild-kit/esbuild-loader) 來將 `.ts/.tsx/.js` 處理成瀏覽器環境能夠讀懂的格式。選擇 esbuild-loader 是因為此套件是用 Go 寫的，編譯速度較快
4. 到 `./public` 資料夾中新增一個給 React app 掛載的 index.html 檔案，然後設定 `html-webpack-plugin` 讓 webpack 知道去哪裡撈 html 內容

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

接下來把這個 `alias` 變數餵進 [resolve.alias](https://webpack.js.org/configuration/resolve/#resolvealias) 中，webpack 就能認得我們在 tsconfig.json 中自訂的路徑了：

```ts
const webpackDevelopmentConfig: WebpackConfiguration = {
  resolve: {
    alias,
  },
};
```

### 處理 TypeScript

以下是個人慣用的最小啟動＋處理 TypeScript 設定：

```ts
const webpackDevelopmentConfig: WebpackConfiguration = {
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        loader: 'esbuild-loader',
        options: {
          loader: 'tsx',
          target: 'es2015',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    alias,
  },
};
```

較詳細的說明如下：

- `module.rules` 目前的任務是：當偵測到 `.js` / `.ts` / `.tsx` 類型的檔案時，使用 `esbuild-loader` 來處理之。這邊的寫法是從 loader 的[官方說明](https://github.com/esbuild-kit/esbuild-loader#-quick-setup)借來的，有更多客製化的需求可以參考該套件的 README
- 設定 `resolve.extensions` 為 `['.js', '.ts', '.tsx']` 代表可以在 import 這類檔案時省略副檔名，[參考 webpack 文件](https://webpack.js.org/configuration/resolve/#resolveextensions)

現在你可以放心撰寫 TypeScript 檔案了 (\*ﾟーﾟ)

## 目前為止的 webpack 設定

只差一點點就能啟動了！現在加上 `html-webpack-plugin` 來讓 webpack 知道要去哪裡抓 index.html 模板（記得模板內要留一個 html 元件綁 `id="root"` 讓 React app 有地方住）。另外個人也習慣設定 `devtool: source-map` 來確保除錯時能夠取得最完整的檔案名、程式行數資訊：

```ts
/* Packages */
import HtmlWebpackPlugin from 'html-webpack-plugin';
import Webpack from 'webpack';

/* Tools */
import { resolvePath } from '@/tool/resolvePath';

/* Data */
import alias from './data/alias';
import env from './data/env';
import type {
  WebPackDevServerConfiguration,
  WebpackConfiguration,
  EnvForStartApp,
} from './data/types';

const envForStartApp = env['process.env'] as EnvForStartApp;
const port = +JSON.parse(envForStartApp.APP_PORT);

/* Main */
const webpackDevelopmentConfig: WebpackConfiguration = {
  mode: 'development',
  entry: resolvePath('src/index'),
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        loader: 'esbuild-loader',
        options: {
          loader: 'tsx',
          target: 'es2015',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolvePath('public/index.html'),
      publicPath: '/',
    }),
    new Webpack.DefinePlugin({ ...env }),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    alias,
  },
};

export const webpackDevServerConfig: WebPackDevServerConfiguration = {
  port,
  open: true,
  historyApiFallback: true,
};

export default webpackDevelopmentConfig;
```

`./public/index.html` 先簡單寫就好，後續開始部署或是有 SEO 優化需求時再更新即可：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ithome 2023 demo</title>
  </head>
  <body>
    <main id="root"></main>
  </body>
</html>
```

現在 webpack 已經知道如何編譯 TypeScript、也知道去哪裡尋找 index.html 內容了。在終端輸入 `make start` （參考[第 6 天](/2023/ithome-2023-6#透過-makefile-設定腳本)）來看看到目前為止的成果吧 (≖ᴗ≖๑)
