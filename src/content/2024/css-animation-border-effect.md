---
title: CSS 筆記：邊線動畫效果
date: 2024-03-24 20:39:33
tag:
- [CSS]
banner: /2024/css-animation-border-effect/daniele-levis-pelusi--aEpe2N916c-unsplash.jpg
summary: 最近在做的 to c 產品需要一些小動畫來幫忙活絡氣氛，記錄一下如何透過 `:before` `:after` 以及 `conic-gradient()` 來做出邊線動畫效果 🪄
draft: 
---

## 成品展示

hover 目標元件後，會觸發邊線動畫效果：

<p class="codepen" data-height="300" data-theme-id="dark" data-default-tab="css,result" data-slug-hash="MWRmezy" data-user="Charlie7779" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/Charlie7779/pen/MWRmezy">
  css border animation</a> by Charlie (<a href="https://codepen.io/Charlie7779">@Charlie7779</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

## 實作步驟

### 元件基本樣式

首先設定目標元件的基本樣式：

```css
.card {
  position: relative;
  width: 240px;
  height: 320px;
  background-color: var(--card-bg);
  border-radius: 4px;
  /*  vars  */
  --card-bg: #333;
  --offset: 2px;
}
```

- 需要 `position: relative;` 來幫忙定位設定為 `position: absolute;` 的 `:before` 與 `:after` 部位
- 將後續會重複使用到的背景色 `--card-bg` 與邊線寬度 `--offset` 設定成變數

![step 1](/2024/css-animation-border-effect/step-1-base.png)

### 透過偽元素畫出之後要動起來的線條

接著在 `:before` 畫出色塊。核心是 `background: conic-gradient();` 的數值 `var(--card-bg) 270deg, red, var(--card-bg)`——代表我們要先用 `var(--card-bg)` 畫滿四分之三的區塊，剩下的部分再填入紅色與 `var(--card-bg)`：

```css
.card:hover:before {
  content: '';
  position: absolute;
  width: 150%;
  height: 150%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: conic-gradient(var(--card-bg) 270deg, red, var(--card-bg));
}
```

![step 2](/2024/css-animation-border-effect/step-2-before.png)

然後設定 `:after` 的尺寸與定位，使其擋住 `:before` 的內容，露出目標元件：

```css
.card:hover:after {
  content: '';
  position: absolute;
  height: calc(100% - 2 * var(--offset));
  width: calc(100% - 2 * var(--offset));
  inset: var(--offset);
  border-radius: inherit;
  background-color: var(--card-bg);
}
```

- `height` 與 `width` 的作用是「元件扣掉上下、左右邊線寬度」後，要在視覺上扣除的 `:before` 範圍
- `inset` 是 `top` / `right` / `bottom` / `left` 的簡寫，負責定位

![step 3](/2024/css-animation-border-effect/step-3-after.png)

如果看不出來 `:after` 的樣式到底在幹麼，可以調整背景色觀察：

![step 3 with bg color lime](/2024/css-animation-border-effect/step-3-after-bg-lime.png)

### 轉動色塊

加上動畫效果：

```css
@keyframes border-rotate {
  from {
    transform: translate(-50%, -50%) scale(1.8) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) scale(1.4) rotate(360deg);
  }
}
```

```css
.card:hover:before {
  /* 其餘既存樣式不變 */
  animation: 1.4s cubic-bezier(0.83, 0, 0.17, 1) 0s both border-rotate infinite;
}
```

目前 hover 後會變成這樣：

<video controls width="100%">
  <source src="/2024/css-animation-border-effect/hover-animation.mp4" type="video/mp4" />
</video>

補上最後一個步驟——在目標元件的樣式加上 `overflow: hidden;` 後，即可扣除多餘部分：

```css
.card {
  /* 其餘既存樣式不變 */
  overflow: hidden;
}
```

完成 🎉

<video controls width="100%">
  <source src="/2024/css-animation-border-effect/done.mp4" type="video/mp4" />
</video>

## 參考資料

- [MDN CSS: conic-gradient()](https://developer.mozilla.org/en-US/docs/Web/CSS/gradient/conic-gradient)
- [Easing Functions Cheat Sheet](https://easings.net/)
- [Keyframe Animation CSS Generator](https://webcode.tools/css-generator/keyframe-animation)
