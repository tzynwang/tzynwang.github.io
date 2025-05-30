---
title: 說真的，如何避免拷問使用者——《資訊架構學》（第四版）閱讀筆記
date: 2025-01-27 11:47:53
tag:
  - [Product Design]
  - [閱讀筆記]
banner: /2025/how-to-make-information-findable-understandable/拷問的各種形式.png
summary: 避免產品拷問使用者的終極前提其實是「理解使用者要什麼、在想什麼」，不過這篇的重點是關於「如何讓資訊找尋找、好理解」以及「如何維持體驗的一致性」。不會聊到使用者研究，請見諒 🌚
draft:
---

這篇是在讀完 [Information Architecture: For the Web and Beyond (4th Edition)](https://www.amazon.com/Information-Architecture-Beyond-Louis-Rosenfeld/dp/1491911689) 後整理出來的筆記，大部分的內容都是由這本書啟發，但有些解讀是出自於我的工作經驗。如果你覺得這篇筆記有些地方毫無道理，那請當作是我的鍋。

## 懶人包

🍐 如何避免讓使用者感覺像是在被你的產品拷問：

- 讓使用者**輕鬆找到他需要的資訊**（make information findable）
- 讓使用者**容易理解你提供的資訊**（make information understandable）
- 維持**一致性**：即使透過不同的裝置操作，使用者依舊獲得相同的體驗

## 關於尋找

使用者的**目的**會影響他搜尋的方式：

- 精確搜尋（known-item seeking）：使用者非常清楚自己要找什麼，也知道自己的問題一定有標準答案；舉例：尋找線上商城的客服聯絡方式
- 探索式搜尋（exploratory seeking）：
  - 使用者不是很確定自己在找是什麼，或是這個問題可能沒有標準答案
  - 執行這種搜尋時，使用者會吸收找到的資訊，這個吸收（學習）可能會影響他下一次的搜尋行為
  - 舉例：尋找日本旅遊時的住宿，最初是看看一段日期內「有哪些選項」，而根據搜尋的結果（是否有空房、價格、位置等等），會影響使用者決定「要住民宿還是飯店」，最終讓使用者決定「要訂哪一間」（或是因為一直找不到偏好的結果，所以決定放棄使用服務）
- 地毯式搜尋（exhaustive research）：
  - 使用者意圖深入一個主題，需要一網打盡相關資料
  - 執行這類搜尋時，使用者通常會比較有耐性，也可能會變化搜尋時的關鍵字（但意圖都還是「取得關於該主題的資訊」）
  - 舉例：使用者確診了某疾病，他現在非常需要關於該疾病的任何資訊；而且如果第一次搜尋的結果不盡人意，他會調整關鍵字，直到取得必要的資訊為止
- 再訪（refinding）：使用者想尋回之前找到的資料

如果要確保資訊能被找到，產品開發者要先知道使用者**偏向執行哪一種搜尋**，接下來才是**讓產品提供能滿足該種搜尋的功能**。

以下是各種元件擅長處理的搜尋行為：

- 搜尋框：
  - 主要負責處理精確搜尋
  - 加上篩選器（filter）、自動輸入（autocomplete）與預設問題後，也能處理探索式搜尋
  - 在畫面上提供「關鍵字建議」或是在背後「根據關鍵字執行關聯搜尋」都能拓展搜尋結果，進而滿足探索式、地毯式搜尋
- 網站地圖（sitemap）、索引（index）：
  - 負責根據階層（hierarchy）或筆畫順序來**展示一個產品包含的所有資訊**，但這多半預設使用者「必須知道尋找目標的名稱」
  - 就像搜尋時可以「根據關鍵字執行關聯搜尋」，展示資訊時，也能對資訊加上同義詞標籤（alias）來幫助使用者發覺「這是他要找的東西」
- 導覽元件（nav bar）、麵包屑（breadcrumb）、清單（menu）：
  - 將產品提供的資訊主觀地分組，再呈現給使用者
  - 這類元件的成敗主要在產品開發者與使用者**對分類的邏輯是否有共識**，以及是否**使用相同的詞彙來描述需求**
- 書籤、我的最愛：負責「尋回之前找到的資料」的需求

## 關於理解

比起「如何讓使用者容易理解你提供的資訊」，我偏向用「如何避免讓使用者感到困惑」來確保產品沒有拷問使用者。而避免困惑的兩種方法是：

- 產品的外觀與功能要**符合使用者對該類產品的期待**
- 提供**脈絡**，提示使用者如何理解產品

用一句話總結，我認為「好理解」代表的是**和使用者取得共識**。

### 滿足期待

在現實事件中，使用者會根據建築物的**外觀與結構**來理解他看到的是什麼（這是一間便利商店、銀行還是郵局）。使用者在察覺一個場所是「什麼」以後，就會根據既有的知識，推測他可以在這裡**執行哪些任務**（買早餐、匯款、寄信）。

數位產品無法呈現羅馬柱、迴廊與彩繪玻璃，但可以透過外觀與功能來提示使用者「這是一個能執行Ｘ／提供服務Ｙ的場所」。舉例如下：

- 外觀：標誌（logo）能直接告訴使用者他位在何處；導覽列的內容也會提示使用者他能執行的任務，進而讓使用者意識到他現在在哪裡（「有『存款、投資、貸款』這些標籤，噢，是網路銀行」）
- 功能：如果使用者已經預期一個線上商城會有「要能讓我直接搜尋想買的東西」、「要告訴我目前有哪些促銷活動」以及「要有『筆記型電腦』這個分類，我想知道目前有哪些型號可以挑」這些要素，那在打造一個線上商城時，產品開發者多半要**滿足這些期待**，否則使用者可能不容易理解「我在哪裡、這是什麼」

### 提供脈絡

拜搜尋引擎所賜，使用者不一定會從開發者預期的起點（網站首頁）進入產品。當使用者從搜尋結果直接進入網站的特定節點時，網站標誌、導覽元件與麵包屑就能提示使用者「我在哪」、「我可以在這裡執行什麼任務（我有哪些需求能被滿足）」。

讓圖示搭配文字標籤，或是透過 ToolTip 來提供說明，也是在為使用者提供脈絡。

---

而除了影響使用者如何理解一個產品外，脈絡在使用者執行「探索式搜尋（到處逛逛）」或「執行特定任務（比如註冊）」時也很重要：

- 當使用者瀏覽時，提示「你現在在哪」、「你從哪裡來」、「你接下來可以去哪」能避免使用者感到迷失，也能讓使用者知道是否還有尚未探勘的內容（「我全部『理解』了嗎」）
- 在執行特定任務時，明確告訴使用者「距離完成任務Ｘ還有Ｙ項操作」能減少操作時的不耐與不安

## 關於一致性

除了不好找與不好懂以外，不一致的操作體驗會讓使用者**難以形成用來理解產品的心智模型（mental model）**，這也是拷問的一種。

![誰會在半夜吃拉麵啊](/2025/how-to-make-information-findable-understandable/誰半夜吃拉麵啊.jpg)

產品開發者可以從「外觀」與「功能」這兩種面向來提供連貫性：

- 外觀：在整個服務使用一致的用詞來描述同一種功能；相同階層的資料應該擁有一致的外觀（包含字體尺寸、間距、顏色等等）
- 功能：不論使用哪種裝置，當使用者與元件互動後，得到的回饋必須是一致的；比如「點擊客服按鈕」後，發生的事情必定是「讓使用者能找到客服」
