---
title: 2022 第21週 實作筆記：為 react-syntax-highlighter 加上複製功能
date: 2022-06-05 19:36:28
categories:
- [React]
tags:
---

## 總結
本家：[React Syntax Highlighter](https://react-syntax-highlighter.github.io/react-syntax-highlighter)
展示：https://tzynwang.github.io/react-syntax-highlighter-with-copy/
原始碼：https://github.com/tzynwang/react-syntax-highlighter-with-copy/tree/demo/20220605

{% figure figure--center 2022/react-syntax-highlighter-with-copy/demo.png %}

加上複製功能不難，但在使用 rollup 打包完成並嘗試 import 套件時持續撞到
```
ERROR in ../react-syntax-highlighter-to-copy/node_modules/@emotion/react/dist/emotion-element-cbed451f.browser.esm.js 10:41-54
export 'createContext' (imported as 'createContext') was not found in 'react' (module has no exports)
```
之狀況（戰了 4 小時還是解不掉，先放置一下 ∠( ᐛ 」∠)＿ ），打算先將 @mui 系列的套件從 dependency 移除再嘗試打包看是否可以解決問題

## 版本與環境
```
@mui/icons-material: 5.8.2
@mui/material: 5.8.2
react: 17.0.2
rollup: 2.67.3
```

## 筆記
- 加工內容：滑鼠 `:hover` 到 CodeBlock 元件，元件右上角會出現複製圖示，點擊後即可複製 CodeBlock 全部內容；複製成功後，圖示會變為打鉤外觀，三秒後回復為一開始的複製樣式
- 基本上只是對 `react-syntax-highlighter` default export 的元件加上 props `style` 攔截樣式內容（以便根據樣式來設定複製圖示的顏色），複製功能則是使用 `navigator.clipboard.writeText` 來處理（包在 `src/hooks/useCopy` 中）
- `CodeBlockProps` 直接 extends `react-syntax-highlighter` 的型別定義（除了 props `children` 因在 CodeBlock 元件不會使用故以 Omit 處理掉），故 `react-syntax-highlighter` 所有可以使用的 props 都可以直接傳入 CodeBlock 中，並行為與原生套件一致
- 解決掉 rollup 打包問題後，預計實作「可自訂復原秒數」與「可自訂複製圖示外觀與指定位置」之功能

## 參考文件
- [rollup.js](https://rollupjs.org/guide/en/)
- [Component library setup with React, TypeScript and Rollup](https://dev.to/siddharthvenkatesh/component-library-setup-with-react-typescript-and-rollup-onj)
- [Rollup Config for React Component Library With TypeScript + SCSS](https://www.codefeetime.com/post/rollup-config-for-react-component-library-with-typescript-scss/)