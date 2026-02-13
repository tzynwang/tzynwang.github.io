---
title: 2022 第2週 學習記錄：React Forwarding Refs
date: 2022-01-15 20:20:21
tag:
  - [React]
---

## 總結

functional component 無法直接搭配 `useRef()` 來操作其 DOM，本篇紀錄如何使用 `React.forwardRef` 來處理 functional component 的 `ref`

## 情境

- 製作了一個 table container 元件，全專案的表單元件可作為 children 傳入此 table container 元件
- 需要達成的效果是「當使用者點擊 pagination 元件時，應將 table container 捲回頂部」
- 但 table container 為自定義的 functional component，無法直接對其使用 `useRef()`，需透過 `forwarding ref` 來實作相關需求

## 筆記

### Forwarding Ref

- 在需要傳遞 `ref` 的情境下，使用 `React.forwardRef()` 來建立 functional component（參考以下 gist 中的 `Layer.TableContainer.tsx`）
- 傳入 `React.forwardRef()` 的 arrow function 形式如右：`(props, ref) => {/* return a component */}`；第一個參數為 `props`，`ref` 放在 arrow function 的第二個參數傳入
  - 或參考 stackOverFlow 上的寫法：

  ```tsx
  const Component = (props, ref) => (
    <div ref={ref}>/* anything you want to render here */</div>
  );

  export default React.forwardRef(Component);
  ```

- 在 parent component 中呼叫 `React.createRef()` 來建立一個 React ref 物件（參考 gist 中的 `Page.App.tsx` 第 19 行，保存在變數 `tableContainerRef` 中）
- 將變數 `tableContainerRef` 傳遞給 `<TableContainer />`，開發者即可透過 `tableContainerRef` 來操作 `<TableContainer />` 的 DOM
- 在 gist 示範中，使用者只要點擊了表格元件中的按鈕，就會觸發 function `scrollToTop`，而此功能會將 `<TableContainer />` 捲回頂部
- 以上邏輯調整成「使用者點擊 pagination 元件後，執行 function `scrollToTop`」即可做出點擊 pagination 換頁後將表單捲回頂部的效果

### faker

- 本次使用 `faker@5.5.3` 來產生表格元件用的假資料（30 組）：
  ```ts
  const ROWS: Row[] = Array.from({ length: 30 }, () => ({
    name: faker.name.firstName(),
    city: faker.address.city(),
    email: faker.internet.email(),
  }));
  ```
- 文件可參考：[https://www.npmjs.com/package/faker/v/5.5.3](https://www.npmjs.com/package/faker/v/5.5.3)
- 搭配 TypeScript 使用時，追加安裝 `npm install --save @types/faker`；參考 [@types/faker](https://www.npmjs.com/package/@types/faker)

### 原始碼

<script src="https://gist.github.com/tzynwang/921437ebdfc48057cc2d7e2e8c81ac62.js"></script>

完整內容：[https://github.com/tzynwang/react-forwarding-ref](https://github.com/tzynwang/react-forwarding-ref)
展示頁：[https://tzynwang.github.io/react-forwarding-ref/](https://tzynwang.github.io/react-forwarding-ref/)

![demo](/2022/work-log-2022-w2/forwarding-ref-table-demo.gif)

## 參考文件

- [React: Forwarding Refs](https://reactjs.org/docs/forwarding-refs.html)
- [stackOverFlow: useRef() Hook on a custom component](https://stackoverflow.com/questions/61192450/useref-hook-on-a-custom-component)
