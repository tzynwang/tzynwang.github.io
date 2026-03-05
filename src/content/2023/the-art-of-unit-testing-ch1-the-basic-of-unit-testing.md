---
title: 閱讀筆記：The Art of Unit Testing Chapter 1 The basics of unit testing
date: 2023-12-01 21:12:26
tag:
  - [Testing]
banner: /2023/the-art-of-unit-testing-ch1-the-basic-of-unit-testing/roman-mager-5mZ_M06Fc9g-unsplash.jpg
summary: 此為 The Art of Unit Testing 第一章的閱讀筆記。此章旨在討論單元測試的定義，以及怎樣才算是好的單元測試。
draft:
---

## Intro

執行測試是開發軟體時無法跳過的劇情。但手動測試耗時、高重複的特性讓人避之唯恐不及。這些討厭的環節可以靠測試框架克服，但使用框架不保證你寫出來的就是好測試。

而好測試就是本書第一章討論的主題：「什麼是單元測試」、「何謂好的單元測試」。書中以 JavaScript 與 TypeScript 來撰寫範例，但好測試的概念是不受語言限制的。

## 1.1 The first step

單元測試不是整合測試（integration testing）。讓單元測試就只是單元測試——不論測試通過或失敗，你都不會懷疑結果是否有問題。

> Separating unit tests from other types of tests can be crucial to **having high confidence in your tests** when they fail or pass.

## 1.2 Defining unit testing, step by step

單元測試的優點是：

- 能改善程式碼的品質
- 能讓工程師充分理解一段程式碼的功能

而單元測試中的「單元」又被稱為 SUT (subject, system, or suite under test) 或 CUT (component, class, or code under test)。

### 何謂單元測試的「單元」

指工作單元（unit of work）或使用案例（use case）。有進入點（entry point）與退出點（exit point）。此稱呼不一定代表 function，一個 class 或 module 也能是單元。

#### 工作單元

根據本書定義，是從開始執行到產出結果（entry point 到 exit point）為止，發生的所有動作。

> A unit of work is the **sum of actions** that take place between the invocation of an entry point up until a noticeable end result through one or more exit points.

#### 使用案例

