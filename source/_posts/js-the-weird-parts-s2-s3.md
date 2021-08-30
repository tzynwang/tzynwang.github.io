---
title: 「JavaScript Understanding the Weird Parts」第二、三章筆記
date: 2021-08-30 15:29:47
categories:
- JavaScripts
tags:
---

## 總結
如題，記錄下課程中提到的相關關鍵字與額外補充的筆記

## Section 2: Execution contexts and lexical environments
## Syntax parser
- A program that reads your code, and determines what the code does and if code's **grammar is valid**.
- There's a **compiler** or an **interpreter** between the code you write and the computer (who runs your code), and **part of that is a syntax parser**.


[What's in an Interpretation?](https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/get-started/ch1.md#whats-in-an-interpretation)
- The real reason it matters to have a clear picture on whether JS is interpreted or compiled relates to **the nature of how errors are handled**.
- In other words, parsed languages usually also **perform code generation before execution**, in spirit, they're compiled languages.
- The answer is closer to yes than no. The parsed JS is converted to an **optimized (binary) form**, and that "code" is subsequently executed; the engine does not commonly switch back into line-by-line execution mode after it has finished all the hard work of parsing—most languages/engines wouldn't, because that would be highly inefficient.
- The reason that matters is, since JS is **compiled**, we are informed of **static errors** (such as malformed syntax) **before our code is executed**. That is a substantively different interaction model than we get with traditional "scripting" programs, and arguably more helpful!


## Lexical environment
- **Where** you write is important.
- Where you see things written gives you the idea of where it will actually sit in computer's memory, and how it will interact with other variables and functions of the program.

[Lexical environment and function scope](https://stackoverflow.com/questions/12599965/lexical-environment-and-function-scope)
- It's the internal js engine construct that **holds identifier-variable mapping**. Here identifier refers to the **name of variables/functions**, and variable is the reference to **actual object** (including function type object) or **primitive value**.
- A lexical environment also holds a **reference to a parent lexical environment**.


[那些年，我們一起錯過的Javascript系列：JS的二三事](https://ithelp.ithome.com.tw/articles/10192743)
- Lexical Environment在Javascript代表的是，今天我們Code寫在哪個**位置** ，是非常重要的。
- 下面我們看到一個變數`message`位在函式裡面，這變數在字詞上來說就是坐落於、存在於這個函式，**這隻函式就是一個Lexical Environment**。
  ```JavaScript
  function greet() {
    const message = 'hello'
  }
  ```


[Understanding Closures in JavaScript](https://blog.bitsrc.io/a-beginners-guide-to-closures-in-javascript-97d372284dda)
- A Lexical Environment has two components:
  1. the **environment record** and;
  2. a **reference to the outer environment**.


## Execution context
- A wrapper to help manage the code that is running.
- There are a lot of lexical environments, which one is **currently running** is managed via execution context.
- When a code is running in JavaScript, it **runs inside the execution context**.
- **A syntax parser wraps the currently executing code in an execution context.**


[Lexical environment and function scope](https://stackoverflow.com/questions/12599965/lexical-environment-and-function-scope)
- The js engine maintains a execution context stack (or call stack), which contains these contexts and the global execution context stays at the bottom of this stack.
- A **new execution context is created** and pushed to the stack **when execution of a function begins**. 每執行一個function就會建立一個新的execution context

### Creation phase
- In the creation phase of execution context, JavaScript engine will create `global object`, `this` and `outer environment`; also it **allocate memory space for the variables and function**, this is **hoisting**.
- Before you code run line by line, the JS engine has already **set memory space for the variables and functions**.

### Execution phase
- When **value assigning** happens.
  ```jsx
  var msg = 'hello world'

  // creation phase
  var msg // = undefined

  // execution phase
  msg = 'hello world'
  ```
- **Run the codes** you written line by line.

### Global execution context
- When JavaScript engine **parse your code**, it creates the **global execution context**; also it creates `Global Object`, `this` and `outer environment` for you automatically.
- 就算載入一隻完全空白的js檔案，打開Chrome DevTools也可以呼叫出`global object`與`this`

### Global
- Means "**not inside a function**".
- If a code or variable is **not inside a function**, it is **global**.

## undefined
- The **value** that a `var` variable receive during the **creation phase**.

## name-value pair
- A name which **maps to a unique value**.
- Name may be defined more than once, but **only one value** in any given **context**.

## Object (in JavaScript)
- A **collection of name-value pairs**.
- Function is Object, a collection of name-value pairs.

## Invoke function, function invocation
- **Running a function**; in JS we do this by using **parentheses**: `()`
- When a function is invoked, a **new execution context** is created and put on the **execution stack**.

## scope
- Where a variable is **available** in your code.

### block scope
```JavaScript
  {
    let a = 'apple';
    const c = 'cherry';
  }
  console.log(a); // ReferenceError
  console.log(c); // ReferenceError

  {
    var b = 'banana';
  }
  console.log(b); // 'banana'
```

### scope chain
```JavaScript
  function b() {
    console.log(myVar);
  }

  function a() {
    var myVar = 2;
    b();
  }

  var myVar = 1;
  a(); // 1
```
- 上述程式碼會印出1，因為`function b`執行時找不到`myVar`，會依循scope chain到他的親代（reference to the **outer environment**）去尋找此變數，故找到global的`myVar = 1`
- `function b`**沒有**位在`function a`裡面，他的outer lexical environment就是global environment

```JavaScript
  function b(myVar) {
    console.log(myVar);
  }

  function a() {
    var myVar = 2;
    b(myVar);
  }

  var myVar = 1;
  a(); // 這樣才會印出2
```
```JavaScript
  function a() {
    function b() {
      console.log(myVar);
    }

    var myVar = 2;
    b();
  }

  var myVar = 1;
  a(); // 這樣也會印出2
```

## Single threaded
- **One** command at a time.

## Synchronous
- **One** at a time, in **order**.

## Asynchronous
- **More than one** at a time.

## Section 3 Types and Operators
## Dynamic types
- JavaScript engine **figures out the type** of the variable when it runs the code. You don't decide it.

## Primitive type
- Not an object, data that represents a **single value**.
  1. `undefined`
  2. `null`
  3. `Boolean`
  4. `Number`
  5. `String`
  6. `Symbol`


## Operator
- Operators **take two parameters** and **return one result**.
- Just a **special function** that is syntactically written differently (**infix notation**).
  ```JavaScript
  // prefix notation
  +3 4;

  // post notation
  3 4+;

  // infix notation
  3 + 4;
  ```


### Operator precedence
- **Which** operator function gets **called first**.
- 不同的operator之間也是有優先順序的，參考 [Operator precedence - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence)


## Associativity
```JavaScript
var a = 2, b = 3, c = 4;
a = b = c;
console.log(a); // 4
console.log(b); // 4
console.log(c); // 4
// = is right-to-left
```
- In what **order** the operator functions get called: **left-to-right** or **right-to-left**, when functions have the **same precedence**.


```JavaScript
0 || "0" && {}  
```

- 先進行`"0" && {}`，`&&`左側`Boolean("0")`為`true`，故回傳`{}`
- `0 || {}`因`||`左側為`false`，得到最終結果`{}`


## Coercion
- **Converting** a value from one **type** to another.
  ```JavaScript
  Number(undefined) // NaN
  Number(null) // 0

  Boolean(undefined) // false
  Boolean(null) // false
  Boolean("") // false
  Boolean([]), Boolean({}) // true
  ```

```JavaScript
console.log(1 < 2 < 3) // true
console.log(3 < 2 < 1) // true
console.log(3 > 2 > 1) // false
// <, > is left-to-right
```
- `1 < 2`為`true`，`true < 3`轉型為`1 < 3`，得到最終結果`true`
- `3 < 2`為`false`，`false < 1`轉型為`0 < 1`，得到最終結果`true`
- `3 > 2`為`true`，`true > 1`轉型為`1 > 1`，得到最終結果`false`


## 參考文件
- [(Udemy) JavaScript: Understanding the Weird Parts](https://www.udemy.com/course/understand-javascript/)