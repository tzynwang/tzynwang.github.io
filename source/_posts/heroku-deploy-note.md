---
title: TODO：「部屬Express.js App至Heroku」
date: 2021-06-23 15:48:43
categories:
- Heroku
tags:
---

## 總結
重跑三次流程後依舊未解之兩個問題：
- 確定Heroku的Config Vars沒有錯誤，但首次部屬後一定得修改MongoDB Atlas的連線密碼，才能讓Heroku app正常連線至DB
  - 錯誤訊息內容：`MongoError: Authentication failed.`；Google未果，大多建議檢查密碼是否錯誤（與個人情境不符）
- 不確定Heroku是否有讀取到Procfile設定，修正DB連線問題後檢查DB內容永遠是空的，需手動於終端機執行`heroku -app <app名稱> run npm run seed`才會建立種子資料
  - Procfile內容如下
  ```
  web: node models/seeds/categorySeeder.js && node models/seeds/recordSeeder.js
  web: node app.js
  ```


## 環境
```
heroku: 7.53.0 win32-x64 node-v12.21.0
os: Windows_NT 10.0.18363 win32 x64
```


## 筆記
- MongoDB Atlas DB登入帳戶名稱在建立DB後不可修改，密碼可以
- MongoDB Atlas提供的URI需自行修正部分內容（密碼與cluster名稱）：
  - `mongodb+srv://<使用者帳戶名稱>:<密碼>@[這段會由MongoDB帶入，不需修正].mongodb.net/<DB名稱>?retryWrites=true&w=majority`
  - `<>`需移除
  - 測試MongoDB Atlas提供的密碼產生器，密碼或許只支援大小寫英數混合，不支援符號
- 若專案資料夾根目錄中未包含Procfile的話，Heroku會執行`package.json`中的`start` scripts來啟動app
  > To determine how to start your app, Heroku first looks for a Procfile. If no Procfile exists for a Node.js app, we will attempt to start a default web process via the start script in your package.json. Reference: https://devcenter.heroku.com/articles/deploying-nodejs#specifying-a-start-script
- 在Heroku建立新app後，需在專案資料夾中追加Heroku的remote branch
  - 指令：`git remote add heroku [heroku_git_url]`
  - 追加後才可正常進行push：`git push heroku main`
  - `heroku`可替換成任意branch名稱
  - `main`須根據當下本機的branch名稱決定（也可能是`master`）
- 執行`heroku logs`須加上`-app <app名稱>`來調閱該app的log資料


## 參考文件
- [Heroku Node.js Support: Customizing the build process](https://devcenter.heroku.com/articles/nodejs-support#customizing-the-build-process)