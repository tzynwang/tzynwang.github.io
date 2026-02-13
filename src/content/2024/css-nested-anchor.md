---
title: 透過 CSS position absolute 來實現巢狀連結
date: 2024-07-02 20:40:34
tag:
  - [CSS]
banner: 2024/css-nested-anchor/karen-ciocca-967F5E0YTPA-unsplash.jpg
summary: 從 Nested Anchor Links using CSS 學到一招極度簡單但非常實用的技巧來實現巢狀連結，必須分享。
draft:
---

## 需求與限制

以本部落格為例——我希望使用者點擊每一個在首頁的「帶圖卡片」與「文字卡片」元件可以連結到特定文章，而點擊卡片元件中的「標籤」則會連結到「包含該標籤的文章一覽」頁（在本篇筆記發布前，「帶圖卡片」與「文字卡片」只有標題是連結，點擊其他部位是不會有反應的）。

但根據規格，巢狀連結是不合法的（[Nested links are illegal](https://www.w3.org/TR/html401/struct/links.html#h-12.2.2)）：

> Links and anchors defined by the `A` element must not be nested; an `A` element must not contain any other `A` elements.

## 實現方式

然而透過 `position: absolute` 與一點點的 HTML 結構調整，我們就能實現巢狀連結。以下是一個非常簡略的範例：

```html
<div class="wrapper">
  <a class="link_out" href="..." target="_blank"></a>
  <div>文章日期</div>
  <p>文章標題</p>
  <div>
    <a class="link_in" href="..." target="_blank">文章標籤 1</a>
    <a class="link_in" href="..." target="_blank">文章標籤 2</a>
  </div>
</div>
```

```css
.wrapper {
  position: relative;
}

.link_out {
  position: absolute;
  inset: 0;
}

.link_in {
  position: relative;
}
```

原理如下：

1. 整個元件 `.wrapper` 設定為 `position: relative` 來成為 `.link_out` 的定位點
2. `.link_out` 透過 `position: absolute` 加上 `inset: 0` 來覆蓋整個元件，當游標移動到元件 `.wrapper` 上時，使用者點擊的是 `.link_out`
3. 而 `.link_in` 透過 `position: relative` 來建立新的圖層（[stacking context](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_positioned_layout/Understanding_z-index/Stacking_context)），於是使用者也能順利點擊到文章標籤

就是這麼簡單 🪄

<p class="codepen" data-height="300" data-theme-id="dark" data-default-tab="css,result" data-slug-hash="WNBVjRK" data-pen-title="nested link by CSS position: absolute" data-preview="true" data-user="Charlie7779" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/Charlie7779/pen/WNBVjRK">
  nested link by CSS position: absolute</a> by Charlie (<a href="https://codepen.io/Charlie7779">@Charlie7779</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

## 參考文件

- [Nested Anchor Links using CSS](https://www.amitmerchant.com/nested-anchor-links-using-css/)
- [Why are nested anchor tags illegal?](https://stackoverflow.com/questions/18666915/why-are-nested-anchor-tags-illegal)
- [Where can I find a list of proper HTML nesting standards?](https://stackoverflow.com/questions/21345918/where-can-i-find-a-list-of-proper-html-nesting-standards)
- [Is there a list of HTML5 elements that can be nested inside other elements?](https://stackoverflow.com/questions/56498472/is-there-a-list-of-html5-elements-that-can-be-nested-inside-other-elements)
