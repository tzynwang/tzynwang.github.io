---
title: 閱讀筆記：The Programmer's Brain Chapter 10 Getting better at solving complex problems
date: 2023-10-21 10:42:54
tag:
  - [General]
banner: /2023/the-programmers-brain-ch10-getting-better-at-solving-comples-problems/rob-schreckhise-8zdEgWg5JAA-unsplash.jpg
summary: 你知道嗎？參考別人的解題方式能幫助你在未來解決更多問題喔 (́=◞౪◟=‵)
draft:
---

## 總結

第十章先定義了「何謂解決問題」，並提出以下兩點「提升解題能力」的方式：

1. 增加相關的內隱記憶（implicit memory）
2. 學習他人解決問題的方法

## 筆記

### 何謂解決問題

本書認為「解決問題」可以拆解三個步驟：

1. 定義起點（start state）
2. 定義終點（goal state）
3. 在限制條件（rules）內，以最短的路徑（state space）從起點抵達終點

以前端開發來舉例，一個解決問題的流程可能是：

1. 為既有的線上服務（起點）新增一種付費方式（終點）
2. 使用 TypeScript 開發、並且既有的所有單元測試都要維持綠燈（限制條件）
3. 避免不必要的重造輪子（最短路徑）

### 解題時的心智活動

解決問題時，我們會根據該問題的特徵，從**長期記憶**中搜索對應的內容（以便解決眼下的問題）。問題的特徵越明顯，回想的難度就會比較低。大腦比較擅長處理它曾經解決過的問題。

> ...while thinking about a problem, the brain **retrieves information from the LTM**, which could be relevant to the problem at hand. ... It is easier for your brain to **solve familiar problems**.

### 記憶的類型

記憶有內隱記憶（implicit memory）與外顯記憶（explicit memory）兩大類。而外顯記憶又能分成情景記憶（ episodic memory）和語意記憶（semantic memory）

![types of memories](/2023/the-programmers-brain-ch10-getting-better-at-solving-comples-problems/CH10_F02_Hermans2.png)

內隱記憶比如打領帶、綁鞋帶，以程式開發來說，能進行「鍵盤盲打」就是一種內隱記憶。

情景記憶則是「我記得某年夏天去了某處玩」這類記憶。以程式開發來說，就是你記得「你曾經解過類似的問題」。本書就提出「專家通常是將舊問題的解決方式改編為新問題的解方」，而不是一味的從零開始解題：

> In a sense, experts **recreate, rather than solve**, familiar problems. That means that instead of finding a new solution, they **rely on solutions that have previously worked** for similar problems.

作者也提到「除錯時的靈光一閃」乍看是一種直覺，但可能只是你想起來過去處理過類似的問題，並且當時問題是發生在什麼地方：

> Sometimes what we call intuition, in fact, happens when you solve a problem similar to one you have solved before; you just know what to do without really knowing how to do it.

語意記憶（以程式開發來說）是關於迴圈語法的記憶、或是知道如何宣告變數等。可以靠背誦來強化的，都算是這類記憶。

### 提升解題能力的方式

第一種方式：增加相關的內隱記憶（肌肉記憶）。

人可以在散步的同時聊天，或是邊看電視邊打毛線。能做到前面這些事情，是因為「散步」與「打毛線」已經成為內隱記憶，不需要消耗太多認知負荷（cognitive load）就能執行。~~開車時滑手機之所以危險，是因為開車不只依靠肌肉記憶。~~

> The interesting thing about implicit memories is that when you **have trained implicit memories well enough**, it takes your brain **hardly any energy to use them**.

以程式開發來說，如果你能毫不費力地理解 JavaScript 陣列的語法糖（map/sort/reduce）在做什麼、或是正規表達式要比對的字串內容，這就代表你的大腦比「不能直接理解的人」有更多的餘裕可以專注在「解決問題」上。

故本書認為「增加內隱記憶」是一種能夠提升解題能力的方式。

> ...cognitive load indicates how busy or full your brain is. When you experience **too much cognitive load, thinking can become really hard**. The more implicit memories you have for programming, the easier it will be to solve larger problems because **you will have more cognitive load to spare**.

訓練內隱記憶主要靠「重複」。舉例：如果你對 JavaScript 的 `Array.reduce()` 還不熟悉，書中建議可以透過練習各種 `.reduce()` 組合來強化相關記憶。比如 `.reduce()` 不同種類的陣列、或是要將同一個陣列透過 `.reduce()` 輸出成各式內容。

---

第二種方式：學習他人解決問題的方法

本書第四章曾提過「認知負荷有三種類型」（可參考[此篇筆記](/2023/the-programmers-brain-ch4-how-to-read-complex-code)）。而「學習解決問題的方式」就是為了減低一個問題帶來的密切認知負荷（germane load）。

當我們在沒有其他幫助下試圖解決一個非常困難的問題時，我們會耗費所有的能量在「解決問題」上。但因為解決這個問題的認知負荷實在太大，所以我們根本沒有餘裕「記住我們今天究竟如何解決問題」。

> When all the cognitive load you have room for is filled with intrinsic and extraneous load, **there is no room left for germane load**; in other words, **you cannot remember the problems you have solved and their solutions**.

而此章上半部也提過，人類在解決問題時，需要依賴長期記憶中的線索來幫解眼下的問題。如果解決了一個問題卻記不住它，今天的解決就無法成為未來的助力。

但若在你試圖解決一個問題時，你能參考其他人的解法（有一個樣本可以看著改），這就能讓大腦有餘裕可以「記住今天你是如何解決某個問題」。日後再遇到類似的狀況，你就能透過回想來解決新遇到的問題。

參考別人的解法並不可恥，且能夠幫助自己未來解決更多問題 =͟͟͞͞( •̀д•́)！

## 參考文件

- [Manning: The Programmer's Brain](https://www.manning.com/books/the-programmers-brain)
