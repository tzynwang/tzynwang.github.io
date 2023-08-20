---
layout: '@Components/SinglePostLayout.astro'
title: 30天挑戰：「Vue與viewport size」技術記錄
date: 2021-08-29 09:58:26
tag:
  - [Vue]
  - [2021鐵人賽]
---

## 總結

記錄如何在 Vue project 取得視窗尺寸，進而調整元素的顯示狀態

## 筆記

<script src="https://gist.github.com/tzynwang/22c8a65a5d4e7e5e4af6bb11dd785b26.js"></script>

- 安裝`vuex`，建立`windowWidth.js`模組，設定`state`保存`windowWidth`資訊
- 在`views`中透過`mapActions`與`mapGetters`引用`getter`與`actions`；於`created`階段對`window`掛載`resize`監聽器，觸發時呼叫`setWidth()`
- 在`<template>`中透過`getWindowWidth`來取得視窗大小，進而控制 components 的顯示狀態

## 參考文件

- [How to get the browser viewport dimensions?](https://stackoverflow.com/questions/1248081/how-to-get-the-browser-viewport-dimensions)
- [How can I use window size in Vue? (How do I detect the soft keyboard?)](https://stackoverflow.com/questions/47219272/how-can-i-use-window-size-in-vue-how-do-i-detect-the-soft-keyboard)
- [Set reactive screen width with vuejs](https://stackoverflow.com/questions/51565331/set-reactive-screen-width-with-vuejs/51566337)
