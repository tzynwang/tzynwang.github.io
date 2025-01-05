---
title: 閱讀筆記：Good Code, Bad Code Chapter 8 Make code modular
date: 2023-04-08 19:13:46
tag:
- [Software Architecture]
---

## 總結

此篇是 Good Code, Bad Code: Think like a software engineer 第八章（Make code modular）的閱讀筆記，本章旨在說明讓程式碼模組化可以帶來的優點，以及提供一些讓程式碼更加模組化的實作技巧。

## 筆記

### 模組化的優點

一個軟體產品通常不太可能一經發布後完全不修改其規格或行為。對軟體開發而言，「修改」是一件可預期發生的事情。而如果程式碼有被模組化，那麼修改這樣的程式碼通常會比改動「沒有模組化的程式碼」來的簡單。

> One of the main aims of modularity is to create code that **can be easily adapted and reconfigured**, without having to know exactly how it will need to be adapted or reconfigured. A key goal in achieving this is that different pieces of functionality (or requirements) should **map to distinct (clear, recognizably) parts of the codebase**.

而模組化的核心概念如下：

1. 不暴露實作細節
2. 每一個功能（或資料結構、物件等）只專注在自身的任務上，不關心其互動目標的實作內容
3. 承上，當程式碼需要因應新規格進行變動時，修改應只發生在「與新規格有直接關聯」的程式碼上

### 實作技巧

#### 依賴注入

核心概念是「保持彈性」，避免寫死日後可能會面臨修改的部分。

以導航軟體為例，「地圖」這類「日後可能會擴充、或是有多種版本」的資料比較適合透過依賴注入（dependency injection）來把內容送進「需要地圖資料」的功能中。直接把地圖資料刻進各種功能內，可能會造成：

1. 地圖散落在各種需要此類資料的功能中，造成內容（地圖）在多處重複出現
2. 承上，一旦面臨修改時，所有會用到「地圖」的程式碼都要一起被更新
3. 或是另一種情況：現在有了兩個版本的地圖資料，但因為日前把第一版的地圖寫死在相關功能中，導致為了對應第二版的地圖，現在需要建立「除了地圖版本不同以外、其他內容基本上都一樣」的第二套功能

而透過依賴注入可以避免以上情境發生。

補充：可以透過定義 `interface` 來確保「注入的參數」以及「功能本身」能夠互相搭配，亦即參數以及功能在實作時都需要遵守特定介面，確保兩者可以順利溝通。

#### 謹慎繼承

在執行類別繼承（class inheritance）時，延伸出來的子類別會繼承親類別的 API 以及功能。但本書提出的觀點為：如果親類別的 API 與功能「對於子類別的使用者來說並不相干（屬於實作細節）」的話，直接繼承就不是一個最佳實作方式。而以下是作者建議的替代方案：

（下面以Ｘ代表原繼承關係中的子類別、Ｙ代表原繼承關係中的親類別）

- 直接產生（compose）類別Ｙ的實例，並於類別Ｘ中使用Ｙ實例的功能，此時類別Ｘ的使用者不會看到類別Ｙ的任何實作細節，但類別Ｘ的功能依舊
- 透過代理（delegation）來把「使用者要透過類別Ｘ完成的功能」轉交給類別Ｙ執行，類別Ｘ一樣不會暴露任何關於類別Ｙ的實作細節

而為何要避免暴露實作細節？本書的解釋是：

- 一旦親類別的 API 或功能暴露到子類別層級，就無法避免這些功能被子類別的使用者拿來用。而一旦被拿來用，日後工程師便不能輕易修改親類別的功能，因為這可能會影響到那些子類別的使用者
- 暴露親類別的 API 或功能可能會導致子類別的使用者感到困惑，因為親類別的 API 或功能可能與子類別沒有直接關聯

#### 專注於自身

核心概念是「不過度依賴其他程式碼的實作細節」。

在兩段程式碼需要合作時，比較好的做法是定義好共用介面（interface），並根據此資料結構來進行互動。好處是此二程式碼日後若需進行更新，只要兩者繼續遵守日前定義好的介面，那麼其中一方的修改就不會影響到另外一邊的程式碼。

反之，如果一個功能Ａ的實作全都直接參考Ｂ的回傳結構，這會導致功能Ｂ日後進行任何修改時，都要一併檢查功能Ａ的實作是否還能配合改動後的功能Ｂ。這會讓程式碼變得容易出錯，應盡量避免此類開發方式。

以上「專注於自身」的技巧除了應用在一般回傳內容上，也適用於拋錯時的錯誤內容：

> In order to prevent implementation details being leaked, each layer in the code should ideally **reveal only error types that reflect the given layer of abstraction**. We can achieve this by wrapping any errors from lower layers into error types **appropriate to the current layer**. This means that callers are presented with an appropriate layer of abstraction while also ensuring that the original error information is not lost (because it’s still present within the wrapped error).

## 參考文件

- [Manning: Good Code, Bad Code](https://www.manning.com/books/good-code-bad-code)
