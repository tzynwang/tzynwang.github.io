---
layout: '@Components/SinglePostLayout.astro'
title: 2022 第18週 學習筆記
date: 2022-05-06 22:12:23
tag:
  - [HTTP]
  - [React]
---

## 總結

本週主題如下：

- You Don’t Need A UI Framework 閱讀筆記
- axios not showing all response headers 問題解決方式
- JSX.Element vs ReactNode vs ReactElement?

## 筆記

### You Don’t Need A UI Framework 閱讀筆記

> 原文連結：[You Don’t Need A UI Framework](https://www.smashingmagazine.com/2022/05/you-dont-need-ui-framework/)

- 總結：使用現成的 component library（如 Material UI、Bootstrap 等）並不代表一定能打造出「專業水準外觀的產品」；儘管 component library 可以提供好看的元件，但能不能把這些元件組合成一個好看的產品需要的是設計素養
- 現成 library 的優點：
  - 快速完成產品的視覺效果，開發者可以使用現成的元件來作出畫面，專注在商業邏輯上就好
  - 協助開發者處理掉 accessibility 相關的問題
  - 有一套已經寫好的文件，新人加入團隊時可以快速進入狀況
- 現成 library 的缺點：
  - 不易客製化，有時候對現成 library 元件進行外觀客製化的時間可能會比從頭開始做出一個符合需求的元件還久
  - library 提供的現成元件通常不會直接滿足開發者的需求，基本上都需要額外花時間來學習、查找如何將公版元件調教成自己需要的樣子
- 解決方案：
  - 如果使用現成的 library 主要是為了解決 accessibility 的問題，可以選擇針對解決 accessibility 需求（並且不提供外觀預設選項）的 library 來進行開發，比如 [Headless UI](https://headlessui.dev/) 或 [Radix Primitives](https://www.radix-ui.com/)
  - 學習基本的設計技巧、觀摩（借用）類似產品的設計；有好的設計才會讓產品看起來很棒，套用專業的 component library 並不保證產品會有很棒的視覺效果

### axios not showing all response headers 問題解決方式

> 問題描述：於瀏覽器開發者工具中的 Network 分頁檢視後端 response.header 時，確認後端有提供 x-access-token 內容，但卻沒有辦法從 axios response 取得該 token

- 問題根源：因為 CORS 的限制，若要允許客戶端取得自定義的 x-access-token 的話，後端需將該值 expose 出去
- 解決方式：後端追加以下內容
  ```
  Access-Control-Expose-Headers: x-access-token
  ```
  MDN: The `Access-Control-Expose-Headers` header adds the specified headers to the allowlist that JavaScript (such as `getResponseHeader()`) in browsers is allowed to access.

### JSX.Element vs ReactNode vs ReactElement

- React Official: Fundamentally, JSX just provides **syntactic sugar** for the `React.createElement(component, props, ...children)` function.
- StackOverFlow:
  - `ReactElement` and `JSX.Element` are **the result** of invoking `React.createElement` directly or via JSX transpilation.
  - It is an object with `type`, `props` and `key`. `JSX.Element` is `ReactElement`, whose `props` and `type` have type `any`, so they are more or less the same.
  - It exists, as **various libraries can implement `JSX` in their own way**, therefore `JSX` is a global namespace that then gets set by the library.
  - A `ReactNode` is a `ReactElement`, a `ReactFragment`, a `string`, a `number` or an array of `ReactNodes`, or `null`, or `undefined`, or a `boolean`.
- 以各自的涵蓋範圍來說： `ReactNodes` >>> `JSX.Element` > `ReactElement`

## 參考文件

- [Axios get access to response header fields](https://stackoverflow.com/questions/37897523/axios-get-access-to-response-header-fields)
- [Issue #771: Axios is not showing all headers of response](https://github.com/axios/axios/issues/771)
- [When to use JSX.Element vs ReactNode vs ReactElement?](https://stackoverflow.com/questions/58123398/when-to-use-jsx-element-vs-reactnode-vs-reactelement)
- [React Official: JSX In Depth](https://reactjs.org/docs/jsx-in-depth.html)
