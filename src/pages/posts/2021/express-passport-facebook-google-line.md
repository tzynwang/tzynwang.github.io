---
layout: '@Components/SinglePostLayout.astro'
title: 「使用passport處理FB、Google第三方登入」相關筆記
date: 2021-06-30 12:59:56
tag:
  - [Express]
---

## 總結

使用 npm package `passport-facebook`、`passport-google-oauth20`與`passport-line`讓 Todo List 專案可以透過 FB、Google 或 LINE 帳號進行第三方登入

## 環境

```
passport: 0.4.1
passport-facebook: 3.0.0
passport-google-oauth20: 2.0.0
passport-line: 0.0.4
os: Windows_NT 10.0.18363 win32 x64
```

## 筆記

### 專案結構

僅列出與本次實作相關的資料夾與檔案：

```
config
  passport_FB.js
  passport_Google.js
  passport_LINE.js
models
  user.js
routes
  modules
    auth.js
app.js
```

### FB 流程

<script src="https://gist.github.com/tzynwang/7b5d441f8127653fac09bbebd9a9ac0f.js"></script>

![fb dashboard](/2021/express-passport-facebook-google-line/fb_dashboard.jpg)

clientID 與 clientSecret 都可在 FB 開發者後台取得

### Google 流程

<script src="https://gist.github.com/tzynwang/26b84e1bfaccf5dc353ad01b0d2cfd65.js"></script>

後台流程如下：

1. 進入 GCP 後選擇 APIs & Service，選擇 Credentials 並建立新的 Oath client ID

   ![Google step 1](/2021/express-passport-facebook-google-line/Google_step1.jpg)

2. 應用程式類型因應練習專案選擇 Web application

   ![Google step 2](/2021/express-passport-facebook-google-line/Google_step2.jpg)

3. 與 FB 較為不同，Authorized redirect URIs 為必填，練習情況下直接導回`localhost:3000/<auth/google/callback>`即可（前述`<>`內容與 endpoint 設定一致）

   [Google step 3](/2021/express-passport-facebook-google-line/Google_step3.jpg)

### LINE 流程

<script src="https://gist.github.com/tzynwang/21340bfe58134bb6e1cb6a07e9def494.js"></script>

官方說明文件：

- [Integrating LINE Login with your web app](https://developers.line.biz/en/docs/line-login/integrate-line-login/)
- [整合 LINE Login 與 web app](https://developers.line.biz/zh-hant/docs/line-login/integrate-line-login/)

官方申請入口：[LINE Developer: Products / LINE Login](https://developers.line.biz/en/services/line-login/)

後台流程如下：

1. 與 FB 以及 Google 較不同，LINE 搭配 passport 處理第三方登入會用到的是**Channel** ID 與**Channel** Secret，兩筆資料可在 Basic Settings 中複製

   ![LINE step 1](/2021/express-passport-facebook-google-line/LINE_dashboard1.jpg)
   ![LINE step 2](/2021/express-passport-facebook-google-line/LINE_dashboard2.jpg)

2. 切換到 LINE Login 分頁，設定 Callback URL

   ![LINE step 3](/2021/express-passport-facebook-google-line/LINE_dashboard3.jpg)

3. 其餘流程與 FB 以及 Google 登入的差異是，透過 LINE 向使用者要求授權時，不需要帶入`scope`資料（參考以下`auth.js`第 32 行，與 FB 以及 Google 的內容不同）

補充：

- LINE Login**不會**主動提供使用者的 Email 資訊，若須請求使用者的 Email，開發者要自行申請 Email address permission
- 參考：[Requesting permission to access the user's email address](https://developers.line.biz/en/docs/line-login/integrate-line-login/#applying-for-email-permission)

### auth.js 內容

<script src="https://gist.github.com/tzynwang/302a2a4b7098456bcd09f233093946a6.js"></script>

### app.js 設定

<script src="https://gist.github.com/tzynwang/e9758c91408f8062498e2ef7f3ea6207.js"></script>

記得`require`在 config 資料夾中設定好的`passport_FB`與`passport_Google`並呼叫之即可

## 關於 OAuth 2.0

> OAuth allows you (the User) to grant access to your private resources on one site (which is called the Service Provider), to another site (called Consumer). While OpenID is all about using a single identity to sign into many sites, OAuth is about **giving access to your stuff without sharing your identity at all** (or its secret parts).

Reference: [Eran Hammer-Lahav: Explaining OAuth](https://hueniversedotcom.wordpress.com/2007/09/05/explaining-oauth/)

### Authentication

- Authentication is about **proving you are the correct person** because you know things.
- Authentication means **confirming your own identity** (is the account and password correct?)
- （透過提供正確的帳號密碼組合）證明我是誰

### Authorization

- Authorization is **asking for permission** to do stuff.
- Authorization means **granting access** (is this user same as the one that just be authenticated?) to the system.
- [OAuth 2.0](https://oauth.net/2/): is the industry-standard protocol for **authorization**.
- 允許哪些 APP 來存取資料；以本次練習來說，就是「我同意此 Todo list 專案可以存取我在 FB 或是 Google 帳號中的部分資料」

## 參考文件

- [YouTube: Express (NodeJS) - Google oAuth 2.0 (passportJS)](https://youtu.be/o9e3ex-axzA)
- OAuth 2.0
  - [DigitalOcean: An Introduction to OAuth 2](https://www.digitalocean.com/community/tutorials/an-introduction-to-oauth-2)
  - [What is OAuth? Definition and How it Works](https://www.varonis.com/blog/what-is-oauth/)
