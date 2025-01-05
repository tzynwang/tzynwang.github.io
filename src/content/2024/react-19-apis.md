---
title: React 19 筆記：新 api 與 pros 功能篇
date: 2024-05-11 14:23:58
tag:
- [React]
banner: /2024/react-19-apis/justus-menke-hwHJrWIh5SM-unsplash.jpg
summary: 此篇筆記記錄了 React 19 預計提供的新 api 與 props 功能。
draft: 
---

提醒：此篇筆記整理了 [React 19 Beta](https://react.dev/blog/2024/04/25/react-19) 中關於 api 與 props 的改動，但不是一份 100% 詳盡的翻譯與解說文，我只記錄了自認需要關注的內容。如果你想了解 React 19 預計要提供的所有改動，請務必閱讀官方文件。

## `use`

可直接讀取 Promise / React context 的內容，但無法讀取在渲染時產生的 Promise（does not support promises created in render）。

讀取 Promise：

```jsx
import { use } from 'react';

function Comments({ commentsPromise }) {
  // `use` will suspend until the promise resolves.
  const comments = use(commentsPromise);
  return comments.map((comment) => <p key={comment.id}>{comment}</p>);
}

function Page({ commentsPromise }) {
  // When `use` suspends in Comments,
  // this Suspense boundary will be shown.
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Comments commentsPromise={commentsPromise} />
    </Suspense>
  );
}
```

讀取 Context：

```jsx
import { use } from 'react';
import ThemeContext from './ThemeContext';

function Heading({ children }) {
  if (children == null) {
    return null;
  }

  // This would not work with useContext
  // because of the early return.
  const theme = use(ThemeContext);
  return <h1 style={{ color: theme.color }}>{children}</h1>;
}
```

注意事項：

- 此 api 可以根據條件決定是否被呼叫（`use` can be called conditionally），也可以在迴圈中使用
- 此 api 只能在 hook 或元件中被呼叫
- 在透過 `use` 讀取 Promise 內容時，需注意該 Promise 如何處理錯誤情境。會拋錯的話，可以搭配套件 `react-error-boundary` 的 `ErrorBoundary` 來顯示錯誤訊息。也可考慮對 Promise 加上 `.catch()` 來應對，參考[官方範例](https://react.dev/reference/react/use#providing-an-alternative-value-with-promise-catch)

## `ref` 相關改動

### 可直接透過 `props` 傳遞

在 React 19 後，可直接透過 `props` 傳遞 `ref`，不需要再搭配 `forwardRef` 了。且未來 `forwardRef` 會被標記為待移除（we will deprecate and remove `forwardRef`）。

```jsx
// before
import { forwardRef } from 'react';
const MyInput = forwardRef(function MyInput(props, ref) {
  return <input placeholder={placeholder} ref={ref} />;
});

// after
function MyInput({ placeholder, ref }) {
  return <input placeholder={placeholder} ref={ref} />;
}
```

### 可執行 cleanup function

當元件要從畫面上被卸除時，React 會執行 ref 中的被回傳的 cleanup 功能。如以下範例：

```jsx
<input
  ref={(ref) => {
    // do something when ref created
    return () => {
      // do something when component unmounts
    };
  }}
/>
```

## `<Context.Provider>` 簡化為 `<Context>`

如標題以及以下範例所示，語法從原本的 `<ThemeContext.Provider>` 簡化為 `<ThemeContext>`。

```jsx
const ThemeContext = createContext('');

function App({ children }) {
  return <ThemeContext value="dark">{children}</ThemeContext>;
}
```

## 支援文件 metadata

當 React 渲染包含 metadata 的元件時，這些 meta tag 會被提升（hoist）至 HTML 文件的 `<head>` 中。

```jsx
function BlogPost({ post }) {
  return (
    <article>
      <h1>{post.title}</h1>
      <title>{post.title}</title>
      {/* support document metadata */}
      <meta name="author" content="Josh" />
      <link rel="author" href="https://twitter.com/joshcstory/" />
      <meta name="keywords" content={post.keywords} />
      {...}
    </article>
  );
}
```

### `<link>` 支援樣式權重排序

透過參數 `precedence` 可指定樣式的載入順序。比如以下範例中的樣式，在 HTML 文件中的順序從上到下會是 `foo` >> `baz` >> `bar`：

```jsx
function ComponentOne() {
  return (
    <Suspense fallback="loading...">
      <link rel="stylesheet" href="foo" precedence="default" />
      <link rel="stylesheet" href="bar" precedence="high" />
      <article class="foo-class bar-class"></article>
      {...}
    </Suspense>
  );
}

function ComponentTwo() {
  return (
    <div>
      <p>{...}</p>
      <link rel="stylesheet" href="baz" precedence="default" />
    </div>
  );
}

```

另外，即使在整個 App 多處重複載入帶有樣式表的元件，該樣式表在 HTML 文件中也只會出現一次（React will only include the stylesheet once in the document）。

### `<script>` 支援 `async`

邏輯與上方透過 `<link>` 載入樣式類似——一個包含 `<script>` 的元件即使在整個 App 中出現多次，React 也只會在 HTML 中嵌入一次標籤。

## 支援外部資源預載

`react-dom` 追加數種可以預先載入資源的 api：

```jsx
import { prefetchDNS, preconnect, preload, preinit } from 'react-dom';

function MyComponent() {
  preinit('https://.../path/to/some/script.js', { as: 'script' }); // loads and executes this script eagerly
  preload('https://.../path/to/font.woff', { as: 'font' }); // preloads this font
  preload('https://.../path/to/stylesheet.css', { as: 'style' }); // preloads this stylesheet
  prefetchDNS('https://...'); // when you may not actually request anything from this host
  preconnect('https://...'); // when you will request something but aren't sure what
}
```

上方元件最終會渲染出以下結果：

```html
<!-- the above would result in the following DOM/HTML -->
<html>
  <head>
    <!-- links/scripts are prioritized by their utility to early loading, not call order -->
    <link rel="prefetch-dns" href="https://..." />
    <link rel="preconnect" href="https://..." />
    <link rel="preload" as="font" href="https://.../path/to/font.woff" />
    <link rel="preload" as="style" href="https://.../path/to/stylesheet.css" />
    <script async="" src="https://.../path/to/some/script.js"></script>
  </head>
  <body>
    ...
  </body>
</html>
```

注意事項：外部資源實際渲染出來的順序是根據其「功能」而非「在元件中被呼叫的順序」決定。

## 參考文件

- [React 19 Beta](https://react.dev/blog/2024/04/25/react-19)
- [use](https://react.dev/reference/react/use)
- [Resource Preloading APIs](https://react.dev/reference/react-dom#resource-preloading-apis)
