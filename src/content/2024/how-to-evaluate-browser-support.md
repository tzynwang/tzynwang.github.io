---
title: 如何評估是否導入嶄新的 CSS 樣式
date: 2024-11-30 10:49:26
tag:
- [CSS]
banner: /2024/how-to-evaluate-browser-support/federico-burgalassi-rhRoDuYLvxI-unsplash.jpg
summary: 此篇是 A Framework for Evaluating Browser Support 一文的閱讀筆記。作者提供了一組「判斷是否要導入某個新 CSS 功能」的 SOP，極致懶人包就是「先確認你的網站受眾分佈」，接著確認「當瀏覽器不支援時會發生什麼事」，最後根據前兩項資訊判斷到底要不要導入新功能。
draft: 
---

## 懶人包

當你考慮是否要導入一個**普及度逐漸上升**（比如列為 [Baseline Widely available](https://developer.mozilla.org/en-US/docs/Glossary/Baseline/Compatibility) 狀態，或是 [Can I use...](https://caniuse.com/) 支援度大於 90% 等等）的 CSS 功能時，可以問自己以下三個問題來幫助判斷**現在是不是導入的好時機**：

- 先了解「你的網站受眾」的瀏覽器版本分佈
- 再確認瀏覽器不支援這個樣式設定時，畫面會長怎樣？
- 最後，評估瀏覽器不支援新樣式時，會對使用者體驗造成什麼影響

## 評估流程

### 了解網站受眾的瀏覽器版本分佈

[Can I use...](https://caniuse.com/) 會告訴你某個功能在全世界的市占率，但「全世界的使用者組成」卻不一定和「你的網站受眾（Target Audience）組成」一樣。

> Because these 1.5 million websites are spread across all sorts of industries in hundreds of different languages, we wind up with a pretty good worldwide sample of internet usage. But **your product’s audience might look very different**!

舉個例子：你的網站高達 9 成 5 的流量來自通勤族，你的客戶基本上只會透過手機使用你的網站。那在評估是否導入新的 CSS 功能時，重點就要放在「這個新功能在手機上的支援度如何」以及「客戶的瀏覽器版本分佈為何？有大於支援此 CSS 功能的最低瀏覽器版本嗎？」

好消息是 [Can I use... analysis Google Analytics](https://caniuse.com/ciu/import) 有個從 GA 報表中整理出「你的網站受眾通常使用哪個版本的瀏覽器」的功能，根據指示匯入 GA 資料後，它就會列出你的實際受眾的瀏覽器資訊。比如以下就是普通文組 2.0 的統計資訊：

![Browser version information of this blog's reader](/2024/how-to-evaluate-browser-support/caniuse.com-ciu-import-normal-reader.jpg)

這代表當我考慮是否在普通文組 2.0 導入一個新的 CSS 功能時，第一個重點就是確認該功能在 Chrome 的最低支援版本是多少 😎

### 確認瀏覽器不支援時的畫面

重點：當瀏覽器不支援一個新的 CSS 樣式時，它會直接使用該樣式的預設值（詳參下方補充 ☕️）。所以要確認**當網站不是套用你指定，而是預設的 CSS 樣式時，畫面會是什麼樣子**？

測試方式（以 `overflow-x: clip` 為例）：

1. 從 MDN 的 Formal definition 區塊查到 [`overflow-x` 的預設值為 `visible`](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-x#formal_definition)
2. 把整包 code 中的 `overflow-x: clip` 替換為 `overflow-x: visible`
3. 確認網站改用預設 CSS 樣式時的畫面

---

☕️ 補充，以下是 CSS 關於設定值的規格原文（[Cascading Style Sheets Level 2 Revision 2 (CSS 2.2) Specification](https://www.w3.org/TR/CSS22/cascade.html#specified-value)）：

User agents must first assign a specified value to each property based on the following mechanisms (in order of precedence):

1. If the cascade results in a value, use it. Except that, if the value is 'inherit', the specified value is defined in “The 'inherit' value” below.
2. Otherwise, if the property is inherited and the element is not the root of the document tree, use the computed value of the parent element.
3. Otherwise **use the property's initial value**. The initial value of each property is indicated in the property's definition.

當我們指定了瀏覽器不支援的樣式時，就會進入規格中的第三點，即瀏覽器**會使用該樣式的 initial value 來繪製畫面**。比如當瀏覽器認不得 `overflow-x: clip` 時，它就會改用 `overflow-x: visible`，因為 `visible` 是 `overflow-x` 的預設值。

### 評估不支援時的使用者體驗

承上一點，當使用者使用不支援該樣式的瀏覽器操作你的網站時，他的體驗會是：

- 在一些無關緊要的地方看起來有點怪，但不影響可用性？
- 在一些重要的部位（比如 landing page）看起來有點怪，影響網站的專業感？（這導致使用者可能拒絕繼續使用）
- 因為畫面不如預期，導致中斷某些重要操作？（比如 CTA 按鈕出現在意想不到的位置、畫面上有大片莫名空白等等）

造成的影響越大且負面，就越不適合「現在」導入該新樣式 ☢️

> On the other end of the spectrum, let’s suppose you work for *ClicSanté,* a tool developed by the Quebec government to allow people to book vaccines, blood tests, and other medical appointments. For something like this, it’s super important that as many people as possible can access the service. We don’t want people to skip getting a vaccine because our web app didn’t work for them!

## 參考文件

- [A Framework for Evaluating Browser Support](https://www.joshwcomeau.com/css/browser-support/)
- [MDN CSS Initial value](https://developer.mozilla.org/en-US/docs/Web/CSS/initial_value)
- [Cascading Style Sheets Level 2 Revision 2 (CSS 2.2) Specification](https://www.w3.org/TR/CSS22/cascade.html#specified-value)
