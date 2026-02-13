---
title: TypeScript 工程師的基礎 SOLID 筆記
date: 2024-02-21 20:57:03
tag:
  - [clean code]
  - [Design Patterns]
banner: /2024/solid-basic-note/uve-sanchez-9DRX_cW48RQ-unsplash.jpg
summary: 最近在看《Clean Code 學派的風格實踐：開發可靠、可維護又強健的 JavaScript》，順便整理一下 SOLID 在 JS/TS 中的應用方式。
draft:
---

## 簡介

SOLID 是為了讓**物件導向程式碼**能更好懂、好維護的設計原則。而因為有些概念不太適合透過純 JavaScript 呈現，所以本篇筆記會視情況使用 JS 和 TS 來撰寫範例。

## 單一功能原則 Single responsibility principle

- 一個功能只做一件事
- 一個類別（class）只專注在一個主題上

終極目標是提高一個功能的內聚性（cohesion）。

---

雖然不在這個原則的範疇內，但功能的名稱與其行為也請維持一致，不要寫做Ａ實作Ｂ。反之，如果有段遺留程式碼（legacy code）實在很難以單一功能原則重構，則至少在功能名稱上完整描述它的行為。不要給閱讀、執行程式碼人帶來驚喜~~驚嚇~~ 🤡

## 開閉原則 Open–closed principle

一個功能應在「不改動既有程式碼」的情況下「延伸其功能」。

![Nick-Young-Confused.png](/2024/solid-basic-note/Nick-Young-Confused.png)

先看看以下範例。當我們需要新增付款方式時，必須直接調整 `handlePayment` 內容——新增一組 `case`。

```js
function handlePayment(method) {
  switch (method) {
    case "atm":
      // ...
      break;
    case "credit-card":
      // ...
      break;
    default:
    // ...
  }
}
```

而為了讓程式碼符合開閉原則，我們可以使用 TS 來進行重構。

首先定義 `abstract class PaymentHandler` 讓「負責實作付款功能的類別」都有 `method processPayment` 能呼叫：

```ts
abstract class PaymentHandler {
  abstract processPayment: () => void;
}
```

接著透過 `implements PaymentHandler` 實作出 `AtmPayment` 與 `CreditCardpayment`：

```ts
class AtmPayment implements PaymentHandler {
  processPayment() {
    // ...
  }
}

class CreditCardpayment implements PaymentHandler {
  processPayment() {
    // ...
  }
}
```

由 `enum paymentMethods` 來決定「目前允許的付款方式」，並在`class Payment` 中透過 `handlePayment` 來取得對應的付款功能：

```ts
enum paymentMethods {
  atm = "atm",
  creditCard = "creditCard",
}

type Payments = {
  [key in paymentMethods]: PaymentHandler;
};

class Payment {
  payments: Payments;

  constructor(arg: Payments) {
    this.payments = arg;
  }

  handlePayment(method: paymentMethods) {
    const fn = this.payments[method].processPayment;
    if (!fn) throw new Error(`payment method not allow::: ${method}`);
    fn();
  }
}
```

實際使用 `class Payment` 時，透過依賴注入（dependency injection）來提供「實作了各種付款方式的類別」：

```ts
const paymentHandlers = {
  atm: new AtmPayment(),
  creditCard: new CreditCardpayment(),
};

const P = new Payment(paymentHandlers);
```

未來在新增付款方式時，需要修改的部位變成：

- `enum paymentMethods`
- `const paymentHandlers`
- 新增 `implements PaymentHandler` 的付款類別

### 預判修改

問：跟原本的 JS 版比起來，重構後多寫了不少程式碼。遵守開閉原則的好處到底是什麼？

答：此原則的重點是「程式碼要能彈性對應日後的擴充需求」，個人認為「並不是所有功能都適合以開閉原則撰寫」。

假設我很難想像這個功能未來的擴充內容，它或許就不是開閉原則的理想對象。但是，如果我現在需要「修改一段既有的程式碼，為它加入新功能」，那我就應該考慮在這次修改中以開閉原則重構相關段落。

## 里氏替換原則 Liskov substitution principle

假設有一個類別Ｘ與繼承Ｘ的子類別Ｙ，把所有的Ｘ以Ｙ替代後，程式碼應繼續正常運行。

