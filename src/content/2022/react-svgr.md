---
title: 2022 第31週 學習筆記：在 react 專案透過 @svgr/webpack 引用 .svg 檔案
date: 2022-08-04 20:27:24
tag:
  - [React]
  - [TypeScript]
  - [webpack]
---

## 總結

記錄一下如何透過 `@svgr/webpack` 在 React 專案中操作 `.svg` 檔案，使用 `@svgr/webpack` 的好處是「同一份 `.svg` 檔案，可以選擇以『元件』或『路徑』的格式來使用」

## 程式碼

<script src="https://gist.github.com/tzynwang/5c200aca1cc8067dcb34254cd2f339c5.js"></script>

## 筆記

- `svgr.react-app-env.d.ts`
  - 第 7 行：要將 svg 檔案以 React 元件形式匯入時，需以 `ReactComponent` 的名稱進行 import
  - 第 9 行：設定 `ReactComponent` 可以接受 `title` props；如果對 `ReactComponent` 傳入 title 則最終渲染到畫面上的 svg tag 會包覆 title 字串
  - 第 12 行：預設匯出的形式是 `src` 字串
- `svgr.app.tsx`
  - 第 8 行：以元件形式匯入的 `svg` 檔案可透過 `classNames` 來進行 css 樣式設定
  - 第 10 行：也可直接將尺寸（width, height）與顏色（fill）以 `props` 形式傳遞給元件；透過 props 傳入的樣式會覆寫掉 svg 檔案原本的設定（可參考 `final.html` 兩種 svg tag 的差異）
  - 第 11 行：以 `src` 形式匯入 `svg` 檔案，可直接用於 `img src` 或 `background-image url` 上

### 關於 svg tag 中的 title

> MDN: Text in a `<title>` element is not rendered as part of the graphic, but **browsers usually display it as a tooltip**. If an element can be described by visible text, it is recommended to reference that text with an `aria-labelledby` attribute rather than using the `<title>` element.

如果有提供的話，瀏覽器會將其應用於 tooltip 的展示文字；但（參考 [MDN 表格](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/title#browser_compatibility)） FireFox 以外的支援度並不明朗

### 關於 react-app-env.d.ts

> This file references **TypeScript types declarations** that are specific to projects started with Create React App. These type declarations add support for importing resource files such as `bmp`, `gif`, `jpeg`, `jpg`, `png`, `webp`, and `svg`.

其實就是各種格式的型別定義集合

### 關於 Triple-Slash Directives

```ts
/// <reference types="..." />
```

> Triple-slash directives are single-line comments containing a single XML tag. The contents of the comment are used as **compiler directives**. Triple-slash references instruct the compiler to **include additional files in the compilation process**.

> a `/// <reference types="..." />` directive declares a **dependency on a package**. For example, including `/// <reference types="node" />` in a declaration file declares that this file uses names declared in `@types/node/index.d.ts;` and thus, this package needs to be included in the compilation along with the declaration file.

提示編譯器在執行編譯時，需要額外引用哪些套件的型別定義檔案

## 參考文件

- [SVGR: Webpack](https://react-svgr.com/docs/webpack/)
- [MDN: `<title>` — the SVG accessible name element](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/title)
- [TypeScript: Triple-Slash Directives](https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html)
- [What is the react-app-env.d.ts in a react typescript project for](https://stackoverflow.com/questions/67262914/what-is-the-react-app-env-d-ts-in-a-react-typescript-project-for)
- [How to Start New React Application with Create React App and TypeScript](https://www.newline.co/@dmitryrogozhny/how-to-start-new-react-application-with-create-react-app-and-typescript--4298e606)
