---
title: 閱讀筆記：The Art of Unit Testing Chapter 7 Trustworthy tests
date: 2024-01-21 10:45:50
tag:
	- [Testing]
banner: /2024/the-art-of-unit-testing-ch7-trustworthy-tests/hannah-busing-Zyx1bK9mqmA-unsplash.jpg
summary: 本書第一章曾提過，好的單元測試應有三種特徵——好讀、值得信任、好維護。第二到六章說明了如何寫出「好讀」的測試，而這一章則會說明「信任感」在單元測試中扮演什麼角色。
draft: 
---

## intro

本書第一章曾提過，好的單元測試應有三種特徵——好讀、值得信任、好維護。第二到六章說明了如何寫出「好讀」的測試，而這一章則會說明「信任感」在單元測試中扮演什麼角色。

## 何謂信任感

一個單元測試如果值得信任，就代表我們全心相信該測試每一次執行的結果。

> We accept the test results with confidence.

當我們信任的測試紅燈時，我們會認真除錯，而不是機械性地再跑一次測試，期待結果變綠燈。當我們信任的測試綠燈時，我們便確信該單元 100% 功能正常，不需要再「手動檢查一下，以防萬一」。

## 為何測試會紅燈

- 👍 因為程式碼真的有問題：這很正當的紅燈原因，畢竟單元測試本來就是為了幫忙檢查程式碼的功能是否正常
- ❌ 因為測試已經和現行實作脫鉤：如果是這個理由，請刪掉過時的測試，並根據當下的實作內容撰寫新的單元測試
- ❌ 錯的是測試：詳見下方筆記
- ❌ 反覆無常的測試（flaky Test）：詳見下方筆記

### 錯的是測試

被檢驗的單元沒有任何功能瑕疵，反而是單元測試驗證的內容有誤，或誤會單元的使用方式，導致測試失敗——這就是寫壞的測試。可以透過「先寫測試，再實作」（測試驅動開發 / TDD）的開發流程來減少這類問題（參考[第一章的筆記](/2023/the-art-of-unit-testing-ch1-the-basic-of-unit-testing#110-test-driven-development)）。

我們也要避免在測試中使用邏輯，比如下列不良示範：

```js
const makeGreeting = (name) => {
  return 'hello' + name;
};

describe('makeGreeting', () => {
  it('should return string hello with name', () => {
    const name = 'abc';
    const result = trust.makeGreeting(name);
    expect(result).toBe('hello' + name);
  });
});
```

如果一段邏輯已經有問題，那麼，把該邏輯照搬到單元測試裡只會讓問題繼續被埋沒。上述測試無法幫忙查出「輸出的 `hello` 與參數 `name` 之間並沒有空白」的問題。

直接驗證寫死的值，反而能正確反應該單元的問題：

```js
describe('makeGreeting', () => {
  it('should return `hello ${name}`', () => {
    const result = trust.makeGreeting('abc');
    expect(result).toBe('hello abc');
  });
});
```

---

以下是另一個負面教材：

```js
const isName = (input) => {
  return input.split(' ').length === 2;
};

describe('isName', () => {
  const namesToTest = ['firstOnly', 'first second', ''];
  it('correctly finds out if it is a name', () => {
    namesToTest.forEach((name) => {
      const result = trust.isName(name);
      if (name.includes(' ')) {
        expect(result).toBe(true);
      } else {
        expect(result).toBe(false);
      }
    });
  });
});
```

使用迴圈與條件判斷除了讓測試本身變得不易閱讀以外，當測試紅燈時，這種寫法也會提升除錯的困難度。Jest 雖然會提示出錯測試的名稱，但這並不會讓我們知道「是陣列中的哪一個項目導致測試失敗」。工程師只能耐著性子一行一行地讀，並在腦中運行每一組迴圈的執行結果。

結論：表面上看起來是少寫了幾行程式碼，但出包時的修繕成本比多寫幾組測試高太多了。

### 反覆無常的測試

指那些在程式碼或單元測試沒有任何改動時，執行結果便時好時壞的詭異測試。

![反覆試探](/2024/the-art-of-unit-testing-ch7-trustworthy-tests/反覆試探.png)

以常理而言，測試中的依賴（不可控的部分）越多，測試時好時壞的可能性就越高。但這是 e2e 與系統測試（system testing）無法避免的一部分——畢竟我們執行這些測試，就是為了盡可能貼近真實情況。而現實世界中的依賴（real dependency / moving part）畢竟沒有那麼好控制：資料庫的內容會變、網路可能不穩、使用者的裝置版本可能出乎意料的舊 ⋯⋯。

![flakiness chart](/2024/the-art-of-unit-testing-ch7-trustworthy-tests/flakiness-chart.png)

但對單元測試而言，結果反覆無常是不可容忍的。除了參考本書關於 stub/mock 的章節來增前對測試環境的控制外，對於那些實在無法收編的測試，請考慮刪除之。

## 不可信的綠燈

如果單元測試有可能因為本身的邏輯錯誤導致誤報（紅燈），那自然也會有一些理由導致單元測試給出虛假的綠燈。這類應失敗但未失敗的測試基本上：

1. 根本沒有執行驗證（assert）
2. 執行了模稜兩可的反面驗證，比如以下範例：

```js
expect(() => someFunction()).not.toThrow(error);
```

這個測試只讓我們知道 `someFunction` 沒有拋錯，但我們也無法知道這個功能的「表現正常」到底是什麼。這個綠燈只是消極地確保「某功能沒有出錯」。

請使用 `.toBe()` `.toEqual()` 這類正面的比對功能（Matcher）和退出點一決勝負。

![jojo-approach.png](/2024/the-art-of-unit-testing-ch7-trustworthy-tests/jojo-approach.png)

## 其他注意事項

不要在一個單元測試裡執行多次驗證（`expect()`）——當測試失敗時，你會需要多花時間確認到底是哪一組 `expect()` 失敗。

如果有複數種情境需要驗證，就為不同的情境撰寫對應的單元測試。這也能避免我們用太攏統的名稱來描述一個測試。比如以下範例：

```js
describe('trigger', () => {
  it('should work as expect', () => {
    const callback = jest.fn();
    const result = trigger(1, 2, callback);
    expect(result).toBe(3);
    expect(callback).toHaveBeenCalledWith("I'm triggered");
  });
});
```

可以拆為兩組命名更具體的單元測試：

```js
describe('trigger', () => {
  it('should run the callback', () => {
    const callback = jest.fn();
    trigger(1, 2, callback);
    expect(callback).toHaveBeenCalledWith("I'm triggered");
  });
  it('should return the sum from the given values', () => {
    const result = trigger(1, 2, jest.fn());
    expect(result).toBe(3);
  });
});
```

## 參考文件

- [Manning: The Art of Unit Testing, Third Edition](https://www.manning.com/books/the-art-of-unit-testing-third-edition)
- [Stack Overflow: What does “DAMP not DRY” mean when talking about unit tests?](https://stackoverflow.com/a/11837973)
- [Enterprise Craftsmanship: DRY vs DAMP in Unit Tests](https://enterprisecraftsmanship.com/posts/dry-damp-unit-tests/)
