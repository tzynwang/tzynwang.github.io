---
title: 2022 第3週 實作筆記：React App 與 webpack
date: 2022-01-28 20:22:42
categories:
- [React]
- [webpack]
tags:
---

## 總結
記錄如何在 React App 中使用 webpack 5 達成以下需求：
- 需能在 `.tsx` 檔案中 `import .css`
- 需配合 `typescript`
- 可使用閱讀性較高的自定義 `import path`
- 需支援 hot reload：修改 React App 內容後，需直接反應在 `localhost` 畫面上


## 版本與環境
```
webpack: 5.67.0
webpack-cli: 4.9.2
webpack-dev-server: 4.7.3
```

## 筆記


## 參考文件
- [How to use Webpack with React: an in-depth tutorial](https://www.freecodecamp.org/news/learn-webpack-for-react-a36d4cac5060/)