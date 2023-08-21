---
layout: '@Components/pages/SinglePostLayout.astro'
title: 正規表達式筆記：字元類（character classes）
date: 2023-04-30 14:26:01
tag:
  - [Regular expressions]
---

## 總結

此篇文章大部分的內容是根據 [MDN: Regular expressions > Character classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions/Character_classes) 整理出來的筆記。

## 筆記

### 定義

> javascript.info: In JavaScript regular expressions, a character class is a special notation that **matches any symbol from a certain set**.

character class 讓開發者可以定義「字元比對的範疇」。

### 各種範疇與文法

`[]`：根據 `[]` 內列出的條件進行比對。舉例：`[abc]` 會挑出 `apple` 中的 `a`、`banana` 中的 `b` 與 `a`，以及 `cherry` 中的 `c`

`[^]`：當 `^` 被放在 `[]` 中，其意義為「尋找不在 `[]` 範圍內的字符」。舉例：`[^abc]+` 會挑出 `apple` 中的 `pple`、`banana` 中的 `n`，以及 `cherry` 中的 `herry`

以上條件可搭配 `-` 字符進行範圍搜尋，但如果是由 `-` 開頭或結尾，則 `-` 會被當作字符進行比對。範例如下：

- `[a-z]` 代表「尋找 a 至 z 這個範圍」，比如 `Apple` 會挑出 `p` 、 `p` 、 `l` 與 `e`
- `[^a-z]` 代表「尋找非 a 至 z 這個範圍」，比如 `Apple` 會挑出 `A`
- `[-t]` 代表「尋找符合 `-t` 的內容」，比如 `apple-pie` 會挑出 `-`，而 `apple-tea` 會挑出 `-` 與 `t`

`.` 會根據擺放位置會有兩種用途，範例如下：

- 擺在 `[]` 中：視為比對 `.` 字元，比如 `[.]` 會挑出 `3.14` 中的 `.`
- 沒有包含在 `[]` 中：代表「行終止符（line terminator）**以外**的字元」，比如 `.y+` 會判定 `my` 與 `cherry` 這兩個單字符合比對條件，但不會判定 `yes` 符合，因為 `yes` 中的 `y` 前方**有**行終止符

`\d`：意義等同 `[0-9]`，代表尋找阿拉伯數字

`\D`：代表「非數字內容」，比如比對 `3.14` 時會挑出 `.`

`\w`：意義等同 `[A-Za-z0-9_]`，會尋找拉丁英數與底線符號

`\W`：代表「非拉丁英數、非底線」內容，比如比對 `2%` 時會挑出 `%`，而 `\W+` 會挑出 `笑死XD` 中的 `笑死`

`\s`：意義等同 `[\f\n\r\t\v\u0020\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]`，用於比對「空白字元」

`\S`：代表「非空白字元」的內容，比如拿條件 `\S+` 比對 `hello world` 會挑出 `hello` 與 `world`

`\` 為跳脫字符，搭配特殊字元可讓該字元失去原本的特殊效果、反之亦然。範例如下：

- 將 `\d` 變成 `\\d` 後，後者的意義不再是「比對阿拉伯數字」，而是變成「比對 `\d` 此字串模式」
- 如果是 `d` 變成 `\d`，則從原本的「比對字母 `d`」變成「比對阿拉伯數字」

`|` 為邏輯上的「或（or）」比對。比如 `green|red` 代表「尋找 `green` 或 `red` 這個模式的字串」

### MDN 範例解讀

```ts
const regexpFourDigits = /\b\d{4}\b/g;
```

- `\b` 代表邊際
- `\d{4}` 代表要尋找「數量為 4 個」的阿拉伯數字

總結：比對「前後都是『邊際』且『數量為 4 個』的阿拉伯數字串」。

---

```ts
const regexpWordStartingWithA = /\b[aA]\w+/g;
```

- `\b` 代表邊際
- `[aA]` 代表尋找 `A` 或 `a`
- `\w+` 代表要找「數量為 1 或無限多」的「拉丁英數與底線符號」

總結：比對「開頭為 `A` 或 `a` 的單字」

---

```ts
const regexpVowels = /[AEIOUYaeiouy]/g;
```

意圖：比對「發母音的字符」

## 參考文件

- [MDN: Regular expressions > Character classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions/Character_classes)
- [Phind: What does 'character class' mean in JavaScript regular expressions?](https://www.phind.com/search?cache=e6435c56-0a75-4626-9246-bdd356d0ab82)
- [國家教育研究院：字元類](https://terms.naer.edu.tw/detail/4c5f3bec4224ee86a2ccd3cf7be3c0fe/?seq=1)
- [國家教育研究院：行終止符](https://terms.naer.edu.tw/detail/36032540b9f5d14f5bac72ac7ce0269d/?seq=1)
