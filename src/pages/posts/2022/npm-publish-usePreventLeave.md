---
layout: '@Components/pages/SinglePostLayout.astro'
title: 2022 第29週 實作筆記：發佈 npm 套件 usePreventLeave
date: 2022-07-23 11:18:41
tag:
  - [React]
  - [rollup.js]
---

## 總結

- 記錄一下自製 React custom hook 套件 [usePrevent](https://www.npmjs.com/package/react-hook-use-prevent-leave) 從打包到發佈時使用的設定
- 關於目前使用的進版（package.json version）規律小記

## 版本與環境

```
rollup: 2.77.0
@rollup/plugin-node-resolve: 13.3.0
@rollup/plugin-typescript: 8.3.3
rollup-plugin-dts: 4.2.2
rollup-plugin-terser: 7.0.2
```

## 筆記

### package.json 設定

> code: [https://github.com/tzynwang/react-hook-use-prevent-leave/blob/master/package.json](https://github.com/tzynwang/react-hook-use-prevent-leave/blob/master/package.json)

- name 與 version：如果打算把套件發佈到 npm 上，這兩個是必填欄位，且 name 不可重複；官方文件建議發佈前可先在 [https://www.npmjs.com/](https://www.npmjs.com/) 查詢目前是否有撞名的套件
- main：套件的入口
  - 假設某套件 `a-package` 的 package.json/main 設定為 `dist/index.js`
  - 則在執行 `import XXX from 'a-package'` 時，等同載入 `a-package/dist/index.js` 的內容
- repository：可在此欄位註記原始碼的 repo url
- devDependencies：
  - 本次發佈的 `usePreventLeave` 套件僅有在開發時需要引用到 `react` ， `typescript` 與 `rollup.js`
  - 上傳到 npm 並被其他使用者下載後，預期此套件的使用者會在專案自行安裝 `react` （或 `typescript` ，如果需要的話）
  - 因此，在透過 `rollup.js` 打包時要將這些「不需要透過 `usePreventLeave` 提供的套件」排除，故這些僅有在開發時需要用到的套件都會被歸納在 devDependencies 類別中
- scripts：以本次發佈的 `react-hook-use-prevent-leave` 為例
  - `"rollup": "rm -rf dist && rollup -c"` 先移除既有的 dist 資料夾，再透過 rollup.js 進行打包，加上 `-c` 代表打包時需使用位在根目錄的 `rollup.config.json` 設定檔
  - `"prepublishOnly": "npm run rollup"` 代表在終端機執行 `npm publish` 時，要先進行 `npm run rollup` 再跑 `npm publish`
  - 白話文：在發佈套件前，先移除前一次打包產生的舊 dist 資料夾，再透過 rollup.js 打包，最後把打包好的內容發佈到 npm

### rollup.config.json 設定

> code: [https://github.com/tzynwang/react-hook-use-prevent-leave/blob/master/rollup.config.js](https://github.com/tzynwang/react-hook-use-prevent-leave/blob/master/rollup.config.js)

- 第 10 行：指定打包的入口為 `src/index.ts`
- 第 13 行：指定打包完的檔案路徑參考 package.json 中的 main
- 第 14 行：設定打包格式為 `esm`
- 第 18 行：typescript 設定參考根目錄的 `tsconfig.json` 內容，並配合 `terser()` 來進行檔案壓縮（移除檔案內的空白等）
- 第 19 行：打包時需要排除的 peer dependencies ， `external: ['react']` 即是「打包時請略過 `react` 這個套件」；完整解說可參考 [rollup.js Peer dependencies](https://rollupjs.org/guide/en/#peer-dependencies)
- 第 22 - 24 行：根據 `dist/types/index.d.ts` 在套件的根目錄產生 `dist/index.d.ts` 檔案

### tsconfig.json 設定

> code: [https://github.com/tzynwang/react-hook-use-prevent-leave/blob/master/tsconfig.json](https://github.com/tzynwang/react-hook-use-prevent-leave/blob/master/tsconfig.json)

- 第 16 行：指定 jsx 如何編譯，參考 [TSConfig Reference: JSX](https://www.typescriptlang.org/tsconfig#jsx)
- 第 27 與 29 行：指定 module 的解析方式，（根據 TSConfig Reference 文件）調整 `module` 設定會連帶影響 `moduleResolution` ；在專案僅支援 esm 的情況下，其實是設定 `module: esnext` 搭配 `moduleResolution: nodenext` 即可
- 第 50 行：在這邊宣告 rollup.config.json 打包後的檔案位置（`dist` 資料夾）

### 進版規律

> 版本號範例：A.B.C

- 發佈新版本時若沒有任何 feature 要素（僅處理 performance 等），進最小版號 C
- 若是因為有新的 features 而發佈新版本時，更新中間的版號 B，並最小版號 C 歸零
- 最大的版號 A：因應大規模改版，比如 React 的 17 → 18 版本

## 參考文件

- [npm Docs: package.json](https://docs.npmjs.com/cli/v8/configuring-npm/package-json)
- [TypeScript: Writing a Configuration File](https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html#writing-a-configuration-file)
- [TSConfig Reference](https://www.typescriptlang.org/tsconfig)
