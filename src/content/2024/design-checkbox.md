---
title: 閱讀筆記：核取方塊的設計準則
date: 2024-07-16 19:32:56
tag:
	- [Product Design]
banner: /2024/design-checkbox/glenn-carstens-peters-RLw-UC03Gwc-unsplash.jpg
summary: 在閱讀 NNG 的設計準則以前，我確實沒有注意到「清單」與「巢狀」核取方塊最大的差別是什麼⋯⋯👀
draft: 
---

提醒：原文 [NNG | Checkboxes: Design Guidelines](https://www.nngroup.com/articles/checkboxes-design-guidelines/) 其實不會太長，寫得也算平易近人，有空的讀者真的可以親自讀一下。

## 關於核取方塊

### 類型

#### 獨立核取方塊（standalone checkbox）

只會有兩種狀態（有勾、沒勾）。

這類核取方塊和其他元件**沒有依賴關係**。目的是博取使用者的注意力。

> There are no other checkboxes around it, and it is frequently cordoned off in its own visually distinctive container. The checkbox and its label, in this case, **demand attention and consideration on their own**.

應用範例：使用者必須「同意條款內容」才能完成註冊流程。

雖然視覺上是「勾了之後才能按下註冊按鈕」，但「核取方塊」和「按鈕」**不是彼此出現在畫面上的必要條件**。核取方塊的目的是**改變使用者同意條款的狀態**，而註冊服務的按鈕**根據使用者同意條款的狀態**來改變自身狀態。

不是畫面出現「核取方塊」就必定出現「按鈕」，反之亦然。

#### 清單核取方塊（listed checkbox）

只會有兩種狀態（有勾、沒勾）。

清單中的每一個選項**彼此獨立**，不會因為勾了選項Ａ就影響選項Ｂ的狀態。

應用範例：讓使用者操作一個**可能需要多選、但不太可能全選**的清單——比如在地圖上過濾「想要查詢的設施（餐廳、飯店、車站）」。

#### 巢狀核取方塊（nested checkbox）

親代的核取方塊會有三種狀態（全勾、部分勾、無勾），子代只有兩種狀態（有勾、沒勾）。

親代與子代會**影響彼此的狀態**，比如：

- 使用者勾選親代時，子代也要全數進入勾選狀態
- 使用者勾選子代時，其親代應進入「部分勾」或「全勾」狀態

應用範例：讓使用者操作**很可能需要全選**的清單——比如讓使用者確認他「目前擁有的蘋果產品有哪些」。

### 視覺設計之建議

- 核取方塊就該**做成方形**，因為圓形會看起來像是單選按鈕（radio button）
- 搭配的標籤（label）應使用正面描述
- 使用合理的邏輯**排列清單選項**（筆畫順、規模、頻率 ⋯⋯）
- 根據選項彼此之間的關聯來決定是否提供「全選」選項
- 允許多選時，明確提示**可選擇的數量**

### 懶人包

下圖是 [NNG](https://www.nngroup.com/articles/checkboxes-design-guidelines/) 出品的「選項元件應用情境速查表」。你可以根據「選項數量」以及「選項之間的關係」來判斷哪種元件最符合需求。

![use case for checkbox, radio button, dropdown and switch](/2024/design-checkbox/use-case.png)

## 參考文件

[NNG | Checkboxes: Design Guidelines](https://www.nngroup.com/articles/checkboxes-design-guidelines/)
