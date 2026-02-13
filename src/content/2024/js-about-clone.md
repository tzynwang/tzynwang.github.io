---
title: 關於在 JavaScript 中執行「複製」這件事
date: 2024-04-28 14:33:50
tag:
  - [JavaScript]
banner: /2024/js-about-clone/andre-mouton-GBEHjsPQbEQ-unsplash.jpg
summary: 最近才發現 node 原生的 `structuredClone` 在複製上的限制比想像中的多，如果有複製純物件以外的需求（比如要處理實例），還是需要使用 `lodash/cloneDeep` 🙈
draft:
---

最近在因緣際會下嘗試透過 `structuredClone` 來複製實例（JavaScript [Instance](https://developer.mozilla.org/en-US/docs/Glossary/Instance)），卻發現這個 node 的原生功能在「能複製的對象」上其實有不少限制。在回頭找了老朋友 `lodash/cloneDeep` 之餘，順便研究一下 `cloneDeep` 是用什麼手段來實現「實例複製」。

## 懶人包

在處理「複製實例」這件事情上：

- `lodash/cloneDeep` 透過 `Object.create` 來實現複製，你可以在新實例上操作原有實例的 methods/accessors
- `structuredClone` 的複製演算法並不支援複製實例的 methods/accessors
- 兩者都不會複製實例的私人屬性（[private properties](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_properties)）

## 關於 `lodash/cloneDeep` 的實作

```js
class Demo {
  name = "";

  constructor() {
    this.name = "hello world";
  }

  get showName() {
    return this.name;
  }

  logName() {
    console.log("name:::", this.name);
  }
}

const d = new Demo();
const d1 = cloneDeep(d);

console.info(d.showName); // hello world
d.logName(); // name::: hello world

console.info(d1.showName); // hello world
d1.logName(); // name::: hello world
```

在使用 `cloneDeep` 複製 `d` 時，發生的事情如下：

1. 從 [src/cloneDeep.ts](https://github.com/lodash/lodash/blob/a67a085cc0612f5b83d78024e507427dab25ca2c/src/cloneDeep.ts) 得知 `cloneDeep` 會呼叫 `baseClone`
2. 根據 [src/.internal/baseClone.ts](https://github.com/lodash/lodash/blob/main/src/.internal/baseClone.ts#L157) 中的邏輯分支，在複製實例時，我們會進入[第 186 行的 `initCloneObject`](https://github.com/lodash/lodash/blob/main/src/.internal/baseClone.ts#L186)
3. 打開 [src/.internal/initCloneObject.ts](https://github.com/lodash/lodash/blob/main/src/.internal/initCloneObject.ts)，發現複製實例時，執行的是 `Object.create(Object.getPrototypeOf(object))`
4. 最後抵達 [src/.internal/baseClone.ts](https://github.com/lodash/lodash/blob/main/src/.internal/baseClone.ts#L230) 的第 230 行，得知 `cloneDeep` 在這裡將實例的屬性（property）一個一個搬到複製出來的新實例上

### `Object.getPrototypeOf()` / `Object.create()`

個人認為 `cloneDeep` 最巧妙的地方就是它將 `Object.create()` 與 `Object.getPrototypeOf()` 搭配起來做出「複製實例的效果」。首先是透過 `Object.getPrototypeOf()` 取得傳入參數的原型Ｘ，再透過 `Object.create()` 建立一個「繼承原型Ｘ」的新實例。

> [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create): The **`Object.create()`** static method creates a new object, using an existing object as the prototype of the newly created object.

以範例中的實例 `d` 與複製出來的 `d1` 來說，這兩者在原型鏈上都指向 `Demo.prototype`：

```js
// d ---> Demo.prototype ---> Object.prototype ---> null
// d1 ---> Demo.prototype ---> Object.prototype ---> null
```

```js
console.info(Object.getPrototypeOf(d) === Demo.prototype); // true
console.info(Object.getPrototypeOf(d1) === Demo.prototype); // true
console.info(Demo.prototype.logName === d.logName); // true
console.info(Demo.prototype.logName === d1.logName); // true
```

當我們在執行 `d1.showName` 與 `d1.logName()` 時，呼叫的其實是 `Demo.prototype.showName` 與 `Demo.prototype.showName`。`cloneDeep` 不會去處理實例 methods/accessors 的複製，它只是活用了 JavaScript 的原型鏈來讓新實例能表現出既有實例的功能。

### `getAllKeys`

而當要複製的實例包含私人屬性時，執行 `cloneDeep` 不會出錯，但複製出來的新實例果不其然地不包含這類參數：

```js
class Demo {
  #name = "";

  constructor() {
    this.#name = "hello world";
  }

  logName() {
    console.log("name:::", this.#name);
  }
}

const d = new Demo();
const d1 = cloneDeep(d);
d1.logName(); // TypeError: Cannot read private member #name from an object whose class did not declare it
```

在複製實例時，會透過 [src/.internal/getAllKeys.ts](https://github.com/lodash/lodash/blob/main/src/.internal/getAllKeys.ts) 來整理出所有需要複製的屬性，然而私人屬性是無法被 `Object.keys()` / `Object.getOwnPropertySymbols()` / `Object.prototype.propertyIsEnumerable()` 揪出來的，所以複製出來的新實例不會有這些參數。

且私人屬性也「無法被沒有定義它的實例」取用：

> [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_properties): Private properties** cannot be legally referenced outside of the class**. The only way to access a private property is via dot notation, and you can **only do so within the class that defines the private property**.

因此上述範例在執行到 `d1.logName()` 時，就會拋錯。

## 關於 `structuredClone()` 的規格

此功能會根據 structured clone 演算法對傳入的參數執行深拷貝（deep clone），但有以下限制：

1. 不能複製 DOM 節點
2. 不能複製功能（Function）
3. 複製物件時，不會處理 `property descriptor` `getter` `setter` `metadata-like features`
4. 複製物件時，不會處理原型鏈（`prototype chain`）
5. 不會複製正規表達式（RegExp）物件的 `lastIndex`

第三、四點的限制讓 `structuredClone`（在需要複製實例時）無法成為 `lodash/cloneDeep` 的 node 原生替代。如以下範例，透過複製產生的 `d1` 僅會包含 `name`，沒有 `get showName` 也沒有 `logName()`：

```js
class Demo {
  name = "";

  constructor() {
    this.name = "hello world";
  }

  get showName() {
    return this.name;
  }

  logName() {
    console.log("name:::", this.name);
  }
}

const d = new Demo();
const d1 = structuredClone(d);

console.info(d.showName); // hello world
d.logName(); // name::: hello world

console.info(d1.showName); // undefined
d1.logName(); // TypeError: d1.logName is not a function
```

## 參考文件

- [MDN: structuredClone() global function](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone)
- [MDN: The structured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)
