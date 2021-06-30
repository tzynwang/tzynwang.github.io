---
title: 「使用passport處理FB、Google第三方登入」相關筆記
date: 2021-06-30 12:59:56
categories:
- Express
tags:
---

## 總結
使用npm package `passport-facebook`與`passport-google-oauth20`讓Todo List專案可以透過FB或Google帳號進行第三方登入


## 環境
```
passport: 0.4.1
passport-facebook: 3.0.0
passport-google-oauth20: 2.0.0
os: Windows_NT 10.0.18363 win32 x64
```

## 筆記
### 專案結構
僅列出與本次實作相關的資料夾與檔案：
```
config
  passport_FB.js
  passport_Google.js
models
  user.js
routes
  modules
    auth.js
app.js
```

### FB第三方登入流程
<script src="https://gist.github.com/tzynwang/7b5d441f8127653fac09bbebd9a9ac0f.js"></script>

{% figure figure--center 2021/express-passport-facebook-google/fb_dashboard.jpg "''" %}
clientID與clientSecret都可在FB開發者後台取得

### Google第三方登入流程
<script src="https://gist.github.com/tzynwang/26b84e1bfaccf5dc353ad01b0d2cfd65.js"></script>

後台流程如下：
1. 進入GCP後選擇APIs & Service，選擇Credentials並建立新的Oath client ID
  {% figure figure--center 2021/express-passport-facebook-google/Google_step1.jpg "''" %}
1. 應用程式類型因應練習專案選擇Web application
  {% figure figure--center 2021/express-passport-facebook-google/Google_step2.jpg "''" %}
1. 與FB較為不同，Authorized redirect URIs為必填，練習情況下直接導回`localhost:3000/<auth/google/callback>`即可（前述`<>`內容與endpoint設定一致）
  {% figure figure--center 2021/express-passport-facebook-google/Google_step3.jpg "''" %}

### auth.js內容
<script src="https://gist.github.com/tzynwang/302a2a4b7098456bcd09f233093946a6.js"></script>


### app.js設定
<script src="https://gist.github.com/tzynwang/e9758c91408f8062498e2ef7f3ea6207.js"></script>

記得`require`在config資料夾中設定好的`passport_FB`與`passport_Google`並呼叫之即可

## 關於OAuth 2.0
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
  - 允許哪些APP來存取資料；以本次練習來說，就是「我同意此Todo list專案可以存取我在FB或是Google帳號中的部分資料」




## 參考文件
- [YouTube: Express (NodeJS) - Google oAuth 2.0 (passportJS)](https://youtu.be/o9e3ex-axzA)
- OAuth 2.0
  - [DigitalOcean: An Introduction to OAuth 2](https://www.digitalocean.com/community/tutorials/an-introduction-to-oauth-2)
  - [What is OAuth? Definition and How it Works](https://www.varonis.com/blog/what-is-oauth/)