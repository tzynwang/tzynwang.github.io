---
title: 閱讀筆記：The Art of Unit Testing Chapter 5 Isolation frameworks
date: 2024-01-02 20:24:36
tag:
  - [Testing]
banner: /2024/the-art-of-unit-testing-ch5-isolation-frameworks/matthew-guay-vIjt8UHhSVo-unsplash.jpg
summary: 本書在第三、四章示範了不少手動處理 stub/mock 的方式，但其實我們可以透過 jest 這類有提供 isolation api 的測試框架來省掉不少人工作業。
draft:
---

## summary

本書在第三、四章示範了不少手動處理 stub/mock 的方式，但其實我們可以透過 jest 這類有提供 isolation api 的測試框架來省掉不少人工作業。

~~能理解本書作者想避免因為太輕鬆導致 stub 與 mock 被濫用，但一路看下來還是有點浪費時間。~~

## 5.1 Defining isolation frameworks

隔離框架（isolation framework）的定義如下：

> 此框架會提供 api 讓工程師定義假資料（包含 stub/mock）。稱之為「隔離」是因為它幫助我們在測試時「隔離」了某個單元的依賴。

## 5.2 Faking modules dynamically

再次見到我們的老朋友 `verifyPassword`，這個同時擁有進入型（`service`）與出走型（`logger`）依賴的單元：

```js
const service = require("./configuration-service");
const logger = require("./complicated-logger");

const log = (text) => {
  if (service.getLogLevel() === "info") {
    logger.info(text);
  }
  if (service.getLogLevel() === "debug") {
    logger.debug(text);
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
```

