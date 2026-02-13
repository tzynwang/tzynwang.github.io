---
title: 閱讀筆記：The Art of Unit Testing Chapter 6 Unit testing asynchronous code
date: 2024-01-14 18:26:23
tag:
  - [Testing]
banner: /2024/the-art-of-unit-testing-ch6-unit-testing-asynchronous-code/age-barros-rBPOfVqROzY-unsplash.jpg
summary: 本章提供兩種實作技巧讓我們能為「包含非同步功能」的單元寫出良好的單元測試，其為「分離進入點（extracting an entry point）」與「配接器模式（adapter pattern）」
draft:
---

## intro

還記得依賴（dependency）的定義嗎？所有無法、很難控制的要素都是依賴，所以非同步功能（async function）自然也是一種依賴——畢竟我們無法控制非同步功能的完成時間。

有鑒於此不可控性，本章提供兩種實作技巧來讓我們寫出良好的單元測試：

1. 分離進入點（extracting an entry point）
2. 採用配接器模式（adapter pattern）分離非同步的部分

## 6.1 Dealing with async data fetching

非同步功能為單元測試帶來的困擾是——產生結果所需的時間、結果是成功或失敗——這些都是我們無法控制的部分。以下方的 `isWebsiteAlive` 為例：

```js
const fetch = require("node-fetch");

const isWebsiteAlive = async () => {
  try {
    const resp = await fetch("http://example.com");
    if (!resp.ok) {
      // exit point 1
      throw resp.statusText;
    }
    const text = await resp.text();
    if (text.includes("illustrative")) {
      // exit point 2
      return { success: true, status: "ok" };
    }
    // exit point 3
    throw "text missing";
  } catch (err) {
    // exit point 4
    return { success: false, status: err };
  }
};
```

1. 我們無法控制 `await fetch("http://example.com")` 何時回應，測試可能變得耗時
2. 我們無法控制 `http://example.com` 這個服務是否在線上 ，執行測試時，我們無法控制要進入哪一個退出點
3. 承上，因為無法控制網站的上線與否，當測試亮紅燈時，我們要檢查到底是網站掛掉，還是測試壞掉——多來幾次以後，我們就不再信賴這個測試，也不會信任執行結果了

