---
title: 「Writing Good Alt Text - HTTP 203」相關筆記
date: 2021-03-09 12:17:45
categories:
tags:
---

## 總結
關於YouTube影片「Writing Good Alt Text - HTTP 203」的相關筆記。

## 版本與環境

## 筆記
00:51 What alt text should I use for image like this one?
提問：（影片範例為講者頭像，而頭像的）alt內容到底該寫些什麼？

02:02 It depends, this is always the answer in tech.
回答：alt內容須根據上下文脈絡決定。
而如果不曉得圖片是應用在哪些情境，開發者便不容易決定alt的內容（02:12）。

以02:44舉的例子來看，假設文章是關於兩個旅社之間的糾紛，那附圖的alt內容可為：「當事者旅社之照片」。
而文章若是在討論腳踏車使用率的上升，那附圖的alt應配合主題，轉而描述圖片中的腳踏車（與其行為）。

03:26 Now the image has a caption equivalent to the alt, it's best to make the alt an empty string.
但參考影片留言的內容：
> leaving the alt attribute empty will hide the image from screen readers.

> In general, alt and figcaption should not be the same. Alt descriptions should be functional; figcaption descriptions should be editorial or illustrative.

綜合05:23的內容
> Emotion matters

講者是否戴眼鏡對（圖片）瀏覽者來說並非重點，但講者躲在植物後面的動作有引導出這張頭像照片的特殊之處。
故alt內容可為：「講者俏皮地躲在植物後」。

小結論：`<figcaption>`為editorial或illustrative導向，而alt用來做（圖片的）功能性描述。

關於上下文對alt的影響程度，可參考 07:34 Does the skin color of the speaker matter?
影片中的立場：如果講者談論的是與種族相關的演講題目，這或許重要到需在alt中註明。


## 參考文件
- [Writing Good Alt Text - HTTP 203](https://youtu.be/flf2vS0IoRs)