---
title: 透過 Node.js API 執行 webpack
date: 2023-02-11 19:04:17
tag:
  - [webpack]
---

## 總結

除了直接在終端輸入 `webpack --config ./config/webpack.config.production.js` 來打包前端專案外，也可考慮透過 webpack 提供的 Node.js API 來執行打包。除了自訂錯誤處理邏輯之外，速度也比直接呼叫 `webpack` 快一點點。

本篇文章的完整程式碼放在：[tzynwang/react-no-cra-template](https://github.com/tzynwang/react-no-cra-template)

## 版本與環境

```
webpack: 5.75.0
```

```
Chip: Apple M1
Memory: 8G
macOS: Ventura 13.0
```

## 筆記

### 使用方式

1. 引用套件 `webpack`
2. 引用正式環境打包用的 webpack 設定檔 `webpackProductionConfig`
3. 將設定檔傳給 `webpack()` 來建立 `compiler` 實例（instance）
4. 使用 `compiler.run()` 來執行打包

程式碼如下：

```js
/* Packages */
const webpack = require('webpack');

/* Data */
const webpackProductionConfig = require('../config/webpack.config.production');
const compiler = webpack(webpackProductionConfig);

/* Main */
compiler.run((error, stats) => {
  if (error) {
    console.error(error);
  }
  compiler.close((closeError) => {
    if (closeError) {
      console.error(closeError);
    }
  });
});
```

### 注意事項

參閱官方說明：

> The Node.js API is useful in scenarios in which you need to customize the build or development process since all the reporting and error handling must be done manually and **webpack only does the compiling part**.

以常見的 React App 來說，透過 `webpack` 執行打包時，基本上都是從 `src/index.(t|j)sx` 作為 [起點](https://webpack.js.org/configuration/entry-context/#entry) 開始打包作業。

但除了 `src` 中的內容外，整個專案裡通常會有一個 `public` 資料夾來放置靜態內容（favicon 等）、以及作為 React 渲染起點的 `index.html` 檔案。但因為打包起始點（`entry`）設定的關係，使 `webpack` 在打包途中不會處理到 `public` 資料夾的內容。

故除了上述的 `compiler.run()` 以外，如果要把 `public` 中的靜態內容也複製一份到打包的輸出資料夾，需加上以下內容：

```js
/* Packages 追加以下內容 */
const fs = require('fs');
const path = require('path');
const fsExtra = require('fs-extra');

/* Data 追加以下內容 */
const APP_ROOT = fs.realpathSync(process.cwd());

/* Main */
/* 在 compiler.run() 下方加上複製腳本 */
fsExtra.copySync(
  path.resolve(APP_ROOT, 'public'),
  path.resolve(APP_ROOT, 'build'),
  {
    dereference: true,
    filter: (file) => file !== path.resolve(APP_ROOT, 'public/index.html'),
  }
);
```

這樣即可把 `public` 中的內容也複製一份到打包後的資料夾中。

### 測速結果

透過終端直接呼叫 webpack 進行打包：平均 3.42 秒
指令為 `npx webpack --config ./config/webpack.config.production.js`

```
make npx-build  3.48s user 0.37s system 140% cpu 2.741 total
make npx-build  3.40s user 0.36s system 143% cpu 2.629 total
make npx-build  3.40s user 0.32s system 156% cpu 2.383 total
make npx-build  3.40s user 0.31s system 161% cpu 2.298 total
make npx-build  3.42s user 0.30s system 165% cpu 2.248 total
```

透過 node 環境執行打包腳本：平均 3.14 秒
指令為 `node ./script/build.js`

```
make build-js  3.17s user 0.25s system 171% cpu 1.991 total
make build-js  3.15s user 0.25s system 173% cpu 1.964 total
make build-js  3.13s user 0.25s system 173% cpu 1.945 total
make build-js  3.15s user 0.25s system 171% cpu 1.982 total
make build-js  3.11s user 0.25s system 174% cpu 1.928 total
```

透過 node 環境搭配 `esbuild-runner/register` 執行 ts 版的腳本：平均 3.30 秒
指令為 `node -r esbuild-runner/register ./script/build.ts`

```
make build  3.21s user 0.32s system 146% cpu 2.407 total
make build  3.27s user 0.33s system 148% cpu 2.425 total
make build  3.58s user 0.28s system 161% cpu 2.394 total
make build  3.23s user 0.27s system 169% cpu 2.059 total
make build  3.22s user 0.27s system 172% cpu 2.030 total
```

## 參考文件

- [webpack 5: Node Interface](https://webpack.js.org/api/node/)
- [folke/esbuild-runner](https://github.com/folke/esbuild-runner#zap-esbuild-runner-esr)
