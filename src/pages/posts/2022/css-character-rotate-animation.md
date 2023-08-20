---
layout: '@Components/SinglePostLayout.astro'
title: 2022 第23週 實作筆記：使用 transform rotate() 實作過場動畫
date: 2022-06-08 16:41:45
tag:
  - [CSS]
---

## 總結

最終未被採用的過場動畫試做，記錄一下如何使用 CSS 搭配 `transform: rotate()` 做出在字母 O 中旋轉圓點的效果

<p class="codepen" data-height="300" data-default-tab="html,result" data-slug-hash="LYQJyyX" data-user="Charlie7779" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/Charlie7779/pen/LYQJyyX">
  animation test</a> by Charlie (<a href="https://codepen.io/Charlie7779">@Charlie7779</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

## 筆記

- 將裝載字母 O 的 div 設定為 `position: relative;` 後，搭配 `:before` 與 `radial-gradient` 畫出字母 O 中的圓點
- `radial-gradient` 的 `at <position>` 指定 gradient 從何處開始繪製，原理與 `background-position` 一致；原始碼中 `at 3px 3px` 即代表 gradient 從左上角向右、向下各偏移 3px 後作為起始點開始繪製
  - W3C 原文：`<position>` Determines the center of the gradient. The `<position>` value type (which is also used for background-position) is defined in [CSS-VALUES-3](https://drafts.csswg.org/css-images/#biblio-css-values-3), and is resolved using the center-point as the object area and the gradient box as the positioning area. If this argument is omitted, it defaults to center.
- 使用 `transform: rotate()` 旋選 `:before` 即可
- 原始碼中的 `background-color: rgba(255, 0, 255, 0.6);` 純粹是填色後方便檢查現在 `:before` 的推移位置，方便調整 top 與 left 數值

## 注意事項

- `radial-gradient()` 的 `at` syntax 目前並未被 safari 支援，亦即 iPhone 上的 Chrome 瀏覽器無法將字母 O 中的圓點設定在左上角 O<=

## 參考文件

- [Animations CSS Generator](https://webcode.tools/generators/css/keyframe-animation)
- [W3C 3.2.1. radial-gradient() Syntax](https://drafts.csswg.org/css-images/#radial-gradients)
- [Can I use: radial-gradient() "at" syntax](https://caniuse.com/mdn-css_types_image_gradient_radial-gradient_at)
