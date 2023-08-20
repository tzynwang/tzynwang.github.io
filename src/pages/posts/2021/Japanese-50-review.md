---
layout: '@Components/SinglePostLayout.astro'
title: 自主練習專案「日本文學經典50」技術記錄與反省
date: 2021-03-23 13:16:10
tag:
  - [CSS]
---

## 總結

微型專案「日本文學經典 50」是在閱讀完《一生必讀的 50 本日本文學名著》後，覺得書末一口氣展示 50 本經典的排版讓人印象深刻，決定以該圖為範本練習 CSS grid 排版

![demo 1](/2021/Japanese-50-review/Japanese-50.PNG)

## 成品

純網頁展示版：[點我](https://tzynwang.github.io/Japanese-literature-50/)
![demo 2](/2021/Japanese-50-review/prj-demo.gif)

## 版本與環境

```
Google Chrome: 89.0.4389.90 (Official Build) (64-bit)
os: Windows_NT 10.0.18363 win32 x64
```

## JS 內容

<script src="https://gist.github.com/tzynwang/3916e8975b303a87353c69a81539ba6b.js"></script>

## JS 技術記錄

### 將資料與 HTML 分離

- 將專案會用到的文字內容（著作、作者與年份的文字資料）從 HTML 原始碼中抽離，另外建立一個.csv 檔案來儲存這些文字資料；選擇將內容與結構分開是為了讓 HTML 原始碼看起來更乾淨
- 使用 JavaScript 來讀取、並把文字內容插入 DOM 物件

### 從資料庫讀取資料

- 專案會用到的文字內容被存放到 csv 檔案（資料庫）中，經過搜尋關鍵字「JavaScript read server side csv」後，得知可以使用**ajax**來實現需求
  - 參考：[Reading Server Side file with Javascript](https://stackoverflow.com/questions/3567369/reading-server-side-file-with-javascript)
- jQuery library 可以達成這個目標，不過檔案大小有 90kb，且除了 ajax 以外沒有打算使用 jQuery 提供的其他功能，故繼續搜尋，發現[Papa Parse](https://www.papaparse.com/)可以處理專案需求，檔案也比 jQuery 小（50kb），所以最後決定使用 Papa Parse

#### 什麼是 ajax

<iframe width="560" height="315" src="https://www.youtube.com/embed/dQcBs4S-wEQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

> (00:39) We can talk to the outside world and make changes on our website, have something happen that **interact with the server**, but maybe it doesn't reload our entire page.

> (00:50) ajax allows us to do that.

ajax 可以在「不重新載入整個網頁」的情況下，**向 server side 索取資料**後，配合 JavaScript 修改 DOM 的內容（或樣式）；在本專案的應用情境則是：讀取 server 上的 csv 檔案內容後，把檔案內容根據一定的規則放入適當的 DOM 物件中。

## HTML 內容

因為把文字資料與 HTML 區隔開了，所以 HTML 原始碼挺空曠的：

<script src="https://gist.github.com/tzynwang/74b572e9e22be4064b5c90f468a2fa38.js"></script>

- 一口氣產生 50 個`<div>`（且 50 個 div 的 class 分別從 c-1 數到 c-50）的 emmet 是：
  ```
  (.item.c-$)*50
  ```
- 設計每一個`<div>`擁有不同編號的 c-$ class 是為了讓 JS 在讀取依照年代排列的出版品資料後，可以從 1 到 50 格`<div>`依序插入文字
- 在不同寬度的版面下，50 個`<div>`會分別呈現三欄、四欄或五欄寬的排列，且偶數行要進行順序反轉；前述兩個需求都需要透過配合 CSS 內容來完成，而每一個.item 都擁有與其順位一致的.c-$ class 的話（比如順位二的.item 就會有.c-2 的 class），就可以使用 CSS 來選取特定順位的`<div>`並修改其排版位置

## CSS 內容

### 基本設定

<script src="https://gist.github.com/tzynwang/dc01878c945e0dc7f90ff6c88cc18268.js"></script>

### 三欄版面

<script src="https://gist.github.com/tzynwang/ec6016dd7e365965c4a1e637201b9f63.js"></script>

四欄與五欄排版主要不同的內容在於 grid-template-areas 的佈局，以及偶數行反轉排列的.c-$不一樣

## CSS 技術記錄

### `<input>`搭配`<label>`控制全部的蓋版元素

發想：既然可以透過純 CSS 做出一鍵切換「亮色／暗色模式」的話，想要「一鍵開啟全部的蓋板物件」的話，把 input:checked 後執行的「filter: invert()」換成「修改蓋板物件的 top 位置」就好

### repeat-y 處理大範圍背景

發想：

- 假如窗簾繩使用一張 48x2000px 尺寸、且背景要透明的圖片的話，檔案大小會影響載入與顯示的速度
- 那麼，既然窗簾繩「線段」的部分可以重複、只有「末端」的花樣要不同的話，就使用 repeat-y 來重複「線段」部分使用的背景圖片，並用`::after`來放置「末端」

### Sass 相關筆記

- 瀏覽器無法直接處理.scss 檔案，VS Code 需安裝 sass compiler 外掛來將.scss 檔案處理為.css
- （本次沒有用到）Sass 的變數由$宣告，比如`$primaryColor: #008AD8;`，使用的時候就像是：
  ```scss
  $primaryColor: #008ad8;
  .btn {
    background-color: $primaryColor;
  }
  ```
- （本次沒有用到）Sass 支援巢狀結構：
  ```scss
  div {
    background-color: #ccc;
    button {
      background-color: #333;
      color: #fff;
    }
  }
  ```
  等同 CSS 的：
  ```css
  div {
    background-color: #ccc;
  }
  div button {
    background-color: #333;
    color: #fff;
  }
  ```
- pseudo-classes 與 pseudo-elements 可以搭配&使用，比如：
  ```scss
  button {
    background-color: #333;
    color: #fff;
    &:hover {
      background-color: #ff00ff;
    }
  }
  ```
  等同 CSS 的：
  ```css
  button {
    background-color: #333;
    color: #fff;
  }
  button:hover {
    background-color: #ff00ff;
  }
  ```
- （本次沒有用到）匯入：主檔案使用`@use "模組路徑"`（不需加上`.scss`）、而模組的檔案名稱要由底線（`_`）開頭：
  ```scss
  // 主檔案
  @use './_header';
  ```
  ```scss
  // 此為模組，檔案名稱為：_header.scss
  header {
    color: #333;
    background-color: #eee;
  }
  ```
- `@mixin`：概念類似 JavaScript 的 function；注意呼叫（`@include`）mixin 的時候，要在 mixin 名稱後面加上`()`與`;`

  ```scss
  // mixin使用@mixin開頭，用@include使用
  // 以下範例的mixin名稱為「flexXYcenter」

  @mixin flexXYcenter() {
    display: flex;
    justify-contents: center;
    align-items: center;
  }

  body {
    @include flexXYcenter();
  }
  ```

  - mixin 可以接受參數，注意參數也要使用`$`開頭：

    ```scss
    @mixin flexXYcenter($direction) {
      display: flex;
      justify-contents: center;
      align-items: center;
      flex-direction: $direction; // 使用參數決定要flex row或flex column
    }

    body {
      @include flexXYcenter(column);
      // flex-direction: column;
    }

    main {
      @include flexXYcenter(row);
      // flex-direction: row;
    }
    ```

  - mixin 可以接受複數個參數：

    ```scss
    @mixin flexXYcenter($direction, $color) {
      display: flex;
      justify-contents: center;
      align-items: center;
      flex-direction: $direction; // 使用參數決定要flex row或flex column
      color: $color; // 使用參數決定文字顏色
    }

    main {
      @include flexXYcenter(row, #ccc);
      // 等同以下內容：
      // display: flex;
      // justify-contents: center;
      // align-items: center;
      // flex-direction: row;
      // color: #ccc;
    }
    ```

- `@extend`：可以理解成「繼承、延續」既有的內容
  ```scss
  body {
    @include flexXYcenter(row, #ccc);
  }
  main {
    @extend body;
    // 然後處理其他任何除了body已經寫過、或是要覆寫的properties
  }
  ```

## 反省

- 沒有先畫 wireframe 就開始動手編寫原始碼，grid 處理完之後，發現不管是要調整整體的平衡或是追加內容都顯得很麻煩 ⋯⋯ 之後的練習還是盡量避免不規劃就動手做的模式
- 一開始的目的是想要練習 CSS grid，但此專案的排版其實用 CSS flex 就可以達成了，儘管可以用 grid 排版、但不確定這是不是最好的做法
- UI 的設計感沒有統一，素材都是找到後直接套用；蓋板的深綠色物件風格與背景以及右側窗簾繩不一致

## 參考文件

- 和風配色參考：配色パターン中[和色大辞典](https://www.colordic.org/colorscheme)的部分
- [Learn Sass In 20 Minutes](https://youtu.be/Zz6eOVaaelI)
