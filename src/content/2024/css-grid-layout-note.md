---
title: 快速筆記：用 grid 搞定佈局變化較大的 RWD
date: 2024-12-14 10:48:41
tag:
- [CSS]
banner: /2024/css-grid-layout-note/gleb-gurenko-EEeRzM3U_XQ-unsplash.jpg
summary: 標題有點難下。簡單來說就是除了靠傳統的 fixed 搭配一大堆 margin 跟 height 計算之外，其實也可以考慮用 grid-template-columns/rows 搭配 grid-column/rows 來處理一些大小版佈局變化較明顯的排版。
draft: 
---

這篇是給未來的自己當備忘錄的 grid 排版筆記。我流重點如下：

- 要**佔滿剩下所有的空間**時，使用 `fr`
- **只拿自己需要的空間**時，使用 `min-content`
- 需要明定尺寸範圍時，使用 `minmax([保底尺寸], [最大使用尺寸])`

## 範例

需要顯示長文，但設計稿又帶了一些固定高的部位：

<p class="codepen" data-height="300" data-theme-id="dark" data-default-tab="css,result" data-slug-hash="LEPZeov" data-pen-title="grid-template layout 1" data-preview="true" data-user="Charlie7779" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/Charlie7779/pen/LEPZeov">
  grid-template layout 1</a> by Charlie (<a href="https://codepen.io/Charlie7779">@Charlie7779</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

透過 `main` 的 `grid-template-rows` 和 `section` 的 `grid-row: 3 / 4` 來做出「並非垂直置中，而是中間偏上」的排版效果：

<p class="codepen" data-height="300" data-theme-id="dark" data-default-tab="css,result" data-slug-hash="mybOwzq" data-pen-title="grid template layout 2" data-preview="true" data-user="Charlie7779" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/Charlie7779/pen/mybOwzq">
  grid template layout 2</a> by Charlie (<a href="https://codepen.io/Charlie7779">@Charlie7779</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

## 參考文件

- [MDN CSS grid layout -- The `fr` unit](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Basic_concepts_of_grid_layout#the_fr_unit)
- [MDN CSS `min-content`](https://developer.mozilla.org/en-US/docs/Web/CSS/min-content)
- [MDN CSS `minmax()`](https://developer.mozilla.org/en-US/docs/Web/CSS/minmax)
- [CSS to Tailwind Converter](https://www.loopple.com/tools/css-to-tailwind-converter)
