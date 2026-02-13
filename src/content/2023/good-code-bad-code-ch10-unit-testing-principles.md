---
title: 閱讀筆記：Good Code, Bad Code Chapter 10 Unit testing principles
date: 2023-04-19 19:48:03
tag:
  - [Software Architecture]
  - [Testing]
---

## 總結

此篇是 Good Code, Bad Code: Think like a software engineer 第十章（Unit testing principles）的閱讀筆記，本章簡單介紹了單元測試，並探討「何謂好的測試」。

## 筆記

本書作者認為好的單元測試會有以下特性：

- 能夠確實反映問題
- 忽略實作細節
- 具體的錯誤說明
- 容易理解的測試內容
- 容易被執行

### 確實反映問題

好的單元測試除了要能抓出程式碼的問題外，也要在程式碼沒有問題時能夠穩定得到「測試順利結束」的結論。一個測試如果時常出現誤報，就會像狼來了的故事一樣，時間久了之後，工程師通常會：

1. 不再進行測試，因為結果也不準確
2. 即使測試「報錯」了，也不會認真對待這個測試結果（因為可能是誤報）

故良好的單元測試只會在被測驗的程式碼「真的有問題」時報錯，並在程式碼能正常運行時，不進行任何誤報。

### 忽略實作細節

本書作者認為單元測試應將重點放在「確認執行一段程式碼後，其結果是否符合預期」，而非驗證其實作細節。一個好的測試**不**應該在一段程式碼進行重構後也需要跟著變動，如果重構程式碼導致測試需要一起翻新，這可能代表這些測試有牽涉到「檢驗實作細節」的部分。

但本節同時也提醒工程師：

> What ultimately matters is that we properly **test all the important behaviors of the code**, and there may be occasions where we can’t do this using only what we consider the public API.

重點是——測試應覆蓋一段程式碼中所有的重要邏輯，但不一定所有的重要邏輯都會被暴露出來，故撰寫測試時，還是要參考程式碼的實際行為來設計測試。

書中舉例如下：

```ts
class AddressBook {
  private server: Server;

  private emailAddressCache: Record<string, string>;

  lookupEmailAddress(userId: string) {
    const cachedEmail = this.emailAddressCache[userId];
    if (cachedEmail) {
      return cachedEmail;
    }
    return this.fetchAndCacheEmailAddress(userId);
  }

  private fetchAndCacheEmailAddress(userId: string) {
    const fetchedEmail = this.server.fetchEmailAddress(userId);
    if (fetchedEmail) {
      this.emailAddressCache[userId] = fetchedEmail;
    }
    return fetchedEmail;
  }
}
```

上述 `AddressBook` 除了測試 `lookupEmailAddress` 是否能根據 `userId` 回傳正確的 emailAddress 外，也應該要測試「執行 `lookupEmailAddress` 時若 `cachedEmail` 中有對應的快取，就**不會**觸發 `fetchAndCacheEmailAddress`」此功能。畢竟設計 `emailAddressCache` 就是為了避免 `AddressBook` 在快取中有可用內容時繼續對 server 送出請求，故此行為應該也要被驗證。

### 具體的錯誤說明

重點：幫助工程師在測試報錯時能夠更快理解「到底發生什麼事」。

以前端常用的測試框架 Jest 與 Cypress 來說，兩者都會在測試結果不符預期時同時提供「預期中」與「實際收到」的結果比對，工程師如果有針對每一個測試情境撰寫合理的測試描述，報錯時就應該不會花費太多時間在「理解錯誤到底是什麼、發生在哪裡」這些事情上。

### 容易理解的測試內容

「容易理解」指的是當工程師看到一個測試時，能知道這個測試要檢驗的是被測試程式碼的「哪一個段落」。當工程師對程式碼進行修改後，「容易理解的測試」會讓工程師很快就知道：

1. 單元測試是否需要跟著一起更新
2. 如果要一起更新，那有哪些測試需要修改

另外，易懂的測試內容也可作為說明手冊，來為其他工程師說明該程式碼包含哪些功能。

### 容易被執行

重點：跑得慢或是很難跑起來的測試會讓工程師放棄進行測試，當測試不常被執行的話，就無法得知被測驗的程式碼是否功能安好，測試便失去意義。

## 參考文件

- [Manning: Good Code, Bad Code](https://www.manning.com/books/good-code-bad-code)
