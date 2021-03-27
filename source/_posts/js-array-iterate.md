---
title: 「JavaScript陣列遍歷」相關筆記
date: 2021-03-27 09:37:48
categories:
- JavaScript
tags:
---

## 總結
本篇文章是關於JavaScript遍歷陣列（部分方法也可直接遍歷物件）方法的筆記
keywords: array, iterate, iteration


## 版本與環境
```
Google Chrome: 89.0.4389.90 (Official Build) (x86_64)
ox: macOS Big Suf Version 11.1
```

## 不會回傳新陣列

### `for`搭配`length()`
- 可遍歷陣列
- 不可直接遍歷物件

<iframe height="400px" width="100%" src="https://replit.com/@Charlie7779/forDa-Pei-Arrayprototypelength?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>


- `Array.prototype.length`會回傳一個陣列內有多少個物件（並回傳物件的類別是number）
- 陣列物件會從零開始數（0 based index），三個物件的陣列會讓`Array.prototype.length`回傳`3`，而陣列內物件的index依序為0、1、2
- 搭配`for`迴圈，從第一個物件（index 0）開始，直到index等於`Array.prototype.length`前停止
- 無法用這種方式來遍歷object，因為對object使用`Array.prototype.length`會回傳`undefined`（參考以下示範）
<iframe height="400px" width="100%" src="https://replit.com/@Charlie7779/ArrayprototypelengthWu-Fa-Da-Pei-object?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>


參考：
[MDN: Array.prototype.length](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/length)


