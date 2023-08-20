---
layout: '@Components/SinglePostLayout.astro'
title: 「使用passport middleware實作登入系統」相關筆記
date: 2021-06-24 13:41:18
tag:
  - [Express]
---

## 總結

本次練習包含以下幾個主要功能：

- 使用[passport](https://www.npmjs.com/package/passport)來驗證使用者輸入的登入資訊（帳號、密碼）是否有效
  - 並`passport.authenticate()`會接手處理驗證成功／失敗的 redirect endpoint
  - 搭配`req.isAuthenticated()`設計 middleware 來控制登入前後可視之畫面（例：登入前不可查看/dashboard 頁面、登入後無法查看/user/login 頁面）
- 使用[connect-flash](https://www.npmjs.com/package/connect-flash)搭配 express-handlebars 的 partial 來實現`res.redirect()`後顯示錯誤訊息的功能

## 環境

```
passport: 0.4.1
passport-local: 1.0.0
express: 4.17.1
express-session: 1.17.2
connect-flash: 0.1.1
os: Windows_NT 10.0.18363 win32 x64
```

## 筆記

### app.js

<script src="https://gist.github.com/tzynwang/afaa354b51d99a02994f11bf0d11b993.js"></script>

- 13 行開始：參考[passport 的官方示範](https://www.npmjs.com/package/passport#middleware)，將`resave`與`saveUninitialized`兩個參數都設定為`true`
  - 根據[express-session 的官方文件](https://www.npmjs.com/package/express-session)：
  - `resave`: Forces the session to be saved back to the session store, even if the session was never modified during the request.
  - `saveUninitialized`: Forces a session that is "uninitialized" to be saved to the store. A session is uninitialized when it is new but not modified.
- 21 行開始
  - `res.locals.successMessage = req.flash('successMessage')`: Every view will have access to any error or success messages that you flash.
    Ref.: [How to send flash messages in Express 4.0?](https://stackoverflow.com/questions/23160743/how-to-send-flash-messages-in-express-4-0)
  - `res.locals`: An object that contains response **local variables scoped to the request**, and therefore **available only to the view(s) rendered** during that request / response cycle (if any). Otherwise, this property is identical to `app.locals`.
    Ref.: [Express: res.locals](http://expressjs.com/en/api.html#res.locals)
  - 須注意`req.flash('error')`此名稱為 passport 專用，將 error 修改為其他名稱後，passport `done()`的錯誤訊息就無法顯示

### config/passport.js

<script src="https://gist.github.com/tzynwang/cc3b3e679e73660fff218cbbe3897fa5.js"></script>

- 說明：`function loginVerify(passport)`匯出後由`app.js` require 後使用，參考`app.js`原始碼 33-34 行
- 第 6 行的`{ usernameField: 'email' }`
  - By default, LocalStrategy expects to find credentials in parameters named `username` and `password`. If your site prefers to name these fields differently, options are available to change the defaults.
  - 登入表單中的 username 與 password name 欄位若不是`name="username"`與`name="password"`的話，可額外指定要讀取的表格欄位，`{ usernameField: 'email' }`的意思即是使用登入表單中的`name="email"`欄位作為`usernameField`
- 第 9 行的`{ message: 'User not exist' }`：其中`'User not exist'`會由`req.flash('error')`顯示
- `done(null, user)`與`done(null, false)`
  - `done(null, user)`: If the credentials are valid, the verify callback invokes `done()` to **supply Passport with the user that authenticated**.
  - `done(null, false)`: If the credentials are not valid, `done()` should be **invoked with false instead of a user** to indicate an authentication failure.
- `serializeUser`與`deserializeUser`
  - 16 行：Only the `user.id` is serialized to the session, keeping the amount of data stored within the session small.
  - 20 行：When subsequent requests are received, this ID (`user.id`) is used to find the user, **which will be restored to `req.user`**.
  - Ref.: [Understanding passport serialize deserialize](https://stackoverflow.com/questions/27637609/understanding-passport-serialize-deserialize)
    Q: Where does `user.id` go after `passport.serializeUser` has been called?
    A: The `user.id` is **saved in the session**, and is later used to retrieve the whole object via the `deserializeUser` function. `serializeUser` determines which data of the user object should be stored in the session.

### config/auto.js

<script src="https://gist.github.com/tzynwang/a33766a251de5bfc93c51333d34ebc3b.js"></script>

- 關於`.isAuthenticated()`

  ![We just don't have it in the docs](/2021/express-passport-login-note/it_just_works_king_crimson.jpg)

  - [How is req.isAuthenticated() in Passport JS implemented?](https://stackoverflow.com/questions/38820251/how-is-req-isauthenticated-in-passport-js-implemented)
    For any request, you can check if a user **is authenticated or not** by using this method.
  - [No Mention of isAuthenticated() in docs #683](https://github.com/jaredhanson/passport/issues/683)
    There is no bug... The thing is that the `isAuthenticated()` and `isUnauthenticated()` functions are not mentioned anywhere in the docs.

- 在`routes/home.js`與`routes/user.js`中作為 middleware 使用
  - `isLoggedIn`：若使用者已登入，則可繼續前往該 endpoint；反之若使用者未登入的話，則導向`/user/login`，並顯示提示訊息（`Please log in to view this page.`）
  - `notLoggedIn`：若使用者在已經登入的情況下前往`/user/login`或`/user/register`，則自動導回`/dashboard`

### routes/modules

<script src="https://gist.github.com/tzynwang/46da1a3a1881b339c4151444527b12a9.js"></script>

- home.js
  - 第 12 行`res.render('dashboard', { user: req.user.username })`：通過登入驗證的使用者資料會被儲存在`req.user`中，要在`dashboard`模板中顯示`username`的話，從`req.user`中取`username`的值即可
- user.js
  - 21-25 行：直接由`passport.authenticate('local', { ... })`接管登入驗證的程序，驗證成功的話導向`/dashboard`，失敗則導回`/user/login`，並因為`failureFlash`設定為`true`，`login`模板會根據 config/passport.js 中設定的條件顯示相對應的錯誤訊息（`{ message: 'User not exist' }`與`{ message: 'Password incorrect' }`）
  - Setting the `failureFlash` option to `true` instructs Passport to flash an error message using the message given by the strategy's verify callback, if any. 需注意 views/partials 中的`{{#if error}}`不可換成其他名稱，`req.flash('error')`中的`'error'`也不可換（換了就無法顯示訊息）
  - `req.logout()`: Passport exposes a `logout()` function on `req` that can be called from any route handler which needs to terminate a login session. Invoking `logout()` will **remove the `req.user` property and clear the login session (if any)**.

### views/partials

<script src="https://gist.github.com/tzynwang/0b6189f1dc961b792690202dde873773.js"></script>

- 使用 partials 時的 views 資料夾結構：

```
/views
  /layouts
    main.handlebars
  /partials
    messages.handlebars
  dashboard.handlebars
  index.handlebars
  login.handlebars
  register.handlebars
```

- 使用方式：設定好 partials 內容後，將`{{> 檔案名稱}}`（例：`{{> messages}}`）插回其餘模板即可
- 會自動根據`{{#if 參數是否為true}}`來決定顯示哪些 partials 內容，舉例：若 passport.js 中的`done()`回傳 error 的話，partials 檔案`messages.handlebars`中的 24-29 行即會顯示在`login`或`register`模板中

## 參考文件

- [Passport: Documentation](https://www.passportjs.org/docs/)
- YouTube 教學
  - [Node.js With Passport Authentication | Full Project](https://youtu.be/6FOq4cUdH8k)
  - [Build a Login System in NodeJS with Passport.js Authentication | A NodeJS Tutorial](https://youtu.be/W5Tb1MIeg-I)
- [Node - 使用模版引擎 Handlebars](http://cythilya.blogspot.com/2015/08/node-handlebars.html)
