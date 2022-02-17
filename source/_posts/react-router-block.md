---
title: 2022 第6週 實作筆記：在離開路由前顯示確認視窗
date: 2022-02-16 18:30:04
categories:
  - [React]
  - [webpack]
tags:
---

## 總結

本篇筆記記錄如何使用 react-router-dom (v5) 的 `useHistory()` 與 Web API `beforeunload` event 在以下時間點跳出確認訊息：

- 使用者點擊重新整理（`beforeunload`）
- 使用者關閉分頁（`beforeunload`）
- 使用者按下「上（下）一頁」準備離開當下畫面（`history.block()`）

{% figure figure--center 2022/react-router-block/react-router-block-demo.gif %}

原始碼：https://github.com/tzynwang/react-router-block/tree/version/2

## 版本

```
react-router-dom: 5.3.0
webpack: 5.69.0
```

## 筆記

### useBlock

<script src="https://gist.github.com/tzynwang/64078bcedb90e4b1e17479d45bbca97d.js"></script>

- `beforeunload` 能偵測的是「重新整理」與「關閉分頁」這兩種行為，而使用者點擊「上（下）一頁」會由 `useHistory()` 產生的 `history` instance 來阻擋
- 從 args 傳入 `block` 參數，讓 useBlock 可以在特定條件下解除阻擋行為（例：使用者已經填完表單所有內容）
- 第 25-31 行：當引用 useBlock 的元件掛載至畫面上時，將 `history.block()` 回傳的 instance 保存到變數 `BLOCK` 中，並在引用 useBlock 的元件從畫面上卸載時，執行 `BLOCK`
- 第 26 行：使用 `window.confirm` 彈出瀏覽器原生的對話框，詢問使用者是否離開網頁，選擇不離開（`!leave`）則回傳 `false` 取消離開的行為
- 參考 `@types/history` 可得知 `history.block()` 與其 args 的 type 分別如下列：

  ```ts
  export interface History<HistoryLocationState = LocationState> {
    block(
      prompt?: boolean | string | TransitionPromptHook<HistoryLocationState>
    ): UnregisterCallback
  }

  export type TransitionPromptHook<S = LocationState> = (
    location: Location<S>,
    action: Action
  ) => string | false | void
  ```

  為了讓 type check 不會報錯，在使用者確認離開畫面時，讓傳入 `history.block()` 的匿名函式回傳 `undefined` 而非 `true`（第 30 行）

### 無條件阻擋：About 元件

<script src="https://gist.github.com/tzynwang/fe1c004da511941c3e1cb83723c98f93.js"></script>

直接在元件中呼叫 `useBlock()`，並傳入空物件（不需解除條件）

### 有條件阻擋：Form 元件

<script src="https://gist.github.com/tzynwang/d31470f3de89cf5ac39e4b3f1dbf2eda.js"></script>

傳入 `useState` 變數 `block`，在使用者按下送出表單的按鈕時，將 `block` 設定為 `false`，並在畫面重新整理（元件重新掛載到畫面上後），重設 `block` 為 `true` 避免 F5 後阻擋失效

### webpack devServer 設定

- 在後端 server 沒有配合的情況下，使用 `BrowserRouter` 來處理路由會導致畫面重新整理、或是使用者直接輸入路由時遭遇 404
- 如果在開發時使用 webpack devServer 來執行 react APP，則設定 `webpack.config.js` 的 `devServer` 其 `historyApiFallback: true` 即可使用 `BrowserRouter`
  ```js
  devServer: {
    historyApiFallback: true
  }
  ```
- 若 react APP 是部署到 GitHub Pages（或任何無法配合 history mode 的 server）則需使用 `react-router-dom` 的 `HashRouter` 來處理路由，而路由會帶上井字號

## 參考文件

- [react-router v5: history](https://v5.reactrouter.com/web/api/history)
- [MDN: beforeunload event](https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event)
- [React Router v5.2 - Blocking route change with createBrowserHistory and history.block](https://stackoverflow.com/questions/65526447/react-router-v5-2-blocking-route-change-with-createbrowserhistory-and-history)
- [React-router urls don't work when refreshing or writing manually](https://stackoverflow.com/questions/27928372/react-router-urls-dont-work-when-refreshing-or-writing-manually)
