---
title: 葫蘆裡的 React：關於調適（reconciliation）與組件的 props.key
date: 2024-03-03 20:11:33
tag:
  - [React]
banner: /2024/react-under-the-hood-reconciliation/dan-hadar-HMG2ELxyos8-unsplash.jpg
summary: 此篇筆記整理了 React 官方文件中關於 reconciliation 的相關內容，並順便說明在某些情況下你可能需要指定組件的 props.key 來強制更新畫面。
draft:
---

## 總結

reconciliation 指的是以下過程：

> 當組件（component）的 `props` 或狀態（state）改變，React 會去比對新、舊版的元素（element）差異。如果有別，React 就會最小幅度地更新畫面。

## 觸發比對

當你呼叫以下功能時，就會產生元素（element）：

- `ReactDOM.render()`
- React class 組件的 `render()` 或 `setState()`
- React function 組件的 `set` 函式（比如 `const [open, setOpen] = useState(false)` 中的 `setOpen`）

然後，當一個組件的 `props` 或狀態（state）有變時，又會產生一個新的元素。這時 React 就會透過 diff 演算法來比對舊新版的元素是否有差異——如果有，那就更新畫面。

另外，為了確保 diff 演算法的效率達到 O(n)，有兩個前提：

1. 不同類型（type）的元素會產生不同的結果（two elements of different types will produce different trees）
2. 工程師會透過 `key` 來提示 React 該元素是否有變動

