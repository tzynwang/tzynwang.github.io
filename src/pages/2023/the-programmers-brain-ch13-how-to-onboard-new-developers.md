---
layout: '@Components/pages/SinglePostLayout.astro'
title: 閱讀筆記：The Programmer's Brain Chapter 13 How to onboard new developers
date: 2023-11-16 18:34:49
tag:
	- [General]
banner: /2023/the-programmers-brain-ch13-how-to-onboard-new-developers/vlad-tchompalov-wt5Y8VY_0bA-unsplash.jpg
summary: 新人上線時不要一口氣給予太多資訊，避免認知負荷過高，讓新人無法正常表現。
draft: 
---

## 總結

本章特別強調在新人上線時不要一口氣給予太多資訊，避免認知負荷過高，讓新人無法正常表現。也提供一些實務建議，讓老鳥、新人兩方在上線時都能有更好的體驗。

## 各章節筆記

### Issues in the onboarding process

> 一口氣讓新人接收太多知識，會讓對方的認知負荷（cognitive load）太高，導致難以思考或是記憶

在上線第一天就帶新人認識環境、介紹公司、介紹未來要負責的專案，甚至第一天就讓人「解一些簡單的小問題」——這些會讓新人的認知負荷爆表，無法發揮平常的思考水準。老鳥也可能因此誤判新人的實力（「加個小功能應該很簡單，怎麼做這麼久？」）。

### Differences between experts and novices

> 老鳥與新人對專案的理解程度完全不同。

老鳥熟悉專案架構與其中的商業邏輯。老鳥腦中的長期記憶能提供許多經驗幫助除錯、或是讓開發流程更順暢。老鳥通常也不需要一行一行去讀程式碼，更多是一瞥就能大概知道那段功能的目的（比如重置狀態）。但對新人來說，他需要一行一行讀完才知道整個功能在做什麼。兩方承受的認知負荷完全不同。

#### Neo-Piagetian stages for programming

皮亞傑的[認知發展論](https://zh.wikipedia.org/zh-tw/%E8%AA%8D%E7%9F%A5%E7%99%BC%E5%B1%95%E8%AB%96)描述兒童在不同年齡階段的思考能力。而借鑑皮亞傑的理論，我們能根據工程師對一個領域（domain）的理解程度，分類為以下四種等級：

1. 感覺動作階段（sensorimotor stage）：對程式碼毫無概念，無法預測程式碼的執行結果
2. 前運思階段（preoperational stage）：能「推測」程式碼的執行結果，但不一定能解釋「為什麼我這樣猜」。如果新人還不熟悉開發用的程式語言，那麼加強新人對程式語言的理解（語法、語法糖、接口等等）能幫助對方進入狀況
3. 具體運思階段（concrete operational stage）：能根據程式碼「合理地預測」執行結果。進入此階段的開發者不再依賴手動輸出來檢驗自己的假設是否正確，他們讀完程式碼就知道結果是什麼。不過有時還是會無法覺察自己的思考方向是否有誤
4. 形式運思階段（formal operational stage）：已經熟稔特定語言的老練工程師，多半能自行理解一包專案，缺乏的大概只是商業邏輯相關的知識

![4 neo-Piagetian levels for programming](/2023/the-programmers-brain-ch13-how-to-onboard-new-developers/figure_13-1.png)

注意：就算是同一位工程師，在接觸不熟悉的領域就有可能退行到上一階段。比如一位資深前端工程師在學習後端 api 開發、資料庫操作等主題時，因為沒有太多相關知識，他的程度可能會退化到「感覺動作期」。

#### Difference between seeing concepts concretely and abstractly

> 如何製造良好的學習體驗：先總結，再提供實際範例，最後回到抽象概念上

![the semantic wave](/2023/the-programmers-brain-ch13-how-to-onboard-new-developers/CH13_F02_Hermans2.png)

只有提供理論或是實例都不夠。在學習新東西時，比較好的做法是：

1. 先了解功能：為什麼要用？通常用在哪裡？已經熟悉這個工具的人會如何總結（summarize）它？
2. 接觸範例（上圖的 unpacking 流程）：透過實作理解語法以及應用場景，知識進入實作層面
3. 總結為抽象概念（上圖的 repacking 流程）：使用自己的語言進行總結，知識回到抽象層面

### Activities for a better onboarding process

> 大原則：管制新人的認知負荷，並鼓勵使用具體的語言來描述自己的認知狀態

具體的語言：介紹認知負荷、長期記憶、短期記憶、工作記憶、分塊（chunking）等概念，讓新人在有困難時，能夠具體描述他在哪方面需要幫助（例：我一次接收到太多新資訊，需要緩緩）。

#### Limit tasks to one programming activity

要新人「幫專案新增一個小功能」其實包含了搜尋、理解、轉錄、增量，總計**四種**心智活動（參考[第 11 章](/2023/the-programmers-brain-ch11-the-act-of-writing-code#開發行為背後的心智活動)的筆記）。理想上是讓讓新人一次做一件事情就好。建議讓新人先看專案，看懂後再讓他搜尋適合新增功能的位置，最後才是動手寫。

#### Support the memory of the onboardee

- 準備商業邏輯的參考資料
- 準備程式碼方面的介紹資料，比如使用的技術、第三方套件以及部署流程等等
- 比起實作，讓新人針對一個功能或是模組寫下「功能總結（summary）」更能幫助新人知道專案在做什麼
- 適度使用流程圖來幫助理解

#### Read code together

- 在一起閱讀專案程式碼前，先介紹該專案的商業邏輯、或是跟程式碼無關，但有助於理解專案的資訊
- 新人可能不知道哪一段程式碼是專案的核心，老鳥可適時提點之
- 關注新人的理解狀況，可以請新人描述看看他目前為止理解了什麼東西
- 乘上，如果新人看起來快吐了、或是開始答非所問，就先暫停，休息、整理筆記與腦袋，畢竟硬塞也記不住
- 如果畫圖會比較純看程式碼好懂，就畫圖

## 參考文件

- [Manning: The Programmer's Brain](https://www.manning.com/books/the-programmers-brain)
- [認知發展論](https://zh.wikipedia.org/zh-tw/%E8%AA%8D%E7%9F%A5%E7%99%BC%E5%B1%95%E8%AB%96)
