---
layout: '@Components/pages/SinglePostLayout.astro'
title: 閱讀筆記：The Programmer's Brain Chapter 8 How to get better at naming things
date: 2023-08-03 20:53:52
tag:
  - [General]
summary: 命名很重要，名稱是工程師閱讀一段程式碼時最優先接觸到的內容，會影響工程師如何理解一段程式碼。
banner: /2023/the-programmers-brain-ch8-how-to-get-better-at-naming-things/brett-jordan-POMpXtcVYHo-unsplash.jpg
---

## 總結

此篇是 Good Code, Bad Code: Think like a software engineer 第八章（How to get better at naming things）的閱讀筆記，重點如下：

1. 命名很重要，因為名稱會影響工程師如何理解一段程式碼
2. 命名的技巧：
   1. 整個 code base 盡量使用一致的命名模式
   2. 根據一段程式碼的重點來挑選合適的單字，並將這些單字組合成語意化的名稱

## 筆記

### 為何名稱很重要

名稱是工程師閱讀一段程式碼時最優先接觸到的內容。且（變數）名稱本身也能作為信標（beacon）來提示閱讀者該段程式碼究竟想達成什麼樣的任務。

> ...names serve as an important type of documentation because they are **available right inside the codebase**. Hence the “documentation” read most will be comments in the code and names.

> Variable names are important beacons that help readers make sense of code in addition to comments.

整個 code base 使用連貫的命名可以幫助分塊（chunking）；如果類似的概念在 code base 中換個位置就換個名稱，則讀者需要耗費大量精力來記住這些名字。

> ...using consistent naming practices across a codebase. That is sensible since it is likely to support chunking. If all names were formatted in different ways, you would have to spend effort on every name to find its meaning.

名稱也能作為提示來幫助工程師回想長期記憶（long-term memory）中是否有「有助於理解程式碼的相關內容」。

> Using the **right domain concept** for a variable name or class can help the reader of code **find relevant information in their LTM**.

可參考下圖：變數名稱可以提示讀者相關的「領域知識」、「程式碼概念」（比如用 `tree` 來命名樹狀的資料結構），也有可能是「慣用命名」（比如使用 `i` 來作為迴圈中的 index 變數）。

![variable name as a hint](/2023/the-programmers-brain-ch8-how-to-get-better-at-naming-things/CH08_F02_Hermans2.png)

### 如何命名

1. 整份 code base 使用連貫性的命名規則，一致的名稱有助於分塊（chunking），降低認知負荷
2. 使用有意義的單字；謹慎使用前綴（prefix）、後綴（suffix），因為加上這些綴詞帶來的好處可能低於閱讀時產生的困難度
3. 先列出一段程式碼要完成的任務重點，再根據這些重點挑出合適單字；最後，將這些單字以「書寫成句子時」會出現的順序來合成名稱

## 參考文件

- [Manning: The Programmer's Brain](https://www.manning.com/books/the-programmers-brain)
