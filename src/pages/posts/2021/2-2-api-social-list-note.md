---
layout: '@Components/SinglePostLayout.astro'
title: Alpha Camp「2-2 社群名單」技術記錄
date: 2021-05-04 19:59:34
tag:
  - [JavaScript]
---

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="js,result" data-user="Charlie7779" data-slug-hash="ExZJLzG" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="2-2 社群名單">
  <span>See the Pen <a href="https://codepen.io/Charlie7779/pen/ExZJLzG">
  2-2 社群名單</a> by Charlie (<a href="https://codepen.io/Charlie7779">@Charlie7779</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

## 總結

在本作業中實作的相關功能：

- 分頁（pagination）
- 可在 list 與 grid 顯示模式之間切換
- 簡易搜尋

本次運用的技術：

- Spread syntax (`...`)
- 將功能分拆為 view（管理顯示相關的程式碼）與 controller（管理流程、資料處理相關的程式碼），以及使用 data、config 與 elementObject 來分類資料，增進原始碼的易讀性

## 下一步

導入 service worker 與 cache API：

- 將透過 axios 取得的資料儲存起來，這樣僅需在首次開啟 APP 時透過 axios 索取 API 回傳的資料，之後可直接使用已經儲存下來的資料即可，不須再發出的 request
- 讓 APP 在沒有網路的狀態下也可進行一定程度的操作

## 相關筆記

### 分頁（pagination）

- 除單純的數字頁以外，也實作了「前一頁」與「下一頁」的頁面移動按鈕
- 邏輯分流：
  - 點擊「前一頁」時：「抵達第一頁」或「離開最後一頁」時，需 disable「第一頁」或解除「最末頁」的 disable 狀態
  - 點擊「下一頁」時：邏輯與「前一頁」相反，「抵達最末頁」或「離開第一頁」時，需 disable「最末頁」或解除「第一頁」的 disable 狀態
  - 點擊「第一頁」或「最末頁」：除 disable「前一頁」或「下一頁」外，本次透過`document.querySelector('.page-item.active').classList.remove('active')`的方式來解除換頁前處在 active 狀態的頁數
  - 其他頁數：解除「前一頁」與「下一頁」的 disable 狀態，也解除換頁前處在 active 狀態的頁數

### 切換顯示模式

- 將不同顯示模式的每頁頁數設定在 config 中（`config.displaySettings`）
- 點擊 list 或 grid 模式的按鈕後，根據 config 中的顯示狀態產生每頁內容與分頁（`view.updateUI()`）
- 因 list 每一頁顯示的使用者數量（12）較 grid 多（9），故以 grid 顯示時的總頁數會大於 list；所以處在 grid 狀態時，使用者在 pagination 上的頁數可能會超出 list 的極限值，故使用`controller.setMaxPageNumber()`來避免「狀態切換後，可能會造成 pagination 頁數溢位」的問題

### 簡易搜尋

- 設置`searchingStatus`，進行顯示模式切換的時候才能根據搜尋狀態與否抓取相對應的資料（全部的使用者／搜尋結果）
- 根據搜尋結果（無／有）在畫面上進行提示（`No matching result(s)`／`${quantity} result(s) of keyword(s)`）
- 使用者點擊`Clear Search Results`按鈕後，清除搜尋結果，離開搜尋狀態（更新`searchingStatus`）

### Spread syntax

- 應用：透過 axois 取回資料後，使用 spread syntax 將資料展開、加進`allUsersData`陣列中
  - `data.allUsersData.push(...response.data.results)`
  - 功能與 forEach 相同，但因為不需要對個別內容進行加工，故使用 spread syntax 直接展開存入陣列

### 原始碼分類管理

<script src="https://gist.github.com/tzynwang/a398bbe0721b8199f03347ce03d3b490.js"></script>

## 參考文件

- [MDN: Object.values(obj)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Object/values)
  回傳一個陣列，其中包含 obj 中所有 key-value pair 的 value
- [MDN: Math.min(value0, value1, ... , valueN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/min)
  回傳傳入的 values 中最小的值，若要傳入陣列，可搭配 spread syntax（`Math.min(...array1)`）
- [MDN: String.prototype.trim()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim)
  會回傳一組「移除原本字串頭尾空白鍵的」新字串，不影響原本的字串
