---
title: 變形的秩序（CSS transform order matters）
date: 2025-07-05 18:40:31
tag:
- [CSS]
banner: /2025/css-transform-order-matters/Las_Meninas_by_Diego_Velázquez.jpg
summary: 你知道嗎，CSS `transform` 的順序會影響元件的變形結果。
draft: 
---

## 懶人包

### 事物的秩序[^1]

你知道嗎，CSS `transform` 的順序會影響元件的變形結果。

比如以下[借自 MDN 的 CSS class 樣式](https://developer.mozilla.org/en-US/docs/Web/CSS/transform#transform_order)，將其套用到 `div` 元件後，會發現`.one` 和 `.two` 的變形結果不同：

```css
.one {
  transform: translateX(200px) rotate(135deg);
}
.two {
  transform: rotate(135deg) translateX(200px);
}
```

<p class="codepen" data-height="300" data-default-tab="result" data-slug-hash="PwqxZJz" data-pen-title="transform order matter" data-preview="true" data-user="Charlie7779" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/Charlie7779/pen/PwqxZJz">
  transform order matter</a> by Charlie (<a href="https://codepen.io/Charlie7779">@Charlie7779</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://public.codepenassets.com/embed/index.js"></script>

為什麼？因為執行變形時，會將 transformation functions （即 `translateX()` /  `rotate()` 等）**轉為矩陣，並從左側一路往右乘**。但**因為矩陣乘法並不符合交換律**，所以變形的順序會影響結果。

### 如果我就是不想在乎順序呢？

😠：我只是來切版的，不要跟我講數學，就沒有不管順序的方法嗎？

🦊：還真的有。大部分的瀏覽器現在都支援「直接指定 [rotate](https://developer.mozilla.org/en-US/docs/Web/CSS/rotate)/[scale](https://developer.mozilla.org/en-US/docs/Web/CSS/scale)/[translate](https://developer.mozilla.org/en-US/docs/Web/CSS/translate) 的值來進行變形」。所以上方範例可以改寫為：

```css
.one {
  translate: 200px 0;
  rotate: 135deg;
}

.two {
  rotate: 135deg;
  translate: 200px 0;
}
```

然後你會發現現在兩個 `div` 的變形結果一樣了 🌹：

<p class="codepen" data-height="300" data-default-tab="result" data-slug-hash="xbGoNbR" data-pen-title="I want to get rid of transform order" data-preview="true" data-user="Charlie7779" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/Charlie7779/pen/xbGoNbR">
  I want to get rid of transform order</a> by Charlie (<a href="https://codepen.io/Charlie7779">@Charlie7779</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://public.codepenassets.com/embed/index.js"></script>

## 為什麼順序有差——CSS Transforms Module Level 1 規格陪讀

首先 [CSS Transforms Module Level 1](https://drafts.csswg.org/css-transforms/) 第三節與第八節是這樣寫的：

> [3. The transform Property](https://drafts.csswg.org/css-transforms-1/#transform-property): The final transformation value for a coordinate system is obtained by **converting each function in the list to its corresponding matrix** like defined in Mathematical Description of Transform Functions, then **multiplying the matrices**.

> [8. The Transform Function Lists](https://drafts.csswg.org/css-transforms-1/#transform-function-lists): The resulting transform is the matrix multiplication of the list of transforms.

變形結果是「根據每一個 transform function 的矩陣相乘後」得出來的。而每一個 transform function 的矩陣型態要去看 [12. Mathematical Description of Transform Functions](https://drafts.csswg.org/css-transforms-1/#mathematical-description)。比如 `translate()` 的矩陣長這樣：

![CSS transform function "translate" in matrix format](/2025/css-transform-order-matters/matrix-translate.png)

而 `rotate()` 的長這樣：

![CSS transform function "rotate" in matrix format](/2025/css-transform-order-matters/matrix-rotate.png)

最後，把本篇文章一開始的舉例抓回來。`transform: translateX(200px) rotate(135deg);` 轉成矩陣並相乘後的結果是：

![math result of "first translateX, then rotate"](/2025/css-transform-order-matters/first-translate-then-rotate.png)

而 `transform: rotate(135deg) translateX(200px);` 轉成矩陣並相乘後的結果是：

![math result of "first rotate, then translateX"](/2025/css-transform-order-matters/first-rotate-then-translate.png)

兩種 CSS class 樣式最終得出的乘積不同，確認 transform function 的順序會影響變形結果。

## 參考文獻

- [Animating zooming using CSS: transform order is important… sometimes](https://jakearchibald.com/2025/animating-zooming/)
- [W3C::: CSS Transforms Module Level 1](https://drafts.csswg.org/css-transforms-1/)
- [MDN::: CSS rotate](https://developer.mozilla.org/en-US/docs/Web/CSS/rotate)
- [MDN::: CSS scale](https://developer.mozilla.org/en-US/docs/Web/CSS/scale)
- [MDN::: CSS translate](https://developer.mozilla.org/en-US/docs/Web/CSS/translate)
- [YouTube::: A new way to do CSS transforms! | Kevin Powell](https://www.youtube.com/watch?v=sEBTTw9nwt0)

[^1]: 我無法放過致敬傅柯的任何機會 🌚
