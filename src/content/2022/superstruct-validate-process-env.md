---
title: 2022 第14週 學習筆記：使用 superstruct 驗證 process.env 資料
date: 2022-04-08 17:07:56
tag:
- [React]
- [webpack]
---

## 總結

使用 `create-react-app` 建立 React APP 並執行 `npm run eject` 後，在 `config` 資料夾內的 `env.js` 會協助處理 `.env` 中帶有 `REACT_APP_` 關鍵字的環境變數，讓開發者可以在 React APP 中讀取 process.env 內容；而如果開發者想要檢驗 process.env 的 schema 並將環境變數由字串型態轉變回布林、數值等資料形式的話，可以搭配 npm package `superstruct` 來實現

目前未解明：為何投入 `webpack.DefinePlugin` 後「沒有 `REACT_APP_` 前綴的環境變數」依舊可以保留字串以外的資料型態 🤔

## 版本與環境

```
superstruct: 0.15.4
webpack: 5.64.4
```

## 筆記

### 使用 superstruct 的優點

- 除了驗證資料型態（字串、布林、數值等）是否正確，也可檢查資料結構是否符合預期（指定的鍵值是否皆有出現）
- 提供型別轉換的功能
- 支援 typescript，定義好的 schema 可挪作 type/interface 使用（本次未使用）

### 實作想法梳理

- **不**將 process.env 的資料檢驗與型別轉換實作在 `config/env.js` 中，因環境變數最後還是會送至 `config/webpack.config.js` 中的 `webpack.DefinePlugin` 轉換回純字串資料
- 將 process.env 執行型別轉換後的資料保存在 `class Env` 中，令 process.env 保持字串形式，而在「需要在 React APP 中引用環境變數」時，就從 `class Env` 取用已經進行型別轉換後的資料

### 原始碼

<script src="https://gist.github.com/tzynwang/02bc3b826d291932f2e322ef5b7b0b29.js"></script>

示範專案 repo：[https://github.com/tzynwang/react-process-env/tree/feature/superstruct](https://github.com/tzynwang/react-process-env/tree/feature/superstruct)

- `src.Model.Env.index.ts`
  - 第 16~22 行：加上 `!` 迴避 ts 檢查後回報 `Property '...' has no initializer and is not definitely assigned in the constructor` 的問題
  - 第 32 行：使用 `define` 提供 superstruct 自訂義的資料型別
  - 第 33 行：使用 `type` 允許 process.env 中出現 schema 沒有定義到的鍵值（因 config/env.js 除了回傳帶有 `REACT_APP_` 的環境變數外，也會納入其他變數內容）；如果資料結構需完全符合定義好的 schema 則可以使用 `object` 來進行檢查（會在出現額外的鍵值時直接 throw Error）
  - 第 44 行：使用 `create` 建立型別轉換後的環境變數物件，若 process.env 中有不符合 schema 定義的資料內容，在這階段就會 throw Error
  - 第 47~54 行：將檢驗後的環境變數保存到 `class Env` 中
- `src.Hook.useEnv.tsx`
  - 建立該 React APP 中的唯一 `Env` 實例（singleton pattern）
- `src.App.tsx`
  - 第 12 行：透過 useEnv 取得 React APP 中的唯一 `Env` 實例

## 參考文件

- [GitHub: Superstruct](https://github.com/ianstormtaylor/superstruct#readme)
- [Superstruct Documentation](https://docs.superstructjs.org/)
- [stackoverflow: Property '...' has no initializer and is not definitely assigned in the constructor](https://stackoverflow.com/questions/49699067/property-has-no-initializer-and-is-not-definitely-assigned-in-the-construc)
