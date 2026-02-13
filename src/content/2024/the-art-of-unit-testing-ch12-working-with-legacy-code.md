---
title: 閱讀筆記：The Art of Unit Testing Chapter 12 Working with legacy code
date: 2024-02-17 20:39:26
tag:
  - [Testing]
banner: /2024/the-art-of-unit-testing-ch12-working-with-legacy-code/randy-fath-ymf4_9Y9S_A-unsplash.jpg
summary: 如何決定重構目標？可以從一個單元的邏輯複雜度、依賴數量與核心價值來決定重構的起點
draft:
---

## 重點

工程師可以根據單元的邏輯複雜度、依賴數量、核心價值來挑選值得投資時間重構的目標。

## 如何安全地重構

在重構前先幫既有的功能寫好整合測試（integration test），並且在確認整合測試全數綠燈後，才開始重構、並補寫單元測試。

重構完成後，再跑一次整合測試，確保功能都還有在正常運作。

## 從哪裡開始重構

### 如何評估優先順序

可以根據以下三種要素來評估哪些單元值得我們花時間重構它：

1. 邏輯複雜度（logical complexity, [cyclomatic complexity](https://zh.wikipedia.org/zh-tw/%E5%BE%AA%E7%92%B0%E8%A4%87%E9%9B%9C%E5%BA%A6)）
2. （被）依賴數量
3. 整體優先度：該單元在整個服務中是否具有特殊地位（例：是否為核心商業邏輯）

推薦從「邏輯複雜度高」或「整體優先度高」的單元開始重構計畫。

### 策略

- 由簡入難：挑選優先度高、但複雜度低的單元開始重構，推薦給還不熟悉重構、撰寫單元測試的團隊——先累積經驗，之後能比較順利地處理複雜的單元
- 由難入簡：已經是重構、測試老司機了嗎？推薦你直接從最複雜、依賴最多的單元下手，理由是——當你在拆解這顆未爆彈時，你多半會~~被迫~~順手處理很多程式碼。在經歷大風大浪後，剩下的目標會為你帶來極為舒適的開發體驗 😇

## 參考文件

- [Manning: The Art of Unit Testing, Third Edition](https://www.manning.com/books/the-art-of-unit-testing-third-edition)
