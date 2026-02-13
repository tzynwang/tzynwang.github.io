---
title: 2023 第2週 學習筆記：Frontend Masters Intermediate TypeScript
date: 2023-01-14 09:01:59
tag:
  - [TypeScript]
---

## 總結

記錄一些從 Frontend Masters 課程「Intermediate TypeScript」學習到的新概念以及 TypeScript 使用技巧。

## 筆記

### namespace 的應用場合

參考以下程式碼，在使用 jQuery 的時候，使用者可以透過兩種方式來使用 `$` 符號，分別是 `$.ajax(...)` 或 `$(/* selector syntax */)` 形式：

```js
// $ 符號透過 . 連接一個函式
$.ajax({
  url: "/api/getWeather",
  data: { zipCode: 97201 },
  success: (result) => {
    $("#weather-temp")[0].innerHTML = "<strong>" + result + "</strong> degrees";
  },
});

// $ 符號作為功能名稱，可將選取器語法作為參數傳入
$("h1.title").forEach((node) => {
  node.tagName; // "h1"
});
```

而在這類 lib 搭配 TypeScript 的場合時，其型別定義就可以透過以下形式來處理：

```ts
// 透過 namespace 來為第一種使用方式定義型別
namespace $ {
  export function ajax(arg: {
    url: string;
    data: any;
    success: (response: any) => void;
  }): Promise<any> {
    return Promise.resolve();
  }
}

// 如果要將 $ 作為函式使用，則型別定義如下
function $(selector: string): NodeListOf<Element> {
  return document.querySelectorAll(selector);
}
```

### class 可作為值或型別定義

```ts
class User {
  displayName: string = "";

  email: string = "";

  static createUser(displayName: string, email: string): User {
    return { displayName, email };
  }
}

// 將 class 作為值賦予其他變數
// 在 IDE 中 hover 該變數時，會發現變數的型別定義是 const valueTest: typeof User
const valueTest = User;
const createResult = valueTest.createUser("user", "mail@example.com");

// 將 class 作為型別定義使用
const typeTest: User = { displayName: "user", email: "mail@example.com" };
```

### CommonJS interop

在大部分的情況下，以下 require 寫法可無痛轉換成 import 語法：

```ts
const fs = require("fs");

import * as fs from "fs";
```

但某些 cjs 模組的 export 方式可能會造成 esm import 語法失效：

```ts
////////////////////////////////////////////////////////
// @filename: fruits.ts
function createBanana() {
  return { name: "banana", color: "yellow", mass: 183 };
}

// equivalent to CJS `module.exports = createBanana`
export = createBanana;
////////////////////////////////////////////////////////
// @filename: smoothie.ts

import * as createBanana from "./fruits";
// 出現錯誤訊息 This module can only be referenced with ECMAScript imports/exports by turning on the 'esModuleInterop' flag and referencing its default export.
```

此時有兩種解決方式：

1. 根據錯誤訊息的指示，將 `smoothie.ts` 中的 `tsConfig` `esModuleInterop` 與 `allowSyntheticDefaultImports` 設定為 `true` 即可，但這樣做的缺點是未來所有依賴 `smoothie.ts` 的檔案都需要把 `tsConfig` 中的 `esModuleInterop` 與 `allowSyntheticDefaultImports` 都一併設定為 `true`
2. 調整 `smoothie.ts` 的語法如下：

```ts
import createBanana = require("./fruits");
const banana = createBanana(); // 可正常執行
```

### 透過 `infer` 抽取型別內容

```ts
class Fruit {
  constructor(fruitNames: string[]) {}
}

type ConstructorArg<T> = T extends {
  new (arg: infer ARGUMENT, ...args: any): any;
}
  ? ARGUMENT
  : never;

const fruits: ConstructorArg<typeof Fruit> = ["apple", "banana", "cherry"];
// 可透過 IDE hover 變數來觀察到 const fruits: string[]

const webpackCompilerOptions: ConstructorArg<typeof WebpackCompiler>;
// 現在就可以知道哪些鍵值能被傳入 webpack constructor 了 🌚
```

在上述範例中，`ConstructorArg<T>` 透過三元運算子來驗證「傳入的型別 `T`」是否為「型別 `{ new (arg: infer ARGUMENT, ...args: any): any }`」的延伸，如果為 `true` 則 `ConstructorArg<T>` 被賦值（等同）型別 `ARGUMENT`。

型別 `ARGUMENT` 則是透過搭配關鍵字 `infer` 來取出。

當使用者將各種 constructor 傳入 `ConstructorArg<T>` 後，即可獲得該 constructor 的參數型別。

### 根據鍵值來篩選型別

首先透過關鍵字 `Extract` 取得 `Document` 之中名稱包含 `query${string}` 的鍵值，再透過 `[K in DocKeys]` 來遍歷出「名稱包含 `query${string}` 的型別定義」。

