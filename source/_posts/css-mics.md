---
title: CSS position 相關筆記
date: 2021-03-22 12:40:25
categories:
- CSS
tags:
---

## 總結
整理了`static`、`relative`、`absolute`與`fixed`特性的筆記

## `position: static;`
- 即使加上`top`、`bottom`、`left`、`right`數值也不會有任何效果，HTML元素的位置不會發生任何偏移
- `z-index`有效

## `position: relative;`
- 加上`top`、`bottom`、`left`、`right`數值後，HTML元素會根據「原本的位置」進行偏移
- `relative`元素的偏移不會對其他HTML元素產生任何影響
- `z-index`有效

## `position: absolute;`
- 設定為`absolute`的元素會脫離原本的排版（removed from the normal document flow）
- 如果父元件是`positioned element`的話，`absolute`元素會根據該父元件進行定位
  - `positioned element`：position設定為`relative`、`absolute`、`fixed`或`sticky`的HTML元素
  - 如果所有的父元件都沒有一個屬於`positioned element`的話，參考`<body>`進行定位
- `z-index`有效

## `position: fixed;`
- 設定為`fixed`的元素會脫離原本的排版（removed from the normal document flow）
- 基本上參考`<body>`進行定位，但如果父元件的`transform`、`perspective`或`filter`特性不為`none`的話，`fixed`元素就會根據該父元件進行定位
- 如果參考`<body>`進行定位的話，`z-index`有效

## 範例展示
<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="html,result" data-user="Charlie7779" data-slug-hash="bGgbwEq" style="height: 600px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="position">
  <span>See the Pen <a href="https://codepen.io/Charlie7779/pen/bGgbwEq">
  position</a> by Charlie (<a href="https://codepen.io/Charlie7779">@Charlie7779</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>


## 參考文件
[MDN: position](https://developer.mozilla.org/en-US/docs/Web/CSS/position)