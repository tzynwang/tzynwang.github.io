---
title: CSS 筆記：如何實現 display none 的漸變效果
date: 2024-06-15 07:42:04
tag:
- [CSS]
banner: /2024/css-transition-for-display-none/marc-olivier-jodoin-NqOInJ-ttqM-unsplash.jpg
summary: 雖然目前 Firefox 還不支援，不過已經可以靠 `@starting-style` 與 `allow-discrete` 這兩個屬性來讓元件在「從有到無、從無到有」時也能表現漸變（`transition`）效果了。
draft: 
---

## 懶人包

要讓元件在 `display: none` 變成其他 `display` 狀態時表現漸變（`transition`）效果的話，需要以下兩種設定：

1. 設定目標元件的 `@starting-style`
2. 將 `transition-behavior` 設定為 `allow-discrete`

```css
div {
  flex: 1;
  border: 1px solid #333;
  position: relative;
  background: linear-gradient(
    to right,
    rgb(255 255 255 / 0%),
    rgb(255 255 255 / 50%)
  );
  opacity: 1;
  scale: 1 1;
  transition: all 0.4s allow-discrete; /* <== here */

  /* and here */
  @starting-style { 
    opacity: 0;
    scale: 1 0;
  }
}
```

備註：上方的[可操作範例](https://codepen.io/Charlie7779/pen/WNBZqzW)（改編自 [MDN: Transitioning elements on DOM addition and removal](https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style#transitioning_elements_on_dom_addition_and_removal)）。

另外要注意 Firefox **尚未支援**這兩個 CSS 參數。

---

而以下是關於 `@starting-style` 與 `allow-discrete` 的自用筆記，記錄了我認為這兩種 CSS 樣式需要注意的部分。若要了解詳細資訊，請務必回頭參考 MDN 中的說明。

## @starting-style

重點：用於定義一個元件「從有到無，或是從無到有時」的樣式。

> `@starting-style` is especially useful when creating entry and exit transitions for... elements that are **changing to and from display: none**, and elements when first **added to or removed from the DOM**.

在過去，當元件從 `display: none` 變成其他 `display` 狀態（或是反過來，從其他狀態變回 `none`）時，工程師無法對這段「變化」加上漸變效果。不會漸變是因為 `display` 的動畫屬性（[animation type](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animated_properties#discrete)）是離散（[discrete](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animated_properties#discrete)）的，代表它在表現動畫時，只會有「開始」與「結束」這兩種視覺效果。

但現在可以透過 `@starting-style` 與 `transition-behavior: allow-discrete` 讓 `display` 這個屬性也能實現漸變。

注意事項：

- `@starting-style` 只影響 CSS `transition`，與 CSS `animation` 無關
- `@starting-style` 的權重（specificity）和元件本身的樣式一致，所以要先書寫元件本身的樣式，再書寫該元件的 `@starting-style` 樣式（The `@starting-style` at-rule and the original rule **have the same specificity**... include the `@starting-style` at-rule **after the original rule**.）
- 當我們運用 `@starting-style` 時，實際上會有三種狀態：開始時的樣式（即 `@starting-style` 定義的樣式）、漸變中的樣式與元件本身的樣式——可以從這個範例 [MDN: Demonstration of when starting styles are used](https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style#demonstration_of_when_starting_styles_are_used) 體驗一下何謂三種狀態

語法：有兩種寫法。一是把 `@starting-style` 包在樣式中：

```css
#target {
  background-color: green;
  transition: background-color 1.5s;

  @starting-style {
    background-color: transparent;
  }
}
```

二是將 `@starting-style` 獨立出來，並在此區塊指定特定元件「開始時的樣式」：

```css
#target {
  background-color: green;
  transition: background-color 1.5s;
}

@starting-style {
  #target {
    background-color: transparent;
  }
}
```

## transition-behavior: allow-discrete

重點：允許離散（[discrete](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animated_properties#discrete)）類型的動畫也能表現出漸變效果。

> The `transition-behavior` CSS property specifies whether transitions will be started for properties whose animation behavior is discrete.

注意事項（摘錄自 [Discrete animation behavior](https://developer.mozilla.org/en-US/docs/Web/CSS/transition-behavior#discrete_animation_behavior)）：

- 目標元件從 `display: none` 變成 `block`（從無到有）時，元件會在動畫進度 0% 時就進入 `block` 狀態，所以元件在整個動畫全程都是可視（「有」）的。
- 目標元件從 `display: block` 變成 `none`（從有到無）時，元件會在動畫進度 100% 時才進入 `none` 狀態，所以元件在整個動畫全程都是可視（「有」）的。

## 參考文件

- [MDN: @starting-style](https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style)
- [MDN: transition-behavior](https://developer.mozilla.org/en-US/docs/Web/CSS/transition-behavior)
- [MDN: Animatable CSS properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animated_properties)
- [Chrome for Developers: Four new CSS features for smooth entry and exit animations](https://developer.chrome.com/blog/entry-exit-animations)
