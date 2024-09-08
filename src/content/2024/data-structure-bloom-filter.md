---
title: 快速筆記：bloom filter
date: 2024-09-08 09:11:26
tag:
  - [Browser]
  - [Data Structure]
banner: /2024/data-structure-bloom-filter/freestocks-fplnXE5loWo-unsplash.jpg
summary: bloom filter 是一種資料結構。當你只需要知道某個目標是否存在時，可以使用此結構來保存目標「存在與否」的資訊。
draft: 
---

> 懶人包：這是一種資料結構。當你只需要知道**某個目標是否存在**，而**不需要知道該目標本身的內容**的時候，可以使用此結構來保存目標「是否存在」的資訊。

## 筆記

### 基本原理

使用 bloom filter 需要兩個工具：

1. 將資料 hash 成數字的演算法
2. 用來保存布林的陣列

Bloom filter 的工作原理是：把一組資料 hash 成特定數字，再根據數字結果將陣列中對應的 index 從「無（`false`）」改為「有（`true`）」。當我們想查詢**某個目標是否存在**時，就把該目標拿去 hash，並比對陣列中的對應 index 是否為「有（`true`）」。

舉個例子。當我們要將 `hello` 字串收錄為「太弱的密碼」時，會有以下步驟：

1. 把 `hello` hash 後，得到數字組合 `0 1 1`
2. 把陣列的 index 1 與 2 設定為 `true`

而當我們要查詢 `hello` 這個字串是否為「太弱的密碼」時，步驟如下：

1. 把 `hello` hash 後，得到數字組合 `0 1 1`
2. 檢查陣列的 index 1 與 2 是否都為 `true`，如果都是 `true` 就代表字串 `hello` 曾經被保存在陣列中

結論：得知 `hello` 屬於「太弱的密碼」。在實務上的對應行動可能是「在 UI 提示使用者換一組更強的密碼」。

### 優缺點

- 優點：節省記憶體，且速度快
- 缺點（特性）：會出現偽陽性（false positive）；即「某個目標可能不在陣列中，但查詢後的結果卻告訴你『它在』」

## 應用於瀏覽器的樣式計算

情境：你撰寫了一些 CSS 樣式，其中包含 `.foo div` 這類有點廣泛的選取規則（「選取任何親代為 `.foo` 的 `div` 節點」）。

提問：瀏覽器要如何有效率地將 `.foo div` 的樣式套用到所有符合規則的 `div` 上呢？

解決方式：

首先，將檢索的方向反過來。瀏覽器不一定要從親代走向子代，它可以從子代反查該節點是否有特定親代。接著，瀏覽器可以將一個子代節點的所有親代以 bloom filter 的形式保存起來。

而當瀏覽器想知道一個子代節點是否有特定親代（比如 `.foo`）時，瀏覽器只要查詢該子代的 bloom filter 是否對特定親代樣式名回傳 `true`，就能知道該子代是否「可能」有特定名稱的親代元件。

最後，瀏覽器只會遍歷（實際查詢）那些「可能有特定親代」的子代節點。直到瀏覽器確認某個 `div` 真的有名為 `.foo` 的親代時，才把樣式套用到該 `div` 上。

---

以上應用是從 [CSS runtime performance | Nolan Lawson | performance.now() 2022](https://youtu.be/nWcexTnvIKI?si=8WgiOyiVh59Or0-Y) 學到的。關於 bloom filter 的段落大約在 `17:13` 開始，非常推薦對瀏覽器處理樣式有興趣的讀者聽一下。

演講原稿節錄如下：

The browser **keeps a little Bloom filter hash on each node of its ancestors' tag name, IDs, and classes**. This means that if we're on `div`, and we want to figure out if `.foo` is an ancestor, then we don't have to walk up the tree -- we know instantly, because `.foo` is in the Bloom filter. So now we can quickly filter all the `div`s based on the Bloom filter, "fast rejecting" any that couldn't possibly have `.foo` as an ancestor. Note that, because we could have false positives, **we still need to walk the ancestor chain to check that it really has `.foo` as an ancestor**, but we are still eliminating a lot of work.

## 參考文件

### CSS runtime performance

- [YouTube: CSS runtime performance | Nolan Lawson | performance.now() 2022](https://youtu.be/nWcexTnvIKI?si=8WgiOyiVh59Or0-Y)
- [CSS runtime performance | Slide](https://nolanlawson.github.io/css-talk-2022/#p1)

### Bloom filter

- [Wikipedia: Bloom filter](https://en.wikipedia.org/wiki/Bloom_filter)
- [YouTube: What Are Bloom Filters?](https://youtu.be/kfFacplFY4Y?si=Iv3L0Xi6KRrWTWun)
- [YouTube: Bloom Filters | Algorithms You Should Know #2 | Real-world Examples](https://youtu.be/V3pzxngeLqw?si=vpECWXRYq8UnLWXh)
