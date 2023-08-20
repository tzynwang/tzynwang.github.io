---
layout: '@Components/SinglePostLayout.astro'
title: 正規表達式筆記：群與反向參考（groups and backreferences）
date: 2023-05-09 19:11:06
tag:
  - [Regular expressions]
---

## 總結

此篇是關於正規表達式「群（groups）」與「反向參考（backreferences）」的相關筆記。

## 筆記

### 文法

- 群：使用 `()` 來建立；加上 `(?<group-name>)` 可以為該群命名，名稱即是 `<>` 中的內容；如果寫成 `(?:)` 則代表「比對 `()` 中的內容，但不需記憶之」
- 反向參考：可寫為 `\n` 或 `\k<group-name>`，前者代表使用 group index 、後者代表使用群的名稱來進行參考

### MDN 範例解讀

```ts
const personList = `First_Name: John, Last_Name: Doe
First_Name: Jane, Last_Name: Smith`;

const regexpNames = /First_Name: (\w+), Last_Name: (\w+)/gm;
const matchResults = [...personList.matchAll(regexpNames)];
for (const match of matchResults) {
  console.log(`Hello ${match[1]} ${match[2]}`);
  // Hello John Doe
  // Hello Jane Smith
}
```

說明：

- `regexpNames` 中有兩個群，第一個是 `First_Name:` 後出現的單字，第二個是 `Last_Name:` 後出現的單字
- `matchResults` 會包含兩組 `match` ，內容如下：
  - `["First_Name: John, Last_Name: Doe", "John", "Doe"]`
  - `["First_Name: Jane, Last_Name: Smith", "Jane", "Smith"]`

執行 `console.log` 時可透過 `match[1]` 取出 `First_Name` 、透過 `match[2]` 取出 `Last_name`

補充說明：

- `String.prototype.matchAll()` 的回傳內容為「一個可迭代的物件，此物件中的每一個項目與 `RegExp.prototype.exec()` 有相同的 shape」
- `RegExp.prototype.exec()` 在比對成功時，回傳的陣列內容依序為
  - 第 0 個項目：比對到的字串
  - 此後依序為「群的內容」
  - 可透過關鍵字 `index` 來取得「比對到的字串的 index 位置」
  - 可透過關鍵字 `input` 來取得「被拿來比對的原始字串」
  - 可透過關鍵字 `groups` 搭配「群的名字（若有命名的話）」來取得「該群的內容」，可參考下方範例

```ts
const personList = `First_Name: John, Last_Name: Doe
First_Name: Jane, Last_Name: Smith`;

const regexpNames =
  /First_Name: (?<firstName>\w+), Last_Name: (?<lastName>\w+)/gm;
const matchResults = [...personList.matchAll(regexpNames)];
for (const match of matchResults) {
  console.log(`Hello ${match.groups.firstName} ${match.groups.lastName}`);
  // Hello John Doe
  // Hello Jane Smith
}
```

---

```ts
const quote = `Single quote "'" and double quote '"'`;
const regexpQuotes = /(['"]).*?\1/g;
for (const match of quote.matchAll(regexpQuotes)) {
  console.log(match[0]);
  // "'"
  // '"'
}
```

說明：

- `(['"])` 代表比對 `'` 或 `"`，並把這兩個符號設定為「第一個群（無命名）」
- `.*?` 代表比對任何字元，數量為零至無限，且「一找到就停止繼續尋找」
- `\1` 代表反向參考時要參考「第一個群」

總結：尋找同為 `'` 或 `"` 開頭＋結尾的字串內容

可透過 `\k<group-name>` 來透過群名進行反向參考，範例如下：

```ts
const quote = `Single quote "'" and double quote '"'`;
const regexpQuotes = /(?<sign>['"]).*?\k<sign>/g;
for (const match of quote.matchAll(regexpQuotes)) {
  console.log(match[0], match.groups.sign);
  // "'" "
  // '"' '
}
```

---

```ts
const code = `function add(x, y) {
  return x + y;
}`;
const functionRegexp =
  /(function\s+)(?<name>[$_\p{ID_Start}][$\u200c\u200d\p{ID_Continue}]*)/du;

const match = functionRegexp.exec(code);
console.info(match);
// ["function add", "function ", "add"]
// groups: { name: 'add' }
// index: 0
// indices: [[0, 12], [0, 9], [9, 12], groups: { name: [9, 12] } ]

const lines = code.split('\n');
lines.splice(
  1,
  0,
  ' '.repeat(match.indices[1][1] - match.indices[1][0]) +
    '^'.repeat(match.indices.groups.name[1] - match.indices.groups.name[0])
);
console.log(lines.join('\n'));
// function add(x, y) {
//          ^^^
//   return x + y;
// }
```

說明：

- `functionRegexp` 會挑出 JavaScript 功能與其功能名，後綴 `d` 與 `u` 代表此次比對要回傳 `indices` 且要比對完整 unicode
- `match.indices` 包含所有比對到的（子）字串的 index 位置，並且本次有對群進行命名，故陣列中還會納入 groups 資訊，提供命名群的 index 位置

總結：印出原始字串第一行，於第二行印出「與功能名（含空格）等長的空白」，接著「印出與功能名等量的 `^` 符號」，最後再接著印完功能剩下的內容

## 參考文件

- [MDN Regular expressions > Groups and backreferences](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions/Groups_and_backreferences)
- [MDN: String.prototype.matchAll() > Return value](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/matchAll#return_value)
- [MDN: RegExp.prototype.exec() > Return value](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec#return_value)
- [JAVASCRIPT.INFO Regular expressions > Capturing groups](https://javascript.info/regexp-groups)
- [JAVASCRIPT.INFO Regular expressions > Backreferences in pattern: \N and \k<name>](https://javascript.info/regexp-backreferences)
