---
title: Alpha Camp「3前 廣告排期系統」相關筆記
date: 2021-07-17 12:42:34
tag:
  - [CSS]
  - [JavaScript]
---

## 結論

本此作業接觸到的相關內容與實作技巧：

- [BEM](http://getbem.com/introduction/)
- 搭配`Element.setAttribute()`來實作 dark mode 與`<tr>` highlight 效果
- `var()`不僅限於顏色，也可儲存 url 的值
- 固定`<thead>`位置，且可捲動`<tbody>`查看其中所有的`<tr>`

成品：[廣告排期系統](https://tzynwang.github.io/ac_assignment_3F_backend-dashboard/)
原始碼：[ac_assignment_3F_backend-dashboard](https://github.com/tzynwang/ac_assignment_3F_backend-dashboard)

## 筆記

### BEM

- Block: **standalone entity** that is meaningful on its own.
  - `header`, `container`, `menu`, `checkbox`, `input`
- Element: a part of a block that has no standalone meaning and is **semantically tied to its block**.
  - `menu item`, `list item`, `checkbox caption`, `header title`
- Modifier: a flag on a block or element. Use them to **change appearance or behavior**.
  - `disabled`, `highlighted`, `checked`, `fixed`, `size big`, `color yellow`
- 作業範例：
  <script src="https://gist.github.com/tzynwang/d4e501f48e5ac5eaa7d7ca73a3e9152b.js"></script>
- AC 對 BEM 的詮釋：
  - 「盡量在同一個頁面，甚至是跨頁面但同系統之下，能夠有**不重複的 class name**。」
  - 「最大的優勢就是他人在閱讀你的程式碼時，**只要透過觀察 class 名稱，就能了解你的 CSS 階層架構**，例如看到`list__item--hover`就知道這是滑鼠滑過表單子項目時的樣式。」

### `Element.setAttribute()`與 dark mode

- 原理：
  1. 設置一個`<input type="checkbox">`，監聽其`change`事件；在該元素發生`change`事件時，修改`document.documentElement`的 attribute `[data-theme]`為`dark`
  1. 而`[data-theme="dark"]`本身即包含了變數在 darkmode 中應該要使用的內容，故 attribute `[data-theme]`設定為`dark`後，畫面中使用變數設值的元素就會跟著改變外觀
- 實際 CSS 內容：
  <script src="https://gist.github.com/tzynwang/44bea7cbc64ca5f330dd673d4f2348f3.js"></script>
- 實際 JavaScript 程式碼：
  <script src="https://gist.github.com/tzynwang/4e89815e994bcacfb54fc97b1298f6f4.js"></script>
  - [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Document/documentElement): `Document.documentElement` returns the Element that is the root element of the document (for example, the `<html>` element for HTML documents).
  - [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute): `Element.setAttribute()` sets the value of an attribute on the specified element. If the attribute already exists, the value is updated; otherwise **a new attribute is added with the specified name and value**.
  - 白話文：`#dark__mode__toggle`發生`change`事件時，若`#dark__mode__toggle`呈現被勾選（`checked`）的狀態，就設定`root element`的 attribute `data-theme`為`dark`，反之設定為`light`；`data-theme`為`dark`狀態下，變數群的內容會跟著修改，故會呈現深色外觀
  - 切換畫面為 dark mode 的圖示在一般配色與深色兩種版面的外觀不同，實作方式是將圖片設定為元素的`background`，根據`data-theme`的值來切換`background`的值（`url()`）

### 衍伸：`<tr>` highlight

<script src="https://gist.github.com/tzynwang/07c0ab522bd99019c2c9d5554e7cf095.js"></script>

- [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/closest): `Element.closest()` traverses the `Element` and **its parents** (heading toward the document root) until it finds a node that **matches the provided selector string**.
- 白話文：監聽`.table__body`的`change`事件，在`event.target`進入`checked`狀態後，從`event.target`開始往根部尋找，直到找到`.table__row`，並修改其`data-theme`為`highlight`

### 固定`<thead>`，且可捲動`<tbody>`

```css
table thead,
table tbody tr {
  width: 100%;
  display: table;
  table-layout: fixed;
}

table tbody {
  height: 60vh;
  display: block;
  overflow-y: scroll;
}
```

- 必須設定`display: table;`
- [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/table-layout): `table-layout: fixed;` means table and column widths are **set by the widths of table and col elements** or **by the width of the first row of cells**. Cells in subsequent rows do not affect column widths.
  - Under the "fixed" layout method, the entire table can be rendered **once the first table row has been downloaded and analyzed**. This can **speed up rendering time** over the "automatic" layout method, but subsequent cell content might not fit in the column widths provided.
  - 實際測試後，發現（此專案）移除該設定也沒有影響
- `tbody`需設定為`display: block;`才能搭配`overflow-y: scroll;`發揮效果；沒有設定`display: block;`的話，`height`數值設定了也不會有任何作用

## 參考文件

- [YouTube: Why I use the BEM naming convention for my CSS](https://youtu.be/SLjHSVwXYq4)
- [How to set tbody height with overflow scroll](https://stackoverflow.com/questions/23989463/how-to-set-tbody-height-with-overflow-scroll/23989771)
- 作業 wireframe
  - [Data Table](https://www.figma.com/file/SbfeY00z18vNLWc5M8Pd5x/Data-Table?node-id=0%3A1)
  - [Data Table: dark mode](https://www.figma.com/file/Yse4jdzxknDGrDVYDNmic8/Dark-mode?node-id=0%3A1)
