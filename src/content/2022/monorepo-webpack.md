---
title: 2022 第41週 實作筆記：react monorepo
date: 2022-10-15 10:29:47
tag:
- [monorepo]
- [webpack]
---

## 總結

在沒有使用其他套件的情況下從零開始建立一個 react monorepo 專案，此篇筆記會記錄如何調整 package.json 與 webpack 設定來讓專案可以順利編譯。

專案結構可參考：[tzynwang/monorepo-study](https://github.com/tzynwang/monorepo-study)

## 版本與環境

```
react: 18.2.0
react-dom: 18.2.0
webpack: 5.74.0
yarn: 1.22.18
```

## 筆記

### package.json

#### 根目錄

```json
// 僅列出 monorepo 必要的部份
{
  "name": "monorepo-study",
  "private": true,
  "scripts": {
    "start": "yarn workspace @monorepo-study/app start",
    "build": "yarn workspace @monorepo-study/app build",
    "del:node_modules": "find . -type d -name 'node_modules' -exec rm -rf {} +"
  },
  "workspaces": ["app/**", "packages/**"]
}
```

根目錄的 `package.json` 指定整個專案的名稱為 `monorepo-study`，並設定 `workspaces` 需涵蓋 `<root>/app` 與 `<root>/packages` 這兩個資料夾的內容。

要在專案根目錄執行 workspaces 套件的腳本，加上 `workspace` 關鍵字即可；參考上述範例，在終端執行 `yarn start` 時，實際執行的是 `@monorepo-study/app` 這個套件的 `yarn start`

#### workspace 下的套件

```json
// <root>/packages/components 資料夾中的 package.json
{
  "name": "@monorepo-study/components",
  "main": "./src/index.tsx",
  "types": "./src/types.d.ts",
  "version": "1.0.0",
  "description": "",
  "keywords": [],
  "author": "",
  "license": "MIT",
  "dependencies": {
    "@types/react": "^18.0.21",
    "@types/react-dom": "^18.0.6",
    "classnames": "^2.3.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^4.8.4"
  }
}
```

```json
// <root>/app 資料夾中的 package.json
{
  "name": "@monorepo-study/app",
  "version": "1.0.0",
  "description": "",
  "scripts": {
    "start": "node script/start.js",
    "build": "node script/build.js"
  },
  "keywords": [],
  "author": "",
  "license": "MIT",
  "dependencies": {
    "@babel/core": "^7.19.3",
    "@babel/preset-env": "^7.19.3",
    "@babel/preset-react": "^7.18.6",
    "@types/react": "^18.0.21",
    "@types/react-dom": "^18.0.6",
    "babel-loader": "^8.2.5",
    "classnames": "^2.3.2",
    "copy-webpack-plugin": "^11.0.0",
    "css-loader": "^6.7.1",
    "dotenv": "^16.0.3",
    "dotenv-webpack": "^8.0.1",
    "html-webpack-plugin": "^5.5.0",
    "mini-css-extract-plugin": "2.6.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "style-loader": "^3.3.1",
    "ts-loader": "^9.4.1",
    "typescript": "^4.8.4",
    "webpack": "^5.74.0",
    "webpack-cli": "^4.10.0",
    "webpack-dev-server": "^4.11.1"
  }
}
```

注意 workspaces 套件的名稱都需加上在根目錄 `package.json` 設定好的專案名；比如 `packages/components` 在 `package.json` 中的 `name` 要設定為 `@monorepo-study/components`（而不是單純的 `components`）

而開發需要的 dependencies 也都根據 `@monorepo-study/components` 以及 `@monorepo-study/app` 各自的需求列出。兩個套件都有安裝 `react` 與 `react-dom`，但只有 `@monorepo-study/app` 安裝了 `webpack` 與相關套件來處理轉譯、打包需求。

設定好 workspaces 們的 dependencies 後，直接在專案根目錄位置執行 `yarn` 來執行 dependencies 安裝即可。

### webpack

最大的關鍵是在 `module.rules.loader` 加上 `require.resolve` 來解析 `plugin` 位置，其他設定則根據 development 以及 production 環境的需求來處理即可。

以 `@monorepo-study/app` 的設定為例，只有在 production 環境時才選擇載入 `miniCssExtractPlugin`，`module.rules` 中關於 css 檔案的解析，也根據環境是 development 或 production 來決定要採用 `miniCssExtractPlugin.loader` 或 `style-loader` 來處理檔案。

差異是：`miniCssExtractPlugin` 會把樣式獨立輸出為一個 `.css` 檔案，而 `style-loader` 則是把樣式直接注入到 DOM 上（如果 `injectType` 使用預設的 `styleTag`），在開發時透過 `style-loader` 可以直接反應修改後儲存的內容，比較方便。

而 `output.path` 則透過 `path.resolve` 來指定最終輸出的 `dist` 資料夾要放在專案根目錄中。

```js
const path = require('path');
const dotenvWebpack = require('dotenv-webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
const miniCssExtractPlugin = require('mini-css-extract-plugin');
require('dotenv').config();

module.exports = function (webpackEnv) {
  const isProduction = webpackEnv === 'production';
  return {
    entry: './src/index.tsx',
    output: {
      clean: true,
      chunkFilename: 'js/[name].[contenthash:8].chunk.js',
      filename: 'js/[name].[contenthash:8].js',
      path: path.resolve(__dirname, '..', '..', 'dist'), // export final bundle to root/dist folder
    },
    plugins: [
      new dotenvWebpack(),
      new htmlWebpackPlugin({
        template: './public/index.html',
      }),
      isProduction &&
        new miniCssExtractPlugin({
          filename: 'css/[name].[contenthash:8].css',
          chunkFilename: 'css/[name].[contenthash:8].chunk.css',
        }),
    ].filter(Boolean),
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          loader: require.resolve('ts-loader'),
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: require.resolve('babel-loader'),
          options: {
            presets: [
              require.resolve('@babel/preset-env'),
              require.resolve('@babel/preset-react'),
            ],
          },
        },
        {
          test: /\.module\.css$/,
          use: [
            isProduction
              ? { loader: miniCssExtractPlugin.loader }
              : { loader: require.resolve('style-loader') },
            {
              loader: require.resolve('css-loader'),
              options: {
                importLoaders: 1,
                modules: {
                  localIdentName: '[path][name]__[local]__[hash:base64:5]',
                },
              },
            },
          ],
        },
        {
          test: /\.css$/,
          exclude: /\.module\.css$/,
          use: [
            isProduction
              ? miniCssExtractPlugin.loader
              : require.resolve('style-loader'),
            require.resolve('css-loader'),
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js'],
    },
  };
};
```

### .gitignore

不需要加上 `/` 或 `**`，直接輸入 `node_modules` 與 `dist` 即可直接忽略在專案各層有著同樣名稱的資料夾

## 參考文件

- [Node.js require.resolve(request[, options])](https://nodejs.org/api/modules.html#requireresolverequest-options)
- [StackOverFlow: Transpiling and linting files outside of my root directory webpack 4](https://stackoverflow.com/questions/56093213/transpiling-and-linting-files-outside-of-my-root-directory-webpack-4)
- [StackOverFlow: ignoring any 'bin' directory on a git project](https://stackoverflow.com/a/45490108/15028185)
