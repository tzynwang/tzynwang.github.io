---
title: 我們不要那個 overflow hidden 了——如何無痛隱藏單軸內容？
date: 2024-11-24 18:32:30
tag:
  - [CSS]
banner: /2024/css-overflow-clip/daria-shatova-qBSIwo7H0qY-unsplash.jpg
summary: 答：把 `overflow-x/y` 設定為 `clip` 而不是 `hidden` 來隱藏單軸內容。如果你好奇為什麼要用 `clip`，那歡迎點開本篇筆記。
draft:
---

## overflow hidden 的限制

[舉個例子](https://codepen.io/Charlie7779/pen/jOggVMG)，比如我想要在一個容器（`.container`）內擺放一張圖片（`.item`），並且「隱藏圖片 X 軸超過容器寬的部分」（即下圖黃色區塊）：

![the yellow highlight part is the content that I want to hide](/2024/css-overflow-clip/overflow-visible.png)

但當我將 `.container` 設定為 `overflow-x: hidden;` 時，瀏覽器卻自動把圖片 Y 軸超過容器的部分也藏起來，還提供了滾輪條（scroll bar）：

![example of overflow hidden](/2024/css-overflow-clip/overflow-hidden.png)

😀 啊？？？

## 為什麼會這樣

### CSS overflow 規格

擷取自 [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow#formal_definition)：

1. The initial value of `overflow` is `visible`
2. The `visible`/`clip` values of `overflow` compute to `auto`/`hidden` (respectively) if one of `overflow-x` or `overflow-y` is neither `visible` nor `clip`

### 規格白話文運動

首先記得 `overflow` 的預設值是 `visible`，接著整理一下值的變化規則：

> The `visible`/`clip` values of `overflow` compute to `auto`/`hidden` (respectively) if...

- 在滿足條件後，原本是 `visible` 的值會自動變為 `auto`
- 在滿足條件後，原本是 `clip` 的值會自動變為 `hidden`

然後來看看值的變化條件：

> if one of `overflow-x` or `overflow-y` is neither `visible` nor `clip`

於是我們可以得到以下結論：

1. 當一個元件的 `overflow-x` 設定為 `hidden` 時，它滿足了 "`overflow-y` is neither `visible` nor `clip`" 這段規格中的條件
2. 所以，根據規格，該元件的 `overflow-y` 會自動從預設值 `visible` 變成 `auto`

而 `auto` 的作用如下：

> **Overflow content is clipped** at the element's padding box, and **overflow content can be scrolled into view using scroll bars**.

很不幸地，範例中的圖片在 X/Y 兩軸都超出容器的範圍，所以瀏覽器**自動隱藏超出範圍的內容**，並且為容器**加上 Y 軸滾輪條**。

![那個體貼我不要了](/2024/css-overflow-clip/那個體貼我不要了.png)

## 解決方式

（[還是同一個例子](https://codepen.io/Charlie7779/pen/jOggVMG)）把 `.container` 設定為 `overflow-x: clip;` 就可以了，因為瀏覽器在 `overflow` 為 `clip` 時不會~~提供我們不要的體貼~~擅自更動另一軸 `overflow` 的值。

![overflow clip example](/2024/css-overflow-clip/overflow-clip.png)

瀏覽器支援度也沒什麼問題：

![caniuse overflow clip](/2024/css-overflow-clip/caniuse-overflow-clip.png)

## 參考文件

這篇筆記只有包含 [Overflow Clip](https://ishadeed.com/article/overflow-clip/) 這篇厲害原作的部分精彩內容——除了無痛隱藏單軸內容以外，設定成 `clip` 也能確保 [CSS scroll-driven 動畫](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations)正常運作，值得一看。
