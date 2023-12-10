---
title: 閱讀筆記：The Programmer's Brain Chapter 9 Avoiding bad code and cognitive load -- Two frameworks
date: 2023-08-17 19:52:10
tag:
  - [General]
summary: 本書認為程式碼引起困惑的理由主要可分為「結構不良」與「命名不良」兩大類型。
banner: /2023/the-programmers-brain-ch9-avoiding-bad-code-and-cognitive-load/jamie-street-Zqy-x7K5Qcg-unsplash.jpg
---

## 總結

此篇文章是 Good Code, Bad Code: Think like a software engineer 第九章（Avoiding bad code and cognitive load）的閱讀筆記。

本書認為程式碼引起困惑的理由主要可分為以下兩種：

1. 結構不良（structural anti-pattern）引起的困惑，比如一段程式碼太長，進而導致理解不易
2. 命名不良（conceptual anti-pattern, linguistic anti-pattern）引起的困惑，比如一個功能的名稱與其實際執行後產生的結果不符（多做、少做、或做了跟命名比起來根本相反的事情）

此章節並沒有提供處理程式碼引起困惑的手段（重構方法），而是在講解**為何不良的結構或命名會造成認知負荷（cognitive load）**。

## 筆記

### 不良結構的影響

因為工作記憶（working memory）的容量僅有 4 到 6 槽（slot）的容量，過長的 parameter list 或是 switch statement 會讓讀者很難記住一整段程式碼到底負責了多少內容。

> Knowing what we know about the working memory, we can understand why long parameter lists and complex switch statements are hard to read: both smells are related to an **overloaded working memory**.

太冗長的功能（比如超過 10 行，且也沒有透過註解或排版進行分段的功能）會讓讀者無法有效進行分塊（chunking），這讓讀者必須花費時間把所有的程式碼都讀完，才能得知自己需要的訊息。如果一大段功能可以被有效拆解、命名為數個有意義的小功能，讀者可以靠這些小功能的名稱來快速理解這些程式碼想要完成的任務。

> A benefit of dividing functionality over separate functions, classes, and methods is that **their names serve as documentation**. ...This is why code smells related to large blocks of code, including God classes and long methods, are harmful: **there are not enough defining characteristics to quickly comprehend the code**, and we have to fall back on reading code line by line.

而如果兩個不同的功能包含大量重複、僅在細節有一點點差距的內容，這會讓讀者在第一眼產生錯誤的分塊，容易產生誤會。以下圖為例，兩個功能僅差在最後回傳的內容是 `j++` 或是 `j+2` ，沒有細看的讀者可能會以為 `foo` 與 `goo` 是「只有名稱不同的同一種功能」。而這個誤解可能會持續很長一段時間才會被發現。

![code clone](/2023/the-programmers-brain-ch9-avoiding-bad-code-and-cognitive-load/figure_9-2.png)

> We have saw earlier in this book that such **misconceptions can linger in your mind for a long time**. You might need several exposures to the fact that `goo` is not the same as `foo` to really realize your mistake.

### 不良名稱的影響

一個功能的名稱如果與其實際的效果有所出入，即代表這個不良命名提供給讀者的其實是錯誤的訊息。且人類會根據名稱來搜尋長期記憶中是否有類似的資訊可以協助理解目前正在閱讀的內容，而錯誤的名稱會讓搜尋結果無助於理解眼前的事物。

誤導性的名稱也會讓讀者對一段程式碼進行錯誤的分塊。

> When reading a conflicting name, **the wrong information will be presented to you**. ...your LTM finds wrong facts while trying to support your thinking. Linguistic anti-pattern can also lead to wrong chunking because your brain assumes a meaning of code that is not actually implemented.

## 參考文件

- [Manning: The Programmer's Brain](https://www.manning.com/books/the-programmers-brain)
