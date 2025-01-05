---
title: 30天挑戰：「CSS簡易動畫」 相關筆記
date: 2021-08-21 06:19:25
tag:
- [CSS]
- [2021鐵人賽]
---

## 總結

使用`animation-fill-mode: backwards;`讓`animation-direction`為`normal`或`alternate`的元素在動畫開始時的時間點就套用`@keyframes 0%`時的樣式

![landing下方按鈕會在頁面載入時從下方滑入](/2021/ithome2021-9-animation-fill-mode/btn-animation-demo.gif)

## 筆記

<script src="https://gist.github.com/tzynwang/8f653570757710176f8620e17d3fcfcc.js"></script>

- `.btn`本身設定為`position: relative;`讓其`::after`在`position: absolute;`狀態下可以根據按鈕本體進行定位
- `animation-fill-mode: backwards;`讓`.btn`在動畫開始時就呈現`@keyframes moveFromBottom`在`0%`的效果：`opacity: 0;`與`transform: translateY(3rem);`
- `.btn:hover::after`代表 hover 按鈕後，其`::after`會放大（`scale(1.2, 1.4)`）並`opacity: 0;`

## 參考文件

- [MDN: animation-fill-mode](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-fill-mode)
- [Udemy: Advanced CSS and Sass: Flexbox, Grid, Animations and More!](https://www.udemy.com/course/advanced-css-and-sass/)
