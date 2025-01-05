---
title: 「10 modern layouts in 1 line of CSS」相關筆記
date: 2021-03-07 12:36:03
tag:
- [CSS]
---

## 總結

關於 YouTube 影片「[10 modern layouts in 1 line of CSS](https://www.youtube.com/watch?v=qm0IfG1GyZU)」的相關筆記。

## 版本與環境

```
Google Chrome: 89.0.4389.72 (Official Build) (64-bit)
os: Windows_NT 10.0.18363 win32 x64
```

## 基礎

### `fr` (fractional units)

類似百分比，與百分比不同的地方是「所有使用 fr 來宣告尺寸的元件，這些元件會互相參考彼此的尺寸」
在一些非常極端的情況下可能會造成尺寸炸裂，以下列原始碼來舉例：

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="html,result" data-user="Charlie7779" data-slug-hash="WNogyEW" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="fr">
  <span>See the Pen <a href="https://codepen.io/Charlie7779/pen/WNogyEW">
  fr</a> by Charlie (<a href="https://codepen.io/Charlie7779">@Charlie7779</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

在`<div class="cyan"></div>`中如果僅置入一段文字的話，高度為 48px（4fr）
那麼作為 1fr 的`<div class="coral"></div>`與`<div class="gold"></div>`的高度就是 48 除以 4，等於 12px

而當我在`<div class="cyan"></div>`中置入 2 萬個字元後，元件的高度被撐到 4128px
而`<div class="coral"></div>`與`<div class="gold"></div>`的高度就一起因應`<div class="cyan"></div>`而改變，為 4182 除以 4，等於 1032px

### `auto`

auto spacing，根據內容自動分配寬高。
所以如果沒有給予元件任何內容的話，高度就會是 0。

### `minmax()`

作用如其名稱，設定最小與最大的尺寸。

### `clamp()`

接受三個參數，分別設定最小（minimum value）、理想（preferred value）與最大（maximum allowed value）尺寸。

### `auto-fill`與`auto-fit`

這篇搭配影片示範，好懂：[Auto-Sizing Columns in CSS Grid: auto-fill vs auto-fit](https://css-tricks.com/auto-sizing-columns-css-grid-auto-fill-vs-auto-fit/)

## 影片中的 10 個範例

### 1. Super Centered

`place-items: center`：放在 grid 父容器上，讓子元件水平＋垂直置中。
替代方案：在子元件加上`justify-self: center;`與`align-self: center;`屬性。

### 2. The Deconstructed Pancake

父容器設定為`display: flex;`，子元件設定為`flex: 0 1 <baseWidth>;`或`flex: 1 1 <baseWidth>;`。
示範碼使用`flex: 0 1 150px;`，展開來即是：

```css
flex-grow: 0;
/* 0代表不會延展 */

flex-shrink: 1;
/* 1代表會收縮 */

flex-basis: 150px;
/* 因為示範碼在父元件上沒有指定flex-direction，故會是預設的row flow，那flex-basis影響的是flex item的寬 */
/* 如果flex-basis沒有設定的話，預設為0，那麼寬度會根據內容決定 */
```

如果設定為`flex: 1 1 150px;`的話，代表`flex-grow`為`1`，會讓子元件填滿父元件的剩餘空間。

### 3. Sidebar Says

父容器設定為`grid-template-columns: minmax(<min>, <max>)`
示範碼使用`grid-template-columns: minmax(150px, 25%) 1fr;`，意思是：

- 第一個欄最少 150px 寬、最多佔父元件 25%寬
- 第二個欄寬設定為 1fr，讓其佔據剩餘的所有空間，1fr 替換成 auto 也會有一樣的效果

### 4. Pancake Stack

父容器設定為`grid-template-rows: auto 1fr auto`，直接搞定常見的 Header/Main/Footer 三層排版。
中間的 Main 區塊設定為 1fr 有其必要：如果點開[Pancake Stack 在 CodePen 中的示範碼](https://codepen.io/una/pen/bGVXPWB)，並把 Main 的 1fr 改為 auto 的話，版面會變成從上到下 1:1:1 的比例（比例壞了）。

### 5. Classic Holy Grail Layout

父容器設定為`grid-template: auto 1fr auto / auto 1fr auto`，而這行拆開來是：

```css
grid-template-rows: auto 1fr auto;
grid-template-columns: auto 1fr auto;
grid-template-areas: none;
```

子元件需各自設定要佔據多少空間：

```css
.header {
    padding: 2rem;
    grid-column: 1 / 4;
    /* column從line 1開始，到lin 4結束 */
    /* 可以換成
    grid-column-start: 1;
    grid-column-end: 4;  */
  }

.left-side {
  grid-column: 1 / 2;
  /* column從line 1開始，到line 2結束 */
}

.main {
  grid-column: 2 / 3;
  /* column從line 2開始，到line 3結束 */
}

.right-side {
  grid-column: 3 / 4;
  /* column從line 3開始，到line 4結束 */
}

.footer {
  grid-column: 1 / 4;
  /* column從line 1開始，到lin 4結束 */
}
```

### 6. 12-Span Grid

`grid-template-columns: repeat(12, 1fr)`
使用`repeat()`來取代輸入 12 次 1fr。

### 7. RAM (Repeat, Auto, Minmax)

`grid-template-columns: repeat(auto-fit, minmax(<base>, 1fr))`
提醒：在`grid-auto-flow: row;`（預設）的情況下，`<base>`設定的是子元件的欄寬。
示範碼的`auto-fit`讓子元件在父容器變寬時，自動填滿父元件剩餘的空間。
若把示範碼改為`auto-fill`，即使把父容器拉寬，子元件最大也只會伸展到 150px。

### 8. Line Up

`justify-content: space-between`
用`flex-direction: column;`搭配`justify-content: space-between`來讓卡片裡的標題與圖片頂住卡片天地，而卡片文字會垂直置中。
如果把`justify-content: space-between`從示範碼抽掉的話，會發現卡片圖片的位置會根據每張卡片內文字的多寡而有不同高度。

### 9. Clamping My Style

`clamp(<min>, <actual>, <max>)`
一行設定元件最小、理想狀態與最大的尺寸分別各是多少。
示範碼的`width: clamp(23ch, 50%, 46ch);`意即：讓子元件是父容器的 50%寬，但最大不超過 46ch、最小不低於 23ch。

示範碼中出現的單位`ch`根據[MDN 對 Relative length units](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units#lengths)的解釋是：

> The advance measure (width) of the glyph "0" of the element's font.

[w3schools.com 版本](https://www.w3schools.com/cssref/css_units.asp)的解釋：

> Relative to the width of the "0" (zero)

筆記：字體的大小會根據該字形中字母「0 (ZERO, U+0030)」的寬度來計算。

而根據[Eric A. Meyer](https://meyerweb.com/eric/thoughts/2018/06/28/what-is-the-css-ch-unit/)大神對`ch`的說明：

> So however wide the “0” character is in a given typeface, that’s the measure of one ch.

筆記：字母「0 (ZERO, U+0030)」的寬度即是一個 ch 代表的值。

注意：雖然影片中有提到使用 ch 是為了控制單一行的字元數量來確保易讀性（legibility），但除非用的是 monospace 類型的字體，不然每個字母的寬度不一定一樣：

> This leads to claims that you can “make your content column 60 characters wide for maximum readability” or “size images to be a certain number of characters!” Specifically, yes if you’re using fixed-width fonts. Otherwise, mostly no.

極致懶人包：因為 1ch 通常比「大部分」的字體寬一點點，所以如果要用 ch 來做單行字元數量限制，數字需比實際字元數小一些。
舉例：如果希望一行有 80 個字元，那請設定寬度為 60ch。

> What I’ve found through random experimentation is that in proportional typefaces, `1ch` is usually wider than the average character width, usually by around 20-30%. But there are at least a few typefaces where the zero symbol is skinny with respect to the other letterforms; in such a case, 1ch is narrower than the average character width.

> So in general, if you want an 80-character column width and you’re going to use ch to size it, aim for about 60ch, unless you’re specifically working with a typeface that has a skinny zero.

### 10. Respect for Aspect

`aspect-ratio: <width> / <height>`
一行搞定元件的比例尺，但須注意瀏覽器是否支援。
可參考[MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio#browser_compatibility)。

## 參考文件

<iframe width="560" height="315" src="https://www.youtube.com/embed/qm0IfG1GyZU" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

- [Google Chrome Developers: 10 modern layouts in 1 line of CSS](https://www.youtube.com/watch?v=qm0IfG1GyZU)
- [Demo website: 1-Line Layouts](https://1linelayouts.glitch.me/)
