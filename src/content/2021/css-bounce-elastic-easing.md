---
title: 「Bringing bounce and elastic easing to CSS | HTTP 203」相關筆記
date: 2021-12-01 23:10:02
tag:
- [CSS]
---

## 總結

<iframe width="560" height="315" src="https://www.youtube.com/embed/8FuafvJLDpM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

目前的`cubic-bezier`僅能「抵達終點一次（無法在抵達終點後做出彈跳動畫）」，而目前在草稿階段的 CSS 新規格則是想要實現「在一段動畫中彷彿多次觸底反彈（可以做出彈跳動畫）」的行為

## 筆記

### 新規格草案簡單總解

> 透過組合非常多的「點」來畫出曲線（視覺上），看起來像是觸底的「點」實際上並未達到 1，而是 0.99 的位置

```css
.whatever {
  animation-timing-function: linear(
    0,
    0.003,
    0.013,
    0.03,
    0.05,
    0.08,
    0.11,
    0.15,
    0.2,
    0.26,
    0.31,
    0.38,
    0.45,
    0.53,
    0.62,
    0.71,
    0.81,
    0.9,
    0.99,
    0.94,
    0.89,
    0.85,
    0.82,
    0.79,
    0.77,
    0.76,
    0.752,
    0.75,
    0.755,
    0.77,
    0.78,
    0.81,
    0.84,
    0.87,
    0.92,
    0.97,
    0.99,
    0.97,
    0.95,
    0.94,
    0.938,
    0.94,
    0.949,
    0.96,
    0.99,
    0.994,
    0.986,
    0.985,
    0.989,
    1 100% 100%
  );
}
```

![動畫路線如圖，在視覺上做出回彈效果](/2021/css-bounce-elastic-easing/new-spec-proposal-demo.png)

### 從 linear-gradient()開始

- CSS 的`linear-gradient()`在開發者**沒有**提供每一組顏色的`<linear-color-stop>`時，會自動根據`linear-gradient()`的顏色數量參數 、以及要繪製漸層背景的面積，來平均分配每個顏色在漸層中佔據的幅度
- 比如`background: linear-gradient(orange, pink);`就會平均分配橘色與粉紅色的範圍（一半一半），而如果加入第三個顏色：`background: linear-gradient(orange, pink, grey);`，成果就會是三個顏色的漸層平均分配畫面

### 集合非常多的「點」來畫出「像是曲線」的直線集合

- 承以上畫出漸層的概念，首先允許動畫路徑上有多個「點」（位置）：`linear(0, 0.7, 1)`，代表起始點`0`，接著移動到`0.7`的位置，最終達到`1`
- 當路徑上的「點」越來越多，最終路徑就會看起來像是曲線，然而實際上是透過非常多的點繪製出直線，而因為線段組合夠多，視覺上看起來會像是曲線
- 視覺上像是「觸底」的位置實際上是`0.99`而非`1`，整個動畫最終還是只會抵達終點一次，其他只是在視覺上「非常接近終點」

> 結果：得到視覺上有回彈效果的動畫路徑

## 參考文件

- [w3c/csswg-rafts: [css-easing-1] Some ideas for linear() easing](https://github.com/w3c/csswg-drafts/pull/6533)
- [Easings cheatsheet](https://easings.net/)
