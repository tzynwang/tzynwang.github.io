---
title: 30天挑戰：「使用SCSS搭配Vue實作dark mode」技術記錄
date: 2021-08-07 09:02:13
categories:
- [CSS]
- [Vue]
- [2021鐵人賽]
tags:
---

## 總結
在不使用其他框架或library的情況下，僅透過SCSS與Vue來實作網頁的dark mode

{% figure figure--center 2021/ithome2021-2-vue-dark-mode/darkmode-demo.png "'dark mode展示'" %}

成品：https://tzynwang.github.io/ac_assignment_3F_ALPHA-Shop/
原始碼：https://github.com/tzynwang/ac_assignment_3F_ALPHA-Shop


## 環境
```
Vue.js: 2.X
os: Windows_NT 10.0.18363 win32 x64
```

## 前言
結構較複雜的專案不適合僅使用`<input type="checkbox">`搭配`filter: hue-rotate() invert();`來實作dark mode需求，且在設計師有指定dark mode色票時，還是引入JavaScript來協助處理dark mode較為輕鬆

純CSS的dark mode相關技巧可參考：
- [(YouTube) Full Dark Mode with only 1 CSS PROPERTY?!](https://youtu.be/qimopjP6YoM)
- [(YouTube) Pure CSS3 Dark Mode Effects For Website | CSS Only Night mode](https://youtu.be/5aJTVV-rlBw)


## 正篇開始
### SCSS
<script src="https://gist.github.com/tzynwang/7a9ea9e2a13e499121f1cef6d18f53d0.js"></script>

- 僅有需要在dark mode變色的顏色變數才須設定兩套值；範例中的`--primary-pink`因設計師並不打算在dark mode進行變色，故僅在`html {...}`中出現，不須於`html[data-theme="dark"] {...}`再設定一次
- 開發時可先將專案body中的`color`與`background`都設定為最終成品不會使用到的顏色，方便一眼確認還有哪些部位沒有上色
  {% figure figure--center 2021/ithome2021-2-vue-dark-mode/color-check.png "'填入專案不會用到的顏色，方便檢查填色進度'" %}
- 版面配置多使用`padding`而非`margin`，才方便滿版上色
- 使用`var()`進行顏色設定
  ```SCSS
  background-color: var(--white);
  color: var(--dark);
  ```


### HTML
- 因搭配Vue進行操作，故在light/dark mode切換時需要更換圖片的部位皆須搭配`v-bind:src`，比如`<img :src="navMenuIcon">`
- 使用`<input type="checkbox">`搭配`v-model`讀取checkbox的勾選狀態：`<input type="checkbox" id="darkModeSwitch" v-model="darkMode">`

### Vue
<script src="https://gist.github.com/tzynwang/c719372a29bdc21e6f6678933614abe8.js"></script>

- `darkMode`預設為`false`
- 使用`watch`監看`darkMode`的值，一旦更動後，就根據`darkMode`為true或false修改`data-theme`（與CSS中的`var()`變數們連動）與圖示的`src`
- 也可對`<input type="checkbox">`綁定`@change="darkModeMethod($event)`，並透過`methods`來切換為dark mode（以下方式就不需對input綁v-model）：
  ```JavaScript
  methods: {
    darkModeMethod (event) {
      if (event.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark')
        this.navLogoSrc = './images/logo-dark.svg'
        this.navSearchIcon = './images/icon-nav-search-dark.svg'
        this.navChartIcon = './images/icon-nav-chart-dark.svg'
        this.navModeIcon = './images/icon-nav-to-light-mode.svg'
        this.navMenuIcon = './images/icon-nav-menu-dark.svg'
        this.footerFbIcon = './images/icon-footer-fb-dark.svg'
        this.footerIGIcon = './images/icon-footer-ig-dark.svg'
        this.footerTelIcon = './images/icon-footer-tel-dark.svg'
      } else {
        document.documentElement.setAttribute('data-theme', '')
        this.navLogoSrc = './images/logo.svg'
        this.navSearchIcon = './images/icon-nav-search.svg'
        this.navChartIcon = './images/icon-nav-chart.svg'
        this.navModeIcon = './images/icon-nav-to-dark-mode.svg'
        this.navMenuIcon = './images/icon-nav-menu.svg'
        this.footerFbIcon = './images/icon-footer-fb.svg'
        this.footerIGIcon = './images/icon-footer-ig.svg'
        this.footerTelIcon = './images/icon-footer-tel.svg'
      }
    }
  }
  ```


## 參考文件
- [How to create a dark\light mode switch in CSS and Javascript](https://codyhouse.co/blog/post/dark-light-switch-css-javascript)