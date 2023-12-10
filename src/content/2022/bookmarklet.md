---
title: 瀏覽器上的 JavaScript snippet：bookmarklet
date: 2022-04-19 18:53:34
tag:
  - [Browser]
  - [JavaScript]
---

## 總結

> A small software application **stored as a bookmark** in a web browser, which typically allows a user to interact with the currently loaded web page in some way.

> Bookmarklets are browser bookmarks that **execute JavaScript instead of opening a webpage**.

bookmarklet 是一種點擊後會執行 JavaScript 而非開啟頁面的（特殊）書籤
近期的應用情境：點擊該 bookmarklet 後將 `// eslint-disable-line` 複製到剪貼簿中（因開發時有臨時、一次性的單行註解需求，但註解頻率沒有高到需要將整個專案的 eslint 設定改寫，故改為有需求時切回瀏覽器點擊 bookmarklet 取得單行註解）

## 筆記

### 技術背景

- Web browsers use URIs for the href attribute of the `<a>` tag and for bookmarks. The URI scheme, such as `http:`, `file:`, or `ftp:`, **specifies the protocol and the format for the rest of the string**. URI 本身的 scheme 旨在定義該字串屬於哪一種 protocol
- Browsers also implement a prefix `javascript:` that to a parser is just like any other URI. Internally, the browser sees that the specified protocol is javascript, **treats the rest of the string as a JavaScript application which is then executed**, and uses the resulting string as the new page. 而瀏覽器實作的 `javascript:` 前綴使得在此之後的字串被當作 JavaScript 來處理
- The executing script has access to the current page, which it may inspect and change. If the script **returns an `undefined` type** (rather than, for example, a string), the browser **will not load a new page**, with the result that the script simply runs against the current page content. This permits changes such as in-place font size and color changes without a page reload. 放在書籤中的 JavaScript 執行完畢後如果回傳 `undefined` 的話，就不會載入新的頁面
  - 在 Chrome ver. 100.0.4896.88 (Official Build) (x86_64) 上測試的結果是，只有在回傳的資料型態是 string 的情況下會刷新畫面內容（該頁面的內容會被回傳的 string 直接取代掉）
  - 在回傳的資料型態不是 string 時，頁面內容不會有任何更動

### 實作

<script src="https://gist.github.com/tzynwang/6efb52cdb234eb2051871151145ddfe8.js"></script>

將此內容複製到書籤的 URL 欄位中，存檔後點擊該書籤，即可複製註解內容 `// eslint-disable-line`

## 參考文件

- [Wiki: Bookmarklet](https://en.wikipedia.org/wiki/Bookmarklet)
- [What are Bookmarklets? How to Use JavaScript to Make a Bookmarklet in Chromium and Firefox](https://www.freecodecamp.org/news/what-are-bookmarklets/)
- [Function as Google Chrome bookmark](https://stackoverflow.com/questions/18872679/function-as-google-chrome-bookmark)
- [Bookmarklet Creator with Script Includer](https://mrcoles.com/bookmarklet/)
