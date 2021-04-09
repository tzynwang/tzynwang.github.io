---
title: 為什麼可以修改使用const宣告的陣列（或物件）的內容？
date: 2021-04-09 14:23:04
categories:
- JavaScript
tags:
---

## 原始問題
以`const`宣告一個陣列（或物件），為何可以在宣告完畢後繼續修改該陣列（或物件）的內容？

{% figure figure--center 2021/array-mutation/騎士王的提問時間.jpg "'事實上const的限制是「變數不能被re-assigned或re-declared」'" %}

## 簡答
`const`的限制是「只能賦值一次，不能重新賦值」，不直接等同「不能修改內容」。


## 環境
```
Google Chrome: 89.0.4389.114 (Official Build) (64-bit)
os: Windows_NT 10.0.18363 win32 x64
```

## 關於`const`的事實
### You Don't Know JS Yet 相關筆記
- `const` declared variables are not "unchangeable", they just cannot be re-assigned.
  - 不適合以「不能被修改」來理解透過`const`宣告的變數，而是「使用`const`宣告的變數只能被賦值一次」
  <script src="https://gist.github.com/tzynwang/bf4ef105981d115a11ae4eb761e34ac8.js"></script>
- It's ill-advised to use `const` with object values, because those values can still be changed even though the variable can't be re-assigned.
<script src="https://gist.github.com/tzynwang/b7f3ee4e1e7c8936a98bb8f7fa76b634.js"></script>
- If you stick to using `const` only with primitive values, you avoid any confusion of re-assignment (not allowed) vs. mutation (allowed)! That's the safest and best way to use const.

### ES2015 const is not about immutability 相關筆記
<script src="https://gist.github.com/tzynwang/0945c27501de984d3aaa410bf55a08ce.js"></script>
The only thing that’s immutable here is the binding. `const` assigns a value (`{}`) to a variable name (`foo`), and guarantees that no rebinding will happen. ES2015 const has nothing to do with immutability of values.
與其理說「透過`const`宣告的陣列（或物件）不能被修改內容」，不如將`const`理解為「建立一個變數與值之間不變的binding」。

### MDN上的相關內容
- The value of a constant can't be changed through reassignment, and it can't be re-declared.
- 以`const`宣告變數的同時就得賦值
  <script src="https://gist.github.com/tzynwang/b92649f9945fb3cb92275cf448adb199.js"></script>

## `Object.freeze()`
- 如果想要確保陣列或物件內容不被修改，可以使用`Object.freeze()`
  - MDN: Use `Object.freeze()` to make object immutable. A frozen object can no longer be changed; freezing an object prevents new properties from being added to it, existing properties from being removed, prevents changing the enumerability, configurability, or writability of existing properties, and prevents the values of existing properties from being changed.
  - 一個陣列或物件被凍結後，無法新增或移除該陣列、物件的內容，也不可修改該陣列、物件的properties
- `Object.freeze()`不會自動套用到巢狀結構內的所有內容上，如以下範例：
  <script src="https://gist.github.com/tzynwang/a52efc027532899027d7d0e0c9f1cfef.js"></script>
  {% figure figure--center 2021/array-mutation/object-freeze-demo-1.png %}
- 可透過遞迴來凍結巢狀結構物件的內容
  <script src="https://gist.github.com/tzynwang/e7a3cf50d030d90f05eee59257806b1e.js"></script>
  {% figure figure--center 2021/array-mutation/object-freeze-demo-2.png %}


## `Object.seal()`
- The Object.seal() method seals an object, preventing new properties from being added to it and marking all existing properties as non-configurable. Values of present properties can still be changed as long as they are writable.
  - 與`Object.freeze()`的差異是，經`Object.seal()`封閉的物件，不能對其新增或刪除內容，但封閉前就存在的內容可以被修改
  <script src="https://gist.github.com/tzynwang/1e8917a16a8450fb76fd5a6bd34201e9.js"></script>
  {% figure figure--center 2021/array-mutation/object-freeze-demo-3.png %}


## `Object.preventExtensions()`
`Object.preventExtensions()`只會禁止對物件新增內容，但可以刪除或修改既有內容
<script src="https://gist.github.com/tzynwang/034ffb5ed714a851cc2e35c5b8a148df.js"></script>
{% figure figure--center 2021/array-mutation/object-freeze-demo-4.png %}


## `Object.getOwnPropertyDescriptor()`
回傳一個物件中，特定property的相關設定
<script src="https://gist.github.com/tzynwang/e0618d9ef2d4fa0b153ad6d9347ae8ee.js"></script>
{% figure figure--center 2021/array-mutation/object-freeze-demo-5.png %}

參考[ECMAScript Specification, Table 3: Attributes of a Data Property](https://tc39.es/ecma262/#table-data-property-attributes)：
- `writable`: If false, attempts by ECMAScript code to change the property's [[Value]] attribute using [[Set]] will not succeed.
  - `writable`若為`false`，代表該`value`無法被修改
  - 被`Object.freeze()`凍結的物件，其`value`的`writable`就被修改為`false`
- `enumerable`: If true, the property will be enumerated by a for-in enumeration. Otherwise, the property is said to be non-enumerable.
  - `enumerable`為`true`代表該`value`會[被`for...in`迭代到](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in)
- `configurable`: If false, attempts to delete the property, change the property to be an accessor property, or change its attributes (other than [[Value]], or changing [[Writable]] to false) will fail.
  - `configurable`若為`false`，代表該`value`無法被刪除
  - 經`Object.freeze()`或`Object.seal()`處理過的物件，其`value`的`configurable`就被修改為`false`
{% figure figure--center 2021/array-mutation/attributes-of-data-property.png %}


## 補充：無法解凍或再開封
[Opposite of Object.freeze or Object.seal in JavaScript](https://stackoverflow.com/questions/19293321/opposite-of-object-freeze-or-object-seal-in-javascript)

> Freezing an object is the ultimate form of lock-down. Once an object has been frozen it cannot be unfrozen – nor can it be tampered in any manner. This is the best way to make sure that your objects will stay exactly as you left them, indefinitely

- `Object.freeze()`與`Object.seal()`是不可逆的程序，一旦一個物件（或陣列）被凍結或封閉，該物件就無法回到凍結（或封閉）前的狀態
- 可以透過[`Object.assign()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)來製作該物件（或陣列）的副本，再修改其內容


## 參考文件
- You Don't Know JS Yet: Get Started - 2nd Edition
  - [Chapter 2: Surveying JS](https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/get-started/ch2.md)
  - [Appendix A: Exploring Further](https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/get-started/apA.md)
- [ES2015 const is not about immutability](https://mathiasbynens.be/notes/es6-const)
- MDN
  - [const](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const)
  - [Object.freeze()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)
  - [Object.seal()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/seal)
  - [Object.preventExtensions()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/preventExtensions)
  - [Object.getOwnPropertyDescriptor()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor)
- ['Freezing' Arrays in Javascript?](https://stackoverflow.com/questions/7509894/freezing-arrays-in-javascript)