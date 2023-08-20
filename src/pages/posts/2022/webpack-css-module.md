---
layout: '@Components/SinglePostLayout.astro'
title: 2022 第10週 實作筆記：webpack scoped styles (index.module.(s)css)
date: 2022-03-13 19:55:03
tag:
  - [webpack]
---

## 總結

記錄一下如何設定 `webpack.config.js` 使 React APP 可以使用 scoped style
以下兩個 `<button />` 的 className 皆設定為 `Styles.hello` ，但透過在 webpack.config.js 中設定 `module` 為 `true` 使其樣式不會互相影響

![demo](/2022/webpack-css-module/scoped-style-demo.png)

## 版本與環境

```
sass: 1.49.9
sass-loader: 12.6.0
webpack: 5.70.0
```

## 筆記

<script src="https://gist.github.com/tzynwang/836b24fe413e95e9d58f79e72d01e75d.js"></script>

- 如果是透過 `create-react-app` 建立並執行過 `npm run eject` 的 React APP 專案的話，需補安裝 `sass`（`npm i --save-dev sass`）
- 第 15 行：需注意在處理 `CSS_REG` 時必須排除 `CSS_MODULE_REG`，避免 webpack 重複打包（.scss 類檔案同理）
- 第 28 行：將名稱符合以下規範的檔案都視為 css module
  > enable CSS modules for all files matching /\.module\.\w+$/i.test(filename) and /\.icss\.\w+$/i.test(filename) regexp.
- 第 33 行：因 `namedExport` 設定為 `true` 故此處需搭配設定為 `camelCaseOnly`
  > based on the modules.namedExport option value, if true then camelCaseOnly, otherwise asIs
- 第 46 行：處理 `SCSS_MODULE_REG` 類檔案時，需設定 `options` 中的 `importLoaders` 數量為 1，意即在執行 `css-loader` 前需執行 `sass-loader`
  > Default: 0
  > Allows to enables/disables or setups number of loaders applied before CSS loader for @import at-rules, CSS modules and ICSS imports, i.e. @import/composes/@value value from './values.css'/etc.

## 參考文件

- [webpack 5: css-loader module mode](https://webpack.js.org/loaders/css-loader/#object-2)
- [webpack 5 example: Pure CSS, CSS modules and PostCSS](https://webpack.js.org/loaders/css-loader/#pure-css-css-modules-and-postcss)
