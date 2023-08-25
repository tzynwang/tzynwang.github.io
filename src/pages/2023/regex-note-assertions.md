---
layout: '@Components/pages/SinglePostLayout.astro'
title: 正規表達式筆記：斷言（assertions）
date: 2023-04-29 16:48:58
tag:
  - [Regular expressions]
---

## 總結

此篇文章是閱讀 [MDN: Regular expressions > Assertions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions/Assertions) 時記下的筆記。

## 筆記內容

### 定義

> MDN: Assertions include **boundaries**, which indicate the beginnings and endings of lines and words, and other patterns indicating in some way that **a match is possible** (including look-ahead, look-behind, and conditional expressions).

assertions 字元讓開發者可以根據「邊際」或「前後符合條件」來進行搜尋。

### 邊際類型（boundary-type assertions）

`^`：比對一段內容的「起點」是否符合 `^` 後面提供的條件。舉例：`/^a/` 會挑中字串 `apple` 中的 `a`，但不會挑中 `banana` 中的 `a`

`$`：比對一段內容的「結尾」是否符合 `$` 前面提供的條件。舉例：`/t$/` 會挑中字串 `cat` 中的 `t`，但不會挑中 `tea` 中的 `t`

`\b` 代表「邊際」（word boundary），範例如下：

- `/\bc/` 會挑中 `cat` 中的 `c`，但不會挑中 `octopus` 中的 `c`
- `/t\b/` 會挑中 `cat` 中的 `t`，但不會挑中 `take` 中的 `t`

`\B` 的作用與 `\b` 相反，代表「非邊際」（non-word boundary）；如果把上方範例中的 `\b` 改為 `\B`，結果就會反過來：

- `/\Bc/` 不會挑中 `cat` 中的 `c`，但會挑中 `octopus` 中的 `c`
- `/t\B/` 不會挑中 `cat` 中的 `t`，但會挑中 `take` 中的 `t`

### 前後條件類型

`x(?=y)`：挑出後方有 `y` 的 `x`。舉例：`apple(?= pie)` 會挑中 `apple pie` 字串中的 `apple`，但不會挑中 `apple tea` 中的 `apple`

`x(?!)y`：挑出後方沒有 `y` 的 `x`。舉例：`apple(?= pie)` 會挑中 `apple tea` 字串中的 `apple`，但不會挑中 `apple pie` 中的 `apple`

`(?<=y)x`：挑出前方有 `y` 的 `x`。舉例：`(?<=apple )pie` 會挑中 `apple pie` 中的 `pie`，但不會挑中 `cherry pie` 中的 `pie`

`(?<!y)x`：挑出前方沒有 `y` 的 `x`。舉例：`(?<!apple )pie` 會挑中 `cherry pie` 中的 `pie`，但不會挑中 `apple pie` 中的 `pie`

### MDN 範例解讀

```ts
buggyMultiline = `tey, ihe light-greon apple
tangs on ihe greon traa`;

buggyMultiline = buggyMultiline.replace(/^t/gim, 'h');
// 將位於每一個「單字開頭」的 t 替換成 h
// 這裡會將 tey 與 tangs 換成 hey 與 hangs

buggyMultiline = buggyMultiline.replace(/aa$/gim, 'ee.');
// 將每一個「單字結束前」的 aa 替換為 ee.
// 這裡會將 greon traa 的 traa 換成 tree

buggyMultiline = buggyMultiline.replace(/\bi/gim, 't');
// 將每一個「前方有字元邊際」的 i 替換為 t
// 這裡會將出現兩次的 ihe 替換為 the

fixedMultiline = buggyMultiline.replace(/\Bo/gim, 'e');
// 將每一個被其他字母包圍的 o 替換為 e
// 這裡會將出現兩次的 greon 替換為 green
```

---

```ts
const fruits = ['Apple', 'Watermelon', 'Orange', 'Avocado', 'Strawberry'];

const fruitsStartsWithA = fruits.filter((fruit) => /^A/.test(fruit));
// 取出「開頭為大寫字母 A」的字串

const fruitsStartsWithNotA = fruits.filter((fruit) => /^[^A]/.test(fruit));
// 取出「開頭『不是』大寫字母 A」的字串
// [^A] 代表「開頭為大寫字母 A」，但搭配 ^ 執行反轉後，條件改為「開頭不為大寫字母 A」
```

