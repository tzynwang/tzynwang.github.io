---
title: 如何設定 view transition 動畫效果
date: 2025-01-11 08:47:19
tag:
  - [CSS]
  - [Web api]
banner: /2025/how-to-view-transition-animation/daniel-olah-0GOUcmFYsZ4-unsplash.jpg
summary: 先透過 view-transition-name 標記出要帶 view transition 效果的元件，再搭配 ::view-transition-group() / ::view-transition-old() / ::view-transition-new() 將動畫掛給特定元件
draft:
---

懶人包：

- 先透過 `view-transition-name` 標記出要帶 view transition 效果的元件，再搭配 `::view-transition-group()` / `::view-transition-old()` / `::view-transition-new()` 將動畫掛給特定元件
- 不知為何，當我根據 [react router 的文件](https://reactrouter.com/how-to/view-transitions)在 `Link` 元件設定 `props.viewTransition` 時，畫面上沒有出現任何 view transition 效果 🌚 目前的 work around 是對 `Link` 傳入 `onClick={() => document.startViewTransition()}`

## 自訂根節點（:root）動畫效果

從 [MDN](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API/Using) 可得知瀏覽器預設 `:root` 元件的 `view-transition-name` 為 `root` 並且提供以下動畫效果：

- 舊畫面是 `opacity` 1 到 0
- 新畫面是 `opacity` 0 到 1

當開發者沒有對 `:root` 設定任何 view transition 動畫時，直接執行 `document.startViewTransition()` 就會在新舊頁切換時看到淡入淡出的動畫。

以下是自訂動畫的範例：

```css
@keyframes move-out {
  from {
    transform: translateX(0%);
  }
  to {
    transform: translateX(-100%);
  }
}

@keyframes move-in {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0%);
  }
}

::view-transition-old(root) {
  animation: 0.4s ease-in both move-out;
}

::view-transition-new(root) {
  animation: 0.4s ease-in both move-in;
}
```

首先 `@keyframes move-out` 是「往左邊滑出」；而 `@keyframes move-in` 是「從右邊滑入」的動畫效果。

接著 `::view-transition-old(root)` 代表「我現在要設定 view transition name 名為 `root` 的元件（即 `:root`）」作為舊畫面消失時，要演出 `animation: 0.4s ease-in both move-out;` 的效果。而 `::view-transition-new(root)` 則負責處理「當 view transition name 名為 `root` 的元件（即 `:root`）」作為新畫面進入時，要演出 `animation: 0.4s ease-in both move-in;` 的效果。

翻譯成白話文就是：當使用者點擊 `Link` 觸發換頁時，他會看到舊畫面往左滑走，並新畫面從右邊滑入。

## 指定元件動畫參數

以下列樣式為例：

```css
.transition-img {
  view-transition-name: transition-img;
}

::view-transition-group(transition-img) {
  animation-duration: 0.2s;
  animation-timing-function: cubic-bezier(0.39, 0.01, 0.94, 0.45);
}
```

- 設定 class `.transition-img` 的 `view-transition-name` 為 `transition-img`
- 透過 `::view-transition-group(transition-img)` 來指 `transition-img` 的 view transition 的時長（`duration`）為 0.2 秒，變化曲線（`timing-function`）為 `cubic-bezier(0.39, 0.01, 0.94, 0.45)`

接著只要把 `.transition-img` 掛給「需要 view transition 效果」的元件即可：

```html
<img src="/cat.jpg" alt="" className="transition-img" />
```

當這個 img 元件在舊、新頁面的位置或尺寸不同時，瀏覽器就會補上「此 img 元件從舊移動到新位置」以及「此 img 元件從舊變為新尺寸」的動畫效果。

## 對應瀏覽器的上、下一頁按鈕

在 react app 中監聽 `popstate` 事件，就能在使用者點擊瀏覽器原生的上一頁、下一頁按鈕時也觸發 view transition 效果：

```ts
window.addEventListener("popstate", () => {
  document.startViewTransition();
});
```

監聽 `popstate` 的理由出自 [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event#the_history_stack) 的說明：

> The `popstate` event will be triggered by doing a browser action such as a **click on the back or forward button** (or calling `history.back()` or `history.forward()` in JavaScript).
