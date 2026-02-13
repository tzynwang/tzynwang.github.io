---
title: 30天挑戰：「Vue project與SCSS」相關筆記
date: 2021-08-27 09:25:15
tag:
  - [Vue]
  - [2021鐵人賽]
---

## 總結

關於如何在 Vue Project 中使用 SCSS 的相關筆記

## 版本與環境

```
@vue/cli: 4.5.13
```

## 筆記

- Vue CLI 4 預設搭配 webpack 4，`sass-loader`需指定能配合的版本才能正常運行
  `npm install -D sass-loader@^10 sass`
- 安裝`sass-loader`後，即可在 vue components 或 views 中使用 scss 語法

  ```html
  <style lang="scss">
    $bg-classroom: #232323;

    #app {
      width: 100vw;
      height: 100vh;
      background-color: $bg-classroom;
    }
  </style>
  ```

- 如果需要在專案中使用`_reset.scss`、`_color.scss`或是`_mixin.scss`等通用模組的話，則在 Vue 專案根目錄建立`vue.config.js`並輸入以下內容
  ```js
  // vue.config.js
  module.exports = {
    css: {
      loaderOptions: {
        scss: {
          additionalData: `
            @import "@/styles/_module1.scss";
            @import "@/styles/_module2.scss";
          `,
        },
      },
    },
  };
  ```
- 使用反引號即可 import 多組檔案

## 參考文件

- [Vue CLI: Working with CSS](https://cli.vuejs.org/guide/css.html#pre-processors)
