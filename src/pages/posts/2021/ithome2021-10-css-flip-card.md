---
layout: '@Components/SinglePostLayout.astro'
title: 30天挑戰：「CSS雙面卡片與動畫」 相關筆記
date: 2021-08-23 10:00:47
tag:
  - [CSS]
  - [2021鐵人賽]
---

## 總結

僅使用`transform`來做出「滑鼠 hover 後，卡片出現翻頁效果」的動畫

<p class="codepen" data-height="400" data-default-tab="css,result" data-slug-hash="rNmEmKY" data-user="Charlie7779" style="height: 400px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/Charlie7779/pen/rNmEmKY">
  2-side flip card</a> by Charlie (<a href="https://codepen.io/Charlie7779">@Charlie7779</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

## 筆記

<script src="https://gist.github.com/tzynwang/4e52550bb559c1aedd68a712540cb634.js"></script>

### HTML

- 相對單純，使用一個`.card`容器包裹卡片的兩面內容`card--front`與`card--back`

### CSS

- 第 2 行：設定`position: relative;`讓`.card`成為`card--front`與`card--back`的定位點
- 第 8 行：`perspective: 9999px;`讓卡片在翻動時，在視覺上不會離使用者太近；可參考下圖兩種數值的呈現結果
  ![perspective 99px](/2021/ithome2021-10-css-flip-card/perspective-99px.png)
  ![perspective 99999px](/2021/ithome2021-10-css-flip-card/perspective-99999px.png)
- 第 16 行：`[class^="card--"]`代表選取所有`.card`下並 class 開頭是`card--`的元素
- 第 25 行：`backface-visibility: hidden;`讓卡片內容不穿透到另外一面
- 第 43 行：`transform: rotateY(180deg);`代表卡片背面一開始就已經進入「被翻面」的狀態
- 第 46-55 行：hover 後卡片本身在 Y 軸提高 4px（`transform: translateY(-4px);`）、卡片正面翻轉 180 度（`transform: rotateY(180deg);`），而卡片背面則轉回正面（`transform: rotateY(360deg);`）

## 參考文件

- [Udemy: Advanced CSS and Sass](https://www.udemy.com/course/advanced-css-and-sass/)
- [MDN: backface-visibility](https://developer.mozilla.org/en-US/docs/Web/CSS/backface-visibility)
- [MDN: perspective](https://developer.mozilla.org/en-US/docs/Web/CSS/perspective)
- [MDN: rotateY()](<https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/rotateY()>)
