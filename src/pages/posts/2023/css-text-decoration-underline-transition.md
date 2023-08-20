---
layout: '@Components/SinglePostLayout.astro'
title: 對 CSS text-decoration underline 加上動畫效果
date: 2023-02-02 19:14:49
tag:
  - [CSS]
---

## 總結

想做出「滑鼠滑到超連結元件時，文字底線逐漸顯現」的效果，發現 `transition: text-decoration` 不管用，但可透過 `transition: text-decoration-color` 來實現。

## 筆記

下面的寫法很直覺但無效：滑鼠滑過去時底線會直接浮現，不會有漸變效果。

```css
a {
  text-decoration: none;
  transition: text-decoration 0.2s ease;
}

a:hover {
  text-decoration: underline;
}
```

理由：參考 [MDN: text-decoration](https://developer.mozilla.org/en-US/docs/Web/CSS/text-decoration) 中關於 Animation type 的說明，會發現 `text-decoration-style` 與 `text-decoration-line` 皆被標註為 `discrete`，亦即這兩組 CSS 樣式在樣式變化時，不會有補幀效果：

> [stackOverFlow](https://stackoverflow.com/questions/44510663/what-are-discrete-animations): Discrete animations proceed from one keyframe to the next without any interpolation.

w3c 對 `discrete` 的定義如下：

> [w3c](https://www.w3.org/TR/web-animations-1/#discrete): The property’s values cannot be meaningfully combined, thus it is not additive and interpolation swaps from Va to Vb at 50% (p=0.5)

但 `text-decoration-color` 是能表現出動畫效果的，所以如果只是要「滑鼠滑過，底線慢慢浮現」的效果，可透過以下方式達成：

```css
a {
  text-decoration: underline;
  text-decoration-color: transparent;
  transition: text-decoration-color 0.2s ease;
}

a:hover {
  text-decoration-color: black;
}
```

<p class="codepen" data-height="300" data-theme-id="dark" data-default-tab="css,result" data-slug-hash="OJwrypv" data-user="Charlie7779" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/Charlie7779/pen/OJwrypv">
  transition: text-decoration-color</a> by Charlie (<a href="https://codepen.io/Charlie7779">@Charlie7779</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

搞定。

## 參考文件

- [w3c: 5.2. Animating properties - discrete](https://www.w3.org/TR/web-animations-1/#discrete)
- [stackOverFlow: CSS transition not working with underline](https://stackoverflow.com/questions/30352431/css-transition-not-working-with-underline)
- [stackOverFlow: What are discrete animations?](https://stackoverflow.com/questions/44510663/what-are-discrete-animations)
