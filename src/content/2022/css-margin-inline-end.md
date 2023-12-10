---
title: CSS 筆記：Logical properties 中的 margin-inline-end
date: 2022-07-12 19:43:20
tag:
  - [CSS]
---

## 範例

![margin-inline-end example 1](/2022/css-margin-inline-end/demo-0.png)

![margin-inline-end example 2](/2022/css-margin-inline-end/demo-1.png)

- 使用 `margin-inline-end` 可以達成「文字與後方標籤保持距離，且確保標籤會緊跟在文字末端」
- 如果使用 `display: flex` 搭配 `gap` 無法做出「標籤緊跟在文字末端」的效果，因 `display: flex` 會把文字（儘管沒有透過 span 元素包起來）與標籤群分割為兩個不同的節點，標籤群便無法尾隨在文字區塊後方。

<p class="codepen" data-height="300" data-default-tab="html,result" data-slug-hash="eYMzrqG" data-user="Charlie7779" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/Charlie7779/pen/eYMzrqG">
  margin-inline-end</a> by Charlie (<a href="https://codepen.io/Charlie7779">@Charlie7779</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

## 筆記

### Logical properties

> MDN: The margin-inline-end CSS property defines the **logical inline end margin** of an element, which maps to a physical margin depending on the element's writing mode, directionality, and text orientation.

> web.dev: A **logical property** is one that references a side, corner or axis of the box model in context of the applicable language direction. It's akin to referencing someone's strong arm, rather than assuming it's their right arm. "Right" is a physical arm reference, "strong" is a logical arm reference, contextual to the individual.

### Inline dimension

> The dimension parallel to the **flow of text within a line**, i.e., the horizontal dimension in horizontal writing modes, and the vertical dimension in vertical writing modes. For standard English text, it is the horizontal dimension.

- 以英文為例，被 `margin-inline` 這類 logical properties 控制的是某元素**水平方向**的間距
- 但如果是中文（或日文）等直書文字，被 `margin-inline` 控制的會是**垂直方向**的間距

## 參考文件

- [MDN: margin-inline-end](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-inline-end)
- [MDN: CSS Logical Properties and Values](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties)
- [web.dev: Logical layout enhancements with flow-relative shorthands](https://web.dev/logical-property-shorthands/)
