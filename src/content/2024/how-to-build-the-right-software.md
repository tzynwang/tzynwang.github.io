---
title: 課程筆記：如何打造對的軟體
date: 2024-11-10 09:27:00
tag:
	- [Product Design]
banner: /2024/how-to-build-the-right-software/debby-hudson-bAYP_kAtNWg-unsplash.jpg
summary: 首先搞清楚我們到底要解決什麼問題 ☕️
draft: 
---

此篇是 Udemy 課程 [How to Build the Right Software (and Choose the Right Stack)](https://www.udemy.com/course/right-software-and-right-stack) 中，關於 How to Build the Right Software 側的筆記。

如果只能用一句話來回答「如何打造對的軟體」，那這門課程的回答就會是「先搞清楚我們**要解決的是什麼問題**」。

## 聲明

這篇筆記混入不少我對課程內容的延伸思考，而不是單純的課程摘要。如果你感覺這篇筆記的內容沒有道理，你有可能是對的。

## 筆記

### 是需求還是問題

工程師要能分辨使用者提出的是需求（requirement）還是問題（problem）。如果使用者提出的是需求，那工程師要先搞清楚使用者遇到的**問題到底是什麼**，接著才是解決問題。而為了從需求中挖掘出問題，我們應該**打破砂鍋問到底**（課程中以 Why Down 稱之）。比如以下範例：

```bash
使用者：我需要一棟全玻璃製的大樓。
工程師：為什麼需要全玻璃製？
使用者：因為全玻璃製的大樓是完全透明的。
工程師：為什麼需要全透明的大樓？
使用者：為了確保這棟大樓的安全，所以我需要看清楚是否有怪人溜進來，或是有怪事發生。
```

對話中的玻璃製、全透明大樓都是需求，而背後想解決的問題是**確保場所安全無虞**。為此我們不一定要蓋一棟全玻璃製的建築，而是在建築物裡安裝監視器，或聘僱保全。

> Clients and users are not software designers.

使用者可能會提出複雜、高技術債的需求（比如上述的玻璃大樓），因為他們並不是軟體開發的專家，不一定會知道其實有更簡單、更有效率的手段來解決問題——工程師才是這方面的專家。所以下次在開發前，先確認你處理的需求，還是問題？如果是需求，就先挖出背後的問題，再來規劃解決問題的方式。

有時候你甚至不需要親自下海開發，在網路世界上的某處可能已經有個好用工具能解決使用者的問題。就像工程師會靠 npm 套件 uuid 或 lodash 來避免重複造輪子，在解決問題這件事情上，工程師**不需要限制自己一定要親手做出解決問題的工具**。

### 打造 MVP 還是解決 MSP

一個團隊可能很難在 MVP (minimum viable product) 一事上取得共識，因為 **viable (workable/usable) 非常主觀**（我就很難想像工程師和設計師對產品介面的 viable 會有共識 🌚）。結果就是會由團隊裡最有話語權的人來決定 MVP 應該長什麼樣子——但問題是，最有話語權的人，不一定是最了解如何解決問題的人。

而這個課程則認為 MSP (minimum solved problem) 是一個相對客觀的概念。比如以下兩個對比：

- 照片管理軟體的 MVP：我們要在這個 sprint 替產品加上「相簿模式」
- 照片管理軟體的 MSP：我們要在這個 sprint 解決「如何讓使用者快速找到某張照片」的問題

解決 MSP 不一定會比打造 MVP 輕鬆，但如果把 MSP 變成團隊目標，至少所有人都會知道「我們的產品打算解決什麼問題」（註一），每個決策也都有北極星可以對標（或至少能明確排除那些無助於解決問題的設計與功能）。引入 MSP 也比較能避免產品範疇氾濫（scope creep）（註二）。

- 註一：但並不代表團隊在解決的是對的問題
- 註二：指的是產品功能已經開始超出原始需求範圍。比如當你為一個財務軟體加上「定期透過 email 發送報表」的功能，這就是一種範疇氾濫，因為「呈現財務資訊」與「定期派送資訊」是兩個不同的概念。順帶一提，當軟體有範疇氾濫的跡象時，通常也代表 bug 與技術債開始滋生

個人的想法是，開發前應該先講好 MSP，再根據問題打造 MVP。打造 MVP 的終極原因還是在確認**我們在解決的是對的問題**（這個問題不是我們的幻想，它真的存在，並且為使用者帶來困擾）。

![她是真實的](/2024/how-to-build-the-right-software/她是真實的.jpg)

> **Don't fall in love with the solution**, fall in love with the problem.

整個團隊如果對 MVP 該有的樣子沒有共識，很有可能是因為大家並不清楚這個 MVP 到底想解決什麼問題 ⋯⋯🌚

## 延伸閱讀

- [先問，為什麼？](https://moo.im/a/1afguP)
- [Don't Make Me Think, Revisited: A Common Sense Approach to Web Usability (Voices That Matter)](https://www.amazon.com/Dont-Make-Think-Revisited-Usability-ebook/dp/B00HJUBRPG)
