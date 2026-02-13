---
title: 「產生順序數陣列」相關筆記
date: 2021-06-14 18:27:20
tag:
  - [JavaScript]
---

## 總結

使用`Array() constructor`、`Array.prototype.keys()`與`Array.from()`來建立一個陣列，該陣列包含從小到大的順序數列，如`[1, 2, 3, 4, 5, 6, 7]`

## 筆記

### Array() constructor

傳入陣列長度，會得到對應該陣列長度的空陣列

```js
let x = Array(7);
// x為[empty × 7]
```

> MDN: If the only argument passed to the Array constructor is an **integer between 0 and 2^32 - 1 (inclusive)**, this returns a new JavaScript array with its **length property set to that number** (Note: this implies an array of arrayLength empty slots, not slots with actual undefined values). If the argument is any other number, a RangeError exception is thrown.

### Array.prototype.keys()

此功能會回傳「Array Iterator object」，並非單純的陣列

```js
const array1 = ["a", "b", "c"];
const iterator = array1.keys();
// 呼叫iterator的話，會得到Array Iterator Object，而非陣列

for (const key of iterator) {
  console.log(key); // 依序印出0、1、2
}
```

### Array.from()

配合`Array.prototype.keys()`回傳的 Array Iterator Object，回傳該 Array Iterator Object 的淺拷貝陣列

> MDN: The `Array.from()` static method creates a **new, shallow-copied Array instance** from an array-like or iterable object.

```js
let serialNumber = Array.from(Array(7).keys(), (element) => element + 1);
console.log(serialNumber);
// 印出 Array [1, 2, 3, 4, 5, 6, 7]
```

步驟拆解如下：

1. `Array(7)`得到一個長度為 7 的空陣列
1. `Array(7).keys()`得到一個 Array Iterator Object，若使用`for...of`迴圈印出此物件的內容的話，會依序印出 0、1、2、3、4、5、6
1. `Array.from(Array(7).keys(), element => element + 1)`中的`element => element + 1`是傳入`Array.from()`的 Map function，會依序作用在陣列中的每一個項目上

- 而傳入的 Map function 要做的事情是「為陣列中的每一個項目 +1」
- 所以最後`Array.from()`回傳的陣列會是從 1 開始，而非 0
- `element => element + 1`是以下原始碼的精簡版本：

```js
(element) => {
  return element + 1;
};
// 簡化為
(element) => {
  return element + 1;
};
// 簡化為
(element) => element + 1;
```

## 參考文件

- [Array() constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Array)
- [Array.prototype.keys()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/keys)
- [Array.from()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from)
