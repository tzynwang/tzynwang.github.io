---
layout: '@Components/SinglePostLayout.astro'
title: 「webpack環境設置步驟」相關筆記
date: 2021-06-12 11:02:00
tag:
  - [webpack]
---

## 總結

使用 webpack（本次搭配 axios 與 vue）開發前端 web APP 時的環境相關設置筆記
2021/8/4 更新：追加 SCSS 相關設定

## 環境

```
webpack: 5.38.1
webpack-cli: 4.7.2
vue: 2.6.14
os: Windows_NT 10.0.18363 win32 x64

// 2021/8/4追加
node-sass: 6.0.1
sass-loader: 12.1.0
```

## 步驟

1. 移動到專案資料夾內，在終端機輸入`npm init -y`

- `-y`可跳過所有關於`package.json`的設定問題
- [npm-init](https://docs.npmjs.com/cli/v6/commands/npm-init): If the initializer is omitted (by just calling `npm init`), init will fall back to legacy init behavior. It will **ask you a bunch of questions**, and then write a `package.json` for you. You can also use `-y`/`--yes` to **skip the questionnaire** altogether.

1. 安裝`webpack`、`webpack-cli`、`axios`、`vue`與`html-webpack-plugin`

- `npm install <package name> --save-dev`
- [What is the difference between --save and --save-dev?](https://stackoverflow.com/questions/22891211/what-is-the-difference-between-save-and-save-dev)
- [npm: devDependencies](https://docs.npmjs.com/cli/v6/configuring-npm/package-json#devdependencies): If someone is planning on downloading and using your module in their program, then they probably **don't want or need to download and build the external test or documentation framework** that you use. In this case, it's best to map these additional items in a **devDependencies** object.

1. `package.json`設定如下：

<script src="https://gist.github.com/tzynwang/0036ecd4516c978467fe64266791de26.js"></script>

- [`webpack --watch`](https://webpack.js.org/configuration/watch/): This means that after the initial build, webpack will **continue to watch for changes** in any of the resolved files. 執行`npm run watch`的話，webpack 會自動更新修改後的 src 內容；搭配 vs code liver server 的話，就能及時觀察到修正後的結果

1. 在根目錄中建立`webpack.config.js`，（在專案需要使用 vue 的情況下）設定如下：

<script src="https://gist.github.com/tzynwang/8dadd59d8eb258d7843727f7bbcd4419.js"></script>

1. 在根目錄中建立資料夾`src`，其中的檔案名稱需與`webpack.config.js`搭配，故使用`index.js`與`template.html`

<script src="https://gist.github.com/tzynwang/948dbc4dea908a2cc27b874949a35383.js"></script>
<script src="https://gist.github.com/tzynwang/2bf0bd73c4f25713752a3c7decd13385.js"></script>

1. 在終端機執行`npm run build`後，根目錄中出現資料夾`dist`，內有`index.html`與`main.js`

<script src="https://gist.github.com/tzynwang/96051f1c7bdded10f79ad3caeaf838be.js"></script>

並且`main.js`已經根據`webpack.config.js`中`HtmlWebpackPlugin`的設定，自動嵌入`<body>`底部
使用 webpack 進行打包的步驟到此結束

## 資料夾結構

![folder structure](/2021/webpack-note/webpack-folder-structure.png)

## 補充：若須導入.css

1. 安裝`css-loader`與`mini-css-extract-plugin`（`npm i css-loader mini-css-extract-plugin -D`）
1. 在`index.js`中匯入.css 檔案

```js
import './bootstrap.bundle';
import './bootstrap.css';
import './style.css';
```

1. `webpack.config.js`加入以下內容：

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  plugins: [new MiniCssExtractPlugin()],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
};
```

- [MiniCssExtractPlugin](https://webpack.js.org/plugins/mini-css-extract-plugin/)：此 plugin 會在執行`npm run build`時將（匯入 index.js 的）.css 檔案獨立出來，並嵌入`index.html`中（預設在`<head>`尾端，可透過[`insert`參數](https://webpack.js.org/plugins/mini-css-extract-plugin/#insert)修改）
- [Webpack config: Module Rule.test](https://webpack.js.org/configuration/module/#ruletest): Include all modules that pass test assertion. If you supply a `Rule.test` option, you cannot also supply a `Rule.resource`.

## 補充：若須導入.scss

1. 除上述提及之 package 之外，追加安裝`node-sass`與`sass-loader`
1. `webpack.config.js`的 plugins 與 module 設定如下：

```
plugins: [
  new MiniCssExtractPlugin(),
  new HtmlWebpackPlugin({
    inject: 'body',
    template: './src/index.html'
  })
],
module: {
  rules: [
    {
      test: /\.scss$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        'sass-loader'
      ]
    }
  ]
}
```

## 參考文件

- [Webpack 5: Getting Started](https://webpack.js.org/guides/getting-started/)
- [Webpack 5: sass-loader](https://webpack.js.org/loaders/sass-loader/)
- [HTML Webpack Plugin](https://github.com/jantimon/html-webpack-plugin#readme)
