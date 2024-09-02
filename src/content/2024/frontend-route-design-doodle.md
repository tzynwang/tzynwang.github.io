---
title: 前端路由設計心得
date: 2024-09-02 18:59:19
tag:
	- [General]
banner: /2024/frontend-route-design-doodle/matias-contreras-kQ4tZUEqyPw-unsplash.jpg
summary: 關於前端路由設計，截至目前為止的心得是——這個部位就負責兩件事：「反應使用者的旅程階段」或「保存狀態」。
draft: 
---

目前為止的心得是——前端路由就負責兩件事：「反應使用者的旅程階段」或「保存狀態」。

## 功能一：反應使用者的旅程階段

使用者的瀏覽紀錄要能反應其旅程（user's browser history accurately reflects their journey through your application）。因此，當使用者**在服務的不同階段移動時，路由就該變化**。比如：

- 使用者從購物網站的首頁（`/`）進入某個商品的說明頁（`/item/$itemId`）
- 使用者決定為購物車（`/chart`）結帳（`/checkout`）

而以下「沒有開啟新脈絡（前端在背景默默做掉就好）」的操作情境，就不需要改變路由：

- 使用者對某個商品留下評價
- 使用者Ａ向使用者Ｂ送出好友邀請
- 使用者對某條貼文按下、收回讚

## 功能二：保存狀態

如果某狀態需要在畫面重整之間持續，或是**在多個裝置、平台間傳遞**，那就可以考慮**將狀態帶入路由**。比如：

- 讓使用者分享他的設定，比如「購物網站裡屬於品牌Ｘ的商品，並以網格模式顯示（`/brand/X?show=GRID`）」
- 註記使用者的來源，比如 [[GA4] Campaigns and traffic sources](https://support.google.com/analytics/answer/11242841?hl=en#zippy=%2Cin-this-article)
- 在不使用帳號系統的情況下，讓使用者分享他的螢光筆標記（下述）

備註：只是要滿足「狀態於畫面重整之間持續」的話，也可以用 [`window.localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) / [`window.sessionStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) 處理。

## 變化的部位

- `Location.pathname` 代表「階層」的概念；比如 `/friend` 這個頁面會列出某使用者的所有朋友，而 `/friend/25` 會指向「與該位朋友的互動紀錄頁」
- `Location.search` 代表「過濾、排序」的概念；比如 `/friend?category=acquaintance` 會讓使用者看到他設定為「點頭之交」的朋友，而 `/friend?sort=DESC` 會將該使用者的朋友們以「成為朋友的日期」來排序
- `Location.hash` 用來定位「一份文件中的特定位置」，比如 `/hooks#use-state` 用來指向 React hooks 中 `useState` 的說明段落
- 不屬於 `Location` 的 [Text fragments](https://developer.mozilla.org/en-US/docs/Web/URI/Fragment/Text_fragments) 能在不使用帳號系統的情況下，讓使用者分享他的螢光筆標記（參考 [Session (computer science) from Google search result](<https://en.wikipedia.org/wiki/Session_(computer_science)#:~:text=In%20computer%20science%20and%20networking,systems%2C%20or%20live%20active%20users>) 和 [Session (computer science) direct link](<https://en.wikipedia.org/wiki/Session_(computer_science)>) 這組對比）——但要注意目前 FireFox 還不支援此規格

## 參考資料

- [mdn web docs: Location](https://developer.mozilla.org/en-US/docs/Web/API/Location)
- [mdn web docs: Text fragments](https://developer.mozilla.org/en-US/docs/Web/URI/Fragment/Text_fragments)
- [Remix docs: Form vs. fetcher](https://remix.run/docs/en/main/discussion/form-vs-fetcher)
