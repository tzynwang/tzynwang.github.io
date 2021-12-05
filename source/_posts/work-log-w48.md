---
title: 2021 第48週 學習記錄
date: 2021-12-05 10:48:40
categories:
  - JavaScript
tags:
---

## 總結

本週集中火力閱讀 JavaScript Class 相關的內容，以下為筆記整理，基本整理自 MDN、Udemy 課程 JavaScript: Understanding the Weird Parts、YDKJS 與 JAVASCRIPT.INFO

## 筆記

> 大總結：JavaScript 的 Class 是 function constructor 的語法糖；而在 JavaScript 中使用關鍵字 `new` 來建立新物件這件事情，本質上是「建立一個新物件，並該物件的原型（`[[Prototype]]`）指向關鍵字 `new` 後方的 function constructor 的 prototype object」

### `new` 做的事

1. Creates a blank, plain JavaScript object.
1. Adds a property (`__proto__`) to the new object that links to the **constructor function's prototype object**.
1. Binds the newly created object instance as the `this` context (i.e. all references to `this` in the constructor function now refer to the object created in the first step).
1. Returns `this` if the function doesn't return an object.

> 以程式碼展示 constructor function's prototype object 到底是什麼意思

<script src="https://gist.github.com/tzynwang/10863be3efdd0ad7256f7b63b7b428a0.js"></script>

1. 在 UserF 中建立 method `logInfo`
1. 設定 UserF 的 prototype 中有一 method `logInfoP`
1. 透過 UserF 建立 `jackieF` 與 `jackieF2` 後比較兩只物件的`.logInfo` 與`.logInfoP`，發現`.logInfo` 是位在記憶體中不同位置的兩組程式碼，而 `logInfoP` 則都指向 `UserF.prototype` 中的同一段程式碼
1. 所以，當開發者想要對 `jackieF` 或 `jackieF2` 這兩個物件使用 `logInfoP` 時，操作的其實是沿著 prototype chain 往回搜尋、找到並使用 UserF.prototype 的 `logInfoP`

<script src="https://gist.github.com/tzynwang/27744405dbd062612c649134907dabb8.js"></script>

- 改為使用 class 的方式來建立並檢查兩個物件 `jackie` 與 `jackie2` 的 `logInfo`，也會發現 `logInfo` 其實是不是兩個 `jackie` 物件各自持有，而是兩個物件中的 `logInfo` 實際上是沿著 prototype chain 往回搜尋，並找到位於 constructor function (User) prototype object 中的 `logInfo`

## 參考文件

- [Constructor, operator "new"](https://javascript.info/constructor-new)
- [Prototypes, inheritance](https://javascript.info/prototypes)
- [Classes](https://javascript.info/classes)
- [`__proto__` VS. `prototype` in JavaScript](https://stackoverflow.com/questions/9959727/proto-vs-prototype-in-javascript)
