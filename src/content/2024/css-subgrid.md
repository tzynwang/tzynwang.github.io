---
title: CSS 筆記：subgrid
date: 2024-05-19 09:25:25
tag:
  - [CSS]
banner: /2024/css-subgrid/alexander-grey-_Y3IuVbPpmU-unsplash.jpg
summary: 有效治療排版強迫症，用來對付內容長短差距極大的元件更是妙不可言，但需要 16.0 的 Safari 瀏覽器，實作前請確認自家產品 TA 的裝置組成與版本分佈。
draft:
---

此篇筆記是在參考多篇文章與影片後濃縮的自用內容，不是新手教學文章，如果你完全不知道 CSS `subgrid` 的操作方式，可以先閱讀本篇最下方列出的參考資料。

## `subgrid` 想解決的問題

在沒有 `subgrid` 之前，親代與子代即使同為 `display: grid` 元件，兩者的網格尺寸也是互不關聯的。不過一旦將子代設定為 `subgrid`，子代就能繼承親代的網格尺寸。

## 語法

親、子代元件都設定為 `display: grid`，接著指定子代要繼承的網格類型——以下範例繼承的是 `columns` 的尺寸：

```css
.parent {
  display: grid;
  grid-template-columns: 1fr 2fr;
}

.child {
  display: grid;
  grid-template-columns: subgrid;
}
```

## 應用

### 對付長短不一的內容

`subgrid` 特別適合對付「在設計上彼此關聯，需要在視覺上維持一致的排列，但內容長短不一的元件」。比如以下四張卡片：

![without subgrid](/2024/css-subgrid/without-subgrid.png)

在沒有將 `grid-template-rows` 設定為 `subgrid` 前，卡片們不會知道彼此的標題需要多高的空間，所以只會根據自己的內容進行排版——短標題配上長文後，標題的空間就會被壓縮。

不過一旦套用 `grid-template-rows: subgrid`，就會發現卡片們的標題高度統一了：

![with subgrid](/2024/css-subgrid/with-subgrid.png)

同樣的思路可應用到 footer 區塊，確保標題長度不會影響下方內容（aaa bbb ccc 部分）的起始高度：

![footer](/2024/css-subgrid/footer.png)

### 與 `flex` 的比較

![vertical card flex broken](/2024/css-subgrid/vertical-card-broken.png)

當卡片內容分成左右區塊，且有較長單字時，使用 `flex` 搭配 `flex: 1 1 50%` 會讓卡片中線開始偏移。而使用 `grid-template-columns: subgrid` 則是會讓所有的卡片中線維持在相同的位置（但不會保持左右內容等寬）。

在可能會出現超長單字的場合，可考慮使用 `subgrid` 來統一視覺效果。不過如果是在排版不常變動的內容，個人認為繼續使用 `flex` 也沒什麼問題。

## 注意事項

設定為 `subgrid` 的元件會**重置格線編號**，亦即位在 `subgrid` 元件中的子元件在使用 `grid-column` / `grid-row` 指定位置時，要使用的是 `subgrid` 元件的格線編號，而不是回頭參考祖元件（即設定為 `subgrid` 元件的親代）的格線（The subgridded element doesn't inherit the line numbers of the parent grid.）。

但請注意——`subgrid` 元件中的子元件卻能繼承祖元件的**格線名稱**（The line names on the parent grid are passed into the subgrid, and you can place items using them.），你可以使用祖元件的格線名稱指定 `subgrid` 元件中的子元件位置（參照 [Named grid lines](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Subgrid#named_grid_lines)）。

設定為 `subgrid` 的元件可以覆蓋親元件設定的 `gap`。

如果參與排版的元件數量不固定，就要避免寫死 `subgrid` 親元件的 `grid-template-rows` 數量，否則多出來的元件，其排版會不如預期（參照 [No implicit grid in a subgridded dimension](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Subgrid#no_implicit_grid_in_a_subgridded_dimension)）。

最後，此功能雖然在所有的主流瀏覽器都已上線（參考 [caniuse.com](https://caniuse.com/css-subgrid)），但請根據你的產品 TA 選擇是否要採用此技術進行開發——畢竟不是每個使用者都會勤於更新軟體：

![can i use subgrid](/2024/css-subgrid/caniuse-subgrid.png)

## 參考文件

- 對 `subgrid` 完全沒概念的朋友，可以先看看 Mozilla Developer 深入淺出的影片 [YouTube: Laying out Forms using Subgrid](https://youtu.be/gmQlK3kRft4?si=THv5XT4BqCi_XE5-)
- 大概知道 `subgrid` 在做什麼之後，再回頭看 [MDN: Subgrid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Subgrid)
- 此篇文章提供範例與解說來幫助理解 `subgrid` 實務上的運用 [Ahmad Shadeed -- Learn CSS Subgrid](https://ishadeed.com/article/learn-css-subgrid/)
- 需要更多參考資源，可以查看 [web.dev -- CSS subgrid](https://web.dev/articles/css-subgrid)
