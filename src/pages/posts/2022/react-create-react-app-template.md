---
layout: '@Components/SinglePostLayout.astro'
title: 「create-react-app template」實作筆記
date: 2022-02-05 19:18:59
tag:
  - [React]
  - [webpack]
---

## 總結

寫了一個 create-react-app template `choffee`（[npm 連結](https://www.npmjs.com/package/cra-template-choffee)），目前實作了以下個人每次建立新 react app 時都會用到的功能與設定：

1. 使用 typescript
1. 於 react app 的進入點 `index.tsx` 預設使用 `Error Boundary` 包覆 `App`，開發時若出錯會直接將錯誤訊息吐到瀏覽器畫面中
1. 較友善的元件 import 路徑（移植自 [2022 第 4 週 實作筆記：React App 與 webpack](https://tzynwang.github.io/2022/react-webpack-config/)）
1. 較短的 webpack 終端訊息，並將 dev server 運行的 IP 置頂，藍字為專案名稱
   （理想是讓自訂訊息在 webpack 輸出 infrastructureLog 之後才出現，但目前還未找到實作方法）
   ![terminal log from template choffee](/2022/react-create-react-app-template/choffee.png)
   ![terminal log from default create-react-app](/2022/react-create-react-app-template/cra-default.png)

1. 設定好 git remote 後即可透過 `npm run deploy` 將 react app 部署上 GitHub Page

## 版本與環境

```
create-react-app: 5.0.0
webpack: 5.67.0
```

## 踩坑記錄

### npm run eject

問題：如何修改（覆蓋） create-react-app 預設的 webpack 設定？
解決方式：執行 `npm run eject` ，template 內會出現 `config` 與 `scripts` 這兩個資料夾，`webpack.config.js` 與 `webpackDevServer.config.js` 位在 `config` 資料夾中

> If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will **remove the single build dependency from your project**. Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc.) into your project as dependencies in `package.json`.

### tsconfig extends

問題：在 `template` 資料夾中設定好 `tsconfig.json` 的 `paths` 參數，使用 `template` 建立 react app 後卻發現 `tsconfig.json` 中的 `paths` 參數並沒有被帶進來
解決方式：將 `paths` 寫在另外一個 `tsconfig.path.json` 中，於 `tsconfig.json` 裡面透過 `extends` 來引用 `tsconfig.path.json` 內的 `paths` 設定

<script src="https://gist.github.com/tzynwang/6bb8ee9d276dfc8202536d24b069a88b.js"></script>

參考：[create-react-app #8909 Using the tsconfig file to configure the alias does not take effect](https://github.com/facebook/create-react-app/issues/8909)

### 自訂 webpack 終端訊息

清除的方法參考自 [clean-terminal-webpack-plugin](https://www.npmjs.com/package/clean-terminal-webpack-plugin)，在 webpack 的 `compiler.hooks.beforeCompile` 與 `compiler.hooks.afterCompile` 清除了終端的訊息，並在 `compiler.hooks.done` 階段輸出 dev server 的 IP

### 一鍵部署至 GitHub Page

修改了 `webpack.config.js` 中 `output` 的 `publicPath` 路徑，從 cra 預設的 `path.publicUrlOrPath` 改為 `./`；在處理這段時是直接先 `npm run build` 後檢查 build 出來的資料夾內容，使用 vs code Live Server 確認在本幾可以正常瀏覽 bundle 檔案後，再加上 `gh-pages -d build` 等 scripts

設定好 react app 專案的 git remote 後即可執行 `npm run deploy` 將專案部署為該 repo 的 GitHub Page

## 參考文件

- [Create React App: Custom Templates](https://create-react-app.dev/docs/custom-templates)
- [Create React App: npm run eject](https://create-react-app.dev/docs/available-scripts/#npm-run-eject)
- [where is create-react-app webpack config and files?](https://stackoverflow.com/questions/48395804/where-is-create-react-app-webpack-config-and-files)
- [webpack #12091 Support customizing infrastructure logging](https://github.com/webpack/webpack/issues/12091)
