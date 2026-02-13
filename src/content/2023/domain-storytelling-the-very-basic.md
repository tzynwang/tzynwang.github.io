---
title: 領域敘事（Domain Storytelling）：最基礎的筆記
date: 2023-12-04 20:04:03
tag:
  - [Product Design]
banner: /2023/domain-storytelling-the-very-basic/rain-bennett-wjMUVrZI1p4-unsplash.jpg
summary: 此篇文章是關於領域敘事（domain storytelling）的筆記——這是什麼？為何使用？如何進行？
draft:
---

## 總結

領域敘事（domain storytelling）是一種活動——集結與產品開發有關的人，讓他們描述產品的使用方式，並將討論結果記錄為故事圖（domain story）。圖會記載產品的使用流程，與流程中涉及的物件。

## 筆記

### 什麼是領域敘事

> A workshop to help people discuss and reach shared understanding on domain. Majorly for software development.

領域敘事會集合與產品開發有關的人——需求端（domain experts）與開發者（developers）——他們會討論、整理出對產品的共識。共識在這裡指的是產品的**使用流程**和**要解決的問題**。

領域敘事的活動成果是一份**故事圖**（domain story），記錄了參與者全體都同意的產品使用流程，以及流程中會牽涉到的物件。這份檔案常成為領域驅動設計（DDD）的參考資料。

---

組成故事圖的句子會由三種要素組成：

- 演員（actor）：指「使用產品的人」或「產品介面（前後端）」
- 工作物件（work object）：演員會建立、和工作物件互動（active）

以電商網站為例，句子會像這樣：

- 顧客（actor）在畫面（actor）上輸入（active）想購買的產品（work object）
- 顧客（actor）按下（active）確認按鈕（work object）後，畫面（actor）要呈現查詢結果（work object）

![example of e-shop domain story](/2023/domain-storytelling-the-very-basic/eshop-domain-story-example.png)

---

關於故事圖，你需要注意的是：

- 故事圖不能取代產品規格書，但你可以根據它的來產出規格文件
- 故事圖不能取代「大家一起確認產品的使用流程」這件事

故事圖的本質是**記錄眾人的討論結果**，供日後複查。不代表需求端、開發者可以不參與規格討論。

### 為何需要領域敘事

領域敘事讓所有跟產品開發有關的人坐下來討論、畫出產品的使用流程——會強制所有人理解該產品的商業邏輯與需要實作的功能。並且，將流程**實際畫下來**能確保需求端、開發端對產品的外觀與功能達成共識、減少誤會。

### 如何舉辦領域敘事工作坊

工作坊會有兩種角色：

- 參與者：為需求端（domain experts）與開發端（developers），負責完成領域敘事
- 主持人：幫忙記錄故事圖、透過提問來引導參與者

執行流程如下：

1. 參與者會敘述「使用者會如何與產品互動」
2. 主持人負責記錄、並將結果公開給所有參與者閱覽；如果敘事內容有誤，就要馬上更正
3. 當參與者無法想到新的描述時，主持人可透過以下問題來幫忙推進討論：
   1. 在執行ＸＸ後，會發生什麼事？
   2. 畫面上的結果是怎麼來的？
   3. 你怎麼知道下一步要做什麼？
4. 一份故事圖可能無法囊括一個產品的所有錯誤情境與例外處理流程，這時就需要再起一個工作坊來根據這些分支繪製另一份圖

## 參考文件

- [Domain Storytelling](https://domainstorytelling.org/)
