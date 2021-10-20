---
title: 「JavaScript初級面試題目」相關筆記
date: 2021-10-18 13:52:32
categories:
- JavaScript
tags:
---

## 總結
整理了今年7月參加的JS模擬面試之題目與相關筆記。
感謝[丹尼哥](https://eruditeness.news.blog/)無償出借時間陪大家練習。

第一週摘要：scope、浮點數陷阱、hoist、強制轉型、null vs undefined、IIFE
第二週摘要：closure、變數型別、by value & by reference、深淺拷貝、this
第三週摘要：箭頭函數、運算子、event loop、promise、micro task vs macro task


## 第一週題目串
### var、const與let之差異
- `var`為functional scope，而`let`與`const`為block scope
  ```JavaScript
  // functional scope
  (() => {
    { var s = 'hello world' }
    console.log(s)
  })()
  // 'hello world'
  ```
  ```JavaScript
  // block scope
  (() => {
    { let s = 'hello world' }
    console.log(s)
  })()
  // Uncaught ReferenceError: s is not defined
  ```
- 透過`var`與`let`宣告的變數可以重新賦值（value can be reassigned），而透過`const`宣告的變數不可
- 透過三種方法宣告的變數都會在creation phase被hoist，但是只有透過`var`宣告的變數可以先被取得（can be accessed before created），並取得的值會是`undefined`
  ```JavaScript
  console.log(a) // Uncaught ReferenceError: b is not defined
  let a = 'hello world'
  ```
  ```JavaScript
  console.log(b) // undefined
  var b = 'hello world'
  ```


### 請調整以下程式碼，使其每隔一秒依序印出數列01234
```JavaScript
(() => {
  for (var i = 0; i < 5; i++) {
    setTimeout(() => {
      console.log(i)
    }, 1000 * i)
  }
})()
```
- 將`var`改為`let`，因`var`為functional scope，而五組console.log在event loop的queue中等到stack清空後，i已經為5，故只會每隔一秒印出5；改為使用`let`宣告block scope的變數後，即可輸出值分別為01234的結果
- 使用IIFE概念改寫，如下：
  ```JavaScript
  (() => {
    for (var i = 0; i < 5; i++) {
      setTimeout(((i) => {
        return () => { console.log(i) }
      })(i), 1000 * i)
    }
  })()
  ```


### 以下程式碼的輸出結果為？
```JavaScript
{
  (function(){
    var a = b = 'hello world'
  })()

  console.log(`a defined? ${typeof a !== 'undefined'}`)
  console.log(`b defined? ${typeof b !== 'undefined'}`)
}
```
- 分別為`false`與`true`，a為`undefined`而b為`hello world`
- 實際發生的事情如下：
  ```JavaScript
  {
    (function(){
      b = 'hello world'
      var a = b
    })()
  }
  ```
  b被宣告為全域變數，a的作用範圍則是匿名函數內（functional scope）；IIFE執行完畢後，在function外無法取得a，但可取得全域變數b
- 備註：`typeof`可處理未被定義的（var）變數而不會報錯，參考MDN：
  > Before ECMAScript 2015, `typeof` was always guaranteed to return a string for any operand it was supplied with. Even with undeclared identifiers, `typeof` will return `undefined`. Using typeof could never generate an error.
  > However, with the addition of block-scoped `let` and `const`, using `typeof` on `let` and `const` variables (or using `typeof` on a `class`) **in a block before they are declared will throw a `ReferenceError`**. Block scoped variables are in a "**temporal dead zone**" from the start of the block until the initialization is processed, during which, it will throw an error if accessed.
  ```JavaScript
  typeof aLet
  let aLet
  // Uncaught ReferenceError: Cannot access 'aLet' before initialization
  ```
  ```JavaScript
  typeof aConst
  const aConst = 'hello world'
  // Uncaught ReferenceError: Cannot access 'aConst' before initialization
  ```
  ```JavaScript
  typeof aConst2
  const aConst2
  // Uncaught SyntaxError: Missing initializer in const declaration
  ```


### console.log((0.1+0.2) === 0.3)的結果是什麼？
- false
- 雖然人眼看到的是0.1、0.2與0.3，但因為計算機是二進位制，所以實際上小數點後面（人眼看不到的地方）會有誤差，0.1加上0.2之後不會「剛好」等於0.3，故結果會是false
- 解決方式：
  可以先（乘以10）變為整數後再進行運算（直接避免使用浮點數做運算）
  ```JavaScript
  console.log(((0.1*10 + 0.2*10)/10) === 0.3) // true
  ```
  運算完畢後使用`.toPrecision(1)`讓結果為小數點後一位，再使用`parseFloat()`將型別轉回`Number`
  ```JavaScript
  console.log(parseFloat((0.1+0.2).toPrecision(1)) === 0.3) // true
  ```
  或是使用現有的套件，比如[mathjs](https://www.npmjs.com/package/mathjs)


### 什麼是hoist？
- JavaScript engine在creation phase解析程式碼時，從上到下將程式碼中所有的函數與變數放進記憶體（allocate in memory space）的過程
- 透過var宣告的變數在hoisting階段會被賦予值`undefined`，並且可以在宣告前就被取用；而透過`const`與`let`宣告的變數要在「被執行到的時候」才會被賦值，並且無法在被執行之前取用（Temporal Dead Zone）
  ```JavaScript
  console.log(v) // 輸出undefined，不會報錯
  var v = 'hello world'
  ```
  ```JavaScript
  console.log(c) // Uncaught ReferenceError: c is not defined
  const c = 'hello again'
  ```
  備註：參考MDN，各家瀏覽器的錯誤訊息有所差異；分別是`ReferenceError: Cannot access 'c' before initialization (Edge)`、`ReferenceError: can't access lexical declaration 'c' before initialization (Firefox)`與`ReferenceError: 'c' is not defined (Chrome)`


### undefined、null與not defined之差異？
- `undefined`：由JS engine賦予，在var或let變數已經被宣告但還沒有值的時候，先賦`undefined`予透過這兩個關鍵字宣告的變數
- `null`：代表「空、什麼都沒有」的值
- `not defined`：根本「沒有被定義」


### 以下兩種宣告函數的方式有何差異？
```JavaScript
console.log(bar())
console.log(foo())

function bar () {
  return 'bar'
}

var foo = () => {
  return 'foo'
}
```
- 分別會輸出`bar`與報錯`TypeError: foo is not a function`
- 儲存function express的變數`foo`在hoisting階段其值會是`undefined`，而`undefined`無法被調用（invoked），所以會出現TypeError
- function statement在creation phase經hoisting後其code部分就被保存在JS engine的記憶體中，可以在程式碼執行到該內容前就被調用


### 請列出以下輸出結果
```JavaScript
let bar = true
console.log(bar + 0)
console.log(bar + 'hello world')
console.log(bar + true)
console.log(bar + false)
```
- 強制轉型概念題，輸出結果由上到下分別為1、truehello world、2與1
- 若加號兩側皆為primitive type且有字串型別（`string`）的情況下，兩邊皆轉型為字串；不符合前述條件的話轉數字（`number`）
  - 參考MDN範例：
    ```JavaScript
    // String + String -> concatenation
    'foo' + 'bar' // "foobar"

    // Number + String -> concatenation
    5 + 'foo' // "5foo"

    // String + Boolean -> concatenation
    'foo' + false // "foofalse"
    ```
    ```JavaScript
    // Number + Number -> addition
    1 + 2 // 3

    // Boolean + Number -> addition
    true + 1 // 2

    // Boolean + Boolean -> addition
    false + false // 0
    ```
  - 轉型成`string`就左右串連起來，如果是`number`就左右相加
- 備註：if statement、while statement與`==`也會觸發隱性的強制轉型
- 備註：也可有以下操作
  ```JavaScript
  let n = '123'
  console.log(typeof +n) // number
  ```


### 何謂IIFE
- 立即執行函數（Immediately Invoked Function Expression），使用括號包裹一函數並在其後加上另一組括號；如其名稱所表示，會「立即」執行括號中的函數
  ```JavaScript
  (() => { console.log('hello world') })()
  // 會直接輸出'hello world'
  ```
- 可透過IIFE限制變數的存活範圍（execution context結束，變數跟著進回收區），避免變數污染的問題


## 第二週題目串
### 何謂閉包（closure）
- 代表函數本身，以及他當時reference到的作用環境
- 即使該函數已經執行完畢，依存該函數的變數依舊可以被取用（透過scope概念，現在的環境找不到，就往外層找）
- 閉包儲存的位置是heep memory
  ```JavaScript
  // 經典範例：function return function
  function add (a) {
    return function (b) {
      return a + b
    }
  }
  const addFunction = add(3)
  console.log(addFunction(4)) // 7
  ```
- 需注意閉包使用過度會有memory leak的問題，因為JS引擎不會主動處理掉閉包


### 寫出一函數，使console.log(mul(2)(3)(4))為24，console.log(mul(4)(3)(4))為48
- 解法如下，closure與scope概念的應用：
  ```JavaScript
  const mul = a => b => c => a * b * c
  // 從 const mul = (a) => (b) => (c) => { return a * b * c } 優化而來
  ```
  ```JavaScript
  function mul (a) {
    return function (b) {
      return function (c) {
        return a * b * c
      }
    }
  }
  ```


### 如何檢查一個變數的型別？
- `typeof`
  ```JavaScript
  // 但須注意地雷
  console.log(typeof []) // object
  console.log(typeof null) // object
  console.log(typeof function f () {}) // function，並非object
  console.log(typeof undefined) // undefined
  ```
- `Object.prototype.toString.call()`
  ```JavaScript
  console.log(Object.prototype.toString.call([])) // [object Array]
  console.log(Object.prototype.toString.call(null)) // [object Null]
  console.log(Object.prototype.toString.call(function f () {})) // [object Function]
  console.log(Object.prototype.toString.call(undefined)) // [object Undefined]
  ```


### call by reference與call by value之差異
- JS中除了primitive type以外的型別皆是call by reference
- 將primitive type賦值給另外一個變數的話，該資料會被拷貝；但如果將primitive type以外的值賦予另外一個變數的話，賦予的是記憶體中的位置


### 如何拷貝一個陣列或物件
- for loop
- 展開運算子（`[...]`或`{...}`），但僅限於一層的陣列或物件，無法處理巢狀結構
- `Array.prototype.slice()`
  ```JavaScript
  const arr1 = [1, 2, 3]
  const arr2 = arr1.slice()
  arr1.push(4)
  console.log(arr2) // [1, 2, 3]
  ```
- `Array.prototype.concat() `
  ```JavaScript
  const arr1 = [1, 2, 3]
  const arr2 = arr1.concat()
  arr1.push(4)
  console.log(arr2) // [1, 2, 3]
  ```
- `Object.assign()`或`Array.prototype.map()`
  ```JavaScript
  const obj1 = { a: 'apple' }
  const obj2 = Object.assign({}, obj1)
  obj1.b = 'banana'
  console.log(obj2) // { a: 'apple' }

  const arr1 = [1, 2, 3]
  const arr2 = arr1.map(x => x)
  arr1.push(4)
  console.log(arr2) // [1, 2, 3]
  ```
- 深拷貝：`JSON.stringify()`搭配`JSON.parse()`，但注意此方式無法處理包含function的陣列、物件
  ```JavaScript
  const obj1 = { a: 'apple' }
  const obj2 = JSON.parse(JSON.stringify(arr1))
  obc1.b = 'banana'
  console.log(obj2) // { a: "apple" }
  ```


### 請回答以下程式碼輸出結果
```JavaScript
let pay = '1000';

(() => {
  console.log(`origin pay is ${pay}`);
  var pay = '5000';
  console.log(`new pay is ${pay}`);
})();
```
- 分別是`origin pay is undefined`與`new pay is 5000`
- IIFE、scope與hoisting概念題
- 最外層的let pay沒有任何影響，IIFE中的var pay經hoisting可先取用（access），但值只會取到`undefined`，直到執行到`var pay = 5000`後才會輸出`new pay is 5000`


### 什麼是this
- JS engine在creation phase會自動建立的物件，（在非strict情況下）**預設`this`會指向目前的執行環境（execution context）**
- object中的method中的this會直接指向該object，但需注意即使是位在object中，**arrow function的this還是會直接指向global object**
  ```JavaScript
  console.log(this) // Window

  const obj = {
    firstName: 'Charlie',
    lastName: 'Wang',
    greet: function () {
      console.log(`Hello ${this.firstName}`)
      function nestInGreet() {
        console.log(`this in nestInGreet: ${this}`)
      }
      nestInGreet()
    },
    greetArrow: () => {
      console.log(`Hello ${this.firstName}`)
    }
  }

  obj.greet()
  // 'Hello Charlie'
  // 'this in nestInGreet: [object Window]'
  // undefined
  ```
- 可透過`apply()`、`bind()`與`call()`綁給指定目標
- 需注意arrow function的`this`乃是根據其被建立的scope決定（MDN: Arrow functions establish "this" **based on the scope the Arrow function is defined within**.），也無法透過`apply()`、`bind()`與`call()`調整目標


### apply()、bind()與call()的差異
- `apply()`與`call()`皆會讓函數在綁定後馬上執行，`apply()`接受陣列做為參數
- `bind()`僅執行綁定，並回傳一個綁定後的函數
  ```JavaScript
  const obj = {
    firstName: 'Charlie',
    lastName: 'Wang'
  }

  function greet (a, b) {
    return `${a} ${this.firstName}, ${b}`
  }

  console.log(greet.call(obj, 'Hello', 'how are you?')) // Hello Charlie, how are you?
  console.log(greet.apply(obj, ['Hello', 'how are you?'])) // Hello Charlie, how are you?
  const bindGreet = greet.bind(obj)
  console.log(bindGreet('Hello', 'how are you?')) // Hello Charlie, how are you?
  ```


## 第三週題目串
### 以下程式碼的輸出結果為？
```JavaScript
var hero = {
  _name: 'John Doe',
  getSecretIdentity: function () {
    return this._name
  }
}

var stoleSecretIdentity = hero.getSecretIdentity
console.log(stoleSecretIdentity())
console.log(hero.getSecretIdentity())
```
- `undefined`與`John Doe`
- `stoleSecretIdentity`執行時的`this`指向global object中的`_name`，因沒有賦予值所以回傳`undefined`
- `hero.getSecretIdentity`執行時回傳hero的`_name`，為`John Doe`
- 備註：這裡在hero中使用`_name`是因為瀏覽器的global object中本身就有`name`這個值了，所以命名為`_name`避免覆蓋


### 箭頭函數的特性
- 匿名
- 箭頭函數的`this`固定指向該箭頭函數的執行環境（execution context）
- `apply()`、`bind()`與`call()`對其無效
- 沒有`arguments`
  ```JavaScript
  (function (a) { console.log(arguments) })()
  // Arguments [callee: ƒ, Symbol(Symbol.iterator): ƒ]
  
  ((b) => { console.log(arguments) })()
  // Uncaught ReferenceError: arguments is not defined
  ```


### console.log(0 && 1 || 1 && 2)的輸出結果為何
- `2`，拆解如下：
  - 先處理`1 && 2`，結果為2
  - 再處理`0 && 1`，結果為0
  - 最後比較`0 || 2`，得到2
- 參考MDN說明：
  > [Logical AND (expr1 && expr2)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND): If **expr1 can be converted to true**, **returns expr2**; else, returns expr1.
  > [Logical OR (expr1 || expr2)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_OR): If **expr1 can be converted to true**, **returns expr1**; else, returns expr2.


### JS如何處理非同步？
- JS的本質是**single thread**，而在瀏覽器環境中的非同步任務會由web API處理；非同步的callback function會被推到queue中，當**event loop**確認stack清空後才會開始執行queue中累積的任務
- 常見的非同步任務如setTimeout、promise、以及DOM manipulation


### 什麼是promise？
- 讓一個非同步任務執行完畢後回傳「一個」結果，結果只會是成功或失敗
- 簡單範例：
  ```JavaScript
  const myPromise = new Promise((resolve, reject) => {
    const r = Math.floor(Math.random() * 10)
    if (r > 5) {
      resolve('成功')
    } else {
      reject('失敗')
    }
  })

  myPromise
    .then(result => console.log(result))
    .catch(error => console.log(error))
  ```


### 以下程式碼的輸出結果為何？
#### 第一題
```JavaScript
function promiseF(num, time = 500) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      num ? resolve(`${num}, success`) : reject('fail')
    }, time)
  })
}

promiseF(0)
  .then(value => console.log(value))
  .catch(error => console.log(error))
```
- fail，傳入`0`在`num ? resolve() : reject()`這裏會進入`reject()`，所以最後輸出`fail`
- 重點：`0`強制轉型為`false`


#### 第二題
```JavaScript
const p = new Promise((resolve, reject) => {
  console.log(1)
  resolve(5)
  console.log(2)
  reject(6)
})

p
  .then(value => {
    console.log(value)
    console.log(3)
  })
  .catch(error => {
    console.log(error)
  })

console.log(4)
```
- 依序輸出`1`、`2`、`4`、`5`、`3`
- 解釋：
  - 先輸出執行p（同步）的1與2
  - 執行同步的`console.log(4)`
  - 執行`resolve`的結果5與3
  - p到`resolve`就結束了，不會進入`reject`
- 提示：Promise也只是個物件，所以宣告p的時候，裡面的console.log就跟著執行


#### 第三題
```JavaScript
setTimeout(() => alert('timeout!'))
Promise.resolve().then(() => alert('promise!'))
alert('global alert!')
```
- 先`global alert!`，接著`promise!`，最後`timeout!`
- 瀏覽器的event loop會先處理stack中的任務，接著處理「所有」的microtasks，最後才處理queue中的任務


#### 第四題
```JavaScript
console.log(1)

setTimeout(() => {
  console.log(2)
  Promise.resolve().then(() => console.log(3))
}, 0)

new Promise((resolve, reject) => {
  console.log(4)
  resolve(5)
}).then(data => console.log(data))

setTimeout(() => {
  console.log(6)
}, 0)

console.log(7)
```
- `1`、`4`、`7`、`5`、`2`、`3`、`6`
- 解釋：
  - 輸出同步的1
  - 輸出new Promise物件內部同步的4
  - 輸出同步的7
  - 輸出micortask Promise的5
  - 輸出第一個`setTimeout`的結果2
  - 因micortask在event loop中的優先度較高，輸出3
  - 最後輸出第二個`setTimeout`的結果6


{% figure figure--center 2021/js-interview-questions/browser-event-loop.png "'Browser event loop chart'" %}


## 參考文件
- [JS模擬面試讀書會(2021/7月版)](https://hackmd.io/XM6PlGD-ST-EDBkR_nH5Sg)
- [Are variables declared with let or const hoisted?](https://stackoverflow.com/questions/31219420/are-variables-declared-with-let-or-const-hoisted)
- [A Tricky JavaScript Interview Question Asked by Google and Amazon](https://medium.com/coderbyte/a-tricky-javascript-interview-question-asked-by-google-and-amazon-48d212890703)
- [MDN: typeof](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof)
- [Is floating point math broken?](https://stackoverflow.com/questions/588004/is-floating-point-math-broken)
- [MDN: ReferenceError: can't access lexical declaration 'X' before initialization](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cant_access_lexical_declaration_before_init)
- [MDN: Addition (+)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Addition)
- [MDN: Arrow function expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)