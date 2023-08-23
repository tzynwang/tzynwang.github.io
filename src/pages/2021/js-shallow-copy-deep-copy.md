---
layout: '@Components/pages/SinglePostLayout.astro'
title: 「pass by value、pass by reference、深拷貝」相關筆記
date: 2021-04-18 16:43:24
tag:
  - [JavaScript]
---

## 總結

對 Primitive types 與 Structural types 的資料使用等號進行「賦值」的動作時，賦予的內容分別是值本身（value）或記憶體中的位置（reference）：

- Primitive types（`undefined`、`Boolean`、`Number`、`BigInt`、`String`、`Symbol`）：pass by value，可直接透過「賦值」拷貝（淺拷貝，shallow copy）
- Structural types（`Object`、`Function`）：pass by reference，要完全拷貝其內容需執行深拷貝（deep copy）

## Pass by value

- 將基本類別的資料從一個變數「賦值」到另外一個變數的時候，傳遞的是「值」本身（pass by value）
- 參考以下程式碼，在將`bag`的值`apples`賦予`pocket`時，傳遞給`pocket`的是`bag`的值（`apples`）
  ```js
  let bag = 'apples'
  let pocket = bag
  bag = 'oranges'
  console.log(pocket) // output: apples
  ```
  - `pocket`的`apples`與`bag`的`apples`分別位在記憶體中不同的空間，實際上是兩筆值為`apples`的資料
  - 所以，即使對`bag`賦予一組新的值`oranges`，也不會影響到`pocket`的值

## Pass by reference

- 將`Object`與`function`類型的資料從一個變數「賦值」到另外一個變數的時候，傳遞的是「記憶體中的位置」（pass by reference）
- 參考以下程式碼，`container1`與`container2`兩個變數「指向」同一筆資料`{apple: 6}`；修改`container1`「指向」的內容後，呼叫「指向同一筆資料」的`container2`就會看到被修改後的內容，即是`{apple: 3}`
  ```js
  const container1 = {apple: 6}
  const container2 = container1
  container1.apple = 3
  console.log(container2) // output: {apple: 3}
  ```

## 深拷貝（deep copy）

概念如下：透過對`container1`進行深拷貝來取得`container2`的話 ⋯⋯

- `container2`就會是一個完全獨立的新物件，對`container2`進行任何修改都不會影響到`container1`
- 反之亦然，對`container1`進行任何修改都不會影響到`container2`的內容
- `container1`與`container2`分別指向記憶體中**不同的位置**

### `JSON.stringify`搭配`JSON.parse`

把需要進行深拷貝的目標傳入`JSON.stringify`，再將`JSON.stringify`回傳的 JSON string 傳入`JSON.parse()`重建為 JavaScript 物件（或值）

```js
const container1 = {apple: 6}
const jsonString = JSON.stringify(container1) // 取得JSON string化的container1
const container2 = JSON.parse(jsonString)     // 將JSON string化的container1重建為JavaScript物件，得到與container1無關的container2
container1.apple = 3
console.log(container2) // output: {apple: 6}
```

`JSON.stringify`的特性：

- 無法處理`circular reference`（循環參考）與`BigInt`（`JSON.stringify`會丟出`TypeError`）
- 無法處理`undefined`、`Function`或`Symbol`
  - 若是在處理`array`時發現以上三種資料，這三種類型的資料會被轉換為`null`
  - 若是在處理`object`時發現以上三種資料，這三種類型的資料會被略過
  - `Symbol`-keyed 會被略過
  - `undefined`與`Function`會讓`JSON.stringify`回傳`undefined`
  - MDN 原文：`undefined`, `Function`s, and `Symbol`s are not valid JSON values. If any such values are encountered during conversion they are either omitted (when found in an object) or changed to `null` (when found in an array). `JSON.stringify()` can return `undefined` when passing in "pure" values like `JSON.stringify(function(){})` or `JSON.stringify(undefined)`.
- 傳入`JSON.stringify`的`Infinity`、`NaN`與`null`都會被視為`null`
  - MDN 原文：The numbers `Infinity` and `NaN`, as well as the value `null`, are all considered `null`.
