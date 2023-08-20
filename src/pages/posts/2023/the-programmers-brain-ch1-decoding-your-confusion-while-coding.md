---
layout: '@Components/pages/SinglePostLayout.astro'
title: 閱讀筆記：The Programmer's Brain Chapter 1 Decoding your confusion while coding
date: 2023-06-24 10:28:26
tag:
  - [General]
---

## 總結

此篇是 The Programmer's Brain 一書第一章的閱讀筆記。此章旨在介紹：

1. 閱讀程式碼時，可能產生的困惑感種類
2. 不同種類困惑感背後代表的意義
3. 閱讀程式碼時，大腦中發生的認知活動

## 筆記

### 三種困惑感

在閱讀程式碼時感受到的「困惑」其實有三種類型：

1. 因缺乏領域知識（domain knowledge）引起的困惑；比如不知道 `this` 在 JavaScript 中代表的意義
2. 因短期記憶（short-term memory）超載、或資訊不足導致的困惑；比如查看一個 React 元件，卻發現該元件包含十幾個變數、十幾個功能、數個 hooks 且引用了多個子元件，這會大大增加理解該元件功能的困難度
3. 因大腦的運算能力（process power）不足，導致理解困難；比如閱讀一個超過 80 行、包含 3 組迴圈的功能，如果沒有在閱讀途中做筆記標明每一組迴圈處理的對象，可能讀到一半就會迷失方向、不曉得各個迴圈究竟是在處理什麼內容

### 不同種困惑感背後的意義

上方提到的三種困惑類型又可對應到以下三種認知過程（cognitive process）：

1. 缺乏領域知識（domain knowledge）代表大腦中沒有可供參考的長期記憶（long-term memory）
2. 因人類的短期記憶容量有限，故在理解一段程式碼時「一口氣面對過多的變數或是套件」就會出現理解困難
3. 在腦中運行一段程式碼時，運用的是工作記憶（working memory）；如果在追蹤（tracing）一段程式碼時感到棘手，通常就代表大腦的運算能力已經告罄了

### 閱讀時的認知活動

閱讀程式碼時，通常會是上述三種認知過程在腦中交互發生，不會只有單一種認知活動。

以「閱讀一張回報 bug 的文件」為例，工程師腦中的認知活動如下：

1. 在讀完這分回報 bug 的文件後，將文件內容保存在短期記憶中
2. 在長期記憶中搜尋「之前寫過程式碼內容」、「對於該程式碼的理解」以及（或許有）「解決過類似問題的經驗」
3. 綜合以上的記憶內容，透過工作記憶運算出可行的解決方案

![cognitive process when reading code](/2023/the-programmers-brain-ch1-decoding-your-confusion-while-coding/reading-code-cognitive-process.png)

> **All three cognitive processes are at work** while you’re reading code, and the processes complement each other. For example, if your STM encounters a variable name like `n`, your brain searches your LTM for related programs you’ve read in the past. And when you read an ambiguous word, your working memory is activated and your brain will try to decide the right meaning in this context.

## 參考文件

- [Manning: The Programmer's Brain](https://www.manning.com/books/the-programmers-brain)
