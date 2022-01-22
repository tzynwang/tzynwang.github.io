---
title: 2021 第49週 學習記錄：MUI 客製元件外觀
date: 2021-12-11 22:52:01
categories:
  - [React]
  - [MaterialUI]
tags:
---

## 總結

{% figure figure--center 2021/work-log-w49/react-mui.png %}
這禮拜多半在處理 MUI 元件的客製化外觀，索性直接建立一個實驗用的 react app 來當[測試盒](https://tzynwang.github.io/react-mui/)

## 筆記

### 自訂元件外觀

- 大部分可以透過 `styleOverrides` 解決
- 以 `MuiButton` 為例，直接設定 Button 系的尺寸、按鈕字體樣式，以及在 `:disabled` 狀態下的外觀後（`src.themes.Button.index.ts`），在 `src.themes.index.ts` 與其他的 mui 自訂外觀設定一起 `import` ，並透過 `createTheme` 建立 theme object，最後在 `src.index.tsx` 作為 `props` 傳入 `ThemeProvider`

<script src="https://gist.github.com/tzynwang/efa3400afcc8d3308c0a12d33a991247.js"></script>

### 專案色票設定

- 與自訂元件外觀的作法類似，將設計師提供的色票更新至 `src.themes.Palette.index.ts` 後匯入 `src.themes.index.ts`
- 將專案色票定義完畢後，基本上就不需要手動修改太多 mui 元件的樣式；在專案配色單純的情況下，大部分元件直接使用 `primary.main` 與 `primary.dark` 的顏色即可

<script src="https://gist.github.com/tzynwang/4f3b878282237a0c7941cb6e22a64f12.js"></script>

### 專案部署至 gh-pages 流程
1. package.json 追加 `"homepage": "https://<github-account>.github.io/<repo-name>"`
1. `npm i gh-pages`
1. package.json 的 scripts 部分追加 `"predeploy": "npm run build"` 與 `"deploy": "gh-pages -d build"`
1. `npm run deploy` 後，至 GitHub repo 確認 pages 有指向 branch `gh-pages` 即可


## 參考文件

- [MUI: ThemeProvider](https://mui.com/customization/theming/#themeprovider)
- [MUI: Theme component](https://mui.com/customization/theme-components/)
- [Deployment: GitHub Pages](https://create-react-app.dev/docs/deployment/#github-pages)
