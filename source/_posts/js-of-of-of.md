---
title: 奇妙的 JavaScript 程式碼： for (var of of of) {...}
date: 2022-06-21 20:46:05
categories:
- JavaScript
tags:
---

## 奇妙範例

```js
var of = ['of'];
for (var of of of) {
  console.log(of);
}
```
輸出結果是字串型態的 `'of'`

## 解析

把開頭的題目整理一下，先去掉眾多 `of` 帶來的混亂：
```js
var arr = ['hello world'];
for (var a of arr) {
  console.log(a);   // 輸出 'hello world'
  console.log(arr); // 輸出 ['hello world']
}
```

- 可反推得知開頭題目被輸出到終端的是 `(var of of of)` 的第一個 `of`
- 另外已知透過 `var` 可以重複宣告同名變數：
  ```js
  var str = 'hello';
  var str = 'world';
  console.log(str); // 'world'
  ```
- 謎底：其實開頭的題目就是 `var of = ['of'];` 被 `(var of of of)` 覆蓋過去，內容從原本的 `['of']` 變成 `'of'`


### 變形 A
```js
let of = ['of'];
for (let of of of) {
  console.log(of);
}
// Uncaught ReferenceError: Cannot access 'of' before initialization
```

```js
var of = ['of'];
for (let of of of) {
    console.log(of);
}
// Uncaught ReferenceError: Cannot access 'of' before initialization
```

- 以上兩組 code 的爆炸點都在 `let of of of` 的第二個 `of`
- 出事的理由是因為踩到 Temporal dead zone 的坑，參考 MDN 說明：
  - A `let` or `const` variable is said to be in a "temporal dead zone" (TDZ) from the start of the block until code execution reaches the line where the variable is declared. While inside the TDZ, the variable has not been initialized with a value, and **any attempt to access it will result in a ReferenceError**.

### 變形 B
```js
let of = ['of'];
for (var of of of) {
    console.info(of);
}
// Uncaught SyntaxError: Identifier 'of' has already been declared
```

- 其實就是不能對透過 `let` 宣告的變數再進行一次同名變數宣告
- 變形 B 可抽換成：
  ```js
  let str = 'hello';
  var str = 'world';
  ```
- JavaScript 只允許 `var` 進行同名變數的重複宣告，透過 `let` 或 `const` 宣告的變數都不允許此行為


## 參考文件
- [Question: will this JS code throw an error?](https://twitter.com/madzadev/status/1538432593137483783?s=20&t=mr7eOBs-wUlDQAVPUY4y1g)
- [MDN: Reserved keywords as of ECMAScript 2015](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#reserved_keywords_as_of_ecmascript_2015)
- [MDN: let/Temporal dead zone (TDZ)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let#temporal_dead_zone_tdz)