（忘記什麼是元素請回頭翻 [React Components, Elements, and Instances#關於元素（elements）](/2024/react-under-the-hood-components-elements-and-instances/#關於元素element)）

## 比對的方式

React 會從根部（root element）開始比對，結果有三種：

1. 兩者的類型（type）根本不同
2. 兩者是相同的 DOM 元素
3. 兩者是相同的組件（component）

### Elements Of Different Types

如果根部的類別根本不同，React 會直接銷毀前一版的元素——代表前一版的所有 DOM 節點、局部狀態都會消失——接著再從頭開始打造新的元素。

以下列 snippet 為例，因為根部從 `div` 變成 `span`，所以舊版元素會被整個打掉重練，而包在中間的 `Counter` 組件也會被銷毀：

```jsx
// before
<div>
  <Counter />
</div>

// after
<span>
  <Counter />
</span>
```

### DOM Elements Of The Same Type

如果「前後版的根部類別是相同的 DOM 元素」，那 React 就只會去更新有差異的特性（attributes）。以下列 snippet 為例，因為差異只出現在 `className` 上，所以 React 只會更新此處的資訊：

```js
// before
{
  type: 'div',
  props: {
    className: 'desktop-style',
  }
}

// after
{
  type: 'div',
  props: {
    className: 'mobile-style',
  }
}
```

### Component Elements Of The Same Type

如果「前後版的根部是相同的組件（component）」，組件實例（instance）與局部狀態（local state）就會維持一致，React 只會去更新 `props` 不同的部分。

這是什麼意思？

首先，我們建立一個 `Input` 組件：

```tsx
import React, { useId, useState } from "react";
import type { HTMLAttributes } from "react";

type Props = HTMLAttributes<"Input"> & {
  label?: string;
};

export default function Input({ label, placeholder }: Props) {
  /* local state */
  const [input, setInput] = useState("");
  const id = useId();

  /* main */
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        margin: "8px auto",
      }}
    >
      {label && <label htmlFor={id}>{label}</label>}
      <input
        id={id}
        onChange={(e) => setInput(e.target.value)}
        value={input}
        placeholder={placeholder}
        style={{
          width: "80%",
          padding: "8px 16px",
        }}
      />
    </div>
  );
}
```

然後在 `App.tsx` 中實作以下邏輯：

```tsx
import React, { useState } from "react";
import Input from "./Input";

export default function App() {
  const [isCheck, setIsCheck] = useState(false);

  return (
    <React.Fragment>
      <input
        id="check"
        type="checkbox"
        onChange={(e) => setIsCheck(e.target.checked)}
      />
      <label htmlFor="check">Toggle me to switch between Input A and B</label>
      {isCheck ? (
        <Input label="Input B" placeholder="This is input B" />
      ) : (
        <Input label="Input A" placeholder="This is input A" />
      )}
    </React.Fragment>
  );
}
```

（可互動的版本在[這裡](https://codesandbox.io/p/sandbox/react-local-state-reserve-between-different-render-m24fks)）

我們先對畫面上的 `Input` 組件隨便輸入些內容，再去勾選 `input` HTML 元素，切換畫面上的 `Input` 組件版本。然後你會發現，剛才隨手輸入的文字**沒有因為畫面上的組件變成 B 版而消失**。但這兩個明明是不同的 `Input` 組件？

這就是「組件實例不變，且局部狀態會被保留下來」的意思——對 React 來說，當上方範例中的 `Input` 改變時，它看到的前後版元素如下：

```js
// before
{
  type: Input,
  props: {
    label: "Input A",
    placeholder: "This is input A",
  },
}

// after
{
  type: Input,
  props: {
    label: "Input B",
    placeholder: "This is input B",
  },
}
```

差異只出現在 `props.label` 與 `props.placeholder` 這兩個屬性上，所以 React 就只更新這部分。局部狀態（組件中的 `input`）不在修改範圍內 🙂

如果你認為這種「明明換了組件，但局部狀態卻沒變」的行為很詭異，那麼下一段筆記要介紹的 `key` 能完美地幫忙解決這個問題。

![yeah](/2024/react-under-the-hood-reconciliation/yeah.png)

## `key`

### 提示 React 組件有變

為了避免局部狀態被保留下來，請為兩個 `Input` 組件加上不同的 `key`：

```jsx
import React, { useState } from "react";
import Input from "./Input";

export default function App() {
  const [isCheck, setIsCheck] = useState(false);

  return (
    <React.Fragment>
      <input
        id="check"
        type="checkbox"
        onChange={(e) => setIsCheck(e.target.checked)}
      />
      <label htmlFor="check">Toggle me to switch between Input A and B</label>
      {isCheck ? (
        <Input key="B" label="Input B" placeholder="This is input B" />
      ) : (
        <Input key="A" label="Input A" placeholder="This is input A" />
      )}
    </React.Fragment>
  );
}
```

對 React 來說，這樣新舊版的 `Input` 就**不再是一樣的組件**：

```js
// before
{
  type: Input,
  key: "A", // 多了這個
  props: {
    label: "Input A",
    placeholder: "This is input A",
  },
}

// after
{
  type: Input,
  key: "B", // 多了這個
  props: {
    label: "Input B",
    placeholder: "This is input B",
  },
}
```

於是舊的 `Input` 組件 A 會被卸載（unmounted），局部狀態消失。而新的 `Input` 組件 B 會被掛載（mounted）到畫面上，與舊組件的局部狀態沒有絲毫關聯。問題解決 🥳

### 提示 React 組件沒變，只是換位

React 會將子代（children）視為**陣列**來比對差異。以下列 snippet 為例，陣列的前兩個項目沒有變，差異出現在最尾列。經比對後，React 只需追加 `<li>third</li>`，不用理會 `<li>first</li>` 與 `<li>second</li>`：

```jsx
// before
<ul>
  <li>first</li>
  <li>second</li>
</ul>

// after
<ul>
  <li>first</li>
  <li>second</li>
  <li>third</li> {/* this is easy 😎 */}
</ul>
```

但當新元素出現在陣列最上方時，React 就會判斷「新舊版的子代完全不同」，於是整個子代就會被打掉重練——包括其實沒有變的 `<li>first</li>` 與 `<li>second</li>`：

```jsx
// before
<ul>
  <li>first</li>
  <li>second</li>
</ul>

// after
<ul>
  <li>zero</li> {/* oh no 🥹 */}
  <li>first</li>
  <li>second</li>
</ul>
```

而 `key` 在這裡就是為了解決「銷毀無變動內容」的做白工問題——如果 `key` 沒變，那麼根據 React 的最小幅度更新哲學，該組件會被沿用，只是換個位置。

所以上方的 snippet 在帶入 `key` 之後，React 就不會去卸載 `<li key="first">first</li>` 與 `<li key="second">second</li>`，只會進行掛載 `<li key="zero">zero</li>` 的工作：

```jsx
// before
<ul>
  <li key="first">first</li>
  <li key="second">second</li>
</ul>

// after
<ul>
  <li key="zero">zero</li> {/* the new one 👋 */}
  <li key="first">first</li>
  <li key="second">second</li>
</ul>
```

### 為何陣列索引（index）不適合作為 `key`

如果一個陣列會被**重排序**、在**最尾列以外的位置被追加新項目**，那麼陣列索引（index）就不適合用來當作組件 `key`。

可以試玩[此範例](https://codesandbox.io/p/sandbox/dont-use-index-as-key-for-react-component-t95dm6)感受一下。畫面上的第一組表格使用索引作為 `key`，當我們對 `ToDo` 組件隨便輸入些內容，再新增一些 `ToDo` 到畫面上，最後執行排序——你會發現 `ToDo` 確實有根據時間重新排列，但我們輸入到 `ToDo` 的內容（局部狀態）卻沒有跟著重新排序。

（狀態沒有跟上的原因請參考上方 Component Elements Of The Same Type 的解釋）

這就是使用索引作為 `key` 的缺點——當陣列的內容被重排序後，畫面可能會不如預期。

---

而範例中第二組表格使用 id 作為 `key`，當我們為陣列洗牌時，React 會知道它要做的事情是「更新 `ToDo` 組件們的位置」，而不只是「更新 `ToDo` 有變的 `props`」——這樣，每個 `ToDo` 的局部狀態就會跟著一起重排序了 🥳

### 使用規則

1. 因為 React 會將子代（children）視為陣列，所以一個陣列中的 `key` 不可出現重複的值——反之，相同的 `key` 可以在不同的陣列（子代）重複出現
2. `key` 不能是隨機值，如果 React 在比對新舊元素時發現 `key` 不同，該組件就會被銷毀——但那個組件可能只是 `key` 有變，這樣就只是在徒增更新畫面的成本
3. 如果一個陣列會被重排序，或是在最尾列以外的位置被追加新項目，那麼陣列索引（index）就不適合用來當作 `key`

## 參考文件

### 1.0 official doc

- [Reconcilers](https://legacy.reactjs.org/docs/codebase-overview.html#reconcilers)
- [Reconciliation](https://legacy.reactjs.org/docs/reconciliation.html)
- [React Components, Elements, and Instances](https://legacy.reactjs.org/blog/2015/12/18/react-components-elements-and-instances.html)
- [Glossary of React Terms](https://legacy.reactjs.org/docs/glossary.html)

### 2.0 official doc

- [root.render(reactNode)](https://react.dev/reference/react-dom/client/createRoot#root-render)
- [Preserving and Resetting State](https://react.dev/learn/preserving-and-resetting-state)
- [Why does React need keys?](https://react.dev/learn/rendering-lists#why-does-react-need-keys)
