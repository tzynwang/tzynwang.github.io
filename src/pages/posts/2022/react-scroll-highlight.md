---
layout: '@Components/SinglePostLayout.astro'
title: 2022 第11週 實作筆記：Element.getBoundingClientRect()
date: 2022-03-21 22:57:09
tag:
  - [React]
---

## 總結

因應專案限制，在不使用 `Intersection Observer API` （因 IE 無支援）的情況下，透過 `Element.getBoundingClientRect()` 與 `Element.scrollTo()`, `Element.scrollTop` 做出類似效果

需求情境：

- 畫面左側為章節清單，右側顯示章節內容
- 暫不考慮巢狀結構，章節全部平鋪
- 使用者捲動畫面右側內容時，根據 viewport 中的內容於左側清單做出對應提示（例：畫面捲到「第三章」的內容時，左側清單的第三章項目字體顏色需改為提示色）
- 使用者點擊左側清單時，右側 viewport 要跟著捲到相對應的章節位置

![demo](/2022/react-scroll-highlight/demo.gif)

## 版本與環境

```
react: 17.0.2
```

## 筆記

### 資料流

- 同一份資料分別用來渲染左側清單與右側內容區塊
- 在左側清單中的每一個項目都可以對應到右側每一個內容區塊時，可只使用一維陣列來儲存右側每一個內容區塊的 `getBoundingClientRect().top` 資料

### 實作步驟拆解

1. 於元件 `componentDidMount()` 後，將需要呈現在畫面上的資料保存至 `useState()` 變數 `content` 中
2. 將 `content` 傳給負責渲染左測清單、右側內容區塊的元件
3. 使用 `useRef()` 取得使用者捲動的對象並將 ref 保存到變數 `appMainRef` 中，並加上 `scroll` 事件監聽
4. 於右側內容區渲染完畢後，使用 `useState()` 保存各區塊的 `getBoundingClientRect().top` 資料，以便使用者點擊左側清單時，知道要將畫面捲到哪一個高度
5. 捲動事件發生時，取 `e.target.scrollTop` 比對現在捲動的位置，若為零（或捲動到底）則判定左側清單的第一（或最後一個項目）為 highlight 狀態；若以上兩者皆非，則透過 `appMainRef.current.children` 取得現在右側所有區塊的 `getBoundingClientRect().top` 資料，比對目前哪一個區塊的 `top` 超過螢幕一半高（`window.innerHeight / 2`），進而判斷哪一個區塊在 highlight 狀態

### 原始碼

<script src="https://gist.github.com/tzynwang/5b41a09f034172216a8b67e16d4ac218.js"></script>

## 參考文件

- [MDN: Element.getBoundingClientRect()](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect)
