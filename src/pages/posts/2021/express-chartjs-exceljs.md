---
layout: '@Components/pages/SinglePostLayout.astro'
title: 作業功能擴充：為老爸的私房錢新增開支圖表、將開支紀錄下載為Excel檔案
date: 2021-07-11 18:08:08
tag:
  - [Express]
  - [Mongoose]
---

## 總結

圖表套件：`chart.js`（[官方文件](https://www.chartjs.org/docs/latest/)）
生成 Excel 之套件：`exceljs`（[npm](https://www.npmjs.com/package/exceljs)）

![圖表成品示意](/2021/express-chartjs-exceljs/chartDemo.png)

## 環境

```
chart.js: 3.4.1
exceljs: 4.2.1
os: Windows_NT 10.0.18363 win32 x64
```

## 圖表部分

- 需求：
  - 使用者登入記帳 APP 時，若當月有任何記帳資料的話，顯示開支圖表；若該月份還未有任何記帳資料，則不會顯示圖表
  - 使用者可以在首頁篩選不同月份的記帳資料，篩選月份後，若該月份有記帳資料，則顯示圖表（反之該月份若無任何記帳資料，不顯示圖表）
  - 使用者若篩選特定類型的帳目資料，不顯示圖表
- 實作規劃：
  - 監聽`<input type="month">`的`change`事件，只有在使用者選取了帳目月份、且帳目類型為「全類別」的時候，才會顯示圖表
  - 根據使用者選擇的條件（月份、類型）向後端發出 POST request，等待後端回應資料後，再根據資料修改前端畫面

### 原始碼 1

<script src="https://gist.github.com/tzynwang/327957091f91f81b86c527f29a51c84d.js"></script>

## 將紀錄下載為 Excel 部分

- 需求：想要滿足「可以讓使用者備份記帳 APP 中的開支資料」此一需求
- 實作規劃：
  - 從資料庫中取出該使用者的所有未被刪除的帳目資料，寫入 excel 檔案後，下載該檔案
  - 搜尋關鍵字「express download excel」，參考 stackOverFlow 與 blog 討論串進行實作

### 原始碼 2

<script src="https://gist.github.com/tzynwang/b77a79b8bc53c6f5d546b4f18aa7ce71.js"></script>

## 參考文件

- [How I can use “LIKE” operator on mongoose?](https://stackoverflow.com/questions/43729199/how-i-can-use-like-operator-on-mongoose)
- [How to find items using regex in Mongoose](https://stackoverflow.com/questions/38497650/how-to-find-items-using-regex-in-mongoose)
- [Destroy chart.js bar graph to redraw other graph in same canvas](https://stackoverflow.com/questions/40056555/destroy-chart-js-bar-graph-to-redraw-other-graph-in-same-canvas)
- [Node.js Download Excel file example with exceljs](https://bezkoder.com/node-js-download-excel-file/)
