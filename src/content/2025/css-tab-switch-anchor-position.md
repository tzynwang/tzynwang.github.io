---
title: 用 CSS anchor function 實現 Tab 元件滑動效果
date: 2025-08-31 10:13:33
tag:
  - [CSS]
banner: /2025/css-tab-switch-anchor-position/armands-brants-BX8w_quWj_c-unsplash.jpg
summary: 優點：你可以少寫很多程式碼；缺點：火狐還不支援
draft:
---

## 懶人包

被影片 [Make this fun effect that follows your cursor (pure CSS)](https://youtu.be/8_NQ7ARXz8c?si=nyFMeuLb9USK6lWX) 啟發，發現 **CSS anchor position 的 `anchor()` 也能用來實現 Tab 元件的標籤左右滑動動畫效果**，而且要寫的樣式行數少很多，讀起來也沒有比較複雜。

最大的缺點就是這篇筆記發佈時，火狐和 safari 都還不支援 `anchor()` 🌚

![等待，並心懷希望吧](/2025/css-tab-switch-anchor-position/等待並心懷希望.jpg)

## 如何做出 Tab 滑動效果

### 傳統做法

傳統上，當前端要在 Tab 元件搞出「根據點擊目標，表現出標籤水平滑動效果」時，工程師都要根據容器寬算一些數學。以「佔滿容器寬，並且有三個標籤的 Tab 元件」為例：

```html
<form class="traditional">
  <fieldset>
    <label>
      <input type="radio" name="fruit" value="apple" checked />
      apple
    </label>
    <label>
      <input type="radio" name="fruit" value="banana" />
      banana
    </label>
    <label>
      <input type="radio" name="fruit" value="cherry" />
      cherry
    </label>
  </fieldset>
</form>
```

```css
.traditional fieldset {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  --gap: 8px;
  gap: var(--gap);
  margin: 0;
  --padding: 4px;
  padding: var(--padding);
  isolation: isolate;
}

.traditional fieldset::after {
  content: "";
  position: absolute;
  inset: var(--padding);
  background-color: salmon;
  width: calc((100% / 3) - var(--gap));
  border-radius: 4px;
  z-index: -10;
  transform: translatex(var(--trans-x));
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.traditional fieldset:has(label:nth-of-type(1) input:checked) {
  --trans-x: 0;
}

.traditional fieldset:has(label:nth-of-type(2) input:checked) {
  --trans-x: calc(100% + var(--gap));
}

.traditional fieldset:has(label:nth-of-type(3) input:checked) {
  --trans-x: calc(200% + (var(--gap) * 2));
}
```

首先把 `.traditional fieldset::after` 設定為標籤。因為整個元件總共有三個標籤，所以一個標籤的寬度是「總容器寬除以三之後，再扣掉 `gap` 的寬」。

接著，根據使用者當下點選了哪一個 `input:radio` 來更新 `--trans-x` 的值。特別注意 `--trans-x` 是設定在 `.traditional fieldset` 身上。如果把選取器寫成 `.traditional fieldset label:nth-of-type(1) input:checked` 是無法作用的——因為 CSS 變數只能從親代繼承下來，不用 `:has()` 來選取 `.traditional fieldset` 會讓 `--trans-x` 作用於 `input:checked`，那 `.traditional fieldset::after` 就吃不到更新後的 `--trans-x` 了。

### 以 anchor() 實現

html 結構與上一節相同，但改用 `anchor-name` 搭配 `anchor()` 來指定標籤的停留位置。簡單來說：

1. 先透過 `.anchor label:has(input:checked)` 來把 `anchor-name: --a` 指定到「被使用者點選的 `input` 身上」
2. 然後指定 `.anchor fieldset::after` 以 `position-anchor: --a` 來計算 `top`/`right`/`bottom`/`left`
3. 當使用者點擊任一選項時，標籤就會滑動到對應的 `input` 區塊

```css
.anchor fieldset {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin: 0;
  padding: 4px;
  isolation: isolate;
}

.anchor label:has(input:checked) {
  anchor-name: --a;
}

.anchor fieldset::after {
  content: "";
  /* 重點開始 */
  position: absolute;
  position-anchor: --a;
  top: anchor(top);
  right: anchor(right);
  bottom: anchor(bottom);
  left: anchor(left);
  /* 重點結束 */
  background-color: salmon;
  border-radius: 4px;
  z-index: -10;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
```

改用 `anchor()` 後，就不用去計算標籤的寬度了 🥳

### 完整程式碼

<p class="codepen" data-height="300" data-default-tab="css,result" data-slug-hash="gbaBvRN" data-pen-title="tab switch" data-preview="true" data-user="Charlie7779" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/Charlie7779/pen/gbaBvRN">
  tab switch</a> by Charlie (<a href="https://codepen.io/Charlie7779">@Charlie7779</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://public.codepenassets.com/embed/index.js"></script>

## 參考資料

- [CSS anchor()](https://developer.mozilla.org/en-US/docs/Web/CSS/anchor)
- [Anchoreum](https://anchoreum.com/): 對 anchor position 完全沒有概念的讀者，可以先從這個互動式學習站開始嘗試看看
