---
layout: '@Components/pages/SinglePostLayout.astro'
title: 「Express response default statusCode」相關筆記
date: 2021-09-30 21:25:16
tag:
  - [HTTP]
  - [Express]
---

## 原始問題

專案為前後分離，而後端需通知前端某使用者「登入失敗」時：

1. 選擇使用預設的 status code，然後加上 status message 回覆前端
1. 將 status code 修改為 401，並加入 status message 後再回覆前端

上述兩種作法有什麼差異？

## 梳理

題目本身沒有針對「預設的 status code」以及前後端是否有額外使用框架做出限制，故首次回答本題時有做出以下假設：

1. 後端使用 Express 架設伺服器
1. 前端使用 axios 接收 response

## 筆記

### 關於後端 response 內容

- Express 的`res`物件是 Node.js `response`物件的延伸；而參考 Node.js 文件後可得知其預設的 status code 為`200`
  - (Express official docs) The `res` object is an enhanced version of Node’s own `response` object and **supports all built-in fields and methods**.
  - (Node.js official docs) If you don't bother setting it, the HTTP status code on a response will always be 200.

### axios 處理 response status

- 參考 axios 官方文件，其預設 2xx success 以外的 status code 都會回傳 Promise reject
  ```js
  // `validateStatus` defines whether to resolve or reject the promise for a given
  // HTTP response status code. If `validateStatus` returns `true` (or is set to `null`
  // or `undefined`), the promise will be resolved; otherwise, the promise will be
  // rejected.
  validateStatus: function (status) {
    return status >= 200 && status < 300; // default
  }
  ```
- 若將 axios 改寫為 async/await 並搭配 try catch 的話，2xx 以外的 server response 都會被 catch 捕捉

## 作答

根據以上筆記，回答題目中兩種作法的差異：

1. 使用預設的 status code 200 回覆前端時，前端需主動檢查 response 之 statusMessage，就算登入失敗也不會被 catch 捕捉
1. 將 response.statusCode 調整為 401 後，前端可直接在 catch 區塊處理登入失敗的邏輯，不需再檢查 statusMessage

## 參考文件

- [Express: Response](https://expressjs.com/en/api.html#res)
- [Node.js: response.statusCode](https://nodejs.org/api/http.html#http_response_statuscode)
- [Node.js: HTTP Status Code](https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/#http-status-code)
- [axios: Request Config](https://github.com/axios/axios#request-config)
