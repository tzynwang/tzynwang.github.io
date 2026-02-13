---
title: 閱讀筆記：The Art of Unit Testing Chapter 4 Interaction testing using mock objects
date: 2023-12-28 20:04:09
tag:
  - [Testing]
banner: /2023/the-art-of-unit-testing-ch4-interaction-testing-using-mock-objects/izzad-syah-JF34nJycWCo-unsplash.jpg
summary: 這章定義了何謂互動測試（interaction testing），以及我們如何透過 mock 來測試那些呼叫（出走型）依賴的單元。
draft:
---

## 4.1 Interaction testing, mocks, and stubs

> 互動測試（interaction testing）：測試一個單元如何與其依賴（dependency）進行互動。互動指的是該依賴是否有被呼叫、單元是否有提供正確的參數給該依賴。

一個單元的退出點如果呼叫了依賴，我們就需要在單元測試中使用 mock 來確認：

1. 該依賴是否有被呼叫
2. 該依賴是否有被傳入預期的參數

### (原 4.4) The importance of differentiating between mocks and stubs

![mocks and stubs](/2023/the-art-of-unit-testing-ch4-interaction-testing-using-mock-objects/mocks-and-stubs.png)

在執行單元測試時，分清楚 stub 與 mock 是非常重要的。stub 負責在測試中提供資料給單元，而 mock 在測試時扮演的是單元的退出點（exit point）。因此：

> 一個單元測試可以有複數個 stubs，但只該有一個 mock。

Assertion Roulette 一詞就是在形容「一個單元測試同時驗證多個 mocks，導致測試失敗時不知道究竟是哪邊出錯」。這樣的單元測試無法讓人信賴，也不能正確反應單元的潛在問題。

請務必留意：一個單元測試就只檢驗一個 mock。

## 4.2 Depending on a logger

以下是本章會使用到的範例功能。這一版的 `verifyPassword` 包含「回傳值」與「呼叫依賴」這兩類退出點：

```js
const log = require("./complicated-logger");

const verifyPassword = (input, rules) => {
  const failed = rules
    .map((rule) => rule(input))
    .filter((result) => result === false);

  if (failed.length === 0) {
    log.info("PASSED"); // exit point: call 3rd dependency
    return true; // exit point: return value
  }

  log.info("FAIL"); // exit point: call 3rd dependency
  return false; // exit point: return value
};
```

![password verifier exit point calls 3rd dependency](/2023/the-art-of-unit-testing-ch4-interaction-testing-using-mock-objects/password-verifier-exit-point-calls-3rd-dependency.png)

目前依賴（`log`）是被寫死在功能裡面的，我們需要創造一些接縫（seam）來控制這些依賴。

## 4.3 Standard style: introduce parameter refactoring

第一種接縫：透過參數 `logger` 將依賴傳入 `verifyPassword2`。現在我們能將任何形式的 logger 提供給這個功能——除了 mock 外，也能自由替換實作 logger 的第三方套件。

```js
const verifyPassword2 = (input, rules, logger) => {
  const failed = rules
    .map((rule) => rule(input))
    .filter((result) => result === false);

  if (failed.length === 0) {
    logger.info("PASSED");
    return true;
  }

  logger.info("FAIL");
  return false;
};
```

在執行單元測試時，我們透過檢查 mock `mockLog` 的內容是否符合預期，來確認參數 `logger` 是否有被正確呼叫。

```js
describe("password verifier with logger", () => {
  describe("when all rules pass", () => {
    it("calls the logger with PASSED", () => {
      // arrange
      let written = "";
      const mockLog = {
        info: (text) => {
          written = text;
        },
      };
      // act
      verifyPassword2("anything", [], mockLog);
      // assert
      expect(written).toMatch(/PASSED/);
    });
  });
});
```

我們特意將假功能命名為 `mockLog`，目的是讓閱讀測試的人能意識到「這個 mock 接下來應該要被驗證（assert）」。

> I use this naming convention because I want you (as a reader of the test) to know that you should **expect an assert against that mock** at the end of the test.

