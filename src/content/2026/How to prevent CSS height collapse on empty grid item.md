---
title: How to prevent CSS height collapse on empty grid item
slug: css-prevent-empty-grid-item-height-collapse
date: 2025-03-24 07:40:33
tag:
  - []
banner:
summary:
---

## TL;DR

Insert "zero-width space" character to keep the height (when the condition does not allow to pre-set the min-height).

## Code example

```html
<div className="target"></div>
```

```css
.target:empty::before {
  content: "\200b";
}
```

When the grid item has no children (`:empty`),[^1] insert "zero-width space" character into this element's `::before` content.

<p class="codepen" data-height="300" data-pen-title="how to prevent height collapse on empty grid item" data-default-tab="result" data-slug-hash="ZYpOpNx" data-user="tzyn" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/tzyn/pen/ZYpOpNx">
  how to prevent height collapse on empty grid item</a> by Charlie (<a href="https://codepen.io/tzyn">@tzyn</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://public.codepenassets.com/embed/index.js"></script>

### Native CSS nesting syntax

```css
.target {
  &:empty {
    &::before {
      content: "\200b";
    }
  }
}
```

### Tailwind 4 syntax

```html
<div class="empty:before:content-['\200b']"></div>
```

## Why not use `align-self: stretch;`?

If the grid item is the only child in that row, this item has nothing to reference for its height. Specifying `align-self: stretch;` won't make it stretch.

[^1]: See MDN [:empty](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:empty)
