---
layout: '@Components/pages/SinglePostLayout.astro'
title: 2022 第13週 學習筆記：前端專案中的環境變數
date: 2022-04-03 21:40:30
tag:
  - [React]
  - [webpack]
---

## 總結

記錄一下 Node.js 中的 `process.env` 與環境變數的相關特性，以及在前端搭配 webpack5 的 React APP 專案中，環境變數是怎麼被讀入的

## 版本與環境

```
react: 17
dotenv: 10.0.0
webpack: 5.64.4
```

## 筆記

### Node.js 與環境變數

- `process`: The `process` object is a `global` that provides information about, and control over, the **current Node.js process**. As a global, it is always available to Node.js applications without using `require()`. 是一種物件，提供當下 Node.js 執行環境的資訊
- `process.env`: returns an `object` containing the user environment.
  - Assigning a property on `process.env` will implicitly **convert the value to a string**. 注意 `process.env` 只會回傳字串形式的資料（`"true"`, `"undefined"`, `"42"`）
  - On **Windows** operating systems, environment variables are **case-insensitive**. 在 Windows 的環境變數**不會區別大小寫**

### 前端專案中的環境變數

> 注意：以下筆記內容是建立在使用 `create-react-app` 建立專案，並執行 `npm run eject` 後整理出來的資訊

示範專案 repo：[https://github.com/tzynwang/react-process-env](https://github.com/tzynwang/react-process-env)

<script src="https://gist.github.com/tzynwang/1fe5e71d4c96f082c8ff189975eb0bf8.js"></script>

- `/react-app/config/path.js` 第 53, 55 行：預設為讀取位在專案根目錄的 `.env` 檔案

<script src="https://gist.github.com/tzynwang/f66834717bcbb9099a8b84f83eaa534a.js"></script>

- `/react-app/config/env.js` 第 33-41 行：讀取 `.env` 內容
  - `existsSync`: Returns `true` if the path exists, `false` otherwise. 檢驗該路徑是否存在
  - 這段程式碼的目的：檢驗 `.env` 是否存在，若存在，則 `require('dotenv')` 來協助讀取 `.env` 內容
  - dotenv 此 npm package 的目的：協助專案讀取 `.env` 內容，可參考[原始碼](https://github.com/motdotla/dotenv/blob/master/lib/main.js)
- 第 61 行：將 `.env` 檔案中變數名稱帶有 `REACT_APP_` 前綴的變數自動納入 63 行 `getClientEnvironment` 回傳的內容，如果不在變數加上 `REACT_APP_` 此前綴，就需要手動將變數一個一個加入 `getClientEnvironment` 中
  - 優點：加上 `REACT_APP_` 即可讓 webpack 在打包時幫忙自動處理相關的環境變數，不需透過手動加入
  - 缺點：透過自動處理的環境變數內容只會是 string 型別，在需要判定環境變數的 `true/false` 或使用 `PORT` 等做為 number 型態的資料時，需在使用時進行型別轉換，或進行手動判別（布林值）
- 第 92-95 行：這邊是手動追加的部分，代表追加 `PROJECT_AUTHOR`，`PROJECT_SINCE` 與 `PROJECT_RELEASE` 這三個項目，並針對 process.env 回傳的內容進行型別轉換

<script src="https://gist.github.com/tzynwang/467fdbbe0745557fc49317ec8ef13452.js"></script>

![process env](/2022/react-process-env/read-env-demo.png)

- 在 `/react-app/src/App.tsx` 中透過 `console.log(process.env)` 可以觀察到：如果是有 `REACT_APP_` 前綴的環境變數，全部都是 `string` 型別；而如果是透過手動追加的環境變數，因為已經先在 webpack 編譯的過程中將之還原回應有的（`boolean`、`number`）型別，故會以轉換過的型別出現

## 參考文件

- [Create React App: Adding Custom Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)
- [npm: dotenv](https://www.npmjs.com/package/dotenv)
- [Node.js: process.env](https://nodejs.org/dist/latest-v8.x/docs/api/process.html#process_process_env)
- [Node.js: How to read environment variables from Node.js](https://nodejs.dev/learn/how-to-read-environment-variables-from-nodejs)
- [How to access environment variables from the front-end](https://stackoverflow.com/questions/57663555/how-to-access-environment-variables-from-the-front-end)
