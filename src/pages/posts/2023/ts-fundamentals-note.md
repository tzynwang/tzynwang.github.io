---
layout: '@Components/SinglePostLayout.astro'
title: 2023 第3週 學習筆記：Frontend Masters TypeScript Fundamentals
date: 2023-01-21 10:35:59
tag:
  - [TypeScript]
---

## 總結

記錄一下在 Frontend Masters 課程 TypeScript Fundamentals 中接觸到的新概念。

## 筆記

### Function Overloads

解決的問題：一個 function 可能有多種參數組合，此時可以透過 function overloads 來定義出各種組合的可能性，並確保 TS 編譯器依舊能檢查傳入 function 的參數組合是否正確。
使用方式：如下範例，同一個 function signatures 搭配不同的參數組合以及最下方的實作內容。

```ts
function handleArrayUnshift(elem: number, arr: number[]): number[];
function handleArrayUnshift(elem: string, arr: string[]): string[];
function handleArrayUnshift(
  elem: number | string,
  arr: Array<number | string>
): Array<number | string> {
  return [elem, ...arr];
}

console.log(handleArrayUnshift(1, [2, 3, 4]));
console.log(handleArrayUnshift('hello', ['world']));

/*
下面這行會報錯
No overload matches this call.
  Overload 1 of 2, '(elem: number, arr: number[]): number[]', gave the following error.
    Argument of type 'string' is not assignable to parameter of type 'number'.(2769)
*/
console.log(handleArrayUnshift('no way', [1, 2, 3]));
```

### Parameter Properties

解決的問題：在 class constructor 中的參數與 class properties 名稱一致時，TS 提供偷懶寫法；並且能搭配各種 prefix 關鍵字。

> TypeScript offers special syntax for turning a constructor parameter into a class property with the same name and value. These are called **parameter properties** and are created by prefixing a constructor argument with one of the visibility modifiers `public`, `private`, `protected`, or `readonly`.

```ts
/* 原本要一個一個賦值 */
class Car {
  make: string;
  model: string;
  year: number;
  constructor(make: string, model: string, year: number) {
    this.make = make;
    this.model = model;
    this.year = year;
  }
}
```

```ts
/* 在 TS 中可以透過 constructor 偷懶 */
class Car {
  constructor(public make: string, public model: string, public year: number) {}
}

const aHonda = new Car('Honda', 'Accord', 2017);
console.info(aHonda.year); // 2017
```

### Non-null assertion operator

解決的問題：當開發者十分肯定某一變數有值（非 `nullish`）時，可使用 `!.` 的語法來讓 TS 編譯器不再報錯。

> A new `!` post-fix expression operator may be used to assert that its operand is non-null and non-undefined in contexts where the type checker is unable to conclude that fact.

```ts
// Compiled with --strictNullChecks
function validateEntity(e?: Entity) {
  // Throw exception if e is null or invalid entity
}
function processEntity(e?: Entity) {
  validateEntity(e);
  let s = e!.name; // Assert that e is non-null and access name
}
```

## 參考文件

- [TypeScript Official Docs: Function Overloads](https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads)
- [TypeScript Official Docs: Parameter Properties](https://www.typescriptlang.org/docs/handbook/2/classes.html#parameter-properties)
- [TypeScript Fundamentals v3](https://www.typescript-training.com/course/fundamentals-v3)
- [StackOverFlow: In Typescript, what is the ! (exclamation mark / bang) operator when dereferencing a member?](https://stackoverflow.com/questions/42273853/in-typescript-what-is-the-exclamation-mark-bang-operator-when-dereferenci)
