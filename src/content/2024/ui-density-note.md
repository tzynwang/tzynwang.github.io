---
title: 閱讀筆記：UI Density -- What UI density means and how to design for it
date: 2024-05-26 11:39:23
tag:
	- [Product Design]
banner: /2024/ui-density-note/hal-gatewood-tZc3vjPCk-Q-unsplash.jpg
summary: 最近讀到一篇以「密度」來分析「何謂好設計」的文章。除了說到設計會馬上想到的「視覺效果」以外，該文作者也以資訊、時間與價值面向來評價設計結果。即使對設計沒什麼概念，也是一篇讀起來很有趣的文章，原文值得一看。
draft: 
---

## 定義

> UI density is about the **amount of information** an interface can provide over a series of moments. It’s about how those moments are connected through design design decisions, and how those decisions are connected to **the value the software provides**.

UI 的密度是由其提供的資訊量、採納的設計原理數量，以及該產品能為使用者提供的價值而定。

### 視覺密度

不只是根據畫面上的物件數量決定，物件的排列方式也會影響視覺密度。比如以下兩張圖都包含 500 個圓點，但兩張圖在視覺上帶來的緊密感並不相同。

![500-dots](/2024/ui-density-note/500-dots.png)

### 資訊密度

出自 [The Visual Display of Quantitative Information](https://www.amazon.com/Visual-Display-Quantitative-Information-2nd-ebook/dp/B0BG68W2CZ) 一書。資訊密度是根據「一定量的墨水能傳遞多少資訊」而定，如果能用越少的墨水傳遞越多資訊，則資訊密度就越高。

### 設計密度

概念出自「強調整體而非單一部位」的完形心理學（gestalt psychology）。從這個心理學流派衍伸出來的設計理論如下：

- 鄰近（proximity）：我們傾向將彼此靠近的物體視為一個群體
- 相似（similarity）：我們將擁有相似形狀、顏色、尺寸、材質的物體視為一個群體。反之，需要凸顯特定物體時，就要讓該物體的外觀與其他物體有所差異
- 閉合（closure）：我們的視覺會自動補完不存在的線條
- 對稱（symmetry）：我們傾向將對稱的物體視為一個群體
- Common fate：當物體移動時，我們將動線相同的物體視為一個群體
- Continuity：視覺偏好溫順、自然的線條
- Figure-ground relationship：我們能看出二維畫像的前後景
- 過去經驗（Past experience）：我們會根據過去的經驗來推理從未接觸過的內容

而本文作者認為設計的密度可定義為：「實際發揮作用的完形理論」除以「使用到的完形理論」。有實際作用的理論越多，設計密度就越高。

> ...a gestalt ratio which compares the strictly necessary design decisions to the total decisions used in a design. This is design density.

### 時間密度

資訊出現的速度越快，其時間密度越高。但在現實生活中，不可能做到將資訊毫無延遲地送到使用者手上。而 UI 能提供的協助，就是透過動畫或流程來管理使用者的期待。

- 人類不太會意識到 100 毫秒以下的等待時間——如果你點了一個按鈕，接著選單在 100 毫秒內出現，你的感覺會是「選單立刻出現了」——這時，出現動畫反而會打斷這個「連貫」感，使用者會意識到「動畫結束後，選單才出現」。「等待」的感覺反而變明顯了
- 等待時間為 100 毫秒至 1 秒：簡單的 transition 效果能讓使用者知道軟體有在運作
- 等待時間為 1 秒到 10 秒：loading 動畫能讓使用者知道軟體背後有事情正在發生
- 等待時間為 10 秒到 1 分鐘：進度條動畫能降低使用者等待的體感時間
- 等待時間超過 1 分鐘：不如提示使用者可以先離開，並在工作完成後通知使用者回來

### 價值密度

設計想要達成的目標（價值）是什麼？價值密度越高，代表設計越能幫助使用者達成目標。

文中以「填寫表單」為例。通常只有被完整填寫的表單才具有價值，那麼 UI 應該盡可能讓使用者能做完「填寫表單」一事——即使這代表我們可能需要降低設計中的時間、資訊密度等等（比如把表單拆為多個步驟完成，而不是在一個畫面中列出全部需要填寫的欄位）。

## 參考文章

- [UI Density](https://matthewstrom.com/writing/ui-density/)
- [格式塔學派](https://zh.wikipedia.org/zh-tw/%E6%A0%BC%E5%BC%8F%E5%A1%94%E5%AD%A6%E6%B4%BE)
