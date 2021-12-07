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

### `this` 指向的內容

1. 透過 `new` 呼叫 function constructor 的時候，指向透過該 function constructor 新建立的物件
1. function 透過 `.apply()`、`.call()`或呼叫`.bind()` 綁定對象時，`this` 指向那些提供給 `apply()`、`bind()`或`call()`的物件
1. 沒有透過 `apply()`、`bind()`或 `call()`，直接經由某物件呼叫時，指向該物件（舉例：`user.logInfo()`是由 `user` 物件呼叫`.logInfo()`，`this` 指向 `user`）
1. 以上皆非，則指向`undefined`（`strict mode` 時），或指向全域物件

### class 中的 `static` 關鍵字

> MDN: Neither static methods nor static properties can be called on instances of the class. Instead, they're called on the class itself.

> MDN: Static methods are often utility functions, such as functions to create or clone objects, whereas static properties are useful for caches, fixed-configuration, or any other data you don't need to be replicated across instances.

簡單來說就是只有 class 可以使用，而非給 class instance 操作的 properties 或 methods

```js
class ClassWithStaticMethod {
  static staticProperty = 'someValue'
  static staticMethod() {
    return 'static method has been called.'
  }
  static {
    console.log('Class static initialization block called')
  }
}

console.log(ClassWithStaticMethod.staticProperty)
// "someValue"
console.log(ClassWithStaticMethod.staticMethod())
// "static method has been called."

const c = new ClassWithStaticMethod()
console.log(c.staticProperty)
// undefined
console.log(c.staticMethod())
// Uncaught TypeError: c.staticMethod is not a function
```

如以上展示，透過 `ClassWithStaticMethod` 建立的 instance c 無法取得 `staticProperty` 的值，也無法呼叫 `staticMethod()`

### class 中的 `private` 關鍵字

> 需注意 JavaScript 原生的 #private 與 TypeScript 的關鍵字 private 有所差異

- JavaScript `#private`: 
  - Private fields are **accessible on the class constructor** from inside the class declaration itself.
  - It is a syntax error to refer to `#private` from out of scope. It is also a syntax error to refer to private fields that were not declared before they were called, or to attempt to **remove declared fields with `delete`**.
- TypeScript keyword `private`: 
  - Doesn't like `protected`, access is NOT allowed from the member (even from subclasses).
  - Because private members aren’t visible to derived classes, a derived class **can’t increase its visibility**.
  - TypeScript’s type system, `private` and `protected` are only enforced during type checking. This means that JavaScript runtime constructs like `in` or simple property lookup can still access a `private` or `protected` member.
  - `private` also allows access **using bracket notation** during type checking. This makes `private`-declared fields potentially easier to access for things **like unit tests**, with the drawback that these fields are **soft private** and don’t strictly enforce privacy.

## 參考文件

- [JAVASCRIPT.INFO: Constructor, operator "new"](https://javascript.info/constructor-new)
- [JAVASCRIPT.INFO: Prototypes, inheritance](https://javascript.info/prototypes)
- [JAVASCRIPT.INFO: Classes](https://javascript.info/classes)
- [MDN: static](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/static)
- [MDN: Private class features](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields)
- [TypeScript: Classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)
- [You Don't Know JS: Determining `this`](https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/this%20%26%20object%20prototypes/ch2.md#determining-this)
- [`__proto__` VS. `prototype` in JavaScript](https://stackoverflow.com/questions/9959727/proto-vs-prototype-in-javascript)
