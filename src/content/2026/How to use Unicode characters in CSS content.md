---
title: How to use Unicode characters in CSS content
slug: use-unicode-in-css
date: 2025-03-24 07:40:33
tag:
  - []
banner:
summary:
---

## TL;DR

Replace the `U+` part of the Unicode code point by `\`.

## Code example

```css
.element::after {
  content: "\200b";
}
```

Display a "zero-width space" character in `.element`'s `::after` pseudo-element.

## Explanation

- `\` is the escape character, it tells the browser to understand `\200b` as "Unicode code point `200B`" (since CSS syntax is case insensitive).[^1] [^2] [^3]
- In Unicode standard, the hexadecimal number [`200B` refers to "zero-width space"](https://en.wikipedia.org/wiki/Zero-width_space).

## Further reading

Why would I want to [[How to prevent CSS height collapse on empty grid item | insert a "zero-width space"]] to pseudo-elements?

[^1]: For more information on CSS escape character, see [Using character escapes in markup and CSS](https://www.w3.org/International/questions/qa-escapes.en.html#cssescapes).

[^2]: For case insensitive, see [CSS2 syntax and basic data types](https://www.w3.org/TR/1998/REC-CSS2-19980512/syndata.html#q4).

[^3]: See [Unicode 16.0.0 Core Specification - Chapter 2](https://www.Unicode.org/versions/Unicode16.0.0/core-spec/chapter-2/#G25564) and [Wikipedia](https://en.wikipedia.org/wiki/Unicode#Codespace_and_code_points) for more information about code point.
