---
title: 閱讀筆記：The Art of Unit Testing Chapter 8 Maintainability
date: 2024-01-27 20:20:34
tag:
	- [Testing]
banner: /2024/the-art-of-unit-testing-ch8-maintainability/todd-quackenbush-IClZBVw5W5A-unsplash.jpg
summary: 本書以「單元測試被修改的頻率」來衡量該測試的可維護性（maintainability）。修改的次數越少，維護性就越高。而這便是本篇筆記的主題——如何寫出好維護的測試（如何避免動不動就要修改測試）。
draft: 
---

## 簡介

本書以「單元測試被修改的頻率」來衡量該測試的可維護性（maintainability）。修改的次數越少，維護性就越高。

> Maintainability is a measure of **how often we are forced to change the tests**. We’d like to minimize the number of times that happens.

而這便是本篇筆記的主題——如何寫出好維護的測試（如何避免動不動就要修改測試）。

## 何時需要修改測試

答：測試沒過的時候 🤡

說真的，除了測試失敗，誰沒事會去動測試？而測試會失敗除了 [7 Trustworthy tests#為何測試會紅燈](/2024/the-art-of-unit-testing-ch7-trustworthy-tests#為何測試會紅燈) 提過的理由以外，其實還有最後一種~~四大天王有五個人是常識~~——測試本身的邏輯沒有問題，單元想實現的內容也沒有變，但單元的「使用方式」變了，導致測試也需要被修改。

本書認為一個好（維護）的單元測試要盡量降低這類修改的次數。而要達成這個目標，請在撰寫單元測試時秉持以下兩點要訣：

- 透過工廠功能管理重複內容
- 不要驗證實作細節

## 如何寫出好維護的測試

### 善用工廠功能（factory function）

詳細操作方式可以回頭翻 [2 A first unit test#2.7 Trying the factory method route](/2023/the-art-of-unit-testing-ch2-a-first-unit-test#27-trying-the-factory-method-route)。重點回顧如下：

將「啟動單元的步驟」集中到工廠功能的好處是，當啟動單元的方法變了，我們只要去修改「啟動單元的工廠功能」就好。不需要海巡該單元的所有測試。

除此之外，「預設單元的測試情境」也很適合透過工廠功能集中管理。除了貫徹 [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) 以外，降低設定情境的麻煩度也能減少測試之間的依賴性。

想像一下：你沒有使用工廠功能來設定測試情境，但又不想在三組測試裡重複「產出特定結果」的程式碼。於是你決定在第一組測試裡產出、驗證這個結果，將它保存到全域變數裡，再使用這個值來執行後續的測試。

不幸的事發生了——第一組測試沒過，然後第二、三組測試也跟著失敗了。但你無法馬上確認後兩組測試失敗的理由是「第一組測試沒過」還是「這兩組測試驗證的退出點真的有問題」。更別說這種寫法還有一個大前提，那就是你得確保這三組測試永遠要依序執行。

比較好的做法是，透過工廠功能來產出「執行測試時必要的值」，讓第二、三組測試不需要關注第一組測試的內容——達成「每一組測試完全獨立，不受彼此影響」的目標。

### 不要驗證實作細節

如題，不要為實作細節（比如 class private property）撰寫測試。請專心檢查退出點（回傳的值、改變的狀態、是否有呼叫第三方套件）即可。

> If you test only the private method and it works, that **doesn't mean that the rest of the system is using this private method correctly** or handles the results it provides correctly.

當你確認一個單元的功能正確時，就代表該單元的實作細節必定也是正確的。反之，即使你確認某段實作細節的行為符合預期，也無法保證一個單元「有正確地使用該實作細節」——要確保一個單元的行為符合預期，那就專注於驗證單元的退出點就好。

## 參考文件

- [Manning: The Art of Unit Testing, Third Edition](https://www.manning.com/books/the-art-of-unit-testing-third-edition)
