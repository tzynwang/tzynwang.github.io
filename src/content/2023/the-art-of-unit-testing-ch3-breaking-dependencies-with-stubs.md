---
title: 閱讀筆記：The Art of Unit Testing Chapter 3 Breaking dependencies with stubs
date: 2023-12-25 08:23:20
tag:
	- [Testing]
banner: /2023/the-art-of-unit-testing-ch3-breaking-dependencies-with-stubs/tim-mossholder-WHXbCz2KWhE-unsplash.jpg
summary: 在本書第二章，我們為「回傳值的單元」寫了測試，而第三章則會討論「如何測試呼叫（進入型）依賴的單元」。
draft: 
---

## Intro

我們在第一章學到退出點（exit point）有三種類型：回傳值、改變狀態、呼叫依賴（dependency）。依賴指的是「我們無法或很難控制的部分」，時間、非同步功能、檔案系統（file system）、網路——或是任何很難設定、跑起來非常耗時的要素——這些都算。

在第二章我們為「回傳值的單元」寫了測試，在這一章則會討論「如何測試呼叫（進入型）依賴的單元」。

（筆記備註：本書原文提到第二章討論了「回傳值」與「改變狀態」這兩種測試，但第二章的例子基本上沒有處理到改變狀態的部分⋯⋯🌚）

## 3.1 Types of dependencies

依賴可分為兩種類型：出走型（outgoing dependencies）、進入型（incoming dependencies）。

![two types of dependencies](/2023/the-art-of-unit-testing-ch3-breaking-dependencies-with-stubs/two-types-of-dependencies.png)

### 出走型

代表一個單元的退出點（exit point），執行到這裡就代表該單元「結束」了。執行單元測試時，會以 mock 替代出走型依賴，並測試該 mock 是否有被呼叫。順帶一提，因為 mock 代表退出點，所以一個單元測試一次只應關注一個 mock。

常見出走型依賴：呼叫 logger 印出結果、將內容保存到資料庫、寄信、呼叫 api 等。

### 進入型

此類依賴會為單元供應資訊。相對於扮演終點的 mock ，這類依賴通常是一個單元的「起點」。當我們要幫「使用進入型依賴的單元」撰寫測試時，會以 stubs 代替這類依賴。

常見進入型依賴：從資料庫撈出的內容、來自 api 的回應（response）、從硬碟讀取的檔案內容。

### 名詞整理

本書以「假資料（fake）取代原始依賴的位置」來決定名稱。如果一假資料要在退出點發揮作用，那就是 mock。而如果該假資料要扮演供給資訊的起點，那就是 stub。而 fake 是用來囊括 mock 與 stub 的泛稱。就這樣，沒有其他名稱了。

## 3.2 Reasons to use stubs

以下列在週末就會拋錯的 `verifyPassword` 功能為例——如果工程師在單元測試中不使用 stubs 來取代實際提供 `dayOfWeek` 的 `moment` 函式庫，那實在很難寫出良好的單元測試。畢竟本書第一章第七節提過：一個好單元測試不應該被執行環境影響結果。

```js
const moment = require('moment');

const SUNDAY = 0;
const SATURDAY = 6;

const verifyPassword = (input, rules) => {
  const dayOfWeek = moment().day();
  if ([SATURDAY, SUNDAY].includes(dayOfWeek)) {
    throw Error("It's the weekend!");
  }

  const errors = [];
  rules.forEach((rule) => {
    const result = rule(input);
    if (!result.passed) {
      errors.push(`error ${result.reason}`);
    }
  });
  return errors;
};
```

今天不管是週間還要週末，只要我們沒有調整 `verifyPassword` 的內容，每次執行它的單元測試，結果就該維持一致，而不是時好時壞。

## 3.3 Generally accepted design approaches to stubbing

### 3.3.1 Stubbing out time with parameter injection

將 `currentDay` 改為透過參數傳入——這能降低 `verifyPassword2` 單元測試的變異性（variability）。因為現在提供 `currentDay` 的責任落在呼叫此功能的人身上，我們就能輕鬆地控制測試情境。

```js
const verifyPassword2 = (input, rules, currentDay) => {
  if ([SATURDAY, SUNDAY].includes(currentDay)) {
    throw Error("It's the weekend!");
  }

  const errors = [];
  rules.forEach((rule) => {
    const result = rule(input);
    if (!result.passed) {
      errors.push(`error ${result.reason}`);
    }
  });
  return errors;
};

const SUNDAY = 0;
const SATURDAY = 6;
const MONDAY = 1;

describe('verifier2 - dummy object', () => {
  test('on weekends, throws exceptions', () => {
    expect(() => verifyPassword2('anything', [], SUNDAY)).toThrow(
      "It's the weekend!"
    );
  });
});
```

把 `currentDay` 參數化總共有三個意義：

