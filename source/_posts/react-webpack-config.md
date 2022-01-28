---
title: 2022 第3週 實作筆記：React App 與 webpack
date: 2022-01-28 20:22:42
categories:
  - [React]
  - [TypeScript]
  - [webpack]
tags:
---

## 總結

記錄如何在 React App 中使用 webpack 5 達成以下需求：

- 配合 `typescript`
- 可使用閱讀性較高的自定義 `import path`
- 支援 hot reload：修改 React App 內容並存檔後，需直接反應在 `localhost` 畫面上

## 版本與環境

```
webpack: 5.67.0
webpack-cli: 4.9.2
webpack-dev-server: 4.7.3
```

## 筆記

### packages

`npm i --save-dev @babel/core @babel/plugin-proposal-class-properties @babel/preset-env @babel/preset-react @babel/preset-typescript babel-loader css-loader html-webpack-plugin webpack webpack-cli webpack-dev-server`

### 自定義 import path

有兩處需處理，參考原始碼 `webpack.config.js` （38 行）與 `tsconfig.json`（3~6 行）
實作後即可在 `src` 資料夾中的任何檔案內使用 `@Component/` 直接引用任何位在 `src/components/` 內的元件，不再需要考慮資料夾的相對位置；範例如下：

<script src="https://gist.github.com/tzynwang/d4b70145dbac5aeb09ee5624a3a1d26e.js"></script>

### hot reload

參考 `webpack.config.js` （10-12 行）

### package.json script 設定

如下，指定 `webpack.config.js` 路徑；之後直接在終端輸入 `npm run dev` 即可啟動 React App，並支援 hot reload

```json
"dev": "webpack serve --config config/webpack.config.js"
```

## 原始碼

<script src="https://gist.github.com/tzynwang/9b0424e60e77adcba5c363df7747c47a.js"></script>

<script src="https://gist.github.com/tzynwang/d3bc04f7a854f7844b8e9f2338c24e46.js"></script>

## 參考文件

- [How to use Webpack with React: an in-depth tutorial](https://www.freecodecamp.org/news/learn-webpack-for-react-a36d4cac5060/)
- [TSConfig Reference: Paths](https://www.typescriptlang.org/tsconfig#paths)
- [webpack: css-loader](https://webpack.js.org/loaders/css-loader/)
- [webpack: resolve.alias](https://webpack.js.org/configuration/resolve/#resolvealias)
- [webpack: devServer.hot](https://webpack.js.org/configuration/dev-server/#devserverhot)