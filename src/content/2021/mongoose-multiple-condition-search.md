---
title: 從零開始重寫：餐廳清單（Express版）複數條件篩選
date: 2021-07-06 15:25:04
tag:
- [Mongoose]
---

## 總結

實作了「使用者勾選餐廳類別後，根據使用者勾選的類別顯示相對應的內容，並支援複數類別檢索」，記錄一下如何透過 mongoose 執行相關的搜尋操作

![功能展示](/2021/mongoose-multiple-condition-search/filterDemo.gif)

## 環境

```
mongoose: 5.12.14
os: Windows_NT 10.0.18363 win32 x64
```

## 筆記

### 前端 filter.js

<script src="https://gist.github.com/tzynwang/575200d7844107259bc11c89733f5b2c.js"></script>

- 第 7 行：取畫面中所有被勾選起來的選項
- 第 9 行：將 nodeList 整理為只剩下勾選內容的乾淨陣列，假設使用者勾選類別「美式餐廳」與「酒吧」，那麼`selected`內容即為`['美式餐廳', '酒吧']`
- 第 11 行：等同`const payload = { selected: selected }`
- 12-16 行：透過 axios 對`/restaurant/filter`發送 POST 請求，夾帶`data: payload`
- 17 行：載入 loading spinner
- 19 行：根據`/restaurant/filter`回傳的資料重新渲染畫面

### 後端 restaurant.js

<script src="https://gist.github.com/tzynwang/6229f2d31c1b7bebf0ce5a6cb9dc3b14.js"></script>

- 第 2 行：`selected`內容與前端 filter.js 的`selected`一致；假如使用者勾選類別「美式餐廳」與「酒吧」，那麼這裡`selected`的內容即為`['美式餐廳', '酒吧']`
- 第 3 行：為了配合 mongoose 的`.or()`，將`selected`加工為`[ { category: '美式餐廳' }, { category: '酒吧' } ]`的形式，放入`.or()`中的意思即為「搜尋 category 為美式餐廳或是咖啡的 Document」
  `const conditions = selected.map(category => ({ category }))`等同
  ```js
  const conditions = selected.map((category) => {
    return { category: category };
  });
  ```
- 第 7 行：根據`selected.length`判斷使用者是否有勾選任何篩選類別，如果「一個類別都沒有勾選」的話，視同停止篩選行為，故回傳該使用者擁有的所有餐廳；反之在使用者「有勾選類別」的情況下，就根據使用者勾選的類別進行篩選

## 參考文件

- [axios post array data](https://stackoverflow.com/questions/45072255/axios-post-array-data)
- [Mongoose's find method with $or condition does not work properly](https://stackoverflow.com/questions/7382207/mongooses-find-method-with-or-condition-does-not-work-properly)
