---
layout: '@Components/SinglePostLayout.astro'
title: 從零開始重寫：餐廳清單（Express版）基礎功能與架構
date: 2021-06-21 15:47:32
tag:
  - [Express]
  - [Express Handlebars]
  - [Mongoose]
---

## 總結

試著從頭開始重新練習一次 Express、Express handlebars 與 Mongoose 相關內容，本篇筆記主要記錄練習途中遭遇到的問題、解法與日後可能會回頭參考的相關內容

## 環境

```
express: 4.17.1
express-fileupload: 1.2.1
express-handlebars: 5.3.2
mongoose: 5.12.14
os: Windows_NT 10.0.18363 win32 x64
```

## app.js

<script src="https://gist.github.com/tzynwang/97709d3b1d83e3ff4505924a09d819f4.js"></script>

- 20-21 行：為了處理使用者上傳的餐廳圖片，使用套件`express-fileupload`（[npm](https://www.npmjs.com/package/express-fileupload)）
  - 參考[官方示範](https://github.com/richardgirges/express-fileupload/tree/master/example#basic-file-upload)，HTML 的 form 元素須加上`encType="multipart/form-data"`才能取到圖片資料
  - 注意：是透過`req.files`而非`req.body`來取使用者上傳的圖片資料
  - 取出`req.files.<input name>.mimetype`與`req.files.<input name>.data`來存入資料庫
- 26 行 helpers 部分：本次使用自定義的 helpers 來配合 Express handlebars，接觸過 Vue 的 computed 後比較能理解 helpers 的運作模式了
  - 注意呼叫自定義的 helpers**不需要加上#**，在模板中直接傳入 helpers 與參數即可，比如：
  - `<img src="{{toImage this.image.contentType this.image.data.buffer}}">`
  - `<option {{ifEquals this ../restaurant.category}}></option>`
- 39 行開始：對比之前的作業多半使用`.then()`進行串接，本次基本上都改用 await/async 語法糖來處理資料庫端相關的行為
  - `await Restaurant.find({ deleteFlag: false }).sort({ _id: -1 }).lean()`：取所有`deleteFlag`為`false`的內容，並根據`_id`逆向排列
- 48 行開始：本次實作出「根據使用者選取的欄位來限制搜尋範圍」之功能，`keyword`為使用者輸入的關鍵字、`field`為使用者指定要進行搜尋的欄位範圍
  - 52-53 行：無法在`mongoose.find()`直接使用 template literal，故改為「建立一個空物件，物件的鍵根據`field`決定，物件的值為`new RegExp(keyword, 'i')`」，並將該物件作為條件傳入`.find()`中
  - 57 行：偷懶行為，直接將`field`的中文對應名稱物件宣告在這邊，並傳入顯示搜尋結果的`index`模板
- 第 71 行：`await Restaurant.find().distinct('category').lean()`
  - 取出所有不重複的`category`的值
  - [Mongoose: Returning unique result set with no duplicate entries](https://stackoverflow.com/questions/30020946/mongoose-returning-unique-result-set-with-no-duplicate-entries): use `find` to establish the query and then chain a call to `distinct` on the resulting query object to get the unique result.
  - [Mongoose: Query.prototype.distinct()](https://mongoosejs.com/docs/api.html#query_Query-distinct): Declares or executes a `distinct()` operation.
  - [SQL SELECT DISTINCT Statement](https://www.w3schools.com/sql/sql_distinct.asp): The `SELECT DISTINCT` statement is used to **return only distinct (different) values**.
- 99-104 行：若使用者選擇自行上傳餐廳圖片（`if (req.files)`）的話，取圖片的`data`與`mimetype`存入 DB 中，若使用者沒有上傳圖片的話，則自動安排一張預設的餐廳圖片 url 給`image_url`欄位
- 第 152 行：使用`.findOne()`來取出`document`型態的資料，之後才可配合`.save()`將修改完的資料存回 DB 中
  - [Mongoose: Documents vs Models](https://mongoosejs.com/docs/documents.html#documents-vs-models): `Document` and `Model` are distinct classes in Mongoose. The `Model` class is a subclass of the `Document` class. When you use the `Model` constructor, you create a new `document`.
  - When you load documents from MongoDB using model functions like `findOne()`, you get a Mongoose `document` back.

## DB schema

<script src="https://gist.github.com/tzynwang/935464602cb71801e3b1c63acce9eb76.js"></script>

- image 欄位的內容參考[Saving image with mongoose](https://stackoverflow.com/questions/27353346/saving-image-with-mongoose)
- deleteFlag 預設為`false`（`default: false`），參考[Mongoose: Declaring Defaults in Your Schema](https://mongoosejs.com/docs/defaults.html)

## DB seeder

<script src="https://gist.github.com/tzynwang/7585b5fbe4fcdfa38aecfaf72276f832.js"></script>

- 2-3 行：讀取`.json`資料
- 第 15 行開始：改用 async/await 語法糖包裝`Restaurant.create()`
- 31 行：seeder 寫入完畢後，呼叫`db.close()`結束連線

## 模板部分

```
{{#if searchCheck}}
<script src="/scripts/searchCheck.js"></script>
{{/if}}
```

目前僅有`/`與`/search`路由回傳`searchCheck: true`，故`searchCheck.js`只會在這兩個頁面被載入

## 參考文件

- [Async/await in Nodejs + Mongoose](https://stackoverflow.com/questions/58189365/async-await-in-nodejs-mongoose)
- [How to display Base64 images in HTML?](https://stackoverflow.com/questions/8499633/how-to-display-base64-images-in-html)
