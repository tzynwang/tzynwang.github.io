---
title: 閱讀筆記：The Programmer's Brain Chapter 6 Getting better at solving programming problems
date: 2023-07-26 19:05:19
categories:
  - [General]
---

## 總結

此篇是 Good Code, Bad Code: Think like a software engineer 一書第六章（Getting better at solving programming problems）的閱讀筆記。此章旨在論述模型（model）的重要性。模型會影響一個工程師如何思考、解決問題；契合問題的模型能降低解題的困難度，反之則會讓問題變得更加複雜。



## 筆記

### 何謂模型（model）

> Models are **simplified representations of reality**, and the main goal of a model is **to support you in thinking about a problem** and ultimately **solving it**.

用於代表問題，但省略了非必要的部分；模型（在本書脈絡）的終極目標是幫助思考、並解決問題。

#### 為何需要模型

解決問題時，搭配模型可以帶來以下好處：

- 一個寫在紙本、白板上的模型可以幫助溝通，工程師們可以更快掌握問題的模樣
- 模型可以降低認知負荷（cognitive load），畢竟人腦的短期記憶與工作記憶有其極限，將問題化為模型轉移到紙上、白板上可以讓工程師把腦力專注在「解決問題」上
- 模型可以協助工程師回想過去是否有解決過類似問題的記憶，參考書內原文如下：
  - Models can be a big help in solving problems because they help the LTM **identify relevant memories**.
  - ...mental models stored in the LTM **help you organize data** and can be used when you **encounter new situations similar to ones you have seen before**.

然而工程師也需要注意，如果套用了不合適、不正確的模型來理解一個問題，反而會增加解題的困難度。不同的模型會影響思考的方式與方向。

> the representation (model) you use to solve a problem **influences how you think about the problem**.

### 何謂心智模型（mental model）

> Mental models share an important characteristic with models expressed outside the brain: the model adequately **represents the problem but is simpler and more abstract than reality**.

功能、目標與模型一樣，差別在於心智模型沒有實體。

> ...we have seen that it is not likely that information disappears completely from the LTM. That means there is always a risk that **you will fall back on incorrect or incomplete mental models** you learned previously. Multiple mental models can remain active simultaneously, and the boundaries between the models are not always clear. So, especially in a situation of high cognitive load, you might suddenly use an old model.

需要注意的是人腦不容易「完全忘掉」已經記住的東西，處在認知過載（high cognitive load）狀態時，人類可能會不經意地使用了不正確（舊的）心智模型來理解問題。

#### 如何建立能夠輔助思考的心智模型

（原文：Creating mental models of source code in the working memory）

1. 為程式碼建立心智模型時，先從小處開始；把小範圍的程式碼搞懂後，再根據目前已知的內容來擴增心智模型（涵蓋更多的程式碼）
2. 為程式碼內出現的物件建立關聯（原文：List all relevant objects in the codebase and the relationships between objects.）
3. 對程式碼提問，再根據答案來調整模型
   1. 這段程式碼中最重要的變數、物件、邏輯是什麼？這個重點有出現在心智模型中嗎？
   2. 如果重點有複數個，這些重點之間是否有所關聯？
   3. 整段程式碼的主要目的是什麼？這個目的跟心智模型提供的目的一樣嗎？
   4. 第三點總結出來的「目的」跟第一、二點找出來的「重點」是否有所關聯？
   5. 這段程式碼通常會怎麼被使用？心智模型能順利解釋這個使用情境嗎？

### 關於 notional machine

讀了兩遍還是不太明白作者想表達的重點是什麼，先節錄章節摘要以備未來之需：

- Notional machines help us understand programming because they enable us to **apply existing schemata to programming**.
- Different notional machines sometimes nicely complement each other but may also create conflicting mental models.

## 參考文件

- [Manning: The Programmer's Brain](https://www.manning.com/books/the-programmers-brain)
- [Notional Machines](https://notionalmachines.github.io/notional-machines.html)
