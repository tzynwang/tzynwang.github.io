---
title: 「Express response default statusCode」相關筆記
date: 2021-09-30 21:25:16
categories:
- [HTTP]
- [Express]
tags:
---

## 原始問題
專案為前後分離，而後端需通知前端某使用者「登入失敗」時：
  1. 選擇使用預設的status code，然後加上status message回覆前端
  1. 將status code修改為401，並加入status message後再回覆前端

上述兩種作法有什麼差異？


## 梳理
題目本身沒有針對「預設的status code」以及前後端是否有額外使用框架做出限制，故首次回答本題時有做出以下假設：
1. 後端使用Express架設伺服器
1. 前端使用axios接收response


## 筆記
### 關於後端response內容
- Express的`res`物件是Node.js `response`物件的延伸；而參考Node.js文件後可得知其預設的status code為`200`
  - (Express official docs) The `res` object is an enhanced version of Node’s own `response` object and **supports all built-in fields and methods**.
  - (Node.js official docs) If you don't bother setting it, the HTTP status code on a response will always be 200.

### axios處理response status
- 參考axios官方文件，其預設2xx success以外的status code都會回傳Promise reject
  ```JavaScript
  // `validateStatus` defines whether to resolve or reject the promise for a given
  // HTTP response status code. If `validateStatus` returns `true` (or is set to `null`
  // or `undefined`), the promise will be resolved; otherwise, the promise will be
  // rejected.
  validateStatus: function (status) {
    return status >= 200 && status < 300; // default
  }
  ```
- 若將axios改寫為async/await並搭配try catch的話，2xx以外的server response都會被catch捕捉


## 作答
根據以上筆記，回答題目中兩種作法的差異：
1. 使用預設的status code 200回覆前端時，前端需主動檢查response之statusMessage，就算登入失敗也不會被catch捕捉
1. 將response.statusCode調整為401後，前端可直接在catch區塊處理登入失敗的邏輯，不需再檢查statusMessage


## 參考文件
- [Express: Response](https://expressjs.com/en/api.html#res)
- [Node.js: response.statusCode](https://nodejs.org/api/http.html#http_response_statuscode)
- [Node.js: HTTP Status Code](https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/#http-status-code)
- [axios: Request Config](https://github.com/axios/axios#request-config)