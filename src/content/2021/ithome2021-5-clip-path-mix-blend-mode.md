---
title: 30天挑戰：「clip-path搭配mix-blend-mode製作疊圖文字」技術記錄
date: 2021-08-13 08:38:15
tag:
  - [CSS]
  - [2021鐵人賽]
---

## 總結

使用 CSS `clip-path`與`mix-blend-mode`來做出文字疊圖混色的效果

<p class="codepen" data-height="720" data-theme-id="dark" data-default-tab="result" data-slug-hash="BaRbZYq" data-user="Charlie7779" style="height: 720px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/Charlie7779/pen/BaRbZYq">
  clip-path and mix-blend-mode</a> by Charlie (<a href="https://codepen.io/Charlie7779">@Charlie7779</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

## 原理拆解

- 使用`::before`與`::after`來寫字，同樣的文字寫兩套
- 使用`clip-path`遮去超出圖片範圍的`::after`文字，並加上`mix-blend-mode`來為文字上色
  - 算數時間：如何框出`clip-path`範圍？
  - 算式：`clip-path: inset( calc((100% - 320px) / 2) calc((100vw - 400px) / 2) calc((100% - 320px) / 2) calc((100vw - 400px) / 2) );`
  - `inset`代表`clip-path`形狀設定為矩形（[MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/clip-path#values): Defines an inset rectangle.）
  - `inset`括號內的 4 組數字分別代表`clip-path`上右下左的起始點（[W3C](https://drafts.csswg.org/css-shapes-1/#supported-basic-shapes): When all of the first four arguments are supplied they represent the **top, right, bottom and left** offsets from the reference box inward that define the positions of the edges of the inset rectangle.）
  - `clip-path`的上下範圍分別是`.landing` 100%的高度減去圖片的高度（320px）後除以 2
    ![藍色為.landing 100%之範圍](/2021/ithome2021-5-clip-path-mix-blend-mode/calc-1.jpg)
    ![紅色為圖片高度，黑線與.landing 100%高度相同，而黑線高減去圖片高後再除以2，就可得出覆蓋範圍](/2021/ithome2021-5-clip-path-mix-blend-mode/calc-2.jpg)
  - 左右範圍則是`100vw`減去圖片的寬度（400px）後除以 2，計算原理與高度相同
- `::before`部分的文字就順其自然地讓圖片擋住

## 補充

![GitHub host svg files](/2021/ithome2021-5-clip-path-mix-blend-mode/github-host-svg.png)

`.svg`檔案推到 GitHub repo 後，點選 raw 即可取得直連位置，在沒有購買 codepen 付費方案時，可做為 online svg hosting 的替代方式

## 參考文件

- [CSS-Tricks: mix-blend-mode](https://css-tricks.com/almanac/properties/m/mix-blend-mode/)
- [MDN: clip-path](https://developer.mozilla.org/en-US/docs/Web/CSS/clip-path)
