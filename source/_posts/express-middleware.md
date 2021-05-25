---
title: Alpha Camp「2-3 middleware實作練習」技術記錄
date: 2021-05-23 12:53:23
categories:
- [Express]
- [JavaScript]
tags:
---

## 總結
在本作業中實作的相關功能：
- 透過Express middleware偵測發送給`localhost:3000`的請求
- 將每一筆對`localhost:3000`的請求（request）時間、方法、路由與回應時間輸出到終端上；形式如：`2021-05-23 13:00:20 | GET from / | total time: 117ms`
- 將以上記錄寫入純文字檔案中，並使用者可下載此份檔案
- 專案GitHub：[tzynwang/ac_assignment_2-3_middleware](https://github.com/tzynwang/ac_assignment_2-3_middleware#readme)

{% figure figure--center 2021/express-middleware/assignment-screenshot.png "'操作畫面截圖'" %}

## 環境
```
node: 12.20.2
express: 4.17.1
express-handlebars: 5.3.2
os: Windows_NT 10.0.18363 win32 x64
```

## 筆記
### 專案結構
```text
├─ requestLogs
|   └─ requestLogs.txt
├─ scripts
|   ├─ logRequest.js
|   └─ saveToFile.js
├─ views
|   ├─ layouts
|   |  └─ main.handlebars
|   └─ index.handlebars
└─ app.js
```

- `requestLogs/requestLogs.txt`：記錄每一次請求的文字檔案
- `scripts/logRequest.js`：記錄每一次請求的日期、時間、方法與路由，除了輸出到終端外，也會呼叫`saveToFile()`來將以上內容寫入檔案中
- `scripts/saveToFile.js`：負責寫入檔案的動作
- `views`資料夾：提供瀏覽器介面來讓使用者與此app互動
- `app.js`：載入middleware，並根據路由給予不同的回應

### app.js內容
<script src="https://gist.github.com/tzynwang/427b059b4444ac99377d9fda7afe0ed3.js"></script>

第11行：Application-level middleware（app層級的middleware）
  - The function is executed every time the app receives a request (when middleware isn't mounted with any path).
  - 出處：[Express official document: Application-level middleware](http://expressjs.com/en/guide/using-middleware.html#middleware.application)
  - 宣告`app.use(logRequest)`讓所有的請求都會經過該middleware

第47-54行：下載功能（`app.post('/download', () => {...})`）
  - 48行：指定欲下載的檔案的路徑
  - 49行：取得當下時間
  - 50行：透過`.toISOString()`將Date物件轉換為字串，再使用`.slice(0, 10)`取出日期部分
  - 51行：使用`.toLocaleTimeString()`來取timeStart的時間部分，因為想要取24小時制的時間，故`option`部分加上`hour12: false`指定輸出24小時制的時間；參考[MDN: Date.prototype.toLocaleTimeString() -- Using options](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString#using_options)；最後搭配`.split(':').join('')`將時間字串從`HH:MM:SS`的格式轉為`HHMMSS`
  - 52行：宣告檔案名稱格式
  - 53行：`res.download()` 第一個變數為檔案路徑，第二個變數為檔案名稱；可參考[Express official document: res.download()](http://expressjs.com/en/api.html#res.download)

### scripts/logRequest.js內容
<script src="https://gist.github.com/tzynwang/84d5282f68abfd5e60aa36d94fbe84b7.js"></script>

第13行：`res.locals.logs = {...}`
  - 路由只接受`res`或`req`這兩種參數，無法透過middleware的`next()`來傳遞變數
  - 將變數賦予`res.locals`後，即可在每一個路由中透過`res.locals`取出需要的值；相關概念的說明可參考以下影片（9:25開始相關段落）
  <iframe width="560" height="315" src="https://www.youtube.com/embed/lY6icfhap2o?start=565" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

第14行：`res.on('finish')`或`res.on('close')`
  - [Event finish](https://nodejs.org/api/http.html#http_event_finish): Emitted **when the response has been sent**. More specifically, this event is emitted when the last segment of the response headers and body have been handed off to the operating system for transmission over the network. **It does not imply that the client has received anything yet.** 送出回應後即觸發，不考慮客戶端是否真的有收到回應
  - [Event close](https://nodejs.org/api/http.html#http_event_close_1): Indicates that the **response is completed**, or its underlying connection was terminated prematurely (before the response completion).
  - 如果只是為計算「伺服器收到請求到發出回應」的時間的話，使用`res.on('finish')`即可

### scripts/saveToFile.js內容
<script src="https://gist.github.com/tzynwang/15a3ac5e5ff573117c8a8070109adc54.js"></script>

- 第4行：`fs.appendFile()`使用方式可參考：[Node.js: fs.appendFile(path, data[, options], callback)](https://nodejs.org/docs/latest-v12.x/api/fs.html#fs_fs_appendfile_path_data_options_callback)

## 參考文件
- Express official document: 
  - [res.download()](http://expressjs.com/en/api.html#res.download)
  - [res.locals](http://expressjs.com/en/api.html#res.locals)
- StackOverFlow:
  - [Download a file from NodeJS Server using Express](https://stackoverflow.com/questions/7288814/download-a-file-from-nodejs-server-using-express)
  - [What events should I handle in express response (stream) object to handle when the response finishes?](https://stackoverflow.com/questions/38273555/what-events-should-i-handle-in-express-response-stream-object-to-handle-when-t)
  - [Can I send data via express next() function?](https://stackoverflow.com/questions/19793723/can-i-send-data-via-express-next-function)
  - [What tool to use to draw file tree diagram](https://stackoverflow.com/questions/347551/what-tool-to-use-to-draw-file-tree-diagram)：Windows系統直接在終端輸入tree就可以產生資料夾的樹狀結構資料了，不用安裝其他工具