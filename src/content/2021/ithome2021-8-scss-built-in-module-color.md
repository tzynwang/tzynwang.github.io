---
title: 30天挑戰：「SCSS built-in color module」相關筆記
date: 2021-08-19 09:54:32
tag:
  - [CSS]
  - [2021鐵人賽]
---

## 總結

SCSS 本身即內建`color`模組來調整顏色的亮度、透明度，也可直接回傳負片或去飽和度的結果

<p class="codepen" data-height="350" data-default-tab="css,result" data-slug-hash="oNWrgqG" data-user="Charlie7779" style="height: 350px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/Charlie7779/pen/oNWrgqG">
  scss:color</a> by Charlie (<a href="https://codepen.io/Charlie7779">@Charlie7779</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

## 筆記

- Dart Sass: supports this feature since `1.23.0`
- Only Dart Sass currently supports loading built-in modules with `@use`. Users of other implementations must call functions using their global names instead.
  - 不透過`@use`載入`color`模組的話，則直接呼叫 functions 的 global names；比如`color.scale(...)`改為呼叫`scale-color(...)`
- `color: scale-color(red, $lightness: -50%);`：套用傳入的顏色，但降低亮度 50%
- `color: scale-color(red, $lightness: 50%);`：套用傳入的顏色，但提昇亮度 50%
- `color: grayscale(red);`：套用去除飽和度後的傳入顏色
- `color: invert(red);`：套用負片後的傳入顏色
- `color: scale-color(red, $alpha: -75%);`：
  - 範例中`-75%`的意義為「讓傳入的顏色剩下 25%的透明度」
  - 編譯後的 CSS 為`color: rgba(255, 0, 0, 0.25);`
  - `$alpha`的值設定為負數才有透明效果；`0%`為不修改透明度，`-100%`代表完全透明

## 參考資料

- [sass:color](https://sass-lang.com/documentation/modules/color)