#### 題外話：如何得知object的長度
```JavaScript
let size = Object.keys(myObj).length;
```
`Object.keys()`會回傳一個陣列，陣列裡面包含一個物件的所有`key`，對回傳的陣列取其`length`即可知道物件的長度；參考：
- [stack overflow: Length of a JavaScript object](https://stackoverflow.com/questions/5223/length-of-a-javascript-object)
- [MDN: Object.keys](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys)


### `while`搭配`length()`
- 可遍歷陣列
- 不可直接遍歷物件

<iframe height="400px" width="100%" src="https://replit.com/@Charlie7779/whileDa-Pei-Arrayprototypelength?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>

將`Array.prototype.length`設定為`while`迴圈的條件


#### 題外話：把normal function轉換成arrow function
```JavaScript
// 把function的部分獨立出來
function(item) {
  console.lot(item)
}

// 用一個變數來存放arrow function
let function = (item) => {
  console.log(item)
}

// {}裡面只有一行console.log(item)，拿掉{}
let function = (item) => console.log(item)
```
參考：
<iframe width="560" height="315" src="https://www.youtube.com/embed/NAN7U3MrX6o" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>


### `for...in`
- 可遍歷陣列
- 可遍歷物件

<iframe height="400px" width="100%" src="https://replit.com/@Charlie7779/forinBian-Li?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>

- 只會遍歷enumerable、non-Symbol **properties**
- 參考[MDN的說明](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in#description)：
    - A `for...in` loop **only** iterates over **enumerable, non-Symbol properties**.
    - Objects created from built–in constructors like `Array()`[(ref.)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Array) and `Object()`[(ref.)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/Object) have inherited non–enumerable properties from `Object.prototype` and `String.prototype`, such as String's `indexOf()` method or Object's `toString()` method.
- 遍歷的是enumerable **properties** (key-value pair中的**key**)，而非value；使用`for...in`遍歷陣列或字串時需注意是否抓取到正確的物件，參考以下示範：
    <iframe height="400px" width="100%" src="https://replit.com/@Charlie7779/forinBian-Li-Zhen-Lie-Yu-Zi-Chuan?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>

### `for...of`
- 可遍歷陣列
- 不可直接遍歷物件

<iframe height="400px" width="100%" src="https://replit.com/@Charlie7779/forofBian-Li?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>

- 可遍歷任何「可遍歷的物件」（iterable objects）
    - JavaScript built-in iterable objects: Array, array-like objects (arguments, NodeList), TypedArray, Map, Set, String
    - 而Object不是iterable objects，對Object使用`for...of`會回傳`Error: not iterable`
    - iterable objects可參考[MDN的說明](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterable_protocol)


### `every()`
- 可遍歷陣列
- 不可直接遍歷物件
<iframe height="400px" width="100%" src="https://replit.com/@Charlie7779/Arrayprototypeevery?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>


- `every()`會對陣列中的每一個物件執行放在括號中的function（callback function）
- 如果所有的物件傳入callback function後都回傳truthy value，則`every()`會回傳true，否則`every()`回傳false
- 一旦callback function回傳falsy value，`every()`就會停止（參考上方示範碼第21行輸出的結果）
- [參考MDN的說明](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every#description)：對空的陣列執行`every()`，不管callback function的條件是什麼，`every()`都會回傳true
- `every()`不會對被刪除的、空的值執行callback function


### `forEach()`
- 可遍歷陣列
- 不可直接遍歷物件

<iframe height="400px" width="100%" src="https://replit.com/@Charlie7779/forEach?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>

- `forEach()`會對陣列中的每一個物件執行放在括號中的function（callback function）
- `forEach()`不會對被刪除的、空的值執行callback function（[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach#description): It is not invoked for index properties that have been deleted or are uninitialized.），可參考以下範例：
    <iframe height="400px" width="100%" src="https://replit.com/@Charlie7779/forEach-invoked-count?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>


### `join()`
- 可遍歷陣列
- 不可直接遍歷物件

<iframe height="400px" width="100%" src="https://replit.com/@Charlie7779/Arrayprototypejoin?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>

- 回傳「將陣列依照括號內條件」組合起來的字串（類型：string）


### `reduce()`
- 可遍歷陣列
- 不可直接遍歷物件

<iframe height="400px" width="100%" src="https://replit.com/@Charlie7779/Arrayprototypereduce?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>

- 雖然名稱是reduce，但通常拿來做加總計算；回傳一個值（類型：number）
- `reduce()`的callback最少需要兩個參數`accumulator`與`currentValue`
    - `accumulator`：如其名稱，代表累加下來的值；負責記住callback要回傳的值
    - `currentValue`：需額外納入`reduce()`計算過程中的數字


## 會回傳新陣列
### `filter()`
- 可遍歷陣列
- 不可直接遍歷物件

<iframe height="400px" width="100%" src="https://replit.com/@Charlie7779/Arrayprototypefilter?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>

- 回傳一個新的陣列，新的陣列中包含「傳入callback function後，判定為true」的所有物件
- 概念與`forEach()`類似：`filter()`不會對被刪除的、空的值執行callback function（[參考MDN的說明](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter#description)）


### `flat()`
- 可遍歷陣列
- 不可直接遍歷物件

<iframe height="400px" width="100%" src="https://replit.com/@Charlie7779/Arrayprototypeflat?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>

- 根據括號內的參數來將陣列扁平化，回傳一個新的陣列
- 預設參數為1
- 其他應用（[參考MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat#examples)）：
    - 參數傳入`Infinity`的話，陣列中任何深度的巢狀陣列全部都會被扁平化
    ```JavaScript
    const arr = [1, 2, [3, 4, [5, 6, [7, 8, [9, 10]]]]];
    arr.flat(Infinity);
    // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    ```
    - 可以拿來去除陣列中的空位
    ```JavaScript
    const arr = [1, 2, , 4, 5];
    arr.flat();
    // [1, 2, 4, 5]
    ```


### `flatMap()`
功能上：即是`map()`加上`flat(1)`，但濃縮為一個method


### `map()`
- 可遍歷陣列
- 不可直接遍歷物件

<iframe height="400px" width="100%" src="https://replit.com/@Charlie7779/map?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>

- `map()`會對陣列中的每一個物件執行放在括號中的function（callback function），並回傳一個新陣列
- 概念與`forEach()`類似：`map()`不會對被刪除的、空的值執行callback function（[參考MDN的說明](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map#description)）


## 參考文件
- [11 ways to iterate an array in Javascript](https://dev.to/misterkevin_js/11-ways-to-iterate-an-array-javascript-3mjg)
- [w3school.com: JavaScript Array Iteration Methods](https://www.w3schools.com/JS/js_array_iteration.asp)
- [GeeksforGeeks: Ways of iterating over a array in JavaScript](https://www.geeksforgeeks.org/ways-iterating-array-javascript/)
- [Mastering JS: How to Iterate through an Array in JavaScript](https://masteringjs.io/tutorials/fundamentals/array-iterate)