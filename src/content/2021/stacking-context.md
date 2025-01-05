---
title: 「z-index與stacking context」相關筆記
date: 2021-08-16 13:33:27
tag:
- [CSS]
---

## 原始問題

> Describe `z-index` and how stacking context is formed.

Reference: [front-end-interview-handbook](https://github.com/yangshun/front-end-interview-handbook/blob/master/contents/en/css-questions.md#describe-z-index-and-how-stacking-context-is-formed)

- `z-index`是什麼？
- 哪些 CSS 設定會產生新的`stacking context`？

## 筆記

### z-index 是什麼？

#### [W3C](https://drafts.csswg.org/css2/#z-index)

- Specifying the **stack level**.
- Initial value: auto. Means the stack level of the generated box in the current stacking context is **0**. The box **does not establish a new stacking context** unless it is the root element.
- Applies to: positioned elements
- For a **positioned box**, the z-index property specifies the **stack level** of the box in the current stacking context, and whether the box **establishes a stacking context**.
- 對 position 不為 static 的元素來說，`z-index`的值代表該元素的 stack level，以及該元素是否會建立新的 stacking context
- Each box belongs to one stacking context. Each positioned box in a given stacking context has an integer stack level, which is its position on the z-axis relative other stack levels within the same stacking context.
- Boxes with greater stack levels are always formatted in front of boxes with lower stack levels. Boxes may have negative stack levels.
- Boxes with the **same stack level** in a stacking context are stacked back-to-front **according to document tree order**.

#### MDN 1

- The `z-index` attribute lets you adjust **the order of the layering of objects** when rendering content.
- In CSS 2.1, each box has a position in three dimensions. In addition to their horizontal and vertical positions, boxes lie along a "z-axis" and are formatted one on top of the other. Z-axis positions are particularly relevant when boxes **overlap** visually.
- The Z position of each layer is expressed as an integer representing the stacking order for rendering. **Greater numbers mean closer to the observer.**
- `z-index`控制元素在視覺上的堆疊順序，元素的`z-index`值越大，代表在 Z 軸上離使用者（observer）越近；反之`z-index`越小（或甚至設定為負值的情況下）則代表該元素在 Z 軸上離使用者越遠
- If you want to create a custom stacking order, you can use the `z-index` property on a **positioned element**.
- 一個元素的 position 須設定為`static`以外的值，`z-index`才會發揮功能；替`position: static;`的元素加上`z-index`不會影響其 Z 軸的排序

#### Front End Interview Handbook 1

- The `z-index` property in CSS controls the vertical stacking order of elements that overlap. `z-index` only affects elements that have a position value which is not `static`.
- Without any `z-index` value, elements stack in the order that they appear in the DOM (the lowest one down at the same hierarchy level appears on top). Elements with non-static positioning (and their children) will always appear on top of elements with default static positioning, regardless of HTML hierarchy.

### stacking context 是什麼？

#### [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context)

- The stacking context is **a three-dimensional conceptualization** of HTML elements along an imaginary z-axis relative to the user, who is assumed to be facing the viewport or the webpage. HTML elements occupy this space in priority order based on element attributes.
- Each stacking context is **completely independent of its siblings**, only descendant elements are considered when stacking is processed. Each stacking context is self-contained, after the element's contents are stacked, the whole element is considered in the stacking order of the parent stacking context.
- 某元素若建立了一個 stacking context，則該元素與其子代元素的堆疊狀態就不會去影響到其他元素，因該元素的子代元素都被限制在這個 stacking context 裡面了

#### [前端三十](https://ithelp.ithome.com.tw/articles/10217945)

- 在網頁排版時，預設的元素排列會是由上到下、由左到右的依序排列；開發者如果想要調整或固定特定元素的位置，會透過設定 position 為 relative、absolute、fixed，讓指定的元素可以從原本的排列位置移動，甚至離開（Out of Flow）。
- 而這時，也就**產生了一個新的 CSS 堆疊環境**，從此這個元素及它的子元素，就自成一國，他們的排列也就**與其他的堆疊環境無關了**。

#### Front End Interview Handbook 2

- A stacking context is **an element that contains a set of layers**.
- Within a stacking context, the z-index values of one element's children are **set relative to that (parent) element**, rather than to the document root.
- Each stacking context is **self-contained**, after the element's contents are stacked, the whole element is considered in the stacking order of the parent stacking context.
- Layers outside of that context (i.e. sibling elements of a local stacking context) can't sit between layers within it.
- stacking context 中的子代元素，其 z-index 就算設定的比 stacking context 外部的元素還要大，該子代元素也**無法覆蓋在 stacking context 外的元素上**

#### What No One Told You About Z-Index

- Groups of elements **with a common parent that move forward or backward together** in the stacking order make up what is known as a stacking context.
- Every stacking context has a single HTML element as its root element. When a new stacking context is formed on an element, that stacking context confines all of its child elements to a particular place in the stacking order.
- This means if an element is contained in a stacking context at the bottom of the stacking order, there is no way to get it to appear in front of another element **in a different stacking context** that is higher in the stacking order, even with a z-index of a billion!

### stacking context 如何產生？

#### W3C

- The root element forms the root stacking context. Other stacking contexts are generated by any positioned element (including relatively positioned elements) having a computed value of **`z-index` other than auto**.
- `z-index`不為`auto`的 positioned element 會建立新的 stacking contexts

#### MDN 2

- Element with a position value `absolute` or `relative` and `z-index` value other than `auto`.
- Element with a position value `fixed` or `sticky`.
- Element that is a child of a `flex` or `grid` container, with `z-index` value other than `auto`.
- Element with a `opacity` value less than `1`.
- Element with a `mix-blend-mode` value other than `normal`.
- Element with any of the following properties with value other than `none`:
  - `transform`
  - `filter`
  - `perspective`
  - `clip-path`
  - `mask`, `mask-image`, `mask-border`
- Element with a `isolation` value `isolate`. (The `isolation` CSS property determines whether an element must create a new stacking context. `isolation`設定為`isolate`即可直接建立新的 stacking context)
- Element with a `-webkit-overflow-scrolling` value `touch`.
- Element with a `will-change` value specifying any property that would create a stacking context on non-initial value.
- Element with a `contain` value of `layout`, or `paint`, or a composite value that includes either of them (i.e. contain: strict, contain: content).

## 實作

<p class="codepen" data-height="300" data-default-tab="css,result" data-slug-hash="qBmwLLY" data-user="Charlie7779" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/Charlie7779/pen/qBmwLLY">
  nav (z-index)</a> by Charlie (<a href="https://codepen.io/Charlie7779">@Charlie7779</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

在僅有一組`nav`元素的情況下做出「`nav`展開時，從`header`下方滑出」的視覺效果

- 小版面：`nav`會從`header`下方滑出，`header`沒有固定
  - `header`設定為`display: flex;`但沒有指定`z-index`，沒有產生新的 stacking context
  - `label`設定為`position: relative;`但沒有指定`z-index`，沒有產生新的 stacking context
  - `nav`設定為`position: absolute;`與`z-index: -1;`，產生 stacking context，並視覺上會從`header`下方滑出
  - `main`設定為`position: relative;`與`z-index: -2;`，產生 stacking context，且 Z 軸順序比`nav`還要下方，不會遮蓋到`nav`
- 大版面：`header`固定在視窗頂部
  - `header`設定為`position: fixed;`與`z-index: 99;`，產生 stacking context，視覺上永遠固定在畫面最上方
  - `nav`設定為`position: static;`，取消 stacking context

## 參考文件

- [MDN: The stacking context](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context)
- [W3C Appendix E: Elaborate description of Stacking Contexts](https://drafts.csswg.org/css2/#elaborate-stacking-contexts)
- [StackOverFlow: Why can't an element with a z-index value cover its child?](https://stackoverflow.com/questions/54897916/why-cant-an-element-with-a-z-index-value-cover-its-child)
- [StackOverFlow: How to get a parent element to appear above child](https://stackoverflow.com/questions/1806421/how-to-get-a-parent-element-to-appear-above-child)
- [What No One Told You About Z-Index](https://philipwalton.com/articles/what-no-one-told-you-about-z-index/)
- [YouTube: Solve your z-index issues | z-index and stacking context explained](https://youtu.be/uS8l4YRXbaw)
- [04. [CSS] z-index 與 Stacking Context 的關係是什麼？](https://ithelp.ithome.com.tw/articles/10217945)
- [Everything You Need to Know About the CSS will-change Property](https://dev.opera.com/articles/css-will-change-property/)