[維基](https://en.wikipedia.org/wiki/Use_case)提供兩種解釋：

1. 描述程式碼的使用情境
2. 描述程式碼如何回應請求

### 單元測試的定義，第一版

> 單元測試是為了確保軟體的一部分（「單元」）行為符合規格。單元可以指一個模組，但更常被認為是一個功能。在物件導向程式設計中，單元通常代表介面（interface），有時是方法（method）。

## 1.3 Entry Points & Exit Points

工作單元可以是一個 function、多個 functions、多組 modules，永遠有進入點（entry point）讓工程師觸發（trigger）它，永遠會做有用的事（do something useful, a.k.a exit point）。有用的事是：

- 回傳值
- 改變狀態
- 呼叫依賴（dependency）

一個工作單元可能會做一件以上有用的事——但如果一件都沒做，請把它給刪了。

---

每一個進入點與退出點都該有自己的單元測試，理由如下：

- 提升測試可讀性
- 除錯條件單純
- 牽涉範圍小，容易維護

> 書中使用名稱「退出點（exit point）」來表達結束的意象，但「行為（behavior）」沒有。

### 回傳值的退出點

執行以下 `sum('2,3');` 時，我們在同一行觸發並取得結果——亦即進入點與退出點在同一處。

```js
const sum = (numbers) => {
  const [a, b] = numbers.split(",");
  const result = parseInt(a) + parseInt(b);
  return result;
};

sum("2,3"); // 5
```

### 改變狀態的退出點

執行以下 `sum('2,3');` 時，進入點維持一個，但退出點變成兩個——分別是 `total += result;` 與 `return result;`。

```js
let total = 0;
const totalSoFar = () => {
  return total;
};
const sum = (numbers) => {
  const [a, b] = numbers.split(",");
  const result = parseInt(a) + parseInt(b);
  total += result;
  return result;
};

sum("2,3"); // 5
```

以上程式碼至少要有兩個單元測試覆蓋兩個退出點。

我們甚至能寫出第三個單元測試：以 `totalSoFar()` 為進入點，檢查退出點 `return total;` 的值是否符合預期。

### 呼叫依賴的退出點

下方的 `logger.info()` 就是退出點的第三種形式——呼叫依賴（calling a dependency）。

```js
let total = 0;
const totalSoFar = () => {
  return total;
};
const logger = makeLogger();
const sum = (numbers) => {
  const [a, b] = numbers.split(',');
  logger.info(                             
    ‘this is a very important log output’, 
    { firstNumWas: a, secondNumWas: b });  
  const result = parseInt(a) + parseInt(b);
  total += result;
  return result;
};
```

依賴（dependency）的特徵：無法控制其行為、測試成本高。本書的反面定義如下：

> “If I can **fully and easily control** what it’s doing, and it **runs in memory**, and its **fast**, it’s not a dependency". There are always exceptions to the rule, but this should get you through 80% of the cases at least.

### 題外話：設計模式 Command and Query Responsibility Segregation (CQRS)

CQRS 的概念：一個功能選擇 command 或 query 一件事情做就好。

- command 代表執行修改，不回傳內容
- query 代表回傳查詢結果，不修改內容

徹底隔離的好處：讓工程師自在執行 query 功能時，不用擔心意外影響資料。

> [martinFowler.com: CommandQuerySeparation](https://martinfowler.com/bliki/CommandQuerySeparation.html): This is because you **can use queries in many situations with much more confidence**, introducing them anywhere, changing their order. You have to be more careful with modifiers (commands).

## 1.4 Exit Point Types

再講一次，退出點（exit point）有三種類型：

1. 回傳值
2. 改變狀態
3. 呼叫依賴

### 單元測試的定義，第二版

> 單元測試會驗證一個「工作單元」或「使用案例」的退出點是否符合預期。結果不符則測試視為失敗。下至單個 function 上至多個 modules ——只要有「進入點」加上「退出點」——就是一個單元。

## 1.5 Different Exit Points, Different Techniques

每一個退出點都值得一個單元測試。不同種類的退出點也有不同的測試方法。

1. 回傳值：最簡單，驗證值是否正確即可
2. 改變狀態：觸發該單元後，想辦法驗證狀態是否如預期改變
3. 呼叫依賴：需要配合假資料（fake）

## 1.6 A Test from Scratch

單元測試是為了**驗證結果是否符合預期**，而使用測試框架的「驗證」與「錯誤捕捉、暴露」功能會讓測試讀起來更簡潔、寫起來更快。

不是非得靠框架才能寫單元測試——但使用框架會讓人生比較輕鬆。

## 1.7 Characteristics of a good unit test

一個好的單元測試不只讓工程師知道該單元具備哪些功能，還會有以下特徵：

1. 不會花太多時間，所以你願意常常執行，並很快收到回饋
2. 不用太多手動前置作業就能跑測試（例：起一個 docker image），這才是真正的自動化
3. 不被執行環境、距離上一次執行的時間影響結果（test results are consistent）——想像你接手一個陌生專案，如果這個專案的單元測試全數運行如常，你會對修改這包專案更有自信
4. 排除依賴（dependency）——即使依賴掛了，也不影響測試結果——所以工程師需要 fake
5. 刪改一個單元測試不會影響其他單元測試
6. 測試失敗時，提供有意義的訊息

總結成三點：

1. 好讀
2. 好維護
3. 值得信賴

不好的單元測試會拖累開發速度，因為工程師會浪費時間試圖理解、維護那些最終要被刪掉的東西。

## 1.8 Integration tests

一旦測試**包含依賴**，那就是整合測試。以下列出的都是依賴：

- 資料庫、api
- 其他團隊開發的套件
- 亂數——對，`new Date()` 這種就算

整合測試的問題是一次測試太多東西。當測試失敗時，無法馬上確認到底是哪裡出事。

## 1.9 Finalizing our definition

### 單元測試的定義，最終版

單元測試是一段自動化的程式碼，通常會透過框架撰寫。一個單元測試每次只驗證一個退出點。單元測試應該要值得信賴、容易維護、好讀、執行速度快。只要程式碼沒有變，單元測試的結果就要維持一致。

## 1.10 Test-driven development

> TDD 核心概念：在實作功能前，先為該功能寫測試

- 傳統開發流程：開發 > 如果有時間就寫測試 🌚 > 如果有時間就執行測試 🌚 > 如果有時間就修測試遇到的 bug 🌚
- TDD 流程：寫測試 > 開發讓測試通過的功能 > 重構 > 寫下一個測試

TDD 帶來的好處：

1. 減少 bug 數量
2. 縮短發現 bug 的時間
3. 增加對程式碼品質的信心
4. 增加對測試品質的信心：我們先寫測試，看著測試失敗，再看到開發完的功能讓測試變綠燈——我們確定測試在該失敗時失敗、該成功時成功

傳統的「先開發再測試」讓工程師順著單元的輪廓寫測試，無法保證測試是否只會在該失敗時失敗——工程師可能還會納悶「測試怎麼會失敗？」

> The main benefit of TDD is **verifying the correctness of your tests**. Seeing your tests fail before writing production code ensures that these same tests would fail if the functionality they cover stops working properly.

### 1.10.1 TDD is not a substitute for good unit tests

TDD 的技術特徵如下：

1. 先寫測試
2. 開發能讓測試通過的功能
3. 因為有了能驗證功能的測試，所以我們可以放心重構

但要注意：導入 TDD 不等於單元測試有寫好。

### 1.10.2 Three core skills needed for successful TDD

TDD 的成功三要素：

1. 知道如何寫好單元測試
2. 先寫測試（test-first）
3. 導入 clean code 等設計概念，使專案容易維護

## 參考文件

- [Manning: The Art of Unit Testing, Third Edition](https://www.manning.com/books/the-art-of-unit-testing-third-edition)
