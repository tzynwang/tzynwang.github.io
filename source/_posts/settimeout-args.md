---
title: 「setTimeout() difference between parameters as string or function」相關筆記
date: 2021-04-12 20:27:31
categories:
- JavaScript
tags:
---

## 原始問題
`setTimeout()`傳入「與函式一致的字串」作為參數時，為何輸出的結果與「直接傳入函式」不同？

第一組程式碼：
```JavaScript
// 傳入與函式內容一樣的字串作為參數
setTimeout(console.log('first'), 0)
console.log('second');
// 輸出結果：
// >> first
// >> second
```

第二組程式碼：
```JavaScript
// 直接傳入函式作為參數
setTimeout(() => console.log('first'), 0)
console.log('second');
// 輸出結果：
// >> second
// >> first
```

### 解析
- 第一組程式碼的`console.log('first')`沒有被視為函式，而是被視為一組字串，此組字串在編譯後會被執行
- MDN（說明頁面中稱之為`code`）對於字串參數的說明：`setTimeout()` allows you to include a string, which is compiled and executed when the timer expires.
- 第一組程式碼實際上做的事情：
  1. `setTimeout()`沒有收到任何函式作為參數，沒有任何函式被延遲執行
  1. `setTimeout()`內的`console.log('first')`被執行，輸出`first`
  1. `setTimeout()`收到的是「執行`console.log('first')`後回傳的值」，也就是`undefined`
  1. `console.log('second')`被執行，輸出`second`
- 第二組程式碼實際上做的事情：
  1. `setTimeout()`收到一組匿名函式，該匿名函式被延後執行
  1. `console.log('second')`被執行，輸出`second`
  1. call stack已經沒有其他任務，被`setTimeout()`延後的匿名函式（`console.log('first')`）此時可以執行了，輸出`first`到console上

## 延伸問題：在迴圈內
第三組程式碼：
```JavaScript
for (var i = 0; i < 2; i++) {
    setTimeout(console.log(i))
}
// 輸出結果：
// >> 0
// >> 1
// >> 39607 (timeoutID) (在DevTool執行才會有這行輸出)
// 在Node.js環境執行此段程式碼會回傳TypeError : Callback must be a function. Received undefined
```

第四組程式碼：
```JavaScript
for (var i = 0; i < 2; i++) {
    setTimeout(() => console.log(i))
}
// 輸出結果：
// >> 39670 (timeoutID) (在DevTool執行才會有這行輸出，以Node.js執行不會有這行)
// >> 2
// >> 2
```

### 解析
- 第三組程式碼實際上做的事情：
  1. i為0，迴圈第一次執行，`console.log(i)`為字串參數，執行後輸出i
  1. i增加為1，迴圈第二次執行，`console.log(i)`為字串參數，執行後輸出i
  1. i增加為2，迴圈條件不成立，迴圈停止
- 第四組程式碼實際上做的事情：
  1. i為0，迴圈第一次執行，函式`console.log(i)`被延後，停在callback queue中等待call stack清空
  1. i增加為1，迴圈第二次執行，函式`console.log(i)`被延後，停在callback queue中等待call stack清空
  1. i增加為2，迴圈條件不成立，迴圈停止
  1. call stack已空，輪到callback queue中的callback function被執行
  1. i為2，迴圈第一次執行時被延後的`console.log(i)`輸出i
  1. i為2，迴圈第二次執行時被延後的`console.log(i)`輸出i

{% figure figure--center 2021/settimeout-args/JS-in-browser.png "'瀏覽器環境圖，取自：How JavaScript works: an overview of the engine, the runtime, and the call stack'" %}


## 參考文件
- [Javascript code executes differently for setTimeout when a function is passed as argument](https://stackoverflow.com/questions/54259645/javascript-code-executes-differently-for-settimeout-when-a-function-is-passed-as)
- [MDN: WindowOrWorkerGlobalScope.setTimeout()](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout)
- [How JavaScript works: an overview of the engine, the runtime, and the call stack](https://blog.sessionstack.com/how-does-javascript-actually-work-part-1-b0bacc073cf)
- [JavaScript for-loops are… complicated - HTTP203](https://youtu.be/Nzokr6Boeaw)