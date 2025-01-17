---
title: 如何製作「帶圓角漸層邊框並且透明背景」的按鈕
date: 2024-12-28 21:57:36
tag:
- [CSS]
banner: /2024/how-to-gradient-rounded-border-button/barbara-zandoval-x_L2sLTLHTU-unsplash.jpg
summary: 懶人包：請設計師提供設定好漸層、圓角且背景透明的 .svg 檔，然後用 CSS `border-image` 設定按鈕的邊框樣式。
draft: 
---

懶人包：請設計師提供設定好漸層、圓角且背景透明的 .svg 檔，然後用 CSS `border-image` 設定按鈕的邊框樣式。

CSS `background-origin: border-box` 和 `padding-box` 的限制是**按鈕的背景必定要填色**，如果要透明背景的按鈕就無法用 `background-origin` 處理 🌚

## 步驟

如上方提過的，請設計師提供一版 .svg 格式的按鈕邊框檔案。以下是一個「左橘右綠漸層並且有 4px 圓角」的 1px 邊框：

```html
<svg
  width="64"
  height="64"
  viewBox="0 0 64 64"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <rect x="0.5" y="0.5" width="63" height="63" rx="4" stroke="url(#square)" />
  <defs>
    <linearGradient
      id="square"
      x1="63"
      y1="0"
      x2="0.5"
      y2="0"
      gradientUnits="userSpaceOnUse"
    >
      <stop stop-color="lime" />
      <stop offset="1" stop-color="orange" />
    </linearGradient>
  </defs>
</svg>
```

而因為載入外連圖檔需要時間（使用者會發現邊框晚一點才出現），所以選擇將上述檔案[轉成 Data URI 格式](https://www.svgviewer.dev/svg-to-data-uri)再餵給 `border-image-source`。到目前為止的 CSS 樣式如下：

```css
.btn-border-gradient {
  border-image-source: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjYzIiBoZWlnaHQ9IjYzIiByeD0iNCIgc3Ryb2tlPSJ1cmwoI3NxdWFyZSkiIC8+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9InNxdWFyZSIgeDE9IjYzIiB5MT0iMCIgeDI9IjAuNSIgeTI9IjAiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agc3RvcC1jb2xvcj0ibGltZSIgLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSJvcmFuZ2UiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KPC9zdmc+');
}
```

接著加上 `border-image-slice` / `border-image-width` / `border-image-repeat` 參數：

```css
.btn-border-gradient {
  border-image-source: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjYzIiBoZWlnaHQ9IjYzIiByeD0iNCIgc3Ryb2tlPSJ1cmwoI3NxdWFyZSkiIC8+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9InNxdWFyZSIgeDE9IjYzIiB5MT0iMCIgeDI9IjAuNSIgeTI9IjAiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agc3RvcC1jb2xvcj0ibGltZSIgLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSJvcmFuZ2UiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KPC9zdmc+');
  border-image-slice: 4;
  border-image-width: 4px;
  border-image-repeat: stretch;
}
```

這三組參數的用途如下：

- `border-image-slice` 指定瀏覽器將 `border-image-source` 切成九宮格時（可參考 [MDN 範例圖](https://developer.mozilla.org/en-US/docs/Web/CSS/border-image-slice)），下刀的位置要**距離圖片邊緣有多遠**；傳入 `4` 是為了**搭配設計稿的 4px 圓角**，代表「從圖片邊緣往中心走 `4px` 後再切」
- `border-image-width` 指定邊框的寬度，傳入 `4px` 搭配 `border-image-slice: 4` 後即可完整呈現設計稿的 4px 圓角；數字太小會讓圓角被裁掉
- `border-image-repeat` 設定為 `stretch` 代表拉伸圖片，所以即使我們提供正方形的 svg 背景圖，也能搭配長方形的按鈕

最後，這些設定可以壓成一行 `border-image` 如下：

```css
border-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjYzIiBoZWlnaHQ9IjYzIiByeD0iNCIgc3Ryb2tlPSJ1cmwoI3NxdWFyZSkiIC8+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9InNxdWFyZSIgeDE9IjYzIiB5MT0iMCIgeDI9IjAuNSIgeTI9IjAiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agc3RvcC1jb2xvcj0ibGltZSIgLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSJvcmFuZ2UiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KPC9zdmc+')
  4 / 4px stretch;
```

完成，你得到一個有 4px 圓角漸層邊框並且透明背景的按鈕了 🌈

## 附錄：svg 參數相關筆記

以本篇筆記的 svg 檔為例：

```html
<svg
  width="64"
  height="64"
  viewBox="0 0 64 64"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <rect x="0.5" y="0.5" width="63" height="63" rx="4" stroke="url(#square)" />
  <defs>
    <linearGradient
      id="square"
      x1="63"
      y1="0"
      x2="0.5"
      y2="0"
      gradientUnits="userSpaceOnUse"
    >
      <stop stop-color="lime" />
      <stop offset="1" stop-color="orange" />
    </linearGradient>
  </defs>
</svg>
```

`<svg />` 部分：

- `width="64" height="64"` 代表此 svg 的實際尺寸為 `64px * 64px`
- `viewBox="0 0 64 64"` 代表視埠（viewport）和 svg 的實際尺寸一樣大，且不進行任何縮放
- `fill="none"` 代表不填入任何背景色
- `xmlns="http://www.w3.org/2000/svg"` 代表這是一個 svg 檔案

`<rect />` 部分：

- `x="0.5" y="0.5" width="63" height="63"` 代表從座標 `(0.5, 0.5)` 繪製一個 `63px * 63px` 大的矩形
- `rx="4"` 代表[圓角尺寸](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/rx#rect)為 4px
- `stroke="url(#square)"` 代表這個矩形的**邊框**（[stroke](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Fills_and_Strokes#painting)）填色要參照 `<defs />` 中的 `id="square"`
- 因為沒有指定 `stroke-width` 所以邊框的寬度會是[預設值 `1px`](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-width#usage_notes)

`<defs />` / `<linearGradient />` / `<stop />` 部分：

- `x1="63" y1="0" x2="0.5" y2="0"` 代表漸層從座標 `(63, 0)` 開始，到 `(0.5, 0)` 結束——即從右**水平**畫到左
- `stop-color="lime"` 代表漸層中的第一組顏色是 `lime`
- `stop-color="orange"` 代表漸層中的第二組顏色是 `orange`；`offset` [傳入數字 `1` 等同傳入 `100%`](https://svgwg.org/svg2-draft/pservers.html#GradientStopAttributes)，可以用 [online viewer 修改參數](https://www.svgviewer.dev/)並觀察漸層的差別來體會這個參數的用途

將這個 svg 檔案用白話文來描述的話，就是「給我一個尺寸是 `64px * 64px`，底色透明，邊框 `1px` 寬且 `4px` 圓角，邊框顏色從右到左為萊姆色——橘色漸層」的圖檔。

## 參考文件

- [Production-grade gradient bordered, transparent, and rounded button](https://dev.to/noriste/production-grade-gradient-bordered-transparent-and-rounded-button-56h4)
- [Border Gradient with Border Radius](https://stackoverflow.com/questions/51496204/border-gradient-with-border-radius)
- [MDN SVG Elements -- `<stop>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/stop)
- [MDN SVG Attributes -- `x1`](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/x1)
