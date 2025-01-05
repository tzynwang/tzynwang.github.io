---
title: CSS :has / :is 選取器筆記
date: 2024-06-09 13:38:20
tag:
- [CSS]
banner: /2024/css-has-is-selector/agence-olloweb-Z2ImfOCafFk-unsplash.jpg
summary: 在休假前經手了一個 wordpress 的樣式調整任務，故趁機整理了一篇關於 CSS 選取器  :has() 和 :is() 的筆記。
draft: 
---

簡易的可操作範例可參考 [codepen](https://codepen.io/Charlie7779/pen/VwOPxQW)。

## :has()

> MND: `:has()` represents an element if any of the relative selectors that are passed as an argument match at least one element when anchored against this element. This pseudo-class presents a way of **selecting a parent element** or a previous sibling element with respect to a reference element by taking a relative selector list as an argument.

參數：（目標親元件、錨點）需要包含的子元件。

行為：選取包含指定元件的親元件。

注意事項：

- 在不支援 `:has()` 的瀏覽器中，整個選取區塊（selector block）就不會有任何作用（the entire selector block will fail）
- 不支援巢狀選取——不能在 `:has()` 裡再包一個 `:has()`
- 不支援偽元素（pseudo-elements）——既不能作為錨點，也不能作為參數傳入

---

選擇所有「包含 `.special` 元件」的 div 元件：

```css
div:has(.special) {
  border: 2px dashed salmon;
  color: gold;
}
```

選取所有「被 p 元件緊隨在後」的 h1 元件：

```css
h1:has(+ p) {
  margin-bottom: 0;
}
```

## :is()

> MDN: `:is()` takes a selector list as its argument, and selects any element that can be selected by one of the selectors in that list.

參數：一個列表（list），包含各種選取器（CSS selector）。

行為：選取任何在參數列表中的元件。

注意事項：

- 參數列表中的每一個選取器都會獨立運作，不支援、無效的選取器會被瀏覽器無視。可參閱 [MDN: Forgiving selector list](https://developer.mozilla.org/en-US/docs/Web/CSS/Selector_list#forgiving_selector_list)
- `:is()` 本身的權重（specificity）會根據其參數列表中最高權重的選取器決定——順帶一提，功能完全相同的 `:where()` 則是 0 權重（The difference between `:where()` and `:is()` is that `:where()` always has 0 specificity, whereas `:is()` takes on the specificity of the most specific selector in its arguments）；權重範例可參考 [Comparing :where() and :is()](https://developer.mozilla.org/en-US/docs/Web/CSS/:where#comparing_where_and_is)

---

選取所有親元件是 `.parent1` 或 `.parent2` 的 `.child` 元件：

```css
:is(.parent1, .parent2) .child {
  color: skyblue;
}
```

由 mdn 提供的最佳優化範例——比如以下又臭又長的樣式：

```css
ol ol ul,
ol ul ul,
ol menu ul,
ol dir ul,
ol ol menu,
ol ul menu,
ol menu menu,
ol dir menu,
ol ol dir,
ol ul dir,
ol menu dir,
ol dir dir,
ul ol ul,
ul ul ul,
ul menu ul,
ul dir ul,
ul ol menu,
ul ul menu,
ul menu menu,
ul dir menu,
ul ol dir,
ul ul dir,
ul menu dir,
ul dir dir,
menu ol ul,
menu ul ul,
menu menu ul,
menu dir ul,
menu ol menu,
menu ul menu,
menu menu menu,
menu dir menu,
menu ol dir,
menu ul dir,
menu menu dir,
menu dir dir,
dir ol ul,
dir ul ul,
dir menu ul,
dir dir ul,
dir ol menu,
dir ul menu,
dir menu menu,
dir dir menu,
dir ol dir,
dir ul dir,
dir menu dir,
dir dir dir {
  list-style-type: square;
}
```

可以簡化成以下：

```css
:is(ol, ul, menu, dir) :is(ol, ul, menu, dir) :is(ul, menu, dir) {
  list-style-type: square;
}
```

簡直是魔法 🪄

## 支援度（2024/6）

![caniuse: css :has() selector](/2024/css-has-is-selector/caniuse-css-has.png)

![caniuse: css :is() selector](/2024/css-has-is-selector/caniuse-css-is.png)

## 參考文章

- [MDN > CSS > :has()](https://developer.mozilla.org/en-US/docs/Web/CSS/:has)
- [MDN > CSS > :is()](https://developer.mozilla.org/en-US/docs/Web/CSS/:is)