綜上所述，為了能寫出穩固、能全心信賴的單元測試，在實作功能時請透過以下技巧製造**接縫**（seam，可複習[第三章的筆記](/2023/the-art-of-unit-testing-ch3-breaking-dependencies-with-stubs#332-dependencies-injections-and-control)）：

1. 分離進入點（extracting and entry point）：意思是把一個單元裡「純邏輯」的部分獨立成一個功能，並把這個功能當成新的進入點，對其執行單元測試
2. 採用配接器模式（adapter patter）：工程師只要遵守定義好的介面，就能替換掉非同步的部分

## 6.2 Making our code unit-test friendly

### Extracting an entry point

我們可以將 `isWebsiteAlive` 裡，只進行邏輯判斷（純）的部份抽出（`throwIfResponseNotOK` / `processFetchContent` / `processFetchError`）：

```js
const fetch = require("node-fetch");

const throwIfResponseNotOK = (resp) => {
  if (!resp.ok) {
    throw resp.statusText;
  }
};
const processFetchContent = (text) => {
  const included = text.includes("illustrative");
  if (included) {
    return { success: true, status: "ok" };
  }
  return { success: false, status: "missing text" };
};
const processFetchError = (err) => {
  return { success: false, status: err };
};

// Await version
const isWebsiteAlive = async () => {
  try {
    const resp = await fetch("http://example.com");
    // exit point 1
    throwIfResponseNotOK(resp);
    const text = await resp.text();
    // exit point 2
    return processFetchContent(text);
  } catch (err) {
    // exit point 3
    return processFetchError(err);
  }
};
```

雖然我們依舊無法控制 `const resp = await fetch("http://example.com");` 的結果，但能透過單元測試確保「這三個新單元會根據 `resp` 內容採取正確的行動」：

```js
describe("throwIfResponseNotOK", () => {
  it("should not throw an error if response is ok", () => {
    const response = { ok: true };
    expect(() => throwIfResponseNotOK(response)).not.toThrow();
  });
  it("should throw an error with response status text if response is not ok", () => {
    const response = { ok: false, statusText: "Not Found" };
    expect(() => throwIfResponseNotOK(response)).toThrowError("Not Found");
  });
});

describe("processFetchContent", () => {
  it("should return success true and status 'ok' when text includes 'illustrative'", () => {
    const text = "This is illustrative content";
    expect(processFetchContent(text)).toEqual({
      //
      success: true,
      status: "ok",
    });
  });
  it("should return success false and status 'missing text' when text does not include 'illustrative'", () => {
    const text = "Some random content";
    expect(processFetchContent(text)).toEqual({
      //
      success: false,
      status: "missing text",
    });
  });
});

describe("processFetchError", () => {
  test("should return an object with success false and provided error message", () => {
    const errorMessage = "Failed to fetch";
    expect(processFetchError(errorMessage)).toEqual({
      success: false,
      status: "Failed to fetch",
    });
  });
});
```

以上就是用「分離進入點」的概念重構 `isWebsiteAlive`，以便提升測試覆蓋率的方法。

### Extract adapter pattern

配接器模式說白了，就是把「呼叫非同步功能的介面」與「功能的實作方式」分開來。這種設計的好處是，我們能在測試時使用同步（synchronous）的假模組、假功能、假實例。

#### module solution

第一種作法：以模組作為介面，把非同步功能獨立到另一包檔案中。

比如把 `isWebsiteAlive` 中的 `await fetch` 拆進 `network.js` 中，變成一個獨立的功能 `fetchUrlText`。剩下的就留在 `index.js` 裡：

```js
// network.js
const fetchUrlText = async (url) => {
  const resp = await fetch(url);
  if (resp.ok) {
    const text = await resp.text();
    return { ok: true, text: text };
  }
  return { ok: false, text: resp.statusText };
};
```

```js
// index.js
const { fetchUrlText } = require("./network");

const processFetchSuccess = (text) => {
  const included = text.includes("illustrative");
  if (included) {
    return { success: true, status: "ok" };
  }
  return { success: false, status: "missing text" };
};

const processFetchFail = (err) => {
  return { success: false, status: err };
};

const isWebsiteAlive = async () => {
  try {
    const result = await fetchUrlText("http://example.com");
    if (!result.ok) {
      return processFetchFail(result.text);
    }
    const text = result.text;
    return processFetchSuccess(text);
  } catch (err) {
    throw new Error(err);
  }
};
```

在測試 `isWebsiteAlive` 時，我們就能透過 `jest.mock()` 與 `.mockResolvedValue()` 控制非同步功能 `fetchUrlText()` 回傳的值，進而決定我們在每一個單元測試中要通過哪一個退出點：

```js
jest.mock("./network");

const stub = require("./network");
const { isWebsiteAlive } = require("./index");

describe("isWebsiteAlive", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should return success: true, status: ok when fetchUrlText returns ok and text include `illustrative`", async () => {
    // arrange
    stub.fetchUrlText.mockResolvedValue({
      ok: true,
      text: "This is illustrative text",
    });
    // act
    const result = await isWebsiteAlive();
    // assert
    expect(result).toEqual({ success: true, status: "ok" });
  });
  it("should return success: false, status: missing text when fetchUrlText returns ok but text not include `illustrative`", async () => {
    // arrange
    stub.fetchUrlText.mockResolvedValue({
      ok: true,
      text: "Some random text",
    });
    // act
    const result = await isWebsiteAlive();
    // assert
    expect(result).toEqual({ success: false, status: "missing text" });
  });
  it("should throw success: false and status with error text when fetchUrlText return ok: false", async () => {
    // arrange
    stub.fetchUrlText.mockResolvedValue({
      ok: false,
      text: "Failed to fetch",
    });
    // act
    const result = await isWebsiteAlive();
    // assert
    expect(result).toEqual({ success: false, status: "Failed to fetch" });
  });
});
```

#### function parameter solution

第二種作法：以參數作為介面來傳入非同步功能——這樣在測試時，我們就能透過參數傳入假的同步功能。

比如以下重構後的 `isWebsiteAlive` 就允許我們透過參數注入 `fetchUrlText()`：

```js
const processFetchSuccess = (text) => {
  const included = text.includes("illustrative");
  if (included) {
    return { success: true, status: "ok" };
  }
  return { success: false, status: "missing text" };
};

const processFetchFail = (err) => {
  return { success: false, status: err };
};

const isWebsiteAlive = async (fetchUrlText) => {
  const result = await fetchUrlText("http://exa-mple.com");
  if (!result.ok) {
    return processFetchFail(result.text);
  }
  const text = result.text;
  return processFetchSuccess(text);
};
```

在撰寫測試時，就能透過工廠功能 `getStubResult()` 控制環境了：

```js
const { isWebsiteAlive } = require("./index");

// arrange
const getStubResult = (ok, text) => () => ({
  ok,
  text,
});

describe("isWebsiteAlive", () => {
  it("should return success: true, status: ok when fetchUrlText returns ok and text include `illustrative`", async () => {
    // act
    const result = await isWebsiteAlive(
      getStubResult(true, "This is illustrative text"),
    );
    // assert
    expect(result).toEqual({ success: true, status: "ok" });
  });
  it("should return success: false, status: missing text when fetchUrlText returns ok but text not include `illustrative`", async () => {
    // act
    const result = await isWebsiteAlive(
      getStubResult(true, "Some random text"),
    );
    // assert
    expect(result).toEqual({ success: false, status: "missing text" });
  });
  it("should throw success: false and status with error text when fetchUrlText return ok: false", async () => {
    // act
    const result = await isWebsiteAlive(
      getStubResult(false, "Failed to fetch"),
    );
    // assert
    expect(result).toEqual({ success: false, status: "Failed to fetch" });
  });
});
```

#### interface based solution

第三種作法：以物件導向風格進行開發時，可以透過定義介面（interface）來分離實作細節——當我們想為該單元撰寫測試時，只要根據介面規則實作假實例即可。

以 `WebsiteVerifier` 為例，我們會定義以下三種介面：

```ts
export interface FetchAdapter {
  fetchUrlText(url: string): Promise<FetchResult>;
}

export type FetchResult = {
  ok: boolean;
  text: string;
};

export type WebsiteAliveResult = {
  success: boolean;
  status: string;
};
```

在正式環境裡，我們會根據 `FetchAdapter` 實作一個「真」的 `NetworkAdapter` 實例，並在建構 `class WebsiteVerifier` 時，傳入這個 `NetworkAdapter` 作為參數：

```ts
import type { FetchAdapter, FetchResult } from "./types";

export class NetworkAdapter implements FetchAdapter {
  async fetchUrlText(url: string): Promise<FetchResult> {
    const resp = await fetch(url);
    if (resp.ok) {
      const text = await resp.text();
      return { ok: true, text: text };
    }
    return { ok: false, text: resp.statusText };
  }
}
```

```ts
import type { FetchAdapter, WebsiteAliveResult } from "./types";

export class WebsiteVerifier {
  network: FetchAdapter;

  constructor(network: FetchAdapter) {
    this.network = network;
  }

  isWebsiteAlive = async (): Promise<WebsiteAliveResult> => {
    try {
      const result = await this.network.fetchUrlText("http://example.com");
      return result.ok
        ? this.processFetchSuccess(result.text)
        : this.processFetchFail(result.text);
    } catch (err: any) {
      throw new Error(err);
    }
  };

  processFetchSuccess = (text: string): WebsiteAliveResult => {
    const included = text.includes("illustrative");
    return included
      ? { success: true, status: "ok" }
      : { success: false, status: "missing text" };
  };

  processFetchFail = (err: any): WebsiteAliveResult => {
    return { success: false, status: err };
  };
}
```

但是——在為 `class WebsiteVerifier` 寫測試時，我們大可直接根據 `interface FetchAdapter` 實作一個測試專用的 `StubNetworkAdapter` 來控制 `fetchUrlText()` 的回傳結果，進而為所有的情境撰寫對應測試：

```ts
import type { FetchAdapter, FetchResult } from "./types";
import { describe, it, expect } from "@jest/globals";
import { WebsiteVerifier } from "./index";

class StubNetworkAdapter implements FetchAdapter {
  ok: boolean;
  text: string;

  constructor(ok: boolean, text: string) {
    this.ok = ok;
    this.text = text;
  }

  fetchUrlText(): Promise<FetchResult> {
    return this.ok
      ? Promise.resolve({ ok: this.ok, text: this.text })
      : Promise.reject(new Error(this.text));
  }
}

const getVerifierWithStubAdapter = (
  ok: boolean,
  text: string,
): WebsiteVerifier => {
  const stubAdapter = new StubNetworkAdapter(ok, text);
  return new WebsiteVerifier(stubAdapter);
};

describe("WebsiteVerifier", () => {
  it("should return success: true, status: ok when fetchUrlText returns ok and text include `illustrative`", async () => {
    // arrange
    const verifier = getVerifierWithStubAdapter(
      true,
      "This is illustrative text",
    );
    // act
    const result = await verifier.isWebsiteAlive();
    // assert
    expect(result).toEqual({ success: true, status: "ok" });
  });
  it("should return success: false, status: missing text when fetchUrlText returns ok but text not include `illustrative`", async () => {
    // arrange
    const verifier = getVerifierWithStubAdapter(true, "Some random text");
    // act
    const result = await verifier.isWebsiteAlive();
    // assert
    expect(result).toEqual({ success: false, status: "missing text" });
  });
  it("should throw success: false and status with error text when fetchUrlText return ok: false", async () => {
    // arrange
    const verifier = getVerifierWithStubAdapter(false, "Failed to fetch");
    try {
      // act
      await verifier.isWebsiteAlive();
    } catch (e: any) {
      // assert
      expect(e.message).toMatch(/Failed to fetch/);
    }
  });
});
```

我們甚至不需要 jest 的隔離 api 就能搞定所有退出點的單元測試 👍

## 6.3 Dealing with timers

在給有計時器（timer）的單元寫測試時，可以考慮以猴子補丁（monkey patch）或直接借用 jest api 來化解 `setTimeout()` / `setInterval()` 的非同步特徵。

### Monkey patching

猴子補丁（monkey patch）指的是工程師能在執行一段程式時，「動態地修改其功能」的行為。此修改的影響是一時而非永久。

> Monkey patching is a way for a program **to extend or modify supporting system software locally** (affecting only the running instance of the program).

當我們在給呼叫計時器的單元寫測試時，可以運用猴子補丁技巧來暫時修改 `setTimeout()` 的行為，並且在測試結束後將它回復原狀。

比如以下範例，我們在測試時暫時移除了 `setTimeout()` 的非同步特性，並在測試結束後執行復原：

```js
const calculate1 = (x, y, resultCallback) => {
  setTimeout(() => {
    resultCallback(x + y);
  }, 1000);
};

describe("calculate1", () => {
  describe("in monkey patching style", () => {
    // arrange
    let originalTimeOut;
    beforeEach(() => {
      originalTimeOut = setTimeout;
      setTimeout = (cb) => cb();
    });
    afterEach(() => (setTimeout = originalTimeOut));

    it("should return calculate result after 1 second", () => {
      // act, assert
      calculate1(1, 2, (result) => expect(result).toBe(3));
    });
  });
});
```

### Faking timer with Jest

Jest 提供隔離 api `useFakeTimers()` / `useRealTimers()` 來讓工程師決定要在測試時使用假或真的計時器。如果我們想讓測試儘速執行完畢，可選擇呼叫 `useFakeTimers()` 讓 Jest 來覆蓋計時器的預設行為。

#### for `setTimeout()`

以下列 snippet 為例，我們讓 Jest 控制計時器後，不需要「真的等待一秒過去」才能看到單元執行完畢。想驗證 `setTimeout()` 是否有如期被呼叫，也能搭配 `toHaveBeenCalledTimes()` 來進行驗證：

```js
const { calculate1 } = require("./index");

describe("calculate1", () => {
  describe("in jest isolation api style", () => {
    // arrange
    beforeEach(() => {
      jest.clearAllTimers();
      jest.useFakeTimers();
    });
    it("should return calculate result", () => {
      // act, assert
      calculate1(1, 2, (result) => expect(result).toBe(3));
    });
    it("should call setTimeout once", () => {
      // arrange
      jest.spyOn(global, "setTimeout");
      // act
      calculate1(1, 2);
      // assert
      expect(setTimeout).toHaveBeenCalledTimes(1);
    });
  });
});
```

#### for `setInterval()`

當單元包含 `setInterval()` 時，可搭配 `jest.advanceTimersToNextTimer()` 來推進計時器。在下列範例中，我們對 `jest.advanceTimersToNextTimer()` 傳入參數 `2`，代表計時器要被觸發兩次——因此 `results` 也該出現兩組結果：

```js
const calculate2 = (getInputsFn, resultFn) => {
  setInterval(() => {
    const { x, y } = getInputsFn();
    resultFn(x + y);
  }, 1000);
};

describe("calculate2", () => {
  beforeEach(() => {
    jest.clearAllTimers();
    jest.useFakeTimers();
  });
  it("should execute getInputsFn/resultFn at interval", () => {
    // arrange
    let xInput = 1;
    let yInput = 2;
    const results = [];
    const resultFn = (r) => results.push(r);
    const inputFn = () => ({ x: xInput++, y: yInput++ });

    // act
    calculate2(inputFn, resultFn);
    jest.advanceTimersToNextTimer(2);

    // assert
    expect(results[0]).toBe(3);
    expect(results[1]).toBe(5);
  });
});
```

## 6.4 Dealing with common events

📢 溫馨提示：為了順利執行下列測試，請記得安裝 `jest-environment-jsdom`，因為此套件[在 Jest 28 以後不再是預設安裝內容](https://jestjs.io/blog/2022/04/25/jest-28#jsdom-19)。

```bash
Error: ...
As of Jest 28 "jsdom" is no longer shipped by default, make sure to install it separately.
```

另外，在 Jest 28 以後也支援「[指定個別測試檔案的環境](https://jestjs.io/blog/2022/04/25/jest-28#inline-testenvironmentoptions)」。過去只能透過 `jest.config` 中的 `testEnvironment` 為所有的測試指定一種環境（`node` 或 `jsdom`）。而現在，我們能在「需要操作 DOM 的測試檔案」加入下方註解來指定該檔案的測試環境：

```js
/**
 * @jest-environment jsdom
 */
```

### Dealing with event emitters

想測試一個包含 `window.dispatchEvent()` 的單元時，可以在 `beforeEach` 中掛載事件監聽器、在 `afterEach` 移除之，並檢查假功能 `handler` 是否有如期被呼叫。參考以下範例：

```ts
/**
 * @jest-environment jsdom
 */

const emitMessageEvent = (detail: string) => {
  const event = new CustomEvent("message", { detail });
  window.dispatchEvent(event);
};

describe("emitMessageEvent", () => {
  let handler: jest.Mock;
  beforeEach(() => {
    handler = jest.fn();
    window.addEventListener("message", handler);
  });
  afterEach(() => {
    window.removeEventListener("message", handler);
    handler.mockReset();
  });
  it("should dispatch a custom event with the correct detail", () => {
    // arrange
    const detail = "Test message";
    // act
    emitMessageEvent(detail);
    // assert
    const [event] = handler.mock.calls[0];
    expect((event as CustomEvent).detail).toBe(detail);
  });
});
```

### Dealing with click events

當我們想測試「一個 DOM 的點擊事件是否有正常運作」時，可以把重點放在「事件派送後，檢查預期結果是否出現」。

以下方 `index.html` 與 `index.js` 為例，兩者搭配起來的行為是「當使用者點擊 `id="myButton"` 按鈕後，畫面上的 `id="myResult"` 要出現 `Clicked!` 字樣」：

```html
<!-- index.html -->

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>File to Be Tested</title>
    <script src="./index.js"></script>
  </head>
  <body>
    <div>
      <h1>A simple button</h1>
      <button id="myButton">Click Me</button>
      <div id="myResult">Waiting...</div>
    </div>
  </body>
</html>
```

```js
// index.js

function onMyButtonClick() {
  const resultDiv = document.getElementById("myResult");
  resultDiv.innerText = "Clicked!";
}

window.addEventListener("load", () => {
  document
    .getElementById("myButton")
    .addEventListener("click", onMyButtonClick);
});

module.exports = {
  onMyButtonClick,
};
```

在撰寫測試時，我們可直接執行 `onMyButtonClick()`，再檢查元素 `id="myResult"` 的 `innerText` 是否有變為預期內容：

```js
/**
 * @jest-environment jsdom
 */

const fs = require("fs");
const path = require("path");
const { onMyButtonClick } = require("./index");

const setHtmlContent = () => {
  const html = fs.readFileSync(path.resolve(__dirname, "./index.html"), "utf8");
  document.documentElement.innerHTML = html;
};
const getTargetDiv = () => document.getElementById("myResult");

describe("Button click behavior", () => {
  test("myButton innerText should change after clicking", () => {
    // arrange
    setHtmlContent();
    const target = getTargetDiv();
    // act
    onMyButtonClick();
    // assert
    expect(target.innerText).toBe("Clicked!");
  });
});
```

此概念類似上方提過的「分離進入點（extracting and entry point）」，我們不一定要在測試中鉅細靡遺地重現使用者的行為，重點是**某個功能被觸發後，是否有產生預期結果**。

> What we care about is that the click has actually done something useful other than triggering.

以上便是本書第六章的筆記內容，恭喜你搞懂如何測試那些帶有非同步功能的單元了。

## 參考文件

- [Manning: The Art of Unit Testing, Third Edition](https://www.manning.com/books/the-art-of-unit-testing-third-edition)
