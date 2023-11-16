---
layout: '@Components/pages/SinglePostLayout.astro'
title: 閱讀筆記：The Programmer's Brain Chapter 5 Reaching a deeper understanding of code
date: 2023-07-19 19:57:19
tag:
  - [General]
---

## 總結

此篇文章是 Good Code, Bad Code: Think like a software engineer 第五章（Reaching a deeper understanding of code）的閱讀筆記。此章主要圍繞在「加深理解程式碼」這個主題上，實際應用技巧則包含：理解變數的角色與命名方式、將閱讀一般文字的技巧套用於閱讀程式碼上。

## 筆記

### 變數的角色

> Understanding **what types of information** variables hold is key to being able to **reason about** and **make changes to code**.

本書作者認為：辨認一個變數在程式碼中扮演的角色，可以加深閱讀者對於該段程式碼的理解。或者，讀者可以根據各類變數的出現頻率，來推理現在閱讀中的程式碼想完成的任務。

> ...often **a group of roles together characterizes a certain type of program**. For example, a program with a stepper and a most wanted holder value is a search program.

而根據學者 Jorma Sajaniemi 的理論，變數可分類為以下 11 種角色：

1. fixed value：如其名，此類變數保管的值不會在程式碼的執行途中被改變
2. stepper：出現於迴圈中，比如 JavaScript loop 中 `for (let i = 0; i < 10; i++)` 中的 `i`
3. flag：常見於條件判斷中，通常是布林值
4. walker：與 stepper 差距在於 stepper 是用於「已知」的物件結構（如陣列），而 walker 則是對應那些還未全盤了解其結構（比如 tree）的步驟點
   - A walker traverses a data structure, similar to a stepper. The difference lies in the way the data structure is traversed. A stepper always iterates over a list of values that are known beforehand, like in a for-loop. A walker, on the other hand, is a variable that **traverses a data structure in a way that is unknown before the loop starts**. Examples of a walker are a variable that is traversing a linked list to find the position where a new element should be added or a search index in a binary tree.
5. most recent holder：保管一連串計算後，最後一次得到的值（比如記錄一個檔案最後被讀取到哪一行）
6. most wanted holder：保管一連串計算後，最想要被獲得的值（比如取出一個數字陣列中最大的值）
7. gatherer：保管疊加出來的值，類似 JavaScript `Array.reduce()` 執行完畢後得到的那一個變數
8. container：負責保管值的變數，比如陣列、物件等等
9. follower：比如 linked list 中指向「前一個」節點的變數
10. organizer：常見於「轉換資料結構」時，用於保存暫時的值的變數，但這個變數至少還有一些目的性（轉換結構途中的容器）
11. temporary：純粹用來暫時保存某些值的變數

![types of variables](/2023/the-programmers-brain-ch5-reaching-a-deeper-understanding-of-code/figure_5-1.png)

### 將角色納入變數命名

匈牙利命名法（Hungarian notation）事實上有兩種類別：

1. 系統匈牙利命名法（systems Hungarian notation）：將型別納入變數命名中，比如 `numList` 即代表一個保存了 `number` 型態資料的陣列
2. 匈牙利應用命名法（apps Hungarian notation）：將變數的目的納入命名中，比如 `usName` 代表此變數處在 `unsafe` 狀態，需要經過處理才能使用

鑑於現行的開發環境多半能直接查看變數的型別，應用命名法是比較有意義的命名規範。

### 閱讀技巧

書中提到，人類在閱讀一般文字時會運用到的技巧也能應用在閱讀程式碼上。這些技巧包含：

1. 先大略掃過一整段程式碼，確認是否有熟悉或完全不理解的概念
2. 標註程式碼中引起困惑的部分，並確認這些引起困惑的內容是否有過去沒接觸過的概念；如果有，或許要先針對這些不熟的部分做一些準備
3. 標記該段程式碼中可能是重點的部位（可能是一些邏輯判斷、或是演算法）
4. 從變數名稱來搜尋腦中是否有與之相符的長期記憶內容
5. 總結該段程式碼的功能

## 參考文件

- [Manning: The Programmer's Brain](https://www.manning.com/books/the-programmers-brain)
- [Roles of variables in experts’ programming knowledge](https://www.researchgate.net/publication/277285502_Roles_of_variables_in_experts'_programming_knowledge)
- [匈牙利命名法](https://zh.wikipedia.org/zh-tw/%E5%8C%88%E7%89%99%E5%88%A9%E5%91%BD%E5%90%8D%E6%B3%95)
