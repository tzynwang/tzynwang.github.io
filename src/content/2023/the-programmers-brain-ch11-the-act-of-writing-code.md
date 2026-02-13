---
title: 閱讀筆記：The Programmer's Brain Chapter 11 The act of writing code
date: 2023-10-26 19:32:17
tag:
  - [General]
banner: /2023/the-programmers-brain-ch11-the-act-of-writing-code/k8-rJ236eQHXGA-unsplash.jpg
summary: 即使都稱為「開發（programming）」，也有可能消耗不同種類的心智活動。另外，工作到一半被打斷、打擾，是真的會降低生產力的。
draft:
---

## 總結

第十一章討論了兩個主題：

1. 各種開發行為背後的心智活動
2. ~~被斷法~~對開發的影響；以及有哪些技巧可以幫助工程師盡快回到被中斷前的狀態

## 筆記

### 開發行為背後的心智活動

![programming activities and the related memory systems](/2023/the-programmers-brain-ch11-the-act-of-writing-code/figure_11-1.png)

當工程師在執行開發任務時，各類任務倚賴的心智活動類型有所不同，書中說明如下。

搜尋（searching）：倚賴短期記憶的活動，因為工程師在「搜尋」程式碼時，需要記得「到底在找什麼？」「已經看過哪些內容？」「還有哪裡需要查看？」。為了降低對短期記憶的負擔，可以將「在找什麼」「找過哪裡」「還要找哪裡」這些事情寫下來（而不是靠短期記憶硬扛）。

理解（comprehension）：倚賴工作記憶的活動。當工程師需要「理解」程式碼時，代表他並不熟悉程式碼的功能與行為（可能是因為程式碼是其他人、或是很久以前的自己寫的）。這時候，可以試著將「自己對於這些程式碼的心智模型與相關理解」寫下來，除了能減緩心智負荷外，也能在持續理解程式碼的過程中，反覆確認自己目前的認知（心智模型）是否有誤、需要修正。

轉錄（transcription）：倚賴長期記憶的活動。「轉錄」代表工程師將腦中解決問題的步驟轉化為程式碼。如果工程師已經非常熟稔目前用於開發的程式語言，這個工作就不會產生太多心智負荷。

增量（incrementation）：綜合了搜尋、理解與轉錄三種行為，畢竟工程師在為既有的程式碼追加新功能時，多少需要閱讀既有內容、回想當時的設計、尋找合適的插入點，最後才是將新功能安裝上去。本書建議，如果任務讓開發者感到吃力，則可先將主任務拆分為不同步驟，再依序攻克，避免心智負荷過重的問題。

探索（exploration）：與增量不同的部分是「探索」時的工程師還沒有非常明確的目標與解決藍圖，他還在東查西看的階段。而隨著探索的內容增加，工程師會根據看到的內容制定計劃（或是終於對問題發生的理由有一個方向）。如果想要降低探索時的心智消耗，書中建議可以將探索計畫寫出來，讓大腦較能有餘裕針對計畫內容作深入思考。

### 關於被打擾

> Interruptions while you are programming are not only annoying; they are **detrimental to productivity** because it **takes time to rebuild your mental model of the cod**e.

被中斷時，工作記憶中的內容會消失。而工程師需要額外花費力氣來把（被打斷前的）工作情境重建回來。被打擾確實會降低生產力。

> From Parnin’s results, we can see that the **working memory lost vital information** about the code programmers were working on. Programmers in his study needed to put in deliberate effort to **rebuild the context**. They would often navigate to several locations to rebuild context before continuing the programming work.

本章提出以下建議來降低「被打斷」造成的影響：

1. 保存心智模型（Store your mental model）：在閱讀程式碼的途中，可以將自己理解到的內容註解在相關段落、或是整理到筆記中。在被中斷時，工程師可將當下的作業內容做個註解，讓自己在被中斷後，能夠較快重建對程式碼的理解
2. 記下之後要做的事情（Help your prospective memory）：透過 TODO 註解、設定行事曆或便條貼來提醒自己要完成的事情
3. 將任務大部分解（Label subgoals）：將任務拆解，並將步驟註解下來。每次被打斷時失去、要重建心智模型的範圍也會縮小，故此方式確實可以降低被打斷時的損失

總結：重點是盡量被打斷當下的情境資訊。且盡可能將任務分拆，避免需要一口氣回想（重建）太大量的內容。

## 參考文件

- [Manning: The Programmer's Brain](https://www.manning.com/books/the-programmers-brain)