## 4.5 Modular-style mocks

第二種接縫：透過額外暴露 api 來注入依賴。實作方式基本上與本書第三章第五節類似。首先看到原版功能：

```js
const { info, debug } = require("./complicated-logger");
const { getLogLevel } = require("./configuration-service");

const log = (text) => {
  if (getLogLevel() === "info") {
    info(text);
  }
  if (getLogLevel() === "debug") {
    debug(text);
  }
};

const verifyPassword = (input, rules) => {
  const failed = rules
    .map((rule) => rule(input))
    .filter((result) => result === false);
  if (failed.length === 0) {
    log("PASSED");
    return true;
  }
  log("FAIL");
  return false;
};

module.exports = {
  verifyPassword,
};
```

在追加 `injectDependencies` `resetDependencies` 後，即可在單元測試中注入 mock 依賴：

```js
const originalDependencies = {
  log: require("./complicated-logger"),
};
let dependencies = { ...originalDependencies };
const resetDependencies = () => {
  dependencies = { ...originalDependencies };
};
const injectDependencies = (fakes) => {
  Object.assign(dependencies, fakes);
};

const verifyPassword = (input, rules) => {
  const failed = rules
    .map((rule) => rule(input))
    .filter((result) => result === false);
  if (failed.length === 0) {
    dependencies.log.info("PASSED");
    return true;
  }
  dependencies.log.info("FAIL");
  return false;
};

module.exports = {
  verifyPassword,
  injectDependencies,
  resetDependencies,
};
```

```js
const {
  verifyPassword,
  injectDependencies,
  resetDependencies,
} = require("./password-verifier-injectable");

describe("password verifier", () => {
  afterEach(resetDependencies);
  describe("given logger and passing scenario", () => {
    it("calls the logger with PASS", () => {
      // arrange
      let logged = "";
      const mockLog = { info: (text) => (logged = text) };
      injectDependencies({ log: mockLog });
      // act
      verifyPassword("anything", []);
      // assert
      expect(logged).toMatch(/PASSED/);
      resetDependencies();
    });
  });
});
```

記得最後要執行 `resetDependencies()` 將依賴還原為預設狀態。結束。

## 4.6 Mocks in a functional style

第三種接縫：使用柯里化（currying）或高階函式（higher order function）的概念來傳入依賴。

使用 `lodash/curry` 實作的柯里化版本：

```js
import curry from "lodash/curry";

const curriedVerifyPassword = curry((rules, logger, input) => {
  const failed = rules
    .map((rule) => rule(input))
    .filter((result) => result === false);
  if (failed.length === 0) {
    logger.info("PASSED");
    return true;
  }
  logger.info("FAIL");
  return false;
});

describe("password verifier", () => {
  describe("given logger and passing scenario", () => {
    it("calls the logger with PASS", () => {
      // arrange
      let logged = "";
      const mockLog = {
        info: (text) => {
          logged = text;
        },
      };
      const verifierWithLogger = curriedVerifyPassword([], mockLog);
      // act
      verifierWithLogger("any input");
      // assert
      expect(logged).toMatch(/PASSED/);
    });
  });
});
```

以高階函式概念實作的版本：

```js
const makeVerifier = (rules, logger) => {
  return (input) => {
    const failed = rules
      .map((rule) => rule(input))
      .filter((result) => result === false);
    if (failed.length === 0) {
      logger.info("PASSED");
      return true;
    }
    logger.info("FAIL");
    return false;
  };
};

describe("higher order factory functions", () => {
  describe("password verifier", () => {
    test("given logger and passing scenario", () => {
      // arrange
      let logged = "";
      const mockLog = {
        info: (text) => {
          logged = text;
        },
      };
      const verifier = makeVerifier([], mockLog);
      // act
      verifier("any input");
      // assert
      expect(logged).toMatch(/PASSED/);
    });
  });
});
```

