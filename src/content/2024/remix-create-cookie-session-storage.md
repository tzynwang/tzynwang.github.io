---
title: 快速筆記：Remix 的 createCookieSessionStorage 與 window.sessionStorage 毫無關係
date: 2024-09-04 20:53:47
tag:
	- [Remix]
banner: /2024/remix-create-cookie-session-storage/annie-spratt-IENa-E_0nro-unsplash.jpg
summary: 這個功能主要功能是「把 session 資料完整地保存在 cookie 中」，跟關閉瀏覽器分頁後就消失的 window.sessionStorage 沒有任何關係。
draft: 
---

Remix 的 [`createCookieSessionStorage`](https://remix.run/docs/en/main/utils/sessions#createcookiesessionstorage) 跟 Browser Api [`window.sessionStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) 完全沒有關係。

## 筆記

### createCookieSessionStorage

`createCookieSessionStorage` 的用途是透過 HTTP cookies 來保存**完整的 session 資料**（通常只會保存 session id）。使用這個方法來保存 session 資料的好處是，開發者不需要再拉一個資料庫來保管使用者的 session 資料（因為都放在 HTTP cookies 裡面了）。

> The main advantage of cookie session storage is that **you don't need any additional backend services or databases to use it**.

session 是「有狀態（stateful）」的，但請求（HTTP request）沒有（stateless）。請求如果能提供提示（比如 cookies 中的 session id），就能讓後端判斷該請求是否來自同一個使用者。這個特性能幫助前端工程師打造「狀態持續」的瀏覽體驗。比如使用者只要登入一次，就能在登出前自由地瀏覽「需要登入」才能檢視的頁面。

> Sessions are an important part of websites that **allow the server to identify requests coming from the same person**. Sessions are a fundamental building block of many sites that let users "log in", including social, e-commerce, business, and educational websites.

根據 Remix 官方文件，`createCookieSessionStorage` 會回傳 `getSession` / `commitSession` / `destroySession` 這三個功能，讓使用者能方便地操作 cookie 中的 session 資料：

- `getSession()` **retrieves the current session** from the incoming request's `Cookie` header
- `commitSession()`/`destroySession()` provide the **`Set-Cookie` header** for the outgoing response

注意 HTTP cookies 只是其中一種保存方式，開發者可以改用 [`createSessionStorage`](https://remix.run/docs/en/main/utils/sessions#createsessionstorage) 來將 session 資料存入慣用的資料庫中。

### window.sessionStorage

`window.sessionStorage` 與 [`window.localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) 類似，差異在於 localStorage 中的資料只會在使用者主動清除時消失，但 sessionStorage 中的資料在使用者關閉該瀏覽器分頁後就會不見。

## 參考文件

- [Remix: Sessions](https://remix.run/docs/en/main/utils/sessions)
- [Remix: Cookies](https://remix.run/docs/en/main/utils/cookies)
- [MDN: `window.sessionStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)
- [Wikipedia: Session (computer science)](https://en.wikipedia.org/wiki/Session_(computer_science))
