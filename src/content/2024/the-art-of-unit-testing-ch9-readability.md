---
title: 閱讀筆記：The Art of Unit Testing Chapter 9 Readability
date: 2024-01-29 21:20:37
tag:
  - [Testing]
banner: /2024/the-art-of-unit-testing-ch9-readability/david-travis-aVvZJC0ynBQ-unsplash.jpg
summary: 沒人在乎「看不懂到底在幹麼」的測試，而為了確保我們費力寫出來的測試能發揮價值，這一章會介紹（回顧）四個能讓測試更好懂的技巧。
draft:
---

## 簡介

沒人在乎「看不懂到底在幹麼」的測試，而為了確保我們費力寫出來的測試能發揮價值，這一章會介紹（回顧）四個能讓測試更好懂的技巧。

## 避免魔術數字（magic value）

魔術數字（magic value）的定義：指那些寫死（hard-coded）且**很難理解其目的**的值。比如以下範例：

```js
describe("password verifier", () => {
  it("should throw exceptions on weekend", () => {
    expect(() => verifyPassword("jhGGu78!", [], 0)).toThrowError(
      "It's the weekend!",
    );
  });
});
```

`jhGGu78!` 看起來像是密碼，但一定要用這組字串來測試嗎？是否能替換成其他內容？空陣列與 `0` 又是什麼意思？

為了避免產生「我看得懂你寫的每一個字但我不知道你想幹麼 🤔」的窘境，請為變數賦予有意義的名稱，以便**傳遞你的意圖**。可參考以下改良後的範例：

```js
describe("password verifier", () => {
  test("should throw exceptions on weekend", () => {
    // arrange
    const SUNDAY = 0;
    const NO_RULES = [];
    // act, assert
    expect(() => verifyPassword2("anything", NO_RULES, SUNDAY)).toThrowError(
      "It's the weekend!",
    );
  });
});
```

現在讀者就能明白空陣列與 `0` 扮演的角色，也能理解「我們可以使用任意字串（`"anything"`）」來執行 `verifyPassword2` 的測試。

~~這就是第九章唯一新增的內容，以下都是第 2 章的老調重彈，不想複習的讀者可以看到這裡就好。~~

## 避免過度依賴全域設定

請避免把「執行測試前的預處理腳本」全部塞到 `beforeEach()` 中。詳細理由已經在 [2 A first unit test#2.6.1 beforeEach() and scroll fatigue](/2023/the-art-of-unit-testing-ch2-a-first-unit-test#261-beforeeach-and-scroll-fatigue) 解釋過，重點回顧如下：

- 如果在 `beforeEach()` 內執行設定，閱讀測試的人不一定會察覺該測試有部分內容散落在測試外。當測試不幸失敗時，這會提升除錯的困難度
- 與其將設定塞進 `beforeEach()` 裡，不如使用工廠功能把重複的部分抽出，避免 `beforeEach()` 淪為垃圾場 🚮——充滿各種設定，也不知道到底是哪些測試有用到這些東西，想刪也不敢刪

## USE 命名法

單元測試的名稱裡應包含測試對象（unit）、情境（scenario）與預期結果（expected behavior）。可參考以下比對，首先是沒有使用 USE 命名的範例：

```js
it("should return error based on rule.reason", () => {
  // lack of unit
});
test("verifyPassword should return error", () => {
  // lack of seenario
});
test("verifyPassword with a failing rule", () => {
  // lack of expected behavior
});
```

再來是有使用 USE 命名的範例：

```js
describe("verifyPassword", () => {
  it("with a failing rule, should return error based on the rule.reason", () => {
    // ...
  });
});
```

不在測試名稱裡揭露這三點資訊的缺點是：

- 閱讀測試的人**被迫看完整個測試**，才能知道該測試「在測試哪個單元、什麼情境、以及預期結果又是什麼」
- 測試失敗時，無法只透過測試名稱知道「是哪一個單元在什麼情境下測試失敗」，你一定得回頭看完整個測試內容，才知道哪裡出了問題

結論：使用 USE 命名規則來描述測試，能避免浪費所有人的時間 ⏰

## AAA 結構

以下兩組範例分別是「沒有」「有」使用 AAA 結構（詳細可回頭翻 [2 A first unit test#2.5.1 The Arrange-Act-Assert (AAA) structure](/2023/the-art-of-unit-testing-ch2-a-first-unit-test#251-the-arrange-act-assert-aaa-structure)）撰寫的測試。除非你的測試腳本真的非常、非常簡短，否則請分段。你未來的讀者會感謝你的。

```js
describe("verifyPassword", () => {
  it("with a failing rule, should return results with item that contain `fake reason`", () => {
    expect(getPasswordVerifier().verify("any value")[0]).toContain(
      "fake reason",
    );
  });
});
```

```js
describe("verifyPassword", () => {
  it("with a failing rule, should return results with item that contain `fake reason`", () => {
    // arrange
    const verifier = getPasswordVerifier();
    // act
    const results = verifier.verify("any value");
    // assert
    expect(results[0]).toContain("fake reason");
  });
});
```

## 參考文件

- [Manning: The Art of Unit Testing, Third Edition](https://www.manning.com/books/the-art-of-unit-testing-third-edition)
- [Stack Overflow: What are magic numbers and why do some consider them bad?](https://stackoverflow.com/questions/47882/what-are-magic-numbers-and-why-do-some-consider-them-bad)