說真的，從撰寫單元測試的角度來看，這兩種實作方式沒有太大區分。它們都能製造接縫來讓使用者傳入測試用的 mock logger。

## 4.7 Mocks in an object-oriented style

如果是物件導向風格的程式碼，我們還能找出第四種接縫——那就是建構子的參數。我們還能透過 TypeScript 來要求使用者傳入符合型別定義的 logger：

```ts
interface Logger {
  info: (text: string) => void;
}

class PasswordVerifier {
  #rules: any[];
  #logger: Logger;

  constructor(rules: any[], logger: Logger) {
    this.#rules = rules;
    this.#logger = logger;
  }

  verify(input: string) {
    const failed = this.#rules
      .map((rule) => rule(input))
      .filter((result) => result === false);
    if (failed.length === 0) {
      this.#logger.info("PASSED");
      return true;
    }
    this.#logger.info("FAIL");
    return false;
  }
}

class FakeLogger implements Logger {
  text: string = "";

  info(text: string) {
    this.text = text;
  }
}

describe("PasswordVerifier", () => {
  test("with empty rule, should log `PASSED`", () => {
    // arrange
    const MockLogger = new FakeLogger();
    const VerifierInstance = new PasswordVerifier([], MockLogger);
    // act
    VerifierInstance.verify("any input");
    // assert
    expect(MockLogger.text).toMatch(/PASS/);
  });
});
```

### 多型 polymorphism

以上方範例而言，當我們定義好 `interface Logger`，其他使用者就不需要知道某物件的實作細節，只知道如果它根據 `interface Logger` 實作，該物件就能搭配 `class PasswordVerifier` 使用——這就是「多型（polymorphism）」帶來的好處。

> Polymorphism allowing one or more objects to be **replaceable** with one another as long as they **implement the same interface**.

## 4.8 Dealing with complicated interfaces

跟上方範例使用的 `interface Logger` 比起來，下列的 `ComplicatedLogger` 介面明顯複雜許多。不但擴充為四組功能，且一個功能還可能需要接收複數個參數：

```ts
interface ComplicatedLogger {
  info: (text: string) => void;
  debug: (text: string, obj: any) => void;
  warn: (text: string) => void;
  error: (text: string, location: string, stacktrace: string) => void;
}
```

為這類複雜介面進行單元測試時，可以考慮採用介面隔離原則（interface segregation principle, ISP）來擷取「需要的部分」就好。

### Interface segregation principle (I from SOLID)

