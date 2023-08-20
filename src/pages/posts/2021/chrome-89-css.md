---
layout: '@Components/pages/SinglePostLayout.astro'
title: DevTools與CSS有關的新功能（Chrome 89）
date: 2021-03-03 19:22:14
tag:
  - [DevTools]
  - [CSS]
---

## 總結

本篇是記錄 Chrome 89 的 DevTools 中，CSS 相關新功能的筆記。

## 版本與環境

```
Google Chrome: 89.0.4389.72 (Official Build) (64-bit)
os: Windows_NT 10.0.18363 win32 x64
```

## DevTools 中與 CSS 相關的新內容（Chrome 89）

### 直接對 node 截圖

原文連結：[https://developers.google.com/web/updates/2021/01/devtools#node-screenshot](https://developers.google.com/web/updates/2021/01/devtools#node-screenshot)

![node screenshot](/2021/chrome-89-css/node-screenshot.jpg)

在 node 上點擊右鍵，選擇 Capture node screenshot 後，截圖就會下載到本機。

### 可直接套用偽類:target 至元件上

原文連結：[https://developers.google.com/web/updates/2021/01/devtools#force-target](https://developers.google.com/web/updates/2021/01/devtools#force-target)

![可直接套用 :target 偽類](/2021/chrome-89-css/target.jpg)

不用點擊連結，即可套用`:target`到元件上。
打開 DevTools，點選 Elements 標籤，點選元件後按下:hov 按鈕，即可展開支援套用的偽類（pseudo-element）清單。
選擇`:target`後，即可直接觀察相關的 CSS 表現內容。

![target example](/2021/chrome-89-css/target-example.jpg)

![target example select](/2021/chrome-89-css/target-example-select.jpg)

以上兩張螢幕截圖用到的原始碼：

<p class="codepen" data-height="300" data-theme-id="dark" data-default-tab="html,result" data-user="Charlie7779" data-slug-hash="abBKWNL" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title=":target">
  <span>See the Pen <a href="https://codepen.io/Charlie7779/pen/abBKWNL">
  :target</a> by Charlie (<a href="https://codepen.io/Charlie7779">@Charlie7779</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

### 直接在 DevTools 裡面複製元件

原文連結：[https://developers.google.com/web/updates/2021/01/devtools#duplicate-element](https://developers.google.com/web/updates/2021/01/devtools#duplicate-element)

![duplicate element](/2021/chrome-89-css/duplicate-element.jpg)

![duplicate element after](/2021/chrome-89-css/duplicate-element-after.jpg)

在元件上按下右鍵選擇 Duplicate element 後，該元件的副本就會出現在被拷貝的元件下方。
支援快速鍵，點選元件後按下`Shift`+ `Alt`+ ⬇️（Windows）或`Shift`+ `Option`+ ⬇️（Mac）即可拷貝元件。

### 支援 color picker

原文連結：[https://developers.google.com/web/updates/2021/01/devtools#color-picker](https://developers.google.com/web/updates/2021/01/devtools#color-picker)
並且如果按住`Shift`後以滑鼠左鍵點擊顏色方塊的話，可以切換為不同的顏色編碼格式（RGBA、HSLA、Hex）

### 複製元件的 CSS 內容

原文連結：[https://developers.google.com/web/updates/2021/01/devtools#copy-css](https://developers.google.com/web/updates/2021/01/devtools#copy-css)
在 Styles 區塊對元件的 CSS 設定按下右鍵，可複製 CSS 內容。

![copy css properties 1](/2021/chrome-89-css/copy-CSS-properties.jpg)
如果是在選取器位置按下右鍵的話，會出現以下選項：

- Copy selector：複製選取器，上圖水藍色部分
- Copy rule：複製 CSS 規則，上圖黃色部分
- Copy all declarations：複製選取器與 CSS 規則，上圖水藍色加上黃色部分

![copy css properties 2](/2021/chrome-89-css/copy-CSS-properties-1.jpg)
如果是在中括號`{}`區塊按下右鍵的話，選項如下：

- Copy declaration：複製紅框與粉框部分
- Copy property：複製紅框部分
- Copy value：複製粉框部分
- Copy rule：複製水藍色加上黃色部分
- Copy all declarations：僅複製黃色部分

### 字體編輯面板（Experimental features）

原文連結：[https://developers.google.com/web/updates/2021/01/devtools#font](https://developers.google.com/web/updates/2021/01/devtools#font)

![font editor](/2021/chrome-89-css/font-editor.jpg)

點選上圖紅框內的字體圖示，可即時調整字體設計。

### flexbox debug 工具（Experimental features）

原文連結：[https://developers.google.com/web/updates/2021/01/devtools#flexbox](https://developers.google.com/web/updates/2021/01/devtools#flexbox)

![flex box gap](/2021/chrome-89-css/flexbox-gap.jpg)
![flexbox align items](/2021/chrome-89-css/flexbox-align-items.jpg)

有`display: flex;`特性的元件，右側會顯示 flex 圖示。
滑鼠移動到 flex 相關的特性上，會在畫面中顯示提示。上圖分別是滑鼠指向`gap`與`align-items`。

## 附錄

### 開啟 Experimental features

![experimental features 1](/2021/chrome-89-css/experimental-features.jpg)
![experimental features 2](/2021/chrome-89-css/experimental-features-1.jpg)

點選 DevTools 的齒輪圖示（設定），移動到 Experiments 標籤，勾選需要開啟的相關功能。
設定完畢後需關閉、重新啟動 DevTools 來套用設定。

### 檢查 Chrome 的版本

![More icon >> Help >> About Google Chrome](/2021/chrome-89-css/check-chrome-version.png)
![點選About Google Chrome後，即可看到Chrome版本](/2021/chrome-89-css/chrome-version-info.png)

打開 Chrome 後，點選畫面右上角的垂直排列三點按鈕，依序選擇幫助、關於，點開關於後即可看到 Chrome 版本資訊。

## 參考文件

- [CSS :target Selector](https://www.w3schools.com/cssref/sel_target.asp)
- [How to check Chrome's version](https://www.google.com/chrome/update/)
