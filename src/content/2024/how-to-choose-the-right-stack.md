---
title: 課程筆記：如何挑選框架（工具）
date: 2024-11-13 20:51:01
tag:
  - [Product Design]
banner: /2024/how-to-choose-the-right-stack/chris-chow-wQ5Po8HAEAI-unsplash.jpg
summary: 首先確認你的產品目的，然後確實搞懂框架（工具）的原理，最後就是記得你永遠有其他選擇 😉
draft:
---

## 前言＆聲明

此篇是 Udemy 課程 [How to Build the Right Software (and Choose the Right Stack)](https://www.udemy.com/course/right-software-and-right-stack) 中，關於 How to Choose the Right Stack 側的筆記。

這門課程對於「如何選出合適的框架（工具）」給出三個建議：

1. 先確認產品的互動程度
2. 搞清楚工具的原理與限制
3. 永遠有其他選擇

不過我沒有全然同意這三個建議，因此此篇筆記的內容會是「解釋一下建議的內容」加上「我對這些建議的觀點」。如果你感覺這篇筆記的內容沒有道理，你有可能是對的。

## 筆記

### 先確認產品的互動程度

課程觀點：

- 先確認產品的**互動程度（interactivity degree）**，再據此挑選工具
  - 互動程度**高**：代表你的產品經常需**接收使用者的輸入，並作出回應**
  - 互動程度**低**：代表你的產品通常是在對使用者**展示資訊**
- 只有需要大量互動的產品才需要出動框架或工具；極端一點的例子是，如果你只是需要在網站上開關 side menu，那你甚至不需要任何 lib，寫一點白板 JavaScript 就能解決這個問題了

我的觀點：

我同意殺雞不需要牛刀，如果只是要搓一個宣傳用的網站，那不用框架很合理。但對於 side menu 這個例子，我有不同的看法，理由是：我現在待的開發團隊已經選定 @mui 作為公司產品的 UI lib。在大家都很熟悉 @mui 的情況下，使用 @mui 來完成 side menu 能確保後續接手維護的人**不需要花太多時間**搞懂這個元件的原理（一定有文件可以看，而且 lib 用久了多半都會知道有哪些 api 可以操作）。

除非是完全不用維護舊程式碼的情境，不然使用 lib 來降低所有人理解、修改程式碼的成本應該是比較香的 🌚

### 搞清楚工具的原理與限制

課程觀點：

在決定是否要導入某個框架（或任何工具）時，先搞懂這個框架（工具）**怎麼運作、擅長解決什麼問題、相較其他競品的優點是什麼**，接著再根據產品的目的（或成功指標）來決定是否使用它；我們使用框架（工具）的重點永遠是要讓它們**幫忙節省時間、解決問題**，而不是讓它阻礙我們解決問題

> For every framework, **be curious about how they work**, look at what they do under the hood; **what they're good at**, what challenges you may face; **what is really important to make your product work well**? You don't want to be fighting your framework to try to solve the problems for your users.

我的觀點：

深入瞭解框架（工具）的原理確實很重要，可惜課程中並沒有提供太多關於**如何**深入瞭解框架的技巧，影片中只有帶著大家瀏覽 remix/Next.js/SolidJS/Qwik 的 landing page 而已 🌚

以目前的經驗來說，如果要確認是否導入某個框架，我會進行以下檢查：

- 把框架的教學文完整走過一遍
- 確認框架文件提到的 caveat 不會跟產品的核心功能或既有的技術限制起衝突（備註 1）
- 確認如何用此框架實現產品規格，至少研究完資料流、驗證（authentication）和如何處理 GA4 事件
- 嘗試安裝目前團隊在用的 UI lib，確認兩者可以順利搭配（備註 2）

備註：

1. 假設我現在就是只能部署純 client side 的服務，但這個框架有 80% 的優點跟 api 都放在 server 上——如果是這樣，那這個框架就不是我的最佳解 🙂 ~~勉強是不會幸福的~~
2. 之前被 remix 的 SSR 特性整過，因為 @mui 在 dev mode 時會在 client side 注入樣式標籤，結果就是吃了一頓 hydration issue 粗飽

### 永遠有其他選擇

課程原話：

> Keep your option **open**.

個人想法：

- 工程師與框架（工具）的關係的確不應該是削足適履，但這也不代表一遇到限制就想著要換新工具；這兩三年的開發心得是——如果我需要用上各種奇技淫巧來實現一個功能，很大的可能是我根本搞錯了一些基礎設定（尤其當我想做的事情其實很普通時），或是**打從一開始就沒搞懂、挑錯工具**
- 統一框架能讓工程師省去 context switch 的成本，除非我在這間公司只需要維護一個專案，或是既有的框架真的已經撞到無法克服的效能瓶頸；換換愛是 side project 在做的事
