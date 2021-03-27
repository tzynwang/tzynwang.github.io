---
title: 自主練習專案「日本文學經典50」技術記錄與反省
date: 2021-03-23 13:16:10
categories:
- CSS
tags:
- Side Project
---

## 總結
微型專案「日本文學經典50」是在閱讀完《一生必讀的50本日本文學名著》後，覺得書末一口氣展示50本經典的排版讓人印象深刻，決定以該圖為範本練習CSS grid排版
{% figure figure--center 2021/Japanese-50-review/Japanese-50.PNG %}


## 成品
純網頁展示版：[點我](https://tzynwang.github.io/Japanese-literature-50/)
{% figure figure--center 2021/Japanese-50-review/prj-demo.gif %}


## 版本與環境
```
Google Chrome: 89.0.4389.90 (Official Build) (64-bit)
os: Windows_NT 10.0.18363 win32 x64
```

## JS內容
<script src="https://gist.github.com/tzynwang/3916e8975b303a87353c69a81539ba6b.js"></script>

## JS技術記錄
### 將資料與HTML分離
- 將專案會用到的文字內容（著作、作者與年份的文字資料）從HTML原始碼中抽離，另外建立一個.csv檔案來儲存這些文字資料；選擇將內容與結構分開是為了讓HTML原始碼看起來更乾淨
- 使用JavaScript來讀取、並把文字內容插入DOM物件

### 從資料庫讀取資料
- 專案會用到的文字內容被存放到csv檔案（資料庫）中，經過搜尋關鍵字「JavaScript read server side csv」後，得知可以使用**ajax**來實現需求
    - 參考：[Reading Server Side file with Javascript](https://stackoverflow.com/questions/3567369/reading-server-side-file-with-javascript)
- jQuery library可以達成這個目標，不過檔案大小有90kb，且除了ajax以外沒有打算使用jQuery提供的其他功能，故繼續搜尋，發現[Papa Parse](https://www.papaparse.com/)可以處理專案需求，檔案也比jQuery小（50kb），所以最後決定使用Papa Parse

#### 什麼是ajax
<iframe width="560" height="315" src="https://www.youtube.com/embed/dQcBs4S-wEQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

> (00:39) We can talk to the outside world and make changes on our website, have something happen that **interact with the server**, but maybe it doesn't reload our entire page.

> (00:50) ajax allows us to do that.

ajax可以在「不重新載入整個網頁」的情況下，**向server side索取資料**後，配合JavaScript修改DOM的內容（或樣式）；在本專案的應用情境則是：讀取server上的csv檔案內容後，把檔案內容根據一定的規則放入適當的DOM物件中。

## HTML內容
因為把文字資料與HTML區隔開了，所以HTML原始碼挺空曠的：
<script src="https://gist.github.com/tzynwang/74b572e9e22be4064b5c90f468a2fa38.js"></script>

- 一口氣產生50個`<div>`（且50個div的class分別從c-1數到c-50）的emmet是：
    ```
    (.item.c-$)*50
    ```
- 設計每一個`<div>`擁有不同編號的c-$ class是為了讓JS在讀取依照年代排列的出版品資料後，可以從1到50格`<div>`依序插入文字
- 在不同寬度的版面下，50個`<div>`會分別呈現三欄、四欄或五欄寬的排列，且偶數行要進行順序反轉；前述兩個需求都需要透過配合CSS內容來完成，而每一個.item都擁有與其順位一致的.c-$ class的話（比如順位二的.item就會有.c-2的class），就可以使用CSS來選取特定順位的`<div>`並修改其排版位置


## CSS內容
### 基本設定
<script src="https://gist.github.com/tzynwang/dc01878c945e0dc7f90ff6c88cc18268.js"></script>

### 三欄版面
<script src="https://gist.github.com/tzynwang/ec6016dd7e365965c4a1e637201b9f63.js"></script>

四欄與五欄排版主要不同的內容在於grid-template-areas的佈局，以及偶數行反轉排列的.c-$不一樣


## CSS技術記錄
### `<input>`搭配`<label>`控制全部的蓋版元素
發想：既然可以透過純CSS做出一鍵切換「亮色／暗色模式」的話，想要「一鍵開啟全部的蓋板物件」的話，把input:checked後執行的「filter: invert()」換成「修改蓋板物件的top位置」就好

### repeat-y處理大範圍背景
發想：
- 假如窗簾繩使用一張48x2000px尺寸、且背景要透明的圖片的話，檔案大小會影響載入與顯示的速度
- 那麼，既然窗簾繩「線段」的部分可以重複、只有「末端」的花樣要不同的話，就使用repeat-y來重複「線段」部分使用的背景圖片，並用`::after`來放置「末端」

### Sass相關筆記
- 瀏覽器無法直接處理.scss檔案，VS Code需安裝sass compiler外掛來將.scss檔案處理為.css
- （本次沒有用到）Sass的變數由$宣告，比如`$primaryColor: #008AD8;`，使用的時候就像是：
    ```SCSS
    $primaryColor: #008AD8;
    .btn {
      background-color: $primaryColor;
    }
    ```
- （本次沒有用到）Sass支援巢狀結構：
    ```SCSS
    div {
      background-color: #ccc;
      button {
        background-color: #333;
        color: #fff;
      }
    }
    ```
    等同CSS的：
    ```CSS
    div {
      background-color: #ccc;
    }
    div button {
      background-color: #333;
      color: #fff;
    }
    ```
- pseudo-classes與pseudo-elements可以搭配&使用，比如：
    ```SCSS
    button {
      background-color: #333;
      color: #fff;
      &:hover {
        background-color: #ff00ff;
      }
    }
    ```
    等同CSS的：
    ```CSS
    button {
      background-color: #333;
      color: #fff;
    }
    button:hover {
      background-color: #ff00ff;
    }
    ```
- （本次沒有用到）匯入：主檔案使用`@use "模組路徑"`（不需加上`.scss`）、而模組的檔案名稱要由底線（`_`）開頭：
    ```SCSS
    // 主檔案
    @use "./_header"
    ```
    ```SCSS
    // 此為模組，檔案名稱為：_header.scss
    header {
      color: #333;
      background-color: #eee;
    }
    ```
- `@mixin`：概念類似JavaScript的function；注意呼叫（`@include`）mixin的時候，要在mixin名稱後面加上`()`與`;`
    ```SCSS
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
    - mixin可以接受參數，注意參數也要使用`$`開頭：
        ```SCSS
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
    - mixin可以接受複數個參數：
        ```SCSS
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
    ```SCSS
    body {
      @include flexXYcenter(row, #ccc);
    }
    main {
      @extend body;
      // 然後處理其他任何除了body已經寫過、或是要覆寫的properties
    }
    ```


## 反省
- 沒有先畫wireframe就開始動手編寫原始碼，grid處理完之後，發現不管是要調整整體的平衡或是追加內容都顯得很麻煩⋯⋯之後的練習還是盡量避免不規劃就動手做的模式
- 一開始的目的是想要練習CSS grid，但此專案的排版其實用CSS flex就可以達成了，儘管可以用gird排版、但不確定這是不是最好的做法
- UI的設計感沒有統一，素材都是找到後直接套用；蓋板的深綠色物件風格與背景以及右側窗簾繩不一致


## 參考文件
- 和風配色參考：配色パターン中[和色大辞典](https://www.colordic.org/colorscheme)的部分
- [Learn Sass In 20 Minutes](https://youtu.be/Zz6eOVaaelI)