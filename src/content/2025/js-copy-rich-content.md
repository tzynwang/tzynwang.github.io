---
title: 如何複製帶格式的文字（rich content, rich text copy）
date: 2025-09-07 18:17:45
tag:
- [JavaScript]
banner: /2025/js-copy-rich-content/spider-man-point-each-other.jpg
summary: 終極懶人包：在使用 navigator.clipboard.write 複製網頁上的文字（附帶格式）時，要同時提供 text/html 和 text/plain 型態的內容，不然無法對純文字編輯器進行貼上。
draft: 
---

## 基礎案例

需求大概是這樣的：

> 🥹：我想要一鍵複製網站上特定區塊的內容，然後在貼到 Google Docs 後，要保留超連結和清單格式。

一開始想說好的，你要的就是 rich content/rich text copy，這在 react 的世界也不過就是以下步驟：

1. 先用 `useRef` 來拿到目標容器的 [`Element.innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML)
2. 把上一步拿到的內容拿去給 `ClipboardItem` 建立實例
3. 把上一步拿到的結果餵給 [`navigator.clipboard.write`](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/write)，完事

然而事情並沒有這麼簡單。在實作的過程中發現，我在建立待複製內容的 `ClipboardItem` 實例時，**如果只有提供 MIME Type 為 `text/html` 的內容，那在純文字編輯器裡執行「貼上」時，實際上不會貼出任何資料**。比如以下這段範例：

```ts
const toCopy = new ClipboardItem({
  "text/html": `<ul>
  <li>Milk</li>
  <li>
    Cheese
    <ul>
      <li>Blue cheese</li>
      <li>Feta</li>
    </ul>
  </li>
</ul>`,
});
await navigator.clipboard.write([toCopy]);
```

為了要實現「能貼上帶格式的文字」以及「就算在純文字編輯器裡執行『貼上』，也要貼出對應的純文字內容」，在建立 `ClipboardItem` 實例時，要提供純文字版本的 fallback（**即 MIME Type 為 `text/plain` 的內容**）。比如以下調整後的範例：

```ts
const toCopy = new ClipboardItem({
  "text/html": `<ul><li>Milk</li><li>Cheese<ul><li>Blue cheese</li><li>Feta</li></ul></li></ul>`,
  "text/plain": "- Milk\n- Cheese\n  - Blue cheese\n  - Feta",
});
await navigator.clipboard.write([toCopy]);
```

（🦊：`text/html` 的核心內容沒變，我只是把原本的換行與縮排拿掉而已。）

這樣才能確保使用者不論是在圖文編輯器（rich content/rich text editor）還是純文字編輯器執行貼上時，都能順利地貼出內容。

## 案例：需要額外安插資料

接著我收到了一個追加需求：

> 🥹：我希望使用者點擊特定複製按鈕時，他複製出的資料要加上出處（就是我們的網站）啦～

好的，因為需求不是「在整個網站執行複製時，都要加上出處」，所以只要稍微加工一下待複製的內容就好。可參考以下範例，我使用 `Blob` 分別建構了 `text/html` 和 `text/plain` 版本的待複製內容，並且對兩組資料都加上對應的資料出處（即 `<p>copy from <a href="#">example.com</a></p>` 和 `"copy from example.com"`）：

```ts
const html = new Blob(
  [
    //
    `<ul><li>Milk</li><li>Cheese<ul><li>Blue cheese</li><li>Feta</li></ul></li></ul>`,
    `<p>copy from <a href="#">example.com</a></p>`,
  ],
  { type: "text/html" },
);
const plain = new Blob(
  [
    //
    "- Milk\n- Cheese\n  - Blue cheese\n  - Feta",
    "\n",
    "copy from example.com",
  ],
  {
    type: "text/plain",
  },
);
const toCopy = new ClipboardItem({ "text/html": html, "text/plain": plain });
await navigator.clipboard.write([toCopy]);
```

搞定。

## 案例：複製還未掛載到 HTML DOM tree 的資料

乍聽之下有點荒謬，但這在我們業界~~並不是獎勵~~是一種見怪不怪的事情：

> 🥹：我希望使用者點擊特定複製按鈕時，能順便幫他一起複製我們藏在對話框裡面的補充資訊，當然啦，補充資訊的超連結在貼到 Google Docs 時都要留著喔～

好，先整理一下需求與限制：

1. 因為採用的第三方函式庫對話框只有在點擊開啟後才會實際掛載到 HTML DOM tree 上，所以 `useRef` 沒用了（如果對話框還沒被開啟，那 HTML DOM tree 上就不會出現相關內容）
2. 因為超連結要留著，所以複製內容依舊要有 MIME type `text/html` 與 `text/plain` 兩套資料

你可能會問，都已經 2025 年了，就不能用 HTML 原生的 [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog) 來實作對話框嗎？這樣就沒有資料不在 HTML DOM tree 裡的問題了。這個吐槽非常好，但畢竟：

1. 團隊已經習慣用第三方函式庫來處理對話框了，只有一處的對話框走原生路線只是在搞後續維護這包 code 的人
2. 要把原生 `<dialog>` 的視覺與動畫效果調整得跟第三方函式庫一樣非常痛苦

所以就先忘記原生 `<dialog>` 吧。

🥺：所以到底該怎麼辦呢？

🦊：其實這個需求轉譯為工程師的語言後，就是「要在不動到 HTML DOM tree 的情況下，想辦法產出純文字與 `Element.innerHTML` 型態的待複製內容」。

純文字的部分不太難，就是對原始的文字資料做 `.map()` 和 `.join()` 來排版換行就好。比如：

```ts
function parseDataToPureString(refs: StringRef[]) {
  return refs.map(ref => `${ref.title}\n${ref.data.join('\n')}`).join('\n');
}
const dataPureString = parseDataToPureString([...]);
```

而 `Element.innerHTML` 的部分其實也沒什麼。假設以下這個 `RefsElement` 就是點擊對話框後，會在畫面上看到的 react 元件：

```tsx
function RefsElement({ refs }: { refs: StringRef[] }) {
  return refs.map((ref, index) => {
    const url = someLinkParsingFn(ref);
    return (
      <li key={...}>
        <a href={url}>{ref.title}</a>
        <div>
          {ref.data.map((d) => (
            <OtherDataParseElement data={d} key={...} />
          ))}
        </div>
      </li>
    );
  });
}
```

那就從 `react-dom/server` 引用 [`renderToString`](https://react.dev/reference/react-dom/server/renderToString)，把這個 react 元件渲染為純粹的 HTML 文字內容：

```ts
import { renderToString } from 'react-dom/server';

const elementAsPureHtmlString = renderToString(<RefsElement refs={[...]} />);
```

再把這兩組資料傳給 `ClipboardItem` 建構為可複製資料，餵給 `navigator.clipboard.write()`：

```ts
const toCopy = new ClipboardItem({
  "text/html": elementAsPureHtmlString,
  "text/plain": dataPureString,
});
await navigator.clipboard.write([toCopy]);
```

結束 🌚 一個需求又平安地被解決了，感謝飛天工程師的努力。

## 參考資料

- [How to copy string to clipboard as text/html?](https://stackoverflow.com/a/74216984)
- [Why Isn’t Clipboard.write() Copying My RichText/HTML?](https://www.nikouusitalo.com/blog/why-isnt-clipboard-write-copying-my-richtext-html/)
- [nikouu/Web-API-Clipboard.write-Examples](https://github.com/nikouu/Web-API-Clipboard.write-Examples)