意思是「面對一個介面時，只取用當下需要的部分」。[中文維基](https://zh.wikipedia.org/zh-tw/%E6%8E%A5%E5%8F%A3%E9%9A%94%E7%A6%BB%E5%8E%9F%E5%88%99)指出此原則的最終目的是為了**幫助解除耦合**。

> ISP means that if you have an interface that contains more functionality than you require, **create a small, simpler, adapter interface that contains just the functionality you need**, preferably with fewer functions, better names, and fewer parameters.

### 實作方式

接下來會搭配下方的 snippet 解說實作方式。首先我們會看到 `class RealLogger` 根據 `interface ComplicatedLogger` 實作了四種 log 功能。而在建構 `class PasswordVerifier2` 時，我們需要傳入型別為 `interface ComplicatedLogger` 的 logger 作為參數：

```ts
class RealLogger implements ComplicatedLogger {
  infoWritten = "";
  debugWritten = "";
  errorWritten = "";
  warnWritten = "";

  info(text: string) {
    this.infoWritten = text;
  }
  debug(text: string, obj: any) {
    this.debugWritten = text;
  }
  warn(text: string) {
    this.warnWritten = text;
  }
  error(text: string, location: string, stacktrace: string) {
    this.errorWritten = text;
  }
}

class PasswordVerifier2 {
  #rules: any[];
  #logger: ComplicatedLogger;

  constructor(rules: any[], logger: ComplicatedLogger) {
    this.#rules = rules;
    this.#logger = logger;
  }

  verify(input: string) {
    const failed = this.#rules
      .map((rule) => rule(input))
      .filter((result) => result === false);
    if (failed.length === 0) {
      this.#logger.info("PASSED");
      return true;
    }
    this.#logger.info("FAIL");
    return false;
  }
}
```

當我們想測試「執行 `class PasswordVerifier2` 的 `verify()` 後，此功能的 `this.#logger.info()` 是否有被呼叫」時，可以透過 `extends RealLogger` 的方式來做出「一部分是假資料的實例」：

```ts
class FakeComplicatedLogger extends RealLogger {
  fakeInfo = "";
  info(text: string) {
    this.fakeInfo = text;
  }
}

describe("PasswordVerifier2", () => {
  test("with empty rule, logger.info should log `PASSED`", () => {
    // arrange
    const MockLogInstance = new FakeComplicatedLogger();
    const VerifierInstance = new PasswordVerifier2([], MockLogInstance);
    // act
    VerifierInstance.verify("any input");
    // assert
    expect(MockLogInstance.info).toMatch(/PASSED/);
  });
});
```

我們運用介面隔離原則（ISP）的概念，只實作了測試會用到的假 `info()` 功能。其餘的 logger 功能不在我們的測試範圍內，可以不用理會它們。

這是一種被稱為「提煉與覆蓋（Extract & Override）」的技巧，適合拿來對付 legacy code。

## bonus: mock by `jest.mock()`

最後來示範一下如何透過 `jest.mock()` 在不修改既有實作（這次可沒有接縫）的情況下測試「退出點包含呼叫依賴」的功能。首先回到第一版的 `verifyPassword`：

```js
const log = require("some-3rd-party-lib");

const verifyPassword = (input, rules) => {
  const failed = rules
    .map((rule) => rule(input))
    .filter((result) => result === false);

  if (failed.length === 0) {
    log.info("PASSED");
    return true;
  }

  log.info("FAIL");
  return false;
};

module.exports = verifyPassword;
```

在執行單元測試的檔案中，我們先透過 `jest.mock()` 將外部套件 `some-3rd-party-lib` 的 `log.info()` 覆蓋為 `jest.fn()`。接著在單元測試裡確認 `log.info()` 是否有被呼叫，且傳入的參數為 `PASSED`。完整程式碼如下：

```js
// arrange
jest.mock("some-3rd-party-lib", () => ({
  info: jest.fn(),
}));

const log = require("some-3rd-party-lib");
const verifyPassword = require("./verifyPassword");

describe("verifyPassword", () => {
  it("with any input and empty rule, should call log.info with PASSED", () => {
    // act
    verifyPassword("any input", []);
    // assert
    expect(log.info).toHaveBeenCalledWith("PASSED");
  });
});
```

首先呼叫 `jest.mock()`，傳入的第一個參數是「我們想要 mock 的模組」。第二個參數則是工廠功能，我們會在這裡用 `jest.fn()` 來覆蓋 `some-3rd-party-lib` 的 `log.info()`——代表接下來執行單元測試時，我們呼叫的其實是 jest 的假功能。

並且，因為原版的 `log.info()` 作用也只是「在終端輸出內容」，沒有其他任務（回傳值什麼的），所以我們也不用對 `jest.fn()` 提供實作細節（mock implementation）。如果你要 mock 的功能比較複雜，可以參考官方文件 [jest.mock(moduleName, factory, options)](https://jestjs.io/docs/jest-object#jestmockmodulename-factory-options) 與 [jest.fn(implementation?)](https://jestjs.io/docs/jest-object#jestfnimplementation) 的範例。

最後在執行單元測試時，我們透過 `expect(log.info).toHaveBeenCalledWith("PASSED");` 來驗證 `log.info()` 是否有被呼叫，且被傳入參數 `PASSED`。

以上就是在不修改現行功能的情況下，以 `jest.mock()` 來幫忙測試第三種退出點（呼叫依賴）的方法。

## 參考文件

- [Manning: The Art of Unit Testing, Third Edition](https://www.manning.com/books/the-art-of-unit-testing-third-edition)
