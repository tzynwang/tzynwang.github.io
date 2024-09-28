---
title: 筆記：Usability Review Live
date: 2024-09-28 09:37:52
tag:
	- [Product Design]
banner: /2024/usability-review-live-note/med-badr-chemmaoui-ZSPBhokqDMc-unsplash.jpg
summary: 整理了之前追 Tony Alicea Usability Review Live 的筆記。這段一小時的直播以很平易近人的方式說明了一些介面設計的基本知識，值得一看。
draft: 
---

## 重點

- 在設計產品介面時，要考慮使用者會**如何理解這個產品**（視覺上的、思考上的），並提供適當的提示
- 介面中的資訊過少、過多時，都要提示使用者接下來可以怎麼辦

## 筆記

### 產品介面對使用者的影響

當使用者看到產品介面時，使用者會**透過「視覺」將介面分區**（例：把整個畫面看成「導覽列、操作清單、主要資訊區塊」），並且**用自己的語言思考「我現在想做什麼」**。產品應該以「使用者的語言」來描述功能，盡量不要發明新詞。如果真的找不到合適的詞彙來描述，請務必解釋該詞彙的意圖。

---

與周遭不同的顏色會吸引使用者的注意力。決定元件的顏色時，要考慮**該元件是否需要吸引使用者的注意力**。如果一個功能不重要，就不要讓它吸引使用者的注意力。

---

焦慮會有雪球效應。當使用者在起步階段感覺「這個產品好難用」時，使用者容易放棄使用產品。

### 提示

使用常見的圖示能有效提示使用者「他現在可以做什麼」。比如 ★ 或 ♥ 圖示常用於「加入我的最愛」功能，在介面上提供這樣的圖示，就能提示使用者「這個產品有『把某個東西加入最愛』的功能唷」。

---

當介面的狀態改變時（比如進入「編輯模式（edit mode）」），介面應該要有非常明顯的提示來告訴使用者「狀態改變了」。

#### 過多資訊

過多資訊會分散使用者的注意力。介面中的資訊密度越高，就越需要 signifier 來告訴使用者「現在可以做什麼」、「還有哪些地方可以探索」。

什麼是 signifier（能指、意符）：在查詢後，我將其理解為「提示」。它會**提示使用者接下來可以做什麼事、該產品可以提供什麼功能**。以一扇門的設計為例——當門沒有把手時，我會推測「應該推而不是拉開門」；但門上如果釘了把手，我就會推測「這扇門可以拉」。門的設計會提示使用者要如何與門互動。

---

直播中的範例產品將刪除按鈕藏在橫向捲動的選單中，但選單本身的捲軸又只會在滑鼠經過時浮現，所以使用者無法馬上找到刪除按鈕。

#### 過少資訊

如果產品處在空白、無資料（empty state）的狀態，則介面應該要提示使用者執行一些操作（action）。

舉例：當使用者沒有將任何東西加入「我的最愛」時，該介面應該提示使用者「可將東西加入最愛」，而不是單純展示一個「什麼都沒有的『我的最愛』介面」。

### 太多自由不一定是好事

如果給予使用者**太多自訂介面樣式的自由，可能會影響產品的易用性**。

直播中的範例產品讓使用者可以自訂主視覺色（primary color），但在使用者從淺色主題（light theme）切換到深色主題（dark theme）後，自訂主視覺色的按鈕在深色主題下變得很不明顯。

### 其他產品設計注意事項

不要只因為「感覺我們需要」就對產品加上某個功能。應該是先決定產品**要解決什麼問題**，接著再推出某個功能來解決該問題。~~我知道，但這無法由我決定。~~

---

原生介面比客製化介面好，原生介面能減少技術債與無障礙問題（accessibility issue）。

| 原生介面                        | 客製化介面                      |
| ------------------------------- | ------------------------------- |
| ![native control example](/2024/usability-review-live-note/native-control-example.png) | ![custom control example](/2024/usability-review-live-note/custom-control-example.png) |

## 參考資料

- [Youtube: Usability Review Live](https://www.youtube.com/live/ycTjaIgIh1Y?si=OI61XVnFFrmCgNu1)
- [Interaction Design Foundation: Signifiers](https://www.interaction-design.org/literature/topics/signifiers)
- [GeeksAnts: Signifiers in UI Design](https://geekyants.com/blog/signifiers-in-design)
