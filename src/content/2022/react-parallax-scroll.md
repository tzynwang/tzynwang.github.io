---
title: 2022 第20週 實作筆記：在 React APP 中實作滾動視差
date: 2022-05-21 15:03:26
tag:
  - [CSS]
  - [React]
---

## 總結

使用 `position: sticky;` 製作出滾動視差（parallax effect）效果

![parallax scroll demo](/2022/react-parallax-scroll/react-parallax-scroll-demo.gif)

展示：[https://tzynwang.github.io/react-parallax-effect/](https://tzynwang.github.io/react-parallax-effect/)
原始碼：[https://github.com/tzynwang/react-parallax-effect/tree/feature/sticky](https://github.com/tzynwang/react-parallax-effect/tree/feature/sticky)
參考來源：[Asana](https://asana.com/?noredirect) 首頁的動畫效果

## 筆記

### 關於 Asana 首頁的滾動視差

- 左側圖片的動畫效果是透過 `transform` 製作出來的，並非 SVG 檔案；在捲動到一定位置時觸發 `transform` 來改變 HTMLElement 的位置（`transform: translate(...);`）與變形（`transform: scale(...);`）程度，以及 `border-radius` 數值
- 數值推測：
  - 目測第一區塊右側文字的 `getBoundingClientRect().top` 加上 `getBoundingClientRect().bottom` 除以二（即中線）超過 `window.innerHeight` 一半後開始 `position: sticky;` 效果
  - 在第二區塊的 `getBoundingClientRect().top` 超過 `window.innerHeight` 一半之後就開始進行圖片變形
  - 第三區塊的「開始」判定看來同第二區塊，而「動畫結束」判定看起來是「區塊的 `getBoundingClientRect().bottom` 小於 `window.innerHeight * 0.05` 後，將圖片的 `position: sticky;` 改為 `position: absolute;`」

### 實作

- 準備兩套圖文元件：`StaticSection` 與 `ScrollAnimationSection`，`StaticSection` 處理版面小於 900px 不展示捲動效果的情境，動畫相關的處理都放到 `ScrollAnimationSection` 與其子元件中
- `TextBlock` 一個設定為 `100vh` 高，總計三個，而 `ImageContainer` 則配合三個 `TextBlock` 堆疊起來的總高度設定為 `300vh`
- 元件 `Body` 中，第 84-95 行旨在計算每一個 `TextBlock` 的頂部位置，配合 `useWindowScrollTop()` 回傳的捲動數值可以判定目前畫面捲動到哪一個區塊
- 元件 `Body` 中的 `handleScroll` 會計算 `ImageContainer` 元件的頂部是否已經經過畫面頂端，若為 `true` 則開始準備展現滾動視差動畫效果
- 元件 `AnimationImage` 根據目前畫面捲動的位置替換 `src` 內容
  - 設定 `top: 50vh;` 搭配 `transform: translateY(-50%);` 做出圖片垂直置中的效果
  - 因本實作觸發動畫的捲動點與 Asana 版本的不同，在畫面判定捲到最後一個區塊的時候設定 `position: absolute;` 避免圖片繼續被往下推移
- 需注意 FireFox 目前並不支援 `transition-property: background;`，圖片目前僅有在 Chrome 上才會有 `transition` 效果
- 需注意不能在 parent element 使用 `display: flex;` 否則 `position: sticky;` 會失效

## 參考文件

- [MDN: Element.getBoundingClientRect()](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect)
- [Gist: findOverflowParents.js](https://gist.github.com/brandonjp/478cf6e32d90ab9cb2cd8cbb0799c7a7)
