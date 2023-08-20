---
layout: '@Components/SinglePostLayout.astro'
title: 閱讀筆記：Good Code, Bad Code Chapter 2 Layers of abstraction
date: 2023-03-07 20:04:23
tag:
  - [Software Architecture]
---

## 總結

此篇文章是 Good Code, Bad Code: Think like a software engineer 第二章（Layers of abstraction）的閱讀筆記。此章重點為：

- 為什麼需要抽象層（layers of abstraction）
- 抽象層如何提升程式碼的品質
- 實作要訣

## 筆記

### 為何需要抽象層

> **How we structure code** is one of the most fundamental aspects of code quality, and doing it well often comes down to **creating clean layers of abstraction**.

本書作者認為程式碼的**結構**乃是影響程式碼品質最基礎的要素之一，而如果一段程式碼擁有良好的結構，通常代表該程式碼擁有明確的抽象層。

> More generally, if we do a good job of recursively breaking a problem down into subproblems and creating layers of abstraction, then **no individual piece of code will ever seem particularly complicated**, because it will be dealing with just a few easily comprehended concepts at a time.

工程師在解決問題時，通常會將一開始的問題分拆為數個小問題各自擊破。對工程師來說，將大問題分拆為小問題會讓我們一次只需要面對原始問題的「一小部分」，這能降低每一道問題的複雜度與難度。

結論：良好的抽象層規劃，能讓原本複雜的問題變簡單。一個大問題一旦被分解，工程師在理解（為了解決每一個小問題的）程式碼時也會比較輕鬆，因為每一次需要面對的問題其規模都變小了。

### 抽象層如何提升程式碼的品質

本書認為抽象層能夠強化程式碼的以下特性：

- 可讀性：大拆小後，工程師單次需要閱讀的程式碼變少
- 模組化：每個小功能專注於單一問題，降低彼此的耦合程度，避免日後每一次修改都會牽一髮動全身
- 復用性（reusable）與通用性（generalizable）：承上，如果有良好的抽象層規劃，則每一小段程式碼除了能解決當下遭遇的問題外，也有機會在其他的問題情境中被使用
- 可測試性：一大段程式碼被拆為粒度較細的段落後，可進一步針對各段程式碼進行測試。比起原本一整大段的狀態，可靠度較高

### 實作要訣

- 一個 function 完成後，是否能**只用一句話**概括該 function 要解決的問題。如果無法，則可規劃將此 function 分割為更多的 function
- 在建立一個新的 class 或修改既有的程式碼時，盡量讓該 class 持續性地「只集合單一概念的程式碼」。並且合理規劃 public method，實作細節不需要公開，選擇暴露有限、有實際意義的接口即可（概念與 API 類似，取得結果時不需要知道實作細節）
- 考慮定義 interface（以 TypeScript 情境來說，即定義 abstract class）：讓所有的實作都遵照該規格，降低日後修改需求的難度。實務上的好處是，待規格制定完畢後，實作的工項可以派發給其他人進行。以前後端的情境來說，即是 API 規格定好後，兩邊即可分頭執行工作，不會有等待、開發空轉的問題

## 參考文件

- [Manning: Good Code, Bad Code](https://www.manning.com/books/good-code-bad-code)
- [What is the difference between interface and abstract class in Typescript?](https://stackoverflow.com/questions/50110844/what-is-the-difference-between-interface-and-abstract-class-in-typescript)
