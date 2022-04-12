---
title: 「CSS 字體底線樣式」相關筆記
date: 2022-04-12 22:05:12
categories:
  - [CSS]
tags:
---

## 總結

記錄一下近期是如何使用 `text-decoration` 與 `text-underline-offset` 來調整底線樣式外觀

<div style="
    margin: 0 0 20px;
    line-height: 1;
    font-size: 3rem;
    font-weight: 700;
    text-decoration: underline line-through #9B6E23;
    text-underline-offset: 0.25em;">
    DEMO STRING
    <br/>
    <span style="
    margin-left: 3rem;
    font-size: 1rem;
    font-weight: 400;">
    with a little tail</span>
</div>

```css
/* color ticket --> https://nipponcolors.com/#kitsune */
text-decoration: underline line-through #9b6e23;
text-underline-offset: 0.25em;
```

## 筆記

### text-decoration

- syntax 如下：
  ```jsx
  <'text-decoration-line'> || <'text-decoration-style'> || <'text-decoration-color'> || <'text-decoration-thickness'>
  ```
- `text-decoration-line` 設定裝飾線段的**位置**
  - 允許複數值，`text-decoration-line: overline underline line-through;` 這樣的樣式設定是合法的
- `text-decoration-style` 設定裝飾線段的**樣式**
- `text-decoration-color` 設定裝飾線段的顏色，注意顏色目前僅支援單一色彩，無法處理 `linear gradient`；若底線需要漸變色，可考慮使用 `pseudo-element` 或 `background-image` 來處理
  - [Gradient-y text underlines using CSS](https://www.amitmerchant.com/gradient-text-underlines-using-css/)
  - [linear gradient underline for hyperlink](https://stackoverflow.com/questions/44147872/linear-gradient-underline-for-hyperlink)
- `text-decoration-thickness` 設定裝飾線段的粗細，需注意目前主流瀏覽器**尚未**全面支援使用百分比來設定粗細

### text-underline-offset

- 沒有包含在 `text-decoration` 的 syntax 內，如果要設定底線的偏移數值，需獨立宣告
- While an element can have multiple `text-decoration` lines, `text-underline-offset` **only impacts underlining**, and not other possible line decoration options such as `overline` or `line-through`. 注意 `text-underline-offset` 僅能設定 underlining 的偏移數值，無法調整 `overline` 或 `line-through` 的位置
  - 參考上方 DEMO STRING 可發現 `line-through` 並未偏移字體中心，僅有 `underline` 往下方偏移
- It is recommended to use `em` units so the offset **scales with the font size**. 推薦使用 `em` 作為單位，根據字體大小調整偏移的幅度（而非使用 `px` 等單位寫死）

## 參考文件

- [MDN: text-decoration](https://developer.mozilla.org/en-US/docs/Web/CSS/text-decoration)
- [MDN: text-underline-offset](https://developer.mozilla.org/en-US/docs/Web/CSS/text-underline-offset)
- [CSS-Tricks: Styling Underlines on the Web](https://css-tricks.com/styling-underlines-web/)
