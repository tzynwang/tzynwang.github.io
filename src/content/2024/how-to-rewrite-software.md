---
title: 課程筆記：重構（refactor）的上位互換——重寫（rewrite）
date: 2024-11-19 08:43:05
tag:
	- [Product Design]
banner: /2024/how-to-rewrite-software/aaron-burden-y02jEX_B0O0-unsplash.jpg
summary: 重構只有消除開發者的困擾，但重寫可以一次解決開發者和使用者都在意的問題。
draft: 
---

在 Udemy 課程 [How to Build the Right Software (and Choose the Right Stack)](https://www.udemy.com/course/right-software-and-right-stack) 中得到一個有趣的洞見：

> 考慮重寫（rewrite），而不止步於重構（refactor）。

如果只能用一句話來解釋何謂重寫，那就是**從使用者的角度出發，解決前一版軟體沒有處理掉的問題**。

## 重寫（rewrite）是什麼

重構（refactor）和重寫（rewrite）不同。前者（參考 [wiki](https://en.wikipedia.org/wiki/Code_refactoring) 與 [refactoring.guru](https://refactoring.guru/refactoring)）的定義是：

> 在**不影響產品功能**的前提下，改善程式碼的設計、結構或實作方式。目的是**提升程式碼的維護性與（功能）拓展性**。

而本課程提出的重寫則是想達成以下目的：

> 解決前一版軟體沒有解決的問題（讓產品更成功）。

所以重寫絕不是單純升級既有功能的實作方式，而是在徹底理解使用者目前的問題後，移除/融合/升級既有功能。

## 為何選擇重寫（而不是進行重構）

> 因為重構只有解決開發者（程式碼面向）的問題。產品在重構後，可能還是沒有解決使用者的問題。但一個產品的**終極目標應該是解決使用者遇到的問題**。

另外課程中也指出，在重寫既有的產品時，開發者可能會發現**多個功能其實都是在試圖解決一樣的問題**（目的相同），這代表重寫時可以**刪除目的相同的程式碼**（日後要維護的程式碼變少）。所以重寫可以帶來雙贏的結果：

- 使用者能得到確實有解決問題的產品
- 開發者能維護比較少的程式碼

## 如何重寫

- 尋找**熟悉產品**的志願使用者，因為開發者需要~~老司機~~熟稔產品的使用者來協助確認**重寫後的產品是否真的有解決使用者的問題**
- 從使用者的**暫時解決方法（workaround）**切入：當使用者需要透過「暫時解決方法」來操作產品時，就代表這個產品還有無法滿足使用者需求的部分；開發者可以考慮**將「暫時解決方法」變成產品的標準流程**來解決使用者的問題
- 採取**小範圍調整、快速迭代**的策略來重寫產品，不要直接搞出 breaking change

> don't replace the whole software at once
