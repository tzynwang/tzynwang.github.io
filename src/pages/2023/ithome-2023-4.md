---
layout: '@Components/pages/SinglePostLayout.astro'
title: 鐵人賽 Modern Web 組「捨棄 create-react-app 之餘還架了個 astro blog 昭告天下」第 4 天
date: 2023-08-26 09:59:27
tag:
	- [2023鐵人賽]
banner: /2023/ithome-2023-4/agence-olloweb-d9ILr-dbEdg-unsplash.jpg
summary: 介紹個人慣用的 tsconfig.json 設定內容、以及如何引用其他套件分享的設定檔；順便聊一點資料夾結構的安排方式。
draft: true
---

今天來為專案加上 TypeScript 設定，同時也會檢視目前為止的專案資料夾結構安排。

## 本文

### 設定 tsconfig.json

如果還沒安裝 TypeScript 的話可先在終端執行 `yarn add -D typescript` 來進行安裝。然後執行 `node ./node_modules/typescript/bin/tsc --init` 來建立 `tsconfig.json`。

其他建立方式可參考 [Stack Overflow: How to install and run Typescript locally in npm?](https://stackoverflow.com/questions/38030078/how-to-install-and-run-typescript-locally-in-npm)）。

因為是一次性的設定，所以個人沒有選擇在 package.json 中加入 `scripts` `tsc`。

---

以下是個人目前慣用的設定檔內容，基本上都是參考 React+TypeScript Cheatsheets 中的 [Troubleshooting Handbook: tsconfig.json](https://github.com/typescript-cheatsheets/react#troubleshooting-handbook-tsconfigjson) ，會使用比較嚴格的型別與變數使用狀況檢查，並加上 `paths` 設定。

`compilerOptions` 中的參數先分為上下兩半（文字值與布林），上半根據功能性、下半根據字母順序進行排列：

```json
{
  "compilerOptions": {
    "target": "es6",
    "lib": ["DOM", "ESNext"],
    "module": "esnext",
    "jsx": "react",
    "moduleResolution": "node",
    "paths": {
      "@Api/*": ["./src/api/*"],
      "@Component/*": ["./src/component/*"],
      "@Hook/*": ["./src/hook/*"],
      "@Model/*": ["./src/model/*"],
      "@Reducer/*": ["./src/reducer/*"],
      "@Style/*": ["./src/style/*"],
      "@Tool/*": ["./src/tool/*"],
      "@/*": ["./*"]
    },
    "allowJs": false,
    "allowSyntheticDefaultImports": true,
    "declaration": true,
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "forceConsistentCasingInFileNames": true,
    "importHelpers": true,
    "incremental": true,
    "isolatedModules": true,
    "sourceMap": true,
    "strict": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  },
  "include": ["./config/**/*", "./script/*", "./tool/*", "./src/**/*"],
  "exclude": ["./node_modules", "./build"]
}
```

真心推薦設定 `paths`，可以省去引用專案內檔案時，計算相對路徑的問題。且也能一眼就看出引用的是第三方套件、還是專案本身內的檔案：

```tsx
// 第三方套件
import React from 'react';
import dayjs from 'dayjs';
// 專案內元件
import TopNav from '@Component/common/TopNav';
```

提醒：自定義 `paths` 後，連帶需要在 webpack 中設定 `alias` 才能順利打包，這會在後續介紹到專案 webpack 設定檔時說明。

---

想參考現成套件 tsconfig.json 設定的朋友也可以到 [Centralized Recommendations for TSConfig bases](https://github.com/tsconfig/bases#centralized-recommendations-for-tsconfig-bases) 尋找資源。安裝後，透過 tsconfig.json 中的 `extends` 欄位即可借用其他人設定好的 ts 內容。

### 專案結構

不論是 side project 或是公司專案，個人通常會使用如下的資料夾結構：

```bash
.
├── README.md
├── config
├── doc
├── package.json
├── public
├── script
├── src
│   ├── api
│   ├── asset
│   ├── component
│   │   ├── AppEntryPoint
│   │   ├── Common
│   │   ├── Layer
│   │   ├── Layout
│   │   └── Page
│   ├── hook
│   ├── index.tsx
│   ├── model
│   ├── reducer
│   ├── style
│   └── tool
├── tool
├── tsconfig.json
└── yarn.lock
```

（可在終端輸入 `tree -I node_modules -L 3` 來得到資料夾結構樹，更多使用方式可參考 [Stack Overflow: Linux command to print directory structure in the form of a tree](https://stackoverflow.com/questions/3455625/linux-command-to-print-directory-structure-in-the-form-of-a-tree)）

---

各資料夾的目的說明如下：

- `README.md` 為專案的快速指南，通常會在這裡簡短說明專案概要、提供專案啟動腳本，如果此專案有更詳盡的操作手冊，則會將比較長篇的說明收納於 `./doc` 中
- `./config` 用於存放 webpack 開發、打包用的設定內容；詳細的 webpack 設定會於日後文章解說
- `./public` 負責收納 React app 專案的 `index.html` 模板與靜態檔案（包括但不限於 `favicon` `apple-touch-icon.png` `robots.txt` 等等）
- `./script` 負責收納專案的啟動、打包腳本；更多關於這個資料夾的內容，會在鐵人賽後續文章中說明
- `./src` 負責收納 React app 專案的核心內容
  - `api` `asset` `hook` 如其名稱描述，負責收納 api、靜態資源（字型、圖示等）與 react hook 內容
  - `component` 會再根據元件特性歸納到 `Common` `Layer` `Layout` `Page` 中（詳細的歸納判斷會於明天文章說明）；`AppEntryPoint` 內僅會有一個檔案，即是整個 React app 在 `./src/index.tsx` 中使用的入口
  - `model` 收納 React app 會用到的純資料（例如常數、共用型別）以及 React Redux store 內容
  - `reducer` 收納 React Redux action/reducer 相關內容
  - `style` 負責收納 React app 的樣式檔案
  - `tool` 中是給 React app 專用的工具包，可能是 data formatter/transformer 或是 dayjs 函式
- 根目錄的 `./tool` 負責收納專案用的工具，比如執行本機 webpack-dev 的 `start` 或打包用的 `build` 腳本

---

補充：

- 不論一個資料夾內會有幾份檔案，個人都習慣以單數名詞來為資料夾命名
- 專案間會盡量維持類似的資料夾結構，避免在維護不同專案時需要特別回想各個專案的檔案分類邏輯

以上結構歡迎參考。而如果有感覺奇怪、困惑，或是你認為有更好的分類方式，也非常歡迎留言討論唷 (`･∀･)

## 總結

本日重點回顧：想在專案內使用 TypeScript 但不想自己寫 tsconfig.json 的人可以到 [Centralized Recommendations for TSConfig bases](https://github.com/tsconfig/bases#centralized-recommendations-for-tsconfig-bases) 尋找資源。另外，一套通用的專案資料夾結構，可以避免在維護多個專案時需要主動回想各類檔案的分類邏輯。
