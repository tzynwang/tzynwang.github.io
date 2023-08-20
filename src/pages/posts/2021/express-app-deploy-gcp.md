---
layout: '@Components/pages/SinglePostLayout.astro'
title: 「部屬Express.js App至Google App Engine」相關筆記
date: 2021-06-25 14:06:51
tag:
  - [Express]
---

## 總結

- 同樣是在搭配使用 MongoDB 的情境下，整體流程比感覺比部屬至 Heroku 簡單許多
- 缺點：無法處理「對資料庫導入種子資料」的需求；雖然 App Engine 提供`runtime: custom`與`Dockerfile`來處理一定程度的客製化需求，但無法配合`docker-compose.yml`來安裝 mongoDB

## 環境

```
Google Cloud SDK: 346.0.0
os: Windows_NT 10.0.18363 win32 x64
```

## 部屬前設定

### app.js

```js
// 新增process.env.PORT，讓App可以讀取Google App Engine分配的埠號
const port = process.env.PORT || 5000;

// 追加以下內容
app.set('trust proxy', true);
```

- 關於`app.set('trust proxy', true)`
  - 參考官方文件內容：[HTTPS and forwarding proxies](https://cloud.google.com/appengine/docs/standard/nodejs/runtime#https_and_forwarding_proxies)
  - App Engine terminates HTTPS connections at the load balancer and forwards requests to your application. Some applications need to determine the original request IP and protocol. The user's IP address is available in the standard X-Forwarded-For header. Applications that require this information should configure their web framework to trust the proxy.
  - With Express.js, use the trust proxy setting: `app.set('trust proxy', true)`

### config/mongoose.js

```js
// 於config/mongoose.js中追加process.env.MONGODB_URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/login-passport'
mongoose.connect(MONGODB_URI, { ... })
```

### app.yaml

```yaml
runtime: nodejs12
env_variables:
  MONGODB_URI: 'mongodb+srv://<DB使用者帳號>:<DB密碼>@<MongoDB cluster名稱>.8glc1.mongodb.net/<MongoDB cluster名稱>?retryWrites=true&w=majority'
```

- `app.yaml`檔案位於專案的根目錄
- 參考官方文件：[Node.js Runtime Environment](https://cloud.google.com/appengine/docs/standard/nodejs/runtime)

### package.json

```js
"scripts": {
  "start": "node app.js"
},
"engines": {
  "node": "^12.0.0"
}
```

- Google App Engine 預設執行`node server.js`來啟動 App，可以透過 package.json 中的`start` scripts 修改執行內容（本次練習中改為`node app.js`）
- 參考[官方文件](https://cloud.google.com/appengine/docs/standard/nodejs/runtime#application_startup)：By default, the runtime starts your application by running `node server.js`. If you specify a start script in your `package.json` file, the runtime **runs the specified start script instead**.

## 部屬流程

1. 在 Google Cloud Platform 建立新專案
1. 安裝 Google Cloud SDK

- 官方說明文件：[https://cloud.google.com/sdk/docs/install](https://cloud.google.com/sdk/docs/install)
- Google Cloud SDK 需搭配 Python，安裝 SDK 時勾選 Install Bundled Python 選項即可，不須另外自行安裝 Python

1. 安裝完畢後，移動到要部屬到 Google App Engine 的專案的資料夾，在終端機輸入`gcloud init`
1. 完成布署前設定後，即可執行`gcloud app deploy`，部屬完畢後終端機會顯示 App URL（類似`https://<專案ID>.de.r.appspot.com/`），可直接開啟該 URL 瀏覽專案
1. 若 URL 打開後沒有載入任何內容，則進入 App Engine → 版本 → 診斷 → 記錄檔中查看錯誤訊息

   ![demo 1](/2021/express-app-deploy-gcp/gcp_AppEngine_Version.png)
   ![demo 2](/2021/express-app-deploy-gcp/gcp_log.png)

## 練習結果

- Login practice: [https://complete-verve-317814.de.r.appspot.com/](https://complete-verve-317814.de.r.appspot.com/)
- Movie list (Express.js): [https://academic-genius-317809.de.r.appspot.com/](https://academic-genius-317809.de.r.appspot.com/)

## 關於種子資料

- 原本以為可以僅靠`Dockerfile`來處理`npm run seed`，不過實際執行後得到錯誤訊息`MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017`
- 錯誤訊息的意義：環境中沒有安裝 MongoDB
  - [MongoError: connect ECONNREFUSED 127.0.0.1:27017](https://stackoverflow.com/questions/46523321/mongoerror-connect-econnrefused-127-0-0-127017): This happened probably because the **MongoDB service isn't started**.
- 然而 Google App Engine 並不支援`docker-compose`，故無法進行「安裝 MongoDB 後導入種子資料」此需求，參考討論串：
  - [docker-compose.yml in Google Cloud Run](https://stackoverflow.com/questions/63782456/docker-compose-yml-in-google-cloud-run)
  - [Google App Engine run command after deploy](https://stackoverflow.com/questions/63223193/google-app-engine-run-command-after-deploy)
  - [Using Docker compose within Google App Engine](https://stackoverflow.com/questions/39877521/using-docker-compose-within-google-app-engine)