```ts
type DocQueryKeys = Extract<keyof Document, `query${string}`>;

type DocumentQuery = {
  [K in DocQueryKeys]: Document[K];
};

/*
篩選結果如下
type KeyFilteredDoc = {
    queryCommandEnabled: (commandId: string) => boolean;
    queryCommandIndeterm: (commandId: string) => boolean;
    queryCommandState: (commandId: string) => boolean;
    queryCommandSupported: (commandId: string) => boolean;
    queryCommandValue: (commandId: string) => string;
    querySelector: {
        ...;
    };
    querySelectorAll: {
        ...;
    };
}
*/
```

把上述內容抽象化之後，即可得到型別工具 `type FilterBy<T, U>`：

```ts
type FilterBy<T, U> = {
  [K in Extract<keyof T, U>]: T[K];
};

type DocumentQuery = FilterBy<Document, `query${string}`>;
/*
篩選結果與上方的 code snippet 相同
type KeyFilteredDoc = {
    queryCommandEnabled: (commandId: string) => boolean;
    queryCommandIndeterm: (commandId: string) => boolean;
    queryCommandState: (commandId: string) => boolean;
    queryCommandSupported: (commandId: string) => boolean;
    queryCommandValue: (commandId: string) => string;
    querySelector: {
        ...;
    };
    querySelectorAll: {
        ...;
    };
}
*/
```

### 根據回傳值來篩選型別

先從簡單的範例來推演。首先建立一個相對單純的型別 `Color`，在這個範例型別中，只有鍵值 `blue` 會搭配 `number` 類型的資料：

```ts
type Color = {
  red: string;
  green: string;
  blue: number;
};
```

接著根據 `Color[key]` 是否為 `number` 型態的資料來決定每一個 `key` 對應的資料型態：

- 如果 `Color[key]` 可以取得 `number` 型態的資料，則 `[key in keyof Color]: key`
- 如果 `Color[key]` 沒有辦法取得 `number` 型態的資料，則 `[key in keyof Color]: never`

```ts
type ColorNumber1 = {
  [key in keyof Color]: Color[key] extends number ? key : never;
};
/* 
type ColorNumber1 = {
    red: never;
    green: never;
    blue: "blue";
}
*/
```

然後搭配 index access 來取出不為 `never` 的鍵：

```ts
type ColorNumber2 = {
  [key in keyof Color]: Color[key] extends number ? key : never;
}[keyof Color];
// type ColorNumber2 = "blue"
```

最後，透過 `Pick<T, U>` 來取得「型別 `Color` 中，鍵值對應的資料類型為 `number`」的型別子集合：

```ts
type PickColorIfTypeNumber = Pick<Color, ColorNumber3>;
/*
type PickColorIfTypeNumber = {
    blue: number;
}
*/
```

在課程示範中用來檢驗的型別為 `Document`，以下是推演流程：

```ts
type ReturnElementArray = (...args: any[]) => Element[];

type DocumentReturnElementArray = {
  [key in keyof Document]: Document[key] extends ReturnElementArray
    ? key
    : never;
};

type DocumentReturnElementArray2 = {
  [key in keyof Document]: Document[key] extends ReturnElementArray
    ? key
    : never;
}[keyof Document];
// "adoptNode" | "createElement" | "createElementNS" | "importNode" | "appendChild" | "insertBefore" | "removeChild" | "replaceChild" | "elementsFromPoint" | "querySelector" | undefined

type DocumentReturnElementArray3 = {
  [key in keyof Document]: Document[key] extends ReturnElementArray
    ? key
    : never;
}[keyof Document] &
  keyof Document;
// "adoptNode" | "createElement" | "createElementNS" | "importNode" | "appendChild" | "insertBefore" | "removeChild" | "replaceChild" | "elementsFromPoint" | "querySelector"

type PickDocumentReturnElementArray = Pick<
  Document,
  DocumentReturnElementArray3
>;
/*
type PickDocumentReturnElementArray = {
    adoptNode: <T extends Node>(node: T) => T;
    createElement: {
        <K extends keyof HTMLElementTagNameMap>(tagName: K, options?: ElementCreationOptions | undefined): HTMLElementTagNameMap[K];
        <K extends keyof HTMLElementDeprecatedTagNameMap>(tagName: K, options?: ElementCreationOptions | undefined): HTMLElementDeprecatedTagNameMap[K];
        (tagName: string, options?: ElementCreationOptions | undefined): HTMLElement;
    };
    ... 7 more ...;
    querySelector: {
        ...;
    };
}
*/
```

相較於取出 `type Color`，處理 `type Document` 時多了一個步驟 `DocumentReturnElementArray3` 來過濾掉 `DocumentReturnElementArray2` 包含到的 `undefined`，不過並不清楚這個 `undefined` 從何而來 ⋯⋯。

整理一下以上內容，可以歸納出工具型別 `PickByReturnType<T>` 來搭配 `Pick<T, U>`：

```ts
type FilterByMappedType<T, U> = {
  [key in keyof T]: T[key] extends U ? key : never;
}[keyof T] &
  keyof T;
type ColorKeysMappedString = Pick<Color, FilterByMappedType<Color, string>>;
/*
type ColorKeysMappedString = {
    red: string;
    green: string;
}
*/
```

結束 😎

## 參考文件

- [Intermediate TypeScript](https://www.typescript-training.com/course/intermediate-v1)
