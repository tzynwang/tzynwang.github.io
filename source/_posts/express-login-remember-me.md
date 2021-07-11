---
title: 作業功能擴充：讓老爸的私房錢「可以記住使用者的登入狀態」
date: 2021-07-10 15:13:24
categories:
- Express
tags:
---

## 總結
實作的部分因為直接使用套件[`connect-mongo`](https://www.npmjs.com/package/connect-mongo)幫忙處理，所以沒什麼難度
本篇重點放在理解session、cookie，以及express.js伺服器如何保管session


## 環境
```
connect-mongo: 4.4.1
os: Windows_NT 10.0.18363 win32 x64
```

## 筆記
### Stateless Protocol
- HTTP是一種stateless protocol
  - 每一筆從瀏覽器發出的request對伺服器來說都是互無關係的
  - 可將request理解為銀行客戶，而伺服器是完全臉盲的行員；不管客戶來幾次，該行員就是無法主動認出「啊，這是我的客戶」，只要客戶離開櫃台，行員就會完全忘記該客戶是誰
- Stateless Protocol的優點：
  - [Wikipedia](https://en.wikipedia.org/wiki/Stateless_protocol): Stateless protocols improve the properties of visibility, reliability, and scalability.
  - Visibility is improved because a monitoring system does not have to look beyond a single request in order to determine its full nature. 不須處理上下文
  - Reliability is improved because it eases the task of recovering from partial failures. 若有錯誤發生，只需要復原出錯的部分即可
  - Scalability is improved because not having to store session state between requests allows the server to quickly free resources and further simplifies implementation. 不須額外效能來記憶狀態
- 問題：如果今天要打造一個「能維持使用者登入狀態」的Web APP，勢必需要其他技術協助


### 關於sessions
- sessions**不是**Chrome DevTools打開來切換到Application分頁看到的session storage
- sessions儲存在伺服器端，不存在使用者的瀏覽器中
   - 而sessions實際究竟儲存在Express.js伺服器的「哪裡」則是根據開發者的設定決定
   - 參考「[Where does express js save session details?](https://stackoverflow.com/questions/23821302/where-does-express-js-save-session-details)」，在沒有任何設定的情況下，Express.js伺服器會把sessions儲存在RAM中，所以重啟伺服器後，已登入的使用者也會被踢回登入畫面
   - 而如果把sessions保存在Redis或MongoDB等資料庫裡面的話，重啟Web APP的伺服器也不會失去sessions資料，已登入的使用者會繼續維持登入狀態

- [express-session](https://github.com/expressjs/session#express-session)
  - 參考「[Understanding Sessions and Local Authentication in Express with Passport and MongoDb](https://mianlabs.com/2018/05/09/understanding-sessions-and-local-authentication-in-express-with-passport-and-mongodb/)」
  - An **Express.js middleware** used for **persisting sessions across stateless HTTP requests**.
  - Sessions are used for **storing data about a user** and presenting dynamic data based on a user’s identity. They rely upon **saving session data to a cookie** that is sent to the user’s browser and then received back in future user requests.
  - This module expands the Express.js `request` object with the `session` property (among other things), which itself is an object that can be used by other middleware.
  - By default it uses a `MemoryStore`, an in-memory key-value database not intended for production use, to store the session data. But you can and should plug in another memory store middleware when deploying a serious product.

### 關於cookies
- 保存在使用者的瀏覽器中，開啟Chrome瀏覽器的DevTools切換到Application分頁，即可看到cookies
- cookies內容是可以隨意被使用者修改的（儘管修改cookie極可能讓該cookie直接失效）
- cookies夾帶在瀏覽器對伺服器發出的request header中
  - [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#creating_cookies): After receiving an HTTP request, a server can send one or more **Set-Cookie headers** with the response. The cookie is usually stored by the browser, and then the cookie is sent with requests made to the same server inside a **Cookie HTTP header**.
  - An **expiration date or duration can be specified**, after which the cookie is no longer sent. cookies是可以設定有效期限的
  - Additional restrictions to a specific domain and path can be set, **limiting where the cookie is sent**. 可以限制cookies僅能被送到哪些domain或path


## 實作
### 產出sessions
<script src="https://gist.github.com/tzynwang/e4f818e749c6215ad3a205686fd336f6.js"></script>

- 第8行：根據使用者輸入的email，從資料庫中取出相對應的使用者資料來比對密碼
- 第16行：將`user.id`的值賦予`req.session.passport.user`
  - [passport.serializeUser(fn(user, done) | fn(req, user, done))](https://github.com/jwalton/passport-api-docs#passportserializeuserfnuser-done--fnreq-user-done): Passport will call this to serialize the user to the session whenever you login a user with `req.login()`, or whenever a user is authenticated via `passport.authenticate()`. The function you pass in should call `done(null, serializedUser)`.
  - What this is going to do is set `req.session.passport.user = serializedUser`. Traditionally you'd make `serializedUser` some sort of string, like a user ID which you can fetch from your DB.
  - [Understanding passport.js authentication flow](http://toon.io/understanding-passportjs-authentication-flow/): `passport.serializeUser` can access the user object we passed back to the middleware. Its job is to determine **what data from the user object should be stored in the session**. The result of the serializeUser method is attached to the session as `req.session.passport.user = { // our serialized user object // }`. The result is also attached to the request as `req.user`.

### 保存sessions至資料庫中
<script src="https://gist.github.com/tzynwang/8856fbc612447732fea60e63ab053351.js"></script>

使用測試帳號登入後，即可在資料庫中看到sessions被保存下來：
{% figure figure--center 2021/express-login-remember-me/sessionsInDB.png %}

因sessions被另外保存到資料庫中，日後即使Web APP的伺服器重啟，也不會遺失使用者的登入狀態


## 參考文件
- [Passport: The Hidden Manual](https://github.com/jwalton/passport-api-docs#passport-the-hidden-manual)
- StackOverFlow
  - [What are sessions? How do they work?](https://stackoverflow.com/questions/3804209/what-are-sessions-how-do-they-work)
  - [Cookies vs. sessions](https://stackoverflow.com/questions/6253633/cookies-vs-sessions)
  - [Differences between cookies and sessions?](https://stackoverflow.com/questions/359434/differences-between-cookies-and-sessions?noredirect=1&lq=1)
- Blogs
  - [Sessions or cookies?](https://lucidar.me/en/web-dev/sessions-or-cookies/)
  - [Understanding Sessions and Local Authentication in Express with Passport and MongoDb](https://mianlabs.com/2018/05/09/understanding-sessions-and-local-authentication-in-express-with-passport-and-mongodb/)