### 不合適的繼承

以下是一個違反原則的 JS 範例。類別「企鵝」雖然繼承自類別「鳥」，但企鵝覆蓋了 `fly` 的內容，導致此功能產生意料外的結果。

```js
class Bird {
  name;

  constructor(name) {
    this.name = name;
  }

  fly() {
    return `${this.name} is flying.`;
  }
}

class Penguin extends Bird {
  fly() {
    throw new Error("Penguin can not fly.");
  }
}
```

雖然 TS 會直接在 `class Penguin extends Bird` 報錯（`Property 'fly' in type 'Penguin' is not assignable to the same property in base type 'Bird'.`），但工程師也應該思考——如果 `class Penguin` 不應該有 `fly` 功能，繼承 `class Bird` 真的合理嗎？

### 使用 TS 的 `implements` 建構類別

此關鍵字會幫忙檢查某類別是否有根據它 `implements` 的介面進行實作（參閱[官方文件](https://www.typescriptlang.org/docs/handbook/2/classes.html#implements-clauses)）。這能讓工程師有意識地去處理每一個子類別的內容。

可參考以下範例——使用 `extends` 的 `class BlackFridayStrategy1` 會直接繼承 `class PriceStrategy` 實作好的 `getPrice` 功能，但沒有實作 `getPrice` 的 `BlackFridayStrategy2` 讓 TS 噴錯了（`Class 'BlackFridayStrategy2' incorrectly implements class 'PriceStrategy'. Property 'getPrice' is missing in type 'BlackFridayStrategy2' but required in type 'PriceStrategy'.`）。

```ts
class PriceStrategy {
  getPrice(p: number) {
    return p;
  }
}

class BlackFridayStrategy1 extends PriceStrategy {
  // nothing happen
}

class BlackFridayStrategy2 implements PriceStrategy {
  // oops TS is yelling
}
```

## 介面隔離原則 Interface segregation principle

- 一個功能不應被迫接受它用不到的東西
- 精確 > 攏統（參數、型別皆是）

不良示範：

```ts
type PaymentArgs = {
  amount: number;
  cardNo?: string;
  cardValidateNo?: string;
  cardHolderName?: string;
  bankNo?: string;
};

function handleCreditCardPayment(arg: PaymentArgs) {
  // no needs for bankNo...
}

function handleBankPayment(arg: PaymentArgs) {
  // no needs for credit card related args...
}
```

理想狀態：

```ts
type BasePaymentArg = {
  amount: number;
};

type CreditCardPaymentArgs = BasePaymentArg & {
  cardNo: string;
  cardValidateNo: string;
  cardHolderName: string;
};

type BankPaymentArgs = BasePaymentArg & {
  bankNo: string;
};

function handleCreditCardPayment(arg: CreditCardPaymentArgs) {
  //
}

function handleBankPayment(arg: BankPaymentArgs) {
  //
}
```

在 [4 Interaction testing using mock objects#Interface segregation principle (I from SOLID)](/2023/the-art-of-unit-testing-ch4-interaction-testing-using-mock-objects#interface-segregation-principle-i-from-solid) 也有提過此概念。在撰寫單元測試時，工程師不應被強迫使用他用不到的功能。

## 依賴反轉原則 Dependency inversion principle

不要寫死實作內容，而是使用抽象層來介接高、低層次的功能。終極目標是降低功能之間的耦合性（coupling）。

實作可參考 [3 Breaking dependencies with stubs#3.3.1 Stubbing out time with parameter injection](/2023/the-art-of-unit-testing-ch3-breaking-dependencies-with-stubs#331-stubbing-out-time-with-parameter-injection) 展示過的內容。

## 參考資料

- [Clean Code 學派的風格實踐：開發可靠、可維護又強健的 JavaScript（第四章）](https://www.tenlong.com.tw/products/9789864345700)
- [YouTube: The Right way to write Nest.js & Typescript clean-code - SOLID](https://www.youtube.com/watch?v=vE74gnv4VlY)
- [What's the difference between 'extends' and 'implements' in TypeScript](https://stackoverflow.com/questions/38834625/whats-the-difference-between-extends-and-implements-in-typescript)
