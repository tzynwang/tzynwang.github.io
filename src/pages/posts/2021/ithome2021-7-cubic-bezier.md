---
layout: '@Components/pages/SinglePostLayout.astro'
title: 30天挑戰：「漢堡按鈕動畫與cubic-bezier()」 相關筆記
date: 2021-08-17 10:11:42
tag:
  - [CSS]
  - [2021鐵人賽]
---

## 總結

僅透過`transition`與`cubic-bezier()`製作出漢堡選單在開闔之間的圖示動畫

## 筆記

### cubic-bezier()

#### W3S

- A transition effect with **variable speed from start to end**.
- 可設定 transition 效果在不同階段的速度

#### MDN

- The `<easing-function>` denotes a mathematical function that describes the **rate** at which **a numerical value changes**.
- 描述數值變換的速度
- The easing functions in the cubic-bezier subset of easing functions are often called "smooth" easing functions, because they can be used to **smooth down the start and end of the interpolation**.
- The calculated output can sometimes grow to be **greater than 1.0 or smaller than 0.0** during the course of an animation. This causes the value to **go farther** than the final state, and then return. In animations, for some properties, such as left or right, this creates a kind of **"bouncing" effect**.
- 參考以下 gif，在`cubic-bezier(x1, y1, x2, y2)`的`y2`大於 1 的時候，移動範圍會先超出終點再回彈
  ![cubic-bezier(.17, .85, .32, 1.28)](/2021/ithome2021-7-cubic-bezier/cubic-bezier-demo.gif)
- `y1`小於 0 而`y2`大於 1 的情況下，即可在動畫開始與結束時都表現出彈性效果
  ![y1與y2的值可大於1或小於0](/2021/ithome2021-7-cubic-bezier/cubic-bezier-demo-2.gif)
- `x1` and `x2` must be in the range [0, 1] or the value is invalid.

## 實作

<p class="codepen" data-height="300" data-default-tab="css,result" data-slug-hash="wvdZqEv" data-user="Charlie7779" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/Charlie7779/pen/wvdZqEv">
  hamburger cubic-bezier</a> by Charlie (<a href="https://codepen.io/Charlie7779">@Charlie7779</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

- 漢堡線的`cubic-bezier()`數值設定為`cubic-bezier(0.175, 0.885, 0.32, 1.285)`，代表起步速度大，收尾前先超出終點、後回彈
- 點選範例可觀察到漢堡線在 transition 結束前，都會先略為超出原始範圍、再返回，製作出彈性效果

## 參考文件

- [W3Schools: CSS cubic-bezier() Function](https://www.w3schools.com/cssref/func_cubic-bezier.asp)
- [MDN: easing-function](https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function)
- [YouTube: Cubic Bezier Curves](https://youtu.be/TeXajQ62yZ8)
- [cubic-bezier() 數值模擬器](https://cubic-bezier.com/#.17,.67,.83,.67)
