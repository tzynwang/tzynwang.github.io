---
title: DevTools與CSS有關的新功能（Chrome 89）
date: 2021-03-03 19:22:14
categories: 
tags:
---

## 總結
本篇是記錄Chrome 89的DevTools中，CSS相關新功能的筆記。


## 版本與環境
```
Google Chrome: 89.0.4389.72 (Official Build) (64-bit)
os: Windows_NT 10.0.18363 win32 x64
```


## DevTools中與CSS相關的新內容（Chrome 89）
### 直接對node截圖
原文連結：https://developers.google.com/web/updates/2021/01/devtools#node-screenshot
{% figure figure--center 2021/chrome-89-css/node-screenshot.jpg %}
在node上點擊右鍵，選擇Capture node screenshot後，截圖就會下載到本機。

### 可直接套用偽類:target至元件上
原文連結：https://developers.google.com/web/updates/2021/01/devtools#force-target
{% figure figure--center 2021/chrome-89-css/target.jpg "可直接套用:target偽類 'The screenshot of DevTools'" %}
不用點擊連結，即可套用`:target`到元件上。
打開DevTools，點選Elements標籤，點選元件後按下:hov按鈕，即可展開支援套用的偽類（pseudo-element）清單。
選擇`:target`後，即可直接觀察相關的CSS表現內容。
{% figure figure--center 2021/chrome-89-css/target-example.jpg %}
{% figure figure--center 2021/chrome-89-css/target-example-select.jpg %}

以上兩張螢幕截圖用到的原始碼：
<p class="codepen" data-height="300" data-theme-id="dark" data-default-tab="html,result" data-user="Charlie7779" data-slug-hash="abBKWNL" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title=":target">
  <span>See the Pen <a href="https://codepen.io/Charlie7779/pen/abBKWNL">
  :target</a> by Charlie (<a href="https://codepen.io/Charlie7779">@Charlie7779</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

### 直接在DevTools裡面複製元件
原文連結：https://developers.google.com/web/updates/2021/01/devtools#duplicate-element
{% figure figure--center 2021/chrome-89-css/duplicate-element.jpg %}
{% figure figure--center 2021/chrome-89-css/duplicate-element-after.jpg %}
在元件上按下右鍵選擇Duplicate element後，該元件的副本就會出現在被拷貝的元件下方。
支援快速鍵，點選元件後按下`Shift`+ `Alt`+ ⬇️（Windows）或`Shift`+ `Option`+ ⬇️（Mac）即可拷貝元件。

### 支援color picker
原文連結：https://developers.google.com/web/updates/2021/01/devtools#color-picker
並且如果按住`Shift`後以滑鼠左鍵點擊顏色方塊的話，可以切換為不同的顏色編碼格式（RGBA、HSLA、Hex）


### 複製元件的CSS內容
原文連結：https://developers.google.com/web/updates/2021/01/devtools#copy-css
在Styles區塊對元件的CSS設定按下右鍵，可複製CSS內容。

{% figure figure--center 2021/chrome-89-css/copy-CSS-properties.jpg %}
如果是在選取器位置按下右鍵的話，會出現以下選項：
- Copy selector：複製選取器，上圖水藍色部分
- Copy rule：複製CSS規則，上圖黃色部分
- Copy all declarations：複製選取器與CSS規則，上圖水藍色加上黃色部分

{% figure figure--center 2021/chrome-89-css/copy-CSS-properties-1.jpg %}
如果是在中括號`{}`區塊按下右鍵的話，選項如下：
- Copy declaration：複製紅框與粉框部分
- Copy property：複製紅框部分
- Copy value：複製粉框部分
- Copy rule：複製水藍色加上黃色部分
- Copy all declarations：僅複製黃色部分


### 字體編輯面板（Experimental features）
原文連結：https://developers.google.com/web/updates/2021/01/devtools#font
{% figure figure--center 2021/chrome-89-css/font-editor.jpg %}
點選上圖紅框內的字體圖示，可即時調整字體設計。


### flexbox debug工具（Experimental features）
原文連結：https://developers.google.com/web/updates/2021/01/devtools#flexbox
{% figure figure--center 2021/chrome-89-css/flexbox-gap.jpg %}
{% figure figure--center 2021/chrome-89-css/flexbox-align-items.jpg %}
有`display: flex;`特性的元件，右側會顯示flex圖示。
滑鼠移動到flex相關的特性上，會在畫面中顯示提示。上圖分別是滑鼠指向`gap`與`align-items`。


## 附錄
### 開啟Experimental features
{% figure figure--center 2021/chrome-89-css/experimental-features.jpg %}
{% figure figure--center 2021/chrome-89-css/experimental-features-1.jpg %}
點選DevTools的齒輪圖示（設定），移動到Experiments標籤，勾選需要開啟的相關功能。
設定完畢後需關閉、重新啟動DevTools來套用設定。

### 檢查Chrome的版本
{% figure figure--center 2021/chrome-89-css/check-chrome-version.png "More icon >> Help >> About Google Chrome 'The screenshot of displaying the path to check Chrome's version'"%}
{% figure figure--center 2021/chrome-89-css/chrome-version-info.png "點選About Google Chrome後，即可看到Chrome版本 'The screenshot of Chrome version information'"%}
打開Chrome後，點選畫面右上角的垂直排列三點按鈕，依序選擇幫助、關於，點開關於後即可看到Chrome版本資訊。


## 參考文件
[CSS :target Selector](https://www.w3schools.com/cssref/sel_target.asp)
[How to check Chrome's version](https://www.google.com/chrome/update/)