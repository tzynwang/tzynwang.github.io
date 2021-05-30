---
title: Alpha Camp「2-2 電影清單」技術記錄
date: 2021-05-29 14:26:16
categories:
- JavaScript
tags:
---

## 總結
本次實作了以下功能：
- 搜尋電影（名稱），並在結果畫面中highlight使用者鍵入的關鍵字
  {% figure figure--center 2021/2-2-movie-list-note/searchAndHighlight.gif "'search and highlight demonstration gif'" %}
- 使用者可在主畫面（All movies）點擊星星按鈕來儲存「喜歡」的電影，可在喜愛清單（Favorite movies）瀏覽所有「喜歡」的電影
  {% figure figure--center 2021/2-2-movie-list-note/favorite.gif "'add movie to favorite list demonstration gif'" %}
- 根據使用者勾選的「電影類型」來篩選出相對應的電影，支援同時篩選複數類型
  {% figure figure--center 2021/2-2-movie-list-note/filter.gif "'filter feature demonstration gif'" %}
- （僅限主畫面）點擊電影資料卡（modal）中的類型徽章（badge），會篩選出屬於該類型的電影
  {% figure figure--center 2021/2-2-movie-list-note/filterByModalBadges.gif "'trigger filter by genres badges in each movie's modal card demonstration gif'" %}

主要練習到的技術：
- MVC design
- JavaScript modules
- `window.localStorage`

成品展示：https://tzynwang.github.io/ac_practice_2-2_movie_list/
原始碼：https://github.com/tzynwang/ac_practice_2-2_movie_list
專案結構：
{% figure figure--center 2021/2-2-movie-list-note/folderStructure.png "'folder structure'" %}

## 畫面與CSS
- 僅分拆為主畫面與喜愛清單兩份`.html`檔案
- 外觀使用[Bootswatch的Superhero視覺主題](https://bootswatch.com/)
- 除頂端的導覽列以外，電影清單、點擊Detail按鈕後顯示的卡片（modal）與分頁皆透過JavaScript產生
- 為卡片右側的電影描述文字欄位設定為`overflow-y: auto;`，維持卡片一慣高度
  {% figure figure--center 2021/2-2-movie-list-note/movieDescriptionOverflowY.jpg "'set movie description column overflow-y attribute as auto'" %}
- 為電影的類型徽章與分頁加上`cursor: pointer;`，提供「此物件可互動」的提示

## JavaScript部分
### 規劃
- 根據MVC概念將函式分類到view與controller模組（module）中；view負責與視覺畫面有關的功能，controller負責與資料處理相關的功能
- model模組負責儲存專案使用到的資料物件與設定
- 單純檢驗「使用者輸入的資料是否有效」的功能，歸類到utilities模組中（不進行任何資料處理，僅根據條件執行判斷）
- interaction模組中包含各種組合view與controller功能的函式，此模組內的函式皆以**名詞描述**或**動詞+名詞**的形式命名，讓開發者一眼就能知道該函式的目的
- index.html與favorite.html僅匯入interaction模組的功能，不直接與view、controller模組內的功能互動

### controller.js
<script src="https://gist.github.com/tzynwang/fcda3bff6d518e9b1c3982fa7c7268d4.js"></script>

- `fetchData()`僅執行「使用axios取得某API提供的資料」之功能，處理API資料的工作會交由其他函式來進行
- `localStorage`僅能儲存`strings`類型的資料，故`localStorage.getItem()`時需搭配`JSON.stringify()`，而透過`localStorage.getItem()`取出的資料，需使用`JSON.parse()`將字串轉回JavaScript物件

### view.js
<script src="https://gist.github.com/tzynwang/0cd46b3f99b83824a40c23cdc9718ee4.js"></script>

- `displayFilterBadges()`中的`Object.entries(obj)`會回傳一陣列，陣列內容為`obj`中所有key-value pair

### interaction.js
<script src="https://gist.github.com/tzynwang/c0c60c0caca7a5d18ed9cf305c0b38c0.js"></script>

- 關於**搜尋與篩選功能不並存**的設計：
 - 篩選行為的目的：想要瀏覽特定類型的電影
 - 搜尋行為的目的：想要搜尋「名字好像是……」的電影
 - 因兩種行為的目的不太相同，故最後採取互不相容的設計；搜尋時不支援篩選，篩選後進行搜尋、會重置篩選記錄

### index.js與favorite.js
index.html與favorite.html會使用到的JavaScript都先在interaction整理過了，直接匯入interaction模組的功能即可
<script src="https://gist.github.com/tzynwang/eb19d1d54ca8cea325e8fdabc15954f9.js"></script>

<script src="https://gist.github.com/tzynwang/1d7a65f5888e64ba8de2dcc4c4dfd68c.js"></script>

## 參考文件
- MDN
  - [JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
  - [Window.localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
  - [RegExp: constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp#description)
  - [Object.entries()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries)
- StackOverFlow
  - [Returning data from Axios API](https://stackoverflow.com/questions/48980380/returning-data-from-axios-api)
  - [How to return the response from an asynchronous call?](https://stackoverflow.com/questions/14220321/how-to-return-the-response-from-an-asynchronous-call)
  - [Correct async function export in node.js](https://stackoverflow.com/questions/46715484/correct-async-function-export-in-node-js)