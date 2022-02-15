---
title: 2022 第5週 實作筆記：日期選取器
date: 2022-02-12 22:48:46
categories:
  - React
tags:
---

## 總結

記錄一下工作專案會應用到的日期選取器（選項包含允許使用者自訂日期區間）
demo: https://tzynwang.github.io/react-double-date-range/
目前版本之 repo: https://github.com/tzynwang/react-double-date-range/tree/feature/3-third-version

{% figure figure--center 2022/work-log-2022-w5/createdAt.png %}
{% figure figure--center 2022/work-log-2022-w5/updatedAt.png %}

已實作內容：

- 「建立日期區間」與「更新日期區間」互不影響彼此內容
- 選擇選項「自訂日期區間」並選擇了開始與結束日期後，下拉選單會顯示使用者點選的開始與結束日期區間
- 當使用者在「自訂日期區間」選擇的「開始日期」晚於「結束日期」時，自動重設「結束日期」的值

## 筆記
- 大部分的程式碼都包在 `FilterRangeSelector` 元件裡面，讓 `App.tsx` 保持簡短整潔
- 因「建立日期區間」與「更新日期區間」為兩套互不影響的資料，故 `Selector` 與 `DateRangeCalender` 也直接實作兩套，雖然增加了一些重複內容，但讓事後回頭檢視 code 時比較容易理解其功能（省去目標在 createdAt 與 updatedAt 切來切去之間讓 code 的閱讀難度上升）
- 透過 `useEffect` 分別訂閱 `dateRange.createdAt` 與 `dateRange.updatedAt` 的值來根據使用者選取了下拉選單的哪一個選項做出對應行為（單純計算日期即可、或是需要開啟 `DateRangeCalender`）
- 透過 `useEffect` 訂閱 `calender` 的值，在 gte 日期晚於 lt 日期時重設 `calender.createdAt`/`calender.updatedAt` 的 `lt`，確保 lt 日期必定晚於 gte
- 僅需要從 `App.tsx` 對 `FilterRangeSelector` 元件傳入 `setQueryParams` 使其可以更新 `queryParams` 的值即可
- 使用 @mui DatePicker 元件需執行 `npm i @mui/lab` 並根據專案使用的日期套件 import 相對應的 `AdapterDateFns`，詳細參考 [Date Picker/Requirements](https://mui.com/components/date-picker/#requirements)

## 參考文件

- [Day.js: Difference](https://day.js.org/docs/en/display/difference)
