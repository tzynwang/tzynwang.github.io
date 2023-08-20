---
layout: '@Components/SinglePostLayout.astro'
title: 2022 第48週 學習筆記：CSS 中的顏色格式與人眼視覺
date: 2022-12-03 16:29:33
tag:
  - [CSS]
---

## 總結

記錄一下從 [Color Formats in CSS](https://www.joshwcomeau.com/css/color-formats/) 以及 YouTube 影片 [Color Spaces: Do YOU know the difference between sRGB, LAB and CIE XYZ? - HTTP 203](https://youtu.be/cGyLHxn16pE) 中學到的東西。

## 筆記

### 什麼是色域 (color space)

> [維基百科](https://zh.wikipedia.org/zh-tw/%E8%89%B2%E5%9F%9F)：色域是對一種顏色進行編碼的方法，也指一個技術系統能夠產生的顏色的總合。

每種色域涵蓋的顏色數量不同，實際範圍可參考下圖，最常在網路世界被使用的色域為 sRGB。

> [wikipedia](https://en.wikipedia.org/wiki/SRGB): sRGB is the current defined **standard colorspace for the web**, and it is usually the assumed colorspace for images that are neither tagged for a colorspace nor have an embedded color profile.

![color space](/2022/css-color-format/color-space.png)

而 CSS 中的 `color()` 功能讓開發者可以指定要使用哪一種色域。但需注意：目前僅有 safari 瀏覽器支援 `color()`，且使用者的螢幕規格也不一定能配合顯示開發者指定的色域。

> [w3c specification](https://w3c.github.io/csswg-drafts/css-color/#color-function): The `color()` function allows a color to be specified in a particular, specified color space (rather than the implicit sRGB color space that most of the other color functions operate in).

下圖左右分別為 `srgb` 與 `p3` 色域中的深紅色，右側的色塊看起來比左側更飽和、鮮豔：

![color space srgb and p3](/2022/css-color-format/srgb-p3-maroon.png)

### 在 CSS 中宣告顏色的方法

- `rgb()` 與 `hex code` 三者皆是透過「指定紅綠藍成分」來組合出顏色
- `hsl()` 是透過指定顏色的色調 (hue)、飽和度 (saturation) 與明度 (lightness) 來組成顏色。相較於 rgb 與 hex code，優點是在調整「飽和度」與「明度」這兩個項目上更直覺，修改數值即可調整一個顏色的濃淡與明暗
- `lch()` 的原理與 `hsl()` 有些類似：透過指定顏色的明度、彩度 (chroma) 與色調 (hue) 來組合顏色。與 `hsl()` 不同的地方是，在 `lch()` 固定明度與彩度的情況下修改色調，可以達成「人眼看起來亮度一致，僅有顏色不同」的效果。缺點是這篇筆記撰寫的時間點只有 safari 支援此宣告方式

以下是透過 `hsl()` 指定「同樣飽和度、同樣明度」的黃色 (`hsl(70, 100%, 50%)`) 與紫色 (`hsl(257, 100%, 50%)`)，但人眼會感覺左邊的黃色「比較亮」：

![hsl](/2022/css-color-format/hsl.png)

而以下兩張圖片則是透過 `lch()` 指定「同樣明度、同樣彩度」的黃色與紫色；相較於 `hsl()` 版本，以下兩組圖片的左右「亮度」看起來會比較一致：

![lch example 1](/2022/css-color-format/lch-1.png)

![lch example 2](/2022/css-color-format/lch-2.png)

### 視錐細胞 (cone cell) 與視桿細胞 (rod cell)

參考維基百科說明：

> [視錐細胞](https://zh.wikipedia.org/zh-tw/%E8%A7%86%E9%94%A5%E7%BB%86%E8%83%9E)（cone cell）是視網膜上一種色覺感光細胞。人類每隻眼球視網膜大約 600 至 700 萬個視錐細胞。視錐細胞主要負責**顏色識別**，並且在相對較亮的光照下更能發揮作用。
> [視桿細胞](https://zh.wikipedia.org/zh-tw/%E8%A7%86%E6%9D%86%E7%BB%86%E8%83%9E) (rod cell) 較視錐細胞**對光更敏感**，幾乎主要全部用於夜視力。人類視網膜平均有約 1 億 2500 萬個視桿細胞。

有鑒於人眼對色彩變化較不敏銳，比較擅長察覺亮度變化的特性，JPEG 格式便是透過捨棄色彩、但保留圖片的明暗度資訊來達成良好的壓縮效果。

## 參考文件

- [Color Formats in CSS](https://www.joshwcomeau.com/css/color-formats/)
- [YouTube: Color Spaces: Do YOU know the difference between sRGB, LAB and CIE XYZ? - HTTP 203](https://youtu.be/cGyLHxn16pE)
- [colormath](https://ajalt.github.io/colormath/)
