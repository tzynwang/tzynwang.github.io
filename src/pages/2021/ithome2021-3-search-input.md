---
layout: '@Components/pages/SinglePostLayout.astro'
title: 30天挑戰：「純CSS製作:hover後顯示搜尋欄位」技術記錄
date: 2021-08-09 10:17:00
tag:
  - [CSS]
  - [2021鐵人賽]
---

## 總結

使用純 CSS 製作`:hover`後顯現`<input type="search">`的效果

![效果展示](/2021/ithome2021-3-search-input/hover-demo.gif)

<p class="codepen" data-height="600" data-theme-id="dark" data-default-tab="result" data-slug-hash="OJmmZrq" data-user="Charlie7779" style="height: 600px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/Charlie7779/pen/OJmmZrq">
  0717 landing</a> by Charlie (<a href="https://codepen.io/Charlie7779">@Charlie7779</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

## 筆記

### `header`結構

<script src="https://gist.github.com/tzynwang/586099faf3579fc44431af4814725dc3.js"></script>

### CSS

<script src="https://gist.github.com/tzynwang/b3f6faa3beca639fa1c7af52b2cca97d.js"></script>

- 第 2 行：設定作為容器的`.nav__search`為`position: relative;`，方便`#nav__search--input`進行定位
- 第 5 行：`flex-direction: row-reverse;`讓`<input type="search">`在視覺上位於`<label>`左手邊
  - 讓`<label>`在 HTML 結構上排序於`<input type="search">`之前是為了在`<label>`被`:hover`時可以去操作`<input type="search">`的樣式
  - 先`input`再`label`的話，無法透過 CSS 選取器從`label`反抓到`input`
- 第 22-23 行：`#nav__search--input`設定為`position: absolute;`，並`right: 0;`，使其根據容器`.nav__search`右側進行對齊
- 第 28-29 行：設定`border: 0;`與`outline: none;`取消任何外框線效果
- 第 36 行：`transform: scaleX(0);`令`#nav__search--input`在一般狀態下寬度為 0
- 第 37 行：`transform-origin: right;`使`#nav__search--input`的`:hover`變形效果從右側開始
- 第 41-45 行：在`.nav__search--label`被`:hover`後，或是`#nav__search--input`本身就被`:hover`或`:focus`時，展開`#nav__search--input`

## 參考文件

- [How to remove focus border (outline) around text/input boxes? (Chrome)](https://stackoverflow.com/questions/3397113/how-to-remove-focus-border-outline-around-text-input-boxes-chrome)