透過 `jest.mock()` 與 `mockFn.mockReturnValue()` 來取代 `verifyPassword` 的兩種依賴，我們省去那些在 [4 Interaction testing using mock objects#4.5 Modular-style mocks](/2023/the-art-of-unit-testing-ch4-interaction-testing-using-mock-objects#45-modular-style-mocks) 為了「暴露 api 以便注入依賴」而進行的加工：

```js
jest.mock("./configuration-service");
jest.mock("./complicated-logger");

const stubService = require("./configuration-service");
const mockLogger = require("./complicated-logger");

describe("password verifier", () => {
  afterEach(jest.resetAllMocks);
  test(`with info log level and no rules, 
  it calls the logger with PASSED`, () => {
    // arrange
    stubService.getLogLevel.mockReturnValue("info");
    // act
    verifyPassword("anything", []);
    // assert
    expect(mockLogger.info).toHaveBeenCalledWith(
      //
      expect.stringMatching(/PASS/),
    );
  });
  test(`with debug log level and no rules, 
  it calls the logger with PASSED`, () => {
    // arrange
    stubService.getLogLevel.mockReturnValue("debug");
    // act
    verifyPassword("anything", []);
    // assert
    expect(mockLogger.debug).toHaveBeenCalledWith(
      //
      expect.stringMatching(/PASS/),
    );
  });
});
```

### Consider abstracting away direct dependencies

雖然透過 `jest.mock()` 與 `mockFn.mockReturnValue()` 就能很輕鬆地在單元測試中使用 stub/mock，但還是建議工程師們盡量避免這種直接寫死依賴的實作方式。比較好的作法是多包一個抽象層來隔離「依賴」與「需要此依賴的功能」，可參考 [4 Interaction testing using mock objects#多型 polymorphism](/2023/the-art-of-unit-testing-ch4-interaction-testing-using-mock-objects#多型-polymorphism) 的概念。

多套一個抽象層的好處是：即使你依賴的套件更改它的使用方式，整包程式碼中依賴該套件的功能也不需要做什麼調整——畢竟那些功能互動的對象是你定義的介面。你唯一要做的事情，就是去更新這個抽象層呼叫套件的方法。

## 5.3 Functional mocks and stubs, dynamically

除了透過 `mockFn.mockReturnValue()` 來指定某功能的回傳值以外，我們還能將「需要被 mock 的功能」以 `jest.fn()` 覆蓋。

先回顧一下 [4 Interaction testing using mock objects#4.6 Mocks in a functional style](/2023/the-art-of-unit-testing-ch4-interaction-testing-using-mock-objects#46-mocks-in-a-functional-style) 的手動 mock 版本。我們在 `const mockLog` 中直接寫了一個假 `info` 功能，並透過驗證 `let logged` 的值來確定 `mockLog.info()` 有被順利呼叫：

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

test("given logger and passing scenario", () => {
  // arrange
  let logged = "";
  const mockLog = {
    info: (text) => {
      logged = text;
    },
  };
  const passVerify = makeVerifier([], mockLog);
  // act
  passVerify("any input");
  // assert
  expect(logged).toMatch(/PASSED/);
});
```

更簡單粗暴的作法是把 `jest.fn()` 餵進 `const mockLog` 裡，接著就能搭配 `.toHaveBeenCalledWith()` 來驗證 `mockLog.info()` 是否有被正確呼叫：

```js
test("given logger and passing scenario", () => {
  // arrange
  const mockLog = { info: jest.fn() };
  const verify = makeVerifier([], mockLog);
  // act
  verify("any input");
  expect(mockLog.info).toHaveBeenCalledWith(
    //
    expect.stringMatching(/PASS/),
  );
});
```

## 5.4 Object-oriented dynamic mocks and stubs

接下來要示範如何使用 `jest.spyOn()` 來測試擁有相對對複雜介面的單元。借用一下第四章的 `interface ComplicatedLogger` 與 `class PasswordVerifier2` 作為範例功能：

```ts
interface ComplicatedLogger {
  info: (text: string) => void;
  debug: (text: string, obj: any) => void;
  warn: (text: string) => void;
  error: (text: string, location: string, stacktrace: string) => void;
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

進行測試時，我們先呼叫 `const realLogger = new RealLogger();` 來取得 logger 實例，然後再~~注入靈魂~~透過 `const mockLoggerInfo = jest.spyOn(realLogger, "info");` 來把 `realLogger.info()` mock 起來。接著，檢查 `mockLoggerInfo` 是否有被呼叫、且被傳入參數 `PASSED` 即可：

```js
describe("PasswordVerifier2", () => {
  it('whan pass empty rule, should call logger.info with "PASSED"', () => {
    // arrange
    const realLogger = new RealLogger();
    const mockLoggerInfo = jest.spyOn(realLogger, "info");
    const verifier = new PasswordVerifier2([], realLogger);
    // act
    verifier.verify("someInput");
    // assert
    expect(mockLoggerInfo).toHaveBeenCalledWith("PASSED");
    // restore
    mockLoggerInfo.mockRestore();
  });
});
```

最後記得執行 `mockLoggerInfo.mockRestore();` 來還原被 mock 起來的 `.info()` 功能。

---

現在讓事情變得更過分一點——這個驗證密碼的實例現在追加了「檢查系統是否正在維護中」的邏輯。這個單元現在有三大組退出點：

```ts
interface MaintenanceWindow {
  isUnderMaintenance: () => boolean;
}

export class PasswordVerifier3 {
  private _rules: any[];
  private _logger: ComplicatedLogger;
  private _maintenanceWindow: MaintenanceWindow;
  constructor(
    rules: any[],
    logger: ComplicatedLogger,
    maintenanceWindow: MaintenanceWindow,
  ) {
    this._rules = rules;
    this._logger = logger;
    this._maintenanceWindow = maintenanceWindow;
  }
  verify(input: string): boolean {
    if (this._maintenanceWindow.isUnderMaintenance()) {
      // exit point set 1
      this._logger.info("Under Maintenance");
      return false;
    }
    const failed = this._rules
      .map((rule) => rule(input))
      .filter((result) => result === false);
    if (failed.length === 0) {
      // exit point set 2
      this._logger.info("PASSED");
      return true;
    }
    // exit point set 3
    this._logger.info("FAIL");
    return false;
  }
}
```

幸好這一切都還在 jest 能搞定的範圍內。我們能透過 `jest.spyOn()` 與 `.mockReturnValue()` 的組合技來限制測試環境的 `Maintainer.isUnderMaintenance()` 一定要是 `true`：

```js
describe("PasswordVerifier3", () => {
  it('when under maintenance, should call logger.info with "Under Maintenance"', () => {
    // arrange
    const realMaintainer = new Maintainer();
    const stubIsUnderMaintenance = jest.spyOn(
      realMaintainer,
      "isUnderMaintenance",
    );
    stubIsUnderMaintenance.mockReturnValue(true);
    const realLogger = new ComplicatedLog();
    const mockLoggerInfo = jest.spyOn(realLogger, "info");
    const Verifier = new PasswordVerifier3([], realLogger, realMaintainer);
    // act
    Verifier.verify("someInput");
    // assert
    expect(mockLoggerInfo).toHaveBeenCalledWith("Under Maintenance");
    // restore
    stubIsUnderMaintenance.mockRestore();
    mockLoggerInfo.mockRestore();
  });
});
```

一組單元測試又平安的過去了，感謝 jest 提供的 api 與你自己的努力。

![powerpuff-unit-test.png](/2024/the-art-of-unit-testing-ch5-isolation-frameworks/powerpuff-unit-test.png)

## 5.5 Stubbing behavior dynamically

除了透過 `.mockReturnValue()` 與 `.mockReturnValueOnce()` 來指定 stub 要回傳的內容外，還可以透過 `.mockImplementation()` 來模擬拋錯等「不是單純回傳值」的行為，比如：

```js
test("stub a function that throw error", () => {
  const stubFunc = jest.fn().mockImplementation(() => {
    throw new Error("Oops!");
  });
  expect(stubFunc()).toThrow(/oops/);
});
```

## 5.6 Advantages and traps of isolation frameworks

隔離框架讓工程師在寫單元測試時，能輕鬆搞定需要 stub/mock 的部分。但這份便利性也可能導致濫用，比如你發現自己在驗證 stub ——要記得，我們需要 stub 是為了在單元測試中固定情境（確保每次都供應相同的資料），你不需要驗證 stub 是否有被呼叫。

你甚至要確認每一組單元測試是否都在驗證必要的部分。不要因為某段程式碼「看起來可以被測試」就寫了測試。請提醒自己：單元測試要確保的是「在情境不變時，該單元在退出點產生的結果就會維持一致」，~~莫忘初衷：~~[單元測試的定義，最終版](/2023/the-art-of-unit-testing-ch1-the-basic-of-unit-testing#單元測試的定義最終版)。

如果一個測試與「確認退出點的行為是否一致」無關，那它就應該被刪掉。

## 參考文件

- [Manning: The Art of Unit Testing, Third Edition](https://www.manning.com/books/the-art-of-unit-testing-third-edition)
