---
layout: '@Components/SinglePostLayout.astro'
title: 2022 第36週 實作筆記：ref merging
date: 2022-09-10 13:35:22
tag:
  - [React]
---

## 總結

在寫鐵人賽時發現自己遇到「元件有自己的 local ref ，但使用該元件的親元件可能也需要透過 ref 來執行一些 DOM 操作」的情境，搜尋後發現可以進行 ref merge 來把內外部的 refs 整併起來。此篇筆記會記錄一下程式碼與相關參考資料。

## 筆記

### 程式碼

<script src="https://gist.github.com/tzynwang/8e86fec0c8c61dbb374ce3819dd7a374.js"></script>

### mergeRef.Component.tsx

使用 `React.forwardRef` 讓引用此元件的親代元件可以傳入 ref。本身也有自己的 local ref（第 10 行），透過小工具 mergeRef（第 15 行）來將多個 refs 整理為單一個 component instance

參考 React 官方文件可得知元件的 ref props 除了可以傳入 `createRef()` 與 `useRef()` 建立的 `MutableRefObject` 以外，也能接受傳入 callback function：

> Callback Refs: Instead of passing a `ref` attribute created by `createRef()`, you pass a function. The function receives the **React component instance or HTML DOM element as its argument**, which can be stored and accessed elsewhere.

把 callback function 傳入元件的 ref props 時，該 function 接受元件實例（instance）或 HTML DOM 物件作為參數。

附上 stackOverFlow 上的說明：

> Ref callbacks are another option, which are needed for some advanced cases. You pass a function into the element, and the function will be called back when the instance is created or destroyed. These have the type `(instance: T) => void`.

補充：在程式碼第 7 行使用非匿名的 function declaration 即可在 react devTool 中看到 forwardRef component 的名稱。

![forwardRef component name](/2022/react-merge-ref/name-forwardRef-component.png)

### mergeRef.ts

- 第 8 行：當 ref 為的型別為 function 時，把元件實例或 HTML DOM 作為參數傳入
- 第 10 行：若 ref 不為 null 則把該元件的實例或 HTML DOM 物件指派給 `MutableRefObject.current`

執行完 mergeRef 後，透過 forwardRef 傳入的 ref 與元件本身的 local ref 都會指向該元件。

### mergeRef.ParentComponent.tsx

展示實際使用情境，在親元件使用 `createRef` 建立 refObject 傳給支援 ref merge 的 Button 元件。

## 參考文件

- [React: Refs and the DOM](https://reactjs.org/docs/refs-and-the-dom.html)
- [gregberge/react-merge-refs](https://github.com/gregberge/react-merge-refs#react-merge-refs)
- [Property 'current' does not exist on type '((instance: HTMLDivElement | null) => void) | RefObject<HTMLDivElement>'](https://stackoverflow.com/questions/65876809/property-current-does-not-exist-on-type-instance-htmldivelement-null)
- [How to merge refs in React component?](https://mayursinhsarvaiya.medium.com/how-to-merge-refs-in-react-component-d5e4623b6924)
