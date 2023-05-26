---
title: 使用 CSS `content` 與 `counter` 設定序列的數字樣式
date: 2023-05-26 19:35:39
categories:
  - [CSS]
---

## 總結

除了可以透過 `display: list-item` 搭配 `::marker` 來設定序列樣式外，也可透過 CSS `content` 搭配 `counter()` 來實現類似的效果，且後者因為不強制使用 `display: list-item` 會讓排版更為簡單。此篇筆記會介紹一下兩者的實作方式。

## 筆記

### 展示

<iframe src="https://codesandbox.io/embed/css-content-with-counter-6mkfsi?fontsize=14&hidenavigation=1&module=%2Fsrc%2Fstyles.css&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="CSS content with counter"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

### 實作解說

傳統做法：使用 `display: list-item` 讓 `li` 元件產生 `::marker` 部位，再透過指定 `::marker` 的 `content` 來設定序列的樣式。在範例中指定的樣式為 `decimal` 搭配小括號

小缺點：因為 `display` 固定為 `list-item` 了，排版上不如 flex box 方便。

```css
.list_container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  counter-reset: fruit-item;
  list-style-position: inside;
}

.display_list_item {
  display: list-item;
  /* 依照 .display_list_item 來增加序列數字  */
  counter-increment: fruit-item;
}

.display_list_item::marker {
  /* 使用十進制數字來作為序列樣式，並前後包夾小括號 */
  content: '(' counter(fruit-item, decimal) ')';
}
```

---

使用 `::before` 等偽元素來做出序列數字：想要在 `li` 元件中可以透過 `display: flex` 來排版的話，可在 `li` 元件中新增一個專門用來顯示數字的 `span` 元件，透過 CSS 指定此 `span::before` 的 `content` 來呈現序列。

全部的 `list-style-type` 可以參考 [MDN: CSS > list-style-type Values](https://developer.mozilla.org/en-US/docs/Web/CSS/list-style-type#values)

```html
<!-- 下圖的 .counter 會負責呈現序列數字 -->
<li key="{item.id}" className="list_item">
  <span className="counter" />
  <span className="item_value">{item.value}</span>
  <button onClick="{removeItem(item.id)}">remove this</button>
</li>
```

```css
.counter::before {
  /* 原理與上方的 .display_list_item::marker 一樣，都是透過 content counter 來指定序列數字樣式 */
  content: counter(fruit-item, trad-chinese-informal) '、';
}
```

### 注意事項

CSS 偽元素沒辦法透過 `inline-style` 來設定，參考 W3C 規格：

> The value of the style attribute must match the syntax of the contents of a CSS declaration block (excluding the delimiting braces), whose formal grammar is given below in the terms and conventions of the CSS core grammar:

```plaintext
declaration-list
  : S* declaration? [ ';' S* declaration? ]*
  ;
```

> [stackOverFlow](https://stackoverflow.com/a/5293299): Neither selectors (including pseudo-elements), nor at-rules, nor any other CSS construct are allowed.

如果在畫面上有「根據不同條件來顯示對應的序列樣式」需求，需要根據條件一個一個產生對應的 css 樣式名稱。

## 參考文件

- [MDN: CSS > display-listitem](https://developer.mozilla.org/en-US/docs/Web/CSS/display-listitem)
- [MDN: CSS > content](https://developer.mozilla.org/en-US/docs/Web/CSS/content)
- [MDN: CSS > list-style-type](https://developer.mozilla.org/en-US/docs/Web/CSS/list-style-type)
- [stackOverFlow: CSS Pseudo-classes with inline styles](https://stackoverflow.com/questions/5293280/css-pseudo-classes-with-inline-styles)
- [stackOverFlow: Using CSS :before and :after pseudo-elements with inline CSS?](https://stackoverflow.com/questions/14141374/using-css-before-and-after-pseudo-elements-with-inline-css)
