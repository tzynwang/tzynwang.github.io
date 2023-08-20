---
layout: '@Components/SinglePostLayout.astro'
title: 2023 情人節禮包：CSS @container
date: 2023-02-18 13:40:26
tag:
  - [CSS]
---

## 總結

CSS `@container` 終於在 Chrome (105)、FireFox (110) 以及 Safari (16) 都實裝了。這篇筆記將記錄 `@container` 的基本語法，以及提供一個簡單的範例。

## 筆記

### 基本語法

設定作為參考根據的容器 (`containment context`)：

- 使用 `container-type` 來設定 `@container` 時要參考容器的「哪些」尺寸
  - `size`: 同時參考容器的 `inline` 與 `block` 尺寸
  - `inline-size`: 僅參考容器的 `inline` 尺寸
  - `normal`: 該容器不會成為 `container size query` 的對象，但可作為 `container style query` 的標地
- 使用 `container-name` 來設定該容器的別名。在透過 `@container` 進行 query 時可透過名稱來指定容器

以上 `container-type` 與 `container-name` 可合併在 `container` 中宣告，語法為 `container: <name> | <size>`。

在沒有指定容器名稱的情況下，容器內含物會參考最鄰近的親容器。可以透過直接宣告要參考的親容器名稱來覆蓋這個特性：

> [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Container_Queries#naming_containment_contexts): A container query applied styles **based on the nearest ancestor with a containment context**. It's possible to give a containment context a name using the container-name property. Once named, the name can be used in a `@container` query so as to **target a specific container**.

---

設定好容器後，就可透過 `@container` 語法來根據容器尺寸調整容器內含物的樣式。

基礎組合如下，這代表 `.card` 元件通常使用 `1rem` 大小的字體，但如果其容器 `.container` 的 inline 尺寸大於 480px 則將字體大小改為 `2rem`。

```html
<div class="container">
  <div class="card">...</div>
</div>
```

```css
.container {
  container-type: inline-size;
}

.card {
  font-size: 1em;
}

@container (min-width: 480px) {
  .card {
    font-size: 2rem;
  }
}
```

---

Container query 專用單位：

- `cqw`: 容器的 1% 寬
- `cqh`: 容器的 1% 高
- `cqi`: 容器的 1% inline 尺寸
- `cqb`: 容器的 1% block 尺寸
- `cqmin`: 取 cqi 與 cqb 中較小的值
- `cqmax`: 取 cqi 與 cqb 中較大的值

應用方式可參考下方範例原始碼。搭配 `clamp()` 來根據容器 inline 數值動態地調整字體大小：

```css
@container (min-width: 720px) {
  .card h2 {
    font-size: clamp(1.25rem, 1.25rem + 1.5cqi, 5rem);
  }
}
```

---

關於 inline 與 block 尺寸：

> [inline](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties/Basic_concepts#block_and_inline_dimensions): The inline dimension is the dimension **along which a line of text runs in the writing mode in use**. Therefore, in an English document with the text running horizontally left to right, or an Arabic document with the text running horizontally right to left, the inline dimension is **horizontal**.

> [block](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties/Basic_concepts#block_and_inline_dimensions): The block dimension is the other dimension, and the direction in which blocks -- such as paragraphs -- display one after the other. In English and Arabic, these run **vertically**, whereas in any vertical writing mode these run horizontally.

簡單來說就是根據（文字）流的方向來判定是水平或是垂直尺寸。

若是左右書寫的文字流，則 inline size 代表水平方向的尺寸、而 block size 則代表垂直方向的尺寸。

### 範例

範例中的卡片元件會在其容器寬度小於 720px 時顯示為垂直的圖文排版，而當容器寬度大於 720px 時，卡片圖文將改為水平排列。

<p class="codepen" data-height="300" data-theme-id="dark" data-default-tab="css,result" data-slug-hash="poOJNPw" data-user="Charlie7779" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/Charlie7779/pen/poOJNPw">
  Container Query</a> by Charlie (<a href="https://codepen.io/Charlie7779">@Charlie7779</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

## 參考文件

- [MDN: CSS Container Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Container_Queries)
- [Can I use: @container](https://caniuse.com/?search=%40container)
- [web.dev: Container queries land in stable browsers](https://web.dev/cq-stable/)
- [MDN: Basic concepts of Logical Properties and Values](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties/Basic_concepts)
