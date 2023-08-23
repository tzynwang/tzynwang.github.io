---
layout: '@Components/pages/SinglePostLayout.astro'
title: 2022 第34週 實作筆記：單色螢光筆功能
date: 2022-08-26 21:20:07
tag:
  - [HTML]
  - [React]
---

## 總結

實作了單色、支援多段標註的螢光筆功能

原始碼：[https://github.com/tzynwang/react-highlight](https://github.com/tzynwang/react-highlight)
展示頁：[https://tzynwang.github.io/react-highlight/](https://tzynwang.github.io/react-highlight/)

## 原始碼

<script src="https://gist.github.com/tzynwang/6f65cf9702d1d6611479a64b53092b92.js"></script>

## 解說

- `handleSelectRange`：當點擊事件發生時，將選取起來的範圍替換為帶有 `highlight` class 的 span 元素
  - 18 行：透過 `document.getSelection()` 取得畫面上目前的選取範圍（Selection object）
  - 22 行：透過 `getRangeAt()` 取得選取範圍裡第一個 Range 物件
  - 23-24 行：建立 class 為 highlight 的 span 元素，用於顯示使用者畫下的螢光筆範圍
  - 25 行：透過 `range.extractContents()` 將該段 Range 選取起來的內容從 document 中移除，同時將此段內容設定為 highlightSpan 的內容
    - JavaScript: The Definitive Guide - This method **deletes the specified range of a document** and returns a `DocumentFragment` node that contains the deleted content (or a copy of the deleted content).
  - 26 行：將 highlightSpan 放回 Range 物件中
    - MDN: The `Range.insertNode()` method inserts a node at the start of the `Range`.
- `calculateHighlightArea`：計算 `highlight` span 元素的始末點
  - 32 行：取得 `mainSpanRef` 的 childNodes
  - 39-48 行：檢查 childNodes 的內容，過濾掉 `node.textContent` 為空的元素，剩下有內容的 node 則推到陣列變數 `raw` 中
    - childNodes 可能為純文字（沒有被螢光筆標記起來的部分），也有可能是 span 元素（代表這段文字有畫螢光筆）
  - 53 行：`raw` 陣列中第一個 childNode 的 range 起點必為零，結束點則是該元素的內容長度
  - 55-61 行：後續 childNode 的 range 則需要加上前一個元素的內容長度
  - 66-69 行：檢查 childNode 的 `nodeType`，只留下有被螢光筆標註過的 childNode，亦即只保留 `nodeType` 值為 1 的 span node，最後再透過 `.map()` 回傳 range 資料，即代表使用者標註螢光筆範圍的陣列（資料型態為 `number[][]`）
- `RenderContent`：根據（後端回傳的）標註範圍資料，在指定的節點中繪製螢光筆範圍
  - 80-82 行：若陣列為空，代表沒有螢光筆標註範圍，回傳純文字即可
  - 85-97 行：若有標記範圍（陣列不為空），則根據螢光筆標註範圍的始末點反推算整個段落的純文字與螢光筆標註範圍
    - 86-88 行：螢光筆標註範圍並非從零開始時，補上一個螢光筆段落前的純文字的範圍（起點為零，結束點為「螢光筆開始標註的範圍」，故為 `markRange[0][0]`）
    - 所有 `[...r, 1]` 都代表該段範圍是「螢光筆標註的範圍」
    - `[markRange[index - 1][1], markRange[index][0]]` 代表純文字範圍，起點是「前一個螢光筆標註範圍的終點」，結束點是「下一個螢光筆標註範圍的起點」
    - 97 行負責補上最後一段螢光筆標註後，剩下的純文字節點
  - 101-117 行：已知 range 陣列長度若為 3 則代表該 range 是螢光筆範圍，故將文字 `.slice()` 後包進 有 class `highlight` 的 span 元素中，剩下純文字範圍直接回傳 `.slice()` 段落即可

## 參考文件

- [MDN: Range.extractContents()](https://developer.mozilla.org/en-US/docs/Web/API/Range/extractContents)
- [MDN: Selection.getRangeAt()](https://developer.mozilla.org/en-US/docs/Web/API/Selection/getRangeAt)
- [MDN: Range.insertNode()](https://developer.mozilla.org/en-US/docs/Web/API/Range/insertNode)
- [JavaScript: The Definitive Guide - Range.extractContents()](https://www.oreilly.com/library/view/javascript-the-definitive/0596000480/re565.html)
- [StackOverFlow: Difference between range and selection in browser](https://stackoverflow.com/questions/5573030/difference-between-range-and-selection-in-browser)