1. 這樣設計功能會讓撰寫單元測試比較簡單
2. 我們使用「依賴反轉（dependency inversion）」的概念來重構這個功能
3. 現在 `verifyPassword2` 是個純函數（pure function）了

#### Dependency inversion (D from SOLID)

[中文維基](https://zh.wikipedia.org/zh-tw/%E4%BE%9D%E8%B5%96%E5%8F%8D%E8%BD%AC%E5%8E%9F%E5%88%99)翻譯為「依賴反轉」。核心概念是：高層次的模組**不依賴**低層次模組的實作細節——依賴關係被反轉——反該由低層次模組配合高層次模組的抽象需求。終極目標是**解除模組之間的耦合**。

#### Pure function

[維基百科](https://en.wikipedia.org/wiki/Pure_function)的定義如下：

1. 此功能的回傳值只受參數影響——如果參數沒變，回傳值就不會變
2. 此功能不會產生副作用（side effects），不會影響到它範圍外的任何東西

### 3.3.2 Dependencies, injections, and control

整理到目前為止出現的一些名詞與其定義：

- 依賴（dependency）：一個單元中無法或很難控制（control）的部分
- 控制（control）：在本書指的是「影響依賴的行為」。以 `verifyPassword` 為例，我們無法控制變數 `dayOfWeek` 的值。然而在 `verifyPassword2` 中，我們能透過參數 `currentDay` 來決定要提供什麼樣的日期資訊
- 控制反轉（inversion of control）：當我們將 `verifyPassword` 改寫為 `verifyPassword2` 時，就是透過參數注入（parameter injection）來將控制權從功能中反轉出來
- 依賴注入（dependency injection）：指透過介面（design interface）來為一個單元提供依賴。以 `verifyPassword2` 為例，我們透過「參數」這個介面來注入依賴
- 接縫（seam）：指那些能注入依賴的部位。以 `verifyPassword2` 為例，此功能的接縫就是它的參數 `currentDay`。接縫會大幅影響單元測試的可讀性與維護性——畢竟越容易控制一個單元的行為，就能越輕鬆地為各種使用情境撰寫測試。另外，當一個有接縫的功能被修改時，調整它的單元測試也會比較容易

> The easier it is to change and inject behavior (or custom data) into the code under test, the easier it will be to write, read and later on maintain the test as the production code changes.

## 3.4 Functional injection techniques

除了透過參數傳入依賴外，也可透過傳入功能，或是將原先的 `verifyPassword` 柯里化（currying）來避免把依賴寫死在功能中。

> Factory functions are functions that return other functions, **pre-configured with some context**. In the above case, the contexts are **the list of rules** and **the current day function**.

以下列 snippet 為例，我們將原本的密碼驗證功能拆成「產生驗證功能」與「密碼驗證」兩階段。呼叫 `makeVerifier` 時我們需要傳入 `rules` 與 `dayOfWeekFn` 這兩項參數，而 `makeVerifier` 會回傳「已經指定好 `rules` 與 `dayOfWeekFn` 的密碼驗證功能（`theVerifier`）」。

```js
// the arrange
const SATURDAY = 6;
const SUNDAY = 0;
function makeVerifier(rules, dayOfWeekFn) {
  const theVerifier = (input) => {
    if ([SATURDAY, SUNDAY].includes(dayOfWeekFn())) {
      throw new Error("It's the weekend!");
    }

    const errors = [];
    rules.forEach((rule) => {
      const result = rule(input);
      if (!result.passed) {
        errors.push(`error ${result.reason}`);
      }
    });
    return errors;
  };
  return theVerifier;
}

describe('verifier', () => {
  test('factory method: on weekends, throws exceptions', () => {
    const alwaysSunday = () => SUNDAY;
    const verifyPassword = makeVerifier([], alwaysSunday);
    // the act and assert
    expect(() => verifyPassword('anything')).toThrow("It's the weekend!");
  });
});
```

以上重構讓單元測試變的俐落，但個人認為這波改動也降低了密碼驗證功能的可讀性。我偏向透過參數來執行依賴注入。

## 3.5 Modular injection techniques

以下是本書關於模組化注入（modular injection）的實作說明。首先，功能部分要追加 api 來允許模組注入：

```js
const originalDependencies = {
  moment: require('moment'),
};
let dependencies = { ...originalDependencies };
const inject = (fakes) => {
  Object.assign(dependencies, fakes);
  return function reset() {
    dependencies = { ...originalDependencies };
  };
};

const SUNDAY = 0;
const SATURDAY = 6;
const verifyPassword = (input, rules) => {
  const dayOfWeek = dependencies.moment().day();
  if ([SATURDAY, SUNDAY].includes(dayOfWeek)) {
    throw Error("It's the weekend!");
  }
  // more code goes here...
  // return list of errors found..
  return [];
};

module.exports = {
  SATURDAY,
  verifyPassword,
  inject,
};
```

並且測試後要復原模組狀態：

```js
const {
  inject,
  verifyPassword,
  SATURDAY,
} = require('./password-verifier-time00-modular');

const injectDate = (newDay) => {
  const reset = inject({
    moment: () => ({
      // we're faking the moment.js module's API here.
      day: () => newDay,
    }),
  });
  return reset;
};

describe('verifyPassword', () => {
  describe('when its the weekend', () => {
    it('throws an error', () => {
      const reset = injectDate(SATURDAY);
      expect(() => verifyPassword('any input')).toThrow("It's the weekend!");
      reset();
    });
  });
});
```

結論：不要自找麻煩。請選擇透過參數注入或柯里化來反轉依賴。

## 3.6 Moving towards objects with constructor functions

## 3.7 Object oriented injection techniques

### 3.7.1 Constructor injection

以下是重構為物件導向風味的 `PasswordVerifier` 功能。現在我們能透過建構子（constructor）注入依賴了：

```js
class PasswordVerifier {
  constructor(rules, dayOfWeekFn) {
    this.rules = rules;
    this.dayOfWeek = dayOfWeekFn;
  }
  verify(input) {
    if ([SATURDAY, SUNDAY].includes(this.dayOfWeek())) {
      throw new Error("It's the weekend!");
    }
    const errors = [];
    //more code goes here..
    return errors;
  }
}
```

注意——在下列單元測試中，我們都透過 `makeVerifier` 這個工廠功能（factory function）來建立驗證密碼的實例，而不是直接在每一道測試中呼叫 `new PasswordVerifier(rules, dayFn)`：

```js
const { PasswordVerifier } = require('./password-verifier');

describe('refactored with constructor', () => {
  const makeVerifier = (rules, dayFn) => {
    return new PasswordVerifier(rules, dayFn);
  };

  test('class constructor: on weekends, throws exceptions', () => {
    // arrange
    const alwaysSunday = () => 'SUNDAY';
    const verifier = makeVerifier([], alwaysSunday);
    // act and assert
    expect(() => verifier.verify('anything')).toThrow("It's the weekend!");
  });

  test('class constructor: on weekdays, with no rules, passes', () => {
    // arrange
    const alwaysMonday = () => 'MONDAY';
    const verifier = makeVerifier([], alwaysMonday);
    // act
    const result = verifier.verify('anything');
    // assert
    expect(result.length).toBe(0);
  });
});
```

多包一層工廠功能的好處是：日後即使 `PasswordVerifier` 的實作方式變了，我們也不需要逐一調整單元測試的內容，而是更新 `makeVerifier` 就好。

### 3.7.2 Injecting an object instead of a function

### 3.7.3 Extracting a common interface

除了注入功能類型的依賴外，實例本身也能作為依賴被注入。

首先我們實作了 `class PasswordVerifier`，並定義好介面 `TimeProvider`。每個試圖建立 `class PasswordVerifier` 實例的人，都必須傳入一個根據 `interface TimeProvider` 實踐（implements）的實例。

```ts
export interface TimeProvider {
  getDay(): number;
}

const SUNDAY = 0;
const SATURDAY = 6;

class PasswordVerifier {
  rules: any[];

  timeProvider: TimeProvider;

  constructor(rules: any[], timeProvider: TimeProvider) {
    this.rules = rules;
    this.timeProvider = timeProvider;
  }

  verify(input: any): string[] {
    // saturday, sunday
    if ([6, 0].includes(this.timeProvider.getDay())) {
      throw new Error("It's the weekend!");
    }
    const errors: string[] = [];
    this.rules.forEach((rule) => {
      const result = rule(input);
      if (!result.passed) {
        errors.push(`error ${result.reason}`);
      }
    });
    return errors;
  }
}
```

當我們要為 `class PasswordVerifier` 撰寫單元測試時，只要捏出一個實踐 `interface TimeProvider` 的假資料實例就好：

```ts
class FakeTimeProvider implements TimeProvider {
  fakeDay: number;

  getDay(): number {
    return this.fakeDay;
  }
}

describe('password verifier with interfaces', () => {
  test('on weekends, throws exceptions', () => {
    // arrange
    const stub = new FakeTimeProvider();
    stub.fakeDay = 0;
    const verifier = new PasswordVerifier([], stub);
    // act and assert
    expect(() => verifier.verify('anything')).toThrow("It's the weekend!");
  });
});
```

而在我們正式使用 `PasswordVerifier` 時，就搭配當下使用的函式庫實作一個「真」實例即可：

```ts
import moment from 'moment';

class RealTimeProvider implements TimeProvider {
  getDay(): number {
    return moment().day();
  }
}
```

## 參考文件

- [Manning: The Art of Unit Testing, Third Edition](https://www.manning.com/books/the-art-of-unit-testing-third-edition)
