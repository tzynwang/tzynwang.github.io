---
title: Alpha Camp「2-1 電影清單之按讚與刪除」技術記錄
date: 2021-05-05 14:56:06
tag:
- [JavaScript]
---

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="js,result" data-user="Charlie7779" data-slug-hash="YzNmOGY" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="A22: My Favorite Movies：按讚與刪除">
  <span>See the Pen <a href="https://codepen.io/Charlie7779/pen/YzNmOGY">
  A22: My Favorite Movies：按讚與刪除</a> by Charlie (<a href="https://codepen.io/Charlie7779">@Charlie7779</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

## 總結

本次作業中實作的功能：

- 根據點擊次數記錄電影分數（尚未導入 Cache 或 Storage API，分頁關掉後即失去記錄）
- 點擊 X 按鈕後，自畫面上移除該部電影的資訊
- i18n（實作英文與中文介面的切換）

## 筆記

### controller.updateRating()

監聽`<div id="dataPanel">`的點擊事件，若使用者點選到「讚」或「爛」按鈕時，透過`HTMLTableRowElement.rowIndex`來取得點擊事件發生在`<table>`中的哪一行`row`上（可從`rowIndex`推斷使用者點選的是哪一部電影），進而更新`data.movies`中相對應電影的分數。

其他解法：也可直接在「讚」或「爛」按鈕上使用`dataset`賦予電影的`id`，點擊事件發生後就可透過`data.id`來取得點擊事件發生在哪一部電影身上

### controller.updateDeleteStatus()

使用者點選表格右端的 X 按鈕刪除電影後，透過`controller.updateDeleteStatus()`將被點擊電影的`deleteFlag`設定為`true`，用意是：在使用者進行介面語系切換後，`deleteFlag`為`true`的電影就不應該繼續出現在畫面上（`view.generateTableContents()`中會透過`filter()`篩選出`deleteFlag`不為`true`的電影）

### view.fontSizeToggle()

筆記：切換顯示語言後，發覺儘管 font-size 數值相同，英文字體的尺寸在視覺上比中文字體小不少，故使用`view.fontSizeToggle()`來根據當下顯示的語言調整畫面中的字體大小

### view.generatePosterModal()

筆記：過去的作業多半是先將空的 modal 寫進 HTML，待點擊事件發生後再使用 JavaScript 更新 modal 中的內容；本次改用「點擊事件發生後，再根據被點擊的目標產生相對應的 modal（內容）」，相較以前作法，點擊後及時產生 modal 的好處是使用者不會看到一閃而逝的舊內容。

## 參考文件

- [Element.closest(selectors)](https://developer.mozilla.org/en-US/docs/Web/API/Element/closest)
  從`Element`開始往根部搜尋`selectors`，本次作業應用於`controller.updateRating()`中
- [HTMLTableRowElement.rowIndex](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableRowElement/rowIndex)
  取一個`table row`在整體`<table>`中的`rowIndex`
