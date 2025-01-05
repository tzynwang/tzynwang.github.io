---
title: Alpha Camp「3前 毛小孩星球」相關筆記
date: 2021-07-13 15:40:31
tag:
- [CSS]
---

## 總結

一些過去沒有使用過的技巧：

- `scroll-behavior: smooth;`讓使用者點擊不同錨點的時候，平順地捲動畫面
- 以`top: 50%; left: 50%;`搭配`transform: translate(-50%, -50%);`達成水平垂直置中效果
- 切換`transform: scale(1, 0);`與`transform: scale(1, 1);`來做出清單縮放效果
- 使用`all: unset;`處理元素在小螢幕、大螢幕裝置之間的不同樣式
- 使用`::before`與`::after`等偽元素處理框線（動畫）

  ![demo](/2021/css-ac-puppy-planet/hover-animation.gif)

- 使用`display: block;`取消`vertical-align`，進而移除`<img>`下方的空隙

新知：

- `box-shadow`與`filter: drop-shadow();`的差異
- CSS Vendor Prefixes (CSS browser prefixes)

成品：[毛小孩星球](https://tzynwang.github.io/ac_practice_3F_puppy-planet/)
原始碼：[ac_practice_3F_puppy-planet](https://github.com/tzynwang/ac_practice_3F_puppy-planet)

## 筆記

### scroll-behavior

```css
scroll-behavior: auto;
scroll-behavior: smooth;
```

- 預設為`scroll-behavior: auto;`，點選錨點跳躍至文件中的指定位置時，不會有任何動畫效果
- 設定為`scroll-behavior: smooth;`，點選錨點進行跳躍時會表現各家瀏覽器自行定義的捲動動畫效果
  - [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-behavior#values): The scrolling box scrolls in a **smooth fashion** using a **user-agent-defined timing function over a user-agent-defined period of time**. User agents should follow platform conventions, if any.
- IE、iOS Safari（同理 iOS Chrome）未支援
  ![scroll behavior browser compatibility](/2021/css-ac-puppy-planet/scroll-behavior-browser-compatibility.png)

### 處理清單開合的`<input type="checkbox"/>`

```css
/* AC版本 */
.navbar-toggle {
  position: absolute;
  visibility: hidden;
}

/* 個人處理方式，fixed後推到可視範圍外 */
.navbar-toggle {
  position: fixed;
  top: -100px;
  right: -100px;
}
```

- `visibility: hidden;`:
  - [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/visibility): Hides an element **without changing the layout** of a document.
  - The element box is invisible (not drawn), but **still affects layout** as normal.
  - The element **cannot receive focus** (such as when navigating through tab indexes).
  - Using a visibility value of hidden on an element will **remove it from the accessibility tree**. This will cause the element and all its descendant elements to **no longer be announced by screen reading technology**.
  - 隱藏元素，但該元素依舊會佔據空間
- `display: none;`:
  - To both **hide an element** and **remove it** from the document layout, set the display property to none.
  - 該元素依舊會出現在 DOM tree 中，但已經不會在畫面上佔據任何空間

### `position: absolute;`與水平、垂直置中

```css
.navbar-toggle-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

- `translate()`: **repositions** an element in the horizontal and/or vertical directions. [MDN](<https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/translate()>)
- 先設定 top 與 left 各推 50%後，將該元素的 XY 軸各回推-50%回來
- 此份作業的頂部導覽漢堡按鈕與狗狗相片集的狗狗名字有使用此技巧

<p class="codepen" data-height="300" data-theme-id="dark" data-default-tab="css,result" data-slug-hash="wvdobWJ" data-preview="true" data-user="Charlie7779" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/Charlie7779/pen/wvdobWJ">
  transform: translate(-50%, -50%);</a> by Charlie (<a href="https://codepen.io/Charlie7779">@Charlie7779</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

### 切換漢堡按鈕圖示

![list demo 1](/2021/css-ac-puppy-planet/listDemo.gif)

```html
<!-- HTML結構 -->
<input type="checkbox" class="navbar-toggle" id="navbar-toggle" />
<label class="navbar-toggle-label" for="navbar-toggle">
  <span class="hamburger"></span>
</label>
```

```css
/* CSS設定 */
.hamburger::before {
  display: inline-block;
  width: 36px;
  height: 36px;
  content: '';
  background-size: 36px 36px;
  background-image: url('./images/list.svg');
  background-repeat: no-repeat;
  transition: background-image 0.2s;
}

.navbar-toggle:checked ~ .navbar-toggle-label .hamburger::before {
  background-image: url('./images/cross.svg');
}
```

- 使用`background-image: url()`插入圖示
- 待`.navbar-toggle`進入勾選狀態後，選取`.navbar-toggle`之後的`.navbar-toggle-label`其下的`.hamburger::before`，修改`background-image`的圖示

### 關於`~`選取器（CSS tilde selector）

- [What does the “~” (tilde/squiggle/twiddle) CSS selector mean?](https://stackoverflow.com/questions/10782054/what-does-the-tilde-squiggle-twiddle-css-selector-mean)
  - The general sibling combinator is made of the "tilde" (U+007E, `~`) character that separates two sequences of simple selectors.
  - The elements represented by the two sequences **share the same parent in the document tree** and the element represented by the first sequence precedes (**not necessarily immediately**) the element represented by the second one.
  - 白話：以`.a ~ .b`為例，此選取器的意義是「選取所有與`.a`為 siblings 且在`.a`之後的`.b`」

### 清單縮放

```css
.nav {
  transform: scale(1, 0);
  transform-origin: top;
  transition: 0.2s;
}

.navbar-toggle:checked ~ .nav {
  transform: scale(1, 1);
}
```

- 收起狀態：使用`transform: scale(1, 0);`將該元素的 Y 軸變為 0
- 展開狀態：設定`transform: scale(1, 1);`將元素的 Y 軸還原為原始高度
- `transform-origin`預設為`center`，修改為`top`讓元素從上方開始進行變形

### 清單文字處理

```css
.nav-item {
  opacity: 0;
}

.navbar-toggle:checked ~ .nav .nav-item {
  opacity: 1;
  transition: 0.2s ease-out 0.15s;
}
```

- 為了避免使用者看到被壓縮的文字，先使用`opacity: 0;`隱藏`.nav-item`
- 待清單展開後，設定`.nav-item`延遲 0.15 秒後再顯示
- 與上方的動畫相比，修改後的版本不會看到被壓縮的文字：
  ![list demo 2](/2021/css-ac-puppy-planet/listDemo-1.gif)

### 處理大螢幕導覽列

```css
.nav,
.nav-list,
.nav-item {
  all: unset;
}

header {
  display: grid;
  grid-template-columns: 1fr auto minmax(600px, 3fr) 1fr;
}

.navbar-brand {
  grid-column: 2 / 3;
}

.nav {
  grid-column: 3 / 4;
}

.nav-list {
  display: flex;
  height: 100%;
  justify-content: flex-end;
  align-items: center;
}

.nav-item + .nav-item {
  margin-left: 2rem;
}
```

- 重設`.nav`、`.nav-list`與`.nav-item`的 CSS 樣式
- 將`header`設定為`display: grid;`後，指定`.navbar-brand`與`.nav`的位置
- `.nav-list`不同於 AC 以`display: grid;`搭配`grid-auto-flow: column;`處理，因為僅有一維排版需求，故直接設定`display: flex;`搭配`justify-content: flex-end;`推到右側，並`align-items: center;`進行垂直置中
- 以`+`選取器設定僅有位在`.nav-item`後面的`.nav-item`才會有左側 margin

  ![nav margin demo](/2021/css-ac-puppy-planet/nav-margin.png)

### 相片框線動畫

```css
.card::before,
.card::after {
  content: '';
  position: absolute;
  top: 5%;
  left: 5%;
  width: 90%;
  height: 90%;
  transition: 0.25s ease-out 0.1s;
}

.card::before {
  border-top: 1px solid #fff;
  border-bottom: 1px solid #fff;
  transform: scale(0, 1);
}

.card:hover::before {
  transform: scale(1.05, 1);
}

.card::after {
  border-left: 1px solid #fff;
  border-right: 1px solid #fff;
  transform: scale(1, 0);
}

.card:hover::after {
  transform: scale(1, 1.05);
}
```

- `position: absolute;`與`width: 90%; height: 90%;`組合，讓`.card`的偽元素尺寸比`.card`小一圈（90%）
- `top: 5%; left: 5%;`將偽元素往下、右各推 5%，因為為元素尺寸設定為 90%，故各推 5%後水平垂直的留白空間會一樣
- `.card::before`與`.card::after`分別處理水平與垂直線段，並只有在`:hover後`透過`scale()`還原尺寸
- `transition: .25s ease-out .1s;`設定滑鼠移動到元素上先延遲 0.1 秒才開始動畫

### 設定`<img>`為`display: block;`

- [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#styling_with_css): `<img>` is a **replaced element**; it has a **display value of inline by default**, but its default dimensions are defined by the embedded image's intrinsic values, like it were inline-block. You can set properties like border/border-radius, padding/margin, width, height, etc. on an image.
  - `<img>`元素預設為`display: inline;`
  - 而`vertical-align`是`inline`、`inline-block`或`table-cell box`才有的屬性，參考[MDN: vertical-align](https://developer.mozilla.org/en-US/docs/Web/CSS/vertical-align)，`vertical-align`無法設定為`nonde`
- 將`<img>`設定為為`display: block;`後，`vertical-align`屬性消失，也不會有圖片下方的空隙

  ![img display block](/2021/css-ac-puppy-planet/displayBlock.gif)

## 補充

### `box-shadow`與`filter: drop-shadow();`的差異

<p class="codepen" data-height="300" data-theme-id="dark" data-default-tab="css,result" data-slug-hash="eYWgObo" data-user="Charlie7779" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/Charlie7779/pen/eYWgObo">
  shadows</a> by Charlie (<a href="https://codepen.io/Charlie7779">@Charlie7779</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

- `box-shadow`：繪製`box-model`的影子
  - 僅有`box-shadow`支援`spread-radius`
  - 僅有`box-shadow`支援`inset`（內陰影）
- `drop-shadow()`：根據非透明的部分繪製影子

### Why do browsers create vendor prefixes for CSS properties?

來源：[https://stackoverflow.com/questions/8131846/why-do-browsers-create-vendor-prefixes-for-css-properties](https://stackoverflow.com/questions/8131846/why-do-browsers-create-vendor-prefixes-for-css-properties)

- It's because the features were implemented by vendors **before** the specification reached its final release stage.
- The vendor prefix kind of says “this is the (for example) Microsoft interpretation of an ongoing proposal.” Thus, if the final definition of grid is different, Microsoft can add a new CSS property grid **without breaking pages that depend on -ms-grid**.
- （當年）各家瀏覽器想實作某些「規格還未完全確認」的 CSS 效果，但又需避免日後正式規格發布後會有衝突，故那些瀏覽器自行先實裝的效果就加上各家瀏覽器的 prefix，（與日後正式發布的 CSS 效果）做出區隔

## 參考文件

- [Breaking down CSS Box Shadow vs. Drop Shadow](https://css-tricks.com/breaking-css-box-shadow-vs-drop-shadow/)
- [box-shadow property vs. drop-shadow filter: a complete comparison](http://thenewcode.com/598/box-shadow-property-vs-drop-shadow-filter-a-complete-comparison)
- [MDN: unset](https://developer.mozilla.org/en-US/docs/Web/CSS/unset)
