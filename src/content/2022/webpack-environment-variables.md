---
title: 2022 第15週 學習筆記：從零開始透過 webpack.config 讀取環境變數
date: 2022-04-13 19:21:50
tag:
  - [webpack]
---

## 總結

發現自己並沒有完全弄清楚 create-react-app 提供的 webpack.config 究竟在**前端專案讀取環境變數**一事中提供了哪些協助，故此篇筆記旨在記錄如何從零開始實作「在前端專案讀取 `.env` 檔案中的環境變數」此需求

## 筆記

### 環境建置

- 安裝完 `react` 與 `react-dom` 後，加裝以下輔助工具：
  - 提供型別定義與檢查：`typescript`, `@types/react`, `@types/react-dom`
  - 將 ts(x) 檔案編譯為瀏覽器可以讀取的 `.js` 檔案：`webpack`, `webpack-cli`, `html-webpack-plugin`
  - 使用 webpack 的 devServer：`webpack-dev-server`
  - 輔助 webpack 進行編譯的工具：`babel-loader`, `@babel/core`, `@babel/preset-env`, `@babel/preset-react`, `@babel/preset-typescript`
  - 方便讀取 `.env` 檔案：`dotenv`
- 因 `webpack.config.js` 沒有直接放置在根目錄下，而是放在 `./config` 資料夾中，故透過 `npm run dev` 啟動 webpack 時需加上 `--config config/webpack.config.js` 來指定檔案路徑

<script src="https://gist.github.com/tzynwang/53bb9ecb5c26ecf815f0cebd7e5b6065.js"></script>

### babel 設定

<script src="https://gist.github.com/tzynwang/0291449fa4efd6985b2e69f4bce2ad0b.js"></script>

### webpack.config 設定

<script src="https://gist.github.com/tzynwang/ecf56bc9e3f77d82381a04c16b73275e.js"></script>

- 第 7 行：透過 `dotenv` 讀取位於資料夾根目錄的 `.env` 內容
- 第 12~23 行：將 .tsx 檔案透過 babel-loader 編譯為 .js 檔案
- 第 25 行：透過 `webpack.DefinePlugin` 來置換 `process.env` 內容
  - 亦即當開發者試圖在 React 元件中讀取 `process.env` 時，實際上讀取到的其實是被 `webpack.DefinePlugin` 替換（replace）後的資料
  - 沒有加上此步驟，而是直接在 React 元件中試圖取得 `process.env` 時，會報錯：`Uncaught ReferenceError: process is not defined`
  - 理由：如錯誤訊息所示，前端（瀏覽器）環境中並沒有 `process` 這個物件
    > You can't use the process.env global variable Node provides (to get access to the variables created inside the .env file) in the browser.
  - 執行 `JSON.stringify(env)` 是為了避免在前端讀取字串類型的 `process.env` 資料時出錯；可參考下一大段 gist 範例
    > Note that because the plugin does a direct text replacement, the value given to it must include actual quotes inside of the string itself. Typically, this is done either with either alternate quotes, such as '"production"', or by using JSON.stringify('production').
- 第 26~28 行：使用 `public/index.html` 作為 React App 的 template
- 第 30~33 行：使用 webpack 的 devServer
- 第 34~37 行：指定打包後的輸出路徑與檔案名稱
- 完成，已經可以直接在 React 元件中透過 `process.env` 讀取到 `.env` 中的內容了

### webpack.DefinePlugin 與 JSON.stringify

<script src="https://gist.github.com/tzynwang/e733716554303e8de9e8faa16a7be758.js"></script>

## 參考文件

- [Using environment variables in React](https://trekinbami.medium.com/using-environment-variables-in-react-6b0a99d83cf5)
- [Frontend Environment Variables – What, Why and How](https://dev.to/henriqueinonhe/frontend-environment-variables-what-why-and-how-1c1)
- [How to Use Environment Variables in VanillaJS](https://www.freecodecamp.org/news/how-to-use-environment-variables-in-vanillajs/)
- [Uncaught ReferenceError: process is not defined](https://stackoverflow.com/questions/30239060/uncaught-referenceerror-process-is-not-defined)
- [Why does Webpack's DefinePlugin require us to wrap everything in JSON.stringify?](https://stackoverflow.com/questions/39564802/why-does-webpacks-defineplugin-require-us-to-wrap-everything-in-json-stringify)
