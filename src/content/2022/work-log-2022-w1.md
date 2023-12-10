---
title: 2022 第1週 學習記錄： React 表單元件與動態內容
date: 2022-01-07 23:25:47
tag:
  - [React]
---

## 總結

在週末花了一點時間實作出可以適應動態內容的 React 表單元件

## 筆記

### we no longer support global installation of Create React App

本週執行 `npx create-react-app <app-name>` 時遇到以下問題：

```
We are running `create-react-app` 4.0.3,
which is behind the latest release (5.0.0).

We no longer support global installation of Create React App.
```

但我並沒有在 global 環境安裝 `create-react-app`，故也無從更新起，搜尋關鍵字後得到以下兩種解決方式：

1. 輸入 `npx create-react-app@5.0.0 <app-name>` ，直接標註出要使用的版本
2. 先輸入 `npx clear-npx-cache` 後再執行 `npx create-react-app@ <app-name>`

<iframe width="560" height="315" src="https://www.youtube.com/embed/Q7i8kDJGyHE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### Declarative programming, Imperative programming

重看 Complete React Developer in 2022 時發現之前沒注意到的內容，筆記一下

- Declarative programming: what you want from the program
  - React 屬於此種類型
  - 開發者僅需宣告「資料（state）應該長什麼樣子」，由 React 來處理「如何把資料更新到畫面上」這一段
- Imperative programming: how should the program work, how you solve the problem (the algorithm, the steps to reach the goal)
  - 開發者寫下所有要執行的內容，徹底說明要透過什麼方式來達成目的地
  - 在不使用 React 等前端框架的情況下，開發者如果要更新畫面上的 DOM 文字內容，就需要透過（舉例） `document.querySelector('#id')` 來抓取特定 DOM 後，再將要更新的內容透過 `innerText` 或 `innerHTML` 塞進去；這種做法就是 imperative programming

<iframe width="560" height="315" src="https://www.youtube.com/embed/4A2mWqLUpzw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### React 表單元件與動態內容

![demo](/2022/work-log-2022-w1/dynamic-content-table.png)

成品連結：[https://tzynwang.github.io/react-dynamic-table/](https://tzynwang.github.io/react-dynamic-table/)

簡述：截圖中兩個表格都是同一個元件，但可處理各種數量的欄位、與一定程度的彈性樣式，以及配合不同資料的對應互動行為

- 上方表格在滑鼠 hover 每一列 table row 時，最右側會顯示一圖示，點擊後會彈出 model 描述該 table row 的內容
- 下方表格的每一列 table row 都是一個 anchor，點擊後會開啟對應的 google 搜尋頁面結果

架構：

```
src
  component
    modal
    page
    table
      table
      tableRow - 將 tableRow 額外拆出來是為了處理一條 tableRow 本身可能會是 <a> 的狀況
  mock - 本次沒串 API，直接把假資料設定好後 import 到 component/page 中
    dessert
    pet
  model - types definition 放這邊
    dessert
    pet
```

相關段落原始碼：

<script src="https://gist.github.com/tzynwang/bbd5b26a9f93dfc9f48b4aafbc9ece80.js"></script>
<script src="https://gist.github.com/tzynwang/e3df232f84cdefc912e164ff808103a5.js"></script>

概念說明：

- 每一行 tableRow 的內容由元件 `DynamicTableRow` 包覆，而一行 tableRow 中的每一個 col 則使用 `function renderRowCol(row, headerCol)` 產生
- 元件 `DynamicTableRow` 的意義是根據傳入的 `props` 決定該 row 是否需渲染為 `<a>`，如果沒有把表單內容做成超連結的需求的話，不需額外抽出此元件
- 每一個 table col 的寬度由 HeaderCol 控制（欄位寬度設定在 `src/mock` 資料中）
- 元件 `DynamicTable` 的 `renderRowCol` 可根據不同的表格資料傳入不同的 render function，本次練習即使用了兩種 function `handlePetRowCol` 與 `handleDesertRowCol`
- 兩種 `renderRowCol` 都會配合各自的 mock data 來回傳對應內容；如 `handlePetRowCol` 在 action col 會回傳 `IconButton` 元件

## 參考文件

- [We no longer support global installation of Create React App](https://dev.to/arjuncodes/we-no-longer-support-global-installation-of-create-react-app-2p)
- [(YouTube) Imperative vs Declarative Programming](https://youtu.be/yOBBkIJBEL8)
