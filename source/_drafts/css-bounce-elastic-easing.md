---
title: 「Bringing bounce and elastic easing to CSS | HTTP 203」相關筆記
date: 2021-12-01 23:10:02
categories:
- CSS
tags:
---

## 總結
CSS原生有機會導入新的彈性動畫設定
目前的`cubic-bezier`僅能處理「一組起止點」，而目前在草稿階段的新規格則是想要實作一段動畫中「可以有多個起止點」的規格

目前：一段動畫只有在抵達終點前回彈一次
{% figure figure--center 2021/css-bounce-elastic-easing/cubic-bezier-ease-in-out.png "image caption text 'alt text'" %}

新規格若實作：一段動畫可以回彈複數次
{% figure figure--center 2021/css-bounce-elastic-easing/130435372-05471f97-7e33-4876-ac45-cc7073eb1f5c.png "image caption text 'alt text'" %}


## 筆記


## 參考文件
- [YouTube: Bringing bounce and elastic easing to CSS | HTTP 203](https://youtu.be/8FuafvJLDpM)
- [w3c/csswg-rafts: [css-easing-1] Some ideas for linear() easing](https://github.com/w3c/csswg-drafts/pull/6533)
- [30天挑戰：「漢堡按鈕動畫與cubic-bezier()」 相關筆記](https://tzynwang.github.io/2021/ithome2021-7-cubic-bezier/)