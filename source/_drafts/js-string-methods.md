---
title: 「JavaScript String methods」相關筆記
date: 2021-04-14 13:25:33
categories:
- JavaScript
tags:
---

## 總結
本篇文章是關於JavaScript內建，與字串相關的方法（methods）的筆記。

## `String.prototype.charAt()`
- 不影響原本的字串
- 參數範圍在（整數）`0`至`str.length - 1`的話，回傳一組新的相對應的字元
- 參數不能被轉換為整數、或是沒有傳入參數的話，參數默認為預設值`0`
  ```JavaScript
  const sentence = 'The quick brown fox jumps over the lazy dog.';
  const index = 'foo';
  console.log(sentence.charAt(index)); // 參數無法被轉換為整數，參數視為0，輸出'T'
  ```
- 參數超過字串長度的話，回傳空字串
```JavaScript
const sentence = 'The quick brown fox jumps over the lazy dog.';
const index = 3000;
console.log(sentence.charAt(index)); // 輸出''
```


## 參考文件
- [MDN: String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
- [You Don't Know JS Yet: Get Started - 2nd Edition](https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/get-started/ch2.md#you-dont-know-js-yet-get-started---2nd-edition)