---
title: 2022 第11週 實作筆記：Element.getBoundingClientRect()
date: 2022-03-21 22:57:09
categories:
- [React]
tags:
---

## 總結
因應專案限制，在不使用 `Intersection Observer API` （因 IE 無支援）的情況下，透過 `Element.getBoundingClientRect()` 與 `Element.scrollTo()`, `Element.scrollTop` 做出類似效果

## 版本與環境
```
react: 17.0.2
```

## 筆記


## 參考文件
- [MDN: Element.getBoundingClientRect()](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect)