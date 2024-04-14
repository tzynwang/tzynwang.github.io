---
title: CSS 筆記：處理 safari display grid 破版問題
date: 2024-04-12 19:21:47
tag:
	- [CSS]
banner: /2024/css-safari-grid-template-rows-bug/kelly-sikkema-n4FujS2oSng-unsplash.jpg
summary: 發現 Material UI 5 的 RadioGroup 元件使用 flex 排版，而如果工程師在 RadioGroup 的子元件用 grid 排版且沒有額外設定 grid-template-rows，則子元件的排版有機率在 safari 瀏覽器中炸裂 ¯\_(ツ)_/¯
draft: 
---

## 版本與環境

```bash
Safari: 17.4.1
@mui/material: 5.15.15
```

## 問題描述

如題，簡單來說就是 safari 似乎無法順利處理 `display: flex;` 中「沒有特別設定 `grid-template-rows` 的 `display: grid;`」：

![safari grid-template-rows broken](/2024/css-safari-grid-template-rows-bug/safari-grid-broken.png)

## 解決方式

將 Material UI 5 的 `RadioGroup` 設定為 `display: block`，或是對使用 `display: grid` 排版的元件加上 `grid-template-rows: max-content` 就能解決破版問題：

![safari grid-template-rows works with max-content or display block](/2024/css-safari-grid-template-rows-bug/safari-grid-works.png)

可試玩的完整範例在[這裡](https://stackblitz.com/edit/vitejs-vite-hfbyof?file=src%2FApp.tsx)。
