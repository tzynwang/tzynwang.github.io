---
title: 正規表達式筆記：量詞（quantifiers）
date: 2023-05-01 12:49:38
categories:
  - [Regular expressions]
---

## 總結

在使用正規表達式比對字串時，可搭配量詞（quantifiers）來設定比對內容長度。此篇筆記大部分是參考 [MDN: Regular expressions > Quantifiers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions/Quantifiers) 整理出來的內容。

## 筆記

### 各種量詞與文法

`x*`：比對 `x` ，允許 `x` 的數量為「零至無限多」。以 `app*` 為例，會在 `apple` 中挑出 `app`、在 `ape` 中挑出 `ap`。

`x+`：比對 `x` ，允許 `x` 的數量為「一至無限多」。以 `app*` 為例，會在 `apple` 中挑出 `app`、但在 `ape` 中不會挑出任何符合模式的字串。

`x?`：比對 `x` ，允許 `x` 的數量為「零」或「一」。以 `e?le?` 為例，會挑出 `angel` 中的 `el`、挑出 `angle` 中的 `le`。

`x{n}`：當 `n` 為正整數時，比對 `x` 並允許出現的數量為「正好 `n` 個」。以 `p{2}` 為例，會挑出 `apple` 中的 `pp`、但在 `ape` 中不會挑出任何符合模式的字串。

`x{n,}`：當 `n` 為正整數時，比對 `x` 並允許出現的數量為「至少（含） `n` 個」。以 `p{2,}` 為例，會挑出 `apple` 中的 `pp`、挑出 `appple` 中的 `ppp`。

`x{n,m}`：當 `n` 與 `m` 為正整數且 `m > n` 時，比對 `x` 並允許出現的數量為「至少 `n` 個，最多 `m` 個，且超過 `m` 的數量不會被挑中」。以範例 `p{2,4}` 來說：

- `apple` 會挑出 `pp`
- `appple` 會挑出 `ppp`
- `apppple` 會挑出 `pppp`
- `appppple` 總共有五個 `p`，但僅會挑出 `pppp`

---

額外規則：將 `?` 接續在上述各種量詞後面時（比如 `x*?` 、 `x+?` 或 `x??`），會取消量詞的 greedy 效果。量詞在沒有額外搭配 `?` 時會「盡可能選取所有符合規則的字符」，但如果量詞搭配了 `?`，原本的「找到全部（greedy）」會變成「有找到就停止（non-greedy, lazy）」。

> MDN: By default quantifiers like `*` and `+` are "greedy", meaning that they try **to match as much of the string as possible**. The `?` character after the quantifier makes the quantifier "non-greedy": meaning that it will **stop as soon as it finds a match**.

舉例：

- 以 `p+` 與 `p+?` 來說，`p+` 會挑出 `apple` 中的 `pp`，但換成 `p+?` 後，只會挑出 `apple` 中的「第一個 `p` 字符」
- 以字串 `<foo> <bar> new </bar> </foo>` 來說，使用 `<.*>` 會挑中「一整個字串」，因 `<` 與 `>` 中間允許「零至無限多」的「行終止符（line terminator）以外的字元」；但當表達式換成 `<.*?>` 後，僅會有 `<foo>` 被挑中。

注意 lazy 效果與 global flag 是兩回事，如果將 `/<.*?>/` 改為 `/<.*?>/g` 的話，整個 `<foo> <bar> new </bar> </foo>` 字串中會有 `<foo>` 、 `<bar>` 、 `</bar>` 與 `</foo>` 被挑中。

### MDN 範例解讀

```ts
const wordEndingWithAs = /\w+a+\b/;
```

- `\w+` 代表「一至無限多個」的「拉丁英數與底線符號」
- `a+` 代表「一至無限多個」的 `a`
- `\b` 代表「邊際」（word boundary）

總結：尋找「任意拉丁英數與底線符號」開頭、中間帶有「一至無限個 `a` 字母」且「以字母 `a` 結尾」的內容

---

```ts
const singleLetterWord = /\b\w\b/g;
const notSoLongWord = /\b\w{2,6}\b/g;
const longWord = /\b\w{13,}\b/g;
```

- `singleLetterWord` 為「長度為 1 的單字」
- `notSoLongWord` 為「長度介於 2 至 6 個字母」的單字
- `longWord` 為「至少包含 13 個字母」的單字

---

```ts
const regexpEnding = /\w+ou?r/g;
```

- `\w+` 代表「一至無限多個」的「拉丁英數與底線符號」
- `ou?r` 代表字母 `o` 後面可有、可沒有字母 `u`
- 撞到字母 `r` 時，就結束抓取（因為 `r` 後方沒有再接其他條件）

以上述條件來說，會抓取 `for` 與 `four` 這兩個完整的單字、不會抓取 `fou` 、會抓取 `fourty` 中的 `four` 部分。

---

```ts
const greedyRegexp = /[\w ]+/;
const nonGreedyRegexp = /[\w ]+?/;
```

- `[\w ]+` 代表要尋找「拉丁英數與底線符號」以及「空白鍵」，搭配 `+` 讓字符數量可為「一至無限多個」
- 加上 `?` 後，會在「找到第一個符合條件的字串」後，就視為「找到」

以字串 `You must be getting somewhere near the center of the earth.` 來說：

- 條件 `greedyRegexp` 會找到一整串除了結尾句號以外的內容，即是 `You must be getting somewhere near the center of the earth`
- 條件 `nonGreedyRegexp` 會在找到開頭的 `Y` 之後就視為「找到」，並回傳這個單獨的 `Y`

## 參考文件

- [MDN: Regular expressions > Quantifiers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions/Quantifiers)
