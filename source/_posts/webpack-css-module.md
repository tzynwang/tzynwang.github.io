---
title: 2022 第10週 實作筆記：webpack scoped styles (index.module.(s)css)
date: 2022-03-13 19:55:03
categories:
  - webpack
tags:
---

## 總結

記錄一下如何設定 `webpack.config.js` 使 React APP 可以使用 scoped style

## 版本與環境

```
sass: 1.49.9
sass-loader: 12.6.0
webpack: 5.70.0
```

## 筆記

<script src="https://gist.github.com/tzynwang/836b24fe413e95e9d58f79e72d01e75d.js"></script>

## 參考文件

- [webpack 5: css-loader module mode](https://webpack.js.org/loaders/css-loader/#object-2)
- [webpack 5 example: Pure CSS, CSS modules and PostCSS](https://webpack.js.org/loaders/css-loader/#pure-css-css-modules-and-postcss)
