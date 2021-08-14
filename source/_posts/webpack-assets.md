---
title: 「webpack引用assets靜態檔案」相關筆記
date: 2021-08-14 13:24:22
categories:
- webpack
tags:
---

## 總結
此篇筆記為記錄在專案需引用靜態檔案時，webpack應如何設定
展示用repo：https://github.com/tzynwang/webpack-demo


## 環境
```
webpack: 5.50.0
webpack-cli: 4.7.2
html-loader: 2.1.2
os: Windows_NT 10.0.18363 win32 x64
```

## 資料夾結構
{% figure figure--center 2021/webpack-assets/folder-structure.png "'src資料夾結構'" %}


## 套件安裝
`npm i -D css-loader html-loader html-webpack-plugin mini-css-extract-plugin node-sass sass-loader webpack webpack-cli`


## 設定
### webpack.config.js
<script src="https://gist.github.com/tzynwang/31e5e4e84c47de9c014025fb764dcb35.js"></script>

- 第26-29行：設定所有png、jp(e)g、gif、svg檔案都要辨識為asset/resource，並打包後名稱統一為`img/[原本的檔案名稱].[副檔名]`
  - 加上`img/`是為了讓打包後的圖片檔案通通被掃進`dist/img`這個資料夾中
  - 沒有加上`/img`的話，所有的檔案都會直接散落在dist根目錄裡面，沒有功能差異，但看起來很亂
- 第33-34行：為了要讓`.html`中使用的圖片（比如`<img src="...">`）也能被打包，故需使用`html-loader`

### src/template.html
<script src="https://gist.github.com/tzynwang/c60103fb640648950925d14592c2a52b.js"></script>

第13行引用了靜態圖片檔案

### src/assets/styles/main.scss
<script src="https://gist.github.com/tzynwang/7fd0b11b799b6a2da4ae63dfee48d044.js"></script>

第23行引用了靜態圖片檔案

### src/index.js
<script src="https://gist.github.com/tzynwang/26e8c23c42febcafa3d204d08a582c8a.js"></script>

- `main.scss`與`template.html`都要import進來，webpack才會把這兩份檔案中引用到的靜態資源一併打包起來


## 打包成果
{% figure figure--center 2021/webpack-assets/folder-structure-packed.png "'dist資料夾結構'" %}

{% figure figure--center 2021/webpack-assets/demo.png "'webpack會置換靜態檔案的路徑'" %}
透過devTools可以觀察到webpack已經將src中的檔案路徑都轉換為應對dist資料夾中的靜態檔案路徑了


## 參考文件
- [webpack: Loading Images](https://webpack.js.org/guides/asset-management/#loading-images)
- [Webpack 前端打包工具 - 使用 url-loader 與 file-loader 處理靜態資源](https://awdr74100.github.io/2020-03-09-webpack-urlloader-fileloader/)