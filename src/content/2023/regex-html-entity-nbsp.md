---
title: 使用 JavaScript RegExp() 過濾 HTML entity NBSP
date: 2023-02-14 19:20:57
tag:
  - [HTML]
  - [JavaScript]
---

## 總結

最近在實作「將字串中的空白移除」功能時，發現在執行完 `str.replaceAll(/[\u0020\u3000]+/g, '')` 後，資料中還是會有空白字元沒刪乾淨的問題。追查後發現是沒有過濾掉 HTML entity `&nbsp;` 的緣故。此篇文章將簡單筆記一下何謂 `&nbsp;`，並提供最後解決問題時使用的程式碼供參考。

## 筆記

### 關於 HTML entity `&nbsp;`

HTML entity 是一組文字，固定以 `&` 開頭、以 `;` 結尾。通常用來表現保留字元（reserved character）或是不可視（invisible characters）字元。

> [MDN](https://developer.mozilla.org/en-US/docs/Glossary/Entity): An HTML entity is a piece of text ("string") that begins with an ampersand (`&`) and ends with a semicolon (`;`). Entities are frequently used to display **reserved characters** (which would otherwise be interpreted as HTML code), and **invisible characters** (like non-breaking spaces).

`&nbsp;` 是一種不換行字元（non-breaking space），與透過空白鍵敲擊出來的空白不同，此字元會避免「換行」發生。

> [stackOverFlow](https://stackoverflow.com/questions/1357078/whats-the-difference-between-nbsp-and): One is **non-breaking space** and the other is a regular space. A non-breaking space means that the line **should not be wrapped at that point**, just like it wouldn’t be wrapped in the middle of a word.

維基百科的說明如下：

> [Wikipedia](https://en.wikipedia.org/wiki/Non-breaking_space): In word processing and digital typesetting, a **non-breaking space** -- also called NBSP, required space, hard space, or fixed space (though it is not of fixed width) -- is a space character that **prevents an automatic line break** at its position.

在程式碼上還有另一個差異，`&nbsp;` 的 character code 為 `160`，而空白鍵產出的空白字元則是 `32`（參考 [ASCII table](https://www.ascii-code.com/)）。

### 過濾空白的程式碼

程式碼如下。使用 `HTML_ENTITY_SPACE` 的理由是為了給這個特殊字元一個有意義的名字，接著再透過 `new RegExp()` 來組合出「包含半形、全形與 NBSP」的過濾模式即可。

```ts
// 為 `&nbsp;` 建立有意義的變數名稱
const HTML_ENTITY_SPACE = String.fromCharCode(160);

// 透過 new RegExp() 來設定過濾半形、全形以及 HTML entity 空白的 regex 模式，符合此模式的內容將被取代掉
function removeFullAndHalfSpace(rawString: string): string {
  const regexpSpace = new RegExp(`[\u0020\u3000${HTML_ENTITY_SPACE}]`, 'g');
  return rawString.replaceAll(regexpSpace, '');
}
```

## 參考文件

- [MDN: HTML Entity](https://developer.mozilla.org/en-US/docs/Glossary/Entity)
- [MDN: RegExp() constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/RegExp)
- [stackOverFlow: What's the difference between `"&nbsp;"` and `" "`?](https://stackoverflow.com/questions/1357078/whats-the-difference-between-nbsp-and)
- [stackOverFlow: Remove html entities and extract text content using regex](https://stackoverflow.com/questions/26127775/remove-html-entities-and-extract-text-content-using-regex)
- [stackOverFlow: Detect `&nbsp;` and space with JavaScript](https://stackoverflow.com/questions/5308797/detect-nbsp-and-space-with-javascript)
- [stackOverFlow: How do you use a variable in a regular expression?](https://stackoverflow.com/questions/494035/how-do-you-use-a-variable-in-a-regular-expression)
