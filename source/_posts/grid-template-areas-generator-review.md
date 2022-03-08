---
title: 自主練習專案「grid-template-areas generator」技術記錄
date: 2021-03-24 12:18:30
categories:
- CSS
tags:
---

## 總結
微型專案「grid-template-areas generator」是為了不想要手動輸入多種grid-template-areas設定的產物；輸入column與row的始末後，按下generate按鈕即可產生能直接使用的grid-template-areas設定，並提供一鍵複製的功能。


## 成品
codepen展示：
<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="css,result" data-user="Charlie7779" data-slug-hash="qBqGbpm" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="grid-template-areas generator">
  <span>See the Pen <a href="https://codepen.io/Charlie7779/pen/qBqGbpm">
  grid-template-areas generator</a> by Charlie (<a href="https://codepen.io/Charlie7779">@Charlie7779</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>


## 版本與環境
```
Google Chrome: 89.0.4389.90 (Official Build) (64-bit)
os: Windows_NT 10.0.18363 win32 x64
```

## CSS內容
### 使用`::before`與`linear-gradient()`畫圖示
- 先選取`.label`的`::before`部位，設定`position: absolute;`與`top: 8px;`、`left: 4px;`來讓圖示預定繪製的範圍離`.label`左邊框4px遠，並垂直置中
- `background`如果設定多個`linear-gradient()`，原始碼從上到下會分別對應圖層從上到下繪製的內容
    - 以cell start的圖示為例：
    <script src="https://gist.github.com/tzynwang/9b197345e6727409ced24f58820e1a47.js"></script>

    <p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="css,result" data-user="Charlie7779" data-slug-hash="GRrJEJM" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="linear-gradient()">
    <span>See the Pen <a href="https://codepen.io/Charlie7779/pen/GRrJEJM">
    linear-gradient()</a> by Charlie (<a href="https://codepen.io/Charlie7779">@Charlie7779</a>)
    on <a href="https://codepen.io">CodePen</a>.</span>
    </p>
    <script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>
    - 其他欄位的圖示原理相同，僅是修改色塊位置或縮小覆蓋區域

### `<textarea>`換行上色效果
- 使用`repeating-linear-gradient`來重複製造淺綠／白色相間的色塊背景
- 將文字的高度設定成與色塊背景高度一致，並在`background`加上`local`參數，讓背景隨著滑鼠滾輪捲動，視覺上更為自然
    <script src="https://gist.github.com/tzynwang/1badaf6cd76aa8aaef55437f307378e3.js"></script>


## JS內容
### `return`與`break`的差別
<script src="https://gist.github.com/tzynwang/3e954aaba9dc39d3c9409e58ebdbbd02.js"></script>

- 一開始在第13行與23行使用不正確的關鍵字`break`來脫離迴圈；`break`儘代表「跳脫現在的迴圈」，卻會繼續執行接下來的程式碼。故第13行使用`break`離開後，接下來會去執行第21行的程式碼（而不是脫離整個function）。
- 改用`return`後，第13行與23行的意義變為「印出錯誤訊息後，就離開function，不會繼續走完function接下來的程式碼」。

### Regular Expressions筆記
- 使用方式：先設定包覆在`//`中的`pattern`（有需要的話也可指定`modifiers`），再搭配`test()`來判定變數是否帶有pattern內容；以下為步驟解析：
    - `let r = /^\+?[1-9][0-9]*$/`中，pattern的內容是「`^\+?[1-9][0-9]*$`」
    - `^`：「開頭須包含」
    - `\+`與`?`：加號前面的斜線為跳脫字元，`?`代表可以有0個或1個`\+`
    - `[1-9]`：內容範圍涵蓋1到9
    - `[0-9]`與`*`：代表可以擁有0個（含）以上的`[0-9]`字元
    - `$`：「結尾須包含」
- 翻譯成白話文：「開頭需有1-9任一數字，可以有`+`號，接著可以有任意數量的0-9」
- pattern並無包含數字以外字元的內容，故如果是「`123a321`」這樣夾雜數字以外的字串，`r.test(x)`會回傳`false`
- 最後並沒有採用正規表示式來判定輸入內容是否為正整數，而是改用`parseInt()`，因為`parseInt()`可以同時處理`String`轉換為`Number`的工作


## 參考文件
- [CSS沒有極限 - 意想不到的background-attachment](https://wcc723.github.io/css/2013/09/25/background-att/)
- [Learn Regular Expressions In 20 Minutes](https://www.youtube.com/watch?v=rhzKDrUiJVk)
- [RegExr: Learn, Build, & Test RegEx](https://regexr.com/)：會顯示有依附關係的reg exr
- [regular expressions 101](https://regex101.com/)：有附debugger