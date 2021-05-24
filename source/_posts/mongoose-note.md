---
title: Alpha Camp「2-3 老爸的私房錢（簡易記帳APP）」技術記錄
date: 2021-05-24 13:38:45
categories:
- JavaScript
tags:
---

## 總結
以下是本次作業處理到的主要問題：
- 透過一行腳本在多個資料庫個別產生種子資料
- 透過mongoose在mongoDB中join兩組collections之間的資料
- 使用axios進行ajax請求，根據使用者選擇的組別顯示相對應的帳目資料（例：選擇「休閒娛樂」的帳目資料，則畫面僅會顯示該類別的帳目，並消費總金額會同步更新）

## 環境
```
node: 12.20.2
express: 4.17.1
express-handlebars: 5.3.2
mongoose: 5.12.9
os: Windows_NT 10.0.18363 win32 x64
```

## 筆記
### 專案結構
{% figure figure--center 2021/mongoose-note/structure.png "'本次專案的完整結構圖'" %}

### 透過一行腳本在多個資料庫個別產生種子資料
`npm run`腳本如右：`"seed": "node models/seeds/categorySeeder.js && node models/seeds/recordSeeder.js"`
兩份種子腳本的原始碼如下：
<script src="https://gist.github.com/tzynwang/1ff4db97c6defc36b0a2517f13066353.js"></script>

<script src="https://gist.github.com/tzynwang/24a97dfb59507d16988598e5766380ec.js"></script>

- `node models/seeds/categorySeeder.js`執行完畢後，需確保腳本停止，方可開始執行`node models/seeds/recordSeeder.js`
- 在`categorySeeder.js`中，待`Categories.create()`完成後，串接`.then()`來停止db連線
- `categorySeeder.js`結束後，開始執行`recordSeeder.js`
- 根據MDN的[`forEach()` polyfill](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach#polyfill)，`forEach()`並沒有await callback function的機制，故改使用`for...of`來進行迴圈；相關參考文件如下：
  - [為什麽 array.foreach 不支持 async/await](https://www.itread01.com/content/1553973607.html)
  - [Why does async/await in a .forEach not actually await?](https://www.coreycleary.me/why-does-async-await-in-a-foreach-not-actually-await)
  - [Using async/await with a forEach loop](https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop)
- 待`for...of`執行完畢後，再關閉db連線，結束`recordSeeder.js`

### 對mongoDB進行類似SQL資料庫的join指令
<script src="https://gist.github.com/tzynwang/623afbb2e2537e196f5c08897f674a94.js"></script>

- 第49行的`results`，在前端透過axios接收後進行`console.log(response.data)`的內容如下：
  ```JSON
  {
      "_id": "60a3a3f66d1cf025c09c5714",
      "name": "早餐",
      "category": "餐飲食品",
      "date": "2021-05-18",
      "amount": 80,
      "__v": 0,
      "iconPair": [
          {
              "_id": "60a3a865b6ccf51988c7cf9b",
              "name": "餐飲食品",
              "icon": "<i class=\"bi bi-cup-straw\"></i>",
              "__v": 0
          }
      ]
  }
  {
      "_id": "60a3a3f66d1cf025c09c5715",
      "name": "午餐",
      "category": "餐飲食品",
      "date": "2021-05-18",
      "amount": 120,
      "__v": 0,
      "iconPair": [
          {
              "_id": "60a3a865b6ccf51988c7cf9b",
              "name": "餐飲食品",
              "icon": "<i class=\"bi bi-cup-straw\"></i>",
              "__v": 0
          }
      ]
  }
  {
      "_id": "60a3a3f66d1cf025c09c5716",
      "name": "晚餐",
      "category": "餐飲食品",
      "date": "2021-05-18",
      "amount": 100,
      "__v": 0,
      "iconPair": [
          {
              "_id": "60a3a865b6ccf51988c7cf9b",
              "name": "餐飲食品",
              "icon": "<i class=\"bi bi-cup-straw\"></i>",
              "__v": 0
          }
      ]
  }
  ```
  使用`$lookup`關聯出的結果可透過鍵值`iconPair`取得
- 相關參考文件：
  - [How to join two collections in mongoose](https://stackoverflow.com/questions/36805784/how-to-join-two-collections-in-mongoose)
  - [$lookup (aggregation)](https://docs.mongodb.com/manual/reference/operator/aggregation/lookup/)
  - [$sum (aggregation)](https://docs.mongodb.com/manual/reference/operator/aggregation/sum/)：`$sum`可搭配`aggregation`來直接回傳某欄位的總計值，本次未使用

### 使用axios進行ajax請求
{% figure figure--center 2021/mongoose-note/demo.gif "'使用ajax來請求特定帳目群組的資料'" %}

<script src="https://gist.github.com/tzynwang/5bcb2c3c5e5868bad34b8549277e4878.js"></script>

- 若使用axios進行POST request的話，需搭配`body-parser`，並加上`app.use(bodyParser.json())`，否則無法取得POST request送出的資料
  ```JavaScript
  // app.js中需加入以下兩組middleware
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({extended: true}))
  ```
- 參考文件如下：
  - [Axios post request.body is empty object](https://stackoverflow.com/questions/40859299/axios-post-request-body-is-empty-object)
  - [Axios posting empty request](https://stackoverflow.com/questions/51143730/axios-posting-empty-request)
  - [Can't receive data from axios on API](https://stackoverflow.com/questions/55593431/cant-receive-data-from-axios-on-api)
