---
layout: '@Components/SinglePostLayout.astro'
title: JavaScript 原生深拷貝功能：structuredClone
date: 2023-05-20 12:48:14
tag:
  - [JavaScript]
---

## 總結

幾個主流瀏覽器與 Node.js 17.0.0 版開始支援 JS 原生的深拷貝功能 `structuredClone()`，此篇文章會記錄一下本功能的使用方式。

## 支援環境

```
Chrome: 98
Edge: 98
FireFox: 94
Safari: 15.4
Node.js: 17.0.0
```

## 筆記

### 基本功能

把要深拷貝的對象做為參數傳入 `structuredClone()` 中，取得的回傳內容即是經過深拷貝的新物件。

```ts
const obj1 = {
  fruit: ['apple', 'banana', 'cherry'],
  vegetable: ['broccoli', 'carrot'],
};
const obj2 = structuredClone(obj1);

obj1.vegetable.push('garlic');
console.info(obj1);
/*
{
  fruit: ['apple', 'banana', 'cherry'],
  vegetable: ['broccoli', 'carrot', 'garlic'],
}
*/
console.info(obj2);
/*
{
  fruit: ['apple', 'banana', 'cherry'],
  vegetable: ['broccoli', 'carrot'],
}
*/
```

如果沒有執行深拷貝，則上述 `obj1.vegetable.push(...)` 會一併影響到 `obj2.vegetable` 的內容，因為 `obj1.vegetable` 與 `obj2.vegetable` 實際還是指向記憶體中的同一個區塊。展示如下：

```ts
const obj1 = {
  fruit: ['apple', 'banana', 'cherry'],
  vegetable: ['broccoli', 'carrot'],
};
const obj2 = { ...obj1 };

obj1.vegetable.push('garlic');
console.info(obj1);
/*
{
  fruit: ['apple', 'banana', 'cherry'],
  vegetable: ['broccoli', 'carrot', 'garlic'],
}
*/
console.info(obj2);
/*
{
  fruit: ['apple', 'banana', 'cherry'],
  vegetable: ['broccoli', 'carrot', 'garlic'],
}
*/
```

### 搬移功能

擁有 `transferable` 特性的物件（參考 MDN 的 [一覽表](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Transferable_objects#supported_objects)）可以透過 `structuredClone()` 來執行「搬移」。

語法：在 `structuredClone()` 的第二個參數傳入物件 `{ transfer: [...] }` ，並在陣列中指定搬移對象。

```ts
const buff = new ArrayBuffer(16);
const obj1 = { buffer: buff };
const obj2 = structuredClone(obj1, { transfer: [obj1.buffer] });

console.info(obj1);
// { "buffer": ArrayBuffer(0) }
console.info(obj2);
// { "buffer": ArrayBuffer(16) }

// this will work
const int32View2 = new Int32Array(obj2.buffer);
// this will throw TypeError
const int32View1 = new Int32Array(obj1.buffer);
```

說明：`obj1.buffer` 具有 `transferable` 特性，透過 `structuredClone(obj1, { transfer: [obj1.buffer] })` 後，此 `.buffer` 從原本的 `obj1` 被移動到 `obj2` 中。物件 `obj1.buffer` 被清空後，想透過 `new Int32Array()` 建立實例會導致失敗拋錯。

## 參考文件

- [MDN: structuredClone()](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone)
- [MDN: Transferable objects](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Transferable_objects)
- [web.dev: Deep-copying in JavaScript using structuredClone](https://web.dev/structured-clone/)
- [Chrome Developers: Transferable objects - Lightning fast](https://developer.chrome.com/blog/transferable-objects-lightning-fast/)
- [HTML Living Standard: 2.7.2 Transferable objects](https://html.spec.whatwg.org/multipage/structured-data.html#transferable-objects)