- 只會處理`Object`中`enumerable`的部分
  - MDN 原文：All the other `Object` instances (including `Map`, `Set`, `WeakMap`, and `WeakSet`) will have only their enumerable properties serialized.

`JSON.parse`的使用注意事項：

- 無法處理 trailing commas
  ```js
  JSON.parse('[1, 2, 3, 4, ]')
  JSON.parse('{"foo" : 1, }')
  // both will throw a SyntaxError
  ```
- 僅允許單引號`'`包覆雙引號`"`，反過來使用雙引號包覆單引號會丟出`SyntaxError`
  ```js
  JSON.parse('[1, 5, "false"]');
  // output: [1, 5, "false"]
  JSON.parse("[1, 5, 'false']");
  // will throw a SyntaxError
  ```

### 使用[Lodash](https://lodash.com/)的`_.cloneDeep`

文件：[https://docs-lodash.com/v4/clone-deep/](https://docs-lodash.com/v4/clone-deep/)

```js
const container1 = [{ apple: 6 }, { orange: 2 }]
const container2 = _.cloneDeep(container1)

container1[0].apple = 3
console.log(container1) // [{ apple: 3 }, { orange: 2 }]
console.log(container2) // [{ apple: 6 }, { orange: 2 }]
```

### 使用[jQuery](https://jquery.com/)的`$.extend`

文件：[https://api.jquery.com/jquery.extend/](https://api.jquery.com/jquery.extend/)

```js
const container1 = [{ apple: 6 }, { orange: 2 }]
const container2 = $.extend(true, [], container1);

container1[0].apple = 3
console.log(container1) // [{ apple: 3 }, { orange: 2 }]
console.log(container2) // [{ apple: 6 }, { orange: 2 }]
```

### Node.js: Serialization API

文件：[https://nodejs.org/api/all.html#v8_serialization_api](https://nodejs.org/api/all.html#v8_serialization_api)

```js
const v8 = require('v8')

const structuredClone = obj => {
  return v8.deserialize(v8.serialize(obj));
}
```

### The structured clone algorithm

參考：[https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)
尚未於瀏覽器中實現。

## bonus track: CPython [id()](https://docs.python.org/3/library/functions.html#id) in JavaScript?

提問：CPython 的`id()`會回傳物件在記憶體中的位置，JavaScript 有類似的功能嗎？
簡答：沒有。
詳答：

- If it would be possible at all, it would be very **dependent on the javascript engine**. The more modern javascript engine compile their code using a [just in time compiler](https://hacks.mozilla.org/2017/02/a-crash-course-in-just-in-time-jit-compilers/) and messing with their internal variables would be either bad for performance, or bad for stability.
- Here's an easier reason for why you can't get a variable's memory address: JS is a safe language for the web, which abstracts away not only the hardware, but also the OS and browser. There are **only high-level concepts by design**, because lower-level stuff does not have to matter at all.

## 參考文件

- [MDN: Data and Structure types](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#data_and_structure_types)
- [MDN: JSON.stringify()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)
- [MDN: JSON.parse()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)
- [前端三十 - 成為更好的前端工程師系列：14. [JS] 深拷貝是什麼？如何實現？](https://ithelp.ithome.com.tw/articles/10223178)
- [Roya's Blog: JavaScript 淺拷貝 (Shallow Copy) 與深拷貝 (Deep Copy)](https://awdr74100.github.io/2019-10-24-javascript-deepcopy/)
- [Kanboo Notes: JS-淺拷貝(Shallow Copy) VS 深拷貝(Deep Copy)](https://kanboo.github.io/2018/01/27/JS-ShallowCopy-DeepCopy/)
- [[筆記] 談談 JavaScript 中 by reference 和 by value 的重要觀念](https://pjchender.blogspot.com/2016/03/javascriptby-referenceby-value.html)
- [What is the most efficient way to deep clone an object in JavaScript?](https://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript)
- [How can I get the memory address of a JavaScript variable?](https://stackoverflow.com/questions/639514/how-can-i-get-the-memory-address-of-a-javascript-variable)
- [How to get the variable' memory address in node.js?](https://hashnode.com/post/how-to-get-the-variable-memory-address-in-nodejs-cjq83mnya00yh1vs2czf9vwne)
