---
title: 閱讀筆記：Good Code, Bad Code Chapter 3 Other engineers and code contracts
date: 2023-03-11 17:19:51
tag:
- [Software Architecture]
---

## 總結

此篇文章是 Good Code, Bad Code: Think like a software engineer 第三章（Other engineers and code contracts）的閱讀筆記。主要在說明：

- 為何程式碼會被誤用
- 如何避免程式碼被誤用

## 筆記

我們寫好的程式碼除了自己以外，多少都有機會被其他工程師使用。更極端地來說，就算這些程式碼永遠只會被自己使用（或維護），降低程式碼被誤用的機會也有助於提升軟體的可靠度。

理由：程式碼一旦被誤用（該程式碼能正確執行的前提不成立），則無法保證程式碼的行為繼續符合預期，這會導致使用這段程式碼的軟體變得不可靠。

### 為何程式碼會被誤用

以下是本書列出的三種可能性：

1. 當你在撰寫一段程式碼解決問題時，你本人必定十分清楚這個問題的整體脈絡以及解決方式。但是當其他工程師使用你寫好的東西時，他們對於這個問題的知識（理解）通常不會和你一樣多。這個資訊落差會導致其他人可能會透過預期外的方式來使用你的程式碼
2. 承上，如果你的程式碼不幸被誤用，卻沒辦法針對這些「誤用」做出反應（編譯失敗、拋出錯誤等），誤用者可能根本無法察覺問題，於是「誤用」持續發生
3. 時間久了，連你自己也會忘記當出撰寫這些程式碼的情境或理由

### 如何避免程式碼被誤用

撰寫程式碼時，預想其他人可能會如何誤用這段程式碼，並根據預想引用對應手段：

1. 賦予程式碼有意義的命名，理想狀態：閱讀一段程式碼的名稱，就能理解該程式碼要做什麼
2. 為程式碼的參數以及回傳內容設定有意義的型別。以 TypeScript 來說，如果一個 function 需要傳入參數、或執行完畢後會回傳對應結果，則這兩個行為都會限制工程師「僅能傳入正確型態的參數」以及「檢查回傳物的型別是否符合預期、或是根據型別切換條件分支」
3. 盡可能避免「只能透過註解或文件」來使人了解一段程式碼，理由如下：
   1. 不像程式碼的名字，你無法強迫所有使用你的 code 的人一定要先讀註解、文件
   2. 無法保證其他人讀了註解、文件後就能完全理解一段程式碼的意圖，可能文件並不明確、或是讀者誤會文字內容
   3. 註解與文件不一定會與程式碼同步更新，文字傳遞的資訊可能會過時
4. 盡可能避免「隱藏條件」：
   1. 如果需要先讓特定條件成立、才能確保程式碼能順利運作，那就讓這個前提**不能被跳過**
   2. 讓程式碼在該條件失效的情況下停止編譯、或是拋出錯誤，確保程式碼不會帶著錯誤的前提繼續執行

補充：許多提升程式碼品質的方法，其實都圍繞在「限縮狀態」或「限制（針對值的）修改」這兩件事情上。

> Many ways of improving code quality revolve around **minimizing state or mutability**.

### 契約式設計

> engineers think about the interactions between different pieces of code **as though they were a contract**: callers are required to **meet certain obligations**, and in return, the code being called will **return a desired value or modify some state**.

將程式碼間的互動比喻為契約，呼叫程式碼的一方要先滿足特定條件，而被呼叫的程式碼在前提成立時，會回傳期望的結果（或更新狀態）。

## 參考文件

- [Manning: Good Code, Bad Code](https://www.manning.com/books/good-code-bad-code)
- [Wikipedia: 契約式設計](https://zh.wikipedia.org/zh-tw/%E5%A5%91%E7%BA%A6%E5%BC%8F%E8%AE%BE%E8%AE%A1)
