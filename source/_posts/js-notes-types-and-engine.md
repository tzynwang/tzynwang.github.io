---
title: 2022 第28週 學習筆記：不只是型別
date: 2022-07-16 14:49:22
categories:
- [JavaScript]
tags:
---

## 總結

此篇為影片 [JS Engine fundamentals [AgentConf]](https://youtu.be/0I0d8LkDqyc) 的相關筆記

<iframe width="560" height="315" src="https://www.youtube.com/embed/0I0d8LkDqyc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## 筆記
### typeof null

```js
console.log(typeof null); // 'object'
```

參考 ECMAScript 定義：
- `undefined`: Any variable that **has not been assigned a value** has the value `undefined`.
- `null`: Primitive value that represents the **intentional absence of any object value**.

再搭配 [v8.dev](https://v8.dev/blog/react-cliff) 的解說：
- `undefined` means “no value”.
- `null` means “no object value”.

參考 [stackOverFlow 的討論串](https://stackoverflow.com/a/18808300/15028185)：
- The reasoning behind this is that `null`, in contrast with `undefined`, was (and still is) often used where objects appear. In other words, `null` is often used to signify **an empty reference to an object**.

結論：
- `null` 的意義乃「沒有值的物件」
- 根據 [v8.dev](https://v8.dev/blog/react-cliff) 的圖說，首先是代表「完全沒有值的 `undefined` 」，接著才是代表「沒有值的物件 `null`」
- 大絕：ECMAScript 本身就規範了 `typeof` 在檢驗到 `null` 時要回傳 `object` ，參考 [13.5.3 The typeof Operator](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-typeof-operator)

### typeof number

定義：
- MDN: The JavaScript `Number` type is a **double-precision 64-bit binary format IEEE 754 value**, like double in Java or C#.
- v8.dev: ECMAScript standardizes numbers as **64-bit floating-point values**, also known as double precision floating-point or **Float64**.
  - However, that doesn’t mean that JavaScript engines store numbers in Float64 representation all the time — doing so would be terribly inefficient!
  - Engines can choose other internal representations, as long as the observable behavior matches Float64 exactly.
  - JavaScript engines can choose an **optimal in-memory representation** for such numbers to optimize code (that accesses array elements by index).
- 所有在 JS 世界裡面看到的數字（包括 `42` 這樣的整數）都是 Float64 格式，但 JS 引擎在實作上可以選擇「不」以 Float64 格式來將數字保存在記憶體中

實際上：
- JS 引擎（至少 v8 有如此特性）在處理**只有整數的運算**時會比處理浮點數來的快
  - v8.dev: If both operands are **represented as integers**, the CPU can compute the result very efficiently. V8 has additional fast-paths for the cases where the divisor is a power of two. For values represented as floats, the computation is much **more complex and takes a lot longer**.
  - For small integers in the 31-bit signed integer range, V8 uses a special representation called `Smi`. Anything that is not a `Smi` is represented as a `HeapObject`, which is **the address of some entity in memory**.
- 即使都是 `number` 型態的資料，在實際操作上也可能會有不同的處理方式（參照 v8 引擎的 `Smi` 與 `HeapObject` 這兩種實作方式）

### sensible initial value

建議使用前後連貫的值來建立物件：
  - 舉例：若需要一個物件來保存浮點數，可以在建立該物件時給予一組預設的 `Number.MIN_VALUE` （而非預設為 `0` 再賦予浮點數值）
  - MDN: `Number.MIN_VALUE` is the smallest positive number that **can be represented within float precision**.


## 參考文件
- [v8.dev: The story of a V8 performance cliff in React](https://v8.dev/blog/react-cliff)
- [YouTube: JS Engine fundamentals [AgentConf]](https://youtu.be/0I0d8LkDqyc)
- [MDN: null](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/null)
- [tc39.es: 4.4.15 null value](https://tc39.es/ecma262/multipage/overview.html#sec-null-value)
- [tc39.es: 6.1.1 The Undefined Type](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types-undefined-type)
- [MDN: Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)
- [MDN: Number.MIN_VALUE](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MIN_VALUE)