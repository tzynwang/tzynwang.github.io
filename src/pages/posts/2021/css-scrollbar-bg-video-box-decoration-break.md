---
layout: '@Components/SinglePostLayout.astro'
title: 「捲軸樣式、影片背景與box-decoration-break」相關筆記
date: 2021-08-22 16:30:06
tag:
  - [CSS]
---

## 總結

集中記錄一些在 AC 與 Udemy Advanced CSS and Sass 課程中學到的技巧

<p class="codepen" data-height="600" data-default-tab="css,result" data-slug-hash="LYLPeep" data-user="Charlie7779" style="height: 600px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/Charlie7779/pen/LYLPeep">
  landing with video</a> by Charlie (<a href="https://codepen.io/Charlie7779">@Charlie7779</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

## 筆記

### 捲軸樣式

<p class="codepen" data-height="300" data-default-tab="css,result" data-slug-hash="rNmKexG" data-user="Charlie7779" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/Charlie7779/pen/rNmKexG">
  scrollbar</a> by Charlie (<a href="https://codepen.io/Charlie7779">@Charlie7779</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

- 沒有 vendor prefix 的`scrollbar-color`目前支援度不佳，參考：[Can I use: scrollbar-color?](https://caniuse.com/?search=scrollbar-color)
- 改用`::-webkit-scrollbar`、`::-webkit-scrollbar-track`與`::-webkit-scrollbar-thumb`來設定捲軸樣式

### 影片背景

- 外部 container 設定為`position: relative;`，內層`<video>`元素設定為`position: absolute;`與`top: 0;`、`left: 0;`來根據 container 進行定位
- `<video>`本身沒有`src`，影片來源需透過子代的`<source>`元素設定
- 可透過`<source>`設定影片相關特性，比如`autoplay`、`loop`與`muted`等，參考：[HTML video Tag: Optional Attributes](https://www.w3schools.com/tags/tag_video.asp)
- 加上`object-fit: cover;`確保在任何螢幕尺寸下都能維持原始比例並占滿畫面
- 素材來源：[Coverr](https://coverr.co/)

### box-decoration-break

- 預設值為`slice`

  ![demo slice](/2021/css-scrollbar-bg-video-box-decoration-break/slice.png)

- 設定為`clone`後，換行處會補齊樣式設定

  ![demo clone](/2021/css-scrollbar-bg-video-box-decoration-break/clone.png)

- 設定`line-height: 1.75;`來撐開換行後行與行之間的距離
  - [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/line-height#values): The used value is this unitless `<number>` **multiplied** by the element's own **font size**. The computed value is the same as the specified `<number>`. In most cases, this is the preferred way to set line-height and avoid unexpected results due to inheritance.
  - 沒有加上單位的情況下，`line-height`的計算方式為**字體大小乘以設定的數值**

## 參考文件

- [MDN: scrollbar-color](https://developer.mozilla.org/en-US/docs/Web/CSS/scrollbar-color)
- [CSS-Tricks: scrollbar](https://css-tricks.com/almanac/properties/s/scrollbar/)
- [CSS-Tricks: Custom Scrollbars in WebKit](https://css-tricks.com/custom-scrollbars-in-webkit/)
- [MDN: box-decoration-break](https://developer.mozilla.org/en-US/docs/Web/CSS/box-decoration-break)
- [MDN: line-height](https://developer.mozilla.org/en-US/docs/Web/CSS/line-height)
