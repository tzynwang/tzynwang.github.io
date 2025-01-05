---
title: 領域模型（domain model）與領域驅動設計（DDD）：最基礎的部分
date: 2023-11-29 20:27:20
tag:
- [Product Design]
- [Software Architecture]
banner: /2023/ddd-the-very-basic/annie-spratt-Xse_WtQsIGA-unsplash.jpg
summary: 本篇筆記會簡單說明什麼是領域模型（domain model），以及介紹領域驅動設計（DDD）最最最入門的部分。
draft:
---

本篇筆記是根據影片 [MOPCON 2019 從需求直面系統實作，領域驅動設計 (DDD) 的領域塑模](https://www.youtube.com/watch?v=mGR0A5Jyolg&ab_channel=MOPCON) 整理出來的內容。會簡單說明什麼是領域模型（domain model），以及介紹領域驅動設計（DDD）最入門的部分。

## 總結

透過 DDD 思維，開發者做完需訪就能整理出待開發項目。因為 DDD 的著眼點是**使用流程**，「如何實作」是理解流程後自然出現的結果。

## 筆記

### what is domain modeling

> 具體理解「要做什麼」，以及「怎麼做」。

講者定義：具體（視覺化）理解一個組織「要做什麼」與「如何做」的事情與互動關係。

### why DDD with domain modeling

> DDD 讓開發者在需訪結束後——透過 domain modeling 思維理解「要做什麼」且「怎麼做」——就能規劃好系統架構 (architecture) 與實作細節 (element)。

### 傳統需訪中的 stakeholders

![ddd-stakeholders-type](/2023/ddd-the-very-basic/ddd-stakeholders-type.png)

- actor: 與流程互動，最後會獲利的角色
- worker: 在流程中操作商業邏輯的角色

（非 stakeholder 但很重要）ubiquitous language: 在執行事件風暴（event storming）淬煉需求時，為了保證認知一致所使用的共同語言。

### 另一種需訪：domain storytelling

> 濃縮自 [domainstorytelling.org](https://domainstorytelling.org/)：把領域知識（domain knowledge）轉化為軟體的一門技術。目的在讓人更了解一個領域（domain）。產出的結果 domain story 會是一張圖 (pictographic) ，上面會呈現所有人對該領域的理解。

domain storytelling 是較新的概念，比起傳統的需訪或事件風暴（event storming）更貼近使用者，融合更多 DDD 的思考方式。

下圖以 actor 為中心來描述產品的使用方式—— actor 會建立 work object 或與其互動：

![domain-storytelling-quick-start](/2023/ddd-the-very-basic/domain-storytelling-quick-start.png)

### DDD：大概念

![domain-design-model-instructions](/2023/ddd-the-very-basic/domain-design-model-instructions.png)

傳統開發思維以「完成功能」為主，但 DDD 強調的是「流程 (process base thinking)」——從系統流程的角度來看待系統設計——亦即執行的是 forward design。

- backward design：我要保存使用者的訂單資料，所以我必須將資料庫設計為 ⋯⋯
- forward design：使用者會與系統互動，而互動時產生的資料需要被保存起來，於是我需要設計保存資料的方式 ⋯⋯

在使用流程中流動的是「物件」而非「資料」，並物件會提供屬性與方法讓外界操作。

### DDD：稍微深入

可以分為戰略 (strategic / 外觀) 與戰術 (tactical / 內裝)：

- 戰略：如何描述你的系統
- 戰術：你要實作哪些設計

#### strategic: domain, subdomain

領域（domain）指的是一個產品「對外的互動」與「本身的內容」。而在實際執行開發前，建議先將領域切割為子領域 (subdomain)——避免一口氣開發太大團的東西導致缺漏。

不同子領域能根據重要性（賺錢度）進行排列：core > supporting > generic。資源應該傾注在核心（core）子領域上。

#### strategic: bounded context

限界上下文 (bounded context, a **conceptual boundary**)：代表不同目的的流程。以電商購物為例，以下就是兩組限界上下文：

- 使用者在網站上瀏覽商品——目的是「搜尋商品」
- 使用者下單——目的是「購買，取得產品」

如果同一件事情在不同的流程中「換了名字」，代表這裡出現了新的限界上下文——因為每組限界上下文會有自己的 ubiquitous language。下圖每一個彩圈都是一組「限界上下文」：

![bounded-context-in-EC-example](/2023/ddd-the-very-basic/bounded-context-in-EC-example.png)

#### strategic: context map

上下文映射（context mapping）是為了銜接不同的限界上下文（bounded context）。

常見的實作方式：

- 透過防腐層 (anticorruption layer) 避免上下文（context）互相影響
- 透過開放主機服務 (open host service) 與發佈語言 (published language) 溝通——白話文就是「定義溝通用的介面規格」

上下文的上下游——被呼叫端是上游、呼叫端是下游——關係會影響到「防腐層要做在哪裡」。從簡報來看，上游會定義開放主機服務與發佈語言，而防腐層通常是做在下游：

![contexts-map.png](/2023/ddd-the-very-basic/contexts-map.png)

#### tactical: entity

> 具有身份 (identity)、狀態 (state) 與生命週期，可以被執行商業邏輯 (business operation)。

例子：電商網站中的「訂單」「商品」。

#### tactical: value object

> 為了完成某種目的的資料，沒有身份概念。

例子：電商網站中的「出貨地址」「信用卡卡號」。

#### tactical: aggregate

> 流程中相關聯的個體（entity）彼此聚合，有生命週期的概念。不會無上限聚合。

例子：電商網站在出貨時需要聚合「訂單」與「商品」的資訊。

#### tactical: domain service

> 真的無法歸納進個體（entity）的商業邏輯，沒有狀態概念。

例子：電商網站「針對首次購買的客戶，需要驗證手機號碼才能出貨」這個行為。

#### tactical: domain event

使用者的行動目標改變時，通常會配送領域事件（domain event）。在 domain storytelling 或需訪聽到關鍵字「當我 ⋯⋯ 時」「如果 ⋯⋯ 就要 ⋯⋯」時，可能就代表這裡會配送領域事件。

領域事件通常會導致個體（entity）進行狀態切換——但不要輕易在個體中記錄狀態，而是**由個體屬性來決定狀態**。在流程進行時「狀態變化」會自然發生——比如訂單被押上付款日期後，訂單狀態自然就變成「待出貨」。

#### architecture

![ddd-architecture](/2023/ddd-the-very-basic/ddd-architecture.png)

application layer 與 domain layer 的差異：domain 會操作個體（entity），但 application 不會。

![ddd-architecture-map-to-clean-architecture](/2023/ddd-the-very-basic/ddd-architecture-map-to-clean-architecture.png)

將 DDD architecture 對應到 clean architecture 的話：

- domain layer 會被放在 clean architecture 的 entity 中
- application layer 會對應 clean architecture 的 use case

## 參考文件

- [stackOverFlow: What actually is a subdomain in domain-driven design?](https://stackoverflow.com/questions/73077578/what-actually-is-a-subdomain-in-domain-driven-design)
- [Domains and Subdomains](https://thedomaindrivendesign.io/domains-and-subdomains/)
- [Bounded Contexts in DDD](https://levelup.gitconnected.com/bounded-contexts-in-ddd-d5f0dc7d1cf1)
- [martinFowler.com: BoundedContext](https://martinfowler.com/bliki/BoundedContext.html)
