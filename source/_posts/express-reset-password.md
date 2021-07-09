---
title: 「重設密碼（Express.js）」技術記錄
date: 2021-07-09 16:09:02
categories:
- Express
tags:
---

## 總結
使用套件`jsonwebtoken`與`nodemailer`替記帳APP實作重設密碼之功能
密碼重設流程大方向如下：
1. 使用者點選「忘記密碼」
1. 請使用者輸入當初註冊的Email，若有效，則發出一封包含「重設密碼連結」的Email給該信箱
1. 使用者收信、點選重設密碼連結後，該連結導向APP的重設密碼路由
1. 使用者更新密碼，更新成功後，跳轉回APP登入路由，使用者可使用新密碼登入APP


## 環境
```
express: 4.17.1
jsonwebtoken: 8.5.1
nodemailer: 6.6.2
os: Windows_NT 10.0.18363 win32 x64
```

## 注意事項
- 重設密碼之連結須為一次性
  - 若該連結已用於重設密碼，之後點開該連結無法再度重設密碼
- 重設連結需有時效性
- 要可以辨識出「現在是哪一個使用者要重設密碼」


## 實作
1. 向DB查詢使用者輸入的Email是否為已經註冊過的Email，若已註冊，則使用`jsonwebtoken`將該使用者的Email與hash-password encode為一組金鑰
1. 搭配`nodemailer`發送一封包含重設密碼URL的信件給該使用者，URL中包含步驟一產生的金鑰
  - 使用`nodemailer`的`gmail service`時若出現錯誤訊息`Invalid login: 535-5.7.8 Username and Password not accepted`，則至Google Account中允許`Less secure app access`
  - 解決方式參考：[Error: Invalid login: 535-5.7.8 Username and Password not accepted](https://stackoverflow.com/questions/59188483/error-invalid-login-535-5-7-8-username-and-password-not-accepted)
1. 使用者點選信件中的重設密碼URL後，後端檢驗該request夾帶的金鑰內容
  - 將金鑰decode，若decode失敗則代表金鑰本身無效（被竄改、惡意測試等），將使用者導回重設密碼的頁面
  - decode後確認該Email是否存在DB中
  - decode後確認hash-password的值是否與目前DB中該Email的hash-password一致
    - 一致：代表該使用者還未重設密碼
    - 不一致：代表密碼已經被重設過了
    - 以上讓金鑰成為一次性使用的實作方式借鑑：[JWT and one-time tokens?](https://stackoverflow.com/questions/43719615/jwt-and-one-time-tokens)
1. 若以上檢驗皆無問題，則讓使用者重設密碼；密碼重設後將使用者引導回登入頁面，並提示使用者密碼已更新成功

## 原始碼
<script src="https://gist.github.com/tzynwang/dce39172362a8690084407ae0dd08121.js"></script>


## 參考文件
- npm packages:
  - [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
  - [nodemailer](https://www.npmjs.com/package/nodemailer)

- [JWT and one-time tokens?](https://stackoverflow.com/questions/43719615/jwt-and-one-time-tokens)
- [Single-Use Tokens w/ JWT](https://www.jbspeakr.cc/howto-single-use-jwt/)