---

```ts
const fruitsWithDescription = ['Red apple', 'Orange orange', 'Green Avocado'];

const enEdSelection = fruitsWithDescription.filter((descr) =>
  /(en|ed)\b/.test(descr)
);
// 取出「以 en 或 ed 結尾」的字串
```

---

```ts
const regex = /First(?= test)/g;
```

翻譯：比對出後方緊隨 `test` 的 `First`

若傳入字串 `First test` ，結果會是比對成功
若傳入字串 `First kiss` ，結果會是比對失敗，因為 First 後方接續的不是 `test` 而是 `kiss`

---

```ts
const regex = /\d+(?!\.)/g;
```

翻譯：比對出後方沒有 `.` 的「一個或無限多個阿拉伯數字」（`\d`）

步驟分解如下：

- 先看 `(?!\.)`，這代表「沒有 `.`」
- 再看 `\d+`，`\d` 代表阿拉伯數字，而 `+` 代表「阿拉伯數字可以為 1 至無限多個」

合起來的意思就是「搜尋所有後方沒有出現 `.` 的阿拉伯數字，且這段阿拉伯數字可能為 1 至無限多個」。

舉例：透過此 `regex` 條件搜尋字串 `3.14` 時，回傳出來的比對結果會是 `14`，因 `3` 後方有 `.`，不符合條件；而 `14` 後方沒有 `.`，故比對成功。

注意：如果將條件中的 `+` 拿掉，那麼 `regex` 的意義會變為「後方沒有 `.` 的『一個』阿拉伯數字」。透過此條件比對 `3.14` 時，會回傳兩個數字，分別是 `1` 與 `4`

---

```ts
const orangeNotLemon =
  'Do you want to have an orange? Yes, I do not want to have a lemon!';

const selectNotLemonRegex = /[^?!]+have(?! a lemon)[^?!]+[?!]/gi;
console.log(orangeNotLemon.match(selectNotLemonRegex));
// [ 'Do you want to have an orange?' ]

const selectNotOrangeRegex = /[^?!]+have(?! an orange)[^?!]+[?!]/gi;
console.log(orangeNotLemon.match(selectNotOrangeRegex));
// [ ' Yes, I do not want to have a lemon!' ]
```

分解 `/[^?!]+have(?! a lemon)[^?!]+[?!]/gi` 步驟如下：

- `gi` 代表 global 與 case insensitive，亦即這個條件不會在「找到第一個目標」後就結束搜尋、且也不在意大小寫差異
- `[^?!]+` 代表「並非 `?` 與 `!` 的內容」，並且此內容可能為 1 至無限多個
- `have(?! a lemon)` 代表要搜尋「後方沒有 `a lemon` 的 `have`」
- `[?!]` 代表 `?` 或 `!`

總結 `selectNotLemonRegex` 的意思為：搜尋不是 `?` 與 `!` 的內容（且要有兩段，因為 `[^?!]+` 出現兩次），兩段內容中間要夾帶一個「後方不是 `a lemon` 的 `have`」，最後允許 `?` 或 `!` 做為結尾。

`selectNotOrangeRegex` 僅替換了中間搜尋 `have` 的條件為「後方不是 `an orange`」，其餘邏輯與 `selectNotLemonRegex` 相同。

---

```ts
const oranges = ['ripe orange A', 'green orange B', 'ripe orange C'];
const ripeOranges = oranges.filter((fruit) => /(?<=ripe )orange/.test(fruit));
```

翻譯：比對前方有 `ripe` 的 `orange`。

陣列 `oranges` 中有 `ripe orange A` 與 `ripe orange C` 符合條件；而 `green orange B` 因 `orange` 前方的字串為 `green` 故判定為比對失敗。

## 參考文件

- [MDN: Regular expressions > Assertions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions/Assertions)
- [Phind: What does 'assertions' mean in JavaScript regular expressions?](https://www.phind.com/search?cache=5d897b17-2e84-4343-9f90-3ab6e8a83cbc)
