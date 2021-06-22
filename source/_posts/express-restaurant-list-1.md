---
title: 從零開始重寫：餐廳清單（Express版）路由、METHODS重構
date: 2021-06-22 14:06:28
categories:
- [Express]
- [HTML]
tags:
---

## 總結
本篇為餐廳清單（Express版）的路由、METHODS重構，以及使用`browserify`搭配`axios`實現in-browser `require()`之相關筆記


## 環境
```
browserify: 17.0.0
os: Windows_NT 10.0.18363 win32 x64
```

## 筆記

{% figure figure--center 2021/express-restaurant-list-1/folderStructure.png "'重構後的資料夾結構'" %}

### 路由重構

<script src="https://gist.github.com/tzynwang/708c0d129d912f54e8043e62cb9e751a.js"></script>

#### app.js
- 第6行：將DB連線設定搬移到config資料夾中
- 13-15行：為配合axios的POST request，將`body-parser`加回來
- 37-38行：將路由移動到routes資料夾中

#### routes/index.js
- 4-5行：routes/modules中的home.js與restaurants.js皆分別在檔案結尾進行`module.exports = router`，讓index.js可引用之
- 7-8行：分別將對`/`與`/restaurant`的請求導向`home`與`restaurant`
- 第10行：將index.js本身也進行匯出，使app.js可使用之（app.js中第37行）

### METHODS重構
- 參考app.js第33-34行，引用`method-override`後，使用override using a query value的方式複寫METHOD
  [官方說明](http://expressjs.com/en/resources/middleware/method-override.html)：
  > To use a query string value to override the method, specify the query string key as a string argument to the methodOverride function. To then make the call, send a **POST request** to a URL with the overridden method as the value of that query string key. This method of using a query value would typically be used in conjunction with plain HTML `<form>` elements when trying to support legacy browsers but still use newer methods.
  
  官方示範程式碼：
  ```JavaScript
  const express = require('express')
  const methodOverride = require('method-override')
  const app = express()

  // override with POST having ?_method=DELETE
  app.use(methodOverride('_method'))
  ```
  ```HTML
  <form method="POST" action="/resource?_method=DELETE">
    <button type="submit">Delete resource</button>
  </form>
  ```
- 將form action設定完畢後，原本的POST request就會（根據query string value）被覆寫為DELETE與PUT等METHOD
- 之後即可在後端使用`router.delete`或`router.put`等方式處理相關請求

### browserify流程記錄
1. 安裝browserify與axios
1. 在public/scripts資料夾中建立一檔案sort.js，內容如下

<script src="https://gist.github.com/tzynwang/f034770c2ca9f0cc16edc449f44a1f94.js"></script>


1. 在沒有搭配browserify的情況下，直接引用sort.js檔案會在瀏覽器console看到`ReferenceError: require is not defined`此錯誤訊息，相關討論參考：[Client on Node.js: Uncaught ReferenceError: require is not defined](https://stackoverflow.com/questions/19059580/client-on-node-js-uncaught-referenceerror-require-is-not-defined)
1. 參考browserify的[GitHub README](https://github.com/browserify/browserify#example)，在終端輸入`browserify public/scripts/sort.js > public/scripts/sortBundle.js`將sort.js與axios等額外require的模組bundle在一起
1. 最終在前端網頁引用`sortBundle.js`此檔案，錯誤訊息消失，問題解決


## 補充
### Method: PATCH, PUT
- A `PATCH` request is considered a set of **instructions on how to modify a resource**. Contrast this with `PUT`; which is a complete **representation of a resource**.
- A `PATCH` is **not necessarily idempotent**, although it can be. Contrast this with `PUT`; which is **always idempotent**. The word "idempotent" means that any number of repeated, identical requests will leave the resource in the same state. (不像`POST` request如果連續發送可能會變成多筆訂單，多次發送`PUT` request不會有類似的後遺症)
- Calling `PUT` method **once or several times successively has the same effect** (that is no side effect), this method is **idempotent**; whereas successive identical `POST` requests may have additional effects, akin to placing an order several times.

### Idempotent
- Description of common **idempotent methods**: GET, HEAD, PUT, DELETE, OPTIONS, TRACE
- Description of common **non-idempotent** methods: POST,PATCH, CONNECT
  - Reference: https://developer.mozilla.org/en-US/docs/Glossary/Idempotent
- A request method is considered "idempotent" if the intended effect on the server of multiple identical requests with that method is the same as the effect for a single such request. (對server打一次或多次的結果如果都一樣，該HTTP method就會被認為是idempotent) Of the request methods defined by this specification, PUT, DELETE, and safe request methods (GET, HEAD, OPTIONS) are idempotent.
  - Reference: https://datatracker.ietf.org/doc/html/rfc7231#section-4.2.2


## 參考文件
- [Node-style require for in-browser javascript?](https://stackoverflow.com/questions/6971583/node-style-require-for-in-browser-javascript/11588570)
- [GitHub: browserify](https://github.com/browserify/browserify#browserify)
- MDN
  - [PATCH](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PATCH)
  - [PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PUT)