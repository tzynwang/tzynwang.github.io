---
title: 2022 第9週 實作筆記：create-react-app 與單元測試
date: 2022-03-07 19:59:59
categories:
  - [React]
  - [Testing]
tags:
---

## 總結

本篇筆記記錄如何在透過 `create-react-app` 建立的 React App 中搭配 `npm run eject` 設定並執行單元測試（使用 jest 與 testing library）

## 版本與環境

```
create-react-app: 5.0.0
```

## 筆記

### 已知問題

目前透過 `create-react-app@5.0.0`（2022/3/8 當下最新版）建立的 React App 若直接執行 `npm run test` 會在終端看到以下錯誤訊息：

```
Error: Failed to initialize watch plugin "node_modules/jest-watch-typeahead/filename.js":

  ● Test suite failed to run

    file:///Users/tzyn/Projects/cra-default/node_modules/jest-watch-typeahead/build/file_name_plugin/prompt.js:4
    import { PatternPrompt, printPatternCaret, printRestoredPatternCaret } from 'jest-watcher';
                            ^^^^^^^^^^^^^^^^^
    SyntaxError: Named export 'printPatternCaret' not found. The requested module 'jest-watcher' is a CommonJS module, which may not support all module.exports as named exports.
    CommonJS modules can always be imported via the default export, for example using:

    import pkg from 'jest-watcher';
    const { PatternPrompt, printPatternCaret, printRestoredPatternCaret } = pkg;
```

於終端執行 `npm i -D --exact jest-watch-typeahead@0.6.5` 即可解決此問題

### 基本設置

1. 先執行 `npm run eject` 將 `react-scripts` 打包的內容還原回專案資料夾中
1. 執行 `npx jext --init` 根據互動式問題設定 `jest.config.ts`
  - 如果有使用 webpack 設定 quickPath 的情況下，設定檔必需記載 `moduleNameMapper` 內容
  - 如果單元測試中會將 React 元件渲染（使用 `Render(<UI />)`）出來的話，設定檔必須記載 `testEnvironment` 內容
  <script src="https://gist.github.com/tzynwang/3edd8baf98a9e636a72b3bfdd49704ad.js"></script>
1. 透過 `create-react-app` 建立的 React App 專案本身就有安裝的 `@testing-library/react` 與 `@testing-library/jest-dom` 即可處理最基本的 React 元件功能測試（包括渲染後檢查畫面上文字內容、數量是否正確，也可進行 snapshot testing 檢驗渲染出來的 DOM 與其 attributes 是否皆符合預期）；有需要單獨測試 hooks 的情境的話，可安裝 [react-hooks-testing-library](https://github.com/testing-library/react-hooks-testing-library#readme)

### Jest 基礎語法
- `describe`: `describe(name, fn)` creates a **block** that groups together several related tests.
- `it`, `test`: 使用方式為 `test(name, fn, timeout)` 或 `it(name, fn, timeout)`，功能也相同；測試內容都放在 it 或是 test 中
- `expect`: The expect function is used every time you want to test a value. You will rarely call expect by itself. Instead, you will use expect along with a "matcher" function to assert something about a value.
- toBe...
  - `toBe()`: compare primitive values or to check referential identity of object instances. 比對 primitive types 是否一致，或檢驗兩個物件在記憶體中的 reference 是否相同
  - `toEqual()`: compare recursively all properties of object instances (also known as "deep" equality). 比對物件的 key-value pairs 是否一致
- `screen`: the object that has every query that is pre-bound to `document.body`; e.g. `expect(screen.getByLabelText('Example')).toBeTruthy()`


### testing-library/react 基礎語法

- `render(ui, options)`: Render into a container which is appended to `document.body`, return `RenderResult` 把畫面掛載到元件上，也可使用變數接住回傳的 `RenderResult` 並 deconstruct 出 container 來使用 `.querySelector()` 等 DOM 操作
  ```tsx
  const { container } = render(< Component />);
  container.querySelector(...);
  ```
  - Container: The containing DOM node of your rendered Component. This is **a regular DOM node**, so you can call `container.querySelector` etc. to inspect the children.
- `act()`: To prepare a component for assertions, wrap the code rendering it and performing updates inside an · call 在需要對元件執行操作時，可將一連串動作包在 `act(() => {...})` 中


### 原始碼

<script src="https://gist.github.com/tzynwang/bab5f3f726ceb34c8e790209a9366c5a.js"></script>

除了測試元件本身是否有被正常渲染到畫面上之外，元件內加工資料的 functions 也會一併拉出來執行單元測試，確保資料流與資料加工後的內容符合預期

## 參考文件

- [issue 11792: 'Failed to initialize watch plugin' when running tests for newly created app](https://github.com/facebook/create-react-app/issues/11792)
- [Jest: Expect](https://jestjs.io/docs/expect)
- [Testing Library: About Queries](https://testing-library.com/docs/queries/about)
- [React Testing Library: API](https://testing-library.com/docs/react-testing-library/api